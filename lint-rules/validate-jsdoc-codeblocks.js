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

function getJSDocNode(sourceCode, node) {
	let previousToken = sourceCode.getTokenBefore(node, {includeComments: true});

	// Skip over any line comments immediately before the node
	while (previousToken && previousToken.type === 'Line') {
		previousToken = sourceCode.getTokenBefore(previousToken, {includeComments: true});
	}

	if (previousToken && previousToken.type === 'Block' && previousToken.value.startsWith('*')) {
		return previousToken;
	}

	return undefined;
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
			defaultEnv.updateFile(context.filename, context.sourceCode.getText());
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

				const previousNodes = [];
				const jsdocForExport = getJSDocNode(context.sourceCode, parent);
				if (jsdocForExport) {
					previousNodes.push(jsdocForExport);
				}

				// Handle JSDoc blocks for options
				if (node.id.name.endsWith('Options') && node.typeAnnotation.type === 'TSTypeLiteral') {
					for (const member of node.typeAnnotation.members) {
						const jsdocForMember = getJSDocNode(context.sourceCode, member);
						if (jsdocForMember) {
							previousNodes.push(jsdocForMember);
						}
					}
				}

				for (const previousNode of previousNodes) {
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
								// Create a new environment with overridden options
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

						if (diagnostics.length === 0) {
							validateTwoslashTypes(context, env, code, codeStartIndex);
						}
					}
				}
			},
		};
	},
});

function extractTypeFromQuickInfo(quickInfo) {
	const {displayParts} = quickInfo;

	// For interfaces and enums, return everything after the keyword
	const keywordIndex = displayParts.findIndex(
		part => part.kind === 'keyword' && ['interface', 'enum'].includes(part.text),
	);

	if (keywordIndex !== -1) {
		return displayParts.slice(keywordIndex + 1).map(part => part.text).join('').trim();
	}

	let depth = 0;
	const separatorIndex = displayParts.findIndex(part => {
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

	// If `separatorIndex` is `-1` (not found), return the entire thing
	return displayParts.slice(separatorIndex + 1).map(part => part.text).join('').trim();
}

function normalizeUnions(type) {
	const sourceFile = ts.createSourceFile(
		'twoslash-type.ts',
		`declare const test: ${type};`,
		ts.ScriptTarget.Latest,
	);

	const typeNode = sourceFile.statements[0].declarationList.declarations[0].type;

	const print = node => ts.createPrinter().printNode(ts.EmitHint.Unspecified, node, sourceFile);
	const isNumeric = v => v.trim() !== '' && Number.isFinite(Number(v));

	const visit = node => {
		node = ts.visitEachChild(node, visit, undefined);

		if (ts.isUnionTypeNode(node)) {
			const types = node.types
				.map(t => [print(t), t])
				.sort(([a], [b]) =>
					// Numbers are sorted only wrt other numbers
					isNumeric(a) && isNumeric(b) ? Number(a) - Number(b) : 0,
				)
				.map(t => t[1]);

			return ts.factory.updateUnionTypeNode(
				node,
				ts.factory.createNodeArray(types),
			);
		}

		// Prefer single-line formatting for tuple types
		if (ts.isTupleTypeNode(node)) {
			const updated = ts.factory.createTupleTypeNode(node.elements);
			ts.setEmitFlags(updated, ts.EmitFlags.SingleLine);
			return updated;
		}

		// Replace double-quoted string literals with single-quoted ones
		if (ts.isStringLiteral(node)) {
			const updated = ts.factory.createStringLiteral(node.text, true);
			// Preserve non-ASCII characters like emojis.
			ts.setEmitFlags(updated, ts.EmitFlags.NoAsciiEscaping);
			return updated;
		}

		return node;
	};

	return print(visit(typeNode)).replaceAll(/^( +)/gm, indentation => {
		// Replace spaces used for indentation with tabs
		const spacesPerTab = 4;
		const tabCount = Math.floor(indentation.length / spacesPerTab);
		const remainingSpaces = indentation.length % spacesPerTab;
		return '\t'.repeat(tabCount) + ' '.repeat(remainingSpaces);
	});
}

function validateTwoslashTypes(context, env, code, codeStartIndex) {
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

			if (quickInfo?.displayParts) {
				let expectedType = normalizeUnions(extractTypeFromQuickInfo(quickInfo));

				if (expectedType.length < 80) {
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
