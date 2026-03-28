// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

/** @type {import('@eslint/markdown').MarkdownRuleDefinition} */
export const readmeJSDocSyncRule = {
	meta: {
		type: 'suggestion',
		language: 'markdown/commonmark',
		docs: {
			description: 'Enforces that type descriptions in the README exactly match the first line of their source JSDoc.',
		},
		fixable: 'code',
		messages: {
			mismatch: 'Type description does not match the source JSDoc.\n\nExpected: {{expected}}\n\nFound: {{actual}}',
			fileNotFound: 'Linked file `{{filePath}}` not found.',
		},
		schema: [],
	},
	create(context) {
		if (path.basename(context.filename) !== 'readme.md') {
			return {};
		}

		return {
			listItem(node) {
				const paragraph = node.children.find(child => child.type === 'paragraph');
				if (!paragraph) {
					return;
				}

				const linkNode = paragraph.children[0];
				if (linkNode?.type !== 'link' || !linkNode?.url.endsWith('.d.ts')) {
					return;
				}

				const inlineCodeNode = linkNode.children[0];
				if (inlineCodeNode?.type !== 'inlineCode') {
					return;
				}

				const typeName = inlineCodeNode.value;
				const typeDescription = context.sourceCode.getText(paragraph).split(' - ').slice(1).join(' - ');

				const absolutePath = path.resolve(path.dirname(context.filename), linkNode.url);

				let sourceContent;
				try {
					sourceContent = fs.readFileSync(absolutePath, 'utf8');
				} catch {
					return context.report({
						node: linkNode,
						messageId: 'fileNotFound',
						data: {
							filePath: linkNode.url,
						},
					});
				}

				const sourceFile = ts.createSourceFile(linkNode.url, sourceContent, ts.ScriptTarget.Latest, true);
				const jsDocFirstLine = ts.forEachChild(sourceFile, node => {
					if ((ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) && node.name.text === typeName) {
						const jsDocs = ts.getJSDocCommentsAndTags(node);
						return ts.getTextOfJSDocComment(jsDocs[0]?.comment)?.split('\n')[0];
					}

					return undefined;
				});

				if (jsDocFirstLine && typeDescription !== jsDocFirstLine) {
					context.report({
						node,
						messageId: 'mismatch',
						data: {
							expected: jsDocFirstLine,
							actual: typeDescription,
						},
						fix(fixer) {
							return fixer.replaceText(
								paragraph,
								`${context.sourceCode.getText(linkNode)} - ${jsDocFirstLine}`,
							);
						},
					});
				}
			},
		};
	},
};

