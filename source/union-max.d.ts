import type {NegativeInfinity, PositiveInfinity} from './numeric.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAnyOrNever} from './internal/type.d.ts';
import type {UnwrapBrand} from './internal/object.d.ts';
import type {IsUnion} from './is-union.d.ts';
import type {StringToNumber} from './string-to-number.d.ts';

/**
Returns the maximum number in a union of numbers.

Use this to derive a maximum retry count or concurrency limit from a fixed set of supported values.

Supports small non-negative integer literals, plus `PositiveInfinity` and `NegativeInfinity`. Negative finite numbers and fractional numbers are not supported. Large integers or unions can exceed TypeScript’s recursion limit.

Returns `number`, `any`, or `never` when given those types.

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

The implementation counts upward using a tuple, removing lower union members until only the maximum remains. Infinity, non-literal inputs, and a single known value are handled before counting.

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
				: [NumberUnion] extends [NegativeInfinity] ? NegativeInfinity
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
