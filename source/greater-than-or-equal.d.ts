import type {GreaterThan} from './greater-than.d.ts';
import type {UnwrapBrand} from './internal/object.d.ts';
import type {_Numeric} from './numeric.d.ts';

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

type D = GreaterThanOrEqual<5n, 5>;
//=> true
```

Note: If either argument is the non-literal `number` or `bigint` type, the result is `boolean`.

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
export type GreaterThanOrEqual<A extends _Numeric, B extends _Numeric> =
	_GreaterThanOrEqual<A extends object ? UnwrapBrand<A> : A, B extends object ? UnwrapBrand<B> : B>;

type _GreaterThanOrEqual<A extends _Numeric, B extends _Numeric> = number extends A | B
	? boolean
	: bigint extends A | B
		? boolean
		: A extends _Numeric // For distributing `A`
			? B extends _Numeric // For distributing `B`
				? `${A}` extends `${B}` // Compares as strings, so a `bigint` equals the `number` with the same digits, such as `5n` and `5`.
					? true
					: GreaterThan<A, B>
				: never // Should never happen
			: never; // Should never happen

export {};
