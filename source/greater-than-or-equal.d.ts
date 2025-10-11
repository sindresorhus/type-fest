import type {GreaterThan} from './greater-than.d.ts';

/**
Returns a boolean for whether a given number is greater than or equal to another number.

@example
```
import type {GreaterThanOrEqual} from 'type-fest';

type A = GreaterThanOrEqual<1, -5>;
//=> true

type B = GreaterThanOrEqual<1, 1>;
//=> true

type C = GreaterThanOrEqual<1, 5>;
//=> false
```
*/
export type GreaterThanOrEqual<A extends number, B extends number> = number extends A | B
	? never
	: A extends B ? true : GreaterThan<A, B>;

export {};
