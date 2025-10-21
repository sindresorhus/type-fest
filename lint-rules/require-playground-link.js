import lzString from 'lz-string';
import outdent from 'outdent';

const CODEBLOCK_REGEX = /```(?:ts|typescript)?(?<code>[\s\S]*?)```/g;
const PLAYGROUND_BASE_URL = 'https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/';

const generatePlaygroundLink = code => {
	const zippedCode = lzString.compressToEncodedURIComponent(code);
	return `${PLAYGROUND_BASE_URL}${zippedCode}`;
};

export const generateLinkText = code => `[Playground Link](${generatePlaygroundLink(code)})`;

const getCodeIndent = code => {
	const line = code.split('\n').filter(Boolean); // eslint-disable-line unicorn/prefer-array-find
	const firstLine = line[0];
	const leadingSpaces = firstLine.slice(0, firstLine.length - firstLine.trimStart().length);
	return leadingSpaces;
};

export const requirePlaygroundLinkRule = /** @type {const} */ ({
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Ensures JSDoc example codeblocks for publicly available types have playground links.',
		},
		fixable: 'code',
		messages: {
			missingPlaygroundLink: 'Example codeblocks must have an associated playground link. Add the following after the example codeblock:\n[Playground Link]({{playgroundLink}})',
			incorrectPlaygroundLink: 'Incorrect playground link. Update the link to the following:\n{{playgroundLink}}',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
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
						const {code} = match.groups ?? {};

						// Skip empty code blocks
						if (!code) {
							continue;
						}

						const playgroundLink = generatePlaygroundLink(outdent.string(code));

						const nextLineIndex = match.index + match[0].length + 1; // +1 to move past the newline
						const nextLine = comment.slice(nextLineIndex).split('\n')[0];

						if (nextLine.includes(playgroundLink)) {
							continue;
						}

						const codeblockStart = previousNode.range[0] + match.index + 2;
						const codeblockEnd = codeblockStart + match[0].length;

						const fixerRangeStart = previousNode.range[0] + nextLineIndex + 2;
						const fixerRangeEnd = fixerRangeStart + nextLine.length;

						const updatePlaygroundLink = nextLine.includes(PLAYGROUND_BASE_URL);
						const indentation = getCodeIndent(code);
						const insertText = `${indentation}${generateLinkText(outdent.string(code))}` + (updatePlaygroundLink ? '' : '\n');

						context.report({
							loc: {
								start: context.sourceCode.getLocFromIndex(codeblockStart),
								end: context.sourceCode.getLocFromIndex(codeblockEnd),
							},
							messageId: updatePlaygroundLink ? 'incorrectPlaygroundLink' : 'missingPlaygroundLink',
							data: {
								playgroundLink,
							},
							fix(fixer) {
								return fixer.replaceTextRange(
									[
										fixerRangeStart, // Start is inclusive.
										updatePlaygroundLink ? fixerRangeEnd : fixerRangeStart, // End is exclusive. If start and end are the same, it inserts at that position.
									],
									insertText,
								);
							},
						});
					}
				}
			},
		};
	},
});
