import {createRuleTester, dedenter} from './test-utils.js';
import {validateJSDocCodeblocksRule} from './validate-jsdoc-codeblocks.js';

const ruleTester = createRuleTester();

const fence = (code, lang = '') =>
	dedenter`
		\`\`\`${lang}
		${code}
		\`\`\`
	`;

const jsdoc = (...lines) =>
	dedenter`
		/**
		${lines.join('\n')}
		*/
	`;

const exportType = (...prefixes) =>
	prefixes
		.map((doc, i) => dedenter`
			${doc}
			export type T${i} = string;
		`)
		.join('\n\n');

const exportOption = (...prefixes) =>
	dedenter`
		export type TOptions = {
			${prefixes
				.map((doc, i) => dedenter`
					${doc}
					p${i}: string;
				`)
				.join('\n\n')}
		};
	`;

const exportTypeAndOption = (...prefixes) =>
	dedenter`
		${exportType(...prefixes)}

		${exportOption(...prefixes)}
	`;

// Code samples
const code1 = dedenter`
  import type {Sum} from 'type-fest';

  type A = Sum<1, 2>;
  //=> 3
`;

const code2 = dedenter`
  import type {LiteralToPrimitiveDeep} from 'type-fest';

  const config = {appName: 'MyApp', version: '1.0.0'} as const;

  declare function updateConfig(newConfig: LiteralToPrimitiveDeep<typeof config>): void;

  updateConfig({appName: 'MyUpdatedApp', version: '2.0.0'});
`;

const codeWithErrors = dedenter`
import type {RemovePrefix} from 'type-fest';

type A = RemovePrefix<'on-change', string, {strict: "yes"}>;
`;

/**
@typedef {{
	line: number;
	textBeforeStart: string;
} & ({ target: string } | { endLine: number; textBeforeEnd: string })} ErrorAtProps

@param {ErrorAtProps} props
*/
const errorAt = props => {
	const {line, textBeforeStart} = props;

	const column = textBeforeStart.length + 1;
	const endColumn = 'textBeforeEnd' in props ? props.textBeforeEnd.length + 1 : column + props.target.length;

	const endLine = 'endLine' in props ? props.endLine : line;

	return {
		messageId: 'invalidCodeblock',
		line, // 1-based, inclusive
		column, // 1-based, inclusive
		endLine, // 1-based, inclusive
		endColumn, // 1-based, exclusive
	};
};

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
				errorAt({line: 4, textBeforeStart: 'type A = ', target: 'Subtract'}),
				errorAt({line: 14, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
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
				errorAt({line: 7, textBeforeStart: 'type A = ', target: 'Subtract'}),
				errorAt({line: 21, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
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
				errorAt({line: 4, textBeforeStart: 'type A = ', target: 'Subtract'}),
				errorAt({line: 13, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
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
				errorAt({line: 3, textBeforeStart: 'type A = ', target: 'Subtract'}),
				errorAt({line: 11, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
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
				errorAt({line: 3, textBeforeStart: 'type A = ', target: 'Subtract'}),
				errorAt({line: 11, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
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
				errorAt({line: 4, textBeforeStart: 'type A = ', target: 'Subtract'}),
				errorAt({line: 13, textBeforeStart: 'type A = ExcludeStrict<string, ', target: 'number'}),
				errorAt({line: 22, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
				errorAt({line: 31, textBeforeStart: '\ttype A = ExcludeStrict<string, ', target: 'number'}),
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
				errorAt({line: 3, textBeforeStart: 'type A = ', target: 'Subtract'}),
				errorAt({line: 12, textBeforeStart: 'type A = ExcludeStrict<string, ', target: 'number'}),
				errorAt({line: 20, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
				errorAt({line: 29, textBeforeStart: '\ttype A = ExcludeStrict<string, ', target: 'number'}),
				errorAt({line: 40, textBeforeStart: '\t', target: 'Sum'}),
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
				errorAt({line: 5, textBeforeStart: '\ttype A = ', target: 'Subtract'}),
				errorAt({line: 9, textBeforeStart: '\ttype A = ', target: 'Sum'}),
				errorAt({line: 19, textBeforeStart: '\t\ttype A = ', target: 'Subtract'}),
				errorAt({line: 23, textBeforeStart: '\t\ttype A = ', target: 'Sum'}),
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
				errorAt({line: 4, textBeforeStart: 'type A = ', target: 'Sum'}),
				errorAt({line: 7, textBeforeStart: 'type B = ', target: 'Sum'}),
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
				errorAt({line: 5, textBeforeStart: '', target: 'IsUppercase'}),
				errorAt({line: 8, textBeforeStart: '', target: 'IsUppercase'}),
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
				errorAt({line: 7, textBeforeStart: 'type PostPayload = Except<', target: 'UserData'}),
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
				errorAt({line: 7, textBeforeStart: '\ttype ', target: 'Example'}),
				errorAt({line: 10, textBeforeStart: '\ttype ', target: 'Example'}),
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
				errorAt({line: 6, textBeforeStart: 'updateConfig(', endLine: 9, textBeforeEnd: '}'}),
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
				errorAt({
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
				errorAt({line: 3, textBeforeStart: 'const ', target: 'test'}),
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
				errorAt({line: 5, textBeforeStart: 'type A = ', target: 'Sum<1, \'2\'>'}),
				errorAt({line: 5, textBeforeStart: 'type A = Sum<1, ', target: '\'2\''}),
			],
		},
	],
});
