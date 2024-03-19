import {expectType} from 'tsd';
import type {Subtract} from '../index';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric';

expectType<Subtract<10, -2>>(12);
expectType<Subtract<2, 2>>(0);
expectType<Subtract<-1, -3>>(2);

expectType<Subtract<1, 2>>(null! as number); // Note: you can only get `number` for now

expectType<Subtract<PositiveInfinity, 999>>(null! as PositiveInfinity);
expectType<Subtract<-999, PositiveInfinity>>(null! as NegativeInfinity);
expectType<Subtract<NegativeInfinity, 999>>(null! as NegativeInfinity);
expectType<Subtract<999, NegativeInfinity>>(null! as PositiveInfinity);
expectType<Subtract<NegativeInfinity, PositiveInfinity>>(null! as NegativeInfinity);
expectType<Subtract<NegativeInfinity, NegativeInfinity>>(null! as number);
expectType<Subtract<PositiveInfinity, PositiveInfinity>>(null! as number);

expectType<Subtract<number, 2>>(null! as number);
expectType<Subtract<2, number>>(null! as number);
expectType<Subtract<number, number>>(null! as number);
expectType<Subtract<number, PositiveInfinity>>(null! as number);
