import {expectType} from 'tsd';
import type {GreaterThan} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

declare const never: never;

expectType<GreaterThan<1, 2>>(false);
expectType<GreaterThan<2, 1>>(true);
expectType<GreaterThan<10, 2>>(true);
expectType<GreaterThan<10, -2>>(true);
expectType<GreaterThan<2, 2>>(false);
expectType<GreaterThan<-2, -2>>(false);
expectType<GreaterThan<-2, -3>>(true);
expectType<GreaterThan<-2, number>>(never);

// === unions ===
expectType<GreaterThan<100 | 200, 50>>(true);
expectType<GreaterThan<25, -100 | -15 | 2 | 21>>(true);
expectType<GreaterThan<10 | 15, -5 | 5>>(true);

expectType<GreaterThan<10, 50 | 100>>(false);
expectType<GreaterThan<50 | 25 | 0 | -16, 100>>(false);
expectType<GreaterThan<1 | 2 | 3, 3 | 4>>(false);

expectType<GreaterThan<-10, -90 | 90>>({} as boolean);
expectType<GreaterThan<-16 | 16, 0>>({} as boolean);
expectType<GreaterThan<-4 | 45, 20 | 30>>({} as boolean);
expectType<GreaterThan<1 | -1 | 3, 0 | 2>>({} as boolean);

expectType<GreaterThan<PositiveInfinity, -999>>(true);
expectType<GreaterThan<PositiveInfinity, 999>>(true);
expectType<GreaterThan<999, PositiveInfinity>>(false);
expectType<GreaterThan<999, NegativeInfinity>>(true);
expectType<GreaterThan<-999, NegativeInfinity>>(true);
expectType<GreaterThan<PositiveInfinity, PositiveInfinity>>(false);
expectType<GreaterThan<NegativeInfinity, NegativeInfinity>>(false);
expectType<GreaterThan<PositiveInfinity, NegativeInfinity>>(true);
