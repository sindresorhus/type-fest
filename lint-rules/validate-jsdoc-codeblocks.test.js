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

const jsdoc = (...parts) =>
	outdent`
		/**
		${parts.join('\n')}
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

const exportOption = (name, props) =>
	// Replace line breaks with indented line breaks (except empty lines)
	outdent`
		export type ${name} = {
			${props.replaceAll(/\n(?=[^\r\n])/g, '$&\t')}
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
	invalid: [],
});
