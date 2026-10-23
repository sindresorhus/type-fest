import {createTypeAwareRuleTester} from './testing-utilities.js';
import {requireExportedTypesRule} from './require-exported-types.js';

const packageContent = JSON.stringify({
	name: 'require-exported-types-fixture',
}, null, '\t');

const indexContent = [
	'export {type ExportedType} from \'./source/exported-type\';',
	'export type {RenamedType as PublicType} from \'./source/renamed-type.d.ts\';',
	'export type {DuplicateType} from \'./source/duplicate-other.d.ts\';',
	'export type {ChainIntermediate as ChainPublic} from \'./source/chain-barrel.d.ts\';',
	'export * from \'./source/star-barrel.d.ts\';',
	'export type {PublicInterface as ApiInterface} from \'./source/interface-type.d.ts\';',
	'export type {DuplicatedInterface} from \'./source/interface-other.d.ts\';',
	'export * from \'./source/namespace-barrel.d.ts\';',
	'',
].join('\n');
const exportedTypeContent = 'export type ExportedType = {\n\tvalue: string;\n};\n';
const internalTypeContent = 'export type InternalType = {\n\tvalue: boolean;\n};\n';
const nestedInternalTypeContent = 'export interface NestedInternalType {\n\tvalue: string;\n}\n';
const privateTypeContent = 'export type _HiddenType = string;\n';
const missingTypeContent = 'export type MissingType = {\n\tvalue: number;\n};\n';
const unexportedMultipleContent = 'export type FirstUnexportedType = string;\nexport interface SecondUnexportedInterface {\n\tvalue: boolean;\n}\n';
const implementationContent = 'export const value = 1;\n';
const testDeclarationContent = 'export type Test = number;\n';
const libDeclarationContent = 'export interface LibTest {\n\tvalue: string;\n}\n';

const {ruleTester, fixturePath} = createTypeAwareRuleTester({
	'package.json': `${packageContent}\n`,
	'index.d.ts': indexContent,
	'source/exported-type.d.ts': undefined,
	'source/renamed-type.d.ts': undefined,
	'source/duplicate-other.d.ts': 'export type DuplicateType = string;\n',
	'source/duplicate-missing.d.ts': undefined,
	'source/chain-type.d.ts': undefined,
	'source/chain-barrel.d.ts': 'export type {ChainType as ChainIntermediate} from \'./chain-type.d.ts\';\n',
	'source/star-type.d.ts': undefined,
	'source/star-barrel.d.ts': 'export * from \'./star-type.d.ts\';\n',
	'source/interface-type.d.ts': undefined,
	'source/interface-other.d.ts': 'export interface DuplicatedInterface {value: string}\n',
	'source/interface-missing.d.ts': undefined,
	'source/namespaced-type.d.ts': undefined,
	'source/namespace-barrel.d.ts': 'export * as Scoped from \'./namespaced-type.d.ts\';\n',
	'public.d.ts': 'export type {AlternateType as ExposedType} from \'./source/alternate-type.d.ts\';\n',
	'source/alternate-type.d.ts': undefined,
	'source/internal/internal-type.d.ts': undefined,
	'source/internal/nested/deep.d.ts': undefined,
	'source/private-type.d.ts': undefined,
	'source/missing-type.d.ts': undefined,
	'source/unexported-multiple.d.ts': undefined,
	'source/implementation.ts': undefined,
	'test/test.d.ts': undefined,
	'lib/test.d.ts': undefined,
});

// Type-aware rule tests rely on the generated fixture project above.
const missingExportError = typeName => ({
	messageId: 'missingExport',
	data: {typeName},
});

ruleTester.run('require-exported-types', requireExportedTypesRule, {
	valid: [
		// Re-exporting a declaration under a public alias still exposes that declaration.
		{
			code: 'export type RenamedType = number;\n',
			filename: fixturePath('source/renamed-type.d.ts'),
		},
		// Symbol identity survives alias chains and star-export barrels.
		{
			code: 'export type ChainType = {value: string};\n',
			filename: fixturePath('source/chain-type.d.ts'),
		},
		{
			code: 'export type StarType = {value: number};\n',
			filename: fixturePath('source/star-type.d.ts'),
		},
		// Interfaces and a configured entry point use the same alias resolution.
		{
			code: 'export interface PublicInterface {value: string}\n',
			filename: fixturePath('source/interface-type.d.ts'),
		},
		{
			code: 'export type AlternateType = string;\n',
			filename: fixturePath('source/alternate-type.d.ts'),
			options: [{indexFile: 'public.d.ts'}],
		},
		{
			code: exportedTypeContent,
			filename: fixturePath('source/exported-type.d.ts'),
		},
		{
			code: privateTypeContent,
			filename: fixturePath('source/private-type.d.ts'),
		},
		{
			code: internalTypeContent,
			filename: fixturePath('source/internal/internal-type.d.ts'),
		},
		{
			code: nestedInternalTypeContent,
			filename: fixturePath('source/internal/nested/deep.d.ts'),
		},
		{
			code: implementationContent,
			filename: fixturePath('source/implementation.ts'),
		},
		{
			code: testDeclarationContent,
			filename: fixturePath('test/test.d.ts'),
		},
		{
			code: libDeclarationContent,
			filename: fixturePath('lib/test.d.ts'),
		},
	],
	invalid: [
		// A different declaration with the same name does not export this file's type.
		{
			code: 'export type DuplicateType = boolean;\n',
			filename: fixturePath('source/duplicate-missing.d.ts'),
			errors: [missingExportError('DuplicateType')],
		},
		{
			code: 'export interface DuplicatedInterface {value: boolean}\n',
			filename: fixturePath('source/interface-missing.d.ts'),
			errors: [missingExportError('DuplicatedInterface')],
		},
		// A namespace export does not expose its members as top-level index exports.
		{
			code: 'export type NamespacedType = string;\n',
			filename: fixturePath('source/namespaced-type.d.ts'),
			errors: [missingExportError('NamespacedType')],
		},
		{
			code: missingTypeContent,
			filename: fixturePath('source/missing-type.d.ts'),
			errors: [missingExportError('MissingType')],
		},
		{
			code: unexportedMultipleContent,
			filename: fixturePath('source/unexported-multiple.d.ts'),
			errors: [
				missingExportError('FirstUnexportedType'),
				missingExportError('SecondUnexportedInterface'),
			],
		},
	],
});
