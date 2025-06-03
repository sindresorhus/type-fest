import type {UnknownArray} from './unknown-array.d.ts';

export type Reverse<Array_ extends UnknownArray> =
	Array_ extends readonly [...infer Head, infer Tail]
		? [Tail, ...Reverse<Head>]
		: [];
