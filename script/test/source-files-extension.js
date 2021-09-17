/* eslint-disable unicorn/prefer-module */
const fs = require('fs');
const process = require('process');

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

checkSourceFilesExtension();
