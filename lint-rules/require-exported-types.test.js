#!/usr/bin/env node
/**
 * Test suite for the require-exported-types ESLint rule
 *
 * Run with: node --test lint-rules/require-exported-types.test.mjs
 */

import {test, describe} from 'node:test';
import assert from 'node:assert/strict';
import {requireExportedTypesRule} from './require-exported-types.js';

describe('require-exported-types ESLint rule', () => {
	describe('rule structure and metadata', () => {
		test('has correct structure', () => {
			assert.ok(requireExportedTypesRule.meta);
			assert.equal(requireExportedTypesRule.meta.type, 'suggestion');
			assert.ok(requireExportedTypesRule.meta.docs);
			assert.ok(requireExportedTypesRule.meta.messages);
			assert.ok(requireExportedTypesRule.create);
			assert.equal(typeof requireExportedTypesRule.create, 'function');
		});

		test('has correct meta.docs', () => {
			const {docs} = requireExportedTypesRule.meta;
			assert.equal(docs.description, 'Enforce that exported types are also exported from index.d.ts');
			assert.equal(docs.category, 'Best Practices');
			assert.equal(docs.recommended, true);
		});

		test('has correct messages', () => {
			const {messages} = requireExportedTypesRule.meta;
			assert.ok(messages.missingExport.includes('Type `{{typeName}}`'));
			assert.ok(messages.missingExport.includes('index.d.ts'));
			assert.ok(messages.noTypeInfo.includes('TypeScript type information'));
		});

		test('has correct schema', () => {
			const {schema} = requireExportedTypesRule.meta;
			assert.ok(Array.isArray(schema));
			assert.equal(schema.length, 1);
			assert.equal(schema[0].type, 'object');
			assert.ok(schema[0].properties.indexFile);
			assert.equal(schema[0].properties.indexFile.type, 'string');
		});
	});

	describe('file filtering', () => {
		test('skips non-.d.ts files', () => {
			const context = {
				filename: '/project/source/foo.ts',
				sourceCode: {parserServices: {}},
				options: [],
			};
			const handlers = requireExportedTypesRule.create(context);
			assert.deepEqual(handlers, {});
		});

		test('skips files outside source directory', () => {
			const context = {
				filename: '/project/test/foo.d.ts',
				sourceCode: {parserServices: {}},
				options: [],
			};
			const handlers = requireExportedTypesRule.create(context);
			assert.deepEqual(handlers, {});
		});

		test('skips internal files', () => {
			const context = {
				filename: '/project/source/internal/foo.d.ts',
				sourceCode: {parserServices: {}},
				options: [],
			};
			const handlers = requireExportedTypesRule.create(context);
			assert.deepEqual(handlers, {});
		});

		test('processes source/*.d.ts files', () => {
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
				},
				options: [],
			};
			const handlers = requireExportedTypesRule.create(context);
			assert.ok(handlers['ExportNamedDeclaration > TSTypeAliasDeclaration']);
			assert.ok(handlers['ExportNamedDeclaration > TSInterfaceDeclaration']);
		});
	});

	describe('TypeScript type information', () => {
		test('requires type information', () => {
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {parserServices: {}}, // No type info
				options: [],
			};
			const handlers = requireExportedTypesRule.create(context);
			assert.ok(handlers.Program);
			assert.equal(typeof handlers.Program, 'function');
		});

		test('reports noTypeInfo message when type info is missing', () => {
			let reportedError = null;
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {parserServices: {}},
				options: [],
				report(error) {
					reportedError = error;
				},
			};
			const handlers = requireExportedTypesRule.create(context);
			handlers.Program({type: 'Program'}); // eslint-disable-line new-cap
			assert.equal(reportedError.messageId, 'noTypeInfo');
		});
	});

	describe('underscore prefix handling', () => {
		test('skips types starting with underscore', () => {
			const errors = [];
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
					getAncestors: () => [],
				},
				options: [],
				report: error => errors.push(error),
			};

			const handlers = requireExportedTypesRule.create(context);
			const typeHandler = handlers['ExportNamedDeclaration > TSTypeAliasDeclaration'];

			typeHandler({id: {name: '_InternalType'}});
			assert.equal(errors.length, 0);
		});

		test('reports types not starting with underscore', () => {
			const errors = [];
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
					getAncestors: () => [],
				},
				options: [],
				report: error => errors.push(error),
			};

			const handlers = requireExportedTypesRule.create(context);
			const typeHandler = handlers['ExportNamedDeclaration > TSTypeAliasDeclaration'];

			typeHandler({id: {name: 'PublicType'}});
			assert.equal(errors.length, 1);
			assert.equal(errors[0].data.typeName, 'PublicType');
			assert.equal(errors[0].messageId, 'missingExport');
		});

		test('skips interfaces starting with underscore', () => {
			const errors = [];
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
					getAncestors: () => [],
				},
				options: [],
				report: error => errors.push(error),
			};

			const handlers = requireExportedTypesRule.create(context);
			const interfaceHandler = handlers['ExportNamedDeclaration > TSInterfaceDeclaration'];

			interfaceHandler({id: {name: '_InternalInterface'}});
			assert.equal(errors.length, 0);
		});

		test('reports interfaces not starting with underscore', () => {
			const errors = [];
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
					getAncestors: () => [],
				},
				options: [],
				report: error => errors.push(error),
			};

			const handlers = requireExportedTypesRule.create(context);
			const interfaceHandler = handlers['ExportNamedDeclaration > TSInterfaceDeclaration'];

			interfaceHandler({id: {name: 'PublicInterface'}});
			assert.equal(errors.length, 1);
			assert.equal(errors[0].data.typeName, 'PublicInterface');
		});
	});

	describe('declare namespace handling', () => {
		test('skips types inside declare namespace', () => {
			const errors = [];
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
					getAncestors: () => [
						{type: 'TSModuleDeclaration', declare: true},
					],
				},
				options: [],
				report: error => errors.push(error),
			};

			const handlers = requireExportedTypesRule.create(context);
			const typeHandler = handlers['ExportNamedDeclaration > TSTypeAliasDeclaration'];

			typeHandler({id: {name: 'TypeInNamespace'}});
			assert.equal(errors.length, 0);
		});

		test('reports types outside declare namespace', () => {
			const errors = [];
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
					getAncestors: () => [
						{type: 'TSModuleDeclaration', declare: false}, // Not a declare namespace
					],
				},
				options: [],
				report: error => errors.push(error),
			};

			const handlers = requireExportedTypesRule.create(context);
			const typeHandler = handlers['ExportNamedDeclaration > TSTypeAliasDeclaration'];

			typeHandler({id: {name: 'TypeOutsideNamespace'}});
			assert.equal(errors.length, 1);
			assert.equal(errors[0].data.typeName, 'TypeOutsideNamespace');
		});

		test('handles nested declare namespaces', () => {
			const errors = [];
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
					getAncestors: () => [
						{type: 'TSModuleDeclaration', declare: false},
						{type: 'TSModuleDeclaration', declare: true}, // At least one is declare
					],
				},
				options: [],
				report: error => errors.push(error),
			};

			const handlers = requireExportedTypesRule.create(context);
			const typeHandler = handlers['ExportNamedDeclaration > TSTypeAliasDeclaration'];

			typeHandler({id: {name: 'NestedType'}});
			assert.equal(errors.length, 0); // Should be skipped
		});
	});

	describe('deduplication', () => {
		test('processes each type only once', () => {
			const errors = [];
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
					getAncestors: () => [],
				},
				options: [],
				report: error => errors.push(error),
			};

			const handlers = requireExportedTypesRule.create(context);
			const typeHandler = handlers['ExportNamedDeclaration > TSTypeAliasDeclaration'];

			const node = {id: {name: 'DuplicateType'}};
			typeHandler(node);
			typeHandler(node);
			typeHandler(node);

			assert.equal(errors.length, 1);
		});

		test('processes each interface only once', () => {
			const errors = [];
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
					getAncestors: () => [],
				},
				options: [],
				report: error => errors.push(error),
			};

			const handlers = requireExportedTypesRule.create(context);
			const interfaceHandler = handlers['ExportNamedDeclaration > TSInterfaceDeclaration'];

			const node = {id: {name: 'DuplicateInterface'}};
			interfaceHandler(node);
			interfaceHandler(node);

			assert.equal(errors.length, 1);
		});
	});

	describe('options', () => {
		test('accepts custom index file option', () => {
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
				},
				options: [{indexFile: 'custom-index.d.ts'}],
			};

			const handlers = requireExportedTypesRule.create(context);
			assert.ok(handlers['ExportNamedDeclaration > TSTypeAliasDeclaration']);
			// The rule should use custom-index.d.ts instead of index.d.ts
		});

		test('uses default index.d.ts when no option provided', () => {
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
				},
				options: [],
			};

			const handlers = requireExportedTypesRule.create(context);
			assert.ok(handlers['ExportNamedDeclaration > TSTypeAliasDeclaration']);
		});
	});

	describe('error reporting', () => {
		test('includes type name in error data', () => {
			const errors = [];
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
					getAncestors: () => [],
				},
				options: [],
				report: error => errors.push(error),
			};

			const handlers = requireExportedTypesRule.create(context);
			const typeHandler = handlers['ExportNamedDeclaration > TSTypeAliasDeclaration'];

			typeHandler({id: {name: 'TestType'}});
			assert.equal(errors[0].messageId, 'missingExport');
			assert.equal(errors[0].data.typeName, 'TestType');
		});

		test('reports correct node location', () => {
			const errors = [];
			const testNode = {id: {name: 'LocationTest'}};
			const context = {
				filename: '/project/source/foo.d.ts',
				sourceCode: {
					parserServices: {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					},
					getAncestors: () => [],
				},
				options: [],
				report: error => errors.push(error),
			};

			const handlers = requireExportedTypesRule.create(context);
			const typeHandler = handlers['ExportNamedDeclaration > TSTypeAliasDeclaration'];

			typeHandler(testNode);
			assert.equal(errors[0].node, testNode);
		});
	});
});
