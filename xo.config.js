// @ts-check
import markdown from '@eslint/markdown';
import tseslint from 'typescript-eslint';
import {importPathRule} from './lint-rules/import-path.js';
import {sourceFilesExtensionRule} from './lint-rules/source-files-extension.js';
import {requireExportedTypesRule} from './lint-rules/require-exported-types.js';
import {requireExportRule} from './lint-rules/require-export.js';
import {validateJSDocCodeblocksRule} from './lint-rules/validate-jsdoc-codeblocks.js';
import {readmeJSDocSyncRule} from './lint-rules/readme-jsdoc-sync.js';
import {jsdocCodeblocksProcessor} from './lint-processors/jsdoc-codeblocks.js';

/** @type {Array<import('eslint').Linter.Config>} */
const xoConfig = [
	{
		files: ['**/*.{js,ts}'],
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
			'@typescript-eslint/no-unnecessary-type-arguments': 'off',
			'@typescript-eslint/no-unsafe-type-assertion': 'off',
			'@stylistic/quote-props': 'off',
			'@stylistic/function-paren-newline': 'off',
			'@stylistic/object-curly-newline': 'off',
			'@stylistic/curly-newline': 'off',
			'@stylistic/operator-linebreak': ['error', 'before', {overrides: {'=': 'after'}}],
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
		files: ['source/**/*.d.ts', 'index.d.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					paths: ['tsd', 'expect-type'],
				},
			],
			'unicorn/require-module-specifiers': 'off',
		},
	},
	{
		files: ['test-d/**/*.ts'],
		rules: {
			'unicorn/no-immediate-mutation': 'off',
			'require-unicode-regexp': 'off',
		},
	},
	{
		files: ['**/*'],
		plugins: {
			'type-fest': {
				rules: {
					'import-path': importPathRule,
					'source-files-extension': sourceFilesExtensionRule,
					'require-exported-types': requireExportedTypesRule,
					'require-export': requireExportRule,
					'validate-jsdoc-codeblocks': validateJSDocCodeblocksRule,
					'readme-jsdoc-sync': readmeJSDocSyncRule,
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
		files: ['source/**/*'],
		rules: {
			'type-fest/source-files-extension': 'error',
		},
	},
	{
		files: ['source/**/*.d.ts'],
		ignores: ['source/internal/**/*.d.ts'],
		rules: {
			'type-fest/require-exported-types': 'error',
			'type-fest/require-export': 'error',
			'type-fest/validate-jsdoc-codeblocks': 'error',
		},
	},
	// Register processor for all source `.d.ts` files
	{
		files: ['source/**/*.d.ts'],
		processor: 'type-fest/jsdoc-codeblocks',

	},
	{
		// Virtual files created by the `jsdoc-codeblocks` processor
		files: ['source/**/*.d.ts/*.ts'],
		...tseslint.configs.disableTypeChecked,
	},
	{
		// Virtual files created by the `jsdoc-codeblocks` processor
		files: ['source/**/*.d.ts/*.ts'],
		rules: {
			'type-fest/source-files-extension': 'off',
			'@stylistic/eol-last': 'off',
			'capitalized-comments': 'off',
			'unicorn/prefer-structured-clone': 'off',
			'unicorn/no-immediate-mutation': 'off',
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
		files: ['lint-rules/test-utils.js'],
		rules: {
			'no-irregular-whitespace': [
				'error',
				{
					'skipComments': true,
				},
			],
		},
	},
	{
		files: ['readme.md'],
		language: 'markdown/commonmark',
		plugins: {
			markdown,
		},
		rules: {
			'type-fest/readme-jsdoc-sync': 'error',
		},
	},
];

export default xoConfig;
