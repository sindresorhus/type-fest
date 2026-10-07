import type {GreaterThan} from './greater-than.d.ts';
import type {UnwrapBrand} from './internal/object.d.ts';

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

Note: If both arguments are written in exponential notation with an exponent of the same sign (both `1e+21` and above, or both with a negative exponent like `1e-7`), the result is `boolean` too, because such numbers cannot be compared digit by digit. Any other comparison with a number in exponential notation is still decided.

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

@example
```
import type {GreaterThanOrEqual} from 'type-fest';

// Use `GreaterThanOrEqual` to constrain a function parameter to non-negative numbers.
declare function setNonNegative<N extends number>(value: GreaterThanOrEqual<N, 0> extends true ? N : never): void;

setNonNegative(0); // ✅ Allowed
setNonNegative(1); // ✅ Allowed

// @ts-expect-error
setNonNegative(-1);

// @ts-expect-error
setNonNegative(-2);
```
*/
export type GreaterThanOrEqual<A extends number, B extends number> =
	_GreaterThanOrEqual<A extends object ? UnwrapBrand<A> : A, B extends object ? UnwrapBrand<B> : B>;

type _GreaterThanOrEqual<A extends number, B extends number> = number extends A | B
	? boolean
	: A extends number // For distributing `A`
		? B extends number // For distributing `B`
			? A extends B
				? true
				: GreaterThan<A, B>
			: never // Should never happen
		: never; // Should never happen

export {};
