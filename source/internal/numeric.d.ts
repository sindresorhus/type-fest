import type {NegativeInfinity, PositiveInfinity} from '../numeric.d.ts';
import type {IfNotAnyOrNever} from './type.d.ts';

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
	IfNotAnyOrNever<N, {
		ifNot: N extends number | `${number}`
			? true
			: false;
		ifAny: boolean;
		ifNever: false;
	}>;

/**
Returns the number with reversed sign.

@example
```
type A = ReverseSign<-1>;
//=> 1

type B = ReverseSign<1>;
//=> -1

type C = ReverseSign<NegativeInfinity>;
//=> PositiveInfinity

type D = ReverseSign<PositiveInfinity>;
//=> NegativeInfinity
```
*/
export type ReverseSign<N extends number> =
	// Handle edge cases
	N extends 0
		? 0
		: N extends PositiveInfinity
			? NegativeInfinity
			: N extends NegativeInfinity
				? PositiveInfinity
				// Handle negative numbers
				: `${N}` extends `-${infer P extends number}`
					? P
					// Handle positive numbers
					: `-${N}` extends `${infer R extends number}`
						? R
						: never;

export {};
