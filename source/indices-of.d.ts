import type {Increment, IndexOf} from './index-of.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Search for an item in a array and return it's indices.
*/
type _IndicesOf<
	Array_ extends UnknownArray, Item,
	FromIndex extends number = 0,
	Indices extends number[] = [],
> = (
	IndexOf<Array_, Item, FromIndex> extends infer Index extends number
		? Index extends -1
			? Indices
			: _IndicesOf<Array_, Item, Increment<Index>, [...Indices, Index]>
		: never
);

/**
Returns the index of the first occurrence of a value in an array, or `-1` if it is not present.

@example
```
type T = IndicesOf<readonly ['a', 'c', 'c'], 'c'>;
//=> [1, 2]

type T = IndicesOf<[1, 2, 3], 4>;
//=> []

type T = IndicesOf<[{a: 1}, {a: 1}, {b: 1}], {a: 1}>;
//=> [0, 1]
```

@author benzaria
@see IndexOf, LastIndexOf
@category Array
*/
export type IndicesOf<
	Array_ extends UnknownArray, Item,
	FromIndex extends number = 0,
> = _IndicesOf<Array_, Item, FromIndex>;
