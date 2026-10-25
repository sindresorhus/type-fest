import assert from 'node:assert/strict';
import {test} from 'node:test';
import {Linter} from 'eslint';
import tsParser from '@typescript-eslint/parser';
import xoConfig from 'xo/eslint-adapter';
import {jsdocCodeblocksProcessor} from './jsdoc-codeblocks.js';

const stylisticPlugin = xoConfig.find(configuration => configuration.plugins?.['@stylistic']).plugins['@stylistic'];

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';
	for (const {name, range, text} of [
		{name: 'insertion', range: [0, 0], text: '// Added.\n'},
		{name: 'whitespace edit', range: [0, 1], text: ''},
		{name: 'multiline replacement', range: [0, 1 + newline.length], text: '// Added.\n'},
	]) {
		test(`${lineEndingName} ${name} on a short blank line preserves the direct virtual edit`, () => {
			const filename = `test-short-blank-edit-${lineEndingName}-${name}.d.ts`;
			const code = ['/**', '\t\t```ts', ' ', '\t\tconst value = 1;', '\t\t```', '*/', 'export type Example = string;'].join(newline);
			const [, virtualFile] = jsdocCodeblocksProcessor.preprocess(code, filename);
			const expected = virtualFile.text.slice(0, range[0]) + text + virtualFile.text.slice(range[1]);
			const fix = {range, text};
			const [message] = jsdocCodeblocksProcessor.postprocess([[], [{
				ruleId: 'test/blank-line-edit', severity: 2, message: 'Edit the blank line.', line: 1, column: 1,
				fix: structuredClone(fix), suggestions: [{desc: 'Edit the blank line.', fix: structuredClone(fix)}],
			}]], filename);
			assert.deepEqual(message.suggestions[0].fix, message.fix);
			const output = code.slice(0, message.fix.range[0]) + message.fix.text + code.slice(message.fix.range[1]);
			const files = jsdocCodeblocksProcessor.preprocess(output, filename);
			assert.equal(files[1].text, expected);
			jsdocCodeblocksProcessor.postprocess(files.map(() => []), filename);
		});
	}
}

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';
	for (const indentation of ['\t\t', '  ']) {
		for (const blankPrefix of ['', indentation[0], indentation[0] === '\t' ? ' ' : '\t']) {
			for (const position of ['first', 'middle']) {
				test(`removing a ${position} ${lineEndingName} blank line with ${JSON.stringify(blankPrefix)} preserves ${JSON.stringify(indentation)} indentation`, () => {
					const filename = `test-short-blank-${lineEndingName}-${indentation.codePointAt(0)}-${blankPrefix.codePointAt(0)}-${position}.d.ts`;
					const leading = position === 'middle' ? [`${indentation}const first = 0;`] : [];
					const code = ['/**', `${indentation}\`\`\`ts`, ...leading, blankPrefix, `${indentation}const value = 1;`, `${indentation}\`\`\``, '*/', 'export type Example = 1;'].join(newline);
					const [, virtualFile] = jsdocCodeblocksProcessor.preprocess(code, filename);
					const configuration = [{
						files: ['**/*.ts'],
						languageOptions: {parser: tsParser},
						rules: {'no-multiple-empty-lines': ['error', {max: 0, maxBOF: 0, maxEOF: 0}]},
					}];
					const linter = new Linter();
					const directResult = linter.verifyAndFix(virtualFile.text, configuration, {filename: 'virtual.ts'});
					const messages = linter.verify(virtualFile.text, configuration, {filename: 'virtual.ts'});
					assert.equal(directResult.fixed, true);
					assert.equal(messages.length, 1);
					messages[0].suggestions = [{desc: 'Remove the blank line.', fix: structuredClone(messages[0].fix)}];
					const [message] = jsdocCodeblocksProcessor.postprocess([[], messages], filename);
					assert.deepEqual(message.suggestions[0].fix, message.fix);
					const {fix} = message;
					const output = code.slice(0, fix.range[0]) + fix.text + code.slice(fix.range[1]);
					assert.equal(output, code.replace(`${blankPrefix}${newline}${indentation}const value`, () => `${indentation}const value`));
					const files = jsdocCodeblocksProcessor.preprocess(output, filename);
					assert.equal(files[1].text, directResult.output);
					jsdocCodeblocksProcessor.postprocess(files.map(() => []), filename);
				});
			}
		}
	}
}

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';
	for (const indentation of ['', '\t']) {
		test(`mapping many ${lineEndingName} fixes preserves ${JSON.stringify(indentation)} indentation and source ranges`, () => {
			const filename = `test-many-fixes-${lineEndingName}-${indentation.length}.d.ts`;
			const declarations = Array.from({length: 20}, (_, index) => `let value${index} = ${index};`);
			const example = [...declarations, `console.log(${declarations.map((_, index) => `value${index}`).join(', ')});`];
			const code = ['/**', `${indentation}\`\`\`ts`, ...example.map(line => indentation + line), `${indentation}\`\`\``, '*/', 'export type Example = string;'].join(newline);
			const [, virtualFile] = jsdocCodeblocksProcessor.preprocess(code, filename);
			const messages = new Linter().verify(virtualFile.text, [{files: ['**/*.ts'], languageOptions: {parser: tsParser}, rules: {'prefer-const': 'error'}}], {filename: 'virtual.ts'});
			const mapped = jsdocCodeblocksProcessor.postprocess([[], messages], filename);
			const expected = declarations.map(declaration => ({range: [code.indexOf(declaration), code.indexOf(declaration) + declaration.length], text: declaration.replace('let ', 'const ')}));
			assert.equal(mapped.length, declarations.length);
			assert.deepEqual(mapped.map(message => message.fix), expected);

			let fixed = code;

			for (const {fix} of mapped.toReversed()) {
				fixed = fixed.slice(0, fix.range[0]) + fix.text + fixed.slice(fix.range[1]);
			}

			assert.equal(fixed, code.replaceAll('let value', 'const value'));
		});
	}
}

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';
	test(`joining ${lineEndingName} lines cannot create a JSDoc terminator through a fix or suggestion`, () => {
		const filename = `test-joined-terminator-${lineEndingName}.d.ts`;
		const code = ['/**', '\t```ts', '\tconst text = `*', '\t/`;', '\t```', '*/', 'export type Example = string;'].join(newline);
		const [, virtualFile] = jsdocCodeblocksProcessor.preprocess(code, filename);
		const start = virtualFile.text.indexOf(newline);
		const fix = {range: [start, start + newline.length], text: ''};
		const [message] = jsdocCodeblocksProcessor.postprocess([[], [{
			ruleId: 'test/join',
			severity: 2,
			message: 'Join the lines.',
			line: 1,
			column: 1,
			fix: structuredClone(fix),
			suggestions: [{desc: 'Join the lines.', fix: structuredClone(fix)}],
		}]], filename);
		assert.equal(message.fix, undefined);
		assert.deepEqual(message.suggestions, []);
	});
}

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';
	for (const indentation of ['\t', '  ']) {
		for (const {rule, option, example} of [
			{rule: 'function-paren-newline', option: 'never', example: 'console.log(\n1);'},
			{rule: 'operator-linebreak', option: 'before', example: 'const value =\n1;'},
		]) {
			test(`${rule} ${lineEndingName} fixes and suggestions preserve ${JSON.stringify(indentation)} examples after joining lines`, () => {
				const filename = `test-line-boundary-${rule}-${lineEndingName}-${indentation.length}.d.ts`;
				const code = ['/**', `${indentation}\`\`\`ts`, ...example.split('\n').map(line => indentation + line), `${indentation}\`\`\``, '*/', 'export type Example = string;'].join(newline);
				const [, virtualFile] = jsdocCodeblocksProcessor.preprocess(code, filename);
				const linter = new Linter();
				const configuration = [{
					files: ['**/*.ts'],
					languageOptions: {parser: tsParser},
					plugins: {style: stylisticPlugin},
					rules: {[`style/${rule}`]: ['error', option]},
				}];
				const directResult = linter.verifyAndFix(virtualFile.text, configuration, {filename: 'virtual.ts'});
				const messages = linter.verify(virtualFile.text, configuration, {filename: 'virtual.ts'});
				assert.equal(directResult.fixed, true);
				assert.deepEqual(directResult.messages, []);
				assert.equal(messages.length, 1);
				messages[0].suggestions = [{desc: 'Apply the same edit.', fix: structuredClone(messages[0].fix)}];
				const [message] = jsdocCodeblocksProcessor.postprocess([[], messages], filename);
				const opening = ['/**', `${indentation}\`\`\`ts`].join(newline);
				const closing = [`${indentation}\`\`\``, '*/', 'export type Example = string;'].join(newline);
				const indentedOutput = directResult.output.replaceAll('\n', () => `\n${indentation}`);
				const expectedCode = `${opening}${newline}${indentation}${indentedOutput}${newline}${closing}`;
				assert.deepEqual(message.suggestions[0].fix, message.fix);
				const {fix} = message;
				const output = code.slice(0, fix.range[0]) + fix.text + code.slice(fix.range[1]);
				assert.equal(output, expectedCode);
				const files = jsdocCodeblocksProcessor.preprocess(output, filename);
				assert.equal(files[1].text, directResult.output);
				jsdocCodeblocksProcessor.postprocess(files.map(() => []), filename);
				const processorConfiguration = [...configuration, {files: ['**/*.d.ts'], processor: jsdocCodeblocksProcessor}];
				const processedResult = linter.verifyAndFix(code, processorConfiguration, {filename, filterCodeBlock: virtualFilename => virtualFilename.endsWith('.ts')});
				assert.deepEqual(processedResult.messages, []);
				assert.equal(processedResult.output, expectedCode);
			});
		}
	}
}

test('multiline locations apply each endpoint line\'s removed prefix independently', () => {
	const filename = 'test-mixed-location-indentation.d.ts';
	const code = ['/**', '\t\t```ts', '\t\tconst first = 1;', '\t', '\t\tconst second = 2;', '\t\t```', '*/', 'export type Example = string;'].join('\n');
	jsdocCodeblocksProcessor.preprocess(code, filename);
	const messages = [
		{line: 2, column: 1, endLine: 3, endColumn: 6},
		{line: 1, column: 1, endLine: 2, endColumn: 2},
		{line: 1, column: 1, endLine: 2, endColumn: 1},
	].map(location => ({ruleId: 'test/location', severity: 2, message: 'Check location.', ...location}));
	const mapped = jsdocCodeblocksProcessor.postprocess([[], messages], filename);
	assert.deepEqual(mapped.map(({line, column, endLine, endColumn}) => ({line, column, endLine, endColumn})), [
		{line: 4, column: 1, endLine: 5, endColumn: 8},
		{line: 3, column: 3, endLine: 4, endColumn: 2},
		{line: 3, column: 3, endLine: 4, endColumn: 1},
	]);
});

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';
	for (const whitespace of ['\t', '  ']) {
		test(`partial ${lineEndingName} blank-line indentation keeps diagnostic columns inside the source line: ${JSON.stringify(whitespace)}`, () => {
			const filename = `test-blank-location-${lineEndingName}-${whitespace.length}.d.ts`;
			const code = ['/**', '\t\t```ts', '\t\tconst first = 1;', whitespace, '\t\tconst second = 2;', '\t\t```', '*/', 'export type Example = string;'].join(newline);
			const [, virtualFile] = jsdocCodeblocksProcessor.preprocess(code, filename);
			const configuration = [{files: ['**/*.ts'], languageOptions: {parser: tsParser}, rules: {'no-trailing-spaces': 'error'}}];
			const linter = new Linter();
			const messages = linter.verify(virtualFile.text, configuration, {filename: 'virtual.ts'});
			const [message] = jsdocCodeblocksProcessor.postprocess([[], messages], filename);
			const index = code.indexOf(`${newline}${whitespace}${newline}`) + newline.length;
			assert.equal(messages.length, 1);
			assert.deepEqual({line: message.line, column: message.column, endLine: message.endLine, endColumn: message.endColumn}, {line: 4, column: 1, endLine: 4, endColumn: whitespace.length + 1});
			assert.deepEqual(message.fix.range, [index, index + whitespace.length]);
			const output = code.slice(0, message.fix.range[0]) + message.fix.text + code.slice(message.fix.range[1]);
			const files = jsdocCodeblocksProcessor.preprocess(output, filename);
			assert.equal(files[1].text, linter.verifyAndFix(virtualFile.text, configuration, {filename: 'virtual.ts'}).output);
			jsdocCodeblocksProcessor.postprocess(files.map(() => []), filename);
		});
	}
}

test('CRLF to LF fixes in indented examples do not add a blank line before the closing fence', () => {
	const code = ['/**', '\t```ts', '\tconst value = 1;', '\t```', '*/', 'export type Example = string;', ''].join('\r\n');
	const result = new Linter().verifyAndFix(code, [
		{files: ['**/*.ts'], languageOptions: {parser: tsParser}, plugins: {style: stylisticPlugin}, rules: {'style/linebreak-style': ['error', 'unix']}},
		{files: ['**/*.d.ts'], processor: jsdocCodeblocksProcessor},
	], {filename: 'test-crlf-closing-fence.d.ts', filterCodeBlock: filename => filename.endsWith('.ts')});
	assert.deepEqual(result.messages, []);
	assert.equal(result.output, code.replaceAll('\r\n', '\n'));
});
