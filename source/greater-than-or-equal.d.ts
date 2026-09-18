import type {GreaterThan} from './greater-than.d.ts';
import type {_Numeric} from './numeric.d.ts';

/**
Returns a boolean for whether a given integer is greater than or equal to another integer.

@example
```
import type {GreaterThanOrEqual} from 'type-fest';

type A = GreaterThanOrEqual<1, -5>;
//=> true

type B = GreaterThanOrEqual<1, -5n>;
//=> true

type C = GreaterThanOrEqual<1, 1>;
//=> true

type D = GreaterThanOrEqual<1, 5>;
//=> false

type E = GreaterThanOrEqual<5n, 5n>;
//=> true
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
	number extends A | B
		? boolean
		: bigint extends A | B
			? GreaterThan<A, B>
			: A extends _Numeric // For distributing `A`
				? B extends _Numeric // For distributing `B`
					? `${A}` extends `${B}` // Ts will automatically convert `100n` to `100`, which can be used to compare equality between number and bigint
						? true
						: GreaterThan<A, B>
					: never // Should never happen
				: never; // Should never happen

export {};
