// @ts-check
import tsParser from '@typescript-eslint/parser';

/**
@import {Linter} from 'eslint';
*/

const CODEBLOCK_REGEX = /(?<openingFence>(?<indent>^[\t ]*)```(?:ts|typescript)?\n)(?<code>[\s\S]*?)\n[\t ]*```/gmv;
/**
@typedef {{lineOffset: number, characterOffset: number, indent: string, unindentedText: string}} CodeblockData
@type {Map<string, CodeblockData[]>}
*/
const codeblockDataPerFile = new Map();

/**
Returns the total length of the indentation that was removed from the lines of `text` up to `index`.

@param {string} text - The original indented code.
@param {number} index - The position in the dedented code.
@param {string} indent - The indentation removed from each non-empty line.
@returns {number} The number of indentation characters before `index`.
*/
function indentsUptoIndex(text, index, indent) {
	let i = 0;
	let indents = 0;

	for (const line of text.split('\n')) {
		if (i > index) {
			break;
		}

		if (line === '') {
			i += 1; // +1 for the newline
			continue;
		}

		i += line.length + 1; // +1 for the newline
		i -= indent.length; // Because `text` is unindented but `index` corresponds to dedented text
		indents += indent.length;
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
		const matches = jsdocComments.flatMap(comment => comment.value.matchAll(CODEBLOCK_REGEX).map(match => ({comment, match})).toArray());

		for (const {comment, match} of matches) {
			const {code, openingFence, indent} = match.groups ?? {};

			// Skip empty code blocks
			if (!code || !openingFence || indent === undefined) {
				continue;
			}

			const codeLines = code.split('\n');
			const indentSize = indent.length;

			// Skip comments that are not consistently indented
			if (codeLines.some(line => line !== '' && !line.startsWith(indent))) {
				continue;
			}

			const dedentedCode = codeLines
				.map(line => line.slice(indentSize))
				.join('\n');

			files.push({
				text: dedentedCode,
				filename: `${files.length}.ts`, // Final filename example: `/path/to/type-fest/source/and.d.ts/1_1.ts`
			});

			const linesBeforeMatch = comment.value.slice(0, match.index).split('\n').length - 1;
			allCodeblocksData.push({
				lineOffset: comment.loc.start.line + linesBeforeMatch,
				characterOffset: comment.range[0] + match.index + openingFence.length + 2, // +2 because `comment.value` doesn't include the starting `/*`
				indent,
				unindentedText: code,
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

			const {lineOffset, characterOffset, indent, unindentedText} = codeblockData;

			for (const message of codeblockMessages) {
				message.line += lineOffset;
				message.column += indent.length;

				if (typeof message.endColumn === 'number' && message.endColumn > 1) {
					// An `endColumn` of `1` indicates the error actually ended on the previous line since it's exclusive.
					// So, adding `indent.length` in this case would incorrectly move the error marker into the indentation.
					// Therefore, the indentation length is only added when `endColumn` is greater than `1`.
					message.endColumn += indent.length;
				}

				if (typeof message.endLine === 'number') {
					message.endLine += lineOffset;
				}

				if (message.fix) {
					message.fix.text = message.fix.text.split('\n').join(`\n${indent}`);

					const indentsBeforeFixStart = indentsUptoIndex(unindentedText, message.fix.range[0], indent);
					const indentsBeforeFixEnd = indentsUptoIndex(unindentedText, message.fix.range[1] - 1, indent); // -1 because range end is exclusive

					message.fix.range = [
						message.fix.range[0] + characterOffset + indentsBeforeFixStart,
						message.fix.range[1] + characterOffset + indentsBeforeFixEnd,
					];
				}

				for (const {fix} of (message.suggestions ?? [])) {
					fix.text = fix.text.split('\n').join(`\n${indent}`);

					const indentsBeforeFixStart = indentsUptoIndex(unindentedText, fix.range[0], indent);
					const indentsBeforeFixEnd = indentsUptoIndex(unindentedText, fix.range[1] - 1, indent); // -1 because range end is exclusive

					fix.range = [
						fix.range[0] + characterOffset + indentsBeforeFixStart,
						fix.range[1] + characterOffset + indentsBeforeFixEnd,
					];
				}

				normalizedMessages.push(message);
			}
		}

		return normalizedMessages;
	},
};
