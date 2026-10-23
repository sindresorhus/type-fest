import path from 'node:path';
import fs from 'node:fs';
import ts from 'typescript';

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
			noTypeInfo: 'Rule requires TypeScript type information. Configure `parserServices` in your ESLint config.',
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
		// Only run on TypeScript declaration files in source directory, and skip internal files
		// Convert to forward slashes for consistent path checking across platforms
		const filename = context.filename.replaceAll('\\', '/');
		if (!filename.includes('/source/') || !filename.endsWith('.d.ts') || filename.includes('/internal/')) {
			return {};
		}

		const options = context.options?.[0] ?? {};
		const indexFileName = options.indexFile ?? 'index.d.ts';

		// Get TypeScript type-aware services
		const {parserServices} = context.sourceCode;

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
		const checker = program.getTypeChecker();

		// Find project root
		let projectRoot = path.dirname(filename);
		while (projectRoot !== path.dirname(projectRoot)) {
			if (fs.existsSync(path.join(projectRoot, 'package.json'))) {
				break;
			}

			projectRoot = path.dirname(projectRoot);
		}

		const indexPath = path.join(projectRoot, indexFileName);

		// Get index export symbols (no caching to detect changes immediately), resolving aliases to their declarations.
		const indexExports = new Set();

		// Get the source file for index.d.ts
		const indexSourceFile = program.getSourceFile(indexPath);
		if (indexSourceFile) {
			const indexSymbol = checker.getSymbolAtLocation(indexSourceFile);
			if (indexSymbol) {
				const exports = checker.getExportsOfModule(indexSymbol);
				for (const exportSymbol of exports) {
					indexExports.add(exportSymbol.flags === ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exportSymbol) : exportSymbol);
				}
			}
		}

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
				ancestor.type === 'TSModuleDeclaration' && ancestor.declare,
			);

			// Skip if inside declare namespace or already processed
			if (isInsideDeclareNamespace || processed.has(typeName)) {
				return;
			}

			processed.add(typeName);

			// Report if this declaration is not exported from index, even when another declaration has the same name.
			const declaration = parserServices.esTreeNodeToTSNodeMap.get(node);
			if (!indexExports.has(checker.getSymbolAtLocation(declaration.name))) {
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
		};
	},
});
