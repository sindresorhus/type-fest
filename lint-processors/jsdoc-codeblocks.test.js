import {describe, test} from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import {ESLint} from 'eslint';
import {dedenter, errorAt} from '../lint-rules/test-utils.js';

const root = path.join(import.meta.dirname, 'fixtures');

try {
	await fs.access(path.join(root, 'eslint.config.js'));
} catch {
	throw new Error('\'eslint.config.js\' is missing in \'lint-processors/fixtures\' directory.');
}

const invalid = [
	{
		name: 'With text before and after',
		code: dedenter`
			/**
			Some description.
			\`\`\`ts
			const a: Array<string> = [];
			\`\`\`
			@category Test
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.
				\`\`\`ts
				const a: Array<string> = [];
				\`\`\`
				@category Test
				*/
				p0: string;
			};
		`,
		output: dedenter`
			/**
			Some description.
			\`\`\`ts
			const a: string[] = [];
			\`\`\`
			@category Test
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.
				\`\`\`ts
				const a: string[] = [];
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
				textBeforeStart: 'const a: ',
				target: 'Array<string>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 14,
				textBeforeStart: '\tconst a: ',
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
			const a: number = 1;
			\`\`\`

			@category Test
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.

				Note: Some note.

				\`\`\`ts
				const a: number = 1;
				\`\`\`

				@category Test
				*/
				p0: string;
			};
		`,
		output: dedenter`
			/**
			Some description.

			Note: Some note.

			\`\`\`ts
			const a = 1;
			\`\`\`

			@category Test
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.

				Note: Some note.

				\`\`\`ts
				const a = 1;
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
				target: 'a: number = 1',
			}),
			errorAt({
				ruleId: '@typescript-eslint/no-inferrable-types',
				line: 21,
				textBeforeStart: '\tconst ',
				target: 'a: number = 1',
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
		output: dedenter`
			/**
			@example
			\`\`\`ts
			type Foo = {
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
				type Foo = {
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
			const a: Array<string> = [];
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`typescript
				const a: Array<string> = [];
				\`\`\`
				*/
				p0: string;
			};
		`,
		output: dedenter`
			/**
			\`\`\`ts
			const a: string[] = [];
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`typescript
				const a: string[] = [];
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 3,
				textBeforeStart: 'const a: ',
				target: 'Array<string>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 11,
				textBeforeStart: '\tconst a: ',
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
			const a: Array<string> = [];
			\`\`\`

			Some text in between.

			@example
			\`\`\`ts
			const b: number = 1;
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				@example
				\`\`\`ts
				const a: Array<string> = [];
				\`\`\`

				Some text in between.

				@example
				\`\`\`ts
				const b: number = 1;
				\`\`\`
				*/
				p0: string;
			};
		`,
		output: dedenter`
			/**
			@example
			\`\`\`ts
			const a: string[] = [];
			\`\`\`

			Some text in between.

			@example
			\`\`\`ts
			const b = 1;
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				@example
				\`\`\`ts
				const a: string[] = [];
				\`\`\`

				Some text in between.

				@example
				\`\`\`ts
				const b = 1;
				\`\`\`
				*/
				p0: string;
			};
		`,
		errors: [
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 4,
				textBeforeStart: 'const a: ',
				target: 'Array<string>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/no-inferrable-types',
				line: 11,
				textBeforeStart: 'const ',
				target: 'b: number = 1',
			}),
			errorAt({
				ruleId: '@typescript-eslint/array-type',
				line: 20,
				textBeforeStart: '\tconst a: ',
				target: 'Array<string>',
			}),
			errorAt({
				ruleId: '@typescript-eslint/no-inferrable-types',
				line: 27,
				textBeforeStart: '\tconst ',
				target: 'b: number = 1',
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
		output: dedenter`
			/**
			\`\`\`ts
			function foo(example: () => number): number {
				return example();
			}
			\`\`\`
			*/
			export type T0 = string;

			/**
			\`\`\`ts
			type Foo = Record<string, unknown>;
			\`\`\`
			*/
			export type T1 = string;

			export type T0Options = {
				/**
				\`\`\`ts
				function foo(example: () => number): number {
					return example();
				}
				\`\`\`
				*/
				p0: string;

				/**
				\`\`\`ts
				type Foo = Record<string, unknown>;
				\`\`\`
				*/
				p1: string;
			};

			export type T1Options = {
				/**
				\`\`\`ts
				const foo = new Map<string, number>();
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
		output: dedenter`
			/**
			Note:
			1. First point
				\`\`\`ts
				type Foo = Record<string, unknown>;
				\`\`\`
			2. Second point
				\`\`\`ts
				type Bar = (arg: string) => number;
				\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Note:
				1. First point
					\`\`\`ts
					type Foo = Record<string, unknown>;
					\`\`\`
				2. Second point
					\`\`\`ts
					type Bar = (arg: string) => number;
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
				textBeforeStart: '\t\t\t',
				target: '(arg: string): number;',
			}),
		],
	},
];

describe('jsdoc-codeblocks processor', {concurrency: true}, () => {
	const eslint = new ESLint({cwd: root});
	const eslintFixed = new ESLint({cwd: root, fix: true});

	for (const {name, code, output, errors} of invalid) {
		test(name, async t => {
			const fileName = `test-${name.replaceAll(/\s+/g, '-')}.d.ts`;
			const filePath = path.join(root, fileName);

			await fs.writeFile(filePath, code);
			t.after(async () => {
				await fs.unlink(filePath);
			});

			const results = await eslint.lintFiles([fileName]);

			t.assert.strictEqual(results[0].messages.length, errors.length);

			// Manual loop because `assert.partialDeepStrictEqual` isn't available in Node 20
			for (const [index, expected] of errors.entries()) {
				const actual = results[0].messages[index];
				for (const key of Object.keys(expected)) {
					t.assert.strictEqual(actual[key], expected[key]);
				}
			}

			const resultsFixed = await eslintFixed.lintFiles([fileName]);

			t.assert.strictEqual(resultsFixed[0].output, output);
		});
	}
});
