// @ts-check
import {importPathRule} from './lint-rules/import-path.js';
import {sourceFilesExtensionRule} from './lint-rules/source-files-extension.js';
import {requireExportedTypesRule} from './lint-rules/require-exported-types.js';
import {requireExportRule} from './lint-rules/require-export.js';

/** @type {import('xo').FlatXoConfig} */
const xoConfig = [
	{
		rules: {
			'@typescript-eslint/no-extraneous-class': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/ban-types': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-redeclare': 'off',
			'@typescript-eslint/no-confusing-void-expression': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-restricted-types': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off',
			'@typescript-eslint/no-deprecated': 'off',
			'@typescript-eslint/no-wrapper-object-types': 'off',
			'@typescript-eslint/consistent-indexed-object-style': 'off',
			'@stylistic/quote-props': 'off',
			'@stylistic/function-paren-newline': 'off',
			'@stylistic/object-curly-newline': 'off',
			'n/file-extension-in-import': 'off',
			'object-curly-newline': [
				'error',
				{
					multiline: true,
					consistent: true,
				},
			],
			'import-x/consistent-type-specifier-style': [
				'error',
				'prefer-top-level',
			],
		},
	},
	{
		files: 'source/**/*.d.ts',
		rules: {
			'no-restricted-imports': [
				'error',
				{
					paths: ['tsd', 'expect-type'],
				},
			],
		},
	},
	{
		plugins: {
			'type-fest': {
				rules: {
					'import-path': importPathRule,
					'source-files-extension': sourceFilesExtensionRule,
					'require-exported-types': requireExportedTypesRule,
					'require-export': requireExportRule,
				},
			},
		},
	},
	{
		files: ['source/**/*.d.ts', 'test-d/**/*.ts'],
		rules: {
			'type-fest/import-path': 'error',
		},
	},
	{
		files: 'source/**/*',
		rules: {
			'type-fest/source-files-extension': 'error',
		},
	},
	{
		files: 'source/**/*.d.ts',
		ignores: ['source/internal/**/*.d.ts'],
		rules: {
			'type-fest/require-exported-types': 'error',
			'type-fest/require-export': 'error',
		},
	},
];

export default xoConfig;
