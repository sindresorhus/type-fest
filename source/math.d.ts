import type {NumberAbsolute, BuildTuple, And, Or, ArrayMax, ArrayMin, PositiveNumericStringGt} from './internal';
import type {IsEqual} from './is-equal';

export type Numeric = number | bigint;

type Zero = 0 | 0n;

/**
Matches the hidden `Infinity` type.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/32277) if you want to have this type as a built-in in TypeScript.

@see NegativeInfinity

@category Numeric
*/
// See https://github.com/microsoft/TypeScript/issues/31752
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
export type PositiveInfinity = 1e999;

/**
Matches the hidden `-Infinity` type.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/32277) if you want to have this type as a built-in in TypeScript.

@see PositiveInfinity

@category Numeric
*/
// See https://github.com/microsoft/TypeScript/issues/31752
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
export type NegativeInfinity = -1e999;

/**
A finite `number`.
You can't pass a `bigint` as they are already guaranteed to be finite.

Use-case: Validating and documenting parameters.

Note: This can't detect `NaN`, please upvote [this issue](https://github.com/microsoft/TypeScript/issues/28682) if you want to have this type as a built-in in TypeScript.

@example
```
import type {Finite} from 'type-fest';

declare function setScore<T extends number>(length: Finite<T>): void;
```

@category Numeric
*/
export type Finite<T extends number> = T extends PositiveInfinity | NegativeInfinity ? never : T;

/**
A `number` that is an integer.
You can't pass a `bigint` as they are already guaranteed to be integers.

Use-case: Validating and documenting parameters.

@example
```
import type {Integer} from 'type-fest';

declare function setYear<T extends number>(length: Integer<T>): void;
```

@see NegativeInteger
@see NonNegativeInteger

@category Numeric
*/
// `${bigint}` is a type that matches a valid bigint literal without the `n` (ex. 1, 0b1, 0o1, 0x1)
// Because T is a number and not a string we can effectively use this to filter out any numbers containing decimal points
export type Integer<T extends number> = `${T}` extends `${bigint}` ? T : never;

/**
A `number` that is not an integer.
You can't pass a `bigint` as they are already guaranteed to be integers.

Use-case: Validating and documenting parameters.

@example
```
import type {Float} from 'type-fest';

declare function setPercentage<T extends number>(length: Float<T>): void;
```

@see Integer

@category Numeric
*/
export type Float<T extends number> = T extends Integer<T> ? never : T;

/**
A negative (`-∞ < x < 0`) `number` that is not an integer.
Equivalent to `Negative<Float<T>>`.

Use-case: Validating and documenting parameters.

@see Negative
@see Float

@category Numeric
*/
export type NegativeFloat<T extends number> = Negative<Float<T>>;

/**
A negative `number`/`bigint` (`-∞ < x < 0`)

Use-case: Validating and documenting parameters.

@see NegativeInteger
@see NonNegative

@category Numeric
*/
export type Negative<T extends Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never;

/**
Returns a boolean for whether the given number `T` is a negative number.

@see Negative

@category Numeric
 */
export type IsNegative<T extends Numeric> = T extends Negative<T> ? true : false;

/**
A negative (`-∞ < x < 0`) `number` that is an integer.
Equivalent to `Negative<Integer<T>>`.

You can't pass a `bigint` as they are already guaranteed to be integers, instead use `Negative<T>`.

Use-case: Validating and documenting parameters.

@see Negative
@see Integer

@category Numeric
*/
export type NegativeInteger<T extends number> = Negative<Integer<T>>;

/**
A non-negative `number`/`bigint` (`0 <= x < ∞`).

Use-case: Validating and documenting parameters.

@see NonNegativeInteger
@see Negative

@example
```
import type {NonNegative} from 'type-fest';

declare function setLength<T extends number>(length: NonNegative<T>): void;
```

@category Numeric
*/
export type NonNegative<T extends Numeric> = T extends Zero ? T : Negative<T> extends never ? T : never;

/**
A non-negative (`0 <= x < ∞`) `number` that is an integer.
Equivalent to `NonNegative<Integer<T>>`.

You can't pass a `bigint` as they are already guaranteed to be integers, instead use `NonNegative<T>`.

Use-case: Validating and documenting parameters.

@see NonNegative
@see Integer

@example
```
import type {NonNegativeInteger} from 'type-fest';

declare function setLength<T extends number>(length: NonNegativeInteger<T>): void;
```

@category Numeric
*/
export type NonNegativeInteger<T extends number> = NonNegative<Integer<T>>;

/**
Return the result of `A + B`
Note:
- A or B can only support `-999` ~ `999`.
- if the result is negative, you can only get `number`.
@example
```
Add<111, 222>
//=> 333
Add<-111, 222>
//=> 111
Add<111, -222>
//=> number
Add<PositiveInfinity, -9999>
//=> PositiveInfinity
Add<PositiveInfinity, NegativeInfinity>
//=> number
```

@category Numeric
*/
// TODO: Support big integer and negative number.
export type Add<A extends number, B extends number> = [
	IsEqual<A, PositiveInfinity>, IsEqual<A, NegativeInfinity>,
	IsEqual<B, PositiveInfinity>, IsEqual<B, NegativeInfinity>,
] extends infer R extends [boolean, boolean, boolean, boolean]
	? Or<
	And<IsEqual<R[0], true>, IsEqual<R[3], false>>,
	And<IsEqual<R[2], true>, IsEqual<R[1], false>>
	> extends true
		? PositiveInfinity
		: Or<
		And<IsEqual<R[1], true>, IsEqual<R[2], false>>,
		And<IsEqual<R[3], true>, IsEqual<R[0], false>>
		> extends true
			? NegativeInfinity
			: true extends R[number]
				? number
				: ([IsNegative<A>, IsNegative<B>] extends infer R
					? [false, false] extends R
						? [...BuildTuple<A>, ...BuildTuple<B>]['length']
						: [true, true] extends R
							? number
							: ArrayMax<[NumberAbsolute<A>, NumberAbsolute<B>]> extends infer Max_
								? ArrayMin<[NumberAbsolute<A>, NumberAbsolute<B>]> extends infer Min_ extends number
									? Max_ extends A | B
										? Subtract<Max_, Min_>
										: number
									: never
								: never
					: never) & number
	: never;

/**
Return the result of `A - B`.

Note:
- A or B can only support `-999` ~ `999`.
- if the result is negative, you can only get `number`.

@example
```
Subtract<333, 222>
//=> 111

Subtract<111, -222>
//=> 333

Subtract<-111, 222>
//=> number

Subtract<PositiveInfinity, 9999>
//=> PositiveInfinity

Subtract<PositiveInfinity, PositiveInfinity>
//=> number
```

@category Numeric
 */
// TODO: Support big integer and negative number.
export type Subtract<A extends number, B extends number> = [
	IsEqual<A, PositiveInfinity>, IsEqual<A, NegativeInfinity>,
	IsEqual<B, PositiveInfinity>, IsEqual<B, NegativeInfinity>,
] extends infer R extends [boolean, boolean, boolean, boolean]
	? Or<
	And<IsEqual<R[0], true>, IsEqual<R[2], false>>,
	And<IsEqual<R[3], true>, IsEqual<R[1], false>>
	> extends true
		? PositiveInfinity
		: Or<
		And<IsEqual<R[1], true>, IsEqual<R[3], false>>,
		And<IsEqual<R[2], true>, IsEqual<R[0], false>>
		> extends true
			? NegativeInfinity
			: true extends R[number]
				? number
				: [IsNegative<A>, IsNegative<B>] extends infer R
					? [false, false] extends R
						? BuildTuple<A> extends infer R
							? R extends [...BuildTuple<B>, ...infer R]
								? R['length']
								: number
							: never
						: Lt<A, B> extends true
							? number
							: [false, true] extends R
								? Add<A, NumberAbsolute<B>>
								: Subtract<NumberAbsolute<B>, NumberAbsolute<A>>
					: never
	: never;

/**
Returns a boolean for whether A > B.

@example
```
Gt<1, -5>
//=> true

Gt<1, 1>
//=> false

Gt<1, 5>
//=> false
```
*/
export type Gt<A extends number, B extends number> = number extends A | B
	? boolean
	: [
		IsEqual<A, PositiveInfinity>, IsEqual<A, NegativeInfinity>,
		IsEqual<B, PositiveInfinity>, IsEqual<B, NegativeInfinity>,
	] extends infer R extends [boolean, boolean, boolean, boolean]
		? Or<
		And<IsEqual<R[0], true>, IsEqual<R[2], false>>,
		And<IsEqual<R[3], true>, IsEqual<R[1], false>>
		> extends true
			? true
			: Or<
			And<IsEqual<R[1], true>, IsEqual<R[3], false>>,
			And<IsEqual<R[2], true>, IsEqual<R[0], false>>
			> extends true
				? false
				: true extends R[number]
					? false
					: [IsNegative<A>, IsNegative<B>] extends infer R extends [boolean, boolean]
						? [true, false] extends R
							? false
							: [false, true] extends R
								? true
								: [false, false] extends R
									? PositiveNumericStringGt<`${A}`, `${B}`>
									: PositiveNumericStringGt<`${NumberAbsolute<B>}`, `${NumberAbsolute<A>}`>
						: never
		: never;

/**
Returns a boolean for whether A >= B.

@example
```
Gte<1, -5>
//=> true

Gte<1, 1>
//=> true

Gte<1, 5>
//=> false
```
*/
export type Gte<A extends number, B extends number> = number extends A | B
	? boolean
	: A extends B ? true : Gt<A, B>;

/**
Returns a boolean for whether A < B.

@example
```
Lt<1, -5>
//=> false

Lt<1, 1>
//=> false

Lt<1, 5>
//=> true
```
*/

export type Lt<A extends number, B extends number> = number extends A | B
	? boolean
	: Gte<A, B> extends true ? false : true;

/**
Returns a boolean for whether A <= B.

@example
```
Lte<1, -5>
//=> false

Lte<1, 1>
//=> true

Lte<1, 5>
//=> true
```
*/
export type Lte<A extends number, B extends number> = number extends A | B
	? boolean
	: Gt<A, B> extends true ? false : true;
