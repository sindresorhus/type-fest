/* eslint-disable unicorn/prefer-module */
const fs = require('fs');
const process = require('process');

// eslint-disable-next-line node/prefer-promises/fs
fs.readdir('source', (error, files) => {
	if (error) {
		console.error(error);
		process.exitCode = 1;
	}

	let hasWrongExtensionFile = false;
	for (const file of files) {
		if (!file.endsWith('.d.ts')) {
			hasWrongExtensionFile = true;
			console.error(`source/${file} extension should be \`.d.ts\`.`);
		}
	}

	if (hasWrongExtensionFile) {
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}
});
