// @ts-check
import tsParser from '@typescript-eslint/parser';

/**
@import {Linter} from 'eslint';
*/

const CODEBLOCK_REGEX = /(?<openingFence>(?<indent>^[ \t]*)```(?:ts|typescript)?\n)(?<code>[\s\S]*?)\n\s*```/gm;
/** @type {Map<string, {lineOffset: number, columnOffset: number, characterOffset: number, cumulativeIndentSizePerLine: number[]}[]>} */
const jsdocDataPerFile = new Map();

export const jsdocCodeblocksProcessor = {
	supportsAutofix: true,

	/**
	@param {string} text
	@param {string} filename
	@returns {(string | Linter.ProcessorFile)[]}
    */
	preprocess(text, filename) {
		const ast = tsParser.parse(text);

		const jsdocComments = ast.comments.filter(
			comment => comment.type === 'Block' && comment.value.startsWith('*'),
		);

		/** @type {(string | Linter.ProcessorFile)[]} */
		const files = [text]; // First entry is for the entire file
		const allCodeblocksData = [];

		// Loop over all JSDoc comments in the file
		for (const comment of jsdocComments) {
			// Loop over all codeblocks in the JSDoc comment
			for (const match of comment.value.matchAll(CODEBLOCK_REGEX)) {
				const {code, openingFence, indent} = match.groups ?? {};

				// Skip empty code blocks
				if (!code || !openingFence || indent === undefined) {
					continue;
				}

				const codeLines = code.split('\n');
				const indentSize = indent.length;

				// Skip comments that are not consistently indented
				if (!codeLines.every(line => line === '*' || line === '' || line.startsWith(indent))) {
					continue;
				}

				const indentSizePerLine = codeLines.map(line => line === '' ? 0 : indentSize);
				/** @type number[] */
				const cumulativeIndentSizePerLine = [];
				for (const size of indentSizePerLine) {
					const last = cumulativeIndentSizePerLine.length > 0 ? cumulativeIndentSizePerLine.at(-1) ?? 0 : 0;
					cumulativeIndentSizePerLine.push(last + size);
				}

				const linesBeforeMatch = comment.value.slice(0, match.index).split('\n').length - 1;
				allCodeblocksData.push({
					lineOffset: comment.loc.start.line + linesBeforeMatch,
					columnOffset: indentSize,
					characterOffset: comment.range[0] + match.index + openingFence.length + 2,
					cumulativeIndentSizePerLine,
				});

				const dedentedCode = codeLines
					.map(line => line.slice(indentSize))
					.join('\n');

				files.push({
					text: dedentedCode,
					filename: `${files.length}.ts`, // Final filename example: `/path/to/type-fest/source/and.d.ts/1_1.ts`
				});
			}
		}

		jsdocDataPerFile.set(filename, allCodeblocksData);

		return files;
	},

	/**
	@param {import('eslint').Linter.LintMessage[][]} messages
	@param {string} filename
	*/
	postprocess(messages, filename) {
		const codeblocks = jsdocDataPerFile.get(filename) || [];
		jsdocDataPerFile.delete(filename);

		const normalizedMessages = [...(messages[0] ?? [])]; // First entry contains errors for the entire file, and it doesn't need any adjustments

		for (const [index, codeblockMessages] of messages.slice(1).entries()) {
			const codeblockData = codeblocks[index];

			if (!codeblockData) {
				// This should ideally never happen
				continue;
			}

			const {lineOffset, columnOffset, characterOffset, cumulativeIndentSizePerLine} = codeblockData;

			for (const message of codeblockMessages) {
				const adjustedMessage = {...message};

				adjustedMessage.line += lineOffset;
				adjustedMessage.column += columnOffset;

				if (typeof adjustedMessage.endColumn === 'number' && adjustedMessage.endColumn > 1) {
					// An `endColumn` of `1` indicates the error actually ended on the previous line since it's exclusive.
					// So, adding `columnOffset` in this case would incorrectly move the error marker into the indentation.
					// Therefore, the offset is only added when `endColumn` is greater than `1`.
					adjustedMessage.endColumn += columnOffset;
				}

				if (typeof adjustedMessage.endLine === 'number') {
					adjustedMessage.endLine += lineOffset;
				}

				if (adjustedMessage.fix) {
					const cumulativeIndentSize = cumulativeIndentSizePerLine[message.line - 1] ?? 0;
					adjustedMessage.fix.range = [
						adjustedMessage.fix.range[0] + characterOffset + cumulativeIndentSize,
						adjustedMessage.fix.range[1] + characterOffset + cumulativeIndentSize,
					];
				}

				for (const {fix} of (adjustedMessage.suggestions ?? [])) {
					const cumulativeIndentSize = cumulativeIndentSizePerLine[message.line - 1] ?? 0;
					fix.range = [
						fix.range[0] + characterOffset + cumulativeIndentSize,
						fix.range[1] + characterOffset + cumulativeIndentSize,
					];
				}

				normalizedMessages.push(adjustedMessage);
			}
		}

		return normalizedMessages;
	},
};
