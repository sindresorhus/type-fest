import type {NegativeInfinity, PositiveInfinity} from './numeric.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAnyOrNever} from './internal/type.d.ts';
import type {UnwrapBrand} from './internal/object.d.ts';
import type {IsUnion} from './is-union.d.ts';
import type {StringToNumber} from './string-to-number.d.ts';
import type {UnionMin} from './union-min.d.ts'; // For `@link`

/**
Returns the maximum number in a union of numbers.

Use this to find the largest of a fixed set of supported values, such as retry counts or concurrency limits.

Supports non-negative integer literals, plus `PositiveInfinity` and `NegativeInfinity`. In a union, the counter stops at the maximum, so a maximum above `998` can exceed TypeScript's recursion limit. A negative finite or fractional member is never matched by the counter, so it can exceed the recursion limit. A single known value is returned without counting, even when it is negative or fractional.

Brands are removed from the result. Numeric enum members produce plain numeric literals; enum members with unknown values produce `number`. Returns `number`, `any`, or `never` when given those types.

@example
```
import type {UnionMax} from 'type-fest';

const retryCounts = [0, 2, 5] as const;
type MaximumRetries = UnionMax<typeof retryCounts[number]>;
//=> 5

const maximumRetries: MaximumRetries = 5;
```

@example
```
import type {PositiveInfinity, UnionMax} from 'type-fest';

type Unlimited = UnionMax<1 | 5 | PositiveInfinity>;
//=> Infinity
```

The implementation counts upward using a tuple, removing lower union members until only the maximum remains. Both infinities, non-literal inputs, and a single known value are handled before counting.

@see {@link UnionMin} - For the minimum value.
@see https://github.com/sindresorhus/type-fest/issues/676
@category Numeric
*/
export type UnionMax<NumberUnion extends number> =
	UnionMaxImplementation<NumberUnion extends object ? UnwrapBrand<NumberUnion> : NumberUnion>;

// Normalize the candidates once so the counter can match and remove branded values.
type UnionMaxImplementation<NumberUnion extends number> =
	IsAnyOrNever<NumberUnion> extends true ? NumberUnion
		: `${number}` extends `${NumberUnion}` ? number
			: PositiveInfinity extends NumberUnion ? PositiveInfinity
				// A single candidate is already the maximum. Read its printed value so enum members still produce plain numbers.
				: IsUnion<NumberUnion> extends false
					? StringToNumber<`${NumberUnion}`>
					// Broad inputs and the winning infinity are already handled; only the losing infinity needs removal.
					: InternalUnionMax<Exclude<NumberUnion, NegativeInfinity>>;

/**
The actual implementation of `UnionMax`. Stop when only the current value remains, and remove a matched member while advancing so each value needs at most one recursion step. The same termination check returns zero for an empty internal union.
*/
type InternalUnionMax<NumberUnion extends number, Counter extends UnknownArray = []> =
	[NumberUnion] extends [Counter['length']]
		? Counter['length']
		: Counter['length'] extends NumberUnion
			? InternalUnionMax<Exclude<NumberUnion, Counter['length']>, [...Counter, unknown]>
			: InternalUnionMax<NumberUnion, [...Counter, unknown]>;

export {};
