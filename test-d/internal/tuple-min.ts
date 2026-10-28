import {expectTypeOf} from 'nz';
import type {TupleMin} from '../../source/internal/index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../../source/numeric.d.ts';
import type {Tagged} from '../../source/tagged.d.ts';

declare const never: never;

expectTypeOf<TupleMin<[1, 2, 5, 3, 7, -9, -5, 0]>>().toBe<-9>();
expectTypeOf<NegativeInfinity>().toBe<TupleMin<[1, 2, 5, 3, 7, -9, -5, 0, PositiveInfinity, NegativeInfinity]>>();
expectTypeOf<TupleMin<[1, 1, 1, 1, 1, 1]>>().toBe<1>();
expectTypeOf<TupleMin<[-1, -2, -5]>>().toBe<-5>();
expectTypeOf(never).toBe<TupleMin<[-1, -2, number, -5]>>();

// Every possible integer choice contributes its own minimum, independent of tuple position.
expectTypeOf<TupleMin<[1 | 4, 3]>>().toBe<1 | 3>();
expectTypeOf<TupleMin<[3, 1 | 4]>>().toBe<1 | 3>();
expectTypeOf<TupleMin<[1 | 4, 2 | 3]>>().toBe<1 | 2 | 3>();
expectTypeOf<TupleMin<[3], 1 | 4>>().toBe<1 | 3>();
expectTypeOf<TupleMin<[Tagged<1 | 4, 'Bound'>, 3]>>().toBe<Tagged<1, 'Bound'> | 3>();
expectTypeOf<TupleMin<[]>>().toBe<PositiveInfinity>();
expectTypeOf<TupleMin<any>>().toBe<never>();
expectTypeOf<TupleMin<never>>().toBe<never>();
expectTypeOf<TupleMin<[1] | [number]>>().toBe<never>();
expectTypeOf<TupleMin<[1], number>>().toBe<number>();
// @ts-expect-error Candidates must be numbers.
type UnknownMinimumCandidate = TupleMin<[unknown]>;

declare function minimum<const Values extends number[]>(...values: Values): TupleMin<Values>;
expectTypeOf(minimum(1 as 1 | 4, 3)).toBe<1 | 3>();

function _readGenericMinimum<Value extends number>(value: TupleMin<[Value, 3]>): number {
	return value;
}
