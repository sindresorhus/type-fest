import path from 'node:path';
import fs from 'node:fs';
import ts from 'typescript';

const LINK_COMMENT = '// For `@link`';

// `{@link Foo.bar}` and `{@link Foo#bar}` need `Foo` in scope before their member can resolve.
const getLeftmostIdentifier = name => {
	while (!ts.isIdentifier(name)) {
		name = name.left;
	}

	return name;
};

// Collects the symbols that the JSDoc in the file references, so a shadowed name is not mistaken for an import. `@see Foo` without braces also resolves in editors, so it counts as a use of an import, but only `{@link}` names must resolve.
const collectJSDocReferences = (sourceFile, checker) => {
	const linkTargets = [];
	const symbols = new Set();

	const visit = node => {
		// TypeScript parses `{@link https://example.com}` as the name `https` followed by the text `://example.com`.
		if ((ts.isJSDocLink(node) || ts.isJSDocLinkCode(node) || ts.isJSDocLinkPlain(node)) && node.name && !node.text.startsWith('://')) {
			const identifier = getLeftmostIdentifier(node.name);
			const symbol = checker.getSymbolAtLocation(identifier);
			linkTargets.push({target: node.name, identifier, symbol});
			symbols.add(symbol);
		} else if (ts.isJSDocSeeTag(node) && node.name) {
			symbols.add(checker.getSymbolAtLocation(getLeftmostIdentifier(node.name.name)));
		}

		for (const jsDoc of node.jsDoc ?? []) {
			visit(jsDoc);
		}

		ts.forEachChild(node, visit);
	};

	visit(sourceFile);

	return {linkTargets, symbols};
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
			unresolvedLink: '`{@link {{name}}}` does not resolve.',
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
			const trailingComment = getTrailingComment(declaration);
			const lastRemovedToken = trailingComment && sourceCode.getText(trailingComment) === LINK_COMMENT ? trailingComment : declaration;
			const nextToken = sourceCode.getTokenAfter(lastRemovedToken, {includeComments: true});
			return fixer.removeRange([declaration.range[0], Math.min(end, nextToken?.range[0] ?? end)]);
		};

		const removeSpecifier = (fixer, specifier, declaration) => {
			const namedSpecifiers = declaration.specifiers.filter(candidate => candidate.type === 'ImportSpecifier');
			const groups = declaration.specifiers.filter(candidate => candidate.type !== 'ImportSpecifier');
			if (namedSpecifiers.length > 0) {
				// Named bindings form one brace-delimited group beside a default binding.
				groups.push({
					range: [
						sourceCode.getTokenBefore(namedSpecifiers[0]).range[0],
						sourceCode.getTokenBefore(declaration.source, {skip: 1}).range[1],
					],
				});
			}

			const siblings = specifier.type === 'ImportSpecifier' && namedSpecifiers.length > 1 ? namedSpecifiers : groups;
			const index = siblings.findIndex(({range}) => range[0] <= specifier.range[0] && range[1] >= specifier.range[1]);
			const range = index < siblings.length - 1
				? [siblings[index].range[0], siblings[index + 1].range[0]]
				: [siblings[index - 1].range[1], siblings[index].range[1]];
			return fixer.removeRange(range);
		};

		const checkImport = (declaration, imports, jsdocSymbols) => {
			const {specifiers} = declaration;
			if (specifiers.length === 0) {
				return;
			}

			const usages = specifiers.map(specifier => ({
				specifier,
				isUsedByCode: sourceCode.getDeclaredVariables(specifier)[0].references.length > 0,
				isUsedByJSDoc: jsdocSymbols.has(checker.getSymbolAtLocation(parserServices.esTreeNodeToTSNodeMap.get(specifier.local))),
			}));
			const unusedSpecifiers = usages.filter(usage => !usage.isUsedByCode && !usage.isUsedByJSDoc).map(usage => usage.specifier);
			// Internal comments may belong to retained specifiers, so leave their removal to the user.
			const canRemoveUnused = sourceCode.getCommentsInside(declaration).length === 0;

			if (unusedSpecifiers.length === specifiers.length) {
				context.report({
					node: declaration,
					messageId: 'unusedImport',
					data: {name: specifiers.map(specifier => specifier.local.name).join('`, `')},
					fix: canRemoveUnused ? fixer => removeDeclaration(fixer, declaration, imports) : undefined,
				});
				return;
			}

			for (const specifier of unusedSpecifiers) {
				context.report({
					node: specifier,
					messageId: 'unusedImport',
					data: {name: specifier.local.name},
					fix: canRemoveUnused ? fixer => removeSpecifier(fixer, specifier, declaration) : undefined,
				});
			}

			const isUsedOnlyByJSDoc = usages.every(usage => !usage.isUsedByCode);
			const trailingComment = getTrailingComment(declaration);
			const comment = trailingComment && sourceCode.getText(trailingComment) === LINK_COMMENT ? trailingComment : undefined;

			if (isUsedOnlyByJSDoc && !comment) {
				const nextToken = sourceCode.getTokenAfter(declaration);
				context.report({
					node: declaration,
					messageId: 'missingComment',
					data: {comment: LINK_COMMENT},
					// Another comment on the line would join the inserted one, and following code would be commented out, so leave those to the user.
					fix: trailingComment || nextToken?.loc.start.line === declaration.loc.end.line ? undefined : fixer => fixer.insertTextAfter(declaration, ` ${LINK_COMMENT}`),
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
			// Insert before the first import so the new line comment cannot swallow existing same-line code or comments.
			return imports.length === 0
				? fixer.insertTextBeforeRange([0, 0], `${importText}\n\n`)
				: fixer.insertTextBefore(imports[0], `${importText}\n`);
		};

		return {
			Program(node) {
				const sourceFile = parserServices.esTreeNodeToTSNodeMap.get(node);
				const {linkTargets, symbols} = collectJSDocReferences(sourceFile, checker);
				const imports = node.body.filter(statement => statement.type === 'ImportDeclaration');
				// Without an existing import anchor, prepending an import would disable leading triple-slash directives and `// @ts-` pragmas, so any leading line comment skips the fix.
				const canAddImport = imports.length > 0 || !ts.getLeadingCommentRanges(sourceFile.text, 0)?.some(comment => comment.kind === ts.SyntaxKind.SingleLineCommentTrivia);

				for (const declaration of imports) {
					checkImport(declaration, imports, symbols);
				}

				const reportedNames = new Set();
				let exportFiles;

				for (const {target, identifier, symbol} of linkTargets) {
					const isRootResolved = Boolean(symbol);
					const name = isRootResolved ? target.getText(sourceFile) : identifier.text;
					if (reportedNames.has(name) || (ts.isIdentifier(target) ? symbol : checker.getSymbolAtLocation(target.right))) {
						continue;
					}

					reportedNames.add(name);
					exportFiles ??= getIndexExportFiles(program, checker, path.join(findProjectRoot(filename), 'index.d.ts'));

					const exportFile = exportFiles.get(name);
					// Highlight only the name that the message shows.
					const reportedNode = isRootResolved ? target : identifier;
					context.report({
						loc: {
							start: sourceCode.getLocFromIndex(reportedNode.getStart(sourceFile)),
							end: sourceCode.getLocFromIndex(reportedNode.getEnd()),
						},
						messageId: isRootResolved ? 'unresolvedLink' : 'missingImport',
						data: {name},
						fix: !isRootResolved && exportFile && canAddImport ? fixer => addImport(fixer, name, exportFile, imports) : undefined,
					});
				}
			},
		};
	},
});
