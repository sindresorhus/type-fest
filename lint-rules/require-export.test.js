import {test} from 'node:test';
import assert from 'node:assert/strict';
import {requireExportRule} from './require-export.js';

const createContext = (filename, errors = []) => ({
	filename,
	report: error => errors.push(error),
});

const runRule = (filename, nodeHandlers = {}) => {
	const errors = [];
	const context = createContext(filename, errors);
	const handlers = requireExportRule.create(context);

	for (const [handler, node] of Object.entries(nodeHandlers)) {
		handlers[handler]?.(node);
	}

	const exitHandler = handlers['Program:exit'];
	if (exitHandler) {
		exitHandler({type: 'Program'});
	}

	return errors;
};

test('ignores non-.d.ts files', () => {
	const handlers = requireExportRule.create(createContext('/source/foo.ts'));
	assert.deepEqual(handlers, {});
});

test('ignores files outside source', () => {
	const handlers = requireExportRule.create(createContext('/test/foo.d.ts'));
	assert.deepEqual(handlers, {});
});

test('processes source .d.ts files', () => {
	const handlers = requireExportRule.create(createContext('/source/foo.d.ts'));
	assert.ok(handlers['Program:exit']);
});

test('passes with export {}', () => {
	const errors = runRule('/source/foo.d.ts', {
		ExportNamedDeclaration: {declaration: null, specifiers: [], source: null},
	});
	assert.equal(errors.length, 0);
});

test('fails without export {}', () => {
	const errors = runRule('/source/foo.d.ts');
	assert.equal(errors.length, 1);
	assert.equal(errors[0].messageId, 'noEmptyExport');
});

test('fails with non-empty export', () => {
	const errors = runRule('/source/foo.d.ts', {
		ExportNamedDeclaration: {declaration: null, specifiers: [{type: 'ExportSpecifier'}]},
	});
	assert.equal(errors.length, 1);
});

test('auto-fix adds export {}', () => {
	const errors = runRule('/source/foo.d.ts');
	const fix = errors[0].fix({
		insertTextAfter: (node, text) => ({node, text}),
	});
	assert.equal(fix.text, '\nexport {};\n');
});
