import {expectType} from 'tsd';
import type {TupleMax} from '../../source/internal/index.d.ts';
import type {PositiveInfinity} from '../../source/numeric.d.ts';

expectType<TupleMax<[1, 2, 5, 3, 7, -9, -5, 0]>>(7);
expectType<TupleMax<[1, 2, 5, 3, 7, -9, -5, 0, PositiveInfinity]>>(null! as PositiveInfinity);
expectType<TupleMax<[1, 1, 1, 1, 1, 1]>>(1);
expectType<TupleMax<[-1, -2, -5]>>(-1);
expectType<TupleMax<[10, 2]>>(10);
