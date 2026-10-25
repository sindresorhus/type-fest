// @ts-check
import tsParser from '@typescript-eslint/parser';
import {getCodeblocks} from '../lint-rules/codeblocks.js';

/**
@import {Linter} from 'eslint';
*/

/**
@typedef {{lineOffset: number, characterOffset: number, indent: string, originalCode: string}} CodeblockData
@type {Map<string, CodeblockData[]>}
*/
const codeblockDataPerFile = new Map();

/**
Returns the total length of the indentation that was removed from the original lines up to `index`.

@param {string[]} lines - The original indented code lines.
@param {number} index - The position in the dedented code.
@param {string} indent - The indentation removed from lines with that prefix.
@returns {number} The number of indentation characters before `index`.
*/
function indentsUptoIndex(lines, index, indent) {
	if (indent.length === 0) {
		return 0;
	}

	let i = 0;
	let indents = 0;

	for (const line of lines) {
		if (i > index) {
			break;
		}

		const removedIndent = line.startsWith(indent) ? indent.length : 0;
		i += line.length + 1 - removedIndent; // +1 for the newline, minus the prefix removed from the original text
		indents += removedIndent;
	}

	return indents;
}

export const jsdocCodeblocksProcessor = {
	supportsAutofix: true,

	/**
	Extracts the code blocks in the JSDoc comments of the file as separate virtual files to lint.

	@param {string} text - The source text of the file.
	@param {string} filename - The path of the file.
	@returns {(string | Linter.ProcessorFile)[]} The source text of the file, followed by a virtual file for each code block.
	*/
	preprocess(text, filename) {
		if (!text.includes('/**') || !text.includes('```')) {
			codeblockDataPerFile.set(filename, []);
			return [text];
		}

		const ast = tsParser.parse(text);

		const jsdocComments = ast.comments.filter(
			comment => comment.type === 'Block' && comment.value.startsWith('*'),
		);

		/**
		@type {(string | Linter.ProcessorFile)[]}
		*/
		const files = [text]; // First entry is for the entire file
		/**
		@type {CodeblockData[]}
		*/
		const allCodeblocksData = [];

		// All codeblocks in all JSDoc comments in the file
		// Consume every fenced block before filtering languages, so an ignored closing fence cannot become an opening fence.
		const matches = jsdocComments.flatMap(comment => getCodeblocks(comment.value).map(match => ({comment, match})).toArray());

		for (const {comment, match} of matches) {
			const {indent, language} = match;
			// Virtual examples exclude the final line break before the closing fence, so a CRLF example does not end with a lone CR.
			const code = match.code.replace(/\r?\n$/v, '');

			// Skip empty code blocks and languages that are not TypeScript.
			if (!code || !['', 'ts', 'typescript'].includes(language.trim())) {
				continue;
			}

			const codeLines = code.split('\n');
			const indentSize = indent.length;

			// Skip comments that are not consistently indented
			if (codeLines.some(line => line.trim() !== '' && !line.startsWith(indent))) {
				continue;
			}

			const dedentedCode = codeLines
				.map(line => line.startsWith(indent) ? line.slice(indentSize) : line)
				.join('\n');

			files.push({
				text: dedentedCode,
				filename: `${files.length}.ts`, // Final filename example: `/path/to/type-fest/source/and.d.ts/1_1.ts`
			});

			const linesBeforeMatch = comment.value.slice(0, match.index).split('\n').length - 1;
			allCodeblocksData.push({
				lineOffset: comment.loc.start.line + linesBeforeMatch,
				characterOffset: comment.range[0] + match.codeStart + 2, // +2 because `comment.value` doesn't include the starting `/*`
				indent,
				originalCode: code,
			});
		}

		codeblockDataPerFile.set(filename, allCodeblocksData);

		return files;
	},

	/**
	Maps the lint messages of the virtual code block files back to their locations in the original file.

	@param {import('eslint').Linter.LintMessage[][]} messages - The lint messages for the file, followed by the lint messages for each code block.
	@param {string} filename - The path of the file.
	@returns {import('eslint').Linter.LintMessage[]} The lint messages with locations in the original file.
	*/
	postprocess(messages, filename) {
		const codeblocks = codeblockDataPerFile.get(filename) || [];
		codeblockDataPerFile.delete(filename);

		const normalizedMessages = [...(messages[0] ?? [])]; // First entry contains errors for the entire file, and it doesn't need any adjustments

		for (const [index, codeblockMessages] of messages.slice(1).entries()) {
			const codeblockData = codeblocks[index];

			if (!codeblockData) {
				// This should ideally never happen
				continue;
			}

			const {lineOffset, characterOffset, indent, originalCode} = codeblockData;
			const originalLines = indent.length > 0 && codeblockMessages.length > 0 ? originalCode.split('\n') : [];

			// Maps a fix onto the original file, or returns `undefined` when the mapped fix would close the JSDoc comment.
			const mapFixToOriginal = fix => {
				fix.text = fix.text.split('\n').join(`\n${indent}`);

				const indentsBeforeFixStart = indentsUptoIndex(originalLines, fix.range[0], indent);
				const indentsBeforeFixEnd = indentsUptoIndex(originalLines, fix.range[1], indent); // A virtual line starts after its removed indentation in the original source.

				let start = fix.range[0] + indentsBeforeFixStart;
				const end = fix.range[1] + indentsBeforeFixEnd;
				const lineStart = originalCode.slice(0, start).lastIndexOf('\n') + 1;
				if (!originalCode.startsWith(indent, lineStart)) {
					// A short blank line can become nonblank, so restore its structural prefix before re-extraction.
					fix.text = indent + originalCode.slice(lineStart, start) + fix.text;
					start = lineStart;
				}

				// The resulting code must not close its JSDoc, including a terminator joined at a replacement boundary.
				if ((originalCode.slice(0, start) + fix.text + originalCode.slice(end)).includes('*/')) {
					return;
				}

				fix.range = [start + characterOffset, end + characterOffset];
				return fix;
			};

			for (const message of codeblockMessages) {
				message.column += originalLines[message.line - 1]?.startsWith(indent) ? indent.length : 0;

				if (typeof message.endColumn === 'number' && message.endColumn > 1) {
					// An `endColumn` of `1` indicates the error actually ended on the previous line since it's exclusive.
					// So, adding `indent.length` in this case would incorrectly move the error marker into the indentation.
					// Therefore, the indentation length is only added when `endColumn` is greater than `1`.
					message.endColumn += originalLines[(message.endLine ?? message.line) - 1]?.startsWith(indent) ? indent.length : 0;
				}

				message.line += lineOffset;
				if (typeof message.endLine === 'number') {
					message.endLine += lineOffset;
				}

				message.fix &&= mapFixToOriginal(message.fix);
				message.suggestions &&= message.suggestions.filter(({fix}) => mapFixToOriginal(fix));

				normalizedMessages.push(message);
			}
		}

		return normalizedMessages;
	},
};
