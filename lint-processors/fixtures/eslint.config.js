import tseslint from 'typescript-eslint';
import {defineConfig} from 'eslint/config';
import {jsdocCodeblocksProcessor} from '../jsdoc-codeblocks.js';

const errorEndingAtFirstColumnRule = {
	create(context) {
		return {
			'TSTypeAliasDeclaration Literal'(node) {
				if (node.value !== 'error_ending_at_first_column') {
					return;
				}

				context.report({
					loc: {
						start: {
							line: node.loc.start.line,
							column: 0,
						},
						end: {
							line: node.loc.start.line + 1,
							column: 0,
						},
					},
					message: 'Error ending at first column',
				});
			},
		};
	},
};

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
			'test/error-ending-at-first-column': 'error',
		},
	},
	{
		plugins: {
			test: {
				processors: {
					'jsdoc-codeblocks': jsdocCodeblocksProcessor,
				},
				rules: {
					'error-ending-at-first-column': errorEndingAtFirstColumnRule,
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
