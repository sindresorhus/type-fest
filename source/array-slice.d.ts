import type {Sum} from './sum.d.ts';
import type {LessThanOrEqual} from './less-than-or-equal.d.ts';
import type {GreaterThanOrEqual} from './greater-than-or-equal.d.ts';
import type {GreaterThan} from './greater-than.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {HasNoStaticElements, IsArrayReadonly, MaxLength, Not, TupleMin} from './internal/index.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {And} from './and.d.ts';
import type {ArraySplice} from './array-splice.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Subtract} from './subtract.d.ts';
import type {Absolute} from './absolute.d.ts';

/**
Returns an array slice of a given range, just like `Array#slice()`.

Known limitations:
- The range is resolved against the longest length a tuple with optional elements can have, so `ArraySlice<[1, 2?], 0, -1>` is `[1]` rather than `[] | [1]`. A shorter tuple is not assignable to the result. Use a union of the possible lengths when the length is not known.
- A tuple with a rest element is sliced as if the rest element held enough elements, so `ArraySlice<[1, ...string[]], 0, 3>` is `[1, string, string]`, which rejects a shorter array.
- A fractional index is not supported. `Array#slice()` truncates one toward zero, so `[1, 2, 3].slice(1.5)` is `[2, 3]`, but the range is resolved through the tuple helpers, which have no answer for a decimal, so the result is `never`. Round the index before passing it.

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

type Slice = typeof slice;
//=> readonly [1, '2', {readonly a: 3}]

const value = slice[2].a;
//=> 3

// @ts-expect-error -- TS2493: Tuple type 'readonly [1, "2", {readonly a: 3}]' of length '3' has no element at index '3'.
const invalidIndexAccess = slice[3];
```

@category Array
*/
export type ArraySlice<
	Array_ extends readonly unknown[],
	Start extends number = never,
	End extends number = never,
> = Array_ extends unknown // To distributive type
	? IsNever<Start> extends true
		? IsNever<End> extends true
			? _ArraySlice<Array_, Start, End>
			: End extends unknown // To distribute `End`
				? _ArraySlice<Array_, Start, End>
				: never // Never happens
		: IsNever<End> extends true
			? Start extends unknown // To distribute `Start`
				? _ArraySlice<Array_, Start, End>
				: never // Never happens
			: Start extends unknown // To distribute `Start`
				? End extends unknown // To distribute `End`
					? _ArraySlice<Array_, Start, End>
					: never // Never happens
				: never // Never happens
	: never; // Never happens

type _ArraySlice<
	Array_ extends readonly unknown[],
	Start extends number = 0,
	End extends number = Array_['length'],
> = And<IsEqual<Start, never>, IsEqual<End, never>> extends true
	? Array_
	: number extends Array_['length']
		? VariableLengthArraySliceHelper<Array_, IsNever<Start> extends true ? 0 : Start, End>
		// A non-literal index can be any value, so the slice can start or end anywhere and its length is unknown.
		: number extends Start | End
			? UnknownLengthArraySlice<Array_>
			: ArraySliceResult<Array_, ArraySliceHelper<Array_, IsEqual<Start, never> extends true ? 0 : Start, IsEqual<End, never> extends true ? MaxLength<Array_> : End>>;

/**
`Array#slice()` returns a fresh array, but a `readonly` input keeps its `readonly` modifier, whichever branch produced the slice.
*/
type ArraySliceResult<Array_ extends readonly unknown[], Sliced> =
	IsArrayReadonly<Array_> extends true ? Readonly<Sliced> : Sliced;

type VariableLengthArraySliceHelper<
	Array_ extends readonly unknown[],
	Start extends number,
	End extends number,
> = And<
	And<Not<IsNegative<Start>>, Not<IsNegative<End>>>,
	IsEqual<LessThanOrEqual<End, Start>, true>
> extends true
	? ArraySliceResult<Array_, []>
	: And<Not<IsNegative<Start>>, IsEqual<End, never>> extends true
		? ArraySplice<Array_, 0, Start>
		: And<
			And<Not<IsNegative<Start>>, Not<IsNegative<End>>>,
			IsEqual<GreaterThan<End, Start>, true>
		> extends true
			? HasNoStaticElements<Array_> extends true
				? UnknownLengthArraySlice<Array_>
				: ArraySliceResult<Array_, ArraySliceByPositiveIndex<Array_, Start, End>>
			: UnknownLengthArraySlice<Array_>;

/**
The result of slicing an array whose length is unknown, so the result can have any length.
*/
type UnknownLengthArraySlice<Array_ extends readonly unknown[]> = ArraySliceResult<Array_, Array<Array_[number]>>;

type ArraySliceHelper<
	Array_ extends readonly unknown[],
	Start extends number = 0,
	End extends number = MaxLength<Array_>,
	ArrayLength extends number = MaxLength<Array_>,
	// A negative index that points before the start is clamped to `0` before `Sum` is asked, because `Sum` has no answer for a number in exponential notation, like `-1e21`.
	PositiveS extends number = IsNegative<Start> extends true
		? GreaterThanOrEqual<Absolute<Start>, ArrayLength> extends true
			? 0
			: Sum<ArrayLength, Start> extends infer AddResult extends number
				? number extends AddResult // (ArrayLength + Start) < 0
					? 0
					: GreaterThan<AddResult, 0> extends true ? AddResult : 0
				: never
		: Start,
	PositiveE extends number = IsNegative<End> extends true
		? GreaterThanOrEqual<Absolute<End>, ArrayLength> extends true
			? 0
			: Sum<ArrayLength, End>
		: End,
> = true extends [IsNegative<PositiveS>, LessThanOrEqual<PositiveE, PositiveS>, GreaterThanOrEqual<PositiveS, ArrayLength>][number]
	? []
	: ArraySliceByPositiveTuple<Array_, TupleMin<[PositiveS, ArrayLength]>, TupleMin<[PositiveE, ArrayLength]>>;

type ArraySliceByPositiveIndex<
	Array_ extends readonly unknown[],
	Start extends number,
	End extends number,
	Result extends Array<Array_[number]> = [],
> = Start extends End
	? Result
	: ArraySliceByPositiveIndex<Array_, Sum<Start, 1>, End, [...Result, Array_[Start]]>;

/**
Like {@link ArraySliceByPositiveIndex}, but for arrays of a known length, where it walks the elements with variadic destructuring instead of indexing, so the `?` modifier of optional elements is preserved.
*/
type ArraySliceByPositiveTuple<
	Array_ extends readonly unknown[],
	Start extends number,
	End extends number,
> = DropLeadingElements<Array_, Start> extends infer Dropped extends readonly unknown[]
	? TakeLeadingElements<Dropped, Subtract<End, Start>>
	: never; // Should never happen

type DropLeadingElements<Array_ extends readonly unknown[], Count extends number, Counter extends unknown[] = []> =
	Counter['length'] extends Count
		? Array_
		: Array_ extends readonly []
			? never // Only a fractional count runs past the end, since the range is clamped to the length
			: Array_ extends readonly [(unknown)?, ...infer Rest]
				? DropLeadingElements<Rest, Count, [...Counter, unknown]>
				: [];

type TakeLeadingElements<Array_ extends readonly unknown[], Count extends number, Result extends unknown[] = [], Counter extends unknown[] = []> =
	Counter['length'] extends Count
		? Result
		: Array_ extends readonly []
			? never // Only a fractional count runs past the end, since the range is clamped to the length
			: Array_ extends readonly [(infer First)?, ...infer Rest]
				? TakeLeadingElements<
					Rest,
					Count,
					[
						...Result,
						// A tuple allows fewer than one element only when its first element is optional. Written in exactly this shape because equivalent ones, such as `[] extends Array_`, are several times slower.
						...Array_ extends readonly [unknown, ...unknown[]]
							? [First]
							: [First?],
					],
					[...Counter, unknown]
				>
				: never; // Should never happen

export {};
