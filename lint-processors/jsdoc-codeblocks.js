// @ts-check
import tsParser from '@typescript-eslint/parser';

/**
@import {Linter} from 'eslint';
*/

const CODEBLOCK_REGEX = /(?<openingFence>(?<indent>^[ \t]*)```(?:ts|typescript)?\n)(?<code>[\s\S]*?)\n\s*```/gm;
/** @type {Map<string, {lineOffset: number, characterOffset: number, indent: string, unindentedText: string}[]>} */
const jsdocDataPerFile = new Map();

/**
@param {string} text
@param {number} index
@param {string} indent
@returns {number}
*/
function indentsUptoIndex(text, index, indent) {
	if (index <= 0) {
		return 0;
	}

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
					characterOffset: comment.range[0] + match.index + openingFence.length + 2,
					indent,
					unindentedText: code,
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

			const {lineOffset, characterOffset, indent, unindentedText} = codeblockData;

			for (const message of codeblockMessages) {
				const adjustedMessage = {...message};

				adjustedMessage.line += lineOffset;
				adjustedMessage.column += indent.length;

				if (typeof adjustedMessage.endColumn === 'number' && adjustedMessage.endColumn > 1) {
					// An `endColumn` of `1` indicates the error actually ended on the previous line since it's exclusive.
					// So, adding `indent.length` in this case would incorrectly move the error marker into the indentation.
					// Therefore, the indentation length is only added when `endColumn` is greater than `1`.
					adjustedMessage.endColumn += indent.length;
				}

				if (typeof adjustedMessage.endLine === 'number') {
					adjustedMessage.endLine += lineOffset;
				}

				if (adjustedMessage.fix) {
					adjustedMessage.fix.text = adjustedMessage.fix.text.split('\n').join(`\n${indent}`);

					const indentsBeforeFixStart = indentsUptoIndex(unindentedText, adjustedMessage.fix.range[0], indent);
					const indentsBeforeFixEnd = indentsUptoIndex(unindentedText, adjustedMessage.fix.range[1] - 1, indent); // -1 because range end is exclusive

					adjustedMessage.fix.range = [
						adjustedMessage.fix.range[0] + characterOffset + indentsBeforeFixStart,
						adjustedMessage.fix.range[1] + characterOffset + indentsBeforeFixEnd,
					];
				}

				for (const {fix} of (adjustedMessage.suggestions ?? [])) {
					fix.text = fix.text.split('\n').join(`\n${indent}`);

					const indentsBeforeFixStart = indentsUptoIndex(unindentedText, fix.range[0], indent);
					const indentsBeforeFixEnd = indentsUptoIndex(unindentedText, fix.range[1] - 1, indent); // -1 because range end is exclusive

					fix.range = [
						fix.range[0] + characterOffset + indentsBeforeFixStart,
						fix.range[1] + characterOffset + indentsBeforeFixEnd,
					];
				}

				normalizedMessages.push(adjustedMessage);
			}
		}

		return normalizedMessages;
	},
};
