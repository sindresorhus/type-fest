import type {GreaterThan} from './greater-than.d.ts';
import type {NegativeInfinity} from './numeric.d.ts';
import type {UnwrapBrandedPrimitive} from './unwrap-branded-primitive.d.ts';
import type {TupleMin} from './tuple-min.d.ts'; // For `@link`

/**
Returns the maximum number in a tuple of numbers.

Use this to infer the largest configured limit or the return type of a function that wraps `Math.max()`.

Supports readonly tuples, negative numbers, decimals, and infinities. Numeric enum members and brands are preserved; equal values keep the first element's type. Brands follow the limitations of {@link UnwrapBrandedPrimitive}. Comparisons between numbers printed in exponential notation are unsupported when {@link GreaterThan} cannot decide the result.

Distributes over tuple unions and unions within elements, returning all possible maxima. Tuple union members that return `never` do not contribute to the result.

Returns {@link NegativeInfinity} for an empty tuple, like `Math.max()`. Returns `never` for `any`, `never`, arrays with unknown length (including unbounded rest elements), or a tuple containing `any`, `never`, or a non-literal `number`. Optional elements and non-number elements, including `bigint` and `unknown`, are not accepted.

@example
```
import type {TupleMax} from 'type-fest';

const concurrencyLimits = [2, 4, 8] as const;
type MaximumConcurrency = TupleMax<typeof concurrencyLimits>;
//=> 8

type MaximumOffset = TupleMax<[-10, -2, -5]>;
//=> -2

type MaximumScale = TupleMax<[1.25, 1.5, 1.05]>;
//=> 1.5

type PossibleMaximum = TupleMax<[1 | 4, 3]>;
//=> 3 | 4
```

The implementation compares each element with the current maximum, without counting up to the values.

@see {@link TupleMin}
@category Array
@category Numeric
*/
export type TupleMax<Tuple extends readonly number[]> = Tuple extends unknown
	? number extends Tuple['length']
		? never
		: `${number}` extends `${UnwrapBrandedPrimitive<Tuple[number]>}`
			? never
			: Tuple extends readonly [infer First extends number, ...infer Rest extends number[]]
				? TupleMaxImplementation<Rest, First>
				// The empty tuple returns the identity element of the maximum, not `never`. `Math.max()` returns `-Infinity` at runtime, so `never` would mark reachable code as unreachable. `never` would also disappear from a union, so `TupleMax<[] | [2, 5]>` would be `5` and hide the empty case, and it would look like the invalid inputs above. The identity keeps `TupleMax<[...A, ...B]>` equal in value to `TupleMax<[TupleMax<A>, TupleMax<B>]>` when `A` or `B` is empty, in the same way that `AndAll<[]>` is `true`.
				: NegativeInfinity
	: never;

type TupleMaxImplementation<Tuple extends readonly number[], Result extends number> = Tuple extends readonly [infer First extends number, ...infer Rest extends number[]]
	// Compare each candidate and accumulated value separately so a possible win does not disappear into `boolean`.
	? First extends unknown
		? Result extends unknown
			? GreaterThan<First, Result> extends true
				? TupleMaxImplementation<Rest, First>
				: TupleMaxImplementation<Rest, Result>
			: never // Should never happen
		: never // Should never happen
	: Result;

export {};
