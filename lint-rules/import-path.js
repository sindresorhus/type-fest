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
			'ImportDeclaration, ExportNamedDeclaration, ExportAllDeclaration'(node) {
				// Exit if not a re-export
				if (!node.source) {
					return;
				}

				const importPath = node.source.value;

				// Skip if not relative path
				if (!(importPath.startsWith('./') || importPath.startsWith('../'))) {
					return;
				}

				const filename = path.basename(importPath);
				const firstDotIndex = filename.indexOf('.');
				const extension = firstDotIndex === -1 ? '' : filename.slice(firstDotIndex);

				// Skip if the import path already ends with `.d.ts`
				if (extension === '.d.ts') {
					return;
				}

				const importPathWithoutExtension = extension.length > 0
					? importPath.slice(0, -extension.length)
					: importPath;
				const fixedImportPath = `${importPathWithoutExtension}.d.ts`;

				context.report({
					node: node.source,
					messageId: 'incorrectImportPath',
					fix(fixer) {
						return fixer.replaceText(node.source, `'${fixedImportPath}'`);
					},
					data: {importPath, fixedImportPath},
				});
			},
		};
	},
});
