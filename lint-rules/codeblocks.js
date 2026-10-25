const FENCE_LINE_REGEX = /^(?<indent>[\t ]*)```(?<language>[^\n`]*)(?:\n|$)/gmv;
const CLOSING_FENCE_REGEX = /^[\t ]*```[\t ]*$/mv;

/**
Yields complete fenced blocks without rescanning an unfinished tail for every opening fence.

@param {string} text - The text containing the fences.
@returns {Generator<{code: string, language: string, indent: string, index: number, codeStart: number}>} The complete blocks in source order.
@yields {object} A complete fenced block with its original indentation and offsets.
*/
export function * getCodeblocks(text) {
	let opening;
	for (const fence of text.matchAll(FENCE_LINE_REGEX)) {
		if (!opening) {
			if (fence[0].endsWith('\n')) {
				opening = fence;
			}
		} else if (CLOSING_FENCE_REGEX.test(fence[0])) {
			const codeStart = opening.index + opening[0].length;
			yield {
				code: text.slice(codeStart, fence.index),
				language: opening.groups.language,
				indent: opening.groups.indent,
				index: opening.index,
				codeStart,
			};
			opening = undefined;
		}
	}
}
