import type {GreaterThanOrEqual} from './greater-than-or-equal.d.ts';
import type {_Numeric} from './numeric.d.ts';

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

type D = LessThan<5n, 10>;
//=> true
```

Note: If either argument is the non-literal `number` or `bigint` type, the result is `boolean`.

Note: If both arguments are written in exponential notation with an exponent of the same sign (both `1e+21` and above, or both with a negative exponent like `1e-7`), or one is a `bigint` and the other is `1e+21` or above (or `-1e+21` or below), the result is `boolean` too, because such numbers cannot be compared digit by digit. Any other comparison with a number in exponential notation is still decided.

Note: A `number` above `Number.MAX_SAFE_INTEGER` is compared with a `bigint` by its printed digits, not its exact value. For example, `123456789012345680000` is really `123456789012345683968`, so comparing it with `123456789012345680000n` treats them as equal.

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

@example
```
import type {LessThan} from 'type-fest';

// Use `LessThan` to constrain a function parameter to negative numbers.
declare function setNegative<N extends number>(value: LessThan<N, 0> extends true ? N : never): void;

setNegative(-1); // ✅ Allowed
setNegative(-2); // ✅ Allowed

// @ts-expect-error
setNegative(0);

// @ts-expect-error
setNegative(1);
```
*/
export type LessThan<A extends _Numeric, B extends _Numeric> =
	GreaterThanOrEqual<A, B> extends infer Result
		? Result extends true
			? false
			: true
		: never; // Should never happen

export {};
