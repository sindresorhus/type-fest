import type {GreaterThan} from '../greater-than.d.ts';
import type {LessThan} from '../less-than.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../numeric.d.ts';

/**
Returns the maximum value from a tuple of integers.

Note:
- Float numbers are not supported.

@example
```
type A = TupleMax<[1, 2, 5, 3]>;
//=> 5

type B = TupleMax<[1, 2, 5, 3, 99, -1]>;
//=> 99
```
*/
export type TupleMax<A extends number[], Result extends number = NegativeInfinity> = `${number}` extends `${A[number]}`
	? never
	: A extends [infer F extends number, ...infer R extends number[]]
		// Compare each candidate and accumulated value separately so a possible win does not disappear into `boolean`.
		? F extends unknown
			? Result extends unknown
				? GreaterThan<F, Result> extends true
					? TupleMax<R, F>
					: TupleMax<R, Result>
				: never // Should never happen
			: never // Should never happen
		: Result;

/**
Returns the minimum value from a tuple of integers.

Note:
- Float numbers are not supported.

@example
```
type A = TupleMin<[1, 2, 5, 3]>;
//=> 1

type B = TupleMin<[1, 2, 5, 3, -5]>;
//=> -5
```
*/
export type TupleMin<A extends number[], Result extends number = PositiveInfinity> = `${number}` extends `${A[number]}`
	? never
	: A extends [infer F extends number, ...infer R extends number[]]
		// Compare each candidate and accumulated value separately so a possible win does not disappear into `boolean`.
		? F extends unknown
			? Result extends unknown
				? LessThan<F, Result> extends true
					? TupleMin<R, F>
					: TupleMin<R, Result>
				: never // Should never happen
			: never // Should never happen
		: Result;

export {};
