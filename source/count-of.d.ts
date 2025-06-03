import type {UnknownArray} from './unknown-array.d.ts';
import type {IndicesOf} from './index-of.d.ts';

export type CountOf<Array_ extends UnknownArray, Item, FromIndex extends number = 0> =
	IndicesOf<Array_, Item, FromIndex> extends infer Indices extends number[]
		? Indices['length']
		: 0;
