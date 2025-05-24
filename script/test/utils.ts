import { readdir } from 'node:fs/promises'
import type { Dirent } from 'node:fs'
import { exit } from "node:process"
import { log } from 'node:console'
import { join } from 'node:path'

/**
 * Use: `colors('38;5;id', 'string')` to access ansi256 colors.  
 * replace `id` with number from 0-255.  
 * replace `38` with `48` for backgroud color.  
 */
const colors = <T extends string>(id: number | string, label: T, resetId: typeof id = 0) =>
	`\x1B[${id}m${label}\x1B[${resetId}m` as T

type Echo = {
	/**
	 * Echo.
	 */
	(...args: any[]): Echo

	/**
	 * Echo an `[ERROR]`.
	 */
	error(...args: any[]): Echo

	/**
	 * Echo a `[WARN]`.
	 */
	warn(...args: any[]): Echo

	/**
	 * Echo an `[INFO]`.
	 */
	info(...args: any[]): Echo

	/**
	 * Exit's with code 0 as default.
	 * - `0`: Success
	 * - `1`: Error
	 * - `2`: Warning
	 */
	exit(code?: number): never
} & {}

const LEVEL = {
	info: `[${colors('1;94', 'INFO')}] -`,
	warn: `[${colors('1;33', 'WARN')}] -`,
	error: `[${colors('1;31', 'ERROR')}] -`,
} as const

const echo = new Proxy(
	((..._args: any) => !args.silent ? log(..._args) : null) as unknown as Echo,
	{
		apply: (fn, _, _args) => (fn(..._args), echo),

		get: (fn, prop: keyof Echo) => (..._args: any) => {
			if (prop === 'exit') exit(_args[0] ?? 0)
			if (prop === 'info' && !args.verbose) return echo
			fn(LEVEL[prop] ?? '', ..._args)
			return echo
		},
	}
)

const read = async (path: string) =>
	readdir(path, { recursive: true, withFileTypes: true, })
		.then(dirents =>
			dirents.map(dirent => (
				dirent.path = join(dirent.parentPath, dirent.name),
				dirent as Dirent & { path: string }
			))
		)

const isModule = (path: string | undefined) => path
	? path.startsWith('.') || path.startsWith('/')
	: false

export {
	echo,
	read,
	colors,
	isModule,
}
