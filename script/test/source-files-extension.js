/* eslint-disable unicorn/prefer-module */
const fs = require('node:fs');
const process = require('node:process');

const checkSourceFilesExtension = async () => {
	try {
		const files = await fs.promises.readdir('source');

		let hasIncorrectFileExtension = false;
		for (const file of files) {
			if (!file.endsWith('.d.ts')) {
				hasIncorrectFileExtension = true;
				console.error(`source/${file} extension should be \`.d.ts\`.`);
			}
		}

		if (hasIncorrectFileExtension) {
			process.exitCode = 1;
		}
	} catch (error) {
		console.error(error);
		process.exitCode = 1;
	}
};

// eslint-disable-next-line unicorn/prefer-top-level-await
checkSourceFilesExtension();
