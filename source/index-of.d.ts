import type {SplitArrayByIndex} from './array-splice.d.ts';
import type {SubtractPositives} from './subtract.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {Reverse} from './array-reverse.d.ts';
import type {SumPositives} from './sum.d.ts';
import type {IsEqual} from './is-equal.d.ts';

/**
Simpler version of Sum<T, 1>, without the extra logic.
*/
type Increment<T extends number> = SumPositives<T, 1>;

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

type _IndicesOf<
	Array_ extends UnknownArray, Item,
	FromIndex extends number = 0,
	Indexs extends number[] = [],
> = (
	IndexOf<Array_, Item, FromIndex> extends infer Index extends number
		? Index extends -1
			? Indexs
			: _IndicesOf<Array_, Item, Increment<Index>, [...Indexs, Index]>
		: never
);

// TODO: Add `ToIndex` parameter
export type IndexOf<
	Array_ extends UnknownArray, Item,
	FromIndex extends number = 0,
> = _IndexOf<SplitArrayByIndex<Array_, FromIndex>[1], Item, FromIndex>;
//	 Return's never If `FromIndex > ArrayLength`

// TODO: Add `ToIndex` parameter
export type IndicesOf<
	Array_ extends UnknownArray, Item,
	FromIndex extends number = 0,
> = _IndicesOf<Array_, Item, FromIndex>;

// TODO: Add `ToIndex` parameter
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
