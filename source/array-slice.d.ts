import type {Sum} from './sum.d.ts';
import type {LessThanOrEqual} from './less-than-or-equal.d.ts';
import type {GreaterThanOrEqual} from './greater-than-or-equal.d.ts';
import type {GreaterThan} from './greater-than.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {Not, TupleMin} from './internal/index.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {And} from './and.d.ts';
import type {ArraySplice} from './array-splice.d.ts';
import type {IsNever} from './is-never.d.ts';

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
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQSlAhogZQBtgBjFAXzgDMoIQ4ByJVAWmpQGcZGBuAKH4s0AFQAMcALxxseQiXIAeANpiANHACMGgEwaAzBoAsAXQB8AgPSXJZuKo3a4euIbinBwuCM1SZOfGIyFBV1LV0DYxMNMNZNC35rW3swpxd9E09kUR0-WUCFEIdw50j3aJLWHQSku2U0zKFs7308gPlg0McI1yiNKuMamzqMrNRvIza5IKVitLLTfpc4oeTlUabxkQBWKYLOuZ63RbhYgE4L1brG6gBXADtSGGAIe7hcdpmQ-gBIUlfuP45AB9OAoAAeMBQ9wAJpw4FAULgYa8iIg4A8ANb3CAAd3uymivwIMA+8AhUNh8PutxAACMUFA-OpfgBRWFgyHQuFwGn0xl7RDA5SMIjQgDmMAAFowiWYABQfOQALiB+GBGm4ZIA-KqSWSNNzdXB2TCAJQYX6ImC3KBvJX4AB0nEK8q1sENsItuHh+Q6Sj9Grg+o9JthCQogn+90BLuCfgd-pQ8vqGkYOkYGnQuFV+goGmURg02xMFVimjNAk2KAg1DgcfIVmG9ic6czGARSJR9zR71zvDgFEaDZQyh0JkduCbyX0gmscAAAjBOKwIagnqucNA4KxWN4CDojGd9KqRLcwGKEM1GKm4AAiHR3rOI5Go9E51xDxhwWtwMX3SUpSYfRvylH1eQgMExRAaF4FweBgFhCFgMYR1+BHdYTF4IA)

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
		? VariableLengthArraySliceHelper<Array_, Start, End>
		: ArraySliceHelper<Array_, IsEqual<Start, never> extends true ? 0 : Start, IsEqual<End, never> extends true ? Array_['length'] : End>;

type VariableLengthArraySliceHelper<
	Array_ extends readonly unknown[],
	Start extends number,
	End extends number,
> = And<Not<IsNegative<Start>>, IsEqual<End, never>> extends true
	? ArraySplice<Array_, 0, Start>
	: And<
		And<Not<IsNegative<Start>>, Not<IsNegative<End>>>,
		IsEqual<GreaterThan<End, Start>, true>
	> extends true
		? ArraySliceByPositiveIndex<Array_, Start, End>
		: [];

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
				: GreaterThan<AddResult, 0> extends true ? AddResult : 0
			: never
		: Start,
	PositiveE extends number = IsNegative<End> extends true ? Sum<ArrayLength, End> : End,
> = true extends [IsNegative<PositiveS>, LessThanOrEqual<PositiveE, PositiveS>, GreaterThanOrEqual<PositiveS, ArrayLength>][number]
	? []
	: ArraySliceByPositiveIndex<Array_, TupleMin<[PositiveS, ArrayLength]>, TupleMin<[PositiveE, ArrayLength]>>;

type ArraySliceByPositiveIndex<
	Array_ extends readonly unknown[],
	Start extends number,
	End extends number,
	Result extends Array<Array_[number]> = [],
> = Start extends End
	? Result
	: ArraySliceByPositiveIndex<Array_, Sum<Start, 1>, End, [...Result, Array_[Start]]>;

export {};
