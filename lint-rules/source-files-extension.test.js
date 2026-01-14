import {createRuleTester} from './test-utils.js';
import {sourceFilesExtensionRule} from './source-files-extension.js';

const ruleTester = createRuleTester();

const invalidSourceFile = (filename, code = '') => ({
	code,
	filename,
	errors: [{messageId: 'incorrectFilename'}],
});

ruleTester.run('source-files-extension', sourceFilesExtensionRule, {
	valid: [
		// Correct .d.ts extension
		{
			code: '',
			filename: '/source/foo.d.ts',
		},
		{
			code: '',
			filename: '/source/types/bar.d.ts',
		},
		{
			code: '',
			filename: '/source/deeply/nested/file.d.ts',
		},
	],
	invalid: [
		// Wrong .ts extension
		invalidSourceFile('/source/foo.ts'),
		// Wrong .js extension
		invalidSourceFile('/source/foo.js'),
		// No extension
		invalidSourceFile('/source/bar'),
		// Wrong .tsx extension
		invalidSourceFile('/source/component.tsx'),
		// Wrong .mjs extension
		invalidSourceFile('/source/module.mjs'),
	],
});
