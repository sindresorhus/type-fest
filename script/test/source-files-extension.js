import fs from 'node:fs';
import process from 'node:process';

const checkSourceFilesExtension = async () => {
	try {
		const files = await fs.promises.readdir('source', {recursive: true});

		let hasIncorrectFileExtension = false;
		for (const file of files) {
			if (!file.includes('.')) {
				continue;
			}

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
