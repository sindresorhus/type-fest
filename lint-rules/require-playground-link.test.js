import outdent from 'outdent';
import {createRuleTester, dedenter, exportType, exportTypeAndOption, fence, jsdoc} from './test-utils.js';
import {generateLinkText, requirePlaygroundLinkRule} from './require-playground-link.js';

const ruleTester = createRuleTester();

const fenceWithLink = (code, lang = '') =>
	outdent`
		${fence(code, lang)}
		${generateLinkText(code)}
	`;

const missingPlaygroundLinkError = ({code, output, nErrors = 2}) => ({
	code,
	errors: Array.from({length: nErrors}, () => ({messageId: 'missingPlaygroundLink'})),
	output,
});

const incorrectPlaygroundLinkError = ({code, output, nErrors = 2}) => ({
	code,
	errors: Array.from({length: nErrors}, () => ({messageId: 'incorrectPlaygroundLink'})),
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
		dedenter`
			${jsdoc(fence(code1))}
			type NotExported = string;
		`,
		dedenter`
			type NotExportedOptions = {
				${jsdoc(fence(code1))}
				p1: string;
			}
		`,

		// Internal (leading underscore)
		dedenter`
			${jsdoc(fence(code1))}
			export type _Internal = string;
		`,
		dedenter`
			export type _InternalOptions = {
				${jsdoc(fence(code1))}
				p1: string;
			}
		`,

		// Without `Options` suffix
		dedenter`
			export type NoSuffix = {
				${jsdoc(fence(code1))}
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

		// Valid link
		exportTypeAndOption(jsdoc(fenceWithLink(code1))),

		// With text before and after
		exportTypeAndOption(jsdoc('Some description.', fenceWithLink(code1), '@category Test')),

		// With line breaks before and after
		exportTypeAndOption(
			jsdoc('Some description.\n', 'Note: Some note.\n', fenceWithLink(code1, 'ts'), '\n@category Test'),
		),

		// With `@example` tag
		exportTypeAndOption(jsdoc('@example', fenceWithLink(code1))),

		// With language specifiers
		exportTypeAndOption(jsdoc(fenceWithLink(code1, 'ts'))),
		exportTypeAndOption(jsdoc(fenceWithLink(code1, 'typescript'))),

		// Multiple code blocks
		exportTypeAndOption(
			jsdoc('@example', fenceWithLink(code1, 'ts'), '\nSome text in between.\n', '@example', fenceWithLink(code2)),
		),

		// Multiple exports and multiple properties
		exportTypeAndOption(jsdoc(fenceWithLink(code1)), jsdoc(fenceWithLink(code2))),
	],
	invalid: [
		// Missing link
		missingPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc(fence(code1))),
			output: exportTypeAndOption(jsdoc(fenceWithLink(code1))),
		}),

		// With text before and after
		missingPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc('Some description.', fence(code1), '@category Test')),
			output: exportTypeAndOption(jsdoc('Some description.', fenceWithLink(code1), '@category Test')),
		}),

		// With line breaks before and after
		missingPlaygroundLinkError({
			code: exportTypeAndOption(
				jsdoc('Some description.\n', 'Note: Some note.\n', fence(code1, 'ts'), '\n@category Test'),
			),
			output: exportTypeAndOption(
				jsdoc('Some description.\n', 'Note: Some note.\n', fenceWithLink(code1, 'ts'), '\n@category Test'),
			),
		}),

		// With `@example` tag
		missingPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc('@example', fence(code1))),
			output: exportTypeAndOption(jsdoc('@example', fenceWithLink(code1))),
		}),

		// With language specifiers
		missingPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc(fence(code1, 'ts'))),
			output: exportTypeAndOption(jsdoc(fenceWithLink(code1, 'ts'))),
		}),
		missingPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc(fence(code1, 'typescript'))),
			output: exportTypeAndOption(jsdoc(fenceWithLink(code1, 'typescript'))),
		}),

		// Multiple code blocks
		missingPlaygroundLinkError({
			code: exportTypeAndOption(
				jsdoc('@example', fence(code1, 'ts'), '\nSome text in between.\n', '@example', fence(code2)),
			),
			output: exportTypeAndOption(
				jsdoc('@example', fenceWithLink(code1, 'ts'), '\nSome text in between.\n', '@example', fenceWithLink(code2)),
			),
			nErrors: 4,
		}),

		// Multiple exports and multiple properties
		missingPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc(fence(code1)), jsdoc(fence(code2))),
			output: exportTypeAndOption(jsdoc(fenceWithLink(code1)), jsdoc(fenceWithLink(code2))),
			nErrors: 4,
		}),

		// Incorrect existing link
		incorrectPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc(fence(code1), generateLinkText(code2))),
			output: exportTypeAndOption(jsdoc(fenceWithLink(code1))),
		}),

		// Fix indentation
		incorrectPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc(fence(code1), '\t' + generateLinkText(code1))),
			output: exportTypeAndOption(jsdoc(fenceWithLink(code1))),
		}),

		// Empty link
		incorrectPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc(fence(code1), '[Playground Link]()')),
			output: exportTypeAndOption(jsdoc(fenceWithLink(code1))),
		}),

		// With text before and after
		incorrectPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc('Some description.', fence(code1), generateLinkText(code2), '@category Test')),
			output: exportTypeAndOption(jsdoc('Some description.', fenceWithLink(code1), '@category Test')),
		}),

		// With line breaks before and after
		incorrectPlaygroundLinkError({
			code: exportTypeAndOption(
				jsdoc('Some description.\n', 'Note: Some note.\n', fence(code1, 'ts'), generateLinkText(code2), '\n@category Test'),
			),
			output: exportTypeAndOption(
				jsdoc('Some description.\n', 'Note: Some note.\n', fenceWithLink(code1, 'ts'), '\n@category Test'),
			),
		}),

		// With `@example` tag
		incorrectPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc('@example', fence(code1), generateLinkText(code2))),
			output: exportTypeAndOption(jsdoc('@example', fenceWithLink(code1))),
		}),

		// With language specifiers
		incorrectPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc(fence(code1, 'ts'), generateLinkText(code2))),
			output: exportTypeAndOption(jsdoc(fenceWithLink(code1, 'ts'))),
		}),
		incorrectPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc(fence(code1, 'typescript'), generateLinkText(code2))),
			output: exportTypeAndOption(jsdoc(fenceWithLink(code1, 'typescript'))),
		}),

		// Multiple code blocks
		incorrectPlaygroundLinkError({
			code: exportTypeAndOption(
				jsdoc('@example', fence(code1, 'ts'), generateLinkText(code2), '\nSome text in between.\n', '@example', fence(code2), generateLinkText(code1)),
			),
			output: exportTypeAndOption(
				jsdoc('@example', fenceWithLink(code1, 'ts'), '\nSome text in between.\n', '@example', fenceWithLink(code2)),
			),
			nErrors: 4,
		}),

		// Multiple exports and multiple properties
		incorrectPlaygroundLinkError({
			code: exportTypeAndOption(jsdoc(fence(code1), generateLinkText(code2)), jsdoc(fence(code2), generateLinkText(code1))),
			output: exportTypeAndOption(jsdoc(fenceWithLink(code1)), jsdoc(fenceWithLink(code2))),
			nErrors: 4,
		}),
	],
});
