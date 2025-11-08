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
  const config = {
  	appName: 'MyApp',
  	version: '1.0.0',
  } as const;

  declare function updateConfig(newConfig: typeof config): void;

  updateConfig({
  	appName: 'MyUpdatedApp',
  	version: '2.0.0',
  });
`;

/**
@typedef {{
	line: number;
	textBeforeStart: string;
	isOption?: boolean;
} & ({ target: string } | { endLine: number; textBeforeEnd: string })} ErrorAtProps
*/

/**
@param {ErrorAtProps} props
*/
const errorAt = props => {
	const {line, textBeforeStart, isOption = false} = props;

	const column = textBeforeStart.length + 1 + (isOption ? 1 : 0); // `+1` if it's an option to adjust for the indentation
	const endColumn = 'textBeforeEnd' in props ? props.textBeforeEnd.length + 1 : column + props.target.length;

	const lineOffset = 2 + (isOption ? 1 : 0); // `+2` for JSDoc comment start + code block fence, and `+1` if it's an option to adjust for the option declaration line
	const endLine = 'endLine' in props ? props.endLine : line;

	return {
		messageId: 'error',
		line: line + lineOffset, // 1-based, inclusive
		column, // 1-based, inclusive
		endLine: endLine + lineOffset, // 1-based, inclusive
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
	],
	invalid: [
		// Missing import
		{
			code: exportType(jsdoc(
				'Description',
				fence(dedenter`
					type A = Add<1, 2>;
					//=> 3

					type B = Add<-1, 2>;
					//=> 1
				`),
			)),
			errors: [
				errorAt({line: 2, textBeforeStart: 'type A = ', target: 'Add'}),
				errorAt({line: 5, textBeforeStart: 'type B = ', target: 'Add'}),
			],
		},
		// Floating examples
		{
			code: exportType(jsdoc(
				fence(dedenter`
					import type {IsUppercase} from 'type-fest';

					IsUppercase<'ABC'>;
					//=> true

					IsUppercase<'Abc'>;
					//=> false
				`),
				'@category Test',
			)),
			errors: [
				errorAt({line: 3, textBeforeStart: '', target: 'IsUppercase'}),
				errorAt({line: 6, textBeforeStart: '', target: 'IsUppercase'}),
			],
		},
		// Hypthetical references
		{
			code: exportType(jsdoc(
				'Some description',
				'Some note',
				fence(dedenter`
					import type {Except} from 'type-fest';

					type PostPayload = Except<UserData, 'email'>;
				`),
			)),
			errors: [
				errorAt({line: 5, textBeforeStart: 'type PostPayload = Except<', target: 'UserData'}),
			],
		},
		// Duplicate identifiers
		{
			code: exportOption(jsdoc(
				'@example',
				fence(dedenter`
					import type {IsTuple} from 'type-fest';

					type Example = IsTuple<[number, ...number[]], {fixedLengthOnly: true}>;
					//=> false

					type Example = IsTuple<[number, ...number[]], {fixedLengthOnly: false}>;
					//=> true
				`),
				'@default true',
			)),
			errors: [
				errorAt({line: 4, textBeforeStart: 'type ', target: 'Example', isOption: true}),
				errorAt({line: 7, textBeforeStart: 'type ', target: 'Example', isOption: true}),
			],
		},
		// Multi line error
		{
			code: exportType(jsdoc(
				'@example',
				fence(dedenter`
					declare function updateConfig(newConfig: {name?: string; version?: number}): void;

					updateConfig({
						name: undefined,
						version: undefined,
					});
				`),
				'@default true',
			)),
			errors: [
				errorAt({line: 4, textBeforeStart: 'updateConfig(', endLine: 7, textBeforeEnd: '}'}),
			],
		},
		// Precise one character error
		{
			code: exportOption(jsdoc(
				fence(dedenter`
					import type {ExcludeStrict} from 'type-fest';

					type A = ExcludeStrict<'a' | 'b', 'A'>;
				`),
			)),
			errors: [
				errorAt({
					line: 3,
					textBeforeStart: 'type A = ExcludeStrict<\'a\' | \'b\', ',
					target: '\'A\'',
					isOption: true,
				}),
			],
		},
		// `exactOptionalPropertyTypes` is enabled
		{
			code: exportType(jsdoc(
				fence(dedenter`
					const test: {foo?: string} = {foo: undefined};
				`),
			)),
			errors: [
				errorAt({line: 1, textBeforeStart: 'const ', target: 'test'}),
			],
		},
	],
});
