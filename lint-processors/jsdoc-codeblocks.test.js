import {describe, test, snapshot} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {ESLint, Linter} from 'eslint';
import tsParser from '@typescript-eslint/parser';
import {code1, code2, dedenter, errorAt, exportType, exportTypeAndOption, fence, jsdoc} from '../lint-rules/testing-utilities.js';
import {jsdocCodeblocksProcessor} from './jsdoc-codeblocks.js';

snapshot.setDefaultSnapshotSerializers([String]);

test('skips parsing sources that cannot contain fenced JSDoc examples', t => {
	const parse = t.mock.getter(tsParser, 'parse');
	const cases = [
		'export type Value = string;',
		'/** A documented type without an example. */\nexport type Value = string;',
		'export type Marker = "```";',
		'/*\n```ts\nconst value = 1;\n```\n*/\nexport type Value = string;',
	];
	const files = cases.map((code, index) => {
		const filename = `test-no-example-${index}.d.ts`;
		const result = jsdocCodeblocksProcessor.preprocess(code, filename);
		jsdocCodeblocksProcessor.postprocess([[]], filename);
		return result;
	});
	t.assert.deepStrictEqual(files, cases.map(code => [code]));
	t.assert.strictEqual(parse.mock.callCount(), 0);

	const code = '/**\n```ts\nconst value = 1;\n```\n*/\nexport type Value = string;';
	t.assert.deepStrictEqual(jsdocCodeblocksProcessor.preprocess(code, 'test-with-example.d.ts'), [code, {filename: '1.ts', text: 'const value = 1;'}]);
	t.assert.strictEqual(parse.mock.callCount(), 1);
	jsdocCodeblocksProcessor.postprocess([[], []], 'test-with-example.d.ts');
});

test('extracts TypeScript examples with Windows line endings', () => {
	const filename = 'test-crlf-example.d.ts';
	const code = ['/**', '```ts', 'const value = 1;', '```', '*/', 'export type Result = string;'].join('\r\n');
	const files = jsdocCodeblocksProcessor.preprocess(code, filename);
	jsdocCodeblocksProcessor.postprocess(files.map(() => []), filename);
	assert.equal(files.length, 2);
	assert.ok(files[1].text.includes('const value = 1;'));
});

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';
	test(`unfinished ${lineEndingName} fence tails preserve complete examples and fix offsets`, () => {
		const filename = `test-unfinished-tail-${lineEndingName}.d.ts`;
		const indentation = ' '.repeat(4);
		const unfinished = Array.from({length: 400}, () => ['```ts', 'const unfinished = 1;'].join(newline)).join(newline);
		const code = ['/**', '```json', '```', `${indentation}\`\`\`ts`, `${indentation}const value = 0;`, `${indentation}\`\`\``, unfinished, '*/', 'export type Value = string;'].join(newline);
		const files = jsdocCodeblocksProcessor.preprocess(code, filename);
		assert.deepEqual(files, [code, {filename: '1.ts', text: 'const value = 0;'}]);
		const index = files[1].text.indexOf('0;');
		const [message] = jsdocCodeblocksProcessor.postprocess([[], [{
			ruleId: 'test/replacement', severity: 2, message: 'Replace the value.', line: 1, column: index + 1,
			fix: {range: [index, index + 1], text: '1'},
		}]], filename);
		const originalIndex = code.indexOf('0;');
		assert.equal(message.line, 5);
		assert.equal(message.column, index + indentation.length + 1);
		assert.deepEqual(message.fix, {range: [originalIndex, originalIndex + 1], text: '1'});
	});
}

const root = path.join(import.meta.dirname, 'fixtures');

try {
	await fs.access(path.join(root, 'eslint.config.js'));
} catch {
	throw new Error('\'eslint.config.js\' is missing in \'lint-processors/fixtures\' directory.');
}

const valid = [
	{
		name: 'No JSDoc',
		code: exportTypeAndOption(''),
	},
	{
		name: 'JSDoc without code block',
		code: exportType(jsdoc('No codeblock here')),
	},
	{
		name: 'Valid code block',
		code: exportTypeAndOption(jsdoc(fence(code1))),
	},
	{
		name: 'With text before and after',
		code: exportTypeAndOption(jsdoc('Some description.', fence(code1), '@category Test')),
	},
	{
		name: 'With line breaks before and after',
		code: exportTypeAndOption(
			jsdoc('Some description.\n', 'Note: Some note.\n', fence(code1, 'ts'), '\n@category Test'),
		),
	},
	{
		name: 'With @example tag',
		code: exportTypeAndOption(jsdoc('@example', fence(code1))),
	},
	{
		name: 'With ts language specifier',
		code: exportTypeAndOption(jsdoc(fence(code1, 'ts'))),
	},
	{
		name: 'With typescript language specifier',
		code: exportTypeAndOption(jsdoc(fence(code1, 'typescript'))),
	},
	{
		name: 'Multiple code blocks',
		code: exportTypeAndOption(
			jsdoc('@example', fence(code1, 'ts'), '\nSome text in between.\n', '@example', fence(code2)),
		),
	},
	{
		name: 'Non-TypeScript blocks before an example',
		code: exportTypeAndOption(jsdoc(fence('{"enabled": true}', 'json'), 'Some explanation.', fence(code1, 'ts'))),
	},
	{
		name: 'Empty ignored blocks before an example',
		code: exportTypeAndOption(jsdoc('```json\n```', 'Some explanation.', fence(code1, 'typescript'))),
	},
	{
		name: 'Ignored blocks between supported examples',
		code: exportTypeAndOption(jsdoc(fence(code1), fence('not TypeScript !!!', 'text'), fence(code2, 'typescript'))),
	},
	{
		name: 'Multiple exports and multiple properties',
		code: exportTypeAndOption(jsdoc(fence(code1)), jsdoc(fence(code2))),
	},
	{
		name: 'Indented code blocks',
		code: exportTypeAndOption(jsdoc(
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
	},
	{
		name: 'Ignore codeblocks with inconsistent indentation',
		code: exportTypeAndOption(jsdoc(
			'Some description.',
			dedenter`
			Note:
				@example
				\`\`\`ts
				const foo: string = '1';

			const bar: number = 1;
				\`\`\`
			`,
		)),
	},
];

const invalid = [
	{
		name: 'With text before and after',
		code: dedenter`
			/**
			Some description.
			\`\`\`ts
			const foo: Array<string> = [];
			\`\`\`
			@category Test
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.
				\`\`\`ts
				const foo: Array<string> = [];
				\`\`\`
				@category Test
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 4,
				textBeforeStart: 'const foo: ',
				target: 'Array<string>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 14,
				textBeforeStart: '\tconst foo: ',
				target: 'Array<string>',
			}),
		],
	},

	{
		name: 'With line breaks before and after',
		code: dedenter`
			/**
			Some description.

			Note: Some note.

			\`\`\`ts
			const foo: number = 1;
			\`\`\`

			@category Test
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.

				Note: Some note.

				\`\`\`ts
				const foo: number = 1;
				\`\`\`

				@category Test
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/no-inferrable-types',
				line: 7,
				textBeforeStart: 'const ',
				target: 'foo: number = 1',
			}),
			errorAt({
				ruleId: '@typescript-eslint/no-inferrable-types',
				line: 21,
				textBeforeStart: '\tconst ',
				target: 'foo: number = 1',
			}),
		],
	},

	{
		name: 'With @example tag',
		code: dedenter`
			/**
			@example
			\`\`\`ts
			interface Foo {
				a: string;
				b: number;
			}
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				@example
				\`\`\`ts
				interface Foo {
					a: string;
					b: number;
				}
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/consistent-type-definitions',
				line: 4,
				textBeforeStart: 'interface ',
				target: 'Foo',
			}),
			errorAt({
				ruleId: '@typescript-eslint/consistent-type-definitions',
				line: 16,
				textBeforeStart: '\tinterface ',
				target: 'Foo',
			}),
		],
	},

	{
		name: 'With language specifiers',
		code: dedenter`
			/**
			\`\`\`ts
			const foo: Array<string> = [];
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`ts
				const foo: Array<string> = [];
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 3,
				textBeforeStart: 'const foo: ',
				target: 'Array<string>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 11,
				textBeforeStart: '\tconst foo: ',
				target: 'Array<string>',
			}),
		],
	},

	{
		name: 'With typescript language specifiers',
		code: dedenter`
			/**
			\`\`\`typescript
			const foo: Array<string> = [];
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`typescript
				const foo: Array<string> = [];
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 3,
				textBeforeStart: 'const foo: ',
				target: 'Array<string>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 11,
				textBeforeStart: '\tconst foo: ',
				target: 'Array<string>',
			}),
		],
	},

	{
		name: 'Multiple code blocks',
		code: dedenter`
			/**
			@example
			\`\`\`ts
			const foo: Array<string> = [];
			\`\`\`

			Some text in between.

			@example
			\`\`\`ts
			const bar: number = 1;
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				@example
				\`\`\`ts
				const foo: Array<string> = [];
				\`\`\`

				Some text in between.

				@example
				\`\`\`ts
				const bar: number = 1;
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 4,
				textBeforeStart: 'const foo: ',
				target: 'Array<string>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/no-inferrable-types',
				line: 11,
				textBeforeStart: 'const ',
				target: 'bar: number = 1',
			}),
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 20,
				textBeforeStart: '\tconst foo: ',
				target: 'Array<string>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/no-inferrable-types',
				line: 27,
				textBeforeStart: '\tconst ',
				target: 'bar: number = 1',
			}),
		],
	},

	{
		name: 'Multiple exports and multiple properties',
		code: dedenter`
			/**
			\`\`\`ts
			function foo(example: {(): number}): number {
				return example();
			}
			\`\`\`
			*/
			export type T0 = string;

			/**
			\`\`\`ts
			type Foo = {
				[key: string]: unknown;
			};
			\`\`\`
			*/
			export type T1 = string;

			export type T0Options = {
				/**
				\`\`\`ts
				function foo(example: {(): number}): number {
					return example();
				}
				\`\`\`
				*/
				p0: string;

				/**
				\`\`\`ts
				type Foo = {
					[key: string]: unknown;
				};
				\`\`\`
				*/
				p1: string;
			};

			export type T1Options = {
				/**
				\`\`\`ts
				const foo: Map<string, number> = new Map();
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/prefer-function-type',
				line: 3,
				textBeforeStart: 'function foo(example: {',
				target: '(): number',
			}),
			errorAt({
				ruleId: '@typescript-eslint/consistent-indexed-object-style',
				line: 12,
				textBeforeStart: 'type Foo = ',
				endLine: 14,
				textBeforeEnd: '}',
			}),
			errorAt({
				ruleId: '@typescript-eslint/prefer-function-type',
				line: 22,
				textBeforeStart: '\tfunction foo(example: {',
				target: '(): number',
			}),
			errorAt({
				ruleId: '@typescript-eslint/consistent-indexed-object-style',
				line: 31,
				textBeforeStart: '\ttype Foo = ',
				endLine: 33,
				textBeforeEnd: '\t}',
			}),
			errorAt({
				ruleId: '@typescript-eslint/consistent-generic-constructors',
				line: 42,
				textBeforeStart: '\tconst ',
				target: 'foo: Map<string, number> = new Map()',
			}),
		],
	},

	{
		name: 'Indented code blocks',
		code: dedenter`
			/**
			Note:
			1. First point
				\`\`\`ts
				type Foo = {
					[x: string]: unknown;
				};
				\`\`\`
			2. Second point
				\`\`\`ts
				type Bar = {
					(arg: string): number;
				};
				\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Note:
				1. First point
					\`\`\`ts
					type Foo = {
						[x: string]: unknown;
					};
					\`\`\`
				2. Second point
					\`\`\`ts
					type Bar = {
						(arg: string): number;
					};
					\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/consistent-indexed-object-style',
				line: 5,
				textBeforeStart: '\ttype Foo = ',
				endLine: 7,
				textBeforeEnd: '\t}',
			}),
			errorAt({
				ruleId: '@typescript-eslint/prefer-function-type',
				line: 12,
				textBeforeStart: '\t\t',
				target: '(arg: string): number;',
			}),
			errorAt({
				ruleId: '@typescript-eslint/consistent-indexed-object-style',
				line: 23,
				textBeforeStart: '\t\ttype Foo = ',
				endLine: 25,
				textBeforeEnd: '\t\t}',
			}),
			errorAt({
				ruleId: '@typescript-eslint/prefer-function-type',
				line: 30,
				textBeforeStart: '\t'.repeat(3),
				target: '(arg: string): number;',
			}),
		],
	},

	{
		name: 'Error and fix starting at the first character of the codeblock',
		code: dedenter`
			/**
			Some description.
			\`\`\`ts
			var foo = 1;
			foo = 2;
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.
				\`\`\`ts
				var foo = 1;
				foo = 2;
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: 'no-var',
				line: 4,
				textBeforeStart: '',
				target: 'var foo = 1;',
			}),
			errorAt({
				ruleId: 'no-var',
				line: 14,
				textBeforeStart: '\t',
				target: 'var foo = 1;',
			}),
		],
	},

	{
		name: 'Error and fix in the middle of the codeblock',
		code: dedenter`
			/**
			\`\`\`ts
			const foo: string[] = [];

			const bar: Array<number> = [];

			const baz: boolean[] = [];
			\`\`\`
			Some text after.
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`ts
				const foo: string[] = [];

				const bar: Array<number> = [];

				const baz: boolean[] = [];
				\`\`\`
				Some text after.
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 5,
				textBeforeStart: 'const bar: ',
				target: 'Array<number>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 18,
				textBeforeStart: '\tconst bar: ',
				target: 'Array<number>',
			}),
		],
	},

	{
		name: 'Error and fix ending at the last character of the codeblock',
		code: dedenter`
			/**
			Some description.

			@example
			\`\`\`ts
			type Foo = {a: string}
			type Bar = {[K: string]: Foo}
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.

				@example
				\`\`\`ts
				type Foo = {a: string}
				type Bar = {[K: string]: Foo}
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/consistent-indexed-object-style',
				line: 7,
				textBeforeStart: 'type Bar = ',
				target: '{[K: string]: Foo}',
			}),
			errorAt({
				ruleId: '@typescript-eslint/consistent-indexed-object-style',
				line: 19,
				textBeforeStart: '\ttype Bar = ',
				target: '{[K: string]: Foo}',
			}),
		],
	},

	{
		name: 'Error spanning multiple lines',
		code: dedenter`
			/**
			\`\`\`ts
			import type {PickIndexSignature} from 'type-fest';

			type Foo = {
				[key: string]: unknown;
			};

			type Test = PickIndexSignature<Foo>;
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`ts
				import type {PickIndexSignature} from 'type-fest';

				type Foo = {
					[key: string]: unknown;
				};

				type Test = PickIndexSignature<Foo>;
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/consistent-indexed-object-style',
				line: 5,
				textBeforeStart: 'type Foo = ',
				endLine: 7,
				textBeforeEnd: '}',
			}),
			errorAt({
				ruleId: '@typescript-eslint/consistent-indexed-object-style',
				line: 19,
				textBeforeStart: '\ttype Foo = ',
				endLine: 21,
				textBeforeEnd: '\t}',
			}),
		],
	},

	{
		name: 'Multiline fix',
		code: dedenter`
			/**
			Some description.
			Some more description.

			@example
			\`\`\`ts
			type Test = {(
				foo: string,
				bar: number
			): void};
			\`\`\`
			@category Test
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.
				Some more description.

				@example
				\`\`\`ts
				type Test = {(
					foo: string,
					bar: number
				): void};
				\`\`\`
				@category Test
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/prefer-function-type',
				line: 7,
				textBeforeStart: 'type Test = {',
				endLine: 10,
				textBeforeEnd: '): void',
			}),
			errorAt({
				ruleId: '@typescript-eslint/prefer-function-type',
				line: 23,
				textBeforeStart: '\ttype Test = {',
				endLine: 26,
				textBeforeEnd: '\t): void',
			}),
		],
	},

	{
		name: 'Multiple errors',
		code: dedenter`
			/**
			@example
			\`\`\`typescript
			const foo: number = 1

			const bar: Map<string, number> = new Map()

			interface Baz {
				(x: string): unknown
			}
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				@example
				\`\`\`typescript
				const foo: number = 1

				const bar: Map<string, number> = new Map()

				interface Baz {
					(x: string): unknown
				}
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/no-inferrable-types',
				line: 4,
				textBeforeStart: 'const ',
				target: 'foo: number = 1',
			}),
			errorAt({
				ruleId: '@typescript-eslint/consistent-generic-constructors',
				line: 6,
				textBeforeStart: 'const ',
				target: 'bar: Map<string, number> = new Map()',
			}),
			errorAt({
				ruleId: '@typescript-eslint/consistent-type-definitions',
				line: 8,
				textBeforeStart: 'interface ',
				target: 'Baz',
			}),
			errorAt({
				ruleId: '@typescript-eslint/prefer-function-type',
				line: 9,
				textBeforeStart: '\t',
				target: '(x: string): unknown',
			}),
			errorAt({
				ruleId: '@typescript-eslint/no-inferrable-types',
				line: 19,
				textBeforeStart: '\tconst ',
				target: 'foo: number = 1',
			}),
			errorAt({
				ruleId: '@typescript-eslint/consistent-generic-constructors',
				line: 21,
				textBeforeStart: '\tconst ',
				target: 'bar: Map<string, number> = new Map()',
			}),
			errorAt({
				ruleId: '@typescript-eslint/consistent-type-definitions',
				line: 23,
				textBeforeStart: '\tinterface ',
				target: 'Baz',
			}),
			errorAt({
				ruleId: '@typescript-eslint/prefer-function-type',
				line: 24,
				textBeforeStart: '\t\t',
				target: '(x: string): unknown',
			}),
		],
	},

	{
		name: 'Overlapping errors',
		code: dedenter`
			/**
			\`\`\`ts
			const foo: Array<Array<string>> = [];
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`ts
				const foo: Array<Array<string>> = [];
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 3,
				textBeforeStart: 'const foo: ',
				target: 'Array<Array<string>>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 3,
				textBeforeStart: 'const foo: Array<',
				target: 'Array<string>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 11,
				textBeforeStart: '\tconst foo: ',
				target: 'Array<Array<string>>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 11,
				textBeforeStart: '\tconst foo: Array<',
				target: 'Array<string>',
			}),
		],
	},

	{
		name: 'Error reporting location different from fix location',
		code: dedenter`
			/**
			\`\`\`ts
			type Foo = {
				(): void;
			};
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`ts
				type Foo = {
					(): void;
				};
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/prefer-function-type',
				line: 4,
				textBeforeStart: '\t',
				target: '(): void;',
			}),
			errorAt({
				ruleId: '@typescript-eslint/prefer-function-type',
				line: 14,
				textBeforeStart: '\t\t',
				target: '(): void;',
			}),
		],
	},

	{
		name: 'Non fixable error',
		code: dedenter`
			/**
			Some description.
			@example
			\`\`\`
			type Foo = {};
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.
				@example
				\`\`\`
				type Foo = {};
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/no-empty-object-type',
				line: 5,
				textBeforeStart: 'type Foo = ',
				target: '{}',
			}),
			errorAt({
				ruleId: '@typescript-eslint/no-empty-object-type',
				line: 15,
				textBeforeStart: '\ttype Foo = ',
				target: '{}',
			}),
		],
	},

	{
		name: 'Error outside JSDoc',
		code: dedenter`
			/**
			Some description.
			\`\`\`
			type Foo = string;
			\`\`\`
			*/
			export type T0 = Array<string>;

			type Foo = String;
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 7,
				textBeforeStart: 'export type T0 = ',
				target: 'Array<string>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/no-wrapper-object-types',
				line: 9,
				textBeforeStart: 'type Foo = ',
				target: 'String',
			}),
		],
	},
	{
		name: 'Error ending at first column',
		code: dedenter`
			/**
			Some description.

			Note:
			    @example
				\`\`\`ts
				type Foo = 'error_ending_at_first_column'
				type Bar = number
				\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.

				Note:
					@example
					\`\`\`ts
					type Foo = 'error_ending_at_first_column'
					type Bar = number
					\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				line: 7,
				textBeforeStart: '\t',
				endLine: 8,
				textBeforeEnd: '',
			}),
			errorAt({
				line: 20,
				textBeforeStart: '\t\t',
				endLine: 21,
				textBeforeEnd: '',
			}),
		],
	},
];

describe('jsdoc-codeblocks processor', {concurrency: true}, () => {
	const eslint = new ESLint({cwd: root});
	const eslintFixed = new ESLint({cwd: root, fix: true});

	const writeTestFile = async (t, type, name, code) => {
		const fileName = `test-${type}-${name.replaceAll(/\s+/gv, '-')}.d.ts`;
		const filePath = path.join(root, fileName);
		await fs.writeFile(filePath, code);
		t.after(async () => {
			await fs.unlink(filePath);
		});

		return fileName;
	};

	for (const {name, code} of valid) {
		test(`valid - ${name}`, async t => {
			const fileName = await writeTestFile(t, 'valid', name, code);
			const results = await eslint.lintFiles([fileName]);
			t.assert.strictEqual(results[0].messages.length, 0);
		});
	}

	for (const {name, code, errors} of invalid) {
		test(`invalid - ${name}`, async t => {
			const fileName = await writeTestFile(t, 'invalid', name, code);
			const results = await eslint.lintFiles([fileName]);
			t.assert.strictEqual(results[0].messages.length, errors.length);
			t.assert.partialDeepStrictEqual(results[0].messages, errors);

			const resultsFixed = await eslintFixed.lintFiles([fileName]);
			t.assert.snapshot(resultsFixed[0].output);
		});
	}
});

test('autofix insertions at the start of an indented example line', async () => {
	const code = exportType(jsdoc('\t```ts\n\tconst first = 1;\n\t// Explain the next value.\n\tconst second = 2;\n\t```'));
	const eslint = new ESLint({
		cwd: root,
		fix: true,
		overrideConfig: {
			rules: {
				'lines-around-comment': ['error', {beforeLineComment: true}],
			},
		},
	});
	const [result] = await eslint.lintText(code, {filePath: 'test-indented-insertion.d.ts'});
	assert.deepEqual(result.messages, []);
	assert.equal(result.output, code.replace('\t// Explain', '\t\n\t// Explain'));
});

describe('empty fix and suggestion insertion points', () => {
	const code = exportType(jsdoc('\t```ts\n\tconst first = 1;\n\tconst second = 2;\n\t```'));
	const firstLine = 'const first = 1;';
	const secondLine = 'const second = 2;';
	const virtualCode = `${firstLine}\n${secondLine}`;
	const cases = [
		{name: 'first character', index: 0, originalIndex: code.indexOf(firstLine), text: '// Before.\n'},
		{name: 'later line start', index: firstLine.length + 1, originalIndex: code.indexOf(secondLine), text: '// Between.\n'},
		{name: 'middle of a line', index: virtualCode.indexOf(' = 2'), originalIndex: code.indexOf(' = 2'), text: ': number'},
		{name: 'end of the example', index: virtualCode.length, originalIndex: code.indexOf(secondLine) + secondLine.length, text: '\nconsole.log(second);'},
	];

	for (const {name, index, originalIndex, text} of cases) {
		test(name, () => {
			const filename = `test-insertion-${index}.d.ts`;
			const [, virtualFile] = jsdocCodeblocksProcessor.preprocess(code, filename);
			assert.equal(virtualFile.text, virtualCode);
			const [message] = jsdocCodeblocksProcessor.postprocess([[], [{
				ruleId: 'test/insertion',
				severity: 2,
				message: 'Insert text.',
				line: 1,
				column: 1,
				fix: {range: [index, index], text},
				suggestions: [{desc: 'Insert text.', fix: {range: [index, index], text}}],
			}]], filename);
			const expectedText = text.replaceAll('\n', '\n\t');
			const expectedFix = {range: [originalIndex, originalIndex], text: expectedText};
			const expectedOutput = code.slice(0, originalIndex) + expectedText + code.slice(originalIndex);

			assert.deepEqual(message.fix, expectedFix);
			assert.deepEqual(message.suggestions[0].fix, expectedFix);
			assert.equal(code.slice(0, message.fix.range[0]) + message.fix.text + code.slice(message.fix.range[1]), expectedOutput);
			const {fix} = message.suggestions[0];
			assert.equal(code.slice(0, fix.range[0]) + fix.text + code.slice(fix.range[1]), expectedOutput);
		});
	}
});

test('suggested insertion before an indented declaration applies at the line start', async () => {
	const code = exportType(jsdoc('\t```ts\n\tconst first = 1;\n\tconst second = 2;\n\t```'));
	const eslint = new ESLint({
		cwd: root,
		overrideConfig: {
			plugins: {
				insertion: {
					rules: {
						comment: {
							meta: {schema: [], hasSuggestions: true, messages: {insert: 'Insert a comment.'}},
							create(context) {
								return {
									VariableDeclaration(node) {
										if (node.declarations[0].id.name !== 'second') {
											return;
										}

										context.report({
											node,
											messageId: 'insert',
											suggest: [{messageId: 'insert', fix: fixer => fixer.insertTextBefore(node, '// Explain.\n')}],
										});
									},
								};
							},
						},
					},
				},
			},
			rules: {'insertion/comment': 'error'},
		},
	});
	const [result] = await eslint.lintText(code, {filePath: 'test-suggested-insertion.d.ts'});
	assert.equal(result.messages.length, 1);
	const {fix} = result.messages[0].suggestions[0];
	const index = code.indexOf('const second');
	assert.deepEqual(fix.range, [index, index]);
	assert.equal(code.slice(0, fix.range[0]) + fix.text + code.slice(fix.range[1]), code.replace('\tconst second', '\t// Explain.\n\tconst second'));
});

test('deleting a complete virtual line preserves the surviving line indentation', () => {
	const code = exportType(jsdoc('\t```ts\n\tconst first = 1;\n\tconst second = 2;\n\t```'));
	const filename = 'test-exclusive-end.d.ts';
	jsdocCodeblocksProcessor.preprocess(code, filename);
	const [message] = jsdocCodeblocksProcessor.postprocess([[], [{
		ruleId: 'test/replacement',
		severity: 2,
		message: 'Replace the first line.',
		line: 1,
		column: 1,
		fix: {range: [0, 'const first = 1;\n'.length], text: ''},
	}]], filename);
	const output = code.slice(0, message.fix.range[0]) + message.fix.text + code.slice(message.fix.range[1]);
	assert.equal(output, code.replace('\tconst first = 1;\n', ''));
	const files = jsdocCodeblocksProcessor.preprocess(output, filename);
	assert.equal(files[1].text, 'const second = 2;');
	jsdocCodeblocksProcessor.postprocess(files.map(() => []), filename);
});

test('mixed languages preserve exact TypeScript virtual files', () => {
	const filename = 'test-mixed-virtual-files.d.ts';
	const code = exportType(jsdoc(
		'```json\n```',
		fence('{"enabled": true}', 'json'),
		'Explanation.',
		fence('const first = 1;'),
		fence('const second = 2;', 'ts'),
		fence('const third = 3;', 'typescript'),
	));
	const files = jsdocCodeblocksProcessor.preprocess(code, filename);
	assert.deepEqual(files, [
		code,
		{filename: '1.ts', text: 'const first = 1;'},
		{filename: '2.ts', text: 'const second = 2;'},
		{filename: '3.ts', text: 'const third = 3;'},
	]);
	jsdocCodeblocksProcessor.postprocess([[], [], [], []], filename);
});

test('inline triple backticks in prose do not open a fence', () => {
	const filename = 'test-inline-fence-prose.d.ts';
	const code = exportType(jsdoc('```foo``` is inline markdown.', fence('const value = 1;', 'ts')));
	const files = jsdocCodeblocksProcessor.preprocess(code, filename);
	jsdocCodeblocksProcessor.postprocess(files.map(() => []), filename);
	assert.deepEqual(files.slice(1), [{filename: '1.ts', text: 'const value = 1;'}]);
});

test('autofixes after ignored blocks preserve original source offsets', async () => {
	const code = exportTypeAndOption(jsdoc('```json\n```', fence('{"enabled": true}', 'json'), 'Explanation.', fence('const values: Array<string> = [];', 'ts')));
	const eslint = new ESLint({cwd: root, fix: true});
	const [result] = await eslint.lintText(code, {filePath: 'test-mixed-autofix.d.ts'});
	assert.deepEqual(result.messages, []);
	assert.equal(result.output, code.replaceAll('Array<string>', 'string[]'));
});

test('suggestions after ignored blocks preserve their insertion offsets', () => {
	const filename = 'test-mixed-suggestion.d.ts';
	const code = exportType(jsdoc('```json\n```', 'Explanation.', '\t```ts\n\tconst value = 1;\n\t```'));
	jsdocCodeblocksProcessor.preprocess(code, filename);
	const [message] = jsdocCodeblocksProcessor.postprocess([[], [{
		ruleId: 'test/comment',
		severity: 2,
		message: 'Insert a comment.',
		line: 1,
		column: 1,
		suggestions: [{desc: 'Insert a comment.', fix: {range: [0, 0], text: '// Explain.\n'}}],
	}]], filename);
	const {fix} = message.suggestions[0];
	const index = code.indexOf('const value');
	assert.deepEqual(fix.range, [index, index]);
	assert.equal(code.slice(0, fix.range[0]) + fix.text + code.slice(fix.range[1]), code.replace('\tconst value', '\t// Explain.\n\tconst value'));
});

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';
	for (const language of [' ts ', '\ttypescript\t', ' \t']) {
		test(`language whitespace preserves exact ${lineEndingName} example text: ${JSON.stringify(language)}`, () => {
			const filename = `test-language-whitespace-${JSON.stringify([newline, language])}.d.ts`;
			const code = ['/**', '``` json ', 'not TypeScript !!!', '```', `\`\`\`${language}`, 'const value = 1;', '```', '*/', 'export type Result = string;'].join(newline);
			const files = jsdocCodeblocksProcessor.preprocess(code, filename);
			assert.deepEqual(files, [code, {filename: '1.ts', text: 'const value = 1;'}]);
			jsdocCodeblocksProcessor.postprocess([[], []], filename);
		});
	}

	test(`autofixes in spaced language fences preserve ${lineEndingName} and are idempotent`, async () => {
		const eslint = new ESLint({cwd: root, fix: true});
		const code = ['/**', '``` ts\t', 'const values: Array<string> = [];', '```', '*/', 'export type Result = string;'].join(newline);
		const filePath = `test-spaced-language-autofix-${lineEndingName}.d.ts`;
		const [result] = await eslint.lintText(code, {filePath});
		assert.deepEqual(result.messages, []);
		assert.equal(result.output, code.replace('Array<string>', 'string[]'));
		const [secondResult] = await eslint.lintText(result.output, {filePath});
		assert.deepEqual(secondResult.messages, []);
		assert.equal(secondResult.output, undefined);
	});
}

test('spaced language tags do not shift suggestion ranges', () => {
	const filename = 'test-spaced-language-suggestion.d.ts';
	const code = ['/**', '``` typescript\t', 'const value = 1;', '```', '*/', 'export type Result = string;'].join('\r\n');
	jsdocCodeblocksProcessor.preprocess(code, filename);
	const [message] = jsdocCodeblocksProcessor.postprocess([[], [{
		ruleId: 'test/comment',
		severity: 2,
		message: 'Insert a comment.',
		line: 1,
		column: 1,
		suggestions: [{desc: 'Insert a comment.', fix: {range: [0, 0], text: '// Explanation\r\n'}}],
	}]], filename);
	const {fix} = message.suggestions[0];
	const index = code.indexOf('const value');
	assert.deepEqual(fix.range, [index, index]);
	assert.equal(code.slice(0, fix.range[0]) + fix.text + code.slice(fix.range[1]), code.replace('const value', '// Explanation\r\nconst value'));
});

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';
	const code = ['/**', '\t```ts', '\tconst first = 1;', '', '\tconst values: Array<string> = [];', '\t```', '*/', 'export type Result = string;'].join(newline);

	test(`extracts indented ${lineEndingName} examples containing a blank line`, () => {
		const filename = `test-indented-blank-line-${lineEndingName}.d.ts`;
		const files = jsdocCodeblocksProcessor.preprocess(code, filename);
		assert.deepEqual(files, [code, {filename: '1.ts', text: `const first = 1;${newline}${newline}const values: Array<string> = [];`}]);
		jsdocCodeblocksProcessor.postprocess(files.map(() => []), filename);
	});

	test(`autofixes after an indented ${lineEndingName} blank line reach the original declaration`, async () => {
		const eslint = new ESLint({cwd: root, fix: true});
		const filePath = `test-indented-blank-line-fix-${lineEndingName}.d.ts`;
		const [result] = await eslint.lintText(code, {filePath});
		assert.deepEqual(result.messages, []);
		assert.equal(result.output, code.replace('Array<string>', 'string[]'));
		const [secondResult] = await eslint.lintText(result.output, {filePath});
		assert.deepEqual(secondResult.messages, []);
		assert.equal(secondResult.output, undefined);
	});
}

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';

	test(`partially indented ${lineEndingName} blank lines preserve text and mapped ranges`, () => {
		const filename = `test-partial-blank-indent-${lineEndingName}.d.ts`;
		const code = ['/**', '\t\t```ts', '\t\tconst first = 1;', '', '\t', '\t\t', '  ', '\t\tconst values: Array<string> = [];', '\t\t```', '*/', 'export type Result = string;'].join(newline);
		const virtualCode = ['const first = 1;', '', '\t', '', '  ', 'const values: Array<string> = [];'].join(newline);
		const files = jsdocCodeblocksProcessor.preprocess(code, filename);
		assert.deepEqual(files, [code, {filename: '1.ts', text: virtualCode}]);
		const replacementIndex = virtualCode.indexOf('Array<string>');
		const insertionIndex = virtualCode.indexOf('const values');
		const [message] = jsdocCodeblocksProcessor.postprocess([[], [{
			ruleId: 'test/replacement',
			severity: 2,
			message: 'Replace the array type.',
			line: 6,
			column: 15,
			fix: {range: [replacementIndex, replacementIndex + 'Array<string>'.length], text: 'string[]'},
			suggestions: [{desc: 'Explain the declaration.', fix: {range: [insertionIndex, insertionIndex], text: '/* Values */ '}}],
		}]], filename);
		const originalReplacementIndex = code.indexOf('Array<string>');
		assert.equal(message.line, 8);
		assert.equal(message.column, 17);
		assert.deepEqual(message.fix, {range: [originalReplacementIndex, originalReplacementIndex + 'Array<string>'.length], text: 'string[]'});
		assert.equal(code.slice(0, message.fix.range[0]) + message.fix.text + code.slice(message.fix.range[1]), code.replace('Array<string>', 'string[]'));
		assert.deepEqual(message.suggestions, []);
	});

	test(`inconsistent nonblank ${lineEndingName} indentation still skips the example`, () => {
		const filename = `test-inconsistent-indent-${lineEndingName}.d.ts`;
		const code = ['/**', '\t\t```ts', '\t\tconst first = 1;', '', '\tconst second = 2;', '\t\t```', '*/', 'export type Result = string;'].join(newline);
		const files = jsdocCodeblocksProcessor.preprocess(code, filename);
		assert.deepEqual(files, [code]);
		jsdocCodeblocksProcessor.postprocess([[]], filename);
	});
}

test('mapped suggestions cannot terminate the containing JSDoc comment', () => {
	const code = exportType(jsdoc(fence(String.raw`const value = '*\/';`)));
	const filename = 'test-suggested-comment-terminator.d.ts';
	const [, virtualFile] = jsdocCodeblocksProcessor.preprocess(code, filename);
	const linter = new Linter();
	const virtualMessages = linter.verify(virtualFile.text, [{rules: {'no-useless-escape': 'error'}}]);
	const [message] = jsdocCodeblocksProcessor.postprocess([[], virtualMessages], filename);

	assert.equal(message.messageId, 'unnecessaryEscape');
	assert.deepEqual(message.suggestions.map(suggestion => suggestion.messageId), ['escapeBackslash']);
	const {fix} = message.suggestions[0];
	const output = code.slice(0, fix.range[0]) + fix.text + code.slice(fix.range[1]);
	tsParser.parse(output);
});

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';
	const cases = [
		{name: 'left boundary', code: 'const value = \'*x\';', needle: '*x', offset: 1, remove: 0, text: '/', unsafe: true},
		{name: 'right boundary', code: 'const value = \'x/\';', needle: '/', offset: 0, remove: 0, text: '*', unsafe: true},
		{name: 'safe escaped slash', code: 'const value = \'safe\';', needle: 'safe', offset: 0, remove: 4, text: String.raw`*\/`, expected: String.raw`const value = '*\/';`},
	];

	for (const entry of cases) {
		test(`mapped ${lineEndingName} changes respect the JSDoc ${entry.name}`, () => {
			const filename = `test-comment-boundary-${lineEndingName}-${entry.name}.d.ts`;
			const code = ['/**', '\t```ts', '\tconst first = 1;', '', `\t${entry.code}`, '\t```', '*/', 'export type Result = string;'].join(newline);
			const [, virtualFile] = jsdocCodeblocksProcessor.preprocess(code, filename);
			const start = virtualFile.text.indexOf(entry.needle) + entry.offset;
			const end = start + entry.remove;
			const [message] = jsdocCodeblocksProcessor.postprocess([[], [{
				ruleId: 'test/change',
				severity: 2,
				message: entry.name,
				line: 3,
				column: 1,
				fix: {range: [start, end], text: entry.text},
				suggestions: [{desc: entry.name, fix: {range: [start, end], text: entry.text}}],
			}]], filename);

			assert.equal(message.fix === undefined, Boolean(entry.unsafe));
			assert.equal(message.suggestions.length, entry.unsafe ? 0 : 1);
			const expected = entry.unsafe ? code : code.replace(entry.code, () => entry.expected);
			const fix = message.fix ?? {range: [0, 0], text: ''};
			const suggestion = message.suggestions[0]?.fix ?? {range: [0, 0], text: ''};
			const output = code.slice(0, fix.range[0]) + fix.text + code.slice(fix.range[1]);
			assert.equal(output, expected);
			assert.equal(code.slice(0, suggestion.range[0]) + suggestion.text + code.slice(suggestion.range[1]), expected);
			tsParser.parse(output);
		});
	}
}

for (const newline of ['\n', '\r\n']) {
	const lineEndingName = newline === '\n' ? 'LF' : 'CRLF';
	test(`successive ${lineEndingName} autofix passes cannot join a JSDoc terminator`, () => {
		const code = ['/**', '```ts', 'const value = \'ab\';', '```', '*/', 'export type Result = string;'].join(newline);
		const rule = {
			meta: {fixable: 'code', schema: []},
			create(context) {
				return {
					Literal(node) {
						if (node.value !== 'ab' && node.value !== '*b') {
							return;
						}

						if (node.value === 'ab') {
							context.report({node, message: 'Replace the first character.', fix: fixer => fixer.replaceTextRange([node.range[0] + 1, node.range[0] + 2], '*')});
						}

						context.report({node, message: 'Replace the second character.', fix: fixer => fixer.replaceTextRange([node.range[0] + 2, node.range[0] + 3], '/')});
					},
				};
			},
		};
		const plugin = {processors: {examples: jsdocCodeblocksProcessor}, rules: {replace: rule}};
		const result = new Linter().verifyAndFix(code, [
			{files: ['**/*.d.ts'], plugins: {test: plugin}, processor: 'test/examples', languageOptions: {parser: tsParser}},
			{files: ['**/*.ts'], plugins: {test: plugin}, rules: {'test/replace': 'error'}, languageOptions: {parser: tsParser}},
		], {filename: `test-successive-comment-fixes-${lineEndingName}.d.ts`, filterCodeBlock: filename => filename.endsWith('.ts')});

		assert.equal(result.fixed, true);
		assert.equal(result.output, code.replace('\'ab\'', '\'*b\''));
		assert.equal(result.messages.length, 1);
		assert.equal(result.messages[0].message, 'Replace the second character.');
		assert.equal(result.messages[0].fix, undefined);
		tsParser.parse(result.output);
	});
}
