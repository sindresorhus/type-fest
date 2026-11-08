import type {NegativeInfinity} from './numeric.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAnyOrNever} from './internal/type.d.ts';
import type {UnwrapBrand} from './internal/object.d.ts';
import type {IsUnion} from './is-union.d.ts';
import type {StringToNumber} from './string-to-number.d.ts';
import type {UnionMax} from './union-max.d.ts'; // For `@link`

/**
Returns the minimum number in a union of numbers.

Use this to find the smallest of a fixed set of supported values, such as retry counts or concurrency limits.

Supports non-negative integer literals, plus `PositiveInfinity` and `NegativeInfinity`. In a union, the counter stops at the minimum, so a minimum above `998` can exceed TypeScript's recursion limit. A negative finite or fractional member is never matched by the counter, so it can return a wrong value or exceed the recursion limit. A single known value is returned without counting, even when it is negative or fractional.

Brands are removed from the result. Numeric enum members produce plain numeric literals; enum members with unknown values produce `number`. Returns `number`, `any`, or `never` when given those types.

@example
```
import type {UnionMin} from 'type-fest';

const retryCounts = [1, 2, 5] as const;
type MinimumRetries = UnionMin<typeof retryCounts[number]>;
//=> 1

const minimumRetries: MinimumRetries = 1;
```

@example
```
import type {PositiveInfinity, UnionMin} from 'type-fest';

type MinimumLimit = UnionMin<1 | 5 | PositiveInfinity>;
//=> 1
```

The implementation counts upward using a tuple until it reaches the smallest candidate. `NegativeInfinity`, non-literal inputs, and a single known value are handled before counting. A losing `PositiveInfinity` never matches the counter, so it needs no special handling.

@see {@link UnionMax} - For the maximum value.
@see https://github.com/sindresorhus/type-fest/issues/676
@category Numeric
*/
export type UnionMin<NumberUnion extends number> =
	UnionMinImplementation<NumberUnion extends object ? UnwrapBrand<NumberUnion> : NumberUnion>;

// Normalize the candidates once so the counter can match branded values.
type UnionMinImplementation<NumberUnion extends number> =
	IsAnyOrNever<NumberUnion> extends true ? NumberUnion
		: `${number}` extends `${NumberUnion}` ? number
			: NegativeInfinity extends NumberUnion ? NegativeInfinity
				// A single candidate is already the minimum. Read its printed value so enum members still produce plain numbers.
				: IsUnion<NumberUnion> extends false
					? StringToNumber<`${NumberUnion}`>
					// The counter can ignore `PositiveInfinity` because it only matches non-negative integer tuple lengths.
					: InternalUnionMin<NumberUnion>;

/**
The actual implementation of `UnionMin`. Count upward until the counter matches a union member, then return that length.
*/
type InternalUnionMin<NumberUnion extends number, Counter extends UnknownArray = []> =
	Counter['length'] extends NumberUnion
		? Counter['length']
		: InternalUnionMin<NumberUnion, [...Counter, unknown]>;

export {};
