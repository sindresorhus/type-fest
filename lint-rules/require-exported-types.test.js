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
	'source/exported-type.d.ts': undefined,
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
