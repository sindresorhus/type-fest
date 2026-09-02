import type {ArraySlice} from './array-slice.d.ts';
import type {NumberAbsolute} from './internal/numeric.d.ts';
import type {IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';
import type {RequiredPartOfStaticArray, OptionalPartOfStaticArray} from './internal/array.d.ts';
import type {LessThanOrEqual} from './less-than-or-equal.d.ts';
import type {LessThan} from './less-than.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {Subtract} from './subtract.d.ts';
import type {Sum} from './sum.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {SplitOnRestElement} from './split-on-rest-element.d.ts';

/**
Returns the element at the given index of the given array.

Use-case: Get the element at a specific index of an array.

Like [`Array#at()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) but for types.

@example
```
import type {ArrayAt} from 'type-fest';

type A = [string, number, boolean];
type B = ArrayAt<A, 0>;
//=> string

type C = ArrayAt<A, -1>;
//=> boolean
*/
export type ArrayAt<T extends UnknownArray, N extends number> =
number extends N
	? T[number] | undefined
	: number extends T['length']
		? NonFixedLengthArrayAt<T, N>
		: FixedLengthArrayAt<T, N>;

// Internal `ArrayAt` type for fixed-length array.
type FixedLengthArrayAt<T extends UnknownArray, N extends number> =
IsNegative<N> extends false
	? T[N]
	: Sum<T['length'], N> extends infer Index extends number
		? Index extends unknown
			? IsNegative<Index> extends true
				? undefined
				: IsExactOptionalPropertyTypesEnabled extends true
					? Required<T>[Index]
					: T[Index]
			: never // Never happens
		: never; // Never happens

// Internal `ArrayAt` type for non-fixed-length array.
type NonFixedLengthArrayAt<T extends UnknownArray, N extends number> =
SplitOnRestElement<T> extends readonly [infer LeadingStaticPart extends UnknownArray, infer VariablePart extends UnknownArray, infer TrailingStaticPart extends UnknownArray]
	? [RequiredPartOfStaticArray<LeadingStaticPart>, OptionalPartOfStaticArray<LeadingStaticPart>] extends [infer RequiredLeadingStaticPart extends UnknownArray, infer OptionalLeadingStaticPart extends UnknownArray]
		? IsNegative<N> extends false
			? LessThan<N, RequiredLeadingStaticPart['length']> extends true
				? LeadingStaticPart[N]
				: LessThan<N, Required<LeadingStaticPart>['length']> extends true
					?
					| LeadingStaticPart[N]
					| OptionalLeadingStaticPart[number]
					:
						| VariablePart[number]
						| (
							ArraySlice<TrailingStaticPart, 0, Sum<Subtract<N, LeadingStaticPart['length']>, 1>> extends infer Slice extends UnknownArray
								? Slice[number] | (LessThanOrEqual<TrailingStaticPart['length'], Subtract<N, LeadingStaticPart['length']>> extends true ? undefined : never)
								: never
							)
			: LessThanOrEqual<NumberAbsolute<N>, TrailingStaticPart['length']> extends true
				? FixedLengthArrayAt<TrailingStaticPart, N>
				:	| VariablePart[number]
					| (
						IsExactOptionalPropertyTypesEnabled extends true
							? Required<OptionalLeadingStaticPart>[number]
							: OptionalLeadingStaticPart[number]
					)
					| (
						ArraySlice<RequiredLeadingStaticPart, Sum<N, TrailingStaticPart['length']>> extends infer Slice extends UnknownArray
							? Slice[number] | (LessThan<Sum<Sum<N, TrailingStaticPart['length']>, RequiredLeadingStaticPart['length']>, 0> extends true ? undefined : never)
							: never
					)
					// Handle trailing spread array like `[number, boolean, ...string[]]`
		: never
	: T[number];

export {};
