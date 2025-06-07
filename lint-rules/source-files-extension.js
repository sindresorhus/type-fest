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
				'Filename \'{{currentFilename}}\' must end with a \'.d.ts\' extension. Use \'{{fixedFilename}}\' instead.',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		const {filename} = context;

		if (filename.endsWith('.d.ts')) {
			return {};
		}

		return {
			Program(node) {
				const extension = path.extname(filename);
				const filenameWithoutExtension = path.basename(filename, extension);

				context.report({
					loc: {column: 0, line: 1}, // Report error on start of the file
					node,
					messageId: 'incorrectFilename',
					data: {
						currentFilename: path.basename(filename),
						fixedFilename: `${filenameWithoutExtension}.d.ts`,
					},
				});
			},
		};
	},
});
