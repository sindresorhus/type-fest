import {expectType} from 'tsd';
import type {Subtract} from '../index';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric';

// Positive result
expectType<Subtract<10, -2>>(12);
expectType<Subtract<2, 2>>(0);
expectType<Subtract<-1, -3>>(2);
expectType<Subtract<69, 0>>(69);

// Negative result
expectType<Subtract<1, 2>>(-1);
expectType<Subtract<-10, -4>>(-6);
expectType<Subtract<-111, 222>>(-333);
expectType<Subtract<0, 420>>(-420);

// Infinity
expectType<Subtract<PositiveInfinity, 999>>(null! as PositiveInfinity);
expectType<Subtract<-999, PositiveInfinity>>(null! as NegativeInfinity);
expectType<Subtract<NegativeInfinity, 999>>(null! as NegativeInfinity);
expectType<Subtract<999, NegativeInfinity>>(null! as PositiveInfinity);
expectType<Subtract<NegativeInfinity, PositiveInfinity>>(null! as NegativeInfinity);
expectType<Subtract<NegativeInfinity, NegativeInfinity>>(null! as number);
expectType<Subtract<PositiveInfinity, PositiveInfinity>>(null! as number);

// Number
expectType<Subtract<number, 2>>(null! as number);
expectType<Subtract<2, number>>(null! as number);
expectType<Subtract<number, number>>(null! as number);
expectType<Subtract<number, PositiveInfinity>>(null! as number);

// Union
expectType<Subtract<10, 1 | 2>>({} as 9 | 8);
expectType<Subtract<10 | 5, 1>>({} as 9 | 4);
expectType<Subtract<10 | 5, 1 | 2>>({} as 9 | 8 | 4 | 3);
