import outdent from 'outdent';
import {createRuleTester, dedenter, exportType, exportTypeAndOption, fence, jsdoc} from './test-utils.js';
import {generateLinkText, requirePlaygroundLinkRule} from './require-playground-link.js';

const ruleTester = createRuleTester();

const fenceWithLink = (code, lang = '', linkCode = code) =>
	outdent`
		${fence(code, lang)}
		${generateLinkText(linkCode)}
	`;

const missingPlaygroundLinkError = getPrefixes => {
	// Track the number of times `fence` is called to determine the no. of errors
	let callCount = 0;
	const trackedFence = (...args) => {
		callCount++;
		return fence(...args);
	};

	return {
		// Codeblocks in input code don't have playground links
		code: exportTypeAndOption(...getPrefixes(trackedFence)),
		// Create two error objects for each `fence` call (one for type and one for option)
		errors: Array.from({length: callCount * 2}, () => ({messageId: 'missingPlaygroundLink'})),
		// Codeblocks in output code have playground links
		output: exportTypeAndOption(...getPrefixes(fenceWithLink)),
	};
};

const incorrectPlaygroundLinkError = getPrefixes => {
	// Track the number of times `fence` is called to determine the no. of errors
	let callCount = 0;
	const trackedFenceWithIncorrectLink = (code, lang) => {
		callCount++;
		return fenceWithLink(code, lang, code + '\n// incorrect');
	};

	return {
		// Codeblocks in input code have incorrect playground links
		code: exportTypeAndOption(...getPrefixes(trackedFenceWithIncorrectLink)),
		// Create two error objects for each `fence` call (one for type and one for option)
		errors: Array.from({length: callCount * 2}, () => ({messageId: 'incorrectPlaygroundLink'})),
		// Codeblocks in output code have correct playground links
		output: exportTypeAndOption(...getPrefixes(fenceWithLink)),
	};
};

// Code samples
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
		missingPlaygroundLinkError(fence => [jsdoc(fence(code1))]),

		// With text before and after
		missingPlaygroundLinkError(fence => [jsdoc('Some description.', fence(code1), '@category Test')]),

		// With line breaks before and after
		missingPlaygroundLinkError(fence => [
			jsdoc('Some description.\n', 'Note: Some note.\n', fence(code1, 'ts'), '\n@category Test'),
		]),

		// With `@example` tag
		missingPlaygroundLinkError(fence => [jsdoc('@example', fence(code1))]),

		// With language specifiers
		missingPlaygroundLinkError(fence => [jsdoc(fence(code1, 'ts'))]),
		missingPlaygroundLinkError(fence => [jsdoc(fence(code1, 'typescript'))]),

		// Multiple code blocks
		missingPlaygroundLinkError(fence => [
			jsdoc('@example', fence(code1, 'ts'), '\nSome text in between.\n', '@example', fence(code2)),
		]),

		// Multiple exports and multiple properties
		missingPlaygroundLinkError(fence => [jsdoc(fence(code1)), jsdoc(fence(code2))]),

		// Incorrect existing link
		incorrectPlaygroundLinkError(fence => [jsdoc(fence(code1))]),

		// Fix indentation
		{
			code: exportTypeAndOption(jsdoc(fence(code1), '\t' + generateLinkText(code1))),
			output: exportTypeAndOption(jsdoc(fenceWithLink(code1))),
			errors: [{messageId: 'incorrectPlaygroundLink'}, {messageId: 'incorrectPlaygroundLink'}],
		},

		// Empty link
		{
			code: exportTypeAndOption(jsdoc(fence(code1), '[Playground Link]()')),
			output: exportTypeAndOption(jsdoc(fenceWithLink(code1))),
			errors: [{messageId: 'incorrectPlaygroundLink'}, {messageId: 'incorrectPlaygroundLink'}],
		},

		// With text before and after
		incorrectPlaygroundLinkError(fence => [jsdoc('Some description.', fence(code1), '@category Test')]),

		// With line breaks before and after
		incorrectPlaygroundLinkError(fence => [
			jsdoc('Some description.\n', 'Note: Some note.\n', fence(code1, 'ts'), '\n@category Test'),
		]),

		// With `@example` tag
		incorrectPlaygroundLinkError(fence => [jsdoc('@example', fence(code1))]),

		// With language specifiers
		incorrectPlaygroundLinkError(fence => [jsdoc(fence(code1, 'ts'))]),
		incorrectPlaygroundLinkError(fence => [jsdoc(fence(code1, 'typescript'))]),

		// Multiple code blocks
		incorrectPlaygroundLinkError(fence => [
			jsdoc('@example', fence(code1, 'ts'), '\nSome text in between.\n', '@example', fence(code2)),
		]),

		// Multiple exports and multiple properties
		incorrectPlaygroundLinkError(fence => [jsdoc(fence(code1)), jsdoc(fence(code2))]),
	],
});
