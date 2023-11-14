import {expectType} from 'tsd';
import type {Sub} from '../../source/internal';
import {type NegativeInfinity, type PositiveInfinity} from '../../source/numeric';

expectType<Sub<10, -2>>(12);
expectType<Sub<2, 2>>(0);
expectType<Sub<-1, -3>>(2);

expectType<Sub<1, 2>>(null! as number); // Note: you can only get `number` for now

expectType<Sub<PositiveInfinity, 999>>(null! as PositiveInfinity);
expectType<Sub<-999, PositiveInfinity>>(null! as NegativeInfinity);
expectType<Sub<NegativeInfinity, 999>>(null! as NegativeInfinity);
expectType<Sub<999, NegativeInfinity>>(null! as PositiveInfinity);
expectType<Sub<NegativeInfinity, PositiveInfinity>>(null! as NegativeInfinity);
expectType<Sub<NegativeInfinity, NegativeInfinity>>(null! as number);
expectType<Sub<PositiveInfinity, PositiveInfinity>>(null! as number);
