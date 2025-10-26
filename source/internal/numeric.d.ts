import type {Negative, NegativeInfinity, PositiveInfinity} from '../numeric.d.ts';
import type {UnknownArray} from '../unknown-array.d.ts';
import type {IsNever} from '../is-never.d.ts';
import type {IsAnyOrNever} from './type.d.ts';

export type Numeric = number | bigint;

export type Zero = 0 | 0n;

/**
Returns the absolute value of a given value.

@example
```
NumberAbsolute<-1>;
//=> 1

NumberAbsolute<1>;
//=> 1

NumberAbsolute<NegativeInfinity>
//=> PositiveInfinity
```
*/
export type NumberAbsolute<N extends number> = `${N}` extends `-${infer StringPositiveN}` ? ToNumber<StringPositiveN> : N;

/**
Check whether the given type is a number or a number string.

Supports floating-point as a string.

@example
```
type A = IsNumberLike<'1'>;
//=> true

type B = IsNumberLike<'-1.1'>;
//=> true

type C = IsNumberLike<'5e-20'>;
//=> true

type D = IsNumberLike<1>;
//=> true

type E = IsNumberLike<'a'>;
//=> false
*/
export type IsNumberLike<N> =
	IsAnyOrNever<N> extends true ? N
		: N extends number | `${number}`
			? true
			: false;

/**
Returns the minimum number in the given union of numbers.

Note: Just supports numbers from -999 to 999.

@example
```
type T1 = UnionMin<1 | 2 | 3>;
//=> 1

type T2 = UnionMin<-1 | -2 | -3>;
//=> -3

type T3 = UnionMin<-1 | 0 | 1>;
//=> -1

type T4 = UnionMin<NegativeInfinity | -1 | 1>;
//=> NegativeInfinity

type T5 = UnionMin<-1 | 1 | PositiveInfinity>;
//=> -1

type T6 = UnionMin<number>;
//=> number
```
*/
export type UnionMin<N extends number> =
	IsAnyOrNever<N> extends true ? N // Handles `any/never`
		: number extends N ? number // If `N` is the wide `number` type, we cannot infer a literal minimum
			: NegativeInfinity extends N ? NegativeInfinity // If `NegativeInfinity` is present, it dominates any finite number
				: [N] extends [PositiveInfinity] ? PositiveInfinity // If `N` is exactly `PositiveInfinity`, return it directly
					: SeparateNegatives<N> extends [infer Pos extends number, infer Neg extends number]
						? IsNever<Neg> extends true
							// If `N` only contains positive numbers, directly compute the minimum using `_UnionMin`
							? _UnionMin<Pos>
							// If `N` contains negative numbers, reverse their sign and compute a maximum,
							// since among negative values, the one with the largest absolute magnitude is the smallest
							: ReverseSign<_UnionMax<ReverseSign<Neg>>>
						: never;

/**
Core type of `UnionMin`.

Iterates by growing tuple `T` until its length matches any member of `N`, returning the smallest value in the union.
*/
type _UnionMin<N extends number, T extends UnknownArray = []> =
	T['length'] extends N
		? T['length']
		: _UnionMin<N, [...T, unknown]>;

/**
Returns the maximum number in the given union of numbers.

Note: Just supports numbers from -999 to 999.

@example
```
type T1 = UnionMax<1 | 2 | 3>;
//=> 3

type T2 = UnionMax<-1 | -2 | -3>;
//=> -1

type T3 = UnionMax<-1 | 0 | 1>;
//=> 1

type T4 = UnionMax<NegativeInfinity | -1 | 1>;
//=> 1

type T5 = UnionMax<-1 | 1 | PositiveInfinity>;
//=> PositiveInfinity

type T6 = UnionMax<number>;
//=> number
```
*/
export type UnionMax<N extends number> =
	IsAnyOrNever<N> extends true ? N // Handles `any/never`
		: number extends N ? number // If `N` is the wide `number` type, we cannot infer a literal maximum
			: PositiveInfinity extends N ? PositiveInfinity // If `PositiveInfinity` is present, it dominates any finite number
				: [N] extends [NegativeInfinity] ? NegativeInfinity // If `N` is exactly `NegativeInfinity`, return it directly
					: SeparateNegatives<N> extends [infer Pos extends number, infer Neg extends number]
						? IsNever<Pos> extends true
							// If `N` only contains negative numbers, reverse their sign and compute a minimum,
							// since among negative values, the one with the smallest absolute magnitude is the largest
							? ReverseSign<_UnionMin<ReverseSign<Neg>>>
							// If `N` contains positive numbers, directly compute the maximum using `_UnionMax`
							: _UnionMax<Pos>
						: never;

/**
Core type of `UnionMax`.

Iterates by growing tuple `T` until its length matches and removes all members of `N`, leaving the final length as the maximum value in the union.
*/
type _UnionMax<N extends number, T extends UnknownArray = []> =
	IsNever<N> extends true
		? T['length']
		: T['length'] extends N
			? _UnionMax<Exclude<N, T['length']>, T>
			: _UnionMax<N, [...T, unknown]>;

/**
Returns the number with reversed sign.

@example
```
type T1 = ReverseSign<-1>;
//=> 1

type T2 = ReverseSign<1>;
//=> -1

type T3 = ReverseSign<-1n>;
//=> 1n

type T4 = ReverseSign<1n>;
//=> -1n

type T5 = ReverseSign<NegativeInfinity>;
//=> Infinity

type T6 = ReverseSign<PositiveInfinity>;
//=> -Infinity
```
*/
export type ReverseSign<N extends Numeric> =
	// Handle edge cases
	N extends Zero ? N
		: N extends PositiveInfinity ? NegativeInfinity
			: N extends NegativeInfinity ? PositiveInfinity
				: (
					`${N}` extends `-${infer P}` ? P // Handle negative numbers
						: `-${N}` extends `${infer R}` ? R // Handle positive numbers
							: never
				) extends infer Result extends string
					? N extends bigint
						? ToBigint<Result>
						: ToNumber<Result>
					: never;

/**
Split a union of positive and negative number into a tuple in the form of `[Positives, Negatives]`

@example
```
type T1 = SeparateNegatives<-1 | 2 | 4 | -5>;
//=> [4 | 2, -1 | -5]

type T2 = SeparateNegatives<PositiveInfinity | NegativeInfinity | 0 | -1>;
//=> [0 | PositiveInfinity, NegativeInfinity | -1]

type T3 = SeparateNegatives<1 | 4>;
//=> [4 | 1, never]
```
*/
export type SeparateNegatives<N extends Numeric> =
	IsAnyOrNever<N> extends true ? N
		: Negative<N> extends infer Negatives // Extract negative numbers
			? [Exclude<N, Negatives>, Negatives] // Extract positive numbers and return them both in a tuple
			: never;

/**
Split a float number into a tuple in the form of `[Integer number, Decimal string]`

@example
```
type T1 = SplitFloat<1.2>;
//=> [1, '2']

type T2 = SplitFloat<-2.005>;
//=> [-2, '005']
```
*/
export type SplitFloat<N extends number> =
	`${N}` extends `${infer Int extends number}.${infer Dec}`
		? `${N}` extends `-0${string}`
			? [0, Dec] // Special-case negative zero: preserve the decimal digits but coerce the integer part to `0`
			: [Int, Dec] // Normal case: return the inferred integer and decimal parts
		: [N, '0']; // If no decimal exists, return the number with a decimal of `0`

/**
Converts a numeric type to a number.

@example
```
type T1 = ToNumber<'1234'>;
//=> 1234

type T2 = ToNumber<-1234n>;
//=> -1234

type T3 = ToNumber<'1234.56'>;
//=> 1234.56

type T4 = ToNumber<true>;
//=> 1

type T5 = ToNumber<false>;
//=> 0

type T6 = ToNumber<'Infinity'>;
//=> Infinity

type T7 = ToNumber<'-Infinity'>;
//=> -Infinity
```

@see {@link ToBigint}
@category Numeric
*/
export type ToNumber<T extends Numeric | string | boolean> =
	`${T}` extends `${infer F}${infer R}`
		? F extends '0' ? ToNumber<R> // Prevent returning `number` when preceding `T` with 0, (e.g, '00123' -> 123)
			: `${T}` extends `${infer N extends number}` ? N // For number strings (e.g, '123' -> 123)
				: `${T}` extends `${infer B extends number}n` ? B // For bigint strings (e.g, '123n' -> 123)
					: `${T}` extends 'Infinity' ? PositiveInfinity
						: `${T}` extends '-Infinity' ? NegativeInfinity
							: T extends boolean ? {true: 1; false: 0}[`${T}`] // For boolean (e.g, true -> 1)
								: never // Not a numeric convertible type
		: string extends T ? never : 0; // `Number('')` returns `0`

/**
Converts a numeric type to a bigint.

@example
```
type T1 = ToBigint<'1234'>;
//=> 1234n

type T2 = ToBigint<-1234n>;
//=> -1234n

type T3 = ToBigint<'1234.56'>;
//=> 1234n

type T4 = ToBigint<true>;
//=> 1n

type T5 = ToBigint<false>;
//=> 0n
```

@see {@link ToNumber}
@category Numeric
*/
// TODO: push `Round` type branch for review, and replace here.
export type ToBigint<N extends Numeric | string | boolean> =
	`${SplitFloat<ToNumber<N>>[0]}` extends `${infer B extends bigint}` ? B : never;

export {};
