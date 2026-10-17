import {createTypeAwareRuleTester, dedenter} from './testing-utilities.js';
import {jsdocLinkImportsRule} from './jsdoc-link-imports.js';

const linkComment = '// For `@link`';

const {ruleTester, fixturePath} = createTypeAwareRuleTester({
	'package.json': '{\n\t"name": "jsdoc-link-imports-fixture"\n}\n',
	'index.d.ts': dedenter`
		export type {Target} from './source/target.d.ts';
		export type {Other, Another} from './source/other.d.ts';
		export type {TargetHelper as RenamedHelper} from './source/target.d.ts';
	`,
	'source/target.d.ts': 'export type Target = string;\nexport type TargetHelper = number;\nexport type TargetOption = boolean;\n\nexport {};\n',
	'source/other.d.ts': 'export type Other = number;\nexport type Another = boolean;\n\nexport {};\n',
	'source/test.d.ts': undefined,
	'source/plain.ts': undefined,
	'source/internal/test.d.ts': undefined,
	'test/test.d.ts': undefined,
});

const filename = fixturePath('source/test.d.ts');

const error = (messageId, name) => ({messageId, ...(name && {data: {name}})});

ruleTester.run('jsdoc-link-imports', jsdocLinkImportsRule, {
	valid: [
		// Links to a type declared in the file
		{
			code: dedenter`
				/**
				See {@link Foo} and {@link Foo \`label\`}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
		},
		// Links to a global type
		{
			code: dedenter`
				/**
				Like {@link Exclude} and {@link Array.isArray}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
		},
		// URL links
		{
			code: dedenter`
				/**
				See {@link https://example.com} and {@link https://example.com|the docs}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
		},
		// Import used only by a link, with the comment
		{
			code: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				/**
				See {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
		},
		// Import used by the code and by a link, without the comment
		{
			code: dedenter`
				import type {Target} from './target.d.ts';

				/**
				See {@link Target}.
				*/
				export type Foo = Target;

				export {};
			`,
			filename,
		},
		// Declaration where the code uses one specifier and a link uses the other, without the comment
		{
			code: dedenter`
				import type {Target, TargetHelper} from './target.d.ts';

				/**
				See {@link TargetHelper}.
				*/
				export type Foo = Target;

				export {};
			`,
			filename,
		},
		// `{@link Foo.member}`, `{@linkcode}`, `{@linkplain}`, and `{@link Foo | label}` use the import
		{
			code: dedenter`
				import type {Target, TargetHelper} from './target.d.ts'; ${linkComment}
				import type {Other} from './other.d.ts'; ${linkComment}

				/**
				See {@link Target.length}, {@linkcode TargetHelper}, and {@linkplain Other | other}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
		},
		// `@see Foo` without braces uses the import
		{
			code: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				/**
				@see Target
				*/
				export type Foo = string;

				export {};
			`,
			filename,
		},
		// Links in tags use the import
		{
			code: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				/**
				@param Value - Like {@link Target}.
				*/
				export type Foo<Value> = Value;

				export {};
			`,
			filename,
		},
		// `{@link Foo#member}` uses the import
		{
			code: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				/**
				See {@link Target#length}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
		},
		// `@see {@link Foo}` uses the import
		{
			code: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				/**
				@see {@link Target}
				*/
				export type Foo = string;

				export {};
			`,
			filename,
		},
		// Links in the JSDoc of a nested member use the import
		{
			code: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				export type Foo = {
					/**
					Like {@link Target}.
					*/
					bar: string;
				};

				export {};
			`,
			filename,
		},
		// A namespace import used only by a link
		{
			code: dedenter`
				import type * as Namespace from './target.d.ts'; ${linkComment}

				/**
				See {@link Namespace.Target}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
		},
		// A re-export uses the import
		{
			code: dedenter`
				import type {Target} from './target.d.ts';

				export type {Target};
			`,
			filename,
		},
		// Links to a type parameter
		{
			code: dedenter`
				/**
				@param Value - The value. Unlike {@link Value}, the result is a string.
				*/
				export type Foo<Value> = Value extends string ? Value : string;

				export {};
			`,
			filename,
		},
		// The rule only checks declaration files
		{
			code: dedenter`
				/**
				See {@link Target}.
				*/
				export type Foo = string;
			`,
			filename: fixturePath('source/plain.ts'),
		},
		// Side-effect imports are ignored
		{
			code: dedenter`
				import './other.d.ts';

				export type Foo = string;

				export {};
			`,
			filename,
		},
		// Files outside `source` are ignored
		{
			code: 'import type {Target} from \'../source/target.d.ts\';\n',
			filename: fixturePath('test/test.d.ts'),
		},
	],
	invalid: [
		// Missing import in a file without imports
		{
			code: dedenter`
				/**
				See {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('missingImport', 'Target')],
			output: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				/**
				See {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
		},
		// Missing import is added after the last import, after its trailing comment
		{
			code: dedenter`
				import type {Other} from './other.d.ts'; ${linkComment}

				/**
				See {@link Other} and {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('missingImport', 'Target')],
			output: dedenter`
				import type {Other} from './other.d.ts'; ${linkComment}
				import type {Target} from './target.d.ts'; ${linkComment}

				/**
				See {@link Other} and {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
		},
		// Missing import is added after a trailing block comment that spans lines
		{
			code: dedenter`
				import type {Other} from './other.d.ts'; /* Some
				note */

				/**
				See {@link Target}.
				*/
				export type Foo = Other;

				export {};
			`,
			filename,
			errors: [error('missingImport', 'Target')],
			output: dedenter`
				import type {Other} from './other.d.ts'; /* Some
				note */
				import type {Target} from './target.d.ts'; ${linkComment}

				/**
				See {@link Target}.
				*/
				export type Foo = Other;

				export {};
			`,
		},
		// Missing import is added to an existing import from the same file
		{
			code: dedenter`
				import type {TargetHelper} from './target.d.ts';

				/**
				See {@link Target}.
				*/
				export type Foo = TargetHelper;

				export {};
			`,
			filename,
			errors: [error('missingImport', 'Target')],
			output: dedenter`
				import type {TargetHelper, Target} from './target.d.ts';

				/**
				See {@link Target}.
				*/
				export type Foo = TargetHelper;

				export {};
			`,
		},
		// Missing import in an internal file
		{
			code: dedenter`
				/**
				See {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
			filename: fixturePath('source/internal/test.d.ts'),
			errors: [error('missingImport', 'Target')],
			output: dedenter`
				import type {Target} from '../target.d.ts'; ${linkComment}

				/**
				See {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
		},
		// A name that `index.d.ts` does not export has no fix, and each name is reported once
		{
			code: dedenter`
				/**
				See {@link TargetHelper}, {@link TargetHelper}, and {@link Missing}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('missingImport', 'TargetHelper'), error('missingImport', 'Missing')],
			output: null,
		},
		// Import used only by a link, without the comment
		{
			code: dedenter`
				import type {Target} from './target.d.ts';

				/**
				See {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('missingComment')],
			output: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				/**
				See {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
		},
		// Import used only by a link, with another comment on the line, has no fix, so the fix does not join the two comments
		{
			code: dedenter`
				import type {Target} from './target.d.ts'; // Some note

				/**
				See {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('missingComment')],
			output: null,
		},
		{
			code: dedenter`
				import type {Target} from './target.d.ts'; /* Some note */

				/**
				See {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('missingComment')],
			output: null,
		},
		// The comment must be on the line of the import
		{
			code: dedenter`
				import type {Target} from './target.d.ts';
				${linkComment}

				/**
				See {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('missingComment')],
			output: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}
				${linkComment}

				/**
				See {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
		},
		// A renamed export cannot be imported from its file by the exported name, so it has no fix
		{
			code: dedenter`
				/**
				See {@link RenamedHelper}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('missingImport', 'RenamedHelper')],
			output: null,
		},
		// Import used by the code, with the comment
		{
			code: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				export type Foo = Target;

				export {};
			`,
			filename,
			errors: [error('unneededComment')],
			output: dedenter`
				import type {Target} from './target.d.ts';

				export type Foo = Target;

				export {};
			`,
		},
		// Unused import, with and without the comment
		{
			code: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}
				import type {Other} from './other.d.ts';
				import type {TargetHelper} from './target.d.ts';

				export type Foo = TargetHelper;

				export {};
			`,
			filename,
			errors: [error('unusedImport', 'Target'), error('unusedImport', 'Other')],
			// The two removals touch, so one fix pass applies only the first
			output: dedenter`
				import type {Other} from './other.d.ts';
				import type {TargetHelper} from './target.d.ts';

				export type Foo = TargetHelper;

				export {};
			`,
		},
		// The only import is unused, so the blank line after it is removed too
		{
			code: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('unusedImport', 'Target')],
			output: dedenter`
				export type Foo = string;

				export {};
			`,
		},
		// One unused specifier in a declaration
		{
			code: dedenter`
				import type {Target, TargetHelper} from './target.d.ts';

				export type Foo = TargetHelper;

				export {};
			`,
			filename,
			errors: [error('unusedImport', 'Target')],
			output: dedenter`
				import type {TargetHelper} from './target.d.ts';

				export type Foo = TargetHelper;

				export {};
			`,
		},
		{
			code: dedenter`
				import type {Target, TargetHelper} from './target.d.ts';

				export type Foo = Target;

				export {};
			`,
			filename,
			errors: [error('unusedImport', 'TargetHelper')],
			output: dedenter`
				import type {Target} from './target.d.ts';

				export type Foo = Target;

				export {};
			`,
		},
		// Each missing import from a different file gets its own fix, and one fix pass applies only the first because both insert at the same place
		{
			code: dedenter`
				/**
				See {@link Target} and {@link Other}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('missingImport', 'Target'), error('missingImport', 'Other')],
			output: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				/**
				See {@link Target} and {@link Other}.
				*/
				export type Foo = string;

				export {};
			`,
		},
		// Missing import is added to an existing import that has the comment, keeping the comment
		{
			code: dedenter`
				import type {Other} from './other.d.ts'; ${linkComment}

				/**
				See {@link Other} and {@link Another}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('missingImport', 'Another')],
			output: dedenter`
				import type {Other, Another} from './other.d.ts'; ${linkComment}

				/**
				See {@link Other} and {@link Another}.
				*/
				export type Foo = string;

				export {};
			`,
		},
		// Missing import is not added to a namespace import from the same file
		{
			code: dedenter`
				import type * as Namespace from './target.d.ts';

				/**
				See {@link Target}.
				*/
				export type Foo = Namespace.Target;

				export {};
			`,
			filename,
			errors: [error('missingImport', 'Target')],
			output: dedenter`
				import type * as Namespace from './target.d.ts';
				import type {Target} from './target.d.ts'; ${linkComment}

				/**
				See {@link Target}.
				*/
				export type Foo = Namespace.Target;

				export {};
			`,
		},
		// `{@link Foo.member}` and `{@link Foo#member}` report and import `Foo`
		{
			code: dedenter`
				/**
				See {@link Target.length} and {@link Other#toFixed}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('missingImport', 'Target'), error('missingImport', 'Other')],
			output: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				/**
				See {@link Target.length} and {@link Other#toFixed}.
				*/
				export type Foo = string;

				export {};
			`,
		},
		// Missing import in the JSDoc of a nested member
		{
			code: dedenter`
				export type Foo = {
					/**
					Like {@link Target}.
					*/
					bar: string;
				};

				export {};
			`,
			filename,
			errors: [error('missingImport', 'Target')],
			output: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				export type Foo = {
					/**
					Like {@link Target}.
					*/
					bar: string;
				};

				export {};
			`,
		},
		// `@see Foo` without braces does not need to resolve
		{
			code: dedenter`
				/**
				@see Target
				See {@link Other}.
				*/
				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('missingImport', 'Other')],
			output: dedenter`
				import type {Other} from './other.d.ts'; ${linkComment}

				/**
				@see Target
				See {@link Other}.
				*/
				export type Foo = string;

				export {};
			`,
		},
		// Import used by the code and by a link in the same declaration as a link-only specifier, with the comment
		{
			code: dedenter`
				import type {Target, TargetHelper} from './target.d.ts'; ${linkComment}

				/**
				See {@link TargetHelper}.
				*/
				export type Foo = Target;

				export {};
			`,
			filename,
			errors: [error('unneededComment')],
			output: dedenter`
				import type {Target, TargetHelper} from './target.d.ts';

				/**
				See {@link TargetHelper}.
				*/
				export type Foo = Target;

				export {};
			`,
		},
		// Unused specifier in the middle of a declaration
		{
			code: dedenter`
				import type {Target, TargetHelper, TargetOption} from './target.d.ts';

				export type Foo = [Target, TargetOption];

				export {};
			`,
			filename,
			errors: [error('unusedImport', 'TargetHelper')],
			output: dedenter`
				import type {Target, TargetOption} from './target.d.ts';

				export type Foo = [Target, TargetOption];

				export {};
			`,
		},
		// All specifiers of a declaration are unused, so it is reported once
		{
			code: dedenter`
				import type {Other, Another} from './other.d.ts';
				import type {Target} from './target.d.ts';

				export type Foo = Target;

				export {};
			`,
			filename,
			errors: [error('unusedImport', 'Other`, `Another')],
			output: dedenter`
				import type {Target} from './target.d.ts';

				export type Foo = Target;

				export {};
			`,
		},
		// Unused namespace import
		{
			code: dedenter`
				import type * as Namespace from './target.d.ts';

				export type Foo = string;

				export {};
			`,
			filename,
			errors: [error('unusedImport', 'Namespace')],
			output: dedenter`
				export type Foo = string;

				export {};
			`,
		},
	],
});
