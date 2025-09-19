import {test, describe} from 'node:test';
import assert from 'node:assert/strict';
import {requireExportedTypesRule} from './require-exported-types.js';

const rule = requireExportedTypesRule;

// Helper to create a mock context
const createContext = (filename, options = {}) => {
	const errors = [];
	const hasTypeInfo = options.hasTypeInfo !== false;

	return {
		context: {
			filename,
			sourceCode: {
				parserServices: hasTypeInfo
					? {
						program: {
							getTypeChecker: () => ({getSymbolAtLocation: () => null}),
							getSourceFile: () => null,
						},
						esTreeNodeToTSNodeMap: new Map(),
					}
					: {},
				getAncestors: () => options.ancestors ?? [],
			},
			options: options.config ? [options.config] : [],
			report: error => errors.push(error),
		},
		errors,
	};
};

// Helper to test if rule skips certain files
const testSkipsFile = (description, filename) => {
	test(description, () => {
		const {context} = createContext(filename);
		const handlers = rule.create(context);
		assert.deepEqual(handlers, {});
	});
};

// Helper to test type/interface handling
const testTypeHandling = handlerKey => {
	const handler = handlerKey.includes('TypeAlias') ? 'type' : 'interface';

	test(`skips ${handler}s starting with underscore`, () => {
		const {context, errors} = createContext('/project/source/foo.d.ts');
		const handlers = rule.create(context);
		handlers[handlerKey]({id: {name: '_InternalType'}});
		assert.equal(errors.length, 0);
	});

	test(`reports ${handler}s not starting with underscore`, () => {
		const {context, errors} = createContext('/project/source/foo.d.ts');
		const handlers = rule.create(context);
		handlers[handlerKey]({id: {name: 'PublicType'}});
		assert.equal(errors.length, 1);
		assert.equal(errors[0].data.typeName, 'PublicType');
		assert.equal(errors[0].messageId, 'missingExport');
	});

	test(`skips ${handler}s inside declare namespace`, () => {
		const {context, errors} = createContext('/project/source/foo.d.ts', {
			ancestors: [{type: 'TSModuleDeclaration', declare: true}],
		});
		const handlers = rule.create(context);
		handlers[handlerKey]({id: {name: 'TypeInNamespace'}});
		assert.equal(errors.length, 0);
	});

	test(`reports ${handler}s outside declare namespace`, () => {
		const {context, errors} = createContext('/project/source/foo.d.ts', {
			ancestors: [{type: 'TSModuleDeclaration', declare: false}],
		});
		const handlers = rule.create(context);
		handlers[handlerKey]({id: {name: 'TypeOutsideNamespace'}});
		assert.equal(errors.length, 1);
	});

	test(`deduplicates ${handler} processing`, () => {
		const {context, errors} = createContext('/project/source/foo.d.ts');
		const handlers = rule.create(context);
		const node = {id: {name: 'DuplicateType'}};
		handlers[handlerKey](node);
		handlers[handlerKey](node);
		handlers[handlerKey](node);
		assert.equal(errors.length, 1);
	});
};

describe('require-exported-types ESLint rule', () => {
	describe('rule metadata', () => {
		test('has correct structure', () => {
			assert.ok(rule.meta);
			assert.equal(rule.meta.type, 'suggestion');
			assert.ok(rule.meta.docs);
			assert.ok(rule.meta.messages);
			assert.ok(rule.create);
			assert.equal(typeof rule.create, 'function');
		});

		test('has correct documentation', () => {
			const {meta} = rule;
			assert.equal(meta.docs.description, 'Enforce that exported types are also exported from index.d.ts');
			assert.equal(meta.docs.category, 'Best Practices');
			assert.equal(meta.docs.recommended, true);
			assert.ok(meta.messages.missingExport.includes('Type `{{typeName}}`'));
			assert.ok(meta.messages.missingExport.includes('index.d.ts'));
			assert.ok(meta.messages.noTypeInfo.includes('TypeScript type information'));
		});

		test('has correct schema', () => {
			const {schema} = rule.meta;
			assert.ok(Array.isArray(schema));
			assert.equal(schema.length, 1);
			assert.equal(schema[0].type, 'object');
			assert.ok(schema[0].properties.indexFile);
		});
	});

	describe('file filtering', () => {
		testSkipsFile('skips non-.d.ts files', '/project/source/foo.ts');
		testSkipsFile('skips files outside source directory', '/project/test/foo.d.ts');
		testSkipsFile('skips internal files', '/project/source/internal/foo.d.ts');

		test('processes source/*.d.ts files', () => {
			const {context} = createContext('/project/source/foo.d.ts');
			const handlers = rule.create(context);
			assert.ok(handlers['ExportNamedDeclaration > TSTypeAliasDeclaration']);
			assert.ok(handlers['ExportNamedDeclaration > TSInterfaceDeclaration']);
			assert.ok(handlers['Program:exit']);
		});
	});

	describe('TypeScript type information', () => {
		test('requires type information', () => {
			const {context} = createContext('/project/source/foo.d.ts', {hasTypeInfo: false});
			const handlers = rule.create(context);
			assert.ok(handlers.Program);
			assert.equal(typeof handlers.Program, 'function');
		});

		test('reports noTypeInfo when missing', () => {
			const {context, errors} = createContext('/project/source/foo.d.ts', {hasTypeInfo: false});
			const handlers = rule.create(context);
			handlers.Program({type: 'Program'}); // eslint-disable-line new-cap
			assert.equal(errors[0].messageId, 'noTypeInfo');
		});
	});

	describe('type alias handling', () => {
		testTypeHandling('ExportNamedDeclaration > TSTypeAliasDeclaration');
	});

	describe('interface handling', () => {
		testTypeHandling('ExportNamedDeclaration > TSInterfaceDeclaration');
	});

	describe('options', () => {
		test('accepts custom index file', () => {
			const {context} = createContext('/project/source/foo.d.ts', {
				config: {indexFile: 'custom-index.d.ts'},
			});
			const handlers = rule.create(context);
			assert.ok(handlers['ExportNamedDeclaration > TSTypeAliasDeclaration']);
		});
	});

	describe('cache management', () => {
		test('has cleanup handler that does not throw', () => {
			const {context} = createContext('/project/source/foo.d.ts');
			const handlers = rule.create(context);
			assert.ok(handlers['Program:exit']);
			assert.doesNotThrow(() => handlers['Program:exit']()); // eslint-disable-line new-cap
		});
	});

	describe('error reporting', () => {
		test('includes type name and correct node', () => {
			const {context, errors} = createContext('/project/source/foo.d.ts');
			const handlers = rule.create(context);
			const node = {id: {name: 'TestType'}};

			// eslint-disable-next-line new-cap
			handlers['ExportNamedDeclaration > TSTypeAliasDeclaration'](node);

			assert.equal(errors[0].messageId, 'missingExport');
			assert.equal(errors[0].data.typeName, 'TestType');
			assert.equal(errors[0].node, node);
		});
	});
});
