import type {ArraySlice} from './array-slice.d.ts';
import type {GreaterThanOrEqual} from './greater-than-or-equal.d.ts';
import type {GreaterThan} from './greater-than.d.ts';
import type {StaticPartOfArray, VariablePartOfArray, IsLeadingSpreadArray, IsTrailingSpreadArray, StaticPartOfLeadingSpreadArray, VariablePartOfLeadingSpreadArray, RequiredPartOfStaticArray, OptionalPartOfStaticArray, IsExactOptionalPropertyTypesEnabled, IsMiddleSpreadArray, LeadingStaticPartOfMiddleSpreadArray, VariablePartOfMiddleSpreadArray, TrailingStaticPartOfMiddleSpreadArray, NumberAbsolute} from './internal/index.d.ts';
import type {LessThanOrEqual} from './less-than-or-equal.d.ts';
import type {LessThan} from './less-than.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {Subtract} from './subtract.d.ts';
import type {Sum} from './sum.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

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
number extends T['length']
	? NonFixedLengthArrayAt<T, N>
	: FixedLengthArrayAt<T, N>;

// Internal `ArrayAt` type for fixed-length array.
type FixedLengthArrayAt<T extends UnknownArray, N extends number> =
IsNegative<N> extends false
	? T[N]
	: [RequiredPartOfStaticArray<T>, OptionalPartOfStaticArray<T>] extends [infer RequiredPart extends UnknownArray, infer OptionalPart extends UnknownArray]
		? Sum<T['length'], N> extends infer Index extends number
			? Index extends unknown
				? IsNegative<Index> extends true
					? undefined
					: IsExactOptionalPropertyTypesEnabled extends true
						? Required<T>[Index]
						: T[Index]
				: never // Never happens
			: never // Never happens
		: never; // Never happens

// Internal `ArrayAt` type for non-fixed-length array.
type NonFixedLengthArrayAt<T extends UnknownArray, N extends number> =
// Handle leading spread array like `[...string[], number, boolean]`
IsLeadingSpreadArray<T> extends true
	? [VariablePartOfLeadingSpreadArray<T>, StaticPartOfLeadingSpreadArray<T>] extends [infer VariablePart extends UnknownArray, infer StaticPart extends UnknownArray]
		? IsNegative<N> extends false
			?
			| (ArraySlice<StaticPart, 0, Sum<N, 1>> extends infer Slice extends UnknownArray ? Slice[number] : never)
			| VariablePart[number]
			| (GreaterThanOrEqual<N, StaticPart['length']> extends true ? undefined : never)
			: Sum<StaticPart['length'], N> extends infer Index extends number
				? IsNegative<Index> extends true
					? VariablePart[number] | undefined
					: StaticPart[Index]
				: Sum<StaticPart['length'], N> extends infer Index extends number
					? IsNegative<Index> extends true
						? VariablePart[number] | undefined
						: StaticPart[Index]
					: never
		: never // Never happens
	// Handle middle spread array like `[number, ...string[], boolean]`
	: IsMiddleSpreadArray<T> extends true
		? [
			LeadingStaticPartOfMiddleSpreadArray<T>,
			VariablePartOfMiddleSpreadArray<T>,
			TrailingStaticPartOfMiddleSpreadArray<T>,
		] extends
		[
			infer LeadingStaticPart extends UnknownArray,
			infer VariablePart extends UnknownArray,
			infer TrailingStaticPart extends UnknownArray,
		]
			? IsNegative<N> extends false
				? LessThan<N, LeadingStaticPart['length']> extends true
					? LeadingStaticPart[N]
					: NonFixedLengthArrayAt<[...VariablePart, ...TrailingStaticPart], Subtract<N, LeadingStaticPart['length']>>
				: LessThanOrEqual<NumberAbsolute<N>, TrailingStaticPart['length']> extends true
					? FixedLengthArrayAt<TrailingStaticPart, N>
					: NonFixedLengthArrayAt<[...LeadingStaticPart, ...VariablePart], Sum<N, TrailingStaticPart['length']>>
			: never // Never happens
		// Handle trailing spread array like `[number, boolean, ...string[]]`
		: IsTrailingSpreadArray<T> extends true
			? [StaticPartOfArray<T>, VariablePartOfArray<T>] extends [infer _StaticPart extends UnknownArray, infer VariablePart extends UnknownArray]
				? [IsExactOptionalPropertyTypesEnabled extends true ? Required<_StaticPart> : _StaticPart] extends [infer StaticPart extends UnknownArray]
					// Handle positive index
					? IsNegative<N> extends false
						? GreaterThanOrEqual<N, StaticPart['length']> extends true
							? VariablePart[number] | undefined
							: FixedLengthArrayAt<StaticPart, N>
						// Handle negative index
						: Sum<RequiredPartOfStaticArray<_StaticPart>['length'], N> extends infer SliceLength extends number
							? IsNegative<SliceLength> extends true
								? T[number] | undefined
								: T extends [...ArraySlice<StaticPart, 0, SliceLength>, ...infer Last]
									? (IsExactOptionalPropertyTypesEnabled extends true ? Required<Last> : Last)[number]
									: never
							: never // Never happens
					: never // Never happens
				: never // Never happens
			: T[number];

type TrailingSpreadArray2 = [object, number, boolean?, ...string[]];
type MiddleSpreadArray = [number, ...string[], boolean];

type B = [object, number, boolean?]['length'];

type A = [boolean?, ...string[]] extends readonly [infer U, ...infer V] ? ['U', U, 'V', V] : never;

type LeadingSpreadArray = [object, number, boolean?, string?];
type N = LeadingSpreadArray['length'];
type C = ArrayAt<LeadingSpreadArray, -1>; // Number, object, undefined
