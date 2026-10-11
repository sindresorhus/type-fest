import {expectTypeOf} from 'nz';
import type {TupleMin} from '../../source/internal/index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../../source/numeric.d.ts';

declare const never: never;

expectTypeOf<TupleMin<[1, 2, 5, 3, 7, -9, -5, 0]>>().toBe<-9>();
expectTypeOf<NegativeInfinity>().toBe<TupleMin<[1, 2, 5, 3, 7, -9, -5, 0, PositiveInfinity, NegativeInfinity]>>();
expectTypeOf<TupleMin<[1, 1, 1, 1, 1, 1]>>().toBe<1>();
expectTypeOf<TupleMin<[-1, -2, -5]>>().toBe<-5>();
expectTypeOf(never).toBe<TupleMin<[-1, -2, number, -5]>>();
