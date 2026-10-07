import type {PositiveNumericStringGt} from './internal/index.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {PositiveInfinity, NegativeInfinity, IsNegative} from './numeric.d.ts';
import type {And} from './and.d.ts';
import type {Or} from './or.d.ts';
import type {Absolute} from './absolute.d.ts';
import type {UnwrapBrand} from './internal/object.d.ts';

/**
Returns a boolean for whether a given number is greater than another number.

@example
```
import type {GreaterThan} from 'type-fest';

type A = GreaterThan<1, -5>;
//=> true

type B = GreaterThan<1, 1>;
//=> false

type C = GreaterThan<1, 5>;
//=> false
```

Note: If either argument is the non-literal `number` type, the result is `boolean`.

Note: If both arguments are written in exponential notation with an exponent of the same sign (both `1e+21` and above, or both with a negative exponent like `1e-7`), the result is `boolean` too, because such numbers cannot be compared digit by digit. Any other comparison with a number in exponential notation is still decided.

@example
```
import type {GreaterThan} from 'type-fest';

type A = GreaterThan<number, 1>;
//=> boolean

type B = GreaterThan<1, number>;
//=> boolean

type C = GreaterThan<number, number>;
//=> boolean
```

@example
```
import type {GreaterThan} from 'type-fest';

// Use `GreaterThan` to constrain a function parameter to positive numbers.
declare function setPositive<N extends number>(value: GreaterThan<N, 0> extends true ? N : never): void;

setPositive(1); // ✅ Allowed
setPositive(2); // ✅ Allowed

// @ts-expect-error
setPositive(0);

// @ts-expect-error
setPositive(-1);
```
*/
export type GreaterThan<A extends number, B extends number> =
	_GreaterThan<A extends object ? UnwrapBrand<A> : A, B extends object ? UnwrapBrand<B> : B>;

type _GreaterThan<A extends number, B extends number> =
	A extends number // For distributing `A`
		? B extends number // For distributing `B`
			? number extends A | B
				? boolean
				: [
					IsEqual<A, PositiveInfinity>, IsEqual<A, NegativeInfinity>,
					IsEqual<B, PositiveInfinity>, IsEqual<B, NegativeInfinity>,
				] extends infer R extends [boolean, boolean, boolean, boolean]
					? Or<
						And<IsEqual<R[0], true>, IsEqual<R[2], false>>,
						And<IsEqual<R[3], true>, IsEqual<R[1], false>>
					> extends true
						? true
						: Or<
							And<IsEqual<R[1], true>, IsEqual<R[3], false>>,
							And<IsEqual<R[2], true>, IsEqual<R[0], false>>
						> extends true
							? false
							: true extends R[number]
								? false
								: [IsNegative<A>, IsNegative<B>] extends infer R extends [boolean, boolean]
									? [true, false] extends R
										? false
										: [false, true] extends R
											? true
											: [false, false] extends R
												? PositiveNumericStringGt<`${A}`, `${B}`>
												: PositiveNumericStringGt<`${Absolute<B>}`, `${Absolute<A>}`>
									: never
					: never
			: never // Should never happen
		: never; // Should never happen

export {};
