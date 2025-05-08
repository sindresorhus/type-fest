import {expectType} from 'tsd';
import type {LessThanOrEqual} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

declare const never: never;

expectType<LessThanOrEqual<1, 2>>(true);
expectType<LessThanOrEqual<2, 1>>(false);
expectType<LessThanOrEqual<10, 2>>(false);
expectType<LessThanOrEqual<10, -2>>(false);
expectType<LessThanOrEqual<2, 2>>(true);
expectType<LessThanOrEqual<-2, -2>>(true);
expectType<LessThanOrEqual<-2, -3>>(false);
expectType<LessThanOrEqual<-2, number>>(never);
expectType<LessThanOrEqual<PositiveInfinity, -999>>(false);
expectType<LessThanOrEqual<PositiveInfinity, 999>>(false);
expectType<LessThanOrEqual<999, PositiveInfinity>>(true);
expectType<LessThanOrEqual<999, NegativeInfinity>>(false);
expectType<LessThanOrEqual<-999, NegativeInfinity>>(false);
expectType<LessThanOrEqual<PositiveInfinity, PositiveInfinity>>(true);
expectType<LessThanOrEqual<NegativeInfinity, NegativeInfinity>>(true);
expectType<LessThanOrEqual<PositiveInfinity, NegativeInfinity>>(false);
