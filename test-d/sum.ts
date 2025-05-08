import {expectType} from 'tsd';
import type {Sum} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

// Positive result
expectType<0>({} as Sum<-999, 999>);
expectType<0>({} as Sum<999, -999>);
expectType<0>({} as Sum<0, 0>);
expectType<0>({} as Sum<2, -2>);
expectType<0>({} as Sum<-2, 2>);
expectType<3>({} as Sum<1, 2>);
expectType<8>({} as Sum<10, -2>);
expectType<8>({} as Sum<-2, 10>);
expectType<57>({} as Sum<-20, 77>);
expectType<998>({} as Sum<-1, 999>);
expectType<1000>({} as Sum<999, 1>);
expectType<1998>({} as Sum<999, 999>);

// Negative result
expectType<-3>({} as Sum<-1, -2>);
expectType<-8>({} as Sum<-10, 2>);
expectType<-8>({} as Sum<2, -10>);
expectType<-57>({} as Sum<20, -77>);
expectType<-998>({} as Sum<-999, 1>);
expectType<-998>({} as Sum<1, -999>);
expectType<-1998>({} as Sum<-999, -999>);

// Infinity
expectType<PositiveInfinity>({} as Sum<PositiveInfinity, -999>);
expectType<PositiveInfinity>({} as Sum<-999, PositiveInfinity>);
expectType<PositiveInfinity>({} as Sum<PositiveInfinity, PositiveInfinity>);
expectType<NegativeInfinity>({} as Sum<NegativeInfinity, 999>);
expectType<NegativeInfinity>({} as Sum<999, NegativeInfinity>);
expectType<NegativeInfinity>({} as Sum<NegativeInfinity, NegativeInfinity>);

// Number
expectType<number>({} as Sum<number, 1>);
expectType<number>({} as Sum<1, number>);
expectType<number>({} as Sum<number, number>);
expectType<number>({} as Sum<number, PositiveInfinity>);
expectType<number>({} as Sum<NegativeInfinity, number>);
expectType<number>({} as Sum<NegativeInfinity, PositiveInfinity>);
expectType<number>({} as Sum<PositiveInfinity, NegativeInfinity>);

// Union
expectType<3 | 4>({} as Sum<1, 2 | 3>);
expectType<4 | 5>({} as Sum<1 | 2, 3>);
expectType<5 | 6 | 7 | 8>({} as Sum<1 | 2 | 3, 4 | 5>);
expectType<2 | 4 | 5 | 7 | 9 | -2 | -4 | -7>({} as Sum<1 | -2 | 3, 4 | -5 | 6>);
