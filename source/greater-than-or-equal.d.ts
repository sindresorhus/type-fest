import type {GreaterThan} from './greater-than.d.ts';
import type {UnwrapBrandedPrimitive} from './unwrap-branded-primitive.d.ts';
import type {_Numeric} from './numeric.d.ts';

/**
Returns a boolean for whether a given number is greater than or equal to another number.

Distributes over both operands; mixed results return `boolean`. A `never` operand returns `never`. Otherwise, an `any` operand returns `boolean`. Only numeric operands are accepted.

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

Note: Two numbers in exponential notation with exponents of the same sign return `boolean` unless equality or the numbers' signs decide the comparison. Comparing a `bigint` with a `number` of `1e+21` or above (or `-1e+21` or below) also returns `boolean`. Other comparisons with a number in exponential notation are still decided.

Note: A `number` above `Number.MAX_SAFE_INTEGER` is compared with a `bigint` by its printed digits, not its exact value. For example, `123456789012345680000` is really `123456789012345683968`, so comparing it with `123456789012345680000n` treats them as equal.

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
	_GreaterThanOrEqual<A extends object ? UnwrapBrandedPrimitive<A> : A, B extends object ? UnwrapBrandedPrimitive<B> : B>;

// Numeric enum members accept `number`, but their printed types still identify their known values.
type _GreaterThanOrEqual<A extends _Numeric, B extends _Numeric> = A extends _Numeric // For distributing `A`
	? B extends _Numeric // For distributing `B`
		? `${number}` extends `${A | B}`
			? boolean
			: bigint extends A | B
				? boolean
				: `${A}` extends `${B}` // Compares as strings, so a `bigint` equals the `number` with the same digits, such as `5n` and `5`.
					? true
					: GreaterThan<A, B>
		: never // Should never happen
	: never; // Should never happen

export {};
