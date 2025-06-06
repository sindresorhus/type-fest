import type {ArraySlice} from './array-slice.d.ts';
import type {GreaterThanOrEqual} from './greater-than-or-equal.d.ts';
import type {StaticPartOfArray, VariablePartOfArray, IsLeadingSpreadArray, IsTrailingSpreadArray, StaticPartOfLeadingSpreadArray, VariablePartOfLeadingSpreadArray, RequiredPartOfArray, OptionalPartOfArray} from './internal/index.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {Sum} from './sum.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Returns the element at the given index of the given array.

Use-case: Get the element at a specific index of an array.

Like [`Array#at()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) but for types.

@example
```
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
	: Sum<T['length'], N> extends infer Index extends number
		? IsNegative<Index> extends true
			? undefined
			: [RequiredPartOfArray<T>, OptionalPartOfArray<T>] extends [infer RequiredPart extends UnknownArray, infer OptionalPart extends UnknownArray]
				? RequiredPart[Index] | ([N] extends [-1] ? OptionalPart[number] : never)
				: never // Never happens
		: never; // Never happens

// Internal `ArrayAt` type for non-fixed-length array.
type NonFixedLengthArrayAt<T extends UnknownArray, N extends number> =
// Handle leading spread array like `[...string[], number, boolean]`
IsLeadingSpreadArray<T> extends true
	? [VariablePartOfLeadingSpreadArray<T>, StaticPartOfLeadingSpreadArray<T>] extends [infer VariablePart extends UnknownArray, infer StaticPart extends UnknownArray]
		? IsNegative<N> extends false
			? FixedLengthArrayAt<StaticPart, N> | VariablePart[number]
			: Sum<StaticPart['length'], N> extends infer Index extends number
				? IsNegative<Index> extends true
					? VariablePart[number] | undefined
					: StaticPart[Index]
				: never
		: never // Never happens
	// Handle trailing spread array like `[number, boolean, ...string[]]`
	: IsTrailingSpreadArray<T> extends true
		? [StaticPartOfArray<T>, VariablePartOfArray<T>] extends [infer StaticPart extends UnknownArray, infer VariablePart extends UnknownArray]
			// Handle positive index
			? IsNegative<N> extends false
				? GreaterThanOrEqual<N, StaticPart['length']> extends true
					? VariablePart[number] | undefined
					: FixedLengthArrayAt<StaticPart, N>
					// Handle negative index
				: Sum<RequiredPartOfArray<StaticPart>['length'], N> extends infer SliceLength extends number
					? IsNegative<SliceLength> extends true
						? T[number] | undefined
						: T extends [...ArraySlice<StaticPart, 0, Sum<RequiredPartOfArray<StaticPart>['length'], N>>, ...infer Last]
							? Last[number]
							: never
					: never // Never happens
			: never // Never happens
		: T[number];
