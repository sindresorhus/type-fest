import path from 'node:path';

export const importPathRule = /** @type {const} */ ({
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforces import paths to end with a \'.d.ts\' extension.',
		},
		fixable: 'code',
		messages: {
			incorrectImportPath:
                'Import path \'{{importPath}}\' must end with a \'.d.ts\' extension. Use \'{{fixedImportPath}}\' instead.',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		return {
			'ImportDeclaration, ExportNamedDeclaration, ExportAllDeclaration, TSImportType'(node) {
				// Exit if not an import or export from a module
				if (!node.source) {
					return;
				}

				const importPath = node.source.value;

				// Skip if not relative path
				if (!(importPath.startsWith('./') || importPath.startsWith('../'))) {
					return;
				}

				const extension = path.extname(importPath);

				// Skip if the import path already ends with `.d.ts`
				if (importPath.endsWith('.d.ts')) {
					return;
				}

				const fixedImportPath = `${importPath.slice(0, importPath.length - extension.length)}.d.ts`;

				context.report({
					node: node.source,
					messageId: 'incorrectImportPath',
					fix(fixer) {
						// Serialize the decoded path before wrapping it in the rule's single quotes.
						const escapedImportPath = JSON.stringify(fixedImportPath).slice(1, -1).replaceAll('\'', String.raw`\'`);
						return fixer.replaceText(node.source, `'${escapedImportPath}'`);
					},
					data: {importPath, fixedImportPath},
				});
			},
		};
	},
});
