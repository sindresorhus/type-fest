import {expectType} from 'tsd';
import type {GreaterThanOrEqual} from '../source/greater-than-or-equal';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric';

declare const never: never;

expectType<GreaterThanOrEqual<1, 2>>(false);
expectType<GreaterThanOrEqual<2, 1>>(true);
expectType<GreaterThanOrEqual<10, 2>>(true);
expectType<GreaterThanOrEqual<10, -2>>(true);
expectType<GreaterThanOrEqual<2, 2>>(true);
expectType<GreaterThanOrEqual<-2, -2>>(true);
expectType<GreaterThanOrEqual<-2, -3>>(true);
expectType<GreaterThanOrEqual<-2, number>>(never);

expectType<GreaterThanOrEqual<PositiveInfinity, -999>>(true);
expectType<GreaterThanOrEqual<PositiveInfinity, 999>>(true);
expectType<GreaterThanOrEqual<999, PositiveInfinity>>(false);
expectType<GreaterThanOrEqual<999, NegativeInfinity>>(true);
expectType<GreaterThanOrEqual<-999, NegativeInfinity>>(true);
expectType<GreaterThanOrEqual<PositiveInfinity, PositiveInfinity>>(true);
expectType<GreaterThanOrEqual<NegativeInfinity, NegativeInfinity>>(true);
expectType<GreaterThanOrEqual<PositiveInfinity, NegativeInfinity>>(true);
