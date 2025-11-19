// @ts-check
import tsParser from '@typescript-eslint/parser';

/**
@import {Linter} from 'eslint';
*/

const CODEBLOCK_REGEX = /(?<openingFence>```(?:ts|typescript)?\n)(?<code>[\s\S]*?)```/g;
/** @type {Map<string, {lineOffset: number, characterOffset: number}[]>} */
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
				const {code, openingFence} = match.groups ?? {};

				// Skip empty code blocks
				if (!code || !openingFence) {
					continue;
				}

				const linesBeforeMatch = comment.value.slice(0, match.index).split('\n').length - 1;
				allCodeblocksData.push({
					lineOffset: comment.loc.start.line + linesBeforeMatch,
					characterOffset: comment.range[0] + match.index + openingFence.length + 2,
				});

				files.push({
					text: code,
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

			const {lineOffset, characterOffset} = codeblockData;

			for (const message of codeblockMessages) {
				const adjustedMessage = {...message};

				adjustedMessage.line += lineOffset;

				if (typeof adjustedMessage.endLine === 'number') {
					adjustedMessage.endLine += lineOffset;
				}

				adjustedMessage.fix &&= {
					...adjustedMessage.fix,
					range: [
						adjustedMessage.fix.range[0] + characterOffset,
						adjustedMessage.fix.range[1] + characterOffset,
					],
				};

				normalizedMessages.push(adjustedMessage);
			}
		}

		return normalizedMessages;
	},
};
