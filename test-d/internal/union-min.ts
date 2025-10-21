import {expectType} from 'tsd';
import type {UnionMin} from '../../source/internal/numeric.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../../index.d.ts';

//  Basic positive numbers
expectType<UnionMin<1 | 3 | 2>>(1);
expectType<UnionMin<10 | 5 | 2>>(2);
expectType<UnionMin<0 | 5 | 2 | 1>>(0);
expectType<UnionMin<1 | 2 | 5 | 3 | 7 | 9 | 0>>(0);

//  Negative numbers
expectType<UnionMin<0 | -5 | -2>>(-5);
expectType<UnionMin<-1 | -3 | -2>>(-3);
expectType<UnionMin<-10 | -5 | -7>>(-10);

//  Mixed positive and negative
expectType<UnionMin<-10 | 0>>(-10);
expectType<UnionMin<-1 | 2 | -5>>(-5);
expectType<UnionMin<-3 | -2 | 1 | 5>>(-3);
expectType<UnionMin<-1 | -2 | 1 | 2>>(-2);

//  Infinity cases
expectType<UnionMin<PositiveInfinity>>({} as PositiveInfinity);
expectType<UnionMin<NegativeInfinity>>({} as NegativeInfinity);
expectType<UnionMin<1 | PositiveInfinity>>(1);
expectType<UnionMin<1 | NegativeInfinity>>({} as NegativeInfinity);
expectType<UnionMin<NegativeInfinity | PositiveInfinity>>({} as NegativeInfinity);
expectType<UnionMin<-100 | 100 | PositiveInfinity>>(-100);
expectType<UnionMin<-100 | 100 | NegativeInfinity>>({} as NegativeInfinity);

//  Edge cases
expectType<UnionMin<any>>({} as any);
expectType<UnionMin<never>>({} as never);
expectType<UnionMin<number>>({} as number);
expectType<UnionMin<(number & {})>>({} as number);
expectType<UnionMin<(number & {}) | 1 | 5>>({} as number);
