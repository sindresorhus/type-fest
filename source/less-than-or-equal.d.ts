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

Note: If either argument is the non-literal `number` type, the result is `boolean`.

@example
```
import type {LessThanOrEqual} from 'type-fest';

type A = LessThanOrEqual<number, 1>;
//=> boolean

type B = LessThanOrEqual<1, number>;
//=> boolean

type C = LessThanOrEqual<number, number>;
//=> boolean
```
*/
export type LessThanOrEqual<A extends number, B extends number> =
	GreaterThan<A, B> extends infer Result
		? Result extends true
			? false
			: true
		: never; // Should never happen

export {};
