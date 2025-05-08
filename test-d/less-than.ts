import {expectType} from 'tsd';
import type {LessThan} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

declare const never: never;

expectType<LessThan<1, 2>>(true);
expectType<LessThan<2, 1>>(false);
expectType<LessThan<10, 2>>(false);
expectType<LessThan<10, -2>>(false);
expectType<LessThan<2, 2>>(false);
expectType<LessThan<-2, -2>>(false);
expectType<LessThan<-2, -3>>(false);
expectType<LessThan<-2, number>>(never);

// === unions ===
expectType<LessThan<10, 50 | 100>>(true);
expectType<LessThan<50 | 25 | 0 | -16, 100>>(true);
expectType<LessThan<1 | 2, 3 | 4>>(true);

expectType<LessThan<100 | 200, 50>>(false);
expectType<LessThan<25, -100 | -15 | 2 | 21>>(false);
expectType<LessThan<10 | 15, -5 | 10>>(false);

expectType<LessThan<-10, -90 | 90>>({} as boolean);
expectType<LessThan<-16 | 16, 0>>({} as boolean);
expectType<LessThan<-4 | 45, 20 | 30>>({} as boolean);
expectType<LessThan<1 | -1 | 3, 0 | 2>>({} as boolean);

expectType<LessThan<PositiveInfinity, -999>>(false);
expectType<LessThan<PositiveInfinity, 999>>(false);
expectType<LessThan<999, PositiveInfinity>>(true);
expectType<LessThan<999, NegativeInfinity>>(false);
expectType<LessThan<-999, NegativeInfinity>>(false);
expectType<LessThan<PositiveInfinity, PositiveInfinity>>(false);
expectType<LessThan<NegativeInfinity, NegativeInfinity>>(false);
expectType<LessThan<PositiveInfinity, NegativeInfinity>>(false);
