import type {LessThan} from './less-than.d.ts';
import type {PositiveInfinity} from './numeric.d.ts';
import type {UnwrapBrandedPrimitive} from './unwrap-branded-primitive.d.ts';
import type {TupleMax} from './tuple-max.d.ts'; // For `@link`

/**
Returns the minimum number in a tuple of numbers.

Use this to infer the smallest configured limit or the return type of a function that wraps `Math.min()`.

Supports readonly tuples, negative numbers, decimals, and infinities. Numeric enum members and brands are preserved; equal values keep the first element's type. Brands follow the limitations of {@link UnwrapBrandedPrimitive}. Comparisons between numbers printed in exponential notation are unsupported when {@link LessThan} cannot decide the result.

Distributes over tuple unions and unions within elements, returning all possible minima. Tuple union members that return `never` do not contribute to the result.

Returns {@link PositiveInfinity} for an empty tuple, like `Math.min()`. Returns `never` for `any`, `never`, arrays with unknown length (including unbounded rest elements), or a tuple containing `any`, `never`, or a non-literal `number`. Optional elements and non-number elements, including `bigint` and `unknown`, are not accepted.

@example
```
import type {TupleMin} from 'type-fest';

const retryDelays = [100, 250, 500] as const;
type MinimumRetryDelay = TupleMin<typeof retryDelays>;
//=> 100

type MinimumOffset = TupleMin<[-10, -2, -5]>;
//=> -10

type MinimumScale = TupleMin<[1.25, 1.5, 1.05]>;
//=> 1.05

type PossibleMinimum = TupleMin<[1 | 4, 3]>;
//=> 1 | 3
```

The implementation compares each element with the current minimum, without counting up to the values.

@see {@link TupleMax}
@category Array
@category Numeric
*/
export type TupleMin<Tuple extends readonly number[]> = Tuple extends unknown
	? number extends Tuple['length']
		? never
		: `${number}` extends `${UnwrapBrandedPrimitive<Tuple[number]>}`
			? never
			: Tuple extends readonly [infer First extends number, ...infer Rest extends number[]]
				? TupleMinImplementation<Rest, First>
				// The empty tuple returns the identity element of the minimum, not `never`. `Math.min()` returns `Infinity` at runtime, so `never` would mark reachable code as unreachable. `never` would also disappear from a union, so `TupleMin<[] | [2, 5]>` would be `2` and hide the empty case, and it would look like the invalid inputs above. The identity keeps `TupleMin<[...A, ...B]>` equal in value to `TupleMin<[TupleMin<A>, TupleMin<B>]>` when `A` or `B` is empty, in the same way that `AndAll<[]>` is `true`.
				: PositiveInfinity
	: never;

type TupleMinImplementation<Tuple extends readonly number[], Result extends number> = Tuple extends readonly [infer First extends number, ...infer Rest extends number[]]
	// Compare each candidate and accumulated value separately so a possible win does not disappear into `boolean`.
	? First extends unknown
		? Result extends unknown
			? LessThan<First, Result> extends true
				? TupleMinImplementation<Rest, First>
				: TupleMinImplementation<Rest, Result>
			: never // Should never happen
		: never // Should never happen
	: Result;

export {};
