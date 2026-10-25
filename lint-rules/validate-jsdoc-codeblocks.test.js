/* eslint-disable max-lines -- Many test cases. */
import assert from 'node:assert/strict';
import path from 'node:path';
import {test} from 'node:test';
import {Linter} from 'eslint';
import tsParser from '@typescript-eslint/parser';
import {code1, code2, createRuleTester, dedenter, errorAt as errorAt_, exportType, exportTypeAndOption, fence, jsdoc} from './testing-utilities.js';
import {validateJSDocCodeblocksRule} from './validate-jsdoc-codeblocks.js';

const ruleTester = createRuleTester();

const codeWithErrors = dedenter`
import type {RemovePrefix} from 'type-fest';

type A = RemovePrefix<'on-change', string, {strict: "yes"}>;
`;

const invalidCodeblockErrorAt = props => errorAt_({...props, messageId: 'invalidCodeblock'});
const incorrectTwoslashTypeErrorAt = props => errorAt_({...props, messageId: 'incorrectTwoslashType'});
const incorrectTwoslashFormatErrorAt = props => errorAt_({...props, messageId: 'incorrectTwoslashFormat'});

test('validates source edits before the source is first imported by an example', async () => {
	// A fresh environment ensures earlier examples have not already loaded the source from disk.
	const {validateJSDocCodeblocksRule: freshRule} = await import('./validate-jsdoc-codeblocks.js?unloaded-source');
	const linter = new Linter();
	const configuration = [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: freshRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: []}]},
	}];
	const filename = path.resolve(import.meta.dirname, '../source/trim.d.ts');
	const results = ['unsaved', 'edited-again'].map(result => {
		const code = `${jsdoc(fence(`import type {Trim} from 'type-fest';\ntype Value = Trim<' value '>;\n//=> '${result}'`))}\nexport type Trim<Value extends string> = '${result}';\nexport {};`;
		const valid = linter.verify(code, configuration, {filename});
		const messages = linter.verify(code.replace(`//=> '${result}'`, '//=> never'), configuration, {filename});
		return {valid, messages};
	});
	assert.deepEqual(results.map(({valid}) => valid), [[], []]);
	assert.deepEqual(results.map(({messages}) => messages.length), [1, 1]);
	assert.deepEqual(results.map(({messages}) => messages[0].messageId), ['incorrectTwoslashType', 'incorrectTwoslashType']);
	assert.deepEqual(results.map(({messages}) => messages[0].fix.text), ['//=> \'unsaved\'', '//=> \'edited-again\'']);
});

test('syntax errors suppress semantic errors in the same example', () => {
	const linter = new Linter();
	const configuration = [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: []}]},
	}];
	const code = exportType(jsdoc(fence('const broken = ;\nconst count: number = "wrong";')));
	const messages = linter.verify(code, configuration, {filename: 'diagnostics.ts'});
	assert.equal(messages.length, 1);
	assert.equal(messages[0].messageId, 'invalidCodeblock');
	assert.equal(messages[0].message, 'Expression expected.');

	const repaired = linter.verify(code.replace('const broken = ;', 'const broken = 1;'), configuration, {filename: 'diagnostics.ts'});
	assert.equal(repaired.length, 1);
	assert.equal(repaired[0].messageId, 'invalidCodeblock');
	assert.match(repaired[0].message, /not assignable to type 'number'/v);
});

test('markerless examples still validate code and later examples still validate assertions', () => {
	const linter = new Linter();
	const configuration = [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: []}]},
	}];
	const code = exportType(jsdoc(
		fence('const incorrect: number = "wrong";'),
		fence('const valid = {count: 1};'),
		fence('const count = 1;\n//=> number'),
	));
	const messages = linter.verify(code, configuration, {filename: 'markerless.ts'});
	assert.deepEqual(messages.map(({messageId}) => messageId), ['invalidCodeblock', 'incorrectTwoslashType']);
	assert.match(messages[0].message, /not assignable to type 'number'/v);
	assert.equal(messages[1].fix.text, '//=> 1');
});

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';
	test(`unfinished ${lineEndingName} fences preserve earlier assertion diagnostics and fixes`, () => {
		const linter = new Linter();
		const configuration = [{
			files: ['**/*.ts'],
			languageOptions: {parser: tsParser},
			plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
			rules: {'test/validate': ['error', {verbosityLevels: []}]},
		}];
		const unfinished = Array.from({length: 400}, () => ['```ts', 'const unfinished = 1;'].join(newline)).join(newline);
		const code = ['/**', '```json', 'not TypeScript !!!', '```', '```ts', 'const count = 1;', '//=> number', '```', unfinished, '*/', 'export type Example = string;'].join(newline);
		const messages = linter.verify(code, configuration, {filename: `unfinished-${lineEndingName}.ts`});
		assert.deepEqual(messages.map(message => message.messageId), ['incorrectTwoslashType']);
		assert.deepEqual(messages[0].fix, {range: [code.indexOf('//=> number'), code.indexOf('//=> number') + '//=> number'.length], text: '//=> 1'});
		const result = linter.verifyAndFix(code, configuration, {filename: `unfinished-${lineEndingName}.ts`});
		assert.deepEqual(result.messages, []);
		assert.equal(result.output, code.replace('//=> number', '//=> 1'));
	});
}

test('incompatible compiler option overrides use defaults without interrupting later examples', () => {
	const linter = new Linter();
	const configuration = [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: []}]},
	}];
	const results = ['moduleResolution: Bundler', 'module: ESNext'].map(override => {
		const code = exportType(jsdoc(
			fence(`// @${override}\nconst incorrect: number = "wrong";`),
			fence('const valid = 1;\n//=> 1'),
			fence('const count = 2;\n//=> number'),
		));
		return linter.verify(code, configuration, {filename: 'compiler-options.ts'});
	});
	assert.deepEqual(results.map(messages => messages.map(({messageId}) => messageId)), [
		['invalidCodeblock', 'incorrectTwoslashType'],
		['invalidCodeblock', 'incorrectTwoslashType'],
	]);
	assert.ok(results.every(messages => messages[0].message.includes('not assignable to type \'number\'')));
	assert.deepEqual(results.map(messages => messages[1].fix.text), ['//=> 2', '//=> 2']);
});

test('indented assertions retain the requested verbosity choices and fully expanded fixes', () => {
	const linter = new Linter();
	const configuration = [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: [1, 2, 3]}]},
	}];
	const code = exportType(jsdoc(fence('function example() {\n\t\ttype Result = {outer: Pick<{inner: Pick<{value: string}, "value">}, "inner">};\n\t\t//=> unknown\n}')));
	const result = linter.verifyAndFix(code, configuration, {filename: 'verbosity.ts'});
	assert.deepEqual(result.messages, []);
	assert.equal(result.output, code.replace('//=> unknown', '//=> {outer: {inner: {value: string}}}'));
	const repeated = linter.verifyAndFix(result.output, configuration, {filename: 'verbosity.ts'});
	assert.equal(repeated.fixed, false);
	assert.deepEqual(repeated.messages, []);
});

test('leading indentation preserves literal contents and does not select a preceding line', () => {
	const linter = new Linter();
	const configuration = [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: []}]},
	}];
	const template = dedenter`\`first\${number}\n    second\``;
	const results = ['', ' '.repeat(4), '\t', ' \t '].map(indentation => {
		const example = [
			`type Text = ${template};`,
			'const previous = 1;',
			indentation,
			`${indentation}//=> number`,
			`${indentation}type Value = Text;`,
			`${indentation}//=> unknown`,
			`${indentation}type Unicode = '😀é';`,
			`${indentation}//=> unknown`,
		].join('\n');
		const code = exportType(jsdoc(fence(example)));
		const templateComment = `//=> ${template.replaceAll('\n', () => `\n${indentation}// `)}`;
		const expected = code.replace('//=> unknown', () => templateComment).replace('//=> unknown', '//=> \'😀é\'');
		const messages = linter.verify(code, configuration, {filename: 'indentation.ts'});
		const result = linter.verifyAndFix(code, configuration, {filename: 'indentation.ts'});
		const repeated = linter.verifyAndFix(result.output, configuration, {filename: 'indentation.ts'});
		return {messages, result, repeated, expected};
	});
	assert.deepEqual(results.map(({messages}) => messages.map(message => message.messageId)), results.map(() => ['incorrectTwoslashType', 'incorrectTwoslashType']));
	assert.deepEqual(results.map(({result}) => result.messages), results.map(() => []));
	assert.deepEqual(results.map(({result}) => result.output), results.map(({expected}) => expected));
	assert.deepEqual(results.map(({repeated}) => repeated.fixed), results.map(() => false));
	assert.deepEqual(results.map(({repeated}) => repeated.messages), results.map(() => []));
});

test('type printing stays independent across files and repeated lint passes', () => {
	const linter = new Linter();
	const configuration = [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: []}]},
	}];
	const cases = [
		{filename: 'unicode.ts', example: 'type Value = {readonly optional?: [1 | 2, \'é\' | \'😀\']};', expected: '//=> {readonly optional?: [1 | 2, \'é\' | \'😀\']}'},
		{filename: 'literal.ts', example: 'type Value = \'{ keep }\';', expected: '//=> \'{ keep }\''},
		{filename: 'callback.ts', example: 'type Value = (value: \'z\' | \'a\') => 9 | 1;', expected: '//=> (value: \'a\' | \'z\') => 1 | 9'},
	];
	const results = [...cases, ...cases.toReversed()].map(({filename, example, expected}) => {
		const code = exportType(jsdoc(fence(`${example}\n//=> unknown`)));
		const result = linter.verifyAndFix(code, configuration, {filename});
		return {result, expected: code.replace('//=> unknown', () => expected)};
	});
	assert.deepEqual(results.map(({result}) => result.messages), results.map(() => []));
	assert.deepEqual(results.map(({result}) => result.output), results.map(({expected}) => expected));
	const repeated = cases.map(({filename}, index) => linter.verifyAndFix(results[index].result.output, configuration, {filename}));
	assert.deepEqual(repeated.map(result => result.fixed), [false, false, false]);
	assert.deepEqual(repeated.map(result => result.messages), [[], [], []]);
});

test('repeated verbosity renderings preserve intermediate matches and the final expanded suggestion', () => {
	const linter = new Linter();
	const configuration = [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: [1, 2, 3]}]},
	}];
	const declaration = 'type Value = {account: Pick<{profile: Pick<{name: string}, \'name\'>}, \'profile\'>};';
	const intermediate = exportType(jsdoc(fence(`${declaration}\n//=> {account: {profile: Pick<{name: string}, 'name'>}}`)));
	assert.deepEqual(linter.verify(intermediate, configuration, {filename: 'intermediate.ts'}), []);
	const incorrect = exportType(jsdoc(fence(`${declaration}\n//=> unknown`)));
	const corrected = linter.verifyAndFix(incorrect, configuration, {filename: 'expanded.ts'});
	assert.deepEqual(corrected.messages, []);
	assert.equal(corrected.output, incorrect.replace('//=> unknown', '//=> {account: {profile: {name: string}}}'));

	const repeated = exportType(jsdoc(fence('const count = 1;\n//=> 1\nconst other = 2;\n//=> 2')));
	assert.deepEqual(linter.verify(repeated, configuration, {filename: 'repeated.ts'}), []);
});

ruleTester.run('validate-jsdoc-codeblocks', validateJSDocCodeblocksRule, {
	valid: [
		// Re-exporting another module does not expose a same-named local declaration.
		[jsdoc(fence(codeWithErrors)), 'type Example = string;', 'export type {Example} from \'./other.d.ts\';'].join('\n'),
		`${jsdoc(fence(codeWithErrors))}\ntype _Example = string;\nexport type {_Example as PublicExample};`,
		// A top-level export list must not select an unexported declaration in a nested scope.
		dedenter`
			type Example = string;
			export type {Example};
			declare namespace Nested {
				${jsdoc(fence(codeWithErrors))}
				type Example = number;
			}
		`,
		// Interfaces use the same public declaration boundary as type aliases.
		`${jsdoc(fence('const value = 1;\n//=> 1'))}\nexport interface Example {}`,
		`${jsdoc(fence(codeWithErrors))}\ninterface Example {}`,
		`${jsdoc(fence(codeWithErrors))}\nexport interface _Example {}`,
		// Member examples are checked only on declarations named Options.
		dedenter`
			export interface Example {
				${jsdoc(fence(codeWithErrors))}
				enabled?: boolean;
			}
		`,
		dedenter`
			export interface ExampleOptions {
				${jsdoc(fence('const enabled = true;\n//=> true'))}
				enabled?: boolean;
			}
		`,
		// A marker inside a multiline template is string content, not a type assertion.
		exportType(jsdoc(fence('const snippet = `\n//=> string\n`;'))),
		exportType(jsdoc(fence('type Value = \'{ value }\';\n//=> \'{ value }\''))),
		// Compiler directives and comment-like string contents remain outside the completed type.
		exportType(jsdoc(fence('const value = 1;\n//=> 1\n// @ts-expect-error A documented invalid assignment.\nconst next: number = \'wrong\';'))),
		exportType(jsdoc(fence('type Value = \'foo//bar\';\n//=> \'foo//bar\'\n// Keep this explanation.'))),
		// An explanation after a complete twoslash type is not part of that type.
		exportType(jsdoc(fence('const value = 1;\n//=> 1\n// Keep this explanation.\nconst next = 2;'))),
		// Fence info strings ignore surrounding whitespace without accepting other languages.
		exportType(jsdoc(fence(code1, ' ts '))),
		exportType(jsdoc(fence(code1, '\ttypescript\t'))),
		exportType(jsdoc(fence(code1, ' \t'))),
		exportType(jsdoc(fence('not TypeScript !!!', ' json '), fence(code1, ' ts '))),
		// Not exported
		dedenter`
			${jsdoc(fence(codeWithErrors))}
			type NotExported = string;
		`,
		dedenter`
			type NotExportedOptions = {
				${jsdoc(fence(codeWithErrors))}
				p1: string;
			}
		`,

		// Internal (leading underscore)
		dedenter`
			${jsdoc(fence(codeWithErrors))}
			export type _Internal = string;
		`,
		dedenter`
			export type _InternalOptions = {
				${jsdoc(fence(codeWithErrors))}
				p1: string;
			}
		`,

		// Without `Options` suffix
		dedenter`
			export type NoSuffix = {
				${jsdoc(fence(codeWithErrors))}
				p1: string;
			}
		`,

		// No JSDoc
		exportTypeAndOption(''),
		exportType('type Some = number;'),
		exportTypeAndOption('// Not block comment'),
		exportTypeAndOption('/* Block comment, but not JSDoc */'),

		// No codeblock in JSDoc
		exportType(jsdoc('No codeblock here')),

		// With text before and after
		exportTypeAndOption(jsdoc('Some description.', fence(code1), '@category Test')),

		// With line breaks before and after
		exportTypeAndOption(
			jsdoc('Some description.\n', 'Note: Some note.\n', fence(code1, 'ts'), '\n@category Test'),
		),

		// With `@example` tag
		exportTypeAndOption(jsdoc('@example', fence(code1))),

		// With language specifiers
		exportTypeAndOption(jsdoc(fence(code1, 'ts'))),
		exportTypeAndOption(jsdoc(fence(code1, 'typescript'))),

		// Inline backticks are part of the code, not a closing fence.
		exportTypeAndOption(jsdoc(fence('const marker = \'```\';'))),

		// Comments and regular expressions may also contain inline backticks.
		exportTypeAndOption(jsdoc(fence('// Inline ``` comment\nconst count = 1;\n//=> 1'))),
		exportTypeAndOption(jsdoc(fence('const marker = /```/v;'))),

		// Empty blocks and horizontal indentation around the closing fence remain valid.
		exportTypeAndOption(jsdoc('```\n```')),
		exportTypeAndOption(jsdoc('```ts\nconst count = 1;\n \t```\t ')),

		// Multiple code blocks
		exportTypeAndOption(
			jsdoc('@example', fence(code1, 'ts'), '\nSome text in between.\n', '@example', fence(code2)),
		),

		// Ignore other languages without treating their closing fence as an opening fence.
		exportTypeAndOption(jsdoc(fence('{"enabled": true}', 'json'), 'Some explanation.', fence(code1, 'ts'))),

		// Empty ignored fences are consumed too, and unsupported languages can occur between examples.
		exportTypeAndOption(jsdoc('```json\n```', 'Some explanation.', fence(code1, 'typescript'))),
		exportTypeAndOption(jsdoc(fence(code1), fence('not TypeScript !!!', 'text'), fence(code2, 'typescript'))),

		// Multiple exports and multiple properties
		exportTypeAndOption(jsdoc(fence(code1)), jsdoc(fence(code2))),

		// With @ts-expect-error
		exportTypeAndOption(jsdoc(fence(dedenter`
			import type {ExtractStrict} from 'type-fest';

			// @ts-expect-error
			type A = ExtractStrict<'foo' | 'bar', 'baz'>;
		`))),

		// Indented code blocks
		exportTypeAndOption(jsdoc(
			'Note:',
			dedenter`
				1. First point
					\`\`\`ts
					import type {Subtract} from 'type-fest';
					type A = Subtract<1, 2>;
					\`\`\`
				2. Second point
					\`\`\`ts
					import type {Sum} from 'type-fest';
					type A = Sum<1, 2>;
					\`\`\`
			`,
		)),

		// Compiler options overrides
		exportTypeAndOption(jsdoc(fence(dedenter`
			// @noUncheckedIndexedAccess: false
			const foo: number = [1, 2, 3][0];
		`))),

		// Incorrect compiler options are ignored
		exportTypeAndOption(jsdoc(fence(dedenter`
			// @noUnusedLocals: 'invalid-value'
			const foo = {a: 1};
		`))),

		// Line comment between JSDoc and type/option
		exportTypeAndOption(dedenter`
			${jsdoc(fence(code1))}
			// Some line comment between JSDoc and export
		`),
	],
	invalid: [
		// Export lists may precede the declaration, and several aliases still validate it only once.
		{
			code: `export type {Example as First, Example as Second, Example as default};\n${jsdoc(fence('const value: number = \'wrong\';'))}\ntype Example = string;`,
			errors: [invalidCodeblockErrorAt({line: 4, textBeforeStart: 'const ', target: 'value'})],
		},
		{
			code: dedenter`
				interface ExampleOptions {
					${jsdoc(fence('const value: number = \'wrong\';'))}
					enabled?: boolean;
				}
				export type {ExampleOptions};
			`,
			errors: [invalidCodeblockErrorAt({line: 4, textBeforeStart: '\tconst ', target: 'value'})],
		},
		{
			code: [jsdoc(fence('const value: number = \'wrong\';')), 'type Example = string;', 'export type {Example};'].join('\n'),
			errors: [invalidCodeblockErrorAt({line: 3, textBeforeStart: 'const ', target: 'value'})],
		},
		{
			code: `${jsdoc(fence('const value: number = \'wrong\';'))}\ninterface Example {}\nexport type {Example as PublicExample};`,
			errors: [invalidCodeblockErrorAt({line: 3, textBeforeStart: 'const ', target: 'value'})],
		},
		{
			code: `${jsdoc(fence('const value: number = \'wrong\';'))}\nexport default interface Example {}`,
			errors: [invalidCodeblockErrorAt({line: 3, textBeforeStart: 'const ', target: 'value'})],
		},
		// Interface option members have the same independently validated documentation as object type members.
		{
			code: dedenter`
				export interface ExampleOptions {
					${jsdoc(fence('const value: number = \'wrong\';'))}
					enabled?: boolean;
				}
			`,
			errors: [invalidCodeblockErrorAt({line: 4, textBeforeStart: '\tconst ', target: 'value'})],
		},
		{
			code: `${jsdoc(fence('const value: number = \'wrong\';'))}\nexport interface Example {}`,
			errors: [invalidCodeblockErrorAt({line: 3, textBeforeStart: 'const ', target: 'value'})],
		},
		// A parsed type must not also claim statements from an explanatory comment.
		{
			code: exportType(jsdoc(fence('const value = 1;\n//=> string |\n// Keep; save();'))),
			errors: [incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', endLine: 5, textBeforeEnd: '// Keep; save();'})],
			output: null,
		},
		// A dangling operator must not claim a word from an explanatory comment.
		{
			code: exportType(jsdoc(fence('const value = 1;\n//=> string |\n// Keep this explanation.'))),
			errors: [incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', endLine: 5, textBeforeEnd: '// Keep this explanation.'})],
			output: null,
		},
		{
			code: exportType(jsdoc(fence('const value = 1;\n//=> string &\n// Keep this explanation.'))),
			errors: [incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', endLine: 5, textBeforeEnd: '// Keep this explanation.'})],
			output: null,
		},
		// The same syntax boundary preserves CRLF and complete leading union/intersection members.
		{
			code: exportType(jsdoc(fence('const value = 1;\n//=> 2\n// Keep this explanation.'))).replaceAll('\n', '\r\n'),
			errors: [incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', target: '//=> 2'})],
			output: exportType(jsdoc(fence('const value = 1;\n//=> 1\n// Keep this explanation.'))).replaceAll('\n', '\r\n'),
		},
		{
			code: exportType(jsdoc(fence('type Value = string | number;\n//=> string\n// | number\n// Keep this explanation.'))),
			errors: [incorrectTwoslashFormatErrorAt({line: 4, textBeforeStart: '', endLine: 5, textBeforeEnd: '// | number'})],
			output: exportType(jsdoc(fence('type Value = string | number;\n//=> string | number\n// Keep this explanation.'))),
		},
		{
			code: exportType(jsdoc(fence('type Value = {a: 1} & {b: 2};\n//=> {a: 1}\n// & {b: 2}\n// Keep this explanation.'))),
			errors: [incorrectTwoslashFormatErrorAt({line: 4, textBeforeStart: '', endLine: 5, textBeforeEnd: '// & {b: 2}'})],
			output: exportType(jsdoc(fence('type Value = {a: 1} & {b: 2};\n//=> {a: 1} & {b: 2}\n// Keep this explanation.'))),
		},
		// A brace inside a nested line comment does not end the expected type.
		{
			code: exportType(jsdoc(fence('type Value = {a: string};\n//=> {\n// // A brace } stays inside this type comment.\n// a: string;\n// }\n// Keep this explanation.'))),
			errors: [incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', endLine: 7, textBeforeEnd: '// }'})],
			output: exportType(jsdoc(fence('type Value = {a: string};\n//=> {a: string}\n// Keep this explanation.'))),
		},
		// An incomplete multiline type has no safe autofix span.
		{
			code: exportType(jsdoc(fence('const value = {a: 1};\n//=> {a:\n// number\n// Keep this explanation.'))),
			errors: [incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', endLine: 6, textBeforeEnd: '// Keep this explanation.'})],
			output: null,
		},
		// Correcting the type must preserve the adjacent explanation.
		{
			code: exportType(jsdoc(fence('const value = 1;\n//=> 2\n// Keep this explanation.\nconst next = 2;'))),
			errors: [incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', target: '//=> 2'})],
			output: exportType(jsdoc(fence('const value = 1;\n//=> 1\n// Keep this explanation.\nconst next = 2;'))),
		},
		// A prose line that starts with inline triple backticks does not open a fence.
		{
			code: exportType(jsdoc('```foo``` is inline markdown.', fence('const value: string = 42;', 'ts'))),
			errors: [invalidCodeblockErrorAt({line: 4, textBeforeStart: 'const ', target: 'value'})],
		},
		// Spaced language tags still report real diagnostics at their original source positions.
		{
			code: exportType(jsdoc(fence('const value: string = 42;', ' ts '))),
			errors: [invalidCodeblockErrorAt({line: 3, textBeforeStart: 'const ', target: 'value'})],
		},
		{
			code: ['/**', '```\ttypescript\t', 'const value: string = 42;', '```', '*/', 'export type Result = string;'].join('\r\n'),
			errors: [invalidCodeblockErrorAt({line: 3, textBeforeStart: 'const ', target: 'value'})],
		},
		// CRLF must not make a TypeScript language identifier disappear from validation.
		{
			code: ['/**', '```ts', 'const value: string = 42;', '```', '*/', 'export type Result = string;'].join('\r\n'),
			errors: [invalidCodeblockErrorAt({line: 3, textBeforeStart: 'const ', target: 'value'})],
		},
		// Errors in a TypeScript block after an empty ignored block retain their source location.
		{
			code: exportType(jsdoc('```json\n```', 'Explanation.', fence('const value: number = \'wrong\';', 'typescript'))),
			errors: [invalidCodeblockErrorAt({line: 6, textBeforeStart: 'const ', target: 'value'})],
		},

		// A real error after an inline backtick comment must still be reported.
		{
			code: exportType(jsdoc(fence('// Inline ``` comment\nconst value: number = \'wrong\';'))),
			errors: [
				invalidCodeblockErrorAt({line: 4, textBeforeStart: 'const ', target: 'value'}),
			],
		},

		// Each block keeps its original diagnostic offsets, including indented option examples.
		{
			code: exportTypeAndOption(jsdoc(
				fence('const marker = \'```\';'),
				fence('// Inline ``` comment\nconst value: number = \'wrong\';', 'typescript'),
			)),
			errors: [
				invalidCodeblockErrorAt({line: 7, textBeforeStart: 'const ', target: 'value'}),
				invalidCodeblockErrorAt({line: 19, textBeforeStart: '\tconst ', target: 'value'}),
			],
		},

		// With text before and after
		{
			code: dedenter`
				/**
				Some description.
				\`\`\`ts
				type A = Subtract<1, 2>;
				\`\`\`
				@category Test
				*/
				export type T0 = string;

				export type TOptions = {
					/**
					Some description.
					\`\`\`ts
					type A = Subtract<1, 2>;
					\`\`\`
					@category Test
					*/
					p0: string;
				};
			`,
			errors: [
				invalidCodeblockErrorAt({line: 4, textBeforeStart: 'type A = ', target: 'Subtract'}),
				invalidCodeblockErrorAt({line: 14, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
			],
		},

		// With line breaks before and after
		{
			code: dedenter`
				/**
				Some description.

				Note: Some note.

				\`\`\`ts
				type A = Subtract<1, 2>;
				\`\`\`

				@category Test
				*/
				export type T0 = string;

				export type TOptions = {
					/**
					Some description.

					Note: Some note.

					\`\`\`ts
					type A = Subtract<1, 2>;
					\`\`\`

					@category Test
					*/
					p0: string;
				};
			`,
			errors: [
				invalidCodeblockErrorAt({line: 7, textBeforeStart: 'type A = ', target: 'Subtract'}),
				invalidCodeblockErrorAt({line: 21, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
			],
		},

		// With `@example` tag
		{
			code: dedenter`
				/**
				@example
				\`\`\`ts
				type A = Subtract<1, 2>;
				\`\`\`
				*/
				export type T0 = string;

				export type TOptions = {
					/**
					@example
					\`\`\`ts
					type A = Subtract<1, 2>;
					\`\`\`
					*/
					p0: string;
				};
			`,
			errors: [
				invalidCodeblockErrorAt({line: 4, textBeforeStart: 'type A = ', target: 'Subtract'}),
				invalidCodeblockErrorAt({line: 13, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
			],
		},

		// With language specifiers
		{
			code: dedenter`
				/**
				\`\`\`ts
				type A = Subtract<1, 2>;
				\`\`\`
				*/
				export type T0 = string;

				export type TOptions = {
					/**
					\`\`\`ts
					type A = Subtract<1, 2>;
					\`\`\`
					*/
					p0: string;
				};
			`,
			errors: [
				invalidCodeblockErrorAt({line: 3, textBeforeStart: 'type A = ', target: 'Subtract'}),
				invalidCodeblockErrorAt({line: 11, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
			],
		},
		{
			code: dedenter`
				/**
				\`\`\`typescript
				type A = Subtract<1, 2>;
				\`\`\`
				*/
				export type T0 = string;

				export type TOptions = {
					/**
					\`\`\`typescript
					type A = Subtract<1, 2>;
					\`\`\`
					*/
					p0: string;
				};
			`,
			errors: [
				invalidCodeblockErrorAt({line: 3, textBeforeStart: 'type A = ', target: 'Subtract'}),
				invalidCodeblockErrorAt({line: 11, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
			],
		},

		// Multiple code blocks
		{
			code: dedenter`
				/**
				@example
				\`\`\`ts
				type A = Subtract<1, 2>;
				\`\`\`

				Some text in between.

				@example
				\`\`\`ts
				import type {ExcludeStrict} from 'type-fest';

				type A = ExcludeStrict<string, number>;
				\`\`\`
				*/
				export type T0 = string;

				export type TOptions = {
					/**
					@example
					\`\`\`ts
					type A = Subtract<1, 2>;
					\`\`\`

					Some text in between.

					@example
					\`\`\`ts
					import type {ExcludeStrict} from 'type-fest';

					type A = ExcludeStrict<string, number>;
					\`\`\`
					*/
					p0: string;
				};
			`,
			errors: [
				invalidCodeblockErrorAt({line: 4, textBeforeStart: 'type A = ', target: 'Subtract'}),
				invalidCodeblockErrorAt({line: 13, textBeforeStart: 'type A = ExcludeStrict<string, ', target: 'number'}),
				invalidCodeblockErrorAt({line: 22, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
				invalidCodeblockErrorAt({line: 31, textBeforeStart: '\ttype A = ExcludeStrict<string, ', target: 'number'}),
			],
		},

		// Multiple exports and multiple properties
		{
			code: dedenter`
				/**
				\`\`\`ts
				type A = Subtract<1, 2>;
				\`\`\`
				*/
				export type T0 = string;

				/**
				\`\`\`ts
				import type {ExcludeStrict} from 'type-fest';

				type A = ExcludeStrict<string, number>;
				\`\`\`
				*/
				export type T1 = string;

				export type T0Options = {
					/**
					\`\`\`ts
					type A = Subtract<1, 2>;
					\`\`\`
					*/
					p0: string;

					/**
					\`\`\`ts
					import type {ExcludeStrict} from 'type-fest';

					type A = ExcludeStrict<string, number>;
					\`\`\`
					*/
					p1: string;
				};

				export type T1Options = {
					/**
					\`\`\`ts
					import type {Sum} from 'type-fest';

					Sum<1, 2>; //=> 3
					\`\`\`
					*/
					p0: string;
				};
			`,
			errors: [
				invalidCodeblockErrorAt({line: 3, textBeforeStart: 'type A = ', target: 'Subtract'}),
				invalidCodeblockErrorAt({line: 12, textBeforeStart: 'type A = ExcludeStrict<string, ', target: 'number'}),
				invalidCodeblockErrorAt({line: 20, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
				invalidCodeblockErrorAt({line: 29, textBeforeStart: '\ttype A = ExcludeStrict<string, ', target: 'number'}),
				invalidCodeblockErrorAt({line: 40, textBeforeStart: '\t', target: 'Sum'}),
			],
		},

		// Indented code blocks
		{
			code: dedenter`
				/**
				Note:
				1. First point
					\`\`\`ts
					type A = Subtract<1, 2>;
					\`\`\`
				2. Second point
					\`\`\`ts
					type A = Sum<1, 2>;
					\`\`\`
				*/
				export type T0 = string;

				export type TOptions = {
					/**
					Note:
					1. First point
						\`\`\`ts
						type A = Subtract<1, 2>;
						\`\`\`
					2. Second point
						\`\`\`ts
						type A = Sum<1, 2>;
						\`\`\`
					*/
					p0: string;
				};
			`,
			errors: [
				invalidCodeblockErrorAt({line: 5, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
				invalidCodeblockErrorAt({line: 9, textBeforeStart: '\ttype A = ', target: 'Sum'}),
				invalidCodeblockErrorAt({line: 19, textBeforeStart: '\t\ttype A = ', target: 'Subtract'}),
				invalidCodeblockErrorAt({line: 23, textBeforeStart: '\t\ttype A = ', target: 'Sum'}),
			],
		},

		// Missing import
		{
			code: dedenter`
				/**
				Description
				\`\`\`
				type A = Sum<1, 2>;
				//=> 3

				type B = Sum<-1, 2>;
				//=> 1
				\`\`\`
				*/
				export type Sum = string;
			`,
			errors: [
				invalidCodeblockErrorAt({line: 4, textBeforeStart: 'type A = ', target: 'Sum'}),
				invalidCodeblockErrorAt({line: 7, textBeforeStart: 'type B = ', target: 'Sum'}),
			],
		},

		// Floating examples
		{
			code: dedenter`
			/**
			\`\`\`ts
			import type {IsUppercase} from 'type-fest';

			IsUppercase<'ABC'>;
			//=> true

			IsUppercase<'Abc'>;
			//=> false
			\`\`\`
			@category Utilities
			*/
			export type IsUppercase = boolean;
			`,
			errors: [
				invalidCodeblockErrorAt({line: 5, textBeforeStart: '', target: 'IsUppercase'}),
				invalidCodeblockErrorAt({line: 8, textBeforeStart: '', target: 'IsUppercase'}),
			],
		},

		// Hypthetical references
		{
			code: dedenter`
				/**
				Some description
				Some note
				\`\`\`
				import type {Except} from 'type-fest';

				type PostPayload = Except<UserData, 'email'>;
				\`\`\`
				*/
				export type Except = string;
			`,
			errors: [
				invalidCodeblockErrorAt({line: 7, textBeforeStart: 'type PostPayload = Except<', target: 'UserData'}),
			],
		},

		// Duplicate identifiers
		{
			code: dedenter`
				export type IsTupleOptions = {
					/**
					@example
					\`\`\`
					import type {IsTuple} from 'type-fest';

					type Example = IsTuple<[number, ...number[]], {fixedLengthOnly: true}>;
					//=> false

					type Example = IsTuple<[number, ...number[]], {fixedLengthOnly: false}>;
					//=> true
					\`\`\`
					@default true
					*/
					fixedLengthOnly: boolean;
				};
			`,
			errors: [
				invalidCodeblockErrorAt({line: 7, textBeforeStart: '\ttype ', target: 'Example'}),
				invalidCodeblockErrorAt({line: 10, textBeforeStart: '\ttype ', target: 'Example'}),
			],
		},

		// Multi line error
		{
			code: dedenter`
				/**
				@example
				\`\`\`
				declare function updateConfig(newConfig: {name?: string; version?: number}): void;

				updateConfig({
					name: undefined,
					version: undefined,
				});
				\`\`\`
				@category Utilities
				*/
				export type MultiLine = string;
			`,
			errors: [
				invalidCodeblockErrorAt({line: 6, textBeforeStart: 'updateConfig(', endLine: 9, textBeforeEnd: '}'}),
			],
		},

		// Precise one character error
		{
			code: dedenter`
			/**
			\`\`\`
			import type {ExcludeStrict} from 'type-fest';

			type A = ExcludeStrict<'a' | 'b', 'A'>;
			\`\`\`
			*/
			export type ExcludeStrict = string;
			`,
			errors: [
				invalidCodeblockErrorAt({
					line: 5,
					textBeforeStart: 'type A = ExcludeStrict<\'a\' | \'b\', ',
					target: '\'A\'',
				}),
			],
		},

		// `exactOptionalPropertyTypes` is enabled
		{
			code: dedenter`
			/**
			\`\`\`
			const test: {foo?: string} = {foo: undefined};
			\`\`\`
			*/
			export type Test = string;
			`,
			errors: [
				invalidCodeblockErrorAt({line: 3, textBeforeStart: 'const ', target: 'test'}),
			],
		},

		// Overlapping errors
		{
			code: dedenter`
			/**
			\`\`\`typescript
			type Identity<T extends string> = T;
			type JustBoolean<T extends boolean> = T;

			type A = JustBoolean<Identity<number>>;
			\`\`\`
			*/
			export type Test = string;
			`,
			errors: [
				invalidCodeblockErrorAt({line: 6, textBeforeStart: 'type A = JustBoolean<', target: 'Identity<number>'}),
				invalidCodeblockErrorAt({line: 6, textBeforeStart: 'type A = JustBoolean<Identity<', target: 'number'}),
			],
		},

		// Compiler options overrides
		{
			code: dedenter`
			/**
			\`\`\`ts
			// @noUnusedLocals: true
			const foo = {a: 1};
			\`\`\`
			*/
			export type T0 = string;
			`,
			errors: [
				invalidCodeblockErrorAt({line: 4, textBeforeStart: 'const ', target: 'foo'}),
			],
		},
	],
});

// Type mismatch tests
ruleTester.run('validate-jsdoc-codeblocks', validateJSDocCodeblocksRule, {
	valid: [
		// CRLF line endings are not part of a correct twoslash comment or compiler option.
		['/**', '```ts', 'const count = 1;', '//=> 1', '```', '*/', 'export type Result = string;'].join('\r\n'),
		['/**', '```ts', '// @noUncheckedIndexedAccess: false', 'const values = [1, 2, 3];', 'const first = values[0];', '//=> number', '```', '*/', 'export type Result = string;'].join('\r\n'),
		exportTypeAndOption(jsdoc(fence(dedenter`
			type Foo = string;
			//=> string
		`))),

		// No twoslash comment at all
		exportTypeAndOption(jsdoc(fence(dedenter`
			const foo = 'bar';
		`))),

		// Twoslash comment at very first line
		exportTypeAndOption(jsdoc(fence(dedenter`
			//=> 'bar'
			const foo = 'bar';
		`))),

		// Object type collapsed into single line
		exportTypeAndOption(jsdoc(fence(dedenter`
			const foo = {a: 1, b: {c: 'c'}};
			//=> {a: number; b: {c: string}}
		`))),

		// Multiline type
		exportTypeAndOption(jsdoc(fence(dedenter`
			import type {Simplify} from 'type-fest';

			type Foo = {readonly a: number; readonly b?: number};
			type Bar = {c?: string; d: {readonly e: boolean}; e: string};
			type Baz = Simplify<Foo & Bar>;
			//=> {
			// 	readonly a: number;
			// 	readonly b?: number;
			// 	c?: string;
			// 	d: {
			// 		readonly e: boolean;
			// 	};
			// 	e: string;
			// }
		`))),

		// Quick info at 0th index
		exportTypeAndOption(jsdoc(fence(dedenter`
			let foo = 1;
			foo++;
			//=> number
		`))),

		// Quick info at some middle index
		exportTypeAndOption(jsdoc(fence(dedenter`
			const foo = 1 as string | number;
			//=> string | number
		`))),

		// Quick info at last index
		exportTypeAndOption(jsdoc(fence(dedenter`
			const foo = {n: 1}
			const bar = foo
				.n
			//=> number
		`))),

		// Double-quotes properly replaced
		exportTypeAndOption(jsdoc(fence(dedenter`
			import type {Simplify} from 'type-fest';

			type Foo = {a: 'abc'; b: 123; c: 'def'};
			type Bar = {x: {y: 'y'; z: 'z'}};
			type Baz = Simplify<Foo & Bar>;
			//=> {a: 'abc'; b: 123; c: 'def'; x: {y: 'y'; z: 'z'}}
		`))),
		exportTypeAndOption(jsdoc(fence(dedenter`
			type Foo = 'a"b"c';
			//=> 'a"b"c'

			type Bar = "d'e'f";
			//=> 'd\'e\'f'
		`))),

		// Space indentation properly replaced
		exportTypeAndOption(jsdoc(fence(dedenter`
			import type {Simplify} from 'type-fest';

			type Foo = {
				a: {
					ab: boolean;
					ac: {
						acd: string | number;
					};
				};
				e: [
					{
						fgh: false;
						ijk: {
							lmno: 'yes' | 'no';
						};
					},
					string,
					[
						'foo',
						'bar',
					],
				];
			};

			type Bar = Simplify<Foo>;
			//=> {
			// 	a: {
			// 		ab: boolean;
			// 		ac: {
			// 			acd: string | number;
			// 		};
			// 	};
			// 	e: [{
			// 		fgh: false;
			// 		ijk: {
			// 			lmno: 'yes' | 'no';
			// 		};
			// 	}, string, ['foo', 'bar']];
			// }
		`))),

		// Compiler options overrides
		exportTypeAndOption(jsdoc(fence(dedenter`
			// @noUncheckedIndexedAccess: false
			const values = [1, 2, 3];

			const first = values[0];
			//=> number
		`))),

		// Multiple `//=>`
		exportTypeAndOption(jsdoc(fence(dedenter`
			const foo = {a: true, b: false, c: {d: true}} as const;
			//=> {
			// 	readonly a: true;
			// 	readonly b: false;
			// 	readonly c: {
			// 		readonly d: true;
			// 	};
			// }
			const bar = ['a', 'b', 'c'] as const;
			//=> readonly ['a', 'b', 'c']
			const baz = new Set(bar);
			//=> Set<'a' | 'b' | 'c'>
		`))),

		// Indented code blocks
		exportTypeAndOption(jsdoc(
			'Note:',
			dedenter`
				1. First point
					\`\`\`ts
					import type {Subtract} from 'type-fest';
					type A = Subtract<1, 2>;
					//=> -1
					\`\`\`
				2. Second point
					\`\`\`ts
					import type {Sum} from 'type-fest';
					type A = Sum<1, 2>;
					//=> 3
					\`\`\`
			`,
		)),

		// Order of non-numbers in unions doesn't matter
		exportTypeAndOption(jsdoc(fence(dedenter`
			type Test = 'a' | 'b' | {x: ['c' | 'd' | 'e']; y: {z: 'f' | 'g' | 'h'}};

			type Valid = Test
			//=> 'b' | 'a' | {x: ['d' | 'c' | 'e']; y: {z: 'g' | 'h' | 'f'}}
			
			type Valid2 = Test
			//=> 'a' | {x: ['e' | 'd' | 'c']; y: {z: 'h' | 'g' | 'f'}} | 'b'
			
			type Valid3 = Test
			//=> {x: ['e' | 'c' | 'd']; y: {z: 'h' | 'f' | 'g'}} | 'b' | 'a'
		`))),

		// Numbers are sorted in unions
		exportTypeAndOption(jsdoc(fence(dedenter`
			import type {IntClosedRange} from 'type-fest';

			type ZeroToNine = IntClosedRange<0, 9>;
			//=> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
		`))),

		// Printing one member must not leak tuple, optional-property, or function formatting into the next.
		exportTypeAndOption(jsdoc(fence(dedenter`
			type First = {a?: 9 | 1; b: readonly ['😀' | 'é', 2 | 1]};
			//=> {a?: 1 | 9; b: readonly ['é' | '😀', 1 | 2]}

			type Second = {a: (value: 'z' | 'a') => 3 | 1; b: {x: 2 | 1}};
			//=> {a: (value: 'a' | 'z') => 1 | 3; b: {x: 1 | 2}}

			type Repeated = {first: 4 | 2; second: 4 | 2; third: 4 | 2};
			//=> {first: 2 | 4; second: 2 | 4; third: 2 | 4}
		`))),

		// Numbers in nested unions are sorted
		exportTypeAndOption(jsdoc(fence(dedenter`
			type Test = {w: 0 | 10 | 5; x: [2 | 16 | 4]; y: {z: 3 | 27 | 9}};
			//=> {w: 0 | 5 | 10; x: [2 | 4 | 16]; y: {z: 3 | 9 | 27}}
		`))),

		// Numbers in unions inside unions are sorted, non-numbers can be in any order
		exportTypeAndOption(jsdoc(fence(dedenter`
			type Test = {a: 'foo' | 27 | 1 | {b: 2 | 1 | 8 | 4} | 'baz' | 9 | 3 | 'bar'};

			type Valid = Test;
			//=> {a: 1 | 3 | 9 | 27 | {b: 1 | 2 | 4 | 8} | 'bar' | 'foo' | 'baz'}
			
			type Valid2 = Test;
			//=> {a: {b: 1 | 2 | 4 | 8} | 1 | 'foo' | 3 | 'baz' | 'bar' | 9 | 27}
			
			type Valid3 = Test;
			//=> {a: 'baz' | 'foo' | 1 | 3 | 9 | 'bar' | 27 | {b: 1 | 2 | 4 | 8}}
		`))),

		// Only numbers are sorted in unions, non-numbers can be in any order
		exportTypeAndOption(jsdoc(fence(dedenter`
			import type {ArrayElement} from 'type-fest';

			type Tuple1 = ArrayElement<[null, string, boolean, 1, 3, 0, -2, 4, 2, -1]>;
			//=> string | -2 | -1 | boolean | 0 | null | 1 | 2 | 3 | 4

			type Tuple2 = ArrayElement<[null, 1, 3, string, 0, -2, 4, 2, boolean, -1]>;
			//=> -2 | boolean | -1 | 0 | 1 | 2 | 3 | 4 | null | string
		`))),

		// Tuples are in single line
		exportTypeAndOption(jsdoc(fence(dedenter`
			import type {TupleOf} from 'type-fest';

			type RGB = TupleOf<3, number>;
			//=> [number, number, number]

			type TicTacToeBoard = TupleOf<3, TupleOf<3, 'X' | 'O' | null>>;
			//=> [['X' | 'O' | null, 'X' | 'O' | null, 'X' | 'O' | null], ['X' | 'O' | null, 'X' | 'O' | null, 'X' | 'O' | null], ['X' | 'O' | null, 'X' | 'O' | null, 'X' | 'O' | null]]
		`))),

		// Emojis are preserved
		exportTypeAndOption(jsdoc(fence(dedenter`
			type Pets = '🦄' | '🐶' | '🐇';
			//=> '🦄' | '🐶' | '🐇'
		`))),

		// `0` and `Infinity` verbosity levels
		exportTypeAndOption(jsdoc(fence(dedenter`
			type Test = {a: Pick<{b: Pick<{c: Pick<{d: 1}, 'd'>}, 'c'>}, 'b'>};

			type LevelZero = Test;
			//=> {a: {b: {c: {d: 1}}}}

			type LevelThree = Test;
			//=> {
			// 	a: Pick<{
			// 		b: Pick<{
			// 			c: Pick<{
			// 				d: 1;
			// 			}, 'd'>;
			// 		}, 'c'>;
			// 	}, 'b'>;
			// }
		`))),

		// Custom verbosity level
		// `0` and `Infinity` verbosity levels are still allowed
		{
			code: exportTypeAndOption(jsdoc(fence(dedenter`
				type Test = {a: Pick<{b: Pick<{c: Pick<{d: 1}, 'd'>}, 'c'>}, 'b'>};

				type LevelZero = Test;
				//=> {a: {b: {c: {d: 1}}}}

				type LevelOne = Test;
				//=> {a: {b: Pick<{c: Pick<{d: 1}, 'd'>}, 'c'>}}

				type LevelTwo = Test;
				//=> {a: {b: {c: Pick<{d: 1}, 'd'>}}}

				type LevelThree = Test;
				//=> {
				// 	a: Pick<{
				// 		b: Pick<{
				// 			c: Pick<{
				// 				d: 1;
				// 			}, 'd'>;
				// 		}, 'c'>;
				// 	}, 'b'>;
				// }
			`))),
			options: [{verbosityLevels: [1, 2]}],
		},

		exportTypeAndOption(jsdoc(fence(dedenter`
			type PosInf = 1e999;
			//=> Infinity

			type NegInf = -1e999;
			//=> -Infinity
		`))),

		// === Different types of quick info ===
		// Function
		exportTypeAndOption(jsdoc(fence(dedenter`
			declare function foo(a: string): {b: string; c: number};
			foo('a');
			//=> {b: string; c: number}
		`))),

		// Variable
		exportTypeAndOption(jsdoc(fence(dedenter`
			const foo = 'foo';
			//=> 'foo'

			let bar = {a: 1};
			//=> {a: number}

			var baz = true;
			//=> boolean
		`))),

		// Type Alias
		exportTypeAndOption(jsdoc(fence(dedenter`
			type Foo = {a: number};
			//=> {a: number}
		`))),

		// Interface
		exportTypeAndOption(jsdoc(fence(dedenter`
			interface Foo { foo: string; }
			//=> Foo
		`))),

		// Generic interface
		exportTypeAndOption(jsdoc(fence(dedenter`
			interface Foo<T> { foo: T; }
			//=> Foo<T>
		`))),

		// Parameter
		exportTypeAndOption(jsdoc(fence(dedenter`
			function foo(n: number) {
				n++;
				//=> number
			}
		`))),

		// Property
		exportTypeAndOption(jsdoc(fence(dedenter`
			const foo = {n: 1};
			foo
				.n++;
			//=> number
		`))),

		// Method
		exportTypeAndOption(jsdoc(fence(dedenter`
			class Foo {
				m() {
					return 'foo';
				}
			}

			const f = new Foo()
				.m();
			//=> string
		`))),

		// Constructor
		exportTypeAndOption(jsdoc(fence(dedenter`
			class Foo {
				constructor() {
					//=> Foo
					console.log('Foo');
				}
			}
		`))),

		// Enum
		exportTypeAndOption(jsdoc(fence(dedenter`
			enum Foo {}
			//=> Foo
		`))),

		// Const enum
		exportTypeAndOption(jsdoc(fence(dedenter`
			const enum Foo { A = 1 }
			//=> Foo
		`))),

		// Enum Member
		exportTypeAndOption(jsdoc(fence(dedenter`
			enum Foo { A }
			void Foo
			.A;
			//=> 0
		`))),
	],
	invalid: [
		// Single-line twoslash fixes in CRLF files keep the line endings.
		{
			code: ['/**', '```ts', 'const count = 1;', '//=> 2', '```', '*/', 'export type Result = string;'].join('\r\n'),
			errors: [incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', target: '//=> 2'})],
			output: ['/**', '```ts', 'const count = 1;', '//=> 1', '```', '*/', 'export type Result = string;'].join('\r\n'),
		},
		// Multiline twoslash fixes in CRLF files keep the line endings.
		{
			code: exportType(jsdoc(fence(`const value = {text: '${'a'.repeat(80)}'} as const;\n//=> number`))).replaceAll('\n', '\r\n'),
			errors: [incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', target: '//=> number'})],
			output: exportType(jsdoc(fence(`const value = {text: '${'a'.repeat(80)}'} as const;\n//=> {\n// \treadonly text: '${'a'.repeat(80)}';\n// }`))).replaceAll('\n', '\r\n'),
		},
		// Trimming the language tag does not change the range of a type-comment replacement.
		{
			code: exportType(jsdoc(fence('const count = 1;\n//=> 2', ' typescript\t'))),
			errors: [incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', target: '//=> 2'})],
			output: exportType(jsdoc(fence('const count = 1;\n//=> 1', ' typescript\t'))),
		},

		// Skipped languages do not shift the range replaced by a later twoslash fix.
		{
			code: exportType(jsdoc(fence('{"count": 1}', 'json'), 'Explanation.', fence('const count = 1;\n//=> 2', 'ts'))),
			errors: [incorrectTwoslashTypeErrorAt({line: 8, textBeforeStart: '', target: '//=> 2'})],
			output: exportType(jsdoc(fence('{"count": 1}', 'json'), 'Explanation.', fence('const count = 1;\n//=> 1', 'ts'))),
		},

		// Twoslash fixes after inline backticks replace only the expected comment.
		{
			code: exportType(jsdoc(fence('// Inline ``` comment\nconst count = 1;\n//=> 2'))),
			errors: [
				incorrectTwoslashTypeErrorAt({line: 5, textBeforeStart: '', target: '//=> 2'}),
			],
			output: exportType(jsdoc(fence('// Inline ``` comment\nconst count = 1;\n//=> 1'))),
		},

		// === Twoslash format errors ===

		// No space after `//=>`
		{
			code: dedenter`
				/**
				\`\`\`ts
				type Foo = string;
				//=>string
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashFormatErrorAt({line: 4,	textBeforeStart: '',	target: '//=>string'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				type Foo = string;
				//=> string
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// More than one space after `//=>`
		{
			code: dedenter`
				/**
				\`\`\`ts
				type Foo = string;
				//=>     string
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashFormatErrorAt({line: 4, textBeforeStart: '', target: '//=>     string'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				type Foo = string;
				//=> string
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Incorrect spacing
		{
			code: dedenter`
				/**
				\`\`\`ts
				type Foo = 'a' | 'b' | { c: 'd' } | 'e';
				//=> 'a'|'b'   |    { c :  'd' }|    'e'  
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashFormatErrorAt({line: 4, textBeforeStart: '', target: '//=> \'a\'|\'b\'   |    { c :  \'d\' }|    \'e\'  '}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				type Foo = 'a' | 'b' | { c: 'd' } | 'e';
				//=> 'a' | 'b' | {c: 'd'} | 'e'
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// No space in subsequent lines
		{
			code: dedenter`
				/**
				\`\`\`ts
				const foo = {a: true, b: true, c: false, d: false, e: true} as const;
				//=> {
				//	readonly a: true;
				//	readonly b: true;
				//	readonly c: false;
				//	readonly d: false;
				//	readonly e: true;
				//}
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashFormatErrorAt({line: 4, textBeforeStart: '', endLine: 10, textBeforeEnd: '//}'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				const foo = {a: true, b: true, c: false, d: false, e: true} as const;
				//=> {
				// 	readonly a: true;
				// 	readonly b: true;
				// 	readonly c: false;
				// 	readonly d: false;
				// 	readonly e: true;
				// }
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Incorrect double quotes
		{
			code: dedenter`
				/**
				\`\`\`ts
				type Foo = ["a", {b: "c", d: {e: "f"}}, "g" | "h"];
				//=> ["a", {b: "c"; d: {e: "f"}}, "g" | "h"]
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashFormatErrorAt({line: 4, textBeforeStart: '', target: '//=> ["a", {b: "c"; d: {e: "f"}}, "g" | "h"]'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				type Foo = ["a", {b: "c", d: {e: "f"}}, "g" | "h"];
				//=> ['a', {b: 'c'; d: {e: 'f'}}, 'g' | 'h']
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Incorrect multiline tuples
		{
			code: dedenter`
				/**
				\`\`\`ts
				import type {TupleOf} from 'type-fest';

				type RGB = TupleOf<3, number>;
				//=> [
				// 	number,
				// 	number,
				// 	number,
				// ]
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashFormatErrorAt({line: 6, textBeforeStart: '', endLine: 10, textBeforeEnd: '// ]'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				import type {TupleOf} from 'type-fest';

				type RGB = TupleOf<3, number>;
				//=> [number, number, number]
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Multi line to single line
		{
			code: dedenter`
				/**
				\`\`\`ts
				const foo = [{a: 1}] as const;
				//=> readonly [{
				// 	readonly a: 1;
				// }]
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashFormatErrorAt({line: 4, textBeforeStart: '', endLine: 6, textBeforeEnd: '// }]'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				const foo = [{a: 1}] as const;
				//=> readonly [{readonly a: 1}]
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Single line to multi line
		{
			code: dedenter`
				/**
				\`\`\`ts
				const foo = {a: true, b: true, c: false, d: false, e: true} as const;
				//=> {readonly a: true; readonly b: true; readonly c: false; readonly d: false; readonly e: true}
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashFormatErrorAt({line: 4, textBeforeStart: '', target: '//=> {readonly a: true; readonly b: true; readonly c: false; readonly d: false; readonly e: true}'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				const foo = {a: true, b: true, c: false, d: false, e: true} as const;
				//=> {
				// 	readonly a: true;
				// 	readonly b: true;
				// 	readonly c: false;
				// 	readonly d: false;
				// 	readonly e: true;
				// }
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Incorrect order of numbers in unions
		{
			code: dedenter`
				/**
				\`\`\`ts
				type T1 = 5 | 4 | 3 | 2 | 1;
				//=> 5 | 4 | 1 | 2 | 3

				type T2 = 1 | 2 | 3 | 'a';
				//=> 2 | 'a' | 3 | 1
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashFormatErrorAt({line: 4, textBeforeStart: '', target: '//=> 5 | 4 | 1 | 2 | 3'}),
				incorrectTwoslashFormatErrorAt({line: 7, textBeforeStart: '', target: '//=> 2 | \'a\' | 3 | 1'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				type T1 = 5 | 4 | 3 | 2 | 1;
				//=> 1 | 2 | 3 | 4 | 5

				type T2 = 1 | 2 | 3 | 'a';
				//=> 1 | 'a' | 2 | 3
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Indented code blocks
		{
			code: dedenter`
				/**
				Note:
				1. First point
					\`\`\`ts
					const foo = {a: true, b: false, c: {d: true}};
					//=> {a: boolean; b: boolean;
					// c: {d: boolean};
					// }
					\`\`\`
				2. Second point
					\`\`\`ts
					const bar = ['a', 'b', 'c'] as const;
					//=> readonly [ 'a', 'b', 'c' ]
					const baz = new Set(bar);
					//=>Set< 'a'|'b'|'c' >
					\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashFormatErrorAt({line: 6, textBeforeStart: '\t', endLine: 8, textBeforeEnd: '\t// }'}),
				incorrectTwoslashFormatErrorAt({line: 13, textBeforeStart: '\t', target: '//=> readonly [ \'a\', \'b\', \'c\' ]'}),
				incorrectTwoslashFormatErrorAt({line: 15, textBeforeStart: '\t', target: '//=>Set< \'a\'|\'b\'|\'c\' >'}),
			],
			output: dedenter`
				/**
				Note:
				1. First point
					\`\`\`ts
					const foo = {a: true, b: false, c: {d: true}};
					//=> {a: boolean; b: boolean; c: {d: boolean}}
					\`\`\`
				2. Second point
					\`\`\`ts
					const bar = ['a', 'b', 'c'] as const;
					//=> readonly ['a', 'b', 'c']
					const baz = new Set(bar);
					//=> Set<'a' | 'b' | 'c'>
					\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Multiple `//=>`
		{
			code: dedenter`
				/**
				\`\`\`ts
				const foo = {a: 'a', b: 'b'} as const;
				//=> {
				// 	readonly a: 'a';
				// 	readonly b: 'b';
				// }
				const bar = ['a', 'b', 'c'] as const;
				//=> readonly [
				// 	'a', 
				// 	'b', 
				// 	'c'
				// ]
				const baz = new Set(bar);
				//=> Set<
				// 	| 'a'
				// 	| 'b'
				// 	| 'c'
				// >
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashFormatErrorAt({line: 4, textBeforeStart: '', endLine: 7, textBeforeEnd: '// }'}),
				incorrectTwoslashFormatErrorAt({line: 9, textBeforeStart: '', endLine: 13, textBeforeEnd: '// ]'}),
				incorrectTwoslashFormatErrorAt({line: 15, textBeforeStart: '', endLine: 19, textBeforeEnd: '// >'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				const foo = {a: 'a', b: 'b'} as const;
				//=> {readonly a: 'a'; readonly b: 'b'}
				const bar = ['a', 'b', 'c'] as const;
				//=> readonly ['a', 'b', 'c']
				const baz = new Set(bar);
				//=> Set<'a' | 'b' | 'c'>
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Preserves the specified verbosity level during formatting fixes
		{
			code: dedenter`
				/**
				\`\`\`ts
				type Test = {a: Pick<{b: Pick<{c: Pick<{d: 'abracadabra'}, 'd'>}, 'c'>}, 'b'>};

				type LevelOne = Test;
				//=> {a: {b: Pick<{c: Pick<{d: 'abracadabra'}, 'd'>}, 'c'>}}

				type LevelTwo = Test;
				//=> {a: {b: {c: Pick<{d: "abracadabra"}, "d">}}}
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashFormatErrorAt({line: 6, textBeforeStart: '', target: '//=> {a: {b: Pick<{c: Pick<{d: \'abracadabra\'}, \'d\'>}, \'c\'>}}'}),
				incorrectTwoslashFormatErrorAt({line: 9, textBeforeStart: '', target: '//=> {a: {b: {c: Pick<{d: "abracadabra"}, "d">}}}'}),
			],
			options: [{verbosityLevels: [1, 2]}],
			output: dedenter`
				/**
				\`\`\`ts
				type Test = {a: Pick<{b: Pick<{c: Pick<{d: 'abracadabra'}, 'd'>}, 'c'>}, 'b'>};

				type LevelOne = Test;
				//=> {
				// 	a: {
				// 		b: Pick<{
				// 			c: Pick<{
				// 				d: 'abracadabra';
				// 			}, 'd'>;
				// 		}, 'c'>;
				// 	};
				// }

				type LevelTwo = Test;
				//=> {a: {b: {c: Pick<{d: 'abracadabra'}, 'd'>}}}
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		{
			code: dedenter`
				/**
				\`\`\`ts
				interface Foo {
					a: string;
				}

				type T = [Foo, Foo, Foo];
				//=> [  Foo,   Foo, Foo ]
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashFormatErrorAt({line: 8, textBeforeStart: '', target: '//=> [  Foo,   Foo, Foo ]'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				interface Foo {
					a: string;
				}

				type T = [Foo, Foo, Foo];
				//=> [Foo, Foo, Foo]
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// === Twoslash type errors ===

		// Incorrect type
		{
			code: dedenter`
				/**
				\`\`\`ts
				const foo = 'bar';
				//=> 'baz'
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', target: '//=> \'baz\''}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				const foo = 'bar';
				//=> 'bar'
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Empty `//=>`
		{
			code: dedenter`
				/**
				\`\`\`ts
				type Foo = string;
				//=>
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', target: '//=>'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				type Foo = string;
				//=> string
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Broken type
		{
			code: dedenter`
				/**
				\`\`\`ts
				const foo = {a: 1, b: 2};
				//=> {a
				
				const bar = {a: 1, b: 2};
				//=> {a: number
				// 	b:
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', target: '//=> {a'}),
				incorrectTwoslashTypeErrorAt({line: 7, textBeforeStart: '', endLine: 8, textBeforeEnd: '// 	b:'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				const foo = {a: 1, b: 2};
				//=> {a: number; b: number}

				const bar = {a: 1, b: 2};
				//=> {a: number
				// 	b:
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Multiline replace
		{
			code: dedenter`
				/**
				\`\`\`ts
				const foo = {foo: true, bar: {baz: true, qux: [true, false]}} as const;
				//=> {
				// 	foo: true;
				// 	readonly bar: {
				// 		readonly baz: false;
				// 		readonly qux: [true, false];
				// 	};
				// }
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', endLine: 10, textBeforeEnd: '// }'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				const foo = {foo: true, bar: {baz: true, qux: [true, false]}} as const;
				//=> {
				// 	readonly foo: true;
				// 	readonly bar: {
				// 		readonly baz: true;
				// 		readonly qux: readonly [true, false];
				// 	};
				// }
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Multiline add missing lines
		{
			code: dedenter`
				/**
				\`\`\`ts
				const foo = {foo: true, bar: {baz: true, qux: [true, false]}} as const;
				//=> {
				// 	readonly bar: {
				// 		readonly qux: readonly [true, false];
				// 	};
				// }
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', endLine: 8, textBeforeEnd: '// }'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				const foo = {foo: true, bar: {baz: true, qux: [true, false]}} as const;
				//=> {
				// 	readonly foo: true;
				// 	readonly bar: {
				// 		readonly baz: true;
				// 		readonly qux: readonly [true, false];
				// 	};
				// }
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Multiline remove extra lines
		{
			code: dedenter`
				/**
				\`\`\`ts
				const foo = {bar: {qux: [true, false]}, quux: [null, undefined]} as const;
				//=> {
				// 	readonly foo: true;
				// 	readonly bar: {
				// 		readonly baz: true;
				// 		readonly qux: readonly [true, false];
				// 	};
				// 	readonly quux: readonly [null, undefined];
				// }
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', endLine: 11, textBeforeEnd: '// }'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				const foo = {bar: {qux: [true, false]}, quux: [null, undefined]} as const;
				//=> {
				// 	readonly bar: {
				// 		readonly qux: readonly [true, false];
				// 	};
				// 	readonly quux: readonly [null, undefined];
				// }
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Compiler options overrides
		{
			code: dedenter`
				/**
				\`\`\`ts
				// @noUncheckedIndexedAccess: false
				const values = [1, 2, 3];
				const first = values[0];
				//=> number | undefined
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashTypeErrorAt({line: 6, textBeforeStart: '', target: '//=> number | undefined'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				// @noUncheckedIndexedAccess: false
				const values = [1, 2, 3];
				const first = values[0];
				//=> number
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Incorrect type and improper formatting
		{
			code: dedenter`
				/**
				\`\`\`ts
				const foo = {a: 'a', b: 'b'} as const;
				//=> {
				// 	a: 'a';
				// 	b: 'b';
				// }

				const bar = 'bar';
				//=>"baz"
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', endLine: 7, textBeforeEnd: '// }'}),
				incorrectTwoslashTypeErrorAt({line: 10, textBeforeStart: '', target: '//=>"baz"'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				const foo = {a: 'a', b: 'b'} as const;
				//=> {readonly a: 'a'; readonly b: 'b'}

				const bar = 'bar';
				//=> 'bar'
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Indented code blocks
		{
			code: dedenter`
				/**
				Note:
				1. First point
					\`\`\`ts
					const foo = {a: true, b: false, c: {d: true}} as const;
					//=> {
					// 	a?: false;
					// 	c?: {
					// 		d?: false;
					// 	};
					// }
					\`\`\`
				2. Second point
					\`\`\`ts
					const bar = ['a', 'b', 'c'] as const;
					//=> ['a', 'c']
					const baz = new Set(bar);
					//=> Set<string>
					\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashTypeErrorAt({line: 6, textBeforeStart: '\t', endLine: 11, textBeforeEnd: '\t// }'}),
				incorrectTwoslashTypeErrorAt({line: 16, textBeforeStart: '\t', target: '//=> [\'a\', \'c\']'}),
				incorrectTwoslashTypeErrorAt({line: 18, textBeforeStart: '\t', target: '//=> Set<string>'}),
			],
			output: dedenter`
				/**
				Note:
				1. First point
					\`\`\`ts
					const foo = {a: true, b: false, c: {d: true}} as const;
					//=> {
					// 	readonly a: true;
					// 	readonly b: false;
					// 	readonly c: {
					// 		readonly d: true;
					// 	};
					// }
					\`\`\`
				2. Second point
					\`\`\`ts
					const bar = ['a', 'b', 'c'] as const;
					//=> readonly ['a', 'b', 'c']
					const baz = new Set(bar);
					//=> Set<'a' | 'b' | 'c'>
					\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Multiple `//=>`
		{
			code: dedenter`
				/**
				\`\`\`ts
				const foo = {a: true, b: false, c: {d: true}} as const;
				//=>
				const bar = ['a', 'b', 'c'] as const;
				//=>
				const baz = new Set(bar);
				//=>
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', target: '//=>'}),
				incorrectTwoslashTypeErrorAt({line: 6, textBeforeStart: '', target: '//=>'}),
				incorrectTwoslashTypeErrorAt({line: 8, textBeforeStart: '', target: '//=>'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				const foo = {a: true, b: false, c: {d: true}} as const;
				//=> {
				// 	readonly a: true;
				// 	readonly b: false;
				// 	readonly c: {
				// 		readonly d: true;
				// 	};
				// }
				const bar = ['a', 'b', 'c'] as const;
				//=> readonly ['a', 'b', 'c']
				const baz = new Set(bar);
				//=> Set<'a' | 'b' | 'c'>
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Fixer suggests types at `Infinity` verbosity level
		{
			code: dedenter`
				/**
				\`\`\`ts
				type Test = {foo: Pick<{bar: Pick<{baz: string}, 'baz'>}, 'bar'>};
				//=>
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', target: '//=>'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				type Test = {foo: Pick<{bar: Pick<{baz: string}, 'baz'>}, 'bar'>};
				//=> {foo: {bar: {baz: string}}}
				\`\`\`
				*/
				export type T0 = string;
			`,
		},

		// Only `0` and `Infinity` verbosity levels are allowed by default
		{
			code: dedenter`
				/**
				\`\`\`ts
				type Test = {foo: Pick<{bar: Pick<{baz: string}, 'baz'>}, 'bar'>};
				//=> {foo: {bar: Pick<{baz: string}, 'baz'>}}
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				incorrectTwoslashTypeErrorAt({line: 4, textBeforeStart: '', target: '//=> {foo: {bar: Pick<{baz: string}, \'baz\'>}}'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				type Test = {foo: Pick<{bar: Pick<{baz: string}, 'baz'>}, 'bar'>};
				//=> {foo: {bar: {baz: string}}}
				\`\`\`
				*/
				export type T0 = string;
			`,
		},
	],
});

test('twoslash autofixes cannot terminate the containing JSDoc comment', () => {
	const code = exportType(jsdoc(fence(dedenter`
		type Closing = \`\${'*'}\${'/'}\`;
		//=> string
	`)));
	const linter = new Linter();
	const result = linter.verifyAndFix(code, [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: []}]},
	}], {filename: 'twoslash-terminator.ts'});

	tsParser.parse(code);
	tsParser.parse(result.output);
	assert.equal(result.fixed, false);
	assert.equal(result.output, code);
	assert.equal(result.messages.length, 1);
	assert.equal(result.messages[0].messageId, 'incorrectTwoslashType');
	assert.equal(result.messages[0].fix, undefined);
});

test('twoslash formatting preserves string and template literal contents', () => {
	const linter = new Linter();
	const configuration = [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: []}]},
	}];
	const types = [
		'\'{ value }\'',
		'\'value;}\'',
		String.raw`'can\'t { change }'`,
		'{text: \'{ value }\'; ending: \'value;}\'}',
		'{\'{ key }\': \'value\'}',
		dedenter`\`{ \${number} }\``,
		dedenter`\`first\${string}\n    second\``,
	];

	const cases = types.map(type => {
		const declarations = `type Text = ${type};\ntype Value = Text;`;
		const correct = exportType(jsdoc(fence(`${declarations}\n//=> ${type.replaceAll('\n', '\n// ')}`)));
		const incorrect = exportType(jsdoc(fence(`${declarations}\n//=> unknown`)));
		const result = linter.verifyAndFix(incorrect, configuration, {filename: 'literal-content.ts'});
		const repeated = linter.verifyAndFix(result.output, configuration, {filename: 'literal-content.ts'});
		return {correct, result, repeated};
	});
	assert.deepEqual(cases.map(({result}) => result.fixed), types.map(() => true));
	assert.deepEqual(cases.map(({result}) => result.output), cases.map(({correct}) => correct));
	assert.deepEqual(cases.map(({result}) => result.messages), types.map(() => []));
	assert.deepEqual(cases.map(({repeated}) => repeated.fixed), types.map(() => false));
	assert.deepEqual(cases.map(({repeated}) => repeated.output), cases.map(({correct}) => correct));
	assert.deepEqual(cases.map(({repeated}) => repeated.messages), types.map(() => []));
});

test('interface and option examples receive stable twoslash fixes', () => {
	const linter = new Linter();
	const configuration = [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: []}]},
	}];
	const code = dedenter`
		${jsdoc(fence('const count = 1;\n//=> 2'))}
		export interface ExampleOptions {
			${jsdoc(fence('const text = \'value\';\n//=> unknown'))}
			text?: string;
		}
	`;
	const expected = code.replace('//=> 2', '//=> 1').replace('//=> unknown', '//=> \'value\'');
	const cases = [
		{code, expected, filename: 'source/interface-example.ts'},
		{
			code: code.replace('export interface', 'export default interface'),
			expected: expected.replace('export interface', 'export default interface'),
			filename: 'source/default-interface-example.ts',
		},
		{code: `declare namespace Scoped {\n${code}\n}`, expected: `declare namespace Scoped {\n${expected}\n}`, filename: 'source/namespace-example.ts'},
	];
	const results = cases.map(({code: example, filename}) => linter.verifyAndFix(example, configuration, {filename}));
	assert.deepEqual(results.map(result => result.fixed), [true, true, true]);
	assert.deepEqual(results.map(result => result.output), cases.map(({expected: output}) => output));
	assert.deepEqual(results.map(result => result.messages), [[], [], []]);
	const repeated = results.map((result, index) => linter.verifyAndFix(result.output, configuration, {filename: cases[index].filename}));
	assert.deepEqual(repeated.map(result => result.fixed), [false, false, false]);
	assert.deepEqual(repeated.map(result => result.output), cases.map(({expected: output}) => output));
	assert.deepEqual(repeated.map(result => result.messages), [[], [], []]);

	// Internal interfaces retain the rule's existing directory exclusion.
	const internal = linter.verifyAndFix(code, configuration, {filename: 'source/internal/interface-example.ts'});
	assert.equal(internal.fixed, false);
	assert.equal(internal.output, code);
	assert.deepEqual(internal.messages, []);
});

test('export-list examples receive stable twoslash fixes', () => {
	const linter = new Linter();
	const configuration = [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: []}]},
	}];
	const declarations = ['type Example = string;', 'interface Example {}'];
	const cases = declarations.map(declaration => ({
		code: `${jsdoc(fence('const count = 1;\n//=> 2'))}\n${declaration}\nexport type {Example as PublicExample};`,
		expected: `${jsdoc(fence('const count = 1;\n//=> 1'))}\n${declaration}\nexport type {Example as PublicExample};`,
	}));
	const results = cases.map(({code}) => linter.verifyAndFix(code, configuration, {filename: 'source/listed-example.ts'}));
	assert.deepEqual(results.map(result => result.fixed), [true, true]);
	assert.deepEqual(results.map(result => result.output), cases.map(({expected}) => expected));
	assert.deepEqual(results.map(result => result.messages), [[], []]);
	const repeated = results.map(result => linter.verifyAndFix(result.output, configuration, {filename: 'source/listed-example.ts'}));
	assert.deepEqual(repeated.map(result => result.fixed), [false, false]);
	assert.deepEqual(repeated.map(result => result.output), cases.map(({expected}) => expected));
	assert.deepEqual(repeated.map(result => result.messages), [[], []]);
});

test('twoslash fixes preserve marker text in literals and still check interpolation comments', () => {
	const linter = new Linter();
	const configuration = [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: []}]},
	}];
	const literalExamples = [
		'const text = `\n//=> string\n`;',
		dedenter`const text = \`\n//=> string\n\${1}\`;`,
		dedenter`const text = \`\${1}\n//=> string\n\${2}\`;`,
		dedenter`const text = \`\${1}\n//=> string\n\`;`,
		'type Text = `\n//=> string\n`;',
		'const text = "first\\\n//=> string";',
	];

	const results = literalExamples.map(example => {
		const incorrect = exportType(jsdoc(fence(`${example}\nconst count = 1;\n//=> number`)));
		const expected = exportType(jsdoc(fence(`${example}\nconst count = 1;\n//=> 1`)));
		const result = linter.verifyAndFix(incorrect, configuration, {filename: 'literal-marker.ts'});
		const repeated = linter.verifyAndFix(result.output, configuration, {filename: 'literal-marker.ts'});
		return {result, repeated, expected};
	});
	assert.deepEqual(results.map(({result}) => result.output), results.map(({expected}) => expected));
	assert.deepEqual(results.map(({result}) => result.messages), literalExamples.map(() => []));
	assert.deepEqual(results.map(({result}) => result.fixed), literalExamples.map(() => true));
	assert.deepEqual(results.map(({repeated}) => repeated.fixed), literalExamples.map(() => false));
	assert.deepEqual(results.map(({repeated}) => repeated.output), results.map(({expected}) => expected));
	assert.deepEqual(results.map(({repeated}) => repeated.messages), literalExamples.map(() => []));

	const interpolation = dedenter`const text = \`\${(() => {\nconst count = 1;\n//=> number\nreturn count;\n})()}\`;`;
	const result = linter.verifyAndFix(exportType(jsdoc(fence(interpolation))), configuration, {filename: 'interpolation-marker.ts'});
	assert.equal(result.output, exportType(jsdoc(fence(interpolation.replace('//=> number', '//=> 1')))));
	assert.equal(result.fixed, true);
	assert.deepEqual(result.messages, []);
});

test('malformed twoslash expectations preserve explanations and compiler directives', () => {
	const linter = new Linter();
	const configuration = [{
		files: ['**/*.ts'],
		languageOptions: {parser: tsParser},
		plugins: {test: {rules: {validate: validateJSDocCodeblocksRule}}},
		rules: {'test/validate': ['error', {verbosityLevels: []}]},
	}];
	const expectations = [
		'',
		';',
		'|',
		'&',
		'{',
		'[',
		'(',
		'<',
		'string |',
		'Array<',
		'keyof',
		'typeof',
		'infer',
		'string extends',
		'string extends number ?',
		'readonly',
		'...string',
		'string;',
		'string; type Other = number',
		'"unterminated',
		'`unterminated',
		'/*',
		'// text',
		'=>',
		'unknown',
		'1',
	];
	const continuations = ['', '// Keep this explanation.', '// @ts-expect-error Documented invalid assignment.\nconst wrong: number = "wrong";'];
	const control = exportType(jsdoc(fence('const value = 1;\n//=> string')));
	assert.equal(linter.verify(control, configuration, {filename: 'example.ts'})[0]?.messageId, 'incorrectTwoslashType');
	assert.ok(linter.verifyAndFix(control, configuration, {filename: 'example.ts'}).output.includes('//=> 1'));

	const results = expectations.flatMap(expectation => continuations.map(continuation => {
		const code = exportType(jsdoc(fence(`const value = 1;\n//=> ${expectation}\n${continuation}`)));
		const result = linter.verifyAndFix(code, configuration, {filename: 'example.ts'});
		// Malformed multiline expectations can remain diagnostic-only, but repeated fixes must be stable.
		const repeated = linter.verifyAndFix(result.output, configuration, {filename: 'example.ts'});
		return {result, repeated, continuation};
	}));
	assert.equal(results.length, 78);
	assert.ok(results.every(({result}) => result.messages.every(message => !message.fatal)));
	assert.ok(results.every(({result, continuation}) => result.output.includes(continuation)));
	assert.deepEqual(results.map(({repeated}) => repeated.output), results.map(({result}) => result.output));
	assert.ok(results.every(({repeated}) => !repeated.fixed));
});
