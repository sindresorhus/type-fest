import assert from 'node:assert/strict';
import test from 'node:test';
import {Linter} from 'eslint';
import tsParser from '@typescript-eslint/parser';
import ts from 'typescript';
import {createFixtures, createTypeAwareRuleTester, dedenter} from './testing-utilities.js';
import {jsdocLinkImportsRule} from './jsdoc-link-imports.js';

const linkComment = '// For `@link`';

const {ruleTester, fixtureRoot, fixturePath} = createTypeAwareRuleTester({
	'package.json': '{\n\t"name": "jsdoc-link-imports-fixture"\n}\n',
	'index.d.ts': dedenter`
		export type {Target} from './source/target.d.ts';
		export type {Other, Another} from './source/other.d.ts';
		export type {TargetHelper as RenamedHelper} from './source/target.d.ts';
	`,
	'node_modules/@types/reference-target/index.d.ts': 'interface ReferenceTarget {readonly tag: string;}\n',
	'node_modules/mixed-import-target/index.d.ts': dedenter`
		export type Target = string;
		export type TargetHelper = number;
		export type TargetOption = boolean;
		export type {Target as default};

		export {};
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
		// A same-line declaration uses the import normally.
		{
			code: 'import type {Target} from \'./target.d.ts\'; export type Foo = Target;\nexport {};\n',
			filename,
		},
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
		// A generic name in a link does not use a shadowed import.
		{
			code: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}

				/** See {@link Target}. */
				export type Foo<Target> = Target;
				export {};
			`,
			filename,
			errors: [error('unusedImport', 'Target')],
			output: dedenter`
				/** See {@link Target}. */
				export type Foo<Target> = Target;
				export {};
			`,
		},
		// A resolved root cannot make a missing member into an editor link.
		{
			code: dedenter`
				import type {Target} from './target.d.ts';
				/** See {@link Target.missing}. */
				export type Foo = Target;
				export {};
			`,
			filename,
			errors: [{message: '`{@link Target.missing}` does not resolve.'}],
			output: null,
		},
		// Removing either part of a default-plus-named import must keep valid import syntax.
		{
			code: 'import DefaultTarget, {Target} from \'mixed-import-target\';\nexport type Foo = Target;\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'DefaultTarget')],
			output: 'import {Target} from \'mixed-import-target\';\nexport type Foo = Target;\nexport {};\n',
		},
		{
			code: 'import DefaultTarget, {Target} from \'mixed-import-target\';\nexport type Foo = DefaultTarget;\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'Target')],
			output: 'import DefaultTarget from \'mixed-import-target\';\nexport type Foo = DefaultTarget;\nexport {};\n',
		},
		// Aliases, trailing commas, and unrelated trailing comments belong to the retained import.
		{
			code: 'import DefaultTarget, {Target as Kept, TargetHelper,} from \'mixed-import-target\'; // Keep this explanation.\nexport type Foo = [Kept, TargetHelper];\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'DefaultTarget')],
			output: 'import {Target as Kept, TargetHelper,} from \'mixed-import-target\'; // Keep this explanation.\nexport type Foo = [Kept, TargetHelper];\nexport {};\n',
		},
		{
			code: 'import DefaultTarget, {TargetHelper as Unused,} from \'mixed-import-target\'; // Keep this explanation.\r\nexport type Foo = DefaultTarget;\r\nexport {};\r\n',
			filename,
			errors: [error('unusedImport', 'Unused')],
			output: 'import DefaultTarget from \'mixed-import-target\'; // Keep this explanation.\r\nexport type Foo = DefaultTarget;\r\nexport {};\r\n',
		},
		// Removing a middle named entry keeps the default binding and its brace group.
		{
			code: 'import DefaultTarget, {Target, TargetHelper as Unused, TargetOption} from \'mixed-import-target\';\nexport type Foo = [DefaultTarget, Target, TargetOption];\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'Unused')],
			output: 'import DefaultTarget, {Target, TargetOption} from \'mixed-import-target\';\nexport type Foo = [DefaultTarget, Target, TargetOption];\nexport {};\n',
		},
		// Default and namespace bindings remain separate groups too.
		{
			code: 'import DefaultTarget, * as Namespace from \'mixed-import-target\';\nexport type Foo = Namespace.Target;\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'DefaultTarget')],
			output: 'import * as Namespace from \'mixed-import-target\';\nexport type Foo = Namespace.Target;\nexport {};\n',
		},
		{
			code: 'import DefaultTarget, * as Namespace from \'mixed-import-target\';\nexport type Foo = DefaultTarget;\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'Namespace')],
			output: 'import DefaultTarget from \'mixed-import-target\';\nexport type Foo = DefaultTarget;\nexport {};\n',
		},
		// A new import must not disable the file's triple-slash reference directive.
		{
			code: dedenter`
				/// <reference lib="esnext.disposable" />
				/** See {@link Target}. */
				export type Resource = DisposableStack;
				export {};
			`,
			filename,
			errors: [error('missingImport', 'Target')],
			output: null,
		},
		// File and package references also need their leading position.
		{
			code: '/// <reference path="./target.d.ts" />\n/** See {@link Target}. */\nexport type Foo = string;\n',
			filename,
			errors: [error('missingImport', 'Target')],
			output: null,
		},
		{
			code: '/// <reference types="reference-target" />\n/** See {@link Target}. */\nexport type Foo = ReferenceTarget;\n',
			filename,
			errors: [error('missingImport', 'Target')],
			output: null,
		},
		// An existing import remains a safe insertion anchor after the directive.
		{
			code: dedenter`
				/// <reference lib="esnext.disposable" />
				import type {Other} from './other.d.ts';
				/** See {@link Target}. */
				export type Foo = Other;
			`,
			filename,
			errors: [error('missingImport', 'Target')],
			output: dedenter`
				/// <reference lib="esnext.disposable" />
				import type {Target} from './target.d.ts'; ${linkComment}
				import type {Other} from './other.d.ts';
				/** See {@link Target}. */
				export type Foo = Other;
			`,
		},
		// Merging a specifier into an existing import keeps references active too.
		{
			code: '/// <reference path="./target.d.ts" />\nimport type {TargetHelper} from \'./target.d.ts\';\n/** See {@link Target}. */\nexport type Foo = TargetHelper;\n',
			filename,
			errors: [error('missingImport', 'Target')],
			output: '/// <reference path="./target.d.ts" />\nimport type {TargetHelper, Target} from \'./target.d.ts\';\n/** See {@link Target}. */\nexport type Foo = TargetHelper;\n',
		},
		// License comments and CRLF do not change which references TypeScript recognizes.
		{
			code: '/* License */\r\n/// <reference lib="esnext.disposable" />\r\n/** See {@link Target}. */\r\nexport type Foo = DisposableStack;\r\n',
			filename,
			errors: [error('missingImport', 'Target')],
			output: null,
		},
		// Other leading pragmas also need their position, and any leading line comment skips the standalone fix.
		{
			code: '/// <reference no-default-lib="true" />\n/** See {@link Target}. */\nexport type Foo = string;\n',
			filename,
			errors: [error('missingImport', 'Target')],
			output: null,
		},
		{
			code: '/// <amd-module name="foo" />\n/** See {@link Target}. */\nexport type Foo = string;\n',
			filename,
			errors: [error('missingImport', 'Target')],
			output: null,
		},
		{
			code: '// @ts-nocheck\n/** See {@link Target}. */\nexport type Foo = string;\n',
			filename,
			errors: [error('missingImport', 'Target')],
			output: null,
		},
		{
			code: '// Note\n/** See {@link Target}. */\nexport type Foo = string;\n',
			filename,
			errors: [error('missingImport', 'Target')],
			output: null,
		},
		// An ordinary leading comment still permits the existing standalone import fix.
		{
			code: '/* License */\n/** See {@link Target}. */\nexport type Foo = string;\n',
			filename,
			errors: [error('missingImport', 'Target')],
			output: `import type {Target} from './target.d.ts'; ${linkComment}\n\n/* License */\n/** See {@link Target}. */\nexport type Foo = string;\n`,
		},
		// The same boundary protects whole declarations, middle specifiers, and line comments with CRLF.
		{
			code: 'import type {/* Keep this explanation. */ Target} from \'./target.d.ts\';\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'Target')],
			output: null,
		},
		{
			code: 'import type {Target, /* Keep this explanation. */ TargetHelper, TargetOption} from \'./target.d.ts\';\nexport type Foo = [Target, TargetOption];\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'TargetHelper')],
			output: null,
		},
		{
			code: 'import type {Target, // Keep this explanation.\r\nTargetHelper} from \'./target.d.ts\';\r\nexport type Foo = Target;\r\nexport {};\r\n',
			filename,
			errors: [error('unusedImport', 'TargetHelper')],
			output: null,
		},
		// Internal comments may document retained specifiers, so removing the import needs manual review.
		{
			code: 'import type {Target, /* Keep this explanation. */ TargetHelper} from \'./target.d.ts\';\nexport type Foo = TargetHelper;\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'Target')],
			output: null,
		},
		// A new standalone import also preserves same-line side-effect imports and their following code.
		{
			code: 'import \'./setup.d.ts\'; export type Foo = string;\n/** See {@link Target}. */\nexport type Bar = number;\n',
			filename,
			errors: [error('missingImport', 'Target')],
			output: `import type {Target} from './target.d.ts'; ${linkComment}\nimport './setup.d.ts'; export type Foo = string;\n/** See {@link Target}. */\nexport type Bar = number;\n`,
		},
		// Adding a standalone link import must not comment out existing same-line code.
		{
			code: dedenter`
				import type {Other} from './other.d.ts'; export type Foo = Other;
				/** See {@link Target}. */
				export type Bar = string;
			`,
			filename,
			errors: [error('missingImport', 'Target')],
			output: dedenter`
				import type {Target} from './target.d.ts'; ${linkComment}
				import type {Other} from './other.d.ts'; export type Foo = Other;
				/** See {@link Target}. */
				export type Bar = string;
			`,
		},
		// A line-comment annotation must not swallow another declaration on the import line.
		{
			code: 'import type {Target} from \'./target.d.ts\'; export type Foo = string;\n/** See {@link Target}. */\nexport type Bar = number;\n',
			filename,
			errors: [error('missingComment')],
			output: null,
		},
		// Removing an unused import must not delete the following declaration on the same line.
		{
			code: 'import type {Target} from \'./target.d.ts\'; export type Foo = string;\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'Target')],
			output: 'export type Foo = string;\nexport {};\n',
		},
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
		// Missing import is added before existing imports, preserving their trailing comments.
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
				import type {Target} from './target.d.ts'; ${linkComment}
				import type {Other} from './other.d.ts'; ${linkComment}

				/**
				See {@link Other} and {@link Target}.
				*/
				export type Foo = string;

				export {};
			`,
		},
		// Missing import is added before the existing import and its multiline trailing block comment.
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
				import type {Target} from './target.d.ts'; ${linkComment}
				import type {Other} from './other.d.ts'; /* Some
				note */

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
		// A trailing import or empty export must not be swallowed by a line-comment annotation either.
		{
			code: 'import type {Target} from \'./target.d.ts\'; import type {Other} from \'./other.d.ts\';\n/** See {@link Target}. */\nexport type Foo = Other;\n',
			filename,
			errors: [error('missingComment')],
			output: null,
		},
		{
			code: 'import type {Target} from \'./target.d.ts\'; export {};\n/** See {@link Target}. */\nexport type Foo = string;\n',
			filename,
			errors: [error('missingComment')],
			output: null,
		},
		// An import at EOF can still receive its annotation without a final newline.
		{
			code: '/** See {@link Target}. */\nimport type {Target} from \'./target.d.ts\';',
			filename,
			errors: [error('missingComment')],
			output: '/** See {@link Target}. */\nimport type {Target} from \'./target.d.ts\'; // For `@link`',
		},
		// CRLF does not change the same-line safety boundary or safe annotation output.
		{
			code: 'import type {Target} from \'./target.d.ts\'; export {};\r\n/** See {@link Target}. */\r\nexport type Foo = string;\r\n',
			filename,
			errors: [error('missingComment')],
			output: null,
		},
		{
			code: 'import type {Target} from \'./target.d.ts\';\r\n/** See {@link Target}. */\r\nexport type Foo = string;\r\n',
			filename,
			errors: [error('missingComment')],
			output: `import type {Target} from './target.d.ts'; ${linkComment}\r\n/** See {@link Target}. */\r\nexport type Foo = string;\r\n`,
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
		// Removing an import preserves another import and declaration on the same line.
		{
			code: 'import type {Target} from \'./target.d.ts\'; import type {Other} from \'./other.d.ts\'; export type Foo = Other;\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'Target')],
			output: 'import type {Other} from \'./other.d.ts\'; export type Foo = Other;\nexport {};\n',
		},
		{
			code: 'import type {Other} from \'./other.d.ts\'; import type {Target} from \'./target.d.ts\'; export type Foo = Other;\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'Target')],
			output: 'import type {Other} from \'./other.d.ts\'; export type Foo = Other;\nexport {};\n',
		},
		// Unrelated trailing comments belong to the remaining source, including multiline comments.
		{
			code: 'import type {Target} from \'./target.d.ts\'; // Keep this explanation.\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'Target')],
			output: '// Keep this explanation.\nexport {};\n',
		},
		{
			code: 'import type {Target} from \'./target.d.ts\'; /* Keep this explanation. */ export type Foo = string;\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'Target')],
			output: '/* Keep this explanation. */ export type Foo = string;\nexport {};\n',
		},
		{
			code: 'import type {Target} from \'./target.d.ts\'; /* Keep this\nexplanation. */\nexport {};\n',
			filename,
			errors: [error('unusedImport', 'Target')],
			output: '/* Keep this\nexplanation. */\nexport {};\n',
		},
		// Only the exact owned comment is removed, not an expanded or standalone comment.
		{
			code: `import type {Target} from './target.d.ts'; ${linkComment} and keep this explanation.\nexport {};\n`,
			filename,
			errors: [error('unusedImport', 'Target')],
			output: `${linkComment} and keep this explanation.\nexport {};\n`,
		},
		{
			code: `import type {Target} from './target.d.ts';\n${linkComment}\nexport {};\n`,
			filename,
			errors: [error('unusedImport', 'Target')],
			output: `${linkComment}\nexport {};\n`,
		},
		// End-of-file removal needs no final newline and preserves unrelated comments.
		{
			code: 'import type {Target} from \'./target.d.ts\';',
			filename,
			errors: [error('unusedImport', 'Target')],
			output: '',
		},
		{
			code: `import type {Target} from './target.d.ts'; ${linkComment}`,
			filename,
			errors: [error('unusedImport', 'Target')],
			output: '',
		},
		{
			code: 'import type {Target} from \'./target.d.ts\'; // Keep this explanation.',
			filename,
			errors: [error('unusedImport', 'Target')],
			output: '// Keep this explanation.',
		},
		// CRLF files preserve following same-line code and retain existing blank-line cleanup.
		{
			code: 'import type {Target} from \'./target.d.ts\'; export type Foo = string;\r\nexport {};\r\n',
			filename,
			errors: [error('unusedImport', 'Target')],
			output: 'export type Foo = string;\r\nexport {};\r\n',
		},
		{
			code: `import type {Target} from './target.d.ts'; ${linkComment}\r\n\r\nexport {};\r\n`,
			filename,
			errors: [error('unusedImport', 'Target')],
			output: 'export {};\r\n',
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
				import type {Target} from './target.d.ts'; ${linkComment}
				import type * as Namespace from './target.d.ts';

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
			// Only the unresolved name is highlighted, not the member after it.
			errors: [{...error('missingImport', 'Target'), line: 2, column: 12, endColumn: 18}, {...error('missingImport', 'Other'), line: 2, column: 38, endColumn: 43}],
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

test('removes mixed import bindings across successive fix passes', () => {
	const linter = new Linter({cwd: fixtureRoot});
	const configuration = [{
		files: ['**/*.d.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {projectService: true, tsconfigRootDir: fixtureRoot},
		},
		plugins: {'type-fest': {rules: {'jsdoc-link-imports': jsdocLinkImportsRule}}},
		rules: {'type-fest/jsdoc-link-imports': 'error'},
	}];
	const cases = [
		{
			code: dedenter`
				import DefaultTarget, {TargetHelper as FirstUnused, TargetOption as SecondUnused} from 'mixed-import-target';
				export type Foo = DefaultTarget;
				export {};
			`,
			output: dedenter`
				import DefaultTarget from 'mixed-import-target';
				export type Foo = DefaultTarget;
				export {};
			`,
		},
		{
			code: dedenter`
				import UnusedDefault, {TargetHelper as UnusedNamed, Target as Kept} from 'mixed-import-target';
				export type Foo = Kept;
				export {};
			`,
			output: dedenter`
				import {Target as Kept} from 'mixed-import-target';
				export type Foo = Kept;
				export {};
			`,
		},
	];
	const results = cases.map(({code}) => linter.verifyAndFix(code, configuration, {filename}));
	assert.deepEqual(results.map(result => result.fixed), [true, true]);
	assert.deepEqual(results.map(result => result.messages), [[], []]);
	assert.deepEqual(results.map(result => result.output), cases.map(({output}) => output));
});

test('checks complete link targets after importing their root', () => {
	const linter = new Linter({cwd: fixtureRoot});
	const configuration = [{
		files: ['**/*.d.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {projectService: true, tsconfigRootDir: fixtureRoot},
		},
		plugins: {'type-fest': {rules: {'jsdoc-link-imports': jsdocLinkImportsRule}}},
		rules: {'type-fest/jsdoc-link-imports': 'error'},
	}];
	const validNamespace = dedenter`
		import type * as Namespace from './target.d.ts'; ${linkComment}
		/** See {@link Namespace.Target.length}, {@linkcode Namespace.Target#length}, and {@linkplain Namespace.TargetHelper.toFixed}. */
		export type Foo = string;
	`;
	const invalidNamespace = dedenter`
		import type * as Namespace from './target.d.ts'; ${linkComment}
		/** See {@link Namespace.Target.missing}, {@linkcode Namespace.Target#missing}, and {@linkplain Namespace.Missing}. */
		export type Foo = string;
	`;
	const validMissingRoot = '/** See {@link Target.length}. */\nexport type Foo = string;\n';
	const invalidMissingRoot = '/** See {@link Target.missing}. */\nexport type Foo = string;\n';
	const importedTarget = `import type {Target} from './target.d.ts'; ${linkComment}\n\n`;
	const cases = [
		{code: validNamespace, output: validNamespace, fixed: false, unresolved: []},
		{
			code: invalidNamespace,
			output: invalidNamespace,
			fixed: false,
			unresolved: [['Namespace.Target.missing', 2, 16, 40], ['Namespace.Target#missing', 2, 54, 78], ['Namespace.Missing', 2, 97, 114]],
		},
		{code: validMissingRoot, output: importedTarget + validMissingRoot, fixed: true, unresolved: []},
		{code: invalidMissingRoot, output: importedTarget + invalidMissingRoot, fixed: true, unresolved: [['Target.missing', 3, 16, 30]]},
	];
	const results = cases.map(({code}) => linter.verifyAndFix(code, configuration, {filename}));
	const expectedMessages = cases.map(({unresolved}) => unresolved.map(([name, line, column, endColumn]) => ({
		messageId: 'unresolvedLink',
		message: `\`{@link ${name}}\` does not resolve.`,
		line,
		column,
		endLine: line,
		endColumn,
		fix: undefined,
	})));
	const messages = results.map(result => result.messages.map(({messageId, message, line, column, endLine, endColumn, fix}) => ({messageId, message, line, column, endLine, endColumn, fix})));
	assert.deepEqual(messages, expectedMessages);
	assert.deepEqual(results.map(result => result.fixed), cases.map(({fixed}) => fixed));
	assert.deepEqual(results.map(result => result.output), cases.map(({output}) => output));
	const repeated = results.map(result => linter.verifyAndFix(result.output, configuration, {filename}));
	assert.deepEqual(repeated.map(result => result.fixed), [false, false, false, false]);
	assert.deepEqual(repeated.map(result => result.output), cases.map(({output}) => output));
	assert.deepEqual(repeated.map(result => result.messages), results.map(result => result.messages));
});

test('tracks local import aliases through scoped JSDoc references', () => {
	const linter = new Linter({cwd: fixtureRoot});
	const configuration = [{
		files: ['**/*.d.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {projectService: true, tsconfigRootDir: fixtureRoot},
		},
		plugins: {'type-fest': {rules: {'jsdoc-link-imports': jsdocLinkImportsRule}}},
		rules: {'type-fest/jsdoc-link-imports': 'error'},
	}];
	const body = dedenter`
		/** @see Kept */
		export type Box<Shadowed> = {
			/** See {@link Shadowed}. */
			value: Shadowed;
		};
	`;
	const shadowed = `import type {Target as Kept, Target as Shadowed, TargetHelper} from './target.d.ts'; ${linkComment}\n\n${body}`;
	const kept = `import type {Target as Kept} from './target.d.ts'; ${linkComment}\n\n${body}`;
	const codeUsed = dedenter`
		import type {Target} from './target.d.ts';
		/** See {@link Target}. */
		export type Box<Target> = Target;
		export type Kept = Target;
	`;
	const cases = [{code: shadowed, output: kept}, {code: codeUsed, output: codeUsed}];
	const initialMessages = cases.map(({code}) => linter.verify(code, configuration, {filename}).map(({message}) => message));
	assert.deepEqual(initialMessages, [[
		'Neither the code nor the JSDoc uses `Shadowed`.',
		'Neither the code nor the JSDoc uses `TargetHelper`.',
	], []]);
	const results = cases.map(({code}) => linter.verifyAndFix(code, configuration, {filename}));
	assert.deepEqual(results.map(result => result.fixed), [true, false]);
	assert.deepEqual(results.map(result => result.output), cases.map(({output}) => output));
	assert.deepEqual(results.map(result => result.messages), [[], []]);
	const repeated = results.map(result => linter.verifyAndFix(result.output, configuration, {filename}));
	assert.deepEqual(repeated.map(result => result.fixed), [false, false]);
	assert.deepEqual(repeated.map(result => result.output), cases.map(({output}) => output));
	assert.deepEqual(repeated.map(result => result.messages), [[], []]);
});

test('resolves each JSDoc root once while checking complete member targets', t => {
	const code = dedenter`
		import type {Target} from './target.d.ts'; ${linkComment}
		/** See {@link Target}, {@link Target.length}, {@linkcode Target}, and {@linkplain Target.length}. */
		export type Example = string;
		export {};
	`;
	const fixture = createFixtures({
		'package.json': '{}',
		'source/target.d.ts': 'export type Target = string;\n',
		'source/references.d.ts': code,
	});
	const sourceFilename = fixture.fixturePath('source/references.d.ts');
	const program = ts.createProgram([sourceFilename], {strict: true, exactOptionalPropertyTypes: true, types: [], skipLibCheck: true, target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.NodeNext});
	const checker = program.getTypeChecker();
	const lookups = t.mock.method(checker, 'getSymbolAtLocation');
	const configuration = [{
		files: ['**/*.d.ts'],
		languageOptions: {parser: tsParser, parserOptions: {programs: [program]}},
		plugins: {'type-fest': {rules: {'jsdoc-link-imports': jsdocLinkImportsRule}}},
		rules: {'type-fest/jsdoc-link-imports': 'error'},
	}];
	t.assert.deepStrictEqual(new Linter({cwd: fixture.fixtureRoot}).verify(code, configuration, {filename: sourceFilename}), []);
	const rootLookups = lookups.mock.calls.filter(call => {
		const node = call.arguments[0];
		return ts.isIdentifier(node) && node.text === 'Target' && node.pos > code.indexOf('/**');
	});
	t.assert.strictEqual(rootLookups.length, 4);
});
