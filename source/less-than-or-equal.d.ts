import type {GreaterThan} from './greater-than.d.ts';
import type {_Numeric} from './numeric.d.ts';

/**
Returns a boolean for whether a given integer is less than or equal to another integer.

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

@example
```
import type {LessThanOrEqual} from 'type-fest';

// Use `LessThanOrEqual` to constrain a function parameter to non-positive numbers.
declare function setNonPositive<N extends number>(value: LessThanOrEqual<N, 0> extends true ? N : never): void;

setNonPositive(0); // ✅ Allowed
setNonPositive(-1); // ✅ Allowed

// @ts-expect-error
setNonPositive(1);

// @ts-expect-error
setNonPositive(2);
```
*/
export type LessThanOrEqual<A extends _Numeric, B extends _Numeric> =
	GreaterThan<A, B> extends infer Result
		? Result extends true
			? false
			: true
		: never; // Should never happen

export {};
