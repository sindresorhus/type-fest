import {expectType} from 'tsd';
import type {Sum} from '../index';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric';

expectType<Sum<1, 2>>(3);
expectType<Sum<10, -2>>(8);
expectType<Sum<2, -2>>(0);

expectType<Sum<-1, -2>>(null! as number); // Note: you can only get `number` for now

expectType<Sum<PositiveInfinity, -999>>(null! as PositiveInfinity);
expectType<Sum<-999, PositiveInfinity>>(null! as PositiveInfinity);
expectType<Sum<NegativeInfinity, 999>>(null! as NegativeInfinity);
expectType<Sum<999, NegativeInfinity>>(null! as NegativeInfinity);
expectType<Sum<NegativeInfinity, PositiveInfinity>>(null! as number);

expectType<Sum<number, 1>>(null! as number);
expectType<Sum<1, number>>(null! as number);
expectType<Sum<number, number>>(null! as number);
expectType<Sum<number, PositiveInfinity>>(null! as number);
