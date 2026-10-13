import type {ReverseSign, NonNegativeIntegerSum, NonNegativeIntegerDifference} from './internal/index.d.ts';
import type {PositiveInfinity, NegativeInfinity, IsNegative} from './numeric.d.ts';
import type {LessThan} from './less-than.d.ts';
import type {Absolute} from './absolute.d.ts';

/**
Returns the difference between two numbers.

Note:
- The result is exact while A and B are within `Number.MAX_SAFE_INTEGER`. A larger number is already rounded, so the result can then be `number` or a literal that differs from what JavaScript computes.
- A or B must be written without a decimal point or exponent. Such a value resolves to `never` rather than a silently truncated whole number. A union that mixes both kinds is not caught.

@example
```
import type {Subtract, PositiveInfinity} from 'type-fest';

type A = Subtract<333, 222>;
//=> 111

type B = Subtract<111, -222>;
//=> 333

type C = Subtract<-111, 222>;
//=> -333

type D = Subtract<18, 96>;
//=> -78

type E = Subtract<PositiveInfinity, 9999>;
//=> Infinity

type F = Subtract<PositiveInfinity, PositiveInfinity>;
//=> number

type G = Subtract<1_000_000, 1>;
//=> 999999
```

@category Numeric
*/
export type Subtract<A extends number, B extends number> =
	// A decimal fraction or exponent notation is not supported, so the result is `never` rather than a silently truncated whole number.
	`${A}|${B}` extends `${string}${'.' | 'e'}${string}` ? never : _Subtract<A, B>;

type _Subtract<A extends number, B extends number> =
	// Handle cases when A or B is the actual "number" type
	number extends A | B ? number
		// Handle cases when A and B are both +/- infinity
		: A extends B & (PositiveInfinity | NegativeInfinity) ? number
			// Handle cases when A is - infinity or B is + infinity
			: A extends NegativeInfinity ? NegativeInfinity : B extends PositiveInfinity ? NegativeInfinity
				// Handle cases when A is + infinity or B is - infinity
				: A extends PositiveInfinity ? PositiveInfinity : B extends NegativeInfinity ? PositiveInfinity
					// Handle case when numbers are equal to each other
					: A extends B ? 0
						// Handle cases when A or B is 0
						: A extends 0 ? ReverseSign<B> : B extends 0 ? A
							// Handle remaining regular cases
							: SubtractPostChecks<A, B>;

/**
Subtracts two numbers A and B, such that they are not equal and neither of them are 0, +/- infinity or the `number` type
*/
type SubtractPostChecks<A extends number, B extends number, AreNegative = [IsNegative<A>, IsNegative<B>]> =
	AreNegative extends [false, false]
		? SubtractPositives<A, B>
		: AreNegative extends [true, true]
			// When both numbers are negative we subtract the absolute values and then reverse the sign
			? ReverseSign<SubtractPositives<Absolute<A>, Absolute<B>>>
			// When the signs are different we can add the absolute values and then reverse the sign if A < B
			: NonNegativeIntegerSum<Absolute<A>, Absolute<B>> extends infer R extends number
				? LessThan<A, B> extends true ? ReverseSign<R> : R
				: never;

/**
Subtracts two positive numbers.
*/
type SubtractPositives<A extends number, B extends number> =
	LessThan<A, B> extends true
		// When A < B we can reverse the result of B - A
		? ReverseSign<NonNegativeIntegerDifference<B, A>>
		: NonNegativeIntegerDifference<A, B>;

export {};
