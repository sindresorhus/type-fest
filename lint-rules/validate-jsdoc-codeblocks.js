/* eslint-disable complexity */
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
const defaultEnv = createVirtualTypeScriptEnvironment(system, [FILENAME], ts, compilerOptions);

function parseCompilerOptions(code) {
	const options = {};
	const lines = code.split('\n');

	for (const line of lines) {
		if (!line.trim()) {
			// Skip empty lines
			continue;
		}

		const match = line.match(/^\s*\/\/ @(\w+): (.*)$/);
		if (!match) {
			// Stop parsing at the first non-matching line
			return options;
		}

		const [, key, value] = match;
		const trimmedValue = value.trim();

		try {
			options[key] = JSON.parse(trimmedValue);
		} catch {
			options[key] = trimmedValue;
		}
	}

	return options;
}

export const validateJSDocCodeblocksRule = /** @type {const} */ ({
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Ensures JSDoc example codeblocks don\'t have errors',
		},
		fixable: 'code',
		messages: {
			invalidCodeblock: '{{errorMessage}}',
			typeMismatch: 'Expected twoslash comment to be: {{expectedComment}}, but found: {{actualComment}}',
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

						const overrides = parseCompilerOptions(code);
						let env = defaultEnv;

						if (Object.keys(overrides).length > 0) {
							const {options, errors} = ts.convertCompilerOptionsFromJson(overrides, rootDir);

							if (errors.length === 0) {
								// Create a new enviroment with overridden options
								env = createVirtualTypeScriptEnvironment(system, [FILENAME], ts, {...compilerOptions, ...options});
							}
						}

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

						// Skip type mismatch checks if there are diagnostic errors
						if (diagnostics.length > 0) {
							continue;
						}

						const sourceFile = env.languageService.getProgram().getSourceFile(FILENAME);
						const lines = code.split('\n');

						for (const [index, line] of lines.entries()) {
							const dedentedLine = line.trimStart();
							if (!dedentedLine.startsWith(TWOSLASH_COMMENT)) {
								continue;
							}

							const previousLineIndex = index - 1;
							if (previousLineIndex < 0) {
								continue;
							}

							let actualComment = dedentedLine;
							let actualCommentEndLine = index;

							for (let i = index + 1; i < lines.length; i++) {
								const dedentedNextLine = lines[i].trimStart();
								if (!dedentedNextLine.startsWith('//') || dedentedNextLine.startsWith(TWOSLASH_COMMENT)) {
									break;
								}

								actualComment += '\n' + dedentedNextLine;
								actualCommentEndLine = i;
							}

							const previousLine = lines[previousLineIndex];
							const previousLineOffset = sourceFile.getPositionOfLineAndCharacter(previousLineIndex, 0);

							for (let i = 0; i < previousLine.length; i++) {
								const quickInfo = env.languageService.getQuickInfoAtPosition(FILENAME, previousLineOffset + i);

								if (quickInfo) {
									let depth = 0;
									const separatorIndex = quickInfo.displayParts.findIndex(part => {
										if (part.kind === 'punctuation') {
											if (['(', '{', '<'].includes(part.text)) {
												depth++;
											} else if ([')', '}', '>'].includes(part.text)) {
												depth--;
											} else if (part.text === ':' && depth === 0) {
												return true;
											}
										} else if (part.kind === 'operator' && part.text === '=' && depth === 0) {
											return true;
										}

										return false;
									});

									let partsToUse = quickInfo.displayParts;
									if (separatorIndex !== -1) {
										partsToUse = quickInfo.displayParts.slice(separatorIndex + 1);
									}

									let expectedType = partsToUse.map((part, index) => {
										const {kind, text} = part;

										// Replace spaces used for indentation with tabs
										const previousPart = partsToUse[index - 1];
										if (kind === 'space' && (index === 0 || previousPart?.kind === 'lineBreak')) {
											return text.replaceAll('    ', '\t');
										}

										// Replace double-quoted string literals with single-quoted ones
										if (kind === 'stringLiteral' && text.startsWith('"') && text.endsWith('"')) {
											return `'${text.slice(1, -1).replaceAll(String.raw`\"`, '"').replaceAll('\'', String.raw`\'`)}'`;
										}

										return text;
									}).join('').trim();

									if (expectedType.length < 50) {
										expectedType = expectedType
											.replaceAll(/\r?\n\s*/g, ' ') // Collapse into single line
											.replaceAll(/{\s+/g, '{') // Remove spaces after `{`
											.replaceAll(/\s+}/g, '}') // Remove spaces before `}`
											.replaceAll(/;(?=})/g, ''); // Remove semicolons before `}`
									}

									const expectedComment = TWOSLASH_COMMENT + ' ' + expectedType.replaceAll('\n', '\n// ');

									if (actualComment !== expectedComment) {
										const actualCommentIndex = line.indexOf(TWOSLASH_COMMENT);

										const actualCommentStartOffset = sourceFile.getPositionOfLineAndCharacter(index, actualCommentIndex);
										const actualCommentEndOffset = sourceFile.getPositionOfLineAndCharacter(actualCommentEndLine, lines[actualCommentEndLine].length);

										const start = codeStartIndex + actualCommentStartOffset;
										const end = codeStartIndex + actualCommentEndOffset;

										context.report({
											loc: {
												start: context.sourceCode.getLocFromIndex(start),
												end: context.sourceCode.getLocFromIndex(end),
											},
											messageId: 'typeMismatch',
											data: {
												expectedComment,
												actualComment,
											},
											fix(fixer) {
												const indent = line.slice(0, actualCommentIndex);

												return fixer.replaceTextRange(
													[start, end],
													expectedComment.replaceAll('\n', `\n${indent}`),
												);
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
