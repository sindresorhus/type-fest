import assert from 'node:assert/strict';
import {test} from 'node:test';
import {getCodeblocks} from './codeblocks.js';

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';
	test(`fence scanning preserves ${lineEndingName} bodies, languages and offsets`, () => {
		const indentation = ' \t';
		const first = [`${indentation}\`\`\` ts `, `${indentation}const marker = 'inline \`\`\`';`, `${indentation}\`\`\` `].join(newline);
		const second = ['```json', '```ts', 'not TypeScript !!!', '```'].join(newline);
		const unfinished = ['```ts', 'unfinished', '```typescript', 'still unfinished'].join(newline);
		const text = [first, second, unfinished].join(newline);
		const blocks = [...getCodeblocks(text)];
		assert.deepEqual(blocks, [{
			code: `${indentation}const marker = 'inline \`\`\`';${newline}`,
			language: ` ts ${newline === '\r\n' ? '\r' : ''}`,
			indent: indentation,
			index: 0,
			codeStart: text.indexOf(`${indentation}const marker`),
		}, {
			code: ['```ts', 'not TypeScript !!!', ''].join(newline),
			language: `json${newline === '\r\n' ? '\r' : ''}`,
			indent: '',
			index: text.indexOf('```json'),
			codeStart: text.indexOf('```ts', text.indexOf('```json')),
		}]);
	});
}

test('fence scanning accepts an EOF closing fence and ignores incomplete blocks', () => {
	assert.deepEqual([...getCodeblocks('```ts\n```')], [{code: '', language: 'ts', indent: '', index: 0, codeStart: 6}]);
	assert.deepEqual([...getCodeblocks('```')], []);
	assert.deepEqual([...getCodeblocks('```ts\nconst value = 1;')], []);
	assert.deepEqual([...getCodeblocks('Inline ```ts\nconst value = 1;\n```')], []);
});
