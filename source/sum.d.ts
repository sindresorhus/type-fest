import type {NumberAbsolute, BuildTuple, TupleMax, TupleMin} from './internal';
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
						// Handle cases when A or B is 0
						: A extends 0 ? B : B extends 0 ? A
							// Handle remaining regular cases
							: SumPostChecks<A, B>;

/**
Adds two numbers A and B, such that they are not equal and neither of them are 0, +/- infinity or the `number` type
*/
type SumPostChecks<A extends number, B extends number, AreNegative = [IsNegative<A>, IsNegative<B>]> =
	[false, false] extends AreNegative
		? [...BuildTuple<A>, ...BuildTuple<B>]['length']
		: [true, true] extends AreNegative
			? number
			: TupleMax<[NumberAbsolute<A>, NumberAbsolute<B>]> extends infer Max_
				? TupleMin<[NumberAbsolute<A>, NumberAbsolute<B>]> extends infer Min_ extends number
					? Max_ extends A | B
						? Subtract<Max_, Min_>
						: number
					: never
				: never;
