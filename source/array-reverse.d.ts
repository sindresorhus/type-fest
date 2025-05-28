import type { UnknownArray } from './unknown-array.d.ts'

export type ArrayReverse<Array_ extends UnknownArray> = (
	Array_ extends [...infer Head, infer Tail]
		? [Tail, ...ArrayReverse<Head>]
		: []
)
