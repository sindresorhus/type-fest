import type {NumberAbsolute, BuildTuple, NegateNumber} from './internal';
import type {PositiveInfinity, NegativeInfinity, IsNegative} from './numeric';
import type {LessThan} from './less-than';
import type {Sum} from './sum';
import type {IsEqual} from './is-equal';
import type {Or} from './or';

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
	Or<IsEqual<A, number>, IsEqual<B, number>> extends true ? number
		// Handle cases when A and B are both +/- infinity
		: A extends B & (PositiveInfinity | NegativeInfinity) ? number
			// Handle cases when A is - infinity
			: A extends NegativeInfinity ? NegativeInfinity
				// Handle cases when A is + infinity or B is - infinity
				: Or<IsEqual<A, PositiveInfinity>, IsEqual<B, NegativeInfinity>> extends true ? PositiveInfinity
					// Handle case when numbers are equal to each other
					: A extends B ? 0
						// Handle cases when A or B is 0
						: A extends 0 ? NegateNumber<B> : B extends 0 ? A
							// Handle remaining regular cases
							: SubtractPostChecks<A, B>;

type SubtractPostChecks<A extends number, B extends number> =
	IsNegative<A> extends IsNegative<B> & false
		? LessThan<B, A> extends true
			// Both numbers are positive and A > B - this is where we always want to end up and do the actual subtraction
			? BuildTuple<A> extends [...BuildTuple<B>, ...infer R]
				? R['length']
				: never
			: NegateNumber<SubtractPostChecks<B, A>> // When B > A we can negate the result of the B - A
		: IsNegative<A> extends IsNegative<B> & true
			// When both numbers are negative we can negate the subtraction result of the absolute values
			? NegateNumber<SubtractPostChecks<NumberAbsolute<A>, NumberAbsolute<B>>>
			: IsNegative<B> extends true
				// When B is negative we can use the sum of absolute values
				? Sum<A, NumberAbsolute<B>>
				// When A is negative we can negate the sum of absolute values
				: NegateNumber<Sum<NumberAbsolute<A>, B>>;
