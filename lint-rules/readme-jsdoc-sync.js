// @ts-check
/// <reference types="node" />
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
			missingTypeOrJSDoc: 'Type `{{typeName}}` in `{{filePath}}` either does not exist or lacks JSDoc documentation.',
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
				if (linkNode?.type !== 'link' || linkNode.url.startsWith('http') || !linkNode.url.endsWith('.d.ts')) {
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
				let jsdocDescription = ts.forEachChild(sourceFile, node => {
					if ((ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) && node.name.text === typeName) {
						const jsdocs = ts.getJSDocCommentsAndTags(node);
						return jsdocs[0]?.getText().split('\n')[1];
					}

					return undefined;
				});

				if (!jsdocDescription) {
					return context.report({
						node: linkNode,
						messageId: 'missingTypeOrJSDoc',
						data: {
							typeName,
							filePath: linkNode.url,
						},
					});
				}

				const tagRegex = /\{@link\s+([^\}]+)\}/gv;
				// This simply replaces "{@link SymbolName}" with "`SymbolName`".
				// It doesn't handle captions or external links, for example, "{@link SymbolName | some caption}" simply becomes "`SymbolName | some caption`".
				// For external links, markdown syntax should be used, like "[type-fest](https://github.com/sindresorhus/type-fest)".
				// And for symbols, if just "`SymbolName`" isn't sufficient, then for those specific cases this rule should be disabled.
				jsdocDescription = jsdocDescription.replaceAll(tagRegex, (_, content) => `\`${content}\``);

				if (typeDescription !== jsdocDescription) {
					context.report({
						node,
						messageId: 'mismatch',
						data: {
							expected: jsdocDescription,
							actual: typeDescription,
						},
						fix(fixer) {
							return fixer.replaceText(
								paragraph,
								`${context.sourceCode.getText(linkNode)} - ${jsdocDescription}`,
							);
						},
					});
				}
			},
		};
	},
};
