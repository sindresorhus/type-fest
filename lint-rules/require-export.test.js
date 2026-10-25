import {createRuleTester} from './testing-utilities.js';
import {requireExportRule} from './require-export.js';

const ruleTester = createRuleTester();

const missingEmptyExport = (code, filename, output) => ({
	code,
	filename,
	errors: [{messageId: 'noEmptyExport'}],
	output,
});

ruleTester.run('require-export', requireExportRule, {
	valid: [
		// The file-level export may precede namespace declarations.
		{
			code: 'export {};\ndeclare namespace Outer.Inner {export {};}',
			filename: '/source/deep.d.ts',
		},
		// A nested export is harmless when the file also has its own empty export.
		{
			code: 'declare namespace Local {export {};}\nexport {};',
			filename: '/source/nested.d.ts',
		},
		// Has export {}
		{
			code: 'export {};',
			filename: '/source/foo.d.ts',
		},
		// Has export {} with other exports
		{
			code: 'export type Foo = string;\nexport {};',
			filename: '/source/bar.d.ts',
		},
		// Non-.d.ts files don't need export {}
		{
			code: 'const x = 1;',
			filename: '/source/foo.ts',
		},
		{
			code: 'export const y = 2;',
			filename: '/source/bar.js',
		},
		// Files outside source directory are ignored
		{
			code: 'type Test = string;',
			filename: '/test/foo.d.ts',
		},
		{
			code: 'interface ITest {}',
			filename: '/lib/bar.d.ts',
		},
	],
	invalid: [
		// Multiple nested module boundaries still cannot replace the file-level one.
		missingEmptyExport(
			'declare namespace Outer {export {}; namespace Inner {export {};}}',
			'/source/deep.d.ts',
			'declare namespace Outer {export {}; namespace Inner {export {};}}\nexport {};\n',
		),
		// A namespace export does not make its containing file a module.
		missingEmptyExport(
			'declare namespace Local {export {};}\ntype GlobalName = string;',
			'/source/nested.d.ts',
			'declare namespace Local {export {};}\ntype GlobalName = string;\nexport {};\n',
		),
		// Missing export {} in empty file
		missingEmptyExport('', '/source/foo.d.ts', '\nexport {};\n'),
		// Missing export {} with type declarations
		missingEmptyExport(
			'export type Foo = string;',
			'/source/bar.d.ts',
			'export type Foo = string;\nexport {};\n',
		),
		// Missing export {} with interface
		missingEmptyExport(
			'export interface IFoo {\n\tx: string;\n}',
			'/source/baz.d.ts',
			'export interface IFoo {\n\tx: string;\n}\nexport {};\n',
		),
		// Missing export {} with multiple exports
		missingEmptyExport(
			'export type A = string;\nexport type B = number;',
			'/source/multi.d.ts',
			'export type A = string;\nexport type B = number;\nexport {};\n',
		),
	],
});
