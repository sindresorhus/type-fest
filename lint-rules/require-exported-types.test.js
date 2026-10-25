import {test as runTest} from 'node:test';
import {Linter} from 'eslint';
import tsParser from '@typescript-eslint/parser';
import ts from 'typescript';
import {createFixtures, createTypeAwareRuleTester} from './testing-utilities.js';
import {requireExportedTypesRule} from './require-exported-types.js';

const packageContent = JSON.stringify({
	name: 'require-exported-types-fixture',
}, null, '\t');

const indexContent = [
	'export type {default as DefaultInterface} from \'./source/default-interface.d.ts\';',
	'export {type ExportedType} from \'./source/exported-type\';',
	'export type {RenamedType as PublicType} from \'./source/renamed-type.d.ts\';',
	'export type {DuplicateType} from \'./source/duplicate-other.d.ts\';',
	'export type {ChainIntermediate as ChainPublic} from \'./source/chain-barrel.d.ts\';',
	'export * from \'./source/star-barrel.d.ts\';',
	'export type {PublicInterface as ApiInterface} from \'./source/interface-type.d.ts\';',
	'export type {DuplicatedInterface} from \'./source/interface-other.d.ts\';',
	'export * from \'./source/namespace-barrel.d.ts\';',
	'export type {PublicListed} from \'./source/local-listed.d.ts\';',
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
	'source/default-interface.d.ts': undefined,
	'source/default-missing.d.ts': undefined,
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
	'source/local-listed.d.ts': undefined,
	'source/local-missing.d.ts': undefined,
	'source/local-interface.d.ts': undefined,
	'source/foreign-only.d.ts': 'export type ForeignOnly = string;\n',
	'source/local-barrel.d.ts': undefined,
	'source/local-private.d.ts': undefined,
	'source/local-namespace.d.ts': undefined,
	'source/local-duplicate.d.ts': undefined,
	'source/local-mixed.d.ts': undefined,
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
		{
			code: 'interface Configuration {value: string}\nexport {Configuration as default};\n',
			filename: fixturePath('source/default-interface.d.ts'),
		},
		{
			code: 'export default interface Configuration {value: string}\n',
			filename: fixturePath('source/default-interface.d.ts'),
		},
		// A local export list can expose the declaration through an index export too.
		{
			code: 'type LocalListed = string;\nexport type {LocalListed as PublicListed};\n',
			filename: fixturePath('source/local-listed.d.ts'),
		},
		// One indexed alias exposes the declaration, even when the source has several aliases and a value export.
		{
			code: 'type LocalListed = string;\nconst version = 1;\nexport {version};\nexport type {LocalListed as PublicListed, LocalListed as OtherListed};\n',
			filename: fixturePath('source/local-listed.d.ts'),
		},
		{
			code: 'interface PublicInterface {value: string}\nexport type {PublicInterface};\n',
			filename: fixturePath('source/interface-type.d.ts'),
		},
		// A re-export is checked at its declaration's source, rather than reported again at a barrel.
		{
			code: 'export type {ForeignOnly} from \'./foreign-only.d.ts\';\n',
			filename: fixturePath('source/local-barrel.d.ts'),
		},
		{
			code: 'type _Hidden = string;\nexport type {_Hidden};\n',
			filename: fixturePath('source/local-private.d.ts'),
		},
		{
			code: 'export declare namespace Scoped {export type Nested = string}\n',
			filename: fixturePath('source/local-namespace.d.ts'),
		},
		// A type inside a `declare namespace` is not checked, even when an import alias exports it at the top level.
		{
			code: 'declare namespace Scoped {export type Nested = string}\nexport import Nested = Scoped.Nested;\nexport {};\n',
			filename: fixturePath('source/local-namespace.d.ts'),
		},
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
		{
			code: 'interface Configuration {value: string}\nexport {Configuration as default};\n',
			filename: fixturePath('source/default-missing.d.ts'),
			errors: [missingExportError('Configuration')],
		},
		{
			code: 'export default interface Configuration {value: string}\n',
			filename: fixturePath('source/default-missing.d.ts'),
			errors: [missingExportError('Configuration')],
		},
		// An export list does not make a public declaration available from the index.
		{
			code: 'type LocalMissing = string;\nexport type {LocalMissing as PublicMissing};\n',
			filename: fixturePath('source/local-missing.d.ts'),
			errors: [missingExportError('LocalMissing')],
		},
		{
			code: 'interface LocalInterface {value: string}\nexport type {LocalInterface};\n',
			filename: fixturePath('source/local-interface.d.ts'),
			errors: [missingExportError('LocalInterface')],
		},
		// Several public aliases still produce only one report for their missing declaration.
		{
			code: 'type LocalDuplicate = string;\nexport type {LocalDuplicate as FirstAlias, LocalDuplicate as SecondAlias};\n',
			filename: fixturePath('source/local-duplicate.d.ts'),
			errors: [missingExportError('LocalDuplicate')],
		},
		{
			code: 'type MixedMissing = string;\nconst version = 1;\nexport {version};\nexport type {MixedMissing};\n',
			filename: fixturePath('source/local-mixed.d.ts'),
			errors: [missingExportError('MixedMissing')],
		},
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

runTest('reuses index exports within a TypeScript Program', t => {
	const fixture = createFixtures({
		'package.json': '{}',
		'index.d.ts': 'export type {First} from \'./source/first.d.ts\';\nexport type {Second} from \'./source/second.d.ts\';\n',
		'alternate.d.ts': 'export type {First} from \'./source/first.d.ts\';\n',
		'source/first.d.ts': 'export type First = string;\n',
		'source/second.d.ts': 'export type Second = number;\n',
	});
	const sourceFilenames = ['source/first.d.ts', 'source/second.d.ts'].map(filename => fixture.fixturePath(filename));
	const filenames = [...['index.d.ts', 'alternate.d.ts'].map(filename => fixture.fixturePath(filename)), ...sourceFilenames];
	const compilerOptions = {module: ts.ModuleKind.NodeNext, strict: true, exactOptionalPropertyTypes: true, noLib: true, types: []};
	const program = ts.createProgram(filenames, compilerOptions);
	const checker = program.getTypeChecker();
	const indexSymbol = checker.getSymbolAtLocation(program.getSourceFile(filenames[0]));
	const exportsLookup = t.mock.method(checker, 'getExportsOfModule');
	const linter = new Linter({cwd: fixture.fixtureRoot});
	const verify = (currentProgram, indexFile = 'index.d.ts') => {
		const config = [{
			files: ['**/*.ts'],
			languageOptions: {parser: tsParser, parserOptions: {programs: [currentProgram]}},
			plugins: {'type-fest': {rules: {'require-exported-types': requireExportedTypesRule}}},
			rules: {'type-fest/require-exported-types': ['error', {indexFile}]},
		}];
		return sourceFilenames.flatMap(filename => linter.verify(currentProgram.getSourceFile(filename).text, config, {filename}));
	};

	t.assert.deepStrictEqual(verify(program), []);
	t.assert.strictEqual(exportsLookup.mock.calls.filter(call => call.arguments[0] === indexSymbol).length, 1);

	// A different entry point in the same Program must have its own export set.
	const alternateMessages = verify(program, 'alternate.d.ts');
	t.assert.strictEqual(alternateMessages.length, 1);
	t.assert.strictEqual(alternateMessages[0].messageId, 'missingExport');
	t.assert.match(alternateMessages[0].message, /`Second`/v);
	t.assert.deepStrictEqual(verify(program), []);
	t.assert.strictEqual(exportsLookup.mock.calls.filter(call => call.arguments[0] === indexSymbol).length, 1);

	// Reusing source files in a new Program must not retain the previous index's exports.
	fixture.writeFixture('index.d.ts', 'export {};\n');
	const changedProgram = ts.createProgram(filenames, compilerOptions, undefined, program);
	t.assert.deepStrictEqual(verify(changedProgram).map(message => message.messageId), ['missingExport', 'missingExport']);
	fixture.writeFixture('index.d.ts', program.getSourceFile(filenames[0]).text);
	const restoredProgram = ts.createProgram(filenames, compilerOptions, undefined, changedProgram);
	t.assert.deepStrictEqual(verify(restoredProgram), []);

	// Missing entry points are cached too, but creating one in a new Program must be observed.
	t.assert.deepStrictEqual(verify(restoredProgram, 'missing.d.ts').map(message => message.messageId), ['missingExport', 'missingExport']);
	fixture.writeFixture('missing.d.ts', program.getSourceFile(filenames[0]).text);
	const addedProgram = ts.createProgram([...filenames, fixture.fixturePath('missing.d.ts')], compilerOptions, undefined, restoredProgram);
	t.assert.deepStrictEqual(verify(addedProgram, 'missing.d.ts'), []);
});
