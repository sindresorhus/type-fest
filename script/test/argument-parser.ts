import { parseArgs, type ParseArgsOptionsConfig } from 'node:util'
import type { Simplify } from '../../index.d.ts'

declare global {
	const args: Simplify<Required<typeof values>>
}

const options = {

	dir: {
		short: 'd',
		type: 'string',
		default: undefined,
	},

	fix: {
		short: 'f',
		type: 'boolean',
		default: false,
	},

	verbose: {
		short: 'v',
		type: 'boolean',
		default: false,
	},

	silent: {
		short: 's',
		type: 'boolean',
		default: false,
	},

} as const satisfies ParseArgsOptionsConfig

const { values, positionals } = parseArgs({ options, allowPositionals: true })

values.dir ??= positionals.length ? positionals[0]! : 'source' // Mandatory: take first arg

// @ts-ignore
globalThis.args = values
