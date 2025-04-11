import type {GreaterThanOrEqual} from './greater-than-or-equal';
import type {StaticPartOfArray, VariablePartOfArray, IsLeadingSpreadArray, IsTrailingSpreadArray, StaticPartOfLeadingSpreadArray, VariablePartOfLeadingSpreadArray} from './internal';
import type {IsNegative} from './numeric';
import type {Sum} from './sum';
import type {UnknownArray} from './unknown-array';

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
			: T[Index]
		: never; // Never happens

// Internal `ArrayAt` type for non-fixed-length array.
type NonFixedLengthArrayAt<T extends UnknownArray, N extends number> =
IsLeadingSpreadArray<T> extends true
	? [VariablePartOfLeadingSpreadArray<T>, StaticPartOfLeadingSpreadArray<T>] extends [infer VariablePart extends UnknownArray, infer StaticPart extends UnknownArray]
		? FixedLengthArrayAt<StaticPart, N> | VariablePart[number]
		: never // Never happens
	: IsTrailingSpreadArray<T> extends true
		? [StaticPartOfArray<T>, VariablePartOfArray<T>] extends [infer StaticPart extends UnknownArray, infer VariablePart extends UnknownArray]
			? GreaterThanOrEqual<N, StaticPart['length']> extends true
				? VariablePart[number] | undefined
				: FixedLengthArrayAt<StaticPart, N>
			: never // Never happens
		: T[number];
