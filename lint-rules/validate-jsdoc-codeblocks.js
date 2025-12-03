/* eslint-disable max-depth */
import path from 'node:path';
import ts from 'typescript';
import {createFSBackedSystem, createVirtualTypeScriptEnvironment} from '@typescript/vfs';

const CODEBLOCK_REGEX = /(?<openingFence>```(?:ts|typescript)?\n)(?<code>[\s\S]*?)```/g;
const FILENAME = 'example-codeblock.ts';
const TWOSLASH_COMMENT = '//=>';

const compilerOptions = {
	lib: ['lib.es2023.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
	target: ts.ScriptTarget.ESNext,
	module: ts.ModuleKind.Node20,
	moduleResolution: ts.ModuleResolutionKind.Node16,
	strict: true,
	noImplicitReturns: true,
	noImplicitOverride: true,
	noUnusedLocals: false, // This is intentionally disabled
	noUnusedParameters: true,
	noFallthroughCasesInSwitch: true,
	noUncheckedIndexedAccess: true,
	noPropertyAccessFromIndexSignature: true,
	noUncheckedSideEffectImports: true,
	useDefineForClassFields: true,
	exactOptionalPropertyTypes: true,
};

const virtualFsMap = new Map();
virtualFsMap.set(FILENAME, '// Can\'t be empty');

const rootDir = path.join(import.meta.dirname, '..');
const system = createFSBackedSystem(virtualFsMap, rootDir, ts);
const env = createVirtualTypeScriptEnvironment(system, [FILENAME], ts, compilerOptions);

export const validateJSDocCodeblocksRule = /** @type {const} */ ({
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Ensures JSDoc example codeblocks don\'t have errors',
		},
		fixable: 'code',
		messages: {
			invalidCodeblock: '{{errorMessage}}',
			typeMismatch: 'Expected type `{{expectedType}}` but found `{{actualType}}`.',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		const filename = context.filename.replaceAll('\\', '/');

		// Skip internal files
		if (filename.includes('/internal/')) {
			return {};
		}

		try {
			env.updateFile(context.filename, context.sourceCode.getText());
		} catch {
			// Ignore
		}

		return {
			TSTypeAliasDeclaration(node) {
				const {parent} = node;

				// Skip if type is not exported or starts with an underscore (private/internal)
				if (parent.type !== 'ExportNamedDeclaration' || node.id.name.startsWith('_')) {
					return;
				}

				const previousNodes = [context.sourceCode.getTokenBefore(parent, {includeComments: true})];

				// Handle JSDoc blocks for options
				if (node.id.name.endsWith('Options') && node.typeAnnotation.type === 'TSTypeLiteral') {
					for (const member of node.typeAnnotation.members) {
						previousNodes.push(context.sourceCode.getTokenBefore(member, {includeComments: true}));
					}
				}

				for (const previousNode of previousNodes) {
					// Skip if previous node is not a JSDoc comment
					if (!previousNode || previousNode.type !== 'Block' || !previousNode.value.startsWith('*')) {
						continue;
					}

					const comment = previousNode.value;

					for (const match of comment.matchAll(CODEBLOCK_REGEX)) {
						const {code, openingFence} = match.groups ?? {};

						// Skip empty code blocks
						if (!code || !openingFence) {
							continue;
						}

						const matchOffset = match.index + openingFence.length + 2; // Add `2` because `comment` doesn't include the starting `/*`
						const codeStartIndex = previousNode.range[0] + matchOffset;

						env.updateFile(FILENAME, code);
						const syntacticDiagnostics = env.languageService.getSyntacticDiagnostics(FILENAME);
						const semanticDiagnostics = env.languageService.getSemanticDiagnostics(FILENAME);
						const diagnostics = syntacticDiagnostics.length > 0 ? syntacticDiagnostics : semanticDiagnostics; // Show semantic errors only if there are no syntactic errors

						for (const diagnostic of diagnostics) {
							// If diagnostic location is not available, report on the entire code block
							const diagnosticStart = codeStartIndex + (diagnostic.start ?? 0);
							const diagnosticEnd = diagnosticStart + (diagnostic.length ?? code.length);

							context.report({
								loc: {
									start: context.sourceCode.getLocFromIndex(diagnosticStart),
									end: context.sourceCode.getLocFromIndex(diagnosticEnd),
								},
								messageId: 'invalidCodeblock',
								data: {
									errorMessage: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
								},
							});
						}

						const sourceFile = env.languageService.getProgram().getSourceFile(FILENAME);
						const lines = code.split('\n');

						for (const [index, line] of lines.entries()) {
							const trimmedLine = line.trim();
							if (!trimmedLine.startsWith(TWOSLASH_COMMENT)) {
								continue;
							}

							const previousLineIndex = index - 1;
							if (previousLineIndex < 0) {
								continue;
							}

							const lineWithoutTwoslash = trimmedLine.replace(TWOSLASH_COMMENT, '');
							const delimiter = lineWithoutTwoslash.startsWith(' ') ? ' ' : '';
							let actualType = lineWithoutTwoslash.slice(delimiter.length);
							let actualTypeEndLine = index;

							for (let i = index + 1; i < lines.length; i++) {
								const nextLine = lines[i].trim();
								if (!nextLine.startsWith('//' + delimiter) || nextLine.startsWith(TWOSLASH_COMMENT)) {
									break;
								}

								actualType += '\n' + nextLine.replace('//' + delimiter, '');
								actualTypeEndLine = i;
							}

							const previousLine = lines[previousLineIndex];
							const previousLineOffset = sourceFile.getPositionOfLineAndCharacter(previousLineIndex, 0);

							for (let i = 0; i < previousLine.length; i++) {
								const quickInfo = env.languageService.getQuickInfoAtPosition(FILENAME, previousLineOffset + i);

								if (quickInfo) {
									const display = ts.displayPartsToString(quickInfo.displayParts);
									const expectedType = display.replace(/^(?:type|interface|class|enum|const|let|var|function)\s+.*?\s*[:=]\s+/, '');

									if (actualType !== expectedType) {
										const commentIndex = line.indexOf(TWOSLASH_COMMENT);
										const indentation = line.slice(0, commentIndex);
										const actualTypeIndex = commentIndex + TWOSLASH_COMMENT.length + delimiter.length;

										const actualTypeStartOffset = sourceFile.getPositionOfLineAndCharacter(index, actualTypeIndex);
										const actualTypeEndOffset = sourceFile.getPositionOfLineAndCharacter(actualTypeEndLine, lines[actualTypeEndLine].length);

										const start = codeStartIndex + actualTypeStartOffset;
										const end = codeStartIndex + actualTypeEndOffset;

										context.report({
											loc: {
												start: context.sourceCode.getLocFromIndex(start),
												end: context.sourceCode.getLocFromIndex(end),
											},
											messageId: 'typeMismatch',
											data: {
												expectedType,
												actualType,
											},
											fix(fixer) {
												return fixer.replaceTextRange([start, end], expectedType.replaceAll('\n', `\n${indentation}//${delimiter}`));
											},
										});
									}

									break;
								}
							}
						}
					}
				}
			},
		};
	},
});
