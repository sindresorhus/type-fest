import {createRuleTester} from './test-utils.js';
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
