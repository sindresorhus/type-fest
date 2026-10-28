import {expectTypeOf} from 'nz';
import type {TupleMax} from '../../source/internal/index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../../source/numeric.d.ts';
import type {Tagged} from '../../source/tagged.d.ts';

expectTypeOf<TupleMax<[1, 2, 5, 3, 7, -9, -5, 0]>>().toBe<7>();
expectTypeOf<PositiveInfinity>().toBe<TupleMax<[1, 2, 5, 3, 7, -9, -5, 0, PositiveInfinity]>>();
expectTypeOf<TupleMax<[1, 1, 1, 1, 1, 1]>>().toBe<1>();
expectTypeOf<TupleMax<[-1, -2, -5]>>().toBe<-1>();
expectTypeOf<TupleMax<[10, 2]>>().toBe<10>();

// Enum members are compared by their known values, like in `TupleMin`.
enum Limit {
	Low = 1,
	High = 5,
}
expectTypeOf<TupleMax<[Limit.Low, 2]>>().toBe<2>();
expectTypeOf<TupleMax<[Limit.High, 2]>>().toBe<Limit.High>();
expectTypeOf<TupleMax<[1, number]>>().toBe<never>();

// Every possible integer choice contributes its own maximum, independent of tuple position.
expectTypeOf<TupleMax<[1 | 4, 3]>>().toBe<3 | 4>();
expectTypeOf<TupleMax<[3, 1 | 4]>>().toBe<3 | 4>();
expectTypeOf<TupleMax<[1 | 4, 2 | 3]>>().toBe<2 | 3 | 4>();
expectTypeOf<TupleMax<[3], 1 | 4>>().toBe<3 | 4>();
expectTypeOf<TupleMax<[Tagged<1 | 4, 'Bound'>, 3]>>().toBe<Tagged<4, 'Bound'> | 3>();
expectTypeOf<TupleMax<[]>>().toBe<NegativeInfinity>();
expectTypeOf<TupleMax<any>>().toBe<never>();
expectTypeOf<TupleMax<never>>().toBe<never>();
expectTypeOf<TupleMax<[1] | [number]>>().toBe<never>();
expectTypeOf<TupleMax<[1], number>>().toBe<number>();
// @ts-expect-error Candidates must be numbers.
type UnknownMaximumCandidate = TupleMax<[unknown]>;

declare function maximum<const Values extends number[]>(...values: Values): TupleMax<Values>;
expectTypeOf(maximum(1 as 1 | 4, 3)).toBe<3 | 4>();

function _readGenericMaximum<Value extends number>(value: TupleMax<[Value, 3]>): number {
	return value;
}
