import outdent from 'outdent';
import {createRuleTester} from './test-utils.js';
import {validateJSDocCodeblocksRule} from './validate-jsdoc-codeblocks.js';

const ruleTester = createRuleTester();

const fence = (code, lang = '') =>
	outdent`
		\`\`\`${lang}
		${code}
		\`\`\`
	`;

const jsdoc = (...lines) =>
	outdent`
		/**
		${lines.join('\n')}
		*/
	`;

const exportType = (name, jsdocBlock = '') =>
	outdent`
		${jsdocBlock}
		export type ${name} = string;
	`;

const optionProp = (name, jsdocBlock = '') =>
	outdent`
		${jsdocBlock}
		${name}: string;
	`;

const indent = (text, indent = '\t') =>
	text.split(/\r?\n/).map(line => line ? `${indent}${line}` : line).join('\n');

const exportOption = (name, props) =>
	outdent`
		export type ${name} = {
		${indent(props)}
		};
	`;

const exportTypeAndOption = (name, jsdocBlock = '') =>
	outdent`
		${jsdocBlock}
		export type ${name} = string;

		${exportOption(`${name}Options`, optionProp('foo', jsdocBlock))}
	`;

// Code samples
const code1 = outdent`
  import type {Sum} from 'type-fest';

  type A = Sum<1, 2>;
  //=> 3
`;

const code2 = outdent`
  import type {LiteralToPrimitiveDeep} from 'type-fest';

  const config = {appName: 'MyApp', version: '1.0.0'} as const;

  declare function updateConfig(newConfig: LiteralToPrimitiveDeep<typeof config>): void;

  updateConfig({appName: 'MyUpdatedApp', version: '2.0.0'});
`;

const codeWithErrors = outdent`
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

// eslint-disable-next-line max-params
const errorAt = (line, after, target, endLine = line, isOption = false) => {
	const column = after.length + 1 + (isOption ? 1 : 0); // `+1` if it's an option to adjust for the indentation
	const lineOffset = 2 + (isOption ? 1 : 0); // JSDoc comment start + code block fence, and `+1` if it's an option to adjust for the option declaration line

	return {
		messageId: 'error',
		line: line + lineOffset, // 1-based, inclusive
		column, // 1-based, inclusive
		endLine: endLine + lineOffset, // 1-based, inclusive
		endColumn: column + target.length, // 1-based, exclusive
	};
};

errorAt.option = (line, after, target, endLine = line) => errorAt(line, after, target, endLine, true);

ruleTester.run('validate-jsdoc-codeblocks', validateJSDocCodeblocksRule, {
	valid: [
		// Not exported
		outdent`
			${jsdoc(fence(codeWithErrors))}
			type NotExported = string;
		`,
		outdent`
			type NotExportedOptions = {
				${optionProp('foo', jsdoc(fence(codeWithErrors)))}
			}
		`,

		// Internal (leading underscore)
		exportType('_Internal', jsdoc(fence(codeWithErrors))),
		exportOption(
			'_InternalOptions',
			optionProp('foo', jsdoc(fence(codeWithErrors))),
		),

		// Without `Options` suffix
		exportOption(
			'NoSuffix',
			optionProp('foo', jsdoc(fence(codeWithErrors))),
		),

		// No JSDoc
		exportTypeAndOption('NoDoc'),
		outdent`
			type Some = number;
			${exportType('NoDoc')}
		`,
		exportOption(
			'NoDocOptions',
			outdent`
				${optionProp('first')}
				${optionProp('second')}
			`,
		),
		outdent`
			// Not block comment
			${exportType('NoDoc')}
		`,
		exportOption(
			'NoDocOptions',
			outdent`
				${optionProp('first', '// Not block comment')}
				${optionProp('second', '// Not block comment')}
			`,
		),
		outdent`
			/* Block comment, but not JSDoc */
			${exportType('NoDoc')}
		`,
		exportOption(
			'NoDocOptions',
			outdent`
				${optionProp('first', '/* Block comment, but not JSDoc */')}
				${optionProp('second', '/* Block comment, but not JSDoc */')}
			`,
		),

		// No codeblock in JSDoc
		exportType('NoCodeblock', jsdoc('No codeblock here')),

		// With text before and after
		exportTypeAndOption('WithText', jsdoc('Some description.', fence(code1), '@category Test')),

		// With line breaks before and after
		exportTypeAndOption(
			'WithText',
			jsdoc('Some description.\n', 'Note: Some note.\n', fence(code1, 'ts'), '\n@category Test'),
		),

		// With `@example` tag
		exportTypeAndOption('WithExampleTag', jsdoc('@example', fence(code1))),

		// With language specifiers
		exportTypeAndOption('WithLangTs', jsdoc(fence(code1, 'ts'))),
		exportTypeAndOption('WithLangTypeScript', jsdoc(fence(code1, 'typescript'))),

		// Multiple code blocks
		exportTypeAndOption(
			'MultipleCodeBlocks',
			jsdoc('@example', fence(code1, 'ts'), '\nSome text in between.\n', '@example', fence(code2)),
		),

		// Multiple properties
		exportOption(
			'MultiplePropsOptions',
			outdent`
				${optionProp('first', jsdoc(fence(code1)))}

				${optionProp('second', jsdoc(fence(code2)))}
			`,
		),

		// Multiple exports
		outdent`
			${exportTypeAndOption('First', jsdoc(fence(code1, 'typescript')))}

			${exportTypeAndOption('Second', jsdoc('@example', fence(code2), '@category Test'))}
		`,
	],
	invalid: [
		// Missing import
		{
			code: exportType('Add', jsdoc(
				'Description',
				fence(outdent`
					type A = Add<1, 2>;
					//=> 3

					type B = Add<-1, 2>;
					//=> 1
				`),
			)),
			errors: [
				errorAt(2, 'type A = ', 'Add'),
				errorAt(5, 'type B = ', 'Add'),
			],
		},
		// Floating examples
		{
			code: exportType('IsUppercase', jsdoc(
				fence(outdent`
					import type {IsUppercase} from 'type-fest';

					IsUppercase<'ABC'>;
					//=> true

					IsUppercase<'Abc'>;
					//=> false
				`),
				'@category Test',
			)),
			errors: [
				errorAt(3, '', 'IsUppercase'),
				errorAt(6, '', 'IsUppercase'),
			],
		},
		// Hypthetical references
		{
			code: exportType('Except', jsdoc(
				'Some description',
				'Some note',
				fence(outdent`
					import type {Except} from 'type-fest';

					type PostPayload = Except<UserData, 'email'>;
				`),
			)),
			errors: [
				errorAt(5, 'type PostPayload = Except<', 'UserData'),
			],
		},
		// Duplicate identifiers
		{
			code: exportOption('IsTupleOptions', optionProp('fixedLengthOnly', jsdoc(
				'@example',
				fence(outdent`
					import type {IsTuple} from 'type-fest';

					type Example = IsTuple<[number, ...number[]], {fixedLengthOnly: true}>;
					//=> false

					type Example = IsTuple<[number, ...number[]], {fixedLengthOnly: false}>;
					//=> true
				`),
				'@default true',
			))),
			errors: [
				errorAt.option(4, 'type ', 'Example'),
				errorAt.option(7, 'type ', 'Example'),
			],
		},
	],
});
