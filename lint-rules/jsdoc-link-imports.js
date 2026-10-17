import path from 'node:path';
import fs from 'node:fs';
import ts from 'typescript';

const LINK_COMMENT = '// For `@link`';

// `{@link Foo.bar}` and `{@link Foo#bar}` resolve through `Foo`.
const getLeftmostIdentifier = name => {
	while (!ts.isIdentifier(name)) {
		name = name.left;
	}

	return name;
};

// Collects the names that the JSDoc in the file references. `@see Foo` without braces also resolves in editors, so it counts as a use of an import, but only `{@link}` names must resolve.
const collectJSDocNames = sourceFile => {
	const linkIdentifiers = [];
	const names = new Set();

	const visit = node => {
		// TypeScript parses `{@link https://example.com}` as the name `https` followed by the text `://example.com`.
		if ((ts.isJSDocLink(node) || ts.isJSDocLinkCode(node) || ts.isJSDocLinkPlain(node)) && node.name && !node.text.startsWith('://')) {
			const identifier = getLeftmostIdentifier(node.name);
			linkIdentifiers.push(identifier);
			names.add(identifier.text);
		} else if (ts.isJSDocSeeTag(node) && node.name) {
			names.add(getLeftmostIdentifier(node.name.name).text);
		}

		for (const jsDoc of node.jsDoc ?? []) {
			visit(jsDoc);
		}

		ts.forEachChild(node, visit);
	};

	visit(sourceFile);

	return {linkIdentifiers, names};
};

const findProjectRoot = filename => {
	let projectRoot = path.dirname(filename);
	while (projectRoot !== path.dirname(projectRoot)) {
		if (fs.existsSync(path.join(projectRoot, 'package.json'))) {
			break;
		}

		projectRoot = path.dirname(projectRoot);
	}

	return projectRoot;
};

// Maps each type exported from `index.d.ts` to the file that declares it.
const getIndexExportFiles = (program, checker, indexPath) => {
	const exportFiles = new Map();
	const indexSourceFile = program.getSourceFile(indexPath);
	const indexSymbol = indexSourceFile && checker.getSymbolAtLocation(indexSourceFile);
	if (!indexSymbol) {
		return exportFiles;
	}

	for (const exportSymbol of checker.getExportsOfModule(indexSymbol)) {
		const symbol = exportSymbol.declarations?.some(declaration => ts.isExportSpecifier(declaration)) ? checker.getAliasedSymbol(exportSymbol) : exportSymbol;
		const declaration = symbol.declarations?.[0];
		// A renamed export (`export type {Foo as Bar}`) cannot be imported from its file by the exported name.
		if (declaration && symbol.name === exportSymbol.name) {
			exportFiles.set(exportSymbol.name, declaration.getSourceFile().fileName);
		}
	}

	return exportFiles;
};

export const jsdocLinkImportsRule = /** @type {const} */ ({
	meta: {
		type: 'problem',
		docs: {
			description: 'Ensure each `{@link}` in JSDoc resolves in editors, and that each import is used',
		},
		fixable: 'code',
		messages: {
			missingImport: '`{@link {{name}}}` does not resolve, so editors show it as plain text. Import `{{name}}`.',
			unusedImport: 'Neither the code nor the JSDoc uses `{{name}}`.',
			missingComment: 'Only the JSDoc uses this import, so end it with this comment: {{comment}}',
			unneededComment: 'The code uses this import, so remove this comment: {{comment}}',
			noTypeInfo: 'Rule requires TypeScript type information. Configure `parserServices` in your ESLint config.',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		const filename = context.filename.replaceAll('\\', '/');
		if (!filename.includes('/source/') || !filename.endsWith('.d.ts')) {
			return {};
		}

		const {sourceCode} = context;
		const {parserServices} = sourceCode;
		if (!parserServices?.program || !parserServices?.esTreeNodeToTSNodeMap) {
			return {
				Program(node) {
					context.report({
						node,
						messageId: 'noTypeInfo',
					});
				},
			};
		}

		const {program} = parserServices;
		const checker = program.getTypeChecker();

		// Index of the start of the line after the given line, or the end of the file.
		const getNextLineStart = line => line < sourceCode.lines.length ? sourceCode.getIndexFromLoc({line: line + 1, column: 0}) : sourceCode.text.length;

		const getTrailingComment = declaration => sourceCode.getCommentsAfter(declaration).find(comment => comment.loc.start.line === declaration.loc.end.line);

		const removeDeclaration = (fixer, declaration, imports) => {
			const {line} = declaration.loc.end;
			// Also remove the blank line after the last import, so the file does not start with an empty line.
			const end = getNextLineStart(imports.length === 1 && sourceCode.lines[line] === '' ? line + 1 : line);
			return fixer.removeRange([declaration.range[0], end]);
		};

		const removeSpecifier = (fixer, specifier, specifiers) => {
			const index = specifiers.indexOf(specifier);
			const range = index < specifiers.length - 1
				? [specifier.range[0], specifiers[index + 1].range[0]]
				: [specifiers[index - 1].range[1], specifier.range[1]];
			return fixer.removeRange(range);
		};

		const checkImport = (declaration, imports, jsdocNames) => {
			const {specifiers} = declaration;
			if (specifiers.length === 0) {
				return;
			}

			const usages = specifiers.map(specifier => ({
				specifier,
				isUsedByCode: sourceCode.getDeclaredVariables(specifier)[0].references.length > 0,
				isUsedByJSDoc: jsdocNames.has(specifier.local.name),
			}));
			const unusedSpecifiers = usages.filter(usage => !usage.isUsedByCode && !usage.isUsedByJSDoc).map(usage => usage.specifier);

			if (unusedSpecifiers.length === specifiers.length) {
				context.report({
					node: declaration,
					messageId: 'unusedImport',
					data: {name: specifiers.map(specifier => specifier.local.name).join('`, `')},
					fix: fixer => removeDeclaration(fixer, declaration, imports),
				});
				return;
			}

			for (const specifier of unusedSpecifiers) {
				context.report({
					node: specifier,
					messageId: 'unusedImport',
					data: {name: specifier.local.name},
					fix: fixer => removeSpecifier(fixer, specifier, specifiers),
				});
			}

			const isUsedOnlyByJSDoc = usages.every(usage => !usage.isUsedByCode);
			const trailingComment = getTrailingComment(declaration);
			const comment = trailingComment && sourceCode.getText(trailingComment) === LINK_COMMENT ? trailingComment : undefined;

			if (isUsedOnlyByJSDoc && !comment) {
				context.report({
					node: declaration,
					messageId: 'missingComment',
					data: {comment: LINK_COMMENT},
					// Another comment on the line would join the inserted one, so leave that to the user.
					fix: trailingComment ? undefined : fixer => fixer.insertTextAfter(declaration, ` ${LINK_COMMENT}`),
				});
			} else if (!isUsedOnlyByJSDoc && comment) {
				context.report({
					loc: comment.loc,
					messageId: 'unneededComment',
					data: {comment: LINK_COMMENT},
					fix: fixer => fixer.removeRange([declaration.range[1], comment.range[1]]),
				});
			}
		};

		const addImport = (fixer, name, exportFile, imports) => {
			let importPath = path.relative(path.dirname(filename), exportFile).replaceAll('\\', '/');
			if (!importPath.startsWith('.')) {
				importPath = `./${importPath}`;
			}

			const existingDeclaration = imports.find(declaration =>
				declaration.importKind === 'type'
				&& declaration.source.value === importPath
				&& declaration.specifiers.length > 0
				&& declaration.specifiers.every(specifier => specifier.type === 'ImportSpecifier'),
			);
			if (existingDeclaration) {
				return fixer.insertTextAfter(existingDeclaration.specifiers.at(-1), `, ${name}`);
			}

			const importText = `import type {${name}} from '${importPath}'; ${LINK_COMMENT}`;
			if (imports.length === 0) {
				return fixer.insertTextBeforeRange([0, 0], `${importText}\n\n`);
			}

			// Insert after the last import, and after its trailing comment.
			const lastImport = imports.at(-1);
			return fixer.insertTextAfter(getTrailingComment(lastImport) ?? lastImport, `\n${importText}`);
		};

		return {
			Program(node) {
				const sourceFile = parserServices.esTreeNodeToTSNodeMap.get(node);
				const {linkIdentifiers, names} = collectJSDocNames(sourceFile);
				const imports = node.body.filter(statement => statement.type === 'ImportDeclaration');

				for (const declaration of imports) {
					checkImport(declaration, imports, names);
				}

				const reportedNames = new Set();
				let exportFiles;

				for (const identifier of linkIdentifiers) {
					const name = identifier.text;
					if (reportedNames.has(name) || checker.getSymbolAtLocation(identifier)) {
						continue;
					}

					reportedNames.add(name);
					exportFiles ??= getIndexExportFiles(program, checker, path.join(findProjectRoot(filename), 'index.d.ts'));

					const exportFile = exportFiles.get(name);
					context.report({
						loc: {
							start: sourceCode.getLocFromIndex(identifier.getStart(sourceFile)),
							end: sourceCode.getLocFromIndex(identifier.getEnd()),
						},
						messageId: 'missingImport',
						data: {name},
						fix: exportFile ? fixer => addImport(fixer, name, exportFile, imports) : undefined,
					});
				}
			},
		};
	},
});
