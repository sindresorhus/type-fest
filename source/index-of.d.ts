import type {SplitArrayByIndex} from './array-splice.d.ts';
import type {SubtractPositives} from './subtract.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {SumPositives} from './sum.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {Reverse} from './reverse.d.ts';

/**
Simpler version of Sum<T, 1>, without the extra logic.
*/
export type Increment<T extends number> = SumPositives<T, 1>;

type _IndexOf<
	Array_ extends UnknownArray, Item,
	FromIndex extends number = 0,
	Index extends number = 0,
> = (
	Array_ extends readonly [infer Head, ...infer Tail]
		? IsEqual<Head, Item> extends true
			? SumPositives<Index, FromIndex>
			: _IndexOf<Tail, Item, FromIndex, Increment<Index>>
		: -1 // Same as `indexOf`
);

/**
Returns the index of the first occurrence of a value in an array, or `-1` if it is not present.

@example
```
type T = IndexOf<readonly ['a', 'c', 'c'], 'c'>;
//=> 1

type T = IndexOf<[1, 2, 3], 4>;
//=> -1

type T = IndexOf<[{a: 1}, {a: 1}, {b: 1}], {a: 1}>;
//=> 0
```

@author benzaria
@see LastIndexOf, IndicesOf
@category Array
*/
// TODO: Add `ToIndex` parameter
export type IndexOf<
	Array_ extends UnknownArray, Item,
	FromIndex extends number = 0,
> = _IndexOf<SplitArrayByIndex<Array_, FromIndex>[1], Item, FromIndex>;
//	 Return's never If `FromIndex > ArrayLength`

/**
Returns the index of the last occurrence of a value in an array, or `-1` if it is not present.

@example
```
type T = LastIndexOf<readonly ['a', 'c', 'c'], 'c'>;
//=> 2

type T = LastIndexOf<[1, 2, 3], 4>;
//=> -1

type T = LastIndexOf<[{a: 1}, {a: 1}, {b: 1}], {a: 1}>;
//=> 1
```

@author benzaria
@see IndexOf, IndiciesOf
@category Array
*/
export type LastIndexOf<
	Array_ extends UnknownArray, Item,
	FromIndex extends number = 0,
> = (
	IndexOf<Reverse<Array_>, Item, FromIndex> extends infer Index extends number
		? Index extends -1
			? -1
			: SubtractPositives<Array_['length'], Increment<Index>>
		: never
);
