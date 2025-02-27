import type {NumberAbsolute, BuildTuple, ReverseSign} from './internal';
import type {PositiveInfinity, NegativeInfinity, IsNegative} from './numeric';
import type {LessThan} from './less-than';
import type {Sum} from './sum';

/**
Returns the difference between two numbers.

Note:
- A or B can only support `-999` ~ `999`.

@example
```
import type {Subtract} from 'type-fest';

Subtract<333, 222>;
//=> 111

Subtract<111, -222>;
//=> 333

Subtract<-111, 222>;
//=> -333

Subtract<18, 96>;
//=> -78

Subtract<PositiveInfinity, 9999>;
//=> PositiveInfinity

Subtract<PositiveInfinity, PositiveInfinity>;
//=> number
```

@category Numeric
*/
// TODO: Support big integer.
export type Subtract<A extends number, B extends number> =
	// Handle cases when A or B is the actual "number" type
	number extends A | B ? number
		// Handle cases when A and B are both +/- infinity
		: A extends B & (PositiveInfinity | NegativeInfinity) ? number
			// Handle cases when A is - infinity
			: A extends NegativeInfinity ? NegativeInfinity
				// Handle cases when A is + infinity or B is - infinity
				: A extends PositiveInfinity ? PositiveInfinity : B extends NegativeInfinity ? PositiveInfinity
					// Handle case when numbers are equal to each other
					: A extends B ? 0
						// Handle cases when A or B is 0
						: A extends 0 ? ReverseSign<B> : B extends 0 ? A
							// Handle remaining regular cases
							: SubtractPostChecks<A, B>;

// When we get here, A and B are not equal and neither are the "number" type, +/- infinity or 0
type SubtractPostChecks<A extends number, B extends number, AreNegative = [IsNegative<A>, IsNegative<B>]> =
	AreNegative extends [false, false]
		? LessThan<A, B> extends true
			// When A < B we can reverse the result of B - A
			? ReverseSign<SubtractPostChecks<B, A>>
			// Both numbers are positive and A > B - this is where we always want to end up and do the actual subtraction
			: BuildTuple<A> extends [...BuildTuple<B>, ...infer R]
				? R['length']
				: never
		: AreNegative extends [true, true]
			// When both numbers are negative we can reverse the subtraction result of the absolute values
			? ReverseSign<SubtractPostChecks<NumberAbsolute<A>, NumberAbsolute<B>>>
			: AreNegative extends [false, true]
				// When B is negative we can use the sum of absolute values
				? Sum<A, NumberAbsolute<B>>
				// When A is negative we can reverse the sum of absolute values
				: ReverseSign<Sum<NumberAbsolute<A>, B>>;
