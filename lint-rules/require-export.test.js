import {test} from 'node:test';
import assert from 'node:assert/strict';
import {requireExportRule} from './require-export.js';

const createContext = (filename, errors = []) => ({
	filename,
	report: error => errors.push(error),
});

const runRule = (filename, node) => {
	const errors = [];
	const context = createContext(filename, errors);
	const handlers = requireExportRule.create(context);

	for (const handler of Object.keys(handlers)) {
		handlers[handler]?.(node);
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
	const errors = runRule('/source/foo.d.ts', {declaration: null, specifiers: [], source: null});
	assert.equal(errors.length, 0);
});

test('fails without export {}', () => {
	const errors = runRule('/source/foo.d.ts', {declaration: null, specifiers: [{type: 'ExportSpecifier'}]});
	assert.equal(errors.length, 1);
});

test('auto-fix adds export {}', () => {
	const node = {declaration: null, specifiers: [{type: 'ExportSpecifier'}]};
	const errors = runRule('/source/foo.d.ts', node);
	const fix = errors[0].fix({
		insertTextAfter: (node, text) => ({node, text}),
	});
	assert.equal(fix.node, node);
	assert.equal(fix.text, '\nexport {};\n');
});
