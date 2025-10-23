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
		};
	`;

const exportTypeAndOptions = (name, jsdocBlock = '') =>
	outdent`
		${jsdocBlock}
		export type ${name} = string;

		${exportedOptionsType(`${name}Options`, optionProp('foo', jsdocBlock))}
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
const code1 = outdent`
	type A = string;
	//=> string

	type B = number;
	//=> number
`;

const code2 = outdent`
	type T1 = {
		foo: string;
		bar: number;
	};

	type T2 = T1[keyof T1];
	//=> string | number
`;

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
			'NoSuffix',
			optionProp('foo', jsdoc(fence(code1))),
		),

		// No JSDoc
		exportTypeAndOptions('NoDoc'),
		outdent`
			type Some = number;
			${exportedType('NoDoc')}
		`,
		exportedOptionsType(
			'NoDocOptions',
			outdent`
				${optionProp('first')}
				${optionProp('second')}
			`,
		),
		outdent`
			// Not block comment
			${exportedType('NoDoc')}
		`,
		exportedOptionsType(
			'NoDocOptions',
			outdent`
				${optionProp('first', '// Not block comment')}
				${optionProp('second', '// Not block comment')}
			`,
		),
		outdent`
			/* Block comment, but not JSDoc */
			${exportedType('NoDoc')}
		`,
		exportedOptionsType(
			'NoDocOptions',
			outdent`
				${optionProp('first', '/* Block comment, but not JSDoc */')}
				${optionProp('second', '/* Block comment, but not JSDoc */')}
			`,
		),

		// No codeblock in JSDoc
		exportedType('NoCodeblock', jsdoc('No codeblock here')),

		// Valid link
		exportedType('CorrectPlayground', jsdoc(fence.link(code1))),
		exportedOptionsType('CorrectPlaygroundOptions', optionProp('foo', jsdoc(fence.link(code1)))),

		// With text before and after
		exportTypeAndOptions('WithText', jsdoc('Some description.', fence.link(code1), '@category Test')),

		// With line breaks before and after
		exportTypeAndOptions(
			'WithText',
			jsdoc('Some description.\n', 'Note: Some note.\n', fence.link(code1, 'ts'), '\n@category Test'),
		),

		// With `@example` tag
		exportTypeAndOptions('WithExampleTag', jsdoc('@example', fence.link(code1))),

		// With language specifiers
		exportTypeAndOptions('WithLangTs', jsdoc(fence.link(code1, 'ts'))),
		exportTypeAndOptions('WithLangTypeScript', jsdoc(fence.link(code1, 'typescript'))),

		// Multiple code blocks
		exportTypeAndOptions(
			'MultipleCodeBlocks',
			jsdoc('@example', fence.link(code1, 'ts'), '\nSome text in between.\n', '@example', fence.link(code2)),
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
			${exportTypeAndOptions('First', jsdoc(fence.link(code1, 'typescript')))}

			${exportTypeAndOptions('Second', jsdoc('@example', fence.link(code1), '@category Test'))}
		`,
	],
	invalid: [
		// Missing link
		missingPlaygroundLinkError(
			exportedType('MissingLink', jsdoc(fence(code1))),
			exportedType('MissingLink', jsdoc(fence.link(code1))),
		),
		missingPlaygroundLinkError(
			exportedOptionsType('MissingLinkOptions', optionProp('foo', jsdoc(fence(code1)))),
			exportedOptionsType('MissingLinkOptions', optionProp('foo', jsdoc(fence.link(code1)))),
		),

		// With text before and after
		missingPlaygroundLinkError(
			exportTypeAndOptions('WithText', jsdoc('Some description.', fence(code1), '@category Test')),
			exportTypeAndOptions('WithText', jsdoc('Some description.', fence.link(code1), '@category Test')),
			2,
		),

		// With line breaks before and after
		missingPlaygroundLinkError(
			exportTypeAndOptions(
				'WithText',
				jsdoc('Some description.\n', 'Note: Some note.\n', fence(code1, 'ts'), '\n@category Test'),
			),
			exportTypeAndOptions(
				'WithText',
				jsdoc('Some description.\n', 'Note: Some note.\n', fence.link(code1, 'ts'), '\n@category Test'),
			),
			2,
		),

		// With `@example` tag
		missingPlaygroundLinkError(
			exportTypeAndOptions('WithExampleTag', jsdoc('@example', fence(code1))),
			exportTypeAndOptions('WithExampleTag', jsdoc('@example', fence.link(code1))),
			2,
		),

		// With language specifiers
		missingPlaygroundLinkError(
			exportTypeAndOptions('WithLangTs', jsdoc(fence(code1, 'ts'))),
			exportTypeAndOptions('WithLangTs', jsdoc(fence.link(code1, 'ts'))),
			2,
		),
		missingPlaygroundLinkError(
			exportTypeAndOptions('WithLangTypeScript', jsdoc(fence(code1, 'typescript'))),
			exportTypeAndOptions('WithLangTypeScript', jsdoc(fence.link(code1, 'typescript'))),
			2,
		),

		// Multiple code blocks
		missingPlaygroundLinkError(
			exportTypeAndOptions(
				'MultipleCodeBlocks',
				jsdoc('@example', fence(code1, 'ts'), '\nSome text in between.\n', '@example', fence(code2)),
			),
			exportTypeAndOptions(
				'MultipleCodeBlocks',
				jsdoc('@example', fence.link(code1, 'ts'), '\nSome text in between.\n', '@example', fence.link(code2)),
			),
			4,
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
				${exportTypeAndOptions('First', jsdoc(fence(code1, 'typescript')))}
	
				${exportTypeAndOptions('Second', jsdoc('@example', fence(code1), '@category Test'))}
			`,
			outdent`
				${exportTypeAndOptions('First', jsdoc(fence.link(code1, 'typescript')))}
	
				${exportTypeAndOptions('Second', jsdoc('@example', fence.link(code1), '@category Test'))}
			`,
			4,
		),

		// Incorrect existing link
		incorrectPlaygroundLinkError(
			exportedType('IncorrectLink', jsdoc(fence(code1), generateLinkText(code2))),
			exportedType('IncorrectLink', jsdoc(fence.link(code1))),
		),

		// Fix indentation
		incorrectPlaygroundLinkError(
			exportedType('IncorrectIndent', jsdoc(fence(code1), '\t' + generateLinkText(code1))),
			exportedType('IncorrectIndent', jsdoc(fence.link(code1))),
		),

		// Empty link
		incorrectPlaygroundLinkError(
			exportedType('EmptyLink', jsdoc(fence(code1), '[Playground Link]()')),
			exportedType('EmptyLink', jsdoc(fence.link(code1))),
		),
	],
});
