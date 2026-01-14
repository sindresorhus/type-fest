// @ts-check
import tseslint from 'typescript-eslint';
import {importPathRule} from './lint-rules/import-path.js';
import {sourceFilesExtensionRule} from './lint-rules/source-files-extension.js';
import {requireExportedTypesRule} from './lint-rules/require-exported-types.js';
import {requireExportRule} from './lint-rules/require-export.js';
import {validateJSDocCodeblocksRule} from './lint-rules/validate-jsdoc-codeblocks.js';
import {jsdocCodeblocksProcessor} from './lint-processors/jsdoc-codeblocks.js';

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
			'@typescript-eslint/unified-signatures': 'off', // Temp
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
		ignores: ['lint-processors/fixtures/**/*.d.ts'],
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
					'validate-jsdoc-codeblocks': validateJSDocCodeblocksRule,
				},
				processors: {
					'jsdoc-codeblocks': jsdocCodeblocksProcessor,
				},
			},
		},
	},
	{
		files: ['source/**/*.d.ts', 'test-d/**/*.ts', 'index.d.ts'],
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
			'type-fest/validate-jsdoc-codeblocks': 'error',
		},
	},
	// Register processor for all source `.d.ts` files
	{
		files: 'source/**/*.d.ts',
		processor: 'type-fest/jsdoc-codeblocks',

	},
	{
		// Virtual files created by the `jsdoc-codeblocks` processor
		files: 'source/**/*.d.ts/*.ts',
		...tseslint.configs.disableTypeChecked,
	},
	{
		// Virtual files created by the `jsdoc-codeblocks` processor
		files: 'source/**/*.d.ts/*.ts',
		rules: {
			'type-fest/source-files-extension': 'off',
			'@stylistic/eol-last': 'off',
			'capitalized-comments': 'off',
			'unicorn/prefer-structured-clone': 'off',
		},
	},
	{
		// Virtual files created by the `jsdoc-codeblocks` processor
		files: ['source/is-float.d.ts/*.ts', 'source/is-integer.d.ts/*.ts', 'source/numeric.d.ts/*.ts'],
		rules: {
			'unicorn/no-zero-fractions': 'off',
		},
	},
	{
		// Virtual files created by the `jsdoc-codeblocks` processor
		files: ['source/find-global-type.d.ts/*.ts', 'source/jsonify.d.ts/*.ts', 'source/simplify.d.ts/*.ts'],
		rules: {
			'@typescript-eslint/consistent-type-definitions': 'off',
		},
	},
	{
		files: 'lint-rules/test-utils.js',
		rules: {
			'no-irregular-whitespace': [
				'error',
				{
					'skipComments': true,
				},
			],
		},
	},
];

export default xoConfig;
