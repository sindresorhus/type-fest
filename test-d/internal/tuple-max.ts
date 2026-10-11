import {expectTypeOf} from 'nz';
import type {TupleMax} from '../../source/internal/index.d.ts';
import type {PositiveInfinity} from '../../source/numeric.d.ts';

expectTypeOf<TupleMax<[1, 2, 5, 3, 7, -9, -5, 0]>>().toBe<7>();
expectTypeOf<PositiveInfinity>().toBe<TupleMax<[1, 2, 5, 3, 7, -9, -5, 0, PositiveInfinity]>>();
expectTypeOf<TupleMax<[1, 1, 1, 1, 1, 1]>>().toBe<1>();
expectTypeOf<TupleMax<[-1, -2, -5]>>().toBe<-1>();
expectTypeOf<TupleMax<[10, 2]>>().toBe<10>();
