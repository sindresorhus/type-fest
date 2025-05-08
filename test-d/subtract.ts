import {expectType} from 'tsd';
import type {Subtract} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

// Positive result
expectType<12>({} as Subtract<10, -2>);
expectType<0>({} as Subtract<0, 0>);
expectType<0>({} as Subtract<2, 2>);
expectType<2>({} as Subtract<-1, -3>);
expectType<7>({} as Subtract<12, 5>);
expectType<69>({} as Subtract<69, 0>);
expectType<1000>({} as Subtract<999, -1>);
expectType<1998>({} as Subtract<999, -999>);

// Negative result
expectType<-1>({} as Subtract<1, 2>);
expectType<-6>({} as Subtract<-10, -4>);
expectType<-14>({} as Subtract<-10, 4>);
expectType<-333>({} as Subtract<-111, 222>);
expectType<-420>({} as Subtract<0, 420>);
expectType<-1000>({} as Subtract<-999, 1>);
expectType<-1998>({} as Subtract<-999, 999>);

// Infinity
expectType<PositiveInfinity>({} as Subtract<PositiveInfinity, 999>);
expectType<NegativeInfinity>({} as Subtract<-999, PositiveInfinity>);
expectType<NegativeInfinity>({} as Subtract<NegativeInfinity, 999>);
expectType<PositiveInfinity>({} as Subtract<999, NegativeInfinity>);
expectType<NegativeInfinity>({} as Subtract<NegativeInfinity, PositiveInfinity>);

// Number
expectType<number>({} as Subtract<number, 2>);
expectType<number>({} as Subtract<2, number>);
expectType<number>({} as Subtract<number, number>);
expectType<number>({} as Subtract<NegativeInfinity, NegativeInfinity>);
expectType<number>({} as Subtract<PositiveInfinity, PositiveInfinity>);
expectType<number>({} as Subtract<number, PositiveInfinity>);
expectType<number>({} as Subtract<PositiveInfinity, number>);

// Union
expectType<9 | 8>({} as Subtract<10, 1 | 2>);
expectType<9 | 4>({} as Subtract<10 | 5, 1>);
expectType<9 | 8 | 4 | 3>({} as Subtract<10 | 5, 1 | 2>);
expectType<11 | 8 | -4 | -7>({} as Subtract<10 | -5, -1 | 2>);
