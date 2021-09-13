/* eslint-disable unicorn/prefer-module */
const fs = require('fs');
const process = require('process');

// eslint-disable-next-line node/prefer-promises/fs
fs.readdir('source', (error, files) => {
	if (error) {
		console.error(error);
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}

	const wrongExtensionFiles = [];
	for (const file of files) {
		if (!/\.d\.ts$/.test(file)) {
			wrongExtensionFiles.push(file);
		}
	}

	if (wrongExtensionFiles) {
		for (const file of wrongExtensionFiles) {
			console.error(`source/${file} extension should be '.d.ts'.`);
		}

		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}
});
