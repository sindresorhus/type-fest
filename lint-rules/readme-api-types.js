// @ts-check
/// <reference types="node" />
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

/**
The markdown heading node type from the rule visitor.
@typedef {Parameters<NonNullable<import('@eslint/markdown').MarkdownRuleVisitor['heading']>>[0]} MarkdownHeading
*/

/**
Parses a TypeScript source file.
@param {string} filePath The path to the source file.
@returns {ts.SourceFile} The parsed source file.
*/
const parseSourceFile = filePath => ts.createSourceFile(
	filePath,
	fs.readFileSync(filePath, 'utf8'),
	ts.ScriptTarget.Latest,
	true,
);

/**
Checks whether a node is a type alias or interface declaration.
@param {ts.Node} node The node to check.
@returns {node is ts.TypeAliasDeclaration | ts.InterfaceDeclaration} Whether the node is a type alias or interface declaration.
*/
const isTypeOrInterface = node => ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node);

/**
Checks whether a declaration has an `export` modifier.
@param {ts.Node} node The declaration to check.
@returns {boolean} Whether the declaration is exported.
*/
const isExported = node => ts.canHaveModifiers(node) && (ts.getModifiers(node)?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false);

/**
Checks whether a declaration has a `@deprecated` tag.
@param {ts.Node} node The declaration to check.
@returns {boolean} Whether the declaration is deprecated.
*/
const isDeprecated = node => ts.getJSDocTags(node).some(tag => tag.tagName.text === 'deprecated');

/**
Checks whether a public type is excluded from the readme API section. `*Options` types, deprecated types, and `Tag` are excluded. `Tag` is exported only so declaration emit can name it.
@param {string} typeName The exported type name.
@param {ts.TypeAliasDeclaration | ts.InterfaceDeclaration | undefined} declaration The type declaration, if it was found.
@returns {boolean} Whether the type is excluded.
*/
const isExcludedType = (typeName, declaration) => typeName.endsWith('Options')
	|| typeName === 'Tag'
	|| (declaration !== undefined && isDeprecated(declaration));

/**
Checks whether a module specifier points to a local file. A file can also re-export values from packages, like `tagged.d.ts`.
@param {ts.Expression | undefined} moduleSpecifier The module specifier to check.
@returns {moduleSpecifier is ts.StringLiteral} Whether the module specifier is a local path.
*/
const isLocalModuleSpecifier = moduleSpecifier => moduleSpecifier !== undefined
	&& ts.isStringLiteral(moduleSpecifier)
	&& moduleSpecifier.text.startsWith('.');

/**
Adds the declarations from a named export list to the exported types map.
@param {Map<string, ts.TypeAliasDeclaration | ts.InterfaceDeclaration>} exportedTypes The map to add to.
@param {ReadonlyArray<ts.ExportSpecifier>} elements The named export elements.
@param {(localName: string) => ts.TypeAliasDeclaration | ts.InterfaceDeclaration | undefined} getDeclaration Returns the declaration for a local name.
@returns {void}
*/
const addNamedExports = (exportedTypes, elements, getDeclaration) => {
	for (const element of elements) {
		const localName = element.propertyName?.text ?? element.name.text;
		const declaration = getDeclaration(localName);
		if (declaration) {
			exportedTypes.set(element.name.text, declaration);
		}
	}
};

/**
@type {import('@eslint/markdown').MarkdownRuleDefinition}
*/
export const readmeApiTypesRule = {
	meta: {
		type: 'suggestion',
		language: 'markdown/commonmark',
		docs: {
			description: 'Enforces that every type exported from `index.d.ts` has exactly one entry in the readme API section.',
		},
		messages: {
			missingType: 'Type `{{typeName}}` is exported from `index.d.ts` but has no entry in the readme API section.',
			duplicateType: 'Type `{{typeName}}` is listed more than once in the readme API section.',
		},
		schema: [],
	},
	create(context) {
		if (path.basename(context.filename) !== 'readme.md') {
			return {};
		}

		const indexPath = path.join(path.dirname(context.filename), 'index.d.ts');

		// Reuse source files within this pass, but reload them on the next lint invocation.
		/**
		@type {Map<string, ts.SourceFile>}
		*/
		const sourceFiles = new Map();

		/**
		Returns a parsed source file, reading it only once per lint pass.
		@param {string} filePath The path to the source file.
		@returns {ts.SourceFile} The parsed source file.
		*/
		const getSourceFile = filePath => {
			let sourceFile = sourceFiles.get(filePath);
			if (!sourceFile) {
				sourceFile = parseSourceFile(filePath);
				sourceFiles.set(filePath, sourceFile);
			}

			return sourceFile;
		};

		/**
		Collects the type and interface declarations exported by a file, keyed by their exported names, following its re-exports.
		@param {string} filePath The path to the source file.
		@param {Set<string>} [seen] The files already visited on this re-export path, to stop on cycles.
		@returns {Map<string, ts.TypeAliasDeclaration | ts.InterfaceDeclaration>} The declarations from the file and its local re-exports.
		*/
		const getExportedTypes = (filePath, seen = new Set()) => {
			/**
			@type {Map<string, ts.TypeAliasDeclaration | ts.InterfaceDeclaration>}
			*/
			const exportedTypes = new Map();
			if (seen.has(filePath)) {
				return exportedTypes;
			}

			seen.add(filePath);

			const sourceFile = getSourceFile(filePath);
			/**
			@type {Map<string, ts.TypeAliasDeclaration | ts.InterfaceDeclaration>}
			*/
			const localTypes = new Map();
			for (const statement of sourceFile.statements) {
				if (isTypeOrInterface(statement)) {
					localTypes.set(statement.name.text, statement);
				}
			}

			for (const statement of sourceFile.statements) {
				if (isTypeOrInterface(statement)) {
					if (isExported(statement)) {
						exportedTypes.set(statement.name.text, statement);
					}

					continue;
				}

				if (!ts.isExportDeclaration(statement)) {
					continue;
				}

				const {exportClause} = statement;
				if (!statement.moduleSpecifier) {
					if (exportClause && ts.isNamedExports(exportClause)) {
						addNamedExports(exportedTypes, exportClause.elements, localName => localTypes.get(localName));
					}

					continue;
				}

				if (!isLocalModuleSpecifier(statement.moduleSpecifier)) {
					continue;
				}

				const targetPath = path.resolve(path.dirname(filePath), statement.moduleSpecifier.text);
				// Branch the visited set so a file re-exported more than once is still resolved again.
				const targetTypes = getExportedTypes(targetPath, new Set(seen));

				if (!exportClause) {
					for (const [typeName, declaration] of targetTypes) {
						exportedTypes.set(typeName, declaration);
					}

					continue;
				}

				if (ts.isNamedExports(exportClause)) {
					addNamedExports(exportedTypes, exportClause.elements, localName => targetTypes.get(localName));
				}
			}

			return exportedTypes;
		};

		/**
		The public types that the readme API section must list. `*Options` types and deprecated types are excluded.
		@type {Set<string> | undefined}
		*/
		let requiredTypes;

		/**
		Returns the public types that the readme API section must list.
		@returns {Set<string>} The required type names.
		*/
		const getRequiredTypes = () => {
			if (requiredTypes) {
				return requiredTypes;
			}

			requiredTypes = new Set();
			if (!fs.existsSync(indexPath)) {
				return requiredTypes;
			}

			for (const [typeName, declaration] of getExportedTypes(indexPath)) {
				if (!isExcludedType(typeName, declaration)) {
					requiredTypes.add(typeName);
				}
			}

			return requiredTypes;
		};

		let isInApiSection = false;
		/**
		@type {MarkdownHeading | undefined}
		*/
		let apiHeading;
		const listedTypes = new Set();

		return {
			heading(node) {
				if (node.depth > 2) {
					return;
				}

				isInApiSection = node.depth === 2 && node.children.find(child => child.type === 'text')?.value === 'API';
				if (isInApiSection) {
					apiHeading = node;
				}
			},
			listItem(node) {
				if (!isInApiSection) {
					return;
				}

				const paragraph = node.children.find(child => child.type === 'paragraph');
				if (!paragraph) {
					return;
				}

				const [linkNode] = paragraph.children;
				if (linkNode?.type !== 'link' || linkNode.url.startsWith('http') || !linkNode.url.endsWith('.d.ts')) {
					return;
				}

				const [inlineCodeNode] = linkNode.children;
				if (inlineCodeNode?.type !== 'inlineCode') {
					return;
				}

				const typeName = inlineCodeNode.value;
				if (!getRequiredTypes().has(typeName)) {
					return;
				}

				if (listedTypes.has(typeName)) {
					context.report({
						node: linkNode,
						messageId: 'duplicateType',
						data: {typeName},
					});
					return;
				}

				listedTypes.add(typeName);
			},
			'root:exit'() {
				if (!apiHeading) {
					return;
				}

				for (const typeName of getRequiredTypes()) {
					if (!listedTypes.has(typeName)) {
						context.report({
							node: apiHeading,
							messageId: 'missingType',
							data: {typeName},
						});
					}
				}
			},
		};
	},
};
