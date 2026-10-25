import path from 'node:path';
import ts from 'typescript';
import {createFSBackedSystem, createVirtualTypeScriptEnvironment} from '@typescript/vfs';
import {getCodeblocks} from './codeblocks.js';

const FILENAME = 'example-codeblock.ts';
const TWOSLASH_COMMENT = '//=>';
const typePrinter = ts.createPrinter();

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

const virtualFsMap = new Map([[FILENAME, '// Can\'t be empty']]);

const rootDir = path.join(import.meta.dirname, '..');
const system = createFSBackedSystem(virtualFsMap, rootDir, ts);
const defaultEnv = createVirtualTypeScriptEnvironment(system, [FILENAME], ts, compilerOptions);

function parseCompilerOptions(code) {
	const options = {};
	const lines = code.split(/\r?\n/v);

	for (const line of lines) {
		if (!line.trim()) {
			// Skip empty lines
			continue;
		}

		const match = line.match(/^\s*\/\/ @(?<key>\w+): (?<value>.*)$/v);
		if (!match) {
			// Stop parsing at the first non-matching line
			return options;
		}

		const {key, value} = match.groups;
		const trimmedValue = value.trim();

		try {
			options[key] = JSON.parse(trimmedValue);
		} catch {
			options[key] = trimmedValue;
		}
	}

	return options;
}

function getDeclarationMembers(node) {
	if (node.type === 'TSInterfaceDeclaration') {
		return node.body.body;
	}

	return node.typeAnnotation.type === 'TSTypeLiteral' ? node.typeAnnotation.members : [];
}

// Finds the declaration carrying an exported type's documentation, using binding references so exports in another scope cannot match by name.
function getExportedDeclaration(sourceCode, node) {
	if (['ExportNamedDeclaration', 'ExportDefaultDeclaration'].includes(node.parent.type)) {
		return node.parent;
	}

	const exported = sourceCode.getDeclaredVariables(node).some(variable => variable.references.some(reference => reference.identifier.parent.type === 'ExportSpecifier'));
	return exported ? node : undefined;
}

function getJSDocNode(sourceCode, node) {
	let previousToken = sourceCode.getTokenBefore(node, {includeComments: true});

	// Skip over any line comments immediately before the node
	while (previousToken && previousToken.type === 'Line') {
		previousToken = sourceCode.getTokenBefore(previousToken, {includeComments: true});
	}

	return previousToken && previousToken.type === 'Block' && previousToken.value.startsWith('*') ? previousToken : undefined;
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
			incorrectTwoslashType: 'Expected twoslash comment to be: {{expectedComment}}, but found: {{actualComment}}',
			incorrectTwoslashFormat: 'Expected twoslash comment to be: {{expectedComment}}, but found: {{actualComment}}',
		},
		schema: [{
			type: 'object',
			properties: {
				verbosityLevels: {
					type: 'array',
					uniqueItems: true,
					items: {
						minimum: 0,
						type: 'number',
					},
				},
			},
		}],
		/**
		@type {unknown[]}
		*/
		defaultOptions: [{
			verbosityLevels: [],
		}],
	},
	create(context) {
		const filename = context.filename.replaceAll('\\', '/');

		// Skip internal files
		if (filename.includes('/internal/')) {
			return {};
		}

		// Unlike `updateFile`, `createFile` cannot throw, because it also accepts a file that no example has loaded yet.
		defaultEnv.createFile(context.filename, context.sourceCode.getText());

		return {
			'TSTypeAliasDeclaration, TSInterfaceDeclaration'(node) {
				const declaration = getExportedDeclaration(context.sourceCode, node);

				// Skip if type is not exported or starts with an underscore (private/internal)
				if (!declaration || node.id.name.startsWith('_')) {
					return;
				}

				const previousNodes = [];
				const jsdocForExport = getJSDocNode(context.sourceCode, declaration);
				if (jsdocForExport) {
					previousNodes.push(jsdocForExport);
				}

				// Handle JSDoc blocks for options
				if (node.id.name.endsWith('Options')) {
					for (const member of getDeclarationMembers(node)) {
						const jsdocForMember = getJSDocNode(context.sourceCode, member);
						if (jsdocForMember) {
							previousNodes.push(jsdocForMember);
						}
					}
				}

				// All codeblocks in all JSDoc comments of the type
				// Fences occupy their own lines; inline backticks are part of the example.
				// Consume all fenced blocks before filtering languages, so ignored closing fences cannot become opening fences.
				const matches = previousNodes.flatMap(previousNode => getCodeblocks(previousNode.value).map(match => ({previousNode, match})).toArray());

				for (const {previousNode, match} of matches) {
					const {code, language} = match;

					// Skip empty code blocks and languages that are not TypeScript.
					if (!code || !['', 'ts', 'typescript'].includes(language.trim())) {
						continue;
					}

					const matchOffset = match.codeStart + 2; // Add `2` because `comment` doesn't include the starting `/*`
					const codeStartIndex = previousNode.range[0] + matchOffset;

					const overrides = parseCompilerOptions(code);
					let env = defaultEnv;

					if (Object.keys(overrides).length > 0) {
						const {options, errors} = ts.convertCompilerOptionsFromJson(overrides, rootDir);

						if (errors.length === 0) {
							try {
								// Create a new environment with overridden options
								env = createVirtualTypeScriptEnvironment(system, [FILENAME], ts, {...compilerOptions, ...options});
							} catch {
								// Invalid option combinations use the default environment, like invalid option values.
							}
						}
					}

					env.updateFile(FILENAME, code);
					const syntacticDiagnostics = env.languageService.getSyntacticDiagnostics(FILENAME);
					const diagnostics = syntacticDiagnostics.length > 0 ? syntacticDiagnostics : env.languageService.getSemanticDiagnostics(FILENAME); // Show semantic errors only if there are no syntactic errors

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
			},
		};
	},
});

function getLeftmostQuickInfos(env, line, lineOffset, verbosityLevels) {
	for (let i = line.length - line.trimStart().length; i < line.length; i++) {
		const position = lineOffset + i;
		const quickInfo = env.languageService.getQuickInfoAtPosition(FILENAME, position, undefined, verbosityLevels[0]);
		if (quickInfo?.displayParts) {
			return [quickInfo, ...verbosityLevels.slice(1).map(verbosity => env.languageService.getQuickInfoAtPosition(FILENAME, position, undefined, verbosity))]
				.filter(info => info?.displayParts);
		}
	}

	return [];
}

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
			} else if (depth === 0 && part.text === ':') {
				return true;
			}
		} else if (depth === 0 && part.kind === 'operator' && part.text === '=') {
			return true;
		}

		return false;
	});

	// If `separatorIndex` is `-1` (not found), return the entire thing
	return displayParts.slice(separatorIndex + 1).map(part => part.text).join('').trim();
}

function normalizeType(type, shouldOnlySortNumbers = false) {
	const sourceFile = ts.createSourceFile(
		'twoslash-type.ts',
		`declare const test: ${type};`,
		ts.ScriptTarget.Latest,
	);

	if (sourceFile.parseDiagnostics.length > 0) {
		return type.trim();
	}

	const typeNode = sourceFile.statements[0].declarationList.declarations[0].type;

	const print = node => typePrinter.printNode(ts.EmitHint.Unspecified, node, sourceFile);

	const isNumeric = v => v.trim() !== '' && Number.isFinite(Number(v));

	const visit = node => {
		node = ts.visitEachChild(node, visit, undefined);

		if (ts.isUnionTypeNode(node)) {
			let types = node.types.map(t => [print(t), t]);

			if (shouldOnlySortNumbers) {
				// Sort only numeric members while keeping non-numeric members at their original positions
				const sortedNumericTypes = types.filter(([a]) => isNumeric(a)).toSorted(([a], [b]) => Number(a) - Number(b));
				let numericIndex = 0;
				types = types.map(t => isNumeric(t[0]) ? sortedNumericTypes[numericIndex++][1] : t[1]);
			} else {
				types = types
					.toSorted(([a], [b]) => a < b ? -1 : (a > b ? 1 : 0))
					.map(t => t[1]);
			}

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

	return formatTypeText(print(visit(typeNode)), text => text.replaceAll(/(?<=\n) +/gv, indentation => {
		// Replace spaces used for indentation with tabs
		const spacesPerTab = 4;
		const tabCount = Math.floor(indentation.length / spacesPerTab);
		const remainingSpaces = indentation.length % spacesPerTab;
		return '\t'.repeat(tabCount) + ' '.repeat(remainingSpaces);
	}));
}

/**
Formats type syntax while preserving string and template literal contents.

@param {string} type - The printed type to format.
@param {(text: string) => string} format - Formats the text outside literals.
*/
function formatTypeText(type, format) {
	const prefix = 'type Expected = ';
	const sourceFile = ts.createSourceFile('twoslash-type.ts', prefix + type, ts.ScriptTarget.Latest);
	let position = prefix.length;
	let result = '';

	const visit = node => {
		if (ts.isStringLiteralLike(node) || ts.isTemplateLiteralTypeNode(node)) {
			result += format(sourceFile.text.slice(position, node.getStart(sourceFile))) + node.getText(sourceFile);
			position = node.end;
			return;
		}

		ts.forEachChild(node, visit);
	};

	visit(sourceFile);
	return result + format(sourceFile.text.slice(position));
}

function getCommentForType(type) {
	let comment = type;

	if (type.length < 80) {
		comment = formatTypeText(type, text => text
			.replaceAll(/\r?\n\s*/gv, ' ') // Collapse into single line
			.replaceAll(/\{\s+/gv, '{') // Remove spaces after `{`
			.replaceAll(/(?<!\s)\s+\}/gv, '}') // Remove spaces before `}`
			.replaceAll(/;(?=\})/gv, '')); // Remove semicolons before `}`
	}

	return `${TWOSLASH_COMMENT} ${comment.replaceAll('\n', '\n// ')}`;
}

function reportTypeMismatch({context, messageId, start, end, data, fix}) {
	context.report({
		loc: {
			start: context.sourceCode.getLocFromIndex(start),
			end: context.sourceCode.getLocFromIndex(end),
		},
		messageId,
		data,
		// A replacement must stay inside the JSDoc containing the example.
		fix: fix === undefined || fix.includes('*/') ? undefined : fixer => fixer.replaceTextRange([start, end], fix),
	});
}

function isTwoslashContinuationLine(line) {
	const dedentedLine = line.trimStart();
	return dedentedLine.startsWith('//') && !dedentedLine.startsWith(TWOSLASH_COMMENT);
}

// Inspect trivia at parsed token boundaries so comment-like text inside literals is never treated as a comment.
function getSingleLineCommentPositions(sourceFile) {
	const positions = new Set();

	const visit = node => {
		const children = node.getChildren(sourceFile);
		if (children.length === 0) {
			for (const comment of ts.getLeadingCommentRanges(sourceFile.text, node.getFullStart()) ?? []) {
				if (comment.kind === ts.SyntaxKind.SingleLineCommentTrivia) {
					positions.add(comment.pos);
				}
			}
		}

		for (const child of children) {
			visit(child);
		}
	};

	visit(sourceFile);
	return positions;
}

// Reads the twoslash comment that starts at the line `index`, with the continuation lines that belong to its type.
function readTwoslashComment(lines, index) {
	let endLine = index;
	while (endLine + 1 < lines.length && isTwoslashContinuationLine(lines[endLine + 1])) {
		endLine++;
	}

	const commentLines = lines.slice(index, endLine + 1).map(commentLine => commentLine.trimStart());
	const typeLines = [
		commentLines[0].slice(TWOSLASH_COMMENT.length),
		...commentLines.slice(1).map(commentLine => commentLine.slice(commentLine.startsWith('// ') ? 3 : 2)), // Remove the `//` prefix and its formatting space, preserving literal indentation.
	];
	const typeSource = ts.createSourceFile('twoslash-type.ts', `type Expected = ${typeLines.join('\n')}`, ts.ScriptTarget.Latest);
	const typeNode = typeSource.statements[0].type;
	// Validate whole lines because the replacement owns whole lines; parser recovery can stop inside prose after a dangling operator.
	const parsedType = ts.createSourceFile('twoslash-type.ts', typeSource.text.slice(0, typeSource.getLineEndOfPosition(typeNode.end)), ts.ScriptTarget.Latest);
	// Only complete syntax owns continuation lines; malformed multiline expectations are report-only.
	const isCompleteType = typeSource.getLineAndCharacterOfPosition(typeNode.getStart(typeSource)).line === 0
		&& parsedType.statements.length === 1
		&& parsedType.parseDiagnostics.length === 0;
	if (isCompleteType) {
		endLine = index + typeSource.getLineAndCharacterOfPosition(typeNode.end).line;
	}

	const ownedLineCount = endLine - index + 1;
	return {
		endLine,
		canFix: isCompleteType || endLine === index,
		comment: commentLines.slice(0, ownedLineCount).join('\n'),
		type: typeLines.slice(0, ownedLineCount).join('\n'),
	};
}

function validateTwoslashTypes(context, env, code, codeStartIndex) {
	if (!code.includes(TWOSLASH_COMMENT)) {
		return;
	}

	const sourceFile = env.languageService.getProgram().getSourceFile(FILENAME);
	const commentPositions = getSingleLineCommentPositions(sourceFile);
	const lines = code.split(/\r?\n/v);
	// Multiline fixes keep the line endings of the file.
	const lineBreak = code.includes('\r\n') ? '\r\n' : '\n';

	const specifiedVerbosityLevels = context.options[0].verbosityLevels;
	const verbosityLevels = [0, ...specifiedVerbosityLevels, Infinity]; // Keep `Infinity` last since suggestion logic relies on the order

	for (const [index, line] of lines.entries()) {
		const dedentedLine = line.trimStart();
		if (!dedentedLine.startsWith(TWOSLASH_COMMENT)) {
			continue;
		}

		const actualCommentIndex = line.indexOf(TWOSLASH_COMMENT);
		const actualCommentStartOffset = sourceFile.getPositionOfLineAndCharacter(index, actualCommentIndex);
		if (!commentPositions.has(actualCommentStartOffset)) {
			continue;
		}

		const previousLineIndex = index - 1;
		if (previousLineIndex < 0) {
			continue;
		}

		const {endLine: actualCommentEndLine, canFix, comment: actualComment, type: rawActualType} = readTwoslashComment(lines, index);

		const previousLine = lines[previousLineIndex];
		const previousLineOffset = sourceFile.getPositionOfLineAndCharacter(previousLineIndex, 0);

		const actualCommentEndOffset = sourceFile.getPositionOfLineAndCharacter(actualCommentEndLine, lines[actualCommentEndLine].length);

		const start = codeStartIndex + actualCommentStartOffset;
		const end = codeStartIndex + actualCommentEndOffset;

		const indent = line.slice(0, actualCommentIndex);

		const quickInfos = getLeftmostQuickInfos(env, previousLine, previousLineOffset, verbosityLevels);

		if (quickInfos.length === 0) {
			continue;
		}

		const expectedTypeTexts = quickInfos.map(info => extractTypeFromQuickInfo(info));
		const expectedTypes = new Map([...new Set(expectedTypeTexts)].map(type => [type, normalizeType(type)]));
		const actualType = expectedTypes.get(rawActualType.trim()) ?? normalizeType(rawActualType);

		const isTypeMatch = expectedTypes.values().toArray().includes(actualType);
		// If the types match, check for formatting errors and unordered numbers in unions
		// For suggestion, use infinite verbosity, and it should be the last one
		const expectedComment = getCommentForType(isTypeMatch ? normalizeType(rawActualType, true) : expectedTypes.get(expectedTypeTexts.at(-1)));

		if (!isTypeMatch || actualComment !== expectedComment) {
			reportTypeMismatch({
				messageId: isTypeMatch ? 'incorrectTwoslashFormat' : 'incorrectTwoslashType',
				context,
				start,
				end,
				data: {expectedComment, actualComment},
				fix: canFix ? expectedComment.split('\n').join(`${lineBreak}${indent}`) : undefined,
			});
		}
	}
}
