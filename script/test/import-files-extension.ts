import { echo, isModule, read, colors } from './utils.ts';
import { readFile, writeFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';
import './argument-parser.ts';

// Regex to match ESM imports
const importRegex = /^import.*?['"](.+?)['"];?/gm;
const commentRegex = /\/\/.*$|\/\*[\s\S]*?\*\//gm;
const filename = basename(import.meta.url);

checkImportFilesExtension(args)
	.then(fixImportFilesExtension)
	.catch(e => echo.error(e).exit(1));

async function checkImportFilesExtension({ dir, fix }: typeof args) {

	let issues = 0;
	const dirents = await read(dir);

	const fileList: FileList = await Promise.all(
		dirents
			.filter(dirent => dirent.isFile() && dirent.name.endsWith('.ts'))
			.map(async file => {

				const content = await readFile(file.path, 'utf8');
				const striped = content.replaceAll(commentRegex, '');
				const imports = [...striped.matchAll(importRegex)];
				const message = [`Imports should be from ${colors(92, '.d.ts')} -> '${file.path}'\n`];

				const _imports = imports
					.filter(([, _import]) => isModule(_import) && !_import?.endsWith('.d.ts'))
					.map(([importIn, importOut], idx, arr) => {
						issues++;

						const ext = extname(importOut!);
						importOut = importIn.replace(
							importOut!, importOut!.replace(ext, '.d.ts')
						);

						const char = arr.length - 1 === idx ? '└' : '├';
						message.push(`\t${char}─${colors(93, importIn.replace(ext, colors(91, ext, 93)))}\n`);

						return [
							importIn,
							importOut
						] as [string, string];
					});

				if (_imports.length && !fix) echo.error(...message);

				return [
					file.path,
					content,
					_imports
				];

			})
	);

	if (!issues) echo
		.info(`✅ All Import files from '${dir}' are ${colors(92, '.d.ts')}\n`)
		.exit(0);

	if (!fix) echo
		.error(`❌ ${issues} Issues, To fix try: ${filename} --fix\n`)
		.exit(1);

	return fileList;
}

async function fixImportFilesExtension(fileList?: FileList) {
	if (!fileList) return echo
		.warn('Files list is empty, An error maybe accured!')
		.exit(2);

	fileList.forEach(([file, content, imports]) => {
		if (!imports.length) return;

		echo.info(`Changing ${file}`);
		imports.forEach(_import => {
			echo(`\t ${colors(91, '- ' + _import[0])}\n\t ${colors(92, '+ ' + _import[1])}`);
			content = content.replace(..._import);
		});

		echo();

		writeFile(file, content)
			.catch(() => echo.error(`Failed to Change ${file}`));
	});
}

type FileList = [file: string, content: string, imports: [importIn: string, inportOut: string][]][]
