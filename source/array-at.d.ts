import type {If} from './if.d.ts';
import type {IntRange} from './int-range.d.ts';
import type {NumberAbsolute} from './internal/numeric.d.ts';
import type {IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';
import type {LessThanOrEqual} from './less-than-or-equal.d.ts';
import type {LessThan} from './less-than.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {SplitOnRestElement} from './split-on-rest-element.d.ts';
import type {Subtract} from './subtract.d.ts';
import type {Sum} from './sum.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Return the element at the given index of the given array.

Use-case: Get the element at a specific index of an array.

Like [`Array#at()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) but for types.

@example
```
import type {ArrayAt} from 'type-fest';

// Positive index
type A = ArrayAt<['a', 'b', 'c', 'd'], 1>;
//=> 'b'

// Negative index
type B = ArrayAt<['a', 'b', 'c', 'd'], -4>;
//=> 'a'

// Positive index with optional elements
type C = ArrayAt<['a', 'b', 'c'?, 'd'?], 3>;
//=> 'd' | undefined

// Negative index with optional elements
type D = ArrayAt<['a', 'b', 'c'?, 'd'?], -2>;
//=> 'a' | 'b' | 'c'

// Positive index with rest element and optional elements
type E = ArrayAt<['a', 'b', 'c'?, ...number[]], 3>;
//=> number | undefined

// Negative index with rest element and optional elements
type F = ArrayAt<['a', 'b', 'c'?, ...number[]], -1>;
//=> 'b' | 'c' | number

// Positive index with rest element in middle
type G = ArrayAt<['a', 'b', 'c', ...number[], 'd', 'e'], 4>;
//=> number | 'd' | 'e'

// Negative index with rest element in middle
type H = ArrayAt<['a', 'b', ...number[], 'c', 'd', 'e'], -5>;
//=> 'a' | 'b' | number

// Out-of-bounds positive index
type I = ArrayAt<['a', 'b'], 5>;
//=> undefined

// Out-of-bounds negative index
type J = ArrayAt<['a', 'b'], -3>;
//=> undefined
*/
export type ArrayAt<TArray extends UnknownArray, Index extends number> =
	TArray extends unknown // For distributing `Array_`
		? Index extends unknown // For distributing `Index`
			? number extends Index
				? TArray[number] | undefined
				: IsNegative<Index> extends true
					? ArrayAtNegativeIndex<TArray, Index>
					: ArrayAtPositiveIndex<TArray, Index>
			: never // Should never happen
		: never; // Should never happen

type ArrayAtPositiveIndex<TArray extends UnknownArray, Index extends number> =
	SplitOnRestElement<TArray> extends readonly [infer BeforeRest extends UnknownArray, infer Rest extends UnknownArray, infer AfterRest extends UnknownArray]
		? LessThan<Index, Required<BeforeRest>['length']> extends true
			? BeforeRest[Index]
			: Rest[number] | AfterRest[IntRange<0, Sum<Subtract<Index, Required<BeforeRest>['length']>, 1>>]
		: never; // Should never happen

type ArrayAtNegativeIndex<TArray extends UnknownArray, Index extends number> =
	SplitOnRestElement<TArray> extends readonly [infer BeforeRest extends UnknownArray, infer Rest extends UnknownArray, infer AfterRest extends UnknownArray]
		? LessThanOrEqual<NumberAbsolute<Index>, AfterRest['length']> extends true
			? AfterRest[Sum<Index, AfterRest['length']>]
			: Subtract<Subtract<
				BeforeRest['length'],
				IntRange<0, Subtract<NumberAbsolute<Index>, AfterRest['length']>>
			>, 1> extends infer Indices extends number
				?
				| Rest[number]
				| Required<BeforeRest>[Indices]
				| (true extends IsNegative<Indices> ? undefined : never)
				| If<IsExactOptionalPropertyTypesEnabled, never, undefined>
				: never
		: never; // Should never happen

export {};
