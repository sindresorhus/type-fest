import {expectType} from 'tsd';
import type {Sum} from '../index';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric';

expectType<3>({} as Sum<1, 2>);
expectType<8>({} as Sum<10, -2>);
expectType<0>({} as Sum<2, -2>);

expectType<-3>({} as Sum<-1, -2>);

expectType<PositiveInfinity>({} as Sum<PositiveInfinity, -999>);
expectType<PositiveInfinity>({} as Sum<-999, PositiveInfinity>);
expectType<NegativeInfinity>({} as Sum<NegativeInfinity, 999>);
expectType<NegativeInfinity>({} as Sum<999, NegativeInfinity>);
expectType<number>({} as Sum<NegativeInfinity, PositiveInfinity>);

expectType<number>({} as Sum<number, 1>);
expectType<number>({} as Sum<1, number>);
expectType<number>({} as Sum<number, number>);
expectType<number>({} as Sum<number, PositiveInfinity>);

// Union
expectType<3 | 4>({} as Sum<1, 2 | 3>);
expectType<4 | 5>({} as Sum<1 | 2, 3>);
expectType<5 | 6 | 7 | 8>({} as Sum<1 | 2 | 3, 4 | 5>);
