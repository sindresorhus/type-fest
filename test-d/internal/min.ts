import {expectType} from 'tsd';
import type {Min} from '../../source/internal';
import type {NegativeInfinity, PositiveInfinity} from '../../source/numeric';

expectType<Min<[1, 2, 5, 3, 7, -9, -5, 0]>>(-9);
expectType<Min<[1, 2, 5, 3, 7, -9, -5, 0, PositiveInfinity, NegativeInfinity]>>(null! as NegativeInfinity);
expectType<Min<[1, 1, 1, 1, 1, 1]>>(1);
expectType<Min<[-1, -2, -5]>>(-5);
