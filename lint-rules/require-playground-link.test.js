import outdent from 'outdent';
import {createRuleTester} from './test-utils.js';
import {generatePlaygroundLink, requirePlaygroundLinkRule} from './require-playground-link.js';

const ruleTester = createRuleTester();

const fence = (code, lang = '') =>
	outdent`
		\`\`\`${lang}
		${code}
		\`\`\`
	`;

const linkFor = code => `[Playground Link](${generatePlaygroundLink(code)})`;

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
		exportedType('CorrectPlayground', jsdoc(fence(codeNumber), linkFor(codeNumber))),

		// Valid link on option property
		exportedOptionsType(
			'TypeOptions',
			optionProp('correctPlayground', jsdoc(fence(codeNumber), linkFor(codeNumber))),
		),

		// Valid link with text before and after
		exportedType(
			'WithText',
			jsdoc('Some description.', fence(codeNumber), linkFor(codeNumber), '@category Some Category'),
		),

		// With `@example` tag
		exportedType('WithExampleTag', jsdoc('@example', fence(codeNumber), linkFor(codeNumber))),

		// With language specifiers
		exportedType(
			'WithLangTs',
			jsdoc(fence(codeNumber, 'ts'), linkFor(codeNumber)),
		),
		exportedType(
			'WithLangTypescript',
			jsdoc(fence(codeNumber, 'typescript'), linkFor(codeNumber)),
		),

		// Multiple code blocks
		exportedType(
			'MultipleCodeBlocks',
			jsdoc(
				'@example',
				fence(codeNumber),
				linkFor(codeNumber),
				'\nSome text in between.\n',
				'@example',
				fence(codeString),
				linkFor(codeString),
			),
		),

		// Multiple properties
		exportedOptionsType(
			'MultipleProps',
			outdent`
				${optionProp('first', jsdoc(fence(codeNumber), linkFor(codeNumber)))}

				${optionProp('second', jsdoc(fence(codeString), linkFor(codeString)))}
			`,
		),

		// Multiple exports
		outdent`
			${exportedType('First', jsdoc(fence(codeNumber, 'ts'), linkFor(codeNumber)))}

			${exportedType('Second', jsdoc('@example', fence(codeNumber), linkFor(codeNumber)))}
		`,

		// Mixbag
		outdent`
			${exportedOptionsType('FirstOptions', outdent`
				${optionProp('foo', jsdoc(fence(codeNumber), linkFor(codeNumber)))}

				${optionProp('bar', jsdoc(fence(codeString), linkFor(codeString)))}
			`)}

			${exportedType('First', jsdoc('Description here.', fence(codeNumber), linkFor(codeNumber), '\n@category Sample'))}

			${exportedOptionsType('SecondOptions', optionProp('foo', jsdoc(fence(codeNumber), linkFor(codeNumber))))}

			${exportedType('Second', jsdoc(fence(codeNumber), linkFor(codeNumber), fence(codeString), linkFor(codeString)))}
		`,
	],
	invalid: [],
});
