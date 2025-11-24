import tseslint from 'typescript-eslint';
import {defineConfig} from 'eslint/config';
import {jsdocCodeblocksProcessor} from '../jsdoc-codeblocks.js';

const config = defineConfig(
	tseslint.configs.recommended,
	tseslint.configs.stylistic,
	{
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/consistent-type-definitions': [
				'error',
				'type',
			],
		},
	},
	{
		plugins: {
			test: {
				processors: {
					'jsdoc-codeblocks': jsdocCodeblocksProcessor,
				},
			},
		},
	},
	{
		files: ['**/*.d.ts'],
		processor: 'test/jsdoc-codeblocks',
	},
);

export default config;
