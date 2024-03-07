import {expectType} from 'tsd';
import type {Add} from '../index';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric';

expectType<Add<1, 2>>(3);
expectType<Add<10, -2>>(8);
expectType<Add<2, -2>>(0);

expectType<Add<-1, -2>>(null! as number); // Note: you can only get `number` for now

expectType<Add<PositiveInfinity, -999>>(null! as PositiveInfinity);
expectType<Add<-999, PositiveInfinity>>(null! as PositiveInfinity);
expectType<Add<NegativeInfinity, 999>>(null! as NegativeInfinity);
expectType<Add<999, NegativeInfinity>>(null! as NegativeInfinity);
expectType<Add<NegativeInfinity, PositiveInfinity>>(null! as number);
