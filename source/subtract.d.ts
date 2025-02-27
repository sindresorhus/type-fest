import type {NumberAbsolute, BuildTuple, ReverseSign} from './internal';
import type {PositiveInfinity, NegativeInfinity, IsNegative} from './numeric';
import type {LessThan} from './less-than';

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

// When we get here, A and B are not equal and neither of them are 0, +/- infinity or the "number" type
type SubtractPostChecks<A extends number, B extends number, Depth extends number = 20, AreNegative = [IsNegative<A>, IsNegative<B>]> =
	// Depth & DepthCounter are used to prevent infinite recursion (issue on TS < 5.4.0)
	Depth extends never
		? never
		: AreNegative extends [false, false]
			? LessThan<A, B> extends true
			// When A < B we can reverse the result of B - A
				? ReverseSign<SubtractPostChecks<B, A, DepthCounter[Depth]>>
			// Both numbers are positive and A > B - this is where we always want to end up and do the actual subtraction
				: BuildTuple<A> extends [...BuildTuple<B>, ...infer R]
					? R['length']
					: never
			: AreNegative extends [true, true]
				// When both numbers are negative we subtract the absolute values and then reverse the sign
				? ReverseSign<SubtractPostChecks<NumberAbsolute<A>, NumberAbsolute<B>, DepthCounter[Depth]>>
				// When the signs are different we can add the absolute values and then reverse the sign if A < B
				: [...BuildTuple<NumberAbsolute<A>>, ...BuildTuple<NumberAbsolute<B>>] extends infer R extends unknown[]
					? LessThan<A, B> extends true ? ReverseSign<R['length']> : R['length']
					: never;

type DepthCounter = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...Array<0>];
