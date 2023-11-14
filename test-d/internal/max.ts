import {expectType} from 'tsd';
import type {Max} from '../../source/internal';
import type {PositiveInfinity} from '../../source/numeric';

expectType<Max<[1, 2, 5, 3, 7, -9, -5, 0]>>(7);
expectType<Max<[1, 2, 5, 3, 7, -9, -5, 0, PositiveInfinity]>>(null! as PositiveInfinity);
expectType<Max<[1, 1, 1, 1, 1, 1]>>(1);
expectType<Max<[-1, -2, -5]>>(-1);
