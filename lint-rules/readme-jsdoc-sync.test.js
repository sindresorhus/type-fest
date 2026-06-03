import markdown from '@eslint/markdown';
import {createRuleTester, createFixtures, dedenter} from './test-utils.js';
import {readmeJSDocSyncRule} from './readme-jsdoc-sync.js';

const {fixturePath} = createFixtures({
	'source/some-type-alias.d.ts': dedenter`
		/**
		Some description for \`MyAlias\` type.
		Note: This is a note.
		@example
		type MyAlias = string;
		*/
		export type MyAlias = string;
	`,
	'source/some-interface.d.ts': dedenter`
		/**
		Some description for \`MyInterface\` interface.
		This is second line.
		@category Test
		*/
		export interface MyInterface {
			prop: string;
		}
	`,
	'source/multiple-exports.d.ts': dedenter`
		/**
		First line for \`Multi\`.
		Second line for \`Multi\`.
		*/
		export type Multi = string;

		/**
		Description for \`Other\`.
		*/
		export type Other = number;
	`,
	'source/hyphen.d.ts': dedenter`
		/**
		Contains a - inside.
		*/
		export type Hyphen = string;
	`,
	'source/complex-format.d.ts': dedenter`
		/**
		Description with [link to \`type-fest\`](https://github.com/sindresorhus/type-fest) and some \`code\`. And another sentence.
		@category Test
		*/
		export type ComplexFormat = string;
	`,
	'source/link-tag.d.ts': dedenter`
		/**
		Similar to {@link Exclude<T, U>} type.
		*/
		export type LinkTag = string;
	`,
	'source/noDoc.d.ts': dedenter`
		export type NoDoc = string;
	`,
});

const ruleTester = createRuleTester({
	plugins: {markdown},
});

const testCase = test => ({
	filename: fixturePath('readme.md'),
	language: 'markdown/commonmark',
	...test,
});

ruleTester.run('readme-jsdoc-sync', readmeJSDocSyncRule, {
	valid: [
		// Type alias
		testCase({
			code: '- [`MyAlias`](source/some-type-alias.d.ts) - Some description for `MyAlias` type.',
		}),
		// Interface
		testCase({
			code: '- [`MyInterface`](source/some-interface.d.ts) - Some description for `MyInterface` interface.',
		}),
		// Multiple exports
		testCase({
			code: '- [`Multi`](source/multiple-exports.d.ts) - First line for `Multi`.',
		}),
		testCase({
			code: '- [`Other`](source/multiple-exports.d.ts) - Description for `Other`.',
		}),
		// Description containing a hyphen
		testCase({
			code: '- [`Hyphen`](source/hyphen.d.ts) - Contains a - inside.',
		}),
		// Description with links, inline code, and multiple sentences
		testCase({
			code: '- [`ComplexFormat`](source/complex-format.d.ts) - Description with [link to `type-fest`](https://github.com/sindresorhus/type-fest) and some `code`. And another sentence.',
		}),
		// Description with JSDoc link tag
		testCase({
			code: '- [`LinkTag`](source/link-tag.d.ts) - Similar to `Exclude<T, U>` type.',
		}),
		// Normal list item without a link
		testCase({
			code: '- Some normal list item.',
		}),
		// Non `.d.ts` link
		testCase({
			code: '- [`Partial<T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype) - Make all properties in `T` optional.',
		}),
		// `.d.ts` link with HTTP url
		testCase({
			code: '- [`Linter.Config`](https://github.com/eslint/eslint/blob/main/lib/types/index.d.ts) - Some description.',
		}),
		// Link is not the first element
		testCase({
			code: '- `Prettify`- See [`Simplify`](source/simplify.d.ts)',
		}),
		// Multiple list items
		testCase({
			code: dedenter`
				Some introduction paragraph.


				## Types

				### Some group
				- [\`MyAlias\`](source/some-type-alias.d.ts) - Some description for \`MyAlias\` type.
				- [\`MyInterface\`](source/some-interface.d.ts) - Some description for \`MyInterface\` interface.

				### Another group
				- [\`Multi\`](source/multiple-exports.d.ts) - First line for \`Multi\`.
				- [\`Other\`](source/multiple-exports.d.ts) - Description for \`Other\`.
				- [\`Hyphen\`](source/hyphen.d.ts) - Contains a - inside.


				## Alternatives
				- \`Prettify\`- See [\`Simplify\`](source/simplify.d.ts)
			`,
		}),
	],
	invalid: [
		testCase({
			// Mismatch between README description and source JSDoc
			code: dedenter`
				- [\`MyAlias\`](source/some-type-alias.d.ts) - Some description for MyAlias type.
				- [\`ComplexFormat\`](source/complex-format.d.ts) - Wrong description.
				- [\`LinkTag\`](source/link-tag.d.ts) - Similar to Exclude type.
			`,
			errors: [{messageId: 'mismatch'}, {messageId: 'mismatch'}, {messageId: 'mismatch'}],
			output: dedenter`
				- [\`MyAlias\`](source/some-type-alias.d.ts) - Some description for \`MyAlias\` type.
				- [\`ComplexFormat\`](source/complex-format.d.ts) - Description with [link to \`type-fest\`](https://github.com/sindresorhus/type-fest) and some \`code\`. And another sentence.
				- [\`LinkTag\`](source/link-tag.d.ts) - Similar to \`Exclude<T, U>\` type.
			`,
		}),
		// Linked `.d.ts` file does not exist
		testCase({
			code: '- [`Missing`](source/does-not-exist.d.ts) - Some description.',
			errors: [{messageId: 'fileNotFound'}],
		}),
		// Linked type has no JSDoc description
		testCase({
			code: '- [`NoDoc`](source/noDoc.d.ts) - Some description.',
			errors: [{messageId: 'missingTypeOrJSDoc'}],
		}),
		// Linked type does not exist
		testCase({
			code: '- [`Foo`](source/some-type-alias.d.ts) - Some description for `MyAlias` type.',
			errors: [{messageId: 'missingTypeOrJSDoc'}],
		}),
	],
});
