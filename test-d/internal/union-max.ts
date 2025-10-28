import {expectType} from 'tsd';
import type {UnionMax} from '../../source/internal/numeric.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../../index.d.ts';

//  Basic positive numbers
expectType<UnionMax<1 | 3 | 2>>(3);
expectType<UnionMax<10 | 5 | 2>>(10);
expectType<UnionMax<0 | 5 | 2 | 1>>(5);
expectType<UnionMax<1 | 2 | 5 | 3 | 7 | 9 | 0>>(9);

//  Negative numbers
expectType<UnionMax<0 | -5 | -2>>(0);
expectType<UnionMax<-1 | -3 | -2>>(-1);
expectType<UnionMax<-10 | -5 | -7>>(-5);

//  Mixed positive and negative
expectType<UnionMax<-10 | 0>>(0);
expectType<UnionMax<-1 | 2 | -5>>(2);
expectType<UnionMax<-3 | -2 | 1 | 5>>(5);
expectType<UnionMax<-1 | -2 | 1 | 2>>(2);

//  Infinity cases
expectType<UnionMax<PositiveInfinity>>({} as PositiveInfinity);
expectType<UnionMax<NegativeInfinity>>({} as NegativeInfinity);
expectType<UnionMax<1 | PositiveInfinity>>({} as PositiveInfinity);
expectType<UnionMax<1 | NegativeInfinity>>(1);
expectType<UnionMax<NegativeInfinity | PositiveInfinity>>({} as PositiveInfinity);
expectType<UnionMax<-100 | 100 | PositiveInfinity>>({} as PositiveInfinity);
expectType<UnionMax<-100 | 100 | NegativeInfinity>>(100);

//  Edge cases
expectType<UnionMax<any>>({} as any);
expectType<UnionMax<never>>({} as never);
expectType<UnionMax<number>>({} as number);
expectType<UnionMax<(number & {})>>({} as number);
expectType<UnionMax<(number & {}) | 1 | 5>>({} as number);
