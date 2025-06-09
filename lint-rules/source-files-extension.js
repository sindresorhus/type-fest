import path from 'node:path';

export const sourceFilesExtensionRule = /** @type {const} */ ({
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforces source files to end with a \'.d.ts\' extension.',
		},
		fixable: 'code',
		messages: {
			incorrectFilename:
				'Filename \'{{filename}}\' must end with a \'.d.ts\' extension. Use \'{{fixedFilename}}\' instead.',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		const filename = path.basename(context.filename);
		const firstDotIndex = filename.indexOf('.');
		const extension = firstDotIndex === -1 ? '' : filename.slice(firstDotIndex);

		if (extension === '.d.ts') {
			return {};
		}

		return {
			Program(node) {
				const filenameWithoutExtension = extension.length > 0
					? filename.slice(0, -extension.length)
					: filename;
				const fixedFilename = `${filenameWithoutExtension}.d.ts`;

				context.report({
					loc: {column: 0, line: 1}, // Report error on start of the file
					node,
					messageId: 'incorrectFilename',
					data: {filename, fixedFilename},
				});
			},
		};
	},
});
