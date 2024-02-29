import type {NumberAbsolute, BuildTuple, And, Or, ArrayMax, ArrayMin, PositiveNumericStringGt} from './internal';
import type {IsEqual} from './is-equal';
import type {PositiveInfinity, NegativeInfinity, IsNegative} from './numeric';

/**
Returns the sum of the two input numbers.

Note:
- A or B can only support `-999` ~ `999`.
- A and B can only be small integers(less than 1000).
- if the result is negative, you can only get `number`.

@example
```
import type {Add} from 'type-fest';

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
Returns the difference between two input numbers.

Note:
- A or B can only support `-999` ~ `999`.
- if the result is negative, you can only get `number`.

@example
```
import type {Subtract} from 'type-fest';

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
	? never
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
	? never
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
	? never
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
	? never
	: Gt<A, B> extends true ? false : true;
