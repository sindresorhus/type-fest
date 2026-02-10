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

Note: If either argument is the non-literal `number` type, the result is `boolean`.

@example
```
import type {GreaterThanOrEqual} from 'type-fest';

type A = GreaterThanOrEqual<number, 1>;
//=> boolean

type B = GreaterThanOrEqual<1, number>;
//=> boolean

type C = GreaterThanOrEqual<number, number>;
//=> boolean
```
*/
export type GreaterThanOrEqual<A extends number, B extends number> = number extends A | B
	? boolean
	: A extends number // For distributing `A`
		? B extends number // For distributing `B`
			? A extends B
				? true
				: GreaterThan<A, B>
			: never // Should never happen
		: never; // Should never happen

export {};
