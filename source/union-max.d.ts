import type {IsNever} from './is-never.d.ts';
import type {Finite, NegativeInfinity, PositiveInfinity} from './numeric.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAnyOrNever} from './internal/type.d.ts';

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

The implementation counts upward using a tuple, removing each matching union member until none remain. Infinity and non-literal inputs are handled before counting.

@see https://github.com/sindresorhus/type-fest/issues/676
@category Numeric
*/
export type UnionMax<NumberUnion extends number> =
	IsAnyOrNever<NumberUnion> extends true ? NumberUnion
		: number extends NumberUnion ? number
			: PositiveInfinity extends NumberUnion ? PositiveInfinity
				: [NumberUnion] extends [NegativeInfinity] ? NegativeInfinity
					: InternalUnionMax<Finite<NumberUnion>>;

/**
The actual implementation of `UnionMax`. It's private because it has some arguments that don't need to be exposed.
*/
type InternalUnionMax<NumberUnion extends number, Counter extends UnknownArray = []> =
	IsNever<NumberUnion> extends true
		? Counter['length']
		: Counter['length'] extends NumberUnion
			? InternalUnionMax<Exclude<NumberUnion, Counter['length']>, Counter>
			: InternalUnionMax<NumberUnion, [...Counter, unknown]>;

export {};
