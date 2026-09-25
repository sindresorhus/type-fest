import type {Finite, NegativeInfinity, PositiveInfinity} from './numeric.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAnyOrNever} from './internal/type.d.ts';

/**
Returns the minimum number in a union of numbers.

Use this to derive a lower bound (such as a minimum allowed retry count or the smallest supported page size) from a fixed set of supported values.

Supports small non-negative integer literals, plus `PositiveInfinity` and `NegativeInfinity`. Negative finite numbers and fractional numbers are not supported. Large integers or unions can exceed TypeScript’s recursion limit.

Returns `number`, `any`, or `never` when given those types.

@example
```
import type {UnionMin} from 'type-fest';

const pageSizes = [10, 20, 50] as const;
type SmallestPageSize = UnionMin<typeof pageSizes[number]>;
//=> 10

const smallestPageSize: SmallestPageSize = 10;
```

@example
```
import type {NegativeInfinity, UnionMin} from 'type-fest';

type Unbounded = UnionMin<1 | 5 | NegativeInfinity>;
//=> -Infinity
```

The implementation counts upward using a tuple until its length matches a union member; because it counts from `0`, the first match is the minimum. Infinity and non-literal inputs are handled before counting.

@see {@link UnionMax}
@see https://github.com/sindresorhus/type-fest/issues/676
@category Numeric
*/
export type UnionMin<NumberUnion extends number> =
	IsAnyOrNever<NumberUnion> extends true ? NumberUnion
		: number extends NumberUnion ? number
			: NegativeInfinity extends NumberUnion ? NegativeInfinity
				: [NumberUnion] extends [PositiveInfinity] ? PositiveInfinity
					: InternalUnionMin<Finite<NumberUnion>>;

/**
The actual implementation of `UnionMin`. It's private because it has some arguments that don't need to be exposed.
*/
type InternalUnionMin<NumberUnion extends number, Counter extends UnknownArray = []> =
	Counter['length'] extends NumberUnion
		? Counter['length']
		: InternalUnionMin<NumberUnion, [...Counter, unknown]>;

export {};
