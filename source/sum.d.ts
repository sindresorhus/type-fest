import type {NumberAbsolute, BuildTuple, TupleMax, ReverseSign} from './internal';
import type {PositiveInfinity, NegativeInfinity, IsNegative} from './numeric';
import type {Subtract} from './subtract';

/**
Returns the sum of two numbers.

Note:
- A or B can only support `-999` ~ `999`.
- A and B can only be small integers, less than 1000.
- If the result is negative, you can only get `number`.

@example
```
import type {Sum} from 'type-fest';

Sum<111, 222>;
//=> 333

Sum<-111, 222>;
//=> 111

Sum<111, -222>;
//=> number

Sum<PositiveInfinity, -9999>;
//=> PositiveInfinity

Sum<PositiveInfinity, NegativeInfinity>;
//=> number
```

@category Numeric
*/
// TODO: Support big integer and negative number.
export type Sum<A extends number, B extends number> =
	// Handle cases when A or B is the actual "number" type
	number extends A | B ? number
		// Handle cases when A and B are both +/- infinity
		: A extends B & (PositiveInfinity | NegativeInfinity) ? A // A or B could be used here as they are equal
			// Handle cases when A is - infinity
			: A extends NegativeInfinity ? B extends PositiveInfinity ? number : NegativeInfinity
				// Handle cases when A is + infinity
				: A extends PositiveInfinity ? B extends NegativeInfinity ? number : PositiveInfinity
					// Handle cases when B is +/- infinity (we know A is not +/- infinity at this point)
					: B extends PositiveInfinity | NegativeInfinity ? B
						// Handle cases when A or B is 0 or numbers have different signs
						: A extends 0 ? B : B extends 0 ? A : A extends ReverseSign<B> ? 0
							// Handle remaining regular cases
							: SumPostChecks<A, B>;

/**
Adds two numbers A and B, such that they are not equal and neither of them are 0, +/- infinity or the `number` type
*/
type SumPostChecks<A extends number, B extends number, AreNegative = [IsNegative<A>, IsNegative<B>]> =
	AreNegative extends [false, false]
		? SumPositives<A, B>
		: AreNegative extends [true, true]
			// When both numbers are negative we add the absolute values and then reverse the sign
			? ReverseSign<SumPositives<NumberAbsolute<A>, NumberAbsolute<B>>>
			// When the signs are different we can subtract the absolute values, remove the sign
			// and then reverse the sign if larger absolute value is negative
			: NumberAbsolute<Subtract<NumberAbsolute<A>, NumberAbsolute<B>>> extends infer Result extends number
				? TupleMax<[NumberAbsolute<A>, NumberAbsolute<B>]> extends infer Max_ extends number
					? Max_ extends A | B
						// The larger absolute value is positive, so the result is positive
						? Result
						// The larger absolute value is negative, so the result is negative
						: ReverseSign<Result>
					: never
				: never;

/**
Adds two positive numbers.
*/
type SumPositives<A extends number, B extends number> =
	[...BuildTuple<A>, ...BuildTuple<B>]['length'] extends infer Result extends number
		? Result
		: never;
