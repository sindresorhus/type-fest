import {createTypeAwareRuleTester} from './test-utils.js';
import {requireExportedTypesRule} from './require-exported-types.js';

const packageContent = JSON.stringify({
	name: 'require-exported-types-fixture',
}, null, '\t');

const indexContent = 'export {type ExportedType} from \'./source/exported-type\';\n';
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
	'source/exported-type.d.ts': exportedTypeContent,
	'source/internal/internal-type.d.ts': internalTypeContent,
	'source/internal/nested/deep.d.ts': nestedInternalTypeContent,
	'source/private-type.d.ts': privateTypeContent,
	'source/missing-type.d.ts': missingTypeContent,
	'source/unexported-multiple.d.ts': unexportedMultipleContent,
	'source/implementation.ts': implementationContent,
	'test/test.d.ts': testDeclarationContent,
	'lib/test.d.ts': libDeclarationContent,
});

// Type-aware rule tests rely on the generated fixture project above.
const missingExportError = typeName => ({
	messageId: 'missingExport',
	data: {typeName},
});

ruleTester.run('require-exported-types', requireExportedTypesRule, {
	valid: [
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
