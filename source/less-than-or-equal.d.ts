import type {GreaterThan} from './greater-than.d.ts';

/**
 Returns a boolean for whether a given number is less than or equal to another number.

@example
```
import type {LessThanOrEqual} from 'type-fest';

type A = LessThanOrEqual<1, -5>;
//=> false

type B = LessThanOrEqual<1, 1>;
//=> true

type C = LessThanOrEqual<1, 5>;
//=> true
```
*/
export type LessThanOrEqual<A extends number, B extends number> = number extends A | B
	? never
	: GreaterThan<A, B> extends true ? false : true;

export {};
