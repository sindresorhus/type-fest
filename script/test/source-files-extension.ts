import { colors, echo, read } from './utils.ts'
import { basename, extname } from 'node:path'
import { rename } from 'node:fs/promises'
import './argument-parser.ts'

const filename = basename(import.meta.url)

checkSourceFilesExtension(args)
	.then(fixSourceFilesExtension)
	.catch(e => echo.error(e).exit(1))

async function checkSourceFilesExtension({ dir, fix }: typeof args) {

	let issues = 0
	const dirents = await read(dir)

	const fileList: FileList = (
		dirents
			.filter(dirent => dirent.isFile() && !dirent.name.endsWith('.d.ts'))
			.map(file => {
				issues++

				const ext = extname(file.name)
				if (!fix) echo
					.error(`Extension should be ${colors(92, '.d.ts')} -> ${colors(93, file.path
						.replace(ext, colors(91, ext, 93)))}`)

				return [
					file.path,
					file.path.replace(ext, '.d.ts')
				]
			})
	)

	echo()

	if (!issues) echo
		.info(`✅ All Source files from '${dir}' are ${colors(92, '.d.ts')}\n`)
		.exit(0)

	if (!fix) echo
		.error(`❌ ${issues} Issues, To fix try: ${filename} --fix\n`)
		.exit(1)

	return fileList
}

async function fixSourceFilesExtension(fileList?: FileList) {
	if (!fileList) return echo
		.warn(`Files list is empty, An error maybe accured!`)
		.exit(2)

	fileList.forEach(file => {
		echo.info(`Renaming ${colors(91, file[0])} -> ${colors(92, file[1])}`)

		rename(...file)
			.catch(() => echo.error(`Failed to rename ${file[0]}`))
	})
}

type FileList = [oldPath: string, newPath: string][]
