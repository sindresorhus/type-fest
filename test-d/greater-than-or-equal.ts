import {expectType} from 'tsd';
import type {GreaterThanOrEqual} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

declare const never: never;

expectType<GreaterThanOrEqual<1, 2>>(false);
expectType<GreaterThanOrEqual<2, 1>>(true);
expectType<GreaterThanOrEqual<10, 2>>(true);
expectType<GreaterThanOrEqual<10, -2>>(true);
expectType<GreaterThanOrEqual<2, 2>>(true);
expectType<GreaterThanOrEqual<-2, -2>>(true);
expectType<GreaterThanOrEqual<-2, -3>>(true);
expectType<GreaterThanOrEqual<-2, number>>(never);

// === unions ===
expectType<GreaterThanOrEqual<100 | 200, 50>>(true);
expectType<GreaterThanOrEqual<25, -100 | -15 | 2 | 21>>(true);
expectType<GreaterThanOrEqual<10 | 15, -5 | 10>>(true);

expectType<GreaterThanOrEqual<10, 50 | 100>>(false);
expectType<GreaterThanOrEqual<50 | 25 | 0 | -16, 100>>(false);
expectType<GreaterThanOrEqual<1 | 2, 3 | 4>>(false);

expectType<GreaterThanOrEqual<-10, -90 | 90>>({} as boolean);
expectType<GreaterThanOrEqual<-16 | 16, 0>>({} as boolean);
expectType<GreaterThanOrEqual<-4 | 45, 20 | 30>>({} as boolean);
expectType<GreaterThanOrEqual<1 | -1 | 3, 0 | 2>>({} as boolean);
expectType<GreaterThanOrEqual<1 | 2 | 3, 3 | 4>>({} as boolean);

expectType<GreaterThanOrEqual<PositiveInfinity, -999>>(true);
expectType<GreaterThanOrEqual<PositiveInfinity, 999>>(true);
expectType<GreaterThanOrEqual<999, PositiveInfinity>>(false);
expectType<GreaterThanOrEqual<999, NegativeInfinity>>(true);
expectType<GreaterThanOrEqual<-999, NegativeInfinity>>(true);
expectType<GreaterThanOrEqual<PositiveInfinity, PositiveInfinity>>(true);
expectType<GreaterThanOrEqual<NegativeInfinity, NegativeInfinity>>(true);
expectType<GreaterThanOrEqual<PositiveInfinity, NegativeInfinity>>(true);
