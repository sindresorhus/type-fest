import {expectType} from 'tsd';
import type {ArrayMin} from '../../source/internal';
import type {NegativeInfinity, PositiveInfinity} from '../../source/numeric';

expectType<ArrayMin<[1, 2, 5, 3, 7, -9, -5, 0]>>(-9);
expectType<ArrayMin<[1, 2, 5, 3, 7, -9, -5, 0, PositiveInfinity, NegativeInfinity]>>(null! as NegativeInfinity);
expectType<ArrayMin<[1, 1, 1, 1, 1, 1]>>(1);
expectType<ArrayMin<[-1, -2, -5]>>(-5);
expectType<ArrayMin<[-1, -2, number, -5]>>(null!);
