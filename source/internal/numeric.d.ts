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

Note: Just supports numbers from 0 to 999.

@example
```
type T1 = UnionMax<1 | 2 | 3>;
//=> 1

type T2 = UnionMax<-1 | -2 | -3>
//=> -3

type T3 = UnionMax<-1 | 0 | 1>
//=> -1

type T4 = UnionMax<NegativeInfinity | -1 | 1>;
//=> NegativeInfinity

type T5 = UnionMax<-1 | 1 | PositiveInfinity>;
//=> -1

type T6 = UnionMax<number>;
//=> number
```
*/
export type UnionMin<N extends number> =
	IsAnyOrNever<N> extends true ? N
		: number extends N ? number
			: NegativeInfinity extends N ? NegativeInfinity
				: [N] extends [PositiveInfinity] ? PositiveInfinity
					: SeparateNegatives<N> extends [infer Pos extends number, infer Neg extends number]
						? IsNever<Neg> extends true
							? _UnionMin<Pos>
							: ReverseSign<_UnionMax<ReverseSign<Neg>>>
						: never;

/**
The actual implementation of `UnionMin`. It's private because it has some arguments that don't need to be exposed.
*/
type _UnionMin<N extends number, T extends UnknownArray = []> =
	T['length'] extends N
		? T['length']
		: _UnionMin<N, [...T, unknown]>;

/**
Returns the maximum number in the given union of numbers.

Note: Just supports numbers from 0 to 999.

@example
```
type T1 = UnionMax<1 | 2 | 3>;
//=> 3

type T2 = UnionMax<-1 | -2 | -3>
//=> -1

type T3 = UnionMax<-1 | 0 | 1>
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
	IsAnyOrNever<N> extends true ? N
		: number extends N ? number
			: PositiveInfinity extends N ? PositiveInfinity
				: [N] extends [NegativeInfinity] ? NegativeInfinity
					: SeparateNegatives<N> extends [infer Pos extends number, infer Neg extends number]
						? IsNever<Pos> extends true
							? ReverseSign<_UnionMin<ReverseSign<Neg>>>
							: _UnionMax<Pos>
						: never;

/**
The actual implementation of `UnionMax`. It's private because it has some arguments that don't need to be exposed.
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

type T5 = ReverseSign<NegativeInfinity>
//=> Infinity

type T6 = ReverseSign<PositiveInfinity>
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
Split a union of positive and negative number into a tuple in the form of `[Negatives, Positives]`

@example
```
type T1 = SeparateNegatives<-1 | 2 | 4 | -5>
//=> [4 | 2, -1 | -5]

type T2 = SeparateNegatives<PositiveInfinity | NegativeInfinity | 0 | -1>
//=> [0 | PositiveInfinity, NegativeInfinity | -1]

type T3 = SeparateNegatives<1 | 4>
//=> [4 | 1, never]
```
*/
export type SeparateNegatives<N extends Numeric> =
	IsAnyOrNever<N> extends true ? N
		: Negative<N> extends infer Negatives
			? [Exclude<N, Negatives>, Negatives]
			: never;

export type SplitFloat<N extends Numeric> =
	`${N}` extends `${infer Int extends number}.${infer Dec}`
		? [Int, Dec]
		: [N, '0'];

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
		? F extends '0' ? ToNumber<R> // Prevent returning `number` when preseding `T` with 0, (e.g, '00123' -> 123)
			: `${T}` extends `${infer N extends number}` ? N // For number strings (e.g, '123' -> 123)
				: `${T}` extends `${infer B extends number}n` ? B // For bigint strings (e.g, '123n' -> 123)
					: `${T}` extends 'Infinity' ? PositiveInfinity
						: `${T}` extends '-Infinity' ? NegativeInfinity
							: T extends boolean ? {true: 1; false: 0}[`${T}`] // For boolean (e.g, true -> 1)
								: never // Not a numeric convertable type
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
