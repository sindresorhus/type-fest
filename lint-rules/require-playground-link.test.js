import outdent from 'outdent';
import {createRuleTester} from './test-utils.js';
import {generatePlaygroundLink, requirePlaygroundLinkRule} from './require-playground-link.js';

const ruleTester = createRuleTester();

ruleTester.run('require-playground-link', requirePlaygroundLinkRule, {
	valid: [
		// Not exported
		outdent`
			/**
			\`\`\`
			type T = string;
			\`\`\`
			*/
			type NotExported = string;
		`,
		outdent`
			type NotExportedOptions = {
				/**
				\`\`\`
				type Test = number;
				\`\`\`
				*/
				someOption: string;
			}
		`,
		// Internal
		outdent`
			/**
			\`\`\`
			type T = string;
			\`\`\`
			*/
			export type _Internal = string;
		`,
		outdent`
			type _InternalOptions = {
				/**
				\`\`\`
				type Test = number;
				\`\`\`
				*/
				someOption: string;
			}
		`,
		// No JSDoc
		'export type NoDoc = string;',
		outdent`
			type Some = number;
			export type NoDoc = string;
		`,
		outdent`
			// Not block comment
			export type NoDoc = string;
		`,
		outdent`
			/* Block comment, but not JSDoc */
			export type NoDoc = string;
		`,
		// No codeblock
		outdent`
			/**
			No codeblock here
			*/
			export type NoCodeblock = string;
		`,
		// Valid playground link
		outdent`
			/**
			\`\`\`
			type Test = number;
			\`\`\`
			[Playground Link](${generatePlaygroundLink('type Test = number;')})
			*/
			export type CorrectPlayground = string;
		`,
		outdent`
			export type TypeOptions = {
				/**
				\`\`\`
				type Test = number;
				\`\`\`
				[Playground Link](${generatePlaygroundLink('type Test = number;')})
				*/
				correctPlayground: string;
			}
		`,
		// With text before and after codeblock
		outdent`
			/**
			Some description.
			\`\`\`
			type Test = number;
			\`\`\`
			[Playground Link](${generatePlaygroundLink('type Test = number;')})
			@category Some Category
			*/
			export type CorrectPlayground = string;
		`,
		// With `@example` tag
		outdent`
			/**
			Some description.

			@example
			\`\`\`
			type Test = number;
			\`\`\`
			[Playground Link](${generatePlaygroundLink('type Test = number;')})
			*/
			export type WithExampleTag = unknown;
		`,
		// With `ts` language specifier
		outdent`
			/**
			@example
			\`\`\`ts
			type Test = number;
			\`\`\`
			[Playground Link](${generatePlaygroundLink('type Test = number;')})
			*/
			export type WithLanguageSpecifier = unknown;
		`,
		// With `typescript` language specifier
		outdent`
			/**
			Some description.

			\`\`\`typescript
			type Test = number;
			\`\`\`
			[Playground Link](${generatePlaygroundLink('type Test = number;')})
			*/
			export type WithLanguageSpecifier = unknown;
		`,
		// Mutiple codeblocks
		outdent`
			/**
			@example
			\`\`\`
			type Test = number;
			\`\`\`
			[Playground Link](${generatePlaygroundLink('type Test = number;')})

			Some text in between.

			@example
			\`\`\`
			type Test = string;
			\`\`\`
			[Playground Link](${generatePlaygroundLink('type Test = string;')})
			*/
			export type MultipleCodeblocks = unknown;
		`,
		outdent`
			export type TypeOptions = {
				/**
				\`\`\`
				type Test = number;
				\`\`\`
				[Playground Link](${generatePlaygroundLink('type Test = number;')})
				*/
				first: string;
	
				/**
				\`\`\`
				type Test = string;
				\`\`\`
				[Playground Link](${generatePlaygroundLink('type Test = string;')})
				\`\`\`
				type Test = string;
				\`\`\`
				[Playground Link](${generatePlaygroundLink('type Test = string;')})
				*/
				second: string;
			}
		`,
		// Multiple options
		outdent`
			export type TypeOptions = {
				/**
				\`\`\`
				type Test = number;
				\`\`\`
				[Playground Link](${generatePlaygroundLink('type Test = number;')})
				*/
				first: string;
	
				/**
				\`\`\`
				type Test = string;
				\`\`\`
				[Playground Link](${generatePlaygroundLink('type Test = string;')})
				*/
				second: string;
			}
		`,
	],
	invalid: [],
});
