export const requireExportRule = /** @type {const} */ ({
	meta: {
		type: 'problem',
		docs: {
			description: 'Ensure .d.ts files always have `export {}` to avoid being treated as global',
			category: 'Best Practices',
			recommended: true,
		},
		messages: {
			noEmptyExport: 'File must have `export {}` to ensure it is treated as a module.',
		},
		fixable: 'code',
	},
	defaultOptions: [],
	create(context) {
		const filename = context.filename.replaceAll('\\', '/');

		// Only check source .d.ts files
		if (!filename.includes('/source/') || !filename.endsWith('.d.ts')) {
			return {};
		}

		let hasEmptyExport = false;

		return {
			ExportNamedDeclaration(node) {
				// Check if this is specifically `export {}`
				if (!node.declaration && node.specifiers.length === 0 && !node.source) {
					hasEmptyExport = true;
				}
			},
			'Program:exit'(node) {
				if (!hasEmptyExport) {
					context.report({
						node,
						messageId: 'noEmptyExport',
						fix(fixer) {
							// Add export {} at the end of the file
							return fixer.insertTextAfter(node, '\nexport {};\n');
						},
					});
				}
			},
		};
	},
});
