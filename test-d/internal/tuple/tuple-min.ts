import {expectType} from 'tsd';
import type {TupleMin} from '../../../source/internal';
import type {NegativeInfinity, PositiveInfinity} from '../../../source/numeric';

declare const never: never;

expectType<TupleMin<[1, 2, 5, 3, 7, -9, -5, 0]>>(-9);
expectType<TupleMin<[1, 2, 5, 3, 7, -9, -5, 0, PositiveInfinity, NegativeInfinity]>>(null! as NegativeInfinity);
expectType<TupleMin<[1, 1, 1, 1, 1, 1]>>(1);
expectType<TupleMin<[-1, -2, -5]>>(-5);
expectType<TupleMin<[-1, -2, number, -5]>>(never);
