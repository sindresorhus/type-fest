import type {Sum} from './sum';
import type {LessThan} from './less-than';
import type {LessThanOrEqual} from './less-than-or-equal';
import type {IsNegative} from './numeric';
import type {And} from './internal';
import type {IsEqual} from './is-equal';

/**
Returns an array slice of a given range, just like `Array#slice()`.

@example
```
import type {ArraySlice} from 'type-fest';

type T0 = ArraySlice<[0, 1, 2, 3, 4]>;
//=> [0, 1, 2, 3, 4]

type T1 = ArraySlice<[0, 1, 2, 3, 4], 0, -1>;
//=> [0, 1, 2, 3]

type T2 = ArraySlice<[0, 1, 2, 3, 4], 1, -2>;
//=> [1, 2]

type T3 = ArraySlice<[0, 1, 2, 3, 4], -2, 4>;
//=> [3]

type T4 = ArraySlice<[0, 1, 2, 3, 4], -2, -1>;
//=> [3]

type T5 = ArraySlice<[0, 1, 2, 3, 4], 0, -999>;
//=> []

function arraySlice<
	const Array_ extends readonly unknown[],
	Start extends number = 0,
	End extends number = Array_['length'],
>(array: Array_, start?: Start, end?: End) {
	return array.slice(start, end) as ArraySlice<Array_, Start, End>;
}

const slice = arraySlice([1, '2', {a: 3}, [4, 5]], 0, -1);

typeof slice;
//=> [1, '2', { readonly a: 3; }]

slice[2].a;
//=> 3

// @ts-expect-error -- TS2493: Tuple type '[1, "2", {readonly a: 3}]' of length '3' has no element at index '3'.
slice[3];
```

@category Array
*/
export type ArraySlice<
	Array_ extends readonly unknown[],
	Start extends number = 0,
	End extends number = Array_['length'],
> = ArraySliceHelper<Array_, Start, End>;

type ArraySliceHelper<
	Array_ extends readonly unknown[],
	Start extends number = 0,
	End extends number = Array_['length'],
	TraversedElement extends Array<Array_[number]> = [],
	Result extends Array<Array_[number]> = [],
	ArrayLength extends number = Array_['length'],
	PositiveS extends number = IsNegative<Start> extends true
		? Sum<ArrayLength, Start> extends infer AddResult extends number
			? number extends AddResult // (ArrayLength + Start) < 0
				? 0
				: AddResult
			: never
		: Start,
	PositiveE extends number = IsNegative<End> extends true ? Sum<ArrayLength, End> : End,
> = true extends [IsNegative<PositiveS>, LessThanOrEqual<PositiveE, PositiveS>][number]
	? []
	: ArraySliceByPositiveIndex<Array_, PositiveS, PositiveE>;

type ArraySliceByPositiveIndex<
	Array_ extends readonly unknown[],
	Start extends number,
	End extends number,
	TraversedElement extends Array<Array_[number]> = [],
	Result extends Array<Array_[number]> = [],
> = Array_ extends readonly [infer H, ...infer Rest]
	? And<
	IsEqual<LessThanOrEqual<Start, TraversedElement['length']>, true>,
	IsEqual<LessThan<TraversedElement['length'], End>, true>
	> extends true
		? ArraySliceByPositiveIndex<Rest, Start, End, [...TraversedElement, H], [...Result, H]>
		: ArraySliceByPositiveIndex<Rest, Start, End, [...TraversedElement, H], Result>
	: Result;
