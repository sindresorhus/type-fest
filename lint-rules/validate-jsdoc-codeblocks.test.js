import {code1, code2, createRuleTester, dedenter, errorAt as errorAt_, exportType, exportTypeAndOption, fence, jsdoc} from './test-utils.js';
import {validateJSDocCodeblocksRule} from './validate-jsdoc-codeblocks.js';

const ruleTester = createRuleTester();

const codeWithErrors = dedenter`
import type {RemovePrefix} from 'type-fest';

type A = RemovePrefix<'on-change', string, {strict: "yes"}>;
`;

const invalidCodeblockErrorAt = props => errorAt_({...props, messageId: 'invalidCodeblock'});
const typeMismatchErrorAt = props => errorAt_({...props, messageId: 'typeMismatch'});

ruleTester.run('validate-jsdoc-codeblocks', validateJSDocCodeblocksRule, {
	valid: [
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

		// Multiple code blocks
		exportTypeAndOption(
			jsdoc('@example', fence(code1, 'ts'), '\nSome text in between.\n', '@example', fence(code2)),
		),

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
			// @exactOptionalPropertyTypes: false
			const foo: {a?: number} = {a: undefined};
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
			import type {ExcludeStrict, Sum} from 'type-fest';

			type A = Sum<1, '2'>;
			\`\`\`
			*/
			export type Test = string;
			`,
			errors: [
				invalidCodeblockErrorAt({line: 5, textBeforeStart: 'type A = ', target: 'Sum<1, \'2\'>'}),
				invalidCodeblockErrorAt({line: 5, textBeforeStart: 'type A = Sum<1, ', target: '\'2\''}),
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
			// @exactOptionalPropertyTypes: false
			import type {AllExtend} from 'type-fest';

			type A = AllExtend<[1?, 2?, 3?], number>;
			//=> boolean
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

		// Numbers are sorted in union
		exportTypeAndOption(jsdoc(fence(dedenter`
			import type {IntClosedRange} from 'type-fest';

			type ZeroToNine = IntClosedRange<0, 9>;
			//=> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
		`))),

		// Nested union are sorted
		exportTypeAndOption(jsdoc(fence(dedenter`
			type Test = {w: 0 | 10 | 5; x: [2 | 16 | 4]; y: {z: 3 | 27 | 9}};
			//=> {w: 0 | 5 | 10; x: [2 | 4 | 16]; y: {z: 3 | 9 | 27}}
		`))),

		// Unions inside unions are sorted
		exportTypeAndOption(jsdoc(fence(dedenter`
			type Test = {a: 'foo' | 27 | 1 | {b: 2 | 1 | 8 | 4} | 9 | 3 | 'bar'};
			//=> {a: 'foo' | 1 | 3 | 9 | 27 | {b: 1 | 2 | 4 | 8} | 'bar'}
		`))),

		// Only numbers are sorted in union, non-numbers remain unchanged
		exportTypeAndOption(jsdoc(fence(dedenter`
			import type {ArrayElement} from 'type-fest';

			type Tuple1 = ArrayElement<[null, string, boolean, 1, 3, 0, -2, 4, 2, -1]>;
			//=> string | boolean | -2 | -1 | 0 | 1 | 2 | 3 | 4 | null

			type Tuple2 = ArrayElement<[null, 1, 3, string, 0, -2, 4, 2, boolean, -1]>;
			//=> string | boolean | -2 | -1 | 0 | 1 | 2 | 3 | 4 | null
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
				typeMismatchErrorAt({line: 4, textBeforeStart: '', target: '//=> \'baz\''}),
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
				typeMismatchErrorAt({line: 4, textBeforeStart: '', target: '//=>'}),
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
				typeMismatchErrorAt({line: 4,	textBeforeStart: '',	target: '//=>string'}),
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
				typeMismatchErrorAt({line: 4, textBeforeStart: '', target: '//=>     string'}),
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
				typeMismatchErrorAt({line: 4, textBeforeStart: '', endLine: 10, textBeforeEnd: '//}'}),
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
				typeMismatchErrorAt({line: 4, textBeforeStart: '', endLine: 10, textBeforeEnd: '// }'}),
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
				typeMismatchErrorAt({line: 4, textBeforeStart: '', endLine: 8, textBeforeEnd: '// }'}),
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
				typeMismatchErrorAt({line: 4, textBeforeStart: '', endLine: 11, textBeforeEnd: '// }'}),
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
				typeMismatchErrorAt({line: 4, textBeforeStart: '', endLine: 6, textBeforeEnd: '// }]'}),
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

		// Compiler options overrides
		{
			code: dedenter`
				/**
				\`\`\`ts
				// @exactOptionalPropertyTypes: false
				type Prettify<T> = {
					[P in keyof T]: T[P];
				};

				type T1 = Prettify<{a?: string; b?: number}>;
				//=> {
				// 	a?: string;
				// 	b?: number;
				// }
				\`\`\`
				*/
				export type T0 = string;
			`,
			errors: [
				typeMismatchErrorAt({line: 9, textBeforeStart: '', endLine: 12, textBeforeEnd: '// }'}),
			],
			output: dedenter`
				/**
				\`\`\`ts
				// @exactOptionalPropertyTypes: false
				type Prettify<T> = {
					[P in keyof T]: T[P];
				};

				type T1 = Prettify<{a?: string; b?: number}>;
				//=> {a?: string | undefined; b?: number | undefined}
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
				typeMismatchErrorAt({line: 6, textBeforeStart: '\t', endLine: 11, textBeforeEnd: '\t// }'}),
				typeMismatchErrorAt({line: 16, textBeforeStart: '\t', target: '//=> [\'a\', \'c\']'}),
				typeMismatchErrorAt({line: 18, textBeforeStart: '\t', target: '//=> Set<string>'}),
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
				typeMismatchErrorAt({line: 4, textBeforeStart: '', target: '//=>'}),
				typeMismatchErrorAt({line: 6, textBeforeStart: '', target: '//=>'}),
				typeMismatchErrorAt({line: 8, textBeforeStart: '', target: '//=>'}),
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
	],
});
