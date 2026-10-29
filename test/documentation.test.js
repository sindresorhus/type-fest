import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {test} from 'node:test';
import ts from 'typescript';

async function loadExample(filename, exportName) {
	const source = await fs.readFile(new URL(`../source/${filename}`, import.meta.url), 'utf8');
	const example = source.match(/@example\s+```\n(?<code>[\s\S]*?)\n```/v)?.groups.code;
	assert.ok(example, 'The documented example must be present.');
	const {outputText} = ts.transpileModule([example, `export {${exportName}};`].join('\n'), {
		compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext},
	});
	const module = await import(`data:text/javascript,${encodeURIComponent(outputText)}`);
	return module[exportName];
}

test('TupleToUnion request validation example accepts only known destinations', async () => {
	const verifyRequestBody = await loadExample('tuple-to-union.d.ts', 'verifyRequestBody');
	const invalidInputs = [null, undefined, false, 0, 'a', [], {}, {deliverTo: undefined}, {deliverTo: 'unknown'}, {deliverTo: 1}];
	assert.deepEqual(invalidInputs.map(input => verifyRequestBody(input)), invalidInputs.map(() => false));

	assert.deepEqual(['a', 'b', 'c'].map(deliverTo => verifyRequestBody({deliverTo})), [true, true, true]);

	assert.equal(verifyRequestBody({deliverTo: 'a', requestId: 'request-1'}), true);
});

test('UnknownRecord plain object example distinguishes records from built-ins and instances', async () => {
	const isPlainObject = await loadExample('unknown-record.d.ts', 'isPlainObject');
	class Example {
		value = 1;
	}

	const rejected = [null, undefined, false, 1, 'record', [], new Date(), new Map(), new Set(), new Example(), () => ({value: 1})];
	assert.deepEqual(rejected.map(value => isPlainObject(value)), rejected.map(() => false));

	const records = [{}, {value: 1}, Object.create(null), Object.assign(Object.create(null), {value: 1})];
	assert.deepEqual(records.map(value => isPlainObject(value)), [true, true, true, true]);
});
