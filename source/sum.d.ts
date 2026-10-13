import type {TupleMax, ReverseSign, NonNegativeIntegerSum} from './internal/index.d.ts';
import type {PositiveInfinity, NegativeInfinity, IsNegative} from './numeric.d.ts';
import type {Subtract} from './subtract.d.ts';
import type {Absolute} from './absolute.d.ts';

/**
Returns the sum of two numbers.

Note:
- The result is exact while A and B are within `Number.MAX_SAFE_INTEGER`. A larger number is already rounded, so the result can then be `number` or a literal that differs from what JavaScript computes.
- A or B must be written without a decimal point or exponent. Such a value resolves to `never` rather than a silently truncated whole number. A union that mixes both kinds is not caught.

@example
```
import type {Sum, PositiveInfinity, NegativeInfinity} from 'type-fest';

type A = Sum<111, 222>;
//=> 333

type B = Sum<-111, 222>;
//=> 111

type C = Sum<111, -222>;
//=> -111

type D = Sum<PositiveInfinity, -9999>;
//=> Infinity

type E = Sum<PositiveInfinity, NegativeInfinity>;
//=> number

type F = Sum<999_999, 1>;
//=> 1000000
```

@category Numeric
*/
export type Sum<A extends number, B extends number> =
	// A decimal fraction or exponent notation is not supported, so the result is `never` rather than a silently truncated whole number.
	`${A}|${B}` extends `${string}${'.' | 'e'}${string}` ? never : _Sum<A, B>;

type _Sum<A extends number, B extends number> =
	// Handle cases when A or B is the actual "number" type
	number extends A | B ? number
		// Handle cases when A and B are both +/- infinity
		: A extends B & (PositiveInfinity | NegativeInfinity) ? A // A or B could be used here as they are equal
			// Handle cases when A and B are opposite infinities
			: A | B extends PositiveInfinity | NegativeInfinity ? number
				// Handle cases when A is +/- infinity
				: A extends PositiveInfinity | NegativeInfinity ? A
					// Handle cases when B is +/- infinity
					: B extends PositiveInfinity | NegativeInfinity ? B
						// Handle cases when A or B is 0 or it's the same number with different signs
						: A extends 0 ? B : B extends 0 ? A : A extends ReverseSign<B> ? 0
							// Handle remaining regular cases
							: SumPostChecks<A, B>;

/**
Adds two numbers A and B, such that they are not equal with different signs and neither of them are 0, +/- infinity or the `number` type
*/
type SumPostChecks<A extends number, B extends number, AreNegative = [IsNegative<A>, IsNegative<B>]> =
	AreNegative extends [false, false]
		// When both numbers are positive we can add them together
		? NonNegativeIntegerSum<A, B>
		: AreNegative extends [true, true]
			// When both numbers are negative we add the absolute values and then reverse the sign
			? ReverseSign<NonNegativeIntegerSum<Absolute<A>, Absolute<B>>>
			// When the signs are different we can subtract the absolute values, remove the sign
			// and then reverse the sign if the larger absolute value is negative
			: Absolute<Subtract<Absolute<A>, Absolute<B>>> extends infer Result extends number
				? TupleMax<[Absolute<A>, Absolute<B>]> extends infer Max_ extends number
					? Max_ extends A | B
						// The larger absolute value is positive, so the result is positive
						? Result
						// The larger absolute value is negative, so the result is negative
						: ReverseSign<Result>
					: never
				: never;

export {};
