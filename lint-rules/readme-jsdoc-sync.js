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
			missingJSDoc: 'Linked type `{{typeName}}` in `{{filePath}}` does not have a JSDoc documentation.',
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
				const jsdocDescription = ts.forEachChild(sourceFile, node => {
					if ((ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) && node.name.text === typeName) {
						const jsDocs = ts.getJSDocCommentsAndTags(node);
						return jsDocs[0]?.getText().split('\n')[1];
					}

					return undefined;
				});

				if (!jsdocDescription) {
					return context.report({
						node: linkNode,
						messageId: 'missingJSDoc',
						data: {
							typeName,
							filePath: linkNode.url,
						},
					});
				}

				const tagRegex = /\{@link\s+([^\}]+)\}/gv;
				const descriptionWithoutTags = jsdocDescription.replaceAll(tagRegex, (_, content) => `\`${content}\``);

				if (typeDescription !== descriptionWithoutTags) {
					context.report({
						node,
						messageId: 'mismatch',
						data: {
							expected: descriptionWithoutTags,
							actual: typeDescription,
						},
						fix(fixer) {
							return fixer.replaceText(
								paragraph,
								`${context.sourceCode.getText(linkNode)} - ${descriptionWithoutTags}`,
							);
						},
					});
				}
			},
		};
	},
};
