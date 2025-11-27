import {describe, test} from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import {ESLint} from 'eslint';
import {code1, code2, dedenter, errorAt, exportType, exportTypeAndOption, fence, jsdoc} from '../lint-rules/test-utils.js';

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
		output: dedenter`
			/**
			Some description.
			\`\`\`ts
			const foo: string[] = [];
			\`\`\`
			@category Test
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.
				\`\`\`ts
				const foo: string[] = [];
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
		output: dedenter`
			/**
			Some description.

			Note: Some note.

			\`\`\`ts
			const foo = 1;
			\`\`\`

			@category Test
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.

				Note: Some note.

				\`\`\`ts
				const foo = 1;
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
		output: dedenter`
			/**
			\`\`\`ts
			const foo: string[] = [];
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`ts
				const foo: string[] = [];
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
		output: dedenter`
			/**
			\`\`\`typescript
			const foo: string[] = [];
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`typescript
				const foo: string[] = [];
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
		output: dedenter`
			/**
			@example
			\`\`\`ts
			const foo: string[] = [];
			\`\`\`

			Some text in between.

			@example
			\`\`\`ts
			const bar = 1;
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				@example
				\`\`\`ts
				const foo: string[] = [];
				\`\`\`

				Some text in between.

				@example
				\`\`\`ts
				const bar = 1;
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
		output: dedenter`
			/**
			Some description.
			\`\`\`ts
			let foo = 1;
			foo = 2;
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.
				\`\`\`ts
				let foo = 1;
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
		output: dedenter`
			/**
			\`\`\`ts
			const foo: string[] = [];

			const bar: number[] = [];

			const baz: boolean[] = [];
			\`\`\`
			Some text after.
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`ts
				const foo: string[] = [];

				const bar: number[] = [];

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
		output: dedenter`
			/**
			Some description.

			@example
			\`\`\`ts
			type Foo = {a: string}
			type Bar = Record<string, Foo>
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				Some description.

				@example
				\`\`\`ts
				type Foo = {a: string}
				type Bar = Record<string, Foo>
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
		output: dedenter`
			/**
			\`\`\`ts
			import type {PickIndexSignature} from 'type-fest';

			type Foo = Record<string, unknown>;

			type Test = PickIndexSignature<Foo>;
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`ts
				import type {PickIndexSignature} from 'type-fest';

				type Foo = Record<string, unknown>;

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
		output: dedenter`
			/**
			Some description.
			Some more description.

			@example
			\`\`\`ts
			type Test = (
				foo: string,
				bar: number
			) => void;
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
				type Test = (
					foo: string,
					bar: number
				) => void;
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
		output: dedenter`
			/**
			@example
			\`\`\`typescript
			const foo = 1

			const bar = new Map<string, number>()

			type Baz = (x: string) => unknown
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				@example
				\`\`\`typescript
				const foo = 1

				const bar = new Map<string, number>()

				type Baz = (x: string) => unknown
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
		output: dedenter`
			/**
			\`\`\`ts
			const foo: string[][] = [];
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`ts
				const foo: string[][] = [];
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
		output: dedenter`
			/**
			\`\`\`ts
			type Foo = () => void;
			\`\`\`
			*/
			export type T0 = string;

			export type TOptions = {
				/**
				\`\`\`ts
				type Foo = () => void;
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
		output: undefined,
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
		output: dedenter`
			/**
			Some description.
			\`\`\`
			type Foo = string;
			\`\`\`
			*/
			export type T0 = string[];

			type Foo = string;
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
		output: undefined,
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

	const testCases = [
		...valid.map(testCase => ({...testCase, type: 'valid'})),
		...invalid.map(testCase => ({...testCase, type: 'invalid'})),
	];

	for (const {type, name, code, output, errors = []} of testCases) {
		test(`${type} - ${name}`, async t => {
			const fileName = `test-${type}-${name.replaceAll(/\s+/g, '-')}.d.ts`;
			const filePath = path.join(root, fileName);
			await fs.writeFile(filePath, code);
			t.after(async () => {
				await fs.unlink(filePath);
			});

			const results = await eslint.lintFiles([fileName]);
			t.assert.strictEqual(results[0].messages.length, errors.length);

			if (type === 'invalid') {
				// Manual loop because `assert.partialDeepStrictEqual` isn't available in Node 20
				for (const [index, expected] of errors.entries()) {
					const actual = results[0].messages[index];
					const actualSubset = Object.fromEntries(Object.keys(expected).map(key => [key, actual[key]]));

					t.assert.deepStrictEqual(actualSubset, expected);
				}

				const resultsFixed = await eslintFixed.lintFiles([fileName]);
				t.assert.strictEqual(resultsFixed[0].output, output);
			}
		});
	}
});
