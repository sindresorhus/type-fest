import {createRuleTester} from './testing-utilities.js';
import {sourceFilesExtensionRule} from './source-files-extension.js';

const ruleTester = createRuleTester();

const invalidSourceFile = (filename, code = '') => ({
	code,
	filename,
	errors: [{messageId: 'incorrectFilename'}],
});

ruleTester.run('source-files-extension', sourceFilesExtensionRule, {
	valid: [
		// A declaration filename may contain dots before its .d.ts suffix.
		{
			code: '',
			filename: '/source/foo.shared.d.ts',
		},
		{
			code: '',
			filename: '/source/types.generated/foo.shared.d.ts',
		},
		{
			code: '',
			filename: '/source/foo.d.d.ts',
		},
		{
			code: '',
			filename: '/source/.config.d.ts',
		},
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
		// The diagnostic preserves dotted stems and suggests replacing only the final extension.
		{
			code: '',
			filename: '/source/types.generated/foo.shared.ts',
			errors: [{messageId: 'incorrectFilename', data: {filename: 'foo.shared.ts', fixedFilename: 'foo.shared.d.ts'}}],
		},
		// A leading dot is part of a dotfile name, rather than an extension by itself.
		{
			code: '',
			filename: '/source/.config',
			errors: [{messageId: 'incorrectFilename', data: {filename: '.config', fixedFilename: '.config.d.ts'}}],
		},
		{
			code: '',
			filename: '/source/.config.ts',
			errors: [{messageId: 'incorrectFilename', data: {filename: '.config.ts', fixedFilename: '.config.d.ts'}}],
		},
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
