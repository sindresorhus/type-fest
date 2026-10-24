import {describe, test, snapshot} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {ESLint} from 'eslint';
import {code1, code2, dedenter, errorAt, exportType, exportTypeAndOption, fence, jsdoc} from '../lint-rules/testing-utilities.js';
import {jsdocCodeblocksProcessor} from './jsdoc-codeblocks.js';

snapshot.setDefaultSnapshotSerializers([String]);

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
		{name: 'middle of a line', index: virtualCode.indexOf(' = 2'), originalIndex: code.indexOf(' = 2'), text: ' /* Value */'},
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

test('nonempty fix ranges ending at a line boundary keep the exclusive end', () => {
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
	assert.deepEqual(message.fix.range, [code.indexOf('const first'), code.indexOf('\tconst second')]);
	assert.equal(code.slice(...message.fix.range), 'const first = 1;\n');
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
