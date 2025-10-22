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
	// Replace line breaks with indented line breaks (except empty lines)
	outdent`
		export type ${name} = {
			${props.replaceAll(/\n(?=[^\r\n])/g, '$&\t')}
		}
	`;

const missingPlaygroundLinkError = (code, output, count = 1) => ({
	code,
	errors: Array.from({length: count}, () => ({messageId: 'missingPlaygroundLink'})),
	output,
});

const incorrectPlaygroundLinkError = (code, output, count = 1) => ({
	code,
	errors: Array.from({length: count}, () => ({messageId: 'incorrectPlaygroundLink'})),
	output,
});

// Reusable code samples
const code1 = 'type Foo = number;';
const code2 = 'type Bar = string;';

ruleTester.run('require-playground-link', requirePlaygroundLinkRule, {
	valid: [
		// Not exported
		outdent`
			${jsdoc(fence(code1))}
			type NotExported = string;
		`,
		outdent`
			type NotExportedOptions = {
				${optionProp('foo', jsdoc(fence(code1)))}
			}
		`,

		// Internal (leading underscore)
		exportedType('_Internal', jsdoc(fence(code1))),
		exportedOptionsType(
			'_InternalOptions',
			optionProp('foo', jsdoc(fence(code1))),
		),

		// Without `Options` suffix
		exportedOptionsType(
			'SomeType',
			optionProp('foo', jsdoc(fence(code1))),
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

		// No codeblock in JSDoc
		exportedType('NoCodeblock', jsdoc('No codeblock here')),

		// Valid link
		exportedType('CorrectPlayground', jsdoc(fence.link(code1))),
		exportedOptionsType(
			'CorrectPlayground',
			optionProp('foo', jsdoc(fence.link(code1))),
		),

		// With text before and after
		exportedType(
			'WithText',
			jsdoc('Some description.', fence.link(code1), '@category Test'),
		),
		exportedOptionsType(
			'WithTextOptions',
			optionProp(
				'foo',
				jsdoc('Some description.', fence.link(code1), '@category Test'),
			),
		),

		// Multiple lines of text before and after
		exportedType(
			'WithText',
			jsdoc(
				'Some description.\n',
				'Note: Some note.\n',
				'@example',
				fence.link(code1, 'ts'),
				'\n@category Test',
			),
		),
		exportedOptionsType(
			'WithTextOptions',
			optionProp(
				'foo',
				jsdoc(
					'Some description.\n',
					'Note: Some note.\n',
					'@example',
					fence.link(code1, 'typescript'),
					'\n@category Test',
				),
			),
		),

		// With `@example` tag
		exportedType('WithExampleTag', jsdoc('@example', fence.link(code1))),
		exportedOptionsType(
			'WithExampleTagOptions',
			optionProp('foo', jsdoc('@example', fence.link(code1))),
		),

		// With language specifiers
		exportedType(
			'WithLangTs',
			jsdoc(fence.link(code1, 'ts')),
		),
		exportedOptionsType(
			'WithLangTypescriptOptions',
			optionProp('foo', jsdoc(fence.link(code1, 'typescript'))),
		),

		// Multiple code blocks
		exportedType(
			'MultipleCodeBlocks',
			jsdoc(
				'@example',
				fence.link(code1, 'ts'),
				'\nSome text in between.\n',
				'@example',
				fence.link(code2),
			),
		),
		exportedOptionsType(
			'MultipleCodeBlocksOptions',
			optionProp(
				'foo',
				jsdoc(fence.link(code1, 'ts'), '\nSome text\n', '@example', fence.link(code2)),
			),
		),

		// Multiple properties
		exportedOptionsType(
			'MultiplePropsOptions',
			outdent`
				${optionProp('first', jsdoc(fence.link(code1)))}

				${optionProp('second', jsdoc(fence.link(code2)))}
			`,
		),

		// Multiple exports
		outdent`
			${exportedType('First', jsdoc(fence.link(code1, 'typescript')))}

			${exportedType('Second', jsdoc('@example', fence.link(code1), '@category Test'))}
		`,

		// Mixbag
		outdent`
			${exportedOptionsType('FirstOptions', outdent`
				${optionProp('foo', jsdoc(fence.link(code1)))}

				${optionProp('bar', jsdoc(fence.link(code2)))}
			`)}

			${exportedType('First', jsdoc('Description here.', fence.link(code1), '\n@category Sample'))}

			${exportedOptionsType('SecondOptions', optionProp('foo', jsdoc(fence.link(code1))))}

			${exportedType('Second', jsdoc(fence.link(code1), fence.link(code2)))}
		`,
	],
	invalid: [
		// Missing link
		missingPlaygroundLinkError(
			exportedType('MissingLink', jsdoc(fence(code1))),
			exportedType('MissingLink', jsdoc(fence.link(code1))),
		),
		missingPlaygroundLinkError(
			exportedOptionsType(
				'MissingLinkOptions',
				optionProp('foo', jsdoc(fence(code1))),
			),
			exportedOptionsType(
				'MissingLinkOptions',
				optionProp('foo', jsdoc(fence.link(code1))),
			),
		),

		// With text before and after
		missingPlaygroundLinkError(
			exportedType(
				'WithText',
				jsdoc('Some description.', fence(code1), '@category Test'),
			),
			exportedType(
				'WithText',
				jsdoc('Some description.', fence.link(code1), '@category Test'),
			),
		),
		missingPlaygroundLinkError(
			exportedOptionsType(
				'WithTextOptions',
				optionProp(
					'foo',
					jsdoc('Some description.', fence(code1), '@category Test'),
				),
			),
			exportedOptionsType(
				'WithTextOptions',
				optionProp(
					'foo',
					jsdoc('Some description.', fence.link(code1), '@category Test'),
				),
			),
		),

		// Multiple lines of text before and after
		missingPlaygroundLinkError(
			exportedType(
				'WithText',
				jsdoc(
					'Some description.\n',
					'Note: Some note.\n',
					'@example',
					fence(code1, 'ts'),
					'\n@category Test',
				),
			),
			exportedType(
				'WithText',
				jsdoc(
					'Some description.\n',
					'Note: Some note.\n',
					'@example',
					fence.link(code1, 'ts'),
					'\n@category Test',
				),
			),
		),
		missingPlaygroundLinkError(
			exportedOptionsType(
				'WithTextOptions',
				optionProp(
					'foo',
					jsdoc(
						'Some description.\n',
						'Note: Some note.\n',
						'@example',
						fence(code1, 'typescript'),
						'\n@category Test',
					),
				),
			),
			exportedOptionsType(
				'WithTextOptions',
				optionProp(
					'foo',
					jsdoc(
						'Some description.\n',
						'Note: Some note.\n',
						'@example',
						fence.link(code1, 'typescript'),
						'\n@category Test',
					),
				),
			),
		),

		// With `@example` tag
		missingPlaygroundLinkError(
			exportedType('WithExampleTag', jsdoc('@example', fence(code1))),
			exportedType('WithExampleTag', jsdoc('@example', fence.link(code1))),
		),
		missingPlaygroundLinkError(
			exportedOptionsType(
				'WithExampleTagOptions',
				optionProp('foo', jsdoc('@example', fence(code1))),
			),
			exportedOptionsType(
				'WithExampleTagOptions',
				optionProp('foo', jsdoc('@example', fence.link(code1))),
			),
		),

		// With language specifiers
		missingPlaygroundLinkError(
			exportedType(
				'WithLangTs',
				jsdoc(fence(code1, 'ts')),
			),
			exportedType(
				'WithLangTs',
				jsdoc(fence.link(code1, 'ts')),
			),
		),
		missingPlaygroundLinkError(
			exportedOptionsType(
				'WithLangTypescriptOptions',
				optionProp('foo', jsdoc(fence(code1, 'typescript'))),
			),
			exportedOptionsType(
				'WithLangTypescriptOptions',
				optionProp('foo', jsdoc(fence.link(code1, 'typescript'))),
			),
		),

		// Multiple code blocks
		missingPlaygroundLinkError(
			exportedType(
				'MultipleCodeBlocks',
				jsdoc(fence(code1, 'ts'), '\nSome text in between.\n', '@example', fence(code2)),
			),
			exportedType(
				'MultipleCodeBlocks',
				jsdoc(fence.link(code1, 'ts'), '\nSome text in between.\n', '@example', fence.link(code2)),
			),
			2,
		),
		missingPlaygroundLinkError(
			exportedOptionsType(
				'MultipleCodeBlocksOptions',
				optionProp(
					'foo',
					jsdoc(fence(code1, 'ts'), '\nSome text\n', '@example', fence(code2)),
				),
			),
			exportedOptionsType(
				'MultipleCodeBlocksOptions',
				optionProp(
					'foo',
					jsdoc(fence.link(code1, 'ts'), '\nSome text\n', '@example', fence.link(code2)),
				),
			),
			2,
		),

		// Multiple properties
		missingPlaygroundLinkError(
			exportedOptionsType(
				'MultiplePropsOptions',
				outdent`
					${optionProp('first', jsdoc(fence(code1)))}

					${optionProp('second', jsdoc(fence(code2)))}
				`,
			),
			exportedOptionsType(
				'MultiplePropsOptions',
				outdent`
					${optionProp('first', jsdoc(fence.link(code1)))}

					${optionProp('second', jsdoc(fence.link(code2)))}
				`,
			),
			2,
		),

		// Multiple exports
		missingPlaygroundLinkError(
			outdent`
				${exportedType('First', jsdoc(fence(code1, 'typescript')))}

				${exportedType('Second', jsdoc('@example', fence(code1), '@category Test'))}
			`,
			outdent`
				${exportedType('First', jsdoc(fence.link(code1, 'typescript')))}

				${exportedType('Second', jsdoc('@example', fence.link(code1), '@category Test'))}
			`,
			2,
		),

		// Mixbag
		missingPlaygroundLinkError(
			outdent`
				${exportedOptionsType('FirstOptions', outdent`
					${optionProp('foo', jsdoc(fence(code1)))}

					${optionProp('bar', jsdoc(fence(code2)))}
				`)}

				${exportedType('First', jsdoc('Description here.', fence(code1), '\n@category Sample'))}

				${exportedOptionsType('SecondOptions', optionProp('foo', jsdoc(fence(code1))))}

				${exportedType('Second', jsdoc(fence(code1), fence(code2)))}
			`,
			outdent`
				${exportedOptionsType('FirstOptions', outdent`
					${optionProp('foo', jsdoc(fence.link(code1)))}

					${optionProp('bar', jsdoc(fence.link(code2)))}
				`)}

				${exportedType('First', jsdoc('Description here.', fence.link(code1), '\n@category Sample'))}

				${exportedOptionsType('SecondOptions', optionProp('foo', jsdoc(fence.link(code1))))}

				${exportedType('Second', jsdoc(fence.link(code1), fence.link(code2)))}
			`,
			6,
		),

		// Incorrect existing link
		incorrectPlaygroundLinkError(
			exportedType('IncorrectLink', jsdoc(fence(code1), generateLinkText(code2))),
			exportedType('IncorrectLink', jsdoc(fence.link(code1))),
		),
	],
});
