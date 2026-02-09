import type {GreaterThanOrEqual} from './greater-than-or-equal.d.ts';

/**
Returns a boolean for whether a given number is less than another number.

@example
```
import type {LessThan} from 'type-fest';

type A = LessThan<1, -5>;
//=> false

type B = LessThan<1, 1>;
//=> false

type C = LessThan<1, 5>;
//=> true
```

Note: If either argument is the non-literal `number` type, the result is `boolean`.

@example
```
import type {LessThan} from 'type-fest';

type A = LessThan<number, 1>;
//=> boolean

type B = LessThan<1, number>;
//=> boolean

type C = LessThan<number, number>;
//=> boolean
```
*/
export type LessThan<A extends number, B extends number> =
	GreaterThanOrEqual<A, B> extends infer Result
		? Result extends true
			? false
			: true
		: never; // Should never happen

export {};
