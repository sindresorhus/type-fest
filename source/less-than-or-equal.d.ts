import type {GreaterThan} from './greater-than.d.ts';
import type {_Numeric} from './numeric.d.ts';

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

type D = LessThanOrEqual<5n, 5>;
//=> true
```

Note: If either argument is the non-literal `number` or `bigint` type, the result is `boolean`.

Note: If both arguments are written in exponential notation with an exponent of the same sign (both `1e+21` and above, or both with a negative exponent like `1e-7`), or one is a `bigint` and the other is `1e+21` or above (or `-1e+21` or below), the result is `boolean` too, because such numbers cannot be compared digit by digit. Any other comparison with a number in exponential notation is still decided.

Note: A `number` above `Number.MAX_SAFE_INTEGER` is compared with a `bigint` by its printed digits, not its exact value. For example, `123456789012345680000` is really `123456789012345683968`, so comparing it with `123456789012345680000n` treats them as equal.

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
