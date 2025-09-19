import path from 'node:path';
import fs from 'node:fs';

/**
Cache for index exports to avoid repeated lookups
*/
const indexCache = new Map();

/**
Find the project root directory by looking for package.json
*/
const findProjectRoot = filename => {
	let root = path.dirname(filename);
	while (root !== path.dirname(root)) {
		if (fs.existsSync(path.join(root, 'package.json'))) {
			return root;
		}

		root = path.dirname(root);
	}

	return root;
};

/**
Get or cache exports from index file
*/
const getIndexExports = (indexPath, program) => {
	const cacheKey = `index:${indexPath}`;

	if (indexCache.has(cacheKey)) {
		return indexCache.get(cacheKey);
	}

	const exports = new Set();
	const checker = program.getTypeChecker();
	const sourceFile = program.getSourceFile(indexPath);

	if (sourceFile) {
		const symbol = checker.getSymbolAtLocation(sourceFile);
		if (symbol) {
			const moduleExports = checker.getExportsOfModule(symbol);
			for (const exportSymbol of moduleExports) {
				exports.add(exportSymbol.name);
			}
		}
	}

	indexCache.set(cacheKey, exports);
	return exports;
};

export const requireExportedTypesRule = /** @type {const} */ ({
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Enforce that exported types are also exported from index.d.ts',
			category: 'Best Practices',
			recommended: true,
		},
		messages: {
			missingExport: 'Type `{{typeName}}` is exported from this file but not from index.d.ts. '
				+ 'Add it to index.d.ts or use `// eslint-disable-next-line type-fest/require-exported-types` to ignore.',
			noTypeInfo: 'Rule requires TypeScript type information. Configure `parserOptions.project` in your ESLint config.',
		},
		schema: [
			{
				type: 'object',
				properties: {
					indexFile: {
						type: 'string',
						description: 'Path to the index file (default: "index.d.ts")',
					},
				},
				additionalProperties: false,
			},
		],
	},
	defaultOptions: [],
	create(context) {
		// Only run on TypeScript declaration files in source directory
		const filename = context.filename ?? context.getFilename?.() ?? '';
		if (!filename.includes('/source/') || !filename.endsWith('.d.ts')) {
			return {};
		}

		// Skip internal files
		if (filename.includes('/internal/')) {
			return {};
		}

		const options = context.options?.[0] ?? {};
		const indexFileName = options.indexFile ?? 'index.d.ts';

		// Get TypeScript type-aware services
		const parserServices = context.sourceCode?.parserServices;

		// Type information is required for this rule
		if (!parserServices?.program || !parserServices?.esTreeNodeToTSNodeMap) {
			// Report once per file that type information is required
			return {
				'Program'(node) {
					context.report({
						node,
						messageId: 'noTypeInfo',
					});
				},
			};
		}

		const {program} = parserServices;
		const projectRoot = findProjectRoot(filename);
		const indexPath = path.join(projectRoot, indexFileName);
		const indexExports = getIndexExports(indexPath, program);

		// State to track processed nodes
		const processed = new Set();

		// Helper function to check exported type/interface
		const checkExportedType = node => {
			const typeName = node.id.name;

			// Skip types starting with underscore (internal/private convention)
			if (typeName.startsWith('_')) {
				return;
			}

			// Skip if inside declare namespace
			const ancestors = context.sourceCode.getAncestors(node);
			const isInsideDeclareNamespace = ancestors.some(ancestor =>
				ancestor.type === 'TSModuleDeclaration' && ancestor.declare === true,
			);

			if (isInsideDeclareNamespace) {
				return;
			}

			// Skip if already processed
			if (processed.has(typeName)) {
				return;
			}

			processed.add(typeName);

			// Report if not exported from index
			if (!indexExports.has(typeName)) {
				context.report({
					node,
					messageId: 'missingExport',
					data: {typeName},
				});
			}
		};

		return {
			// Handle: export type Foo = ...
			'ExportNamedDeclaration > TSTypeAliasDeclaration': checkExportedType,

			// Handle: export interface Foo { ... }
			'ExportNamedDeclaration > TSInterfaceDeclaration': checkExportedType,

			// Clean up cache periodically
			'Program:exit'() {
				// Clear cache if it gets too large
				if (indexCache.size > 100) {
					indexCache.clear();
				}
			},
		};
	},
});
