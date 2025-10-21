import outdent from 'outdent';
import {createRuleTester} from './test-utils.js';
import {generateLinkText, requirePlaygroundLinkRule} from './require-playground-link.js';

const ruleTester = createRuleTester();

const fence = (code, lang = '') =>
	outdent`
		\`\`\`${lang}
		${code}
		\`\`\`
	`;

fence.link = (code, lang = '') =>
	outdent`
		${fence(code, lang)}
		${generateLinkText(code)}
	`;

const jsdoc = (...parts) =>
	outdent`
		/**
		${parts.join('\n')}
		*/
	`;

const exportedType = (name, jsdocBlock = '') =>
	outdent`
		${jsdocBlock}
		export type ${name} = string;
	`;

const optionProp = (name, jsdocBlock = '') =>
	outdent`
		${jsdocBlock}
		${name}: string;
	`;

const exportedOptionsType = (name, props) =>
	outdent`
		export type ${name} = {
			${props.replaceAll('\n', '\n\t')}
		}
	`;

const missingPlaygroundLinkError = (code, output, count = 1) => ({
	code,
	errors: Array.from({length: count}, () => ({messageId: 'missingPlaygroundLink'})),
	output,
});

// Reusable code samples
const codeNumber = 'type Test = number;';
const codeString = 'type Test = string;';

ruleTester.run('require-playground-link', requirePlaygroundLinkRule, {
	valid: [
		// Not exported
		outdent`
			${jsdoc(fence(codeNumber))}
			type NotExported = string;
		`,
		outdent`
			type NotExportedOptions = {
				${optionProp('someOption', jsdoc(fence(codeNumber)))}
			}
		`,

		// Internal (leading underscore)
		exportedType('_Internal', jsdoc(fence(codeNumber))),
		exportedOptionsType(
			'_InternalOptions',
			optionProp('someOption', jsdoc(fence(codeNumber))),
		),

		// No JSDoc
		exportedType('NoDoc'),
		outdent`
			type Some = number;
			${exportedType('NoDoc')}
		`,
		outdent`
			// Not block comment
			${exportedType('NoDoc')}
		`,
		outdent`
			/* Block comment, but not JSDoc */
			${exportedType('NoDoc')}
		`,

		// No code block in JSDoc
		exportedType('NoCodeblock', jsdoc('No codeblock here')),

		// Valid link
		exportedType('CorrectPlayground', jsdoc(fence.link(codeNumber))),

		// Valid link on option property
		exportedOptionsType(
			'TypeOptions',
			optionProp('correctPlayground', jsdoc(fence.link(codeNumber))),
		),

		// Valid link with text before and after
		exportedType(
			'WithText',
			jsdoc('Some description.', fence.link(codeNumber), '@category Some Category'),
		),

		// With `@example` tag
		exportedType('WithExampleTag', jsdoc('@example', fence.link(codeNumber))),

		// With language specifiers
		exportedType(
			'WithLangTs',
			jsdoc(fence.link(codeNumber, 'ts')),
		),
		exportedType(
			'WithLangTypescript',
			jsdoc(fence.link(codeNumber, 'typescript')),
		),

		// Multiple code blocks
		exportedType(
			'MultipleCodeBlocks',
			jsdoc(
				'@example',
				fence.link(codeNumber),
				'\nSome text in between.\n',
				'@example',
				fence.link(codeString),
			),
		),

		// Multiple properties
		exportedOptionsType(
			'MultipleProps',
			outdent`
				${optionProp('first', jsdoc(fence.link(codeNumber)))}

				${optionProp('second', jsdoc(fence.link(codeString)))}
			`,
		),

		// Multiple exports
		outdent`
			${exportedType('First', jsdoc(fence.link(codeNumber, 'ts')))}

			${exportedType('Second', jsdoc('@example', fence.link(codeNumber)))}
		`,

		// Mixbag
		outdent`
			${exportedOptionsType('FirstOptions', outdent`
				${optionProp('foo', jsdoc(fence.link(codeNumber)))}

				${optionProp('bar', jsdoc(fence.link(codeString)))}
			`)}

			${exportedType('First', jsdoc('Description here.', fence.link(codeNumber), '\n@category Sample'))}

			${exportedOptionsType('SecondOptions', optionProp('foo', jsdoc(fence.link(codeNumber))))}

			${exportedType('Second', jsdoc(fence.link(codeNumber), fence.link(codeString)))}
		`,
	],
	invalid: [
		missingPlaygroundLinkError(
			exportedType('Test', jsdoc(fence(codeNumber))),
			exportedType('Test', jsdoc(fence.link(codeNumber))),
		),
		missingPlaygroundLinkError(
			exportedOptionsType(
				'TestOptions',
				optionProp('someOption', jsdoc(fence(codeNumber))),
			),
			exportedOptionsType(
				'TestOptions',
				optionProp('someOption', jsdoc(fence.link(codeNumber))),
			),
		),

		// With `@example` tag
		missingPlaygroundLinkError(
			exportedType('WithExampleTag', jsdoc('@example', fence(codeNumber))),
			exportedType('WithExampleTag', jsdoc('@example', fence.link(codeNumber))),
		),
		missingPlaygroundLinkError(
			exportedOptionsType(
				'WithExampleTagOptions',
				optionProp('someOption', jsdoc('@example', fence(codeNumber))),
			),
			exportedOptionsType(
				'WithExampleTagOptions',
				optionProp('someOption', jsdoc('@example', fence.link(codeNumber))),
			),
		),

		// With language specifiers
		missingPlaygroundLinkError(
			exportedType(
				'WithLangTs',
				jsdoc(fence(codeNumber, 'ts')),
			),
			exportedType(
				'WithLangTs',
				jsdoc(fence.link(codeNumber, 'ts')),
			),
		),
		missingPlaygroundLinkError(
			exportedOptionsType(
				'WithLangTypescriptOptions',
				optionProp('someOption', jsdoc(fence(codeNumber, 'typescript'))),
			),
			exportedOptionsType(
				'WithLangTypescriptOptions',
				optionProp('someOption', jsdoc(fence.link(codeNumber, 'typescript'))),
			),
		),

		// Before and after text
		missingPlaygroundLinkError(
			exportedType(
				'WithText',
				jsdoc('Some description.\n', fence(codeNumber), '\n@category Some Category'),
			),
			exportedType(
				'WithText',
				jsdoc('Some description.\n', fence.link(codeNumber), '\n@category Some Category'),
			),
		),

		// Multiple code blocks
		missingPlaygroundLinkError(
			exportedType(
				'MultipleCodeBlocks',
				jsdoc(fence(codeNumber, 'ts'), '\nSome text\n', '@example', fence(codeString)),
			),
			exportedType(
				'MultipleCodeBlocks',
				jsdoc(fence.link(codeNumber, 'ts'), '\nSome text\n', '@example', fence.link(codeString)),
			),
			2,
		),

		// Multiple properties
		missingPlaygroundLinkError(
			exportedOptionsType(
				'MultiplePropsOptions',
				outdent`
					${optionProp('first', jsdoc(fence(codeNumber)))}

					${optionProp('second', jsdoc(fence(codeString)))}
				`,
			),
			exportedOptionsType(
				'MultiplePropsOptions',
				outdent`
					${optionProp('first', jsdoc(fence.link(codeNumber)))}

					${optionProp('second', jsdoc(fence.link(codeString)))}
				`,
			),
			2,
		),

		// Multiple exports
		missingPlaygroundLinkError(
			outdent`
				${exportedType('First', jsdoc(fence(codeNumber, 'typescript')))}

				${exportedType('Second', jsdoc('@example', fence(codeNumber), '@category Test'))}
			`,
			outdent`
				${exportedType('First', jsdoc(fence.link(codeNumber, 'typescript')))}

				${exportedType('Second', jsdoc('@example', fence.link(codeNumber), '@category Test'))}
			`,
			2,
		),
	],
});
