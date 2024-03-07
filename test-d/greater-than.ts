import {expectType} from 'tsd';
import type {GreaterThan} from '../source/greater-than';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric';

declare const never: never;

expectType<GreaterThan<1, 2>>(false);
expectType<GreaterThan<2, 1>>(true);
expectType<GreaterThan<10, 2>>(true);
expectType<GreaterThan<10, -2>>(true);
expectType<GreaterThan<2, 2>>(false);
expectType<GreaterThan<-2, -2>>(false);
expectType<GreaterThan<-2, -3>>(true);
expectType<GreaterThan<-2, number>>(never);

expectType<GreaterThan<PositiveInfinity, -999>>(true);
expectType<GreaterThan<PositiveInfinity, 999>>(true);
expectType<GreaterThan<999, PositiveInfinity>>(false);
expectType<GreaterThan<999, NegativeInfinity>>(true);
expectType<GreaterThan<-999, NegativeInfinity>>(true);
expectType<GreaterThan<PositiveInfinity, PositiveInfinity>>(false);
expectType<GreaterThan<NegativeInfinity, NegativeInfinity>>(false);
expectType<GreaterThan<PositiveInfinity, NegativeInfinity>>(true);
