import type {GreaterThan} from './greater-than.d.ts';
import type {_Numeric} from './numeric.d.ts';

/**
Returns a boolean for whether a given number is less than another number.

Distributes over both operands; mixed results return `boolean`. A `never` operand returns `never`. Otherwise, an `any` operand returns `boolean`. Only numeric operands are accepted.

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

Note: Two numbers in exponential notation with exponents of the same sign return `boolean` unless equality or the numbers' signs decide the comparison. Comparing a `bigint` with a `number` of `1e+21` or above (or `-1e+21` or below) also returns `boolean`. Other comparisons with a number in exponential notation are still decided.

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
// Reuse the strict comparison with its operands reversed.
export type LessThan<A extends _Numeric, B extends _Numeric> = GreaterThan<B, A>;

export {};
