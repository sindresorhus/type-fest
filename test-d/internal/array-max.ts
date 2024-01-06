import {expectType} from 'tsd';
import type {ArrayMax} from '../../source/internal';
import type {PositiveInfinity} from '../../source/math';

expectType<ArrayMax<[1, 2, 5, 3, 7, -9, -5, 0]>>(7);
expectType<ArrayMax<[1, 2, 5, 3, 7, -9, -5, 0, PositiveInfinity]>>(null! as PositiveInfinity);
expectType<ArrayMax<[1, 1, 1, 1, 1, 1]>>(1);
expectType<ArrayMax<[-1, -2, -5]>>(-1);
expectType<ArrayMax<[10, 2]>>(10);
