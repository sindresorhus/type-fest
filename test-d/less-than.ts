import {expectType} from 'tsd';
import type {LessThan} from '../index';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric';

declare const never: never;

expectType<LessThan<1, 2>>(true);
expectType<LessThan<2, 1>>(false);
expectType<LessThan<10, 2>>(false);
expectType<LessThan<10, -2>>(false);
expectType<LessThan<2, 2>>(false);
expectType<LessThan<-2, -2>>(false);
expectType<LessThan<-2, -3>>(false);
expectType<LessThan<-2, number>>(never);
expectType<LessThan<PositiveInfinity, -999>>(false);
expectType<LessThan<PositiveInfinity, 999>>(false);
expectType<LessThan<999, PositiveInfinity>>(true);
expectType<LessThan<999, NegativeInfinity>>(false);
expectType<LessThan<-999, NegativeInfinity>>(false);
expectType<LessThan<PositiveInfinity, PositiveInfinity>>(false);
expectType<LessThan<NegativeInfinity, NegativeInfinity>>(false);
expectType<LessThan<PositiveInfinity, NegativeInfinity>>(false);
