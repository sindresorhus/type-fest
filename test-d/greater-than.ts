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

// === bigint ===
expectType<GreaterThan<2n, 1n>>(true);
expectType<GreaterThan<2n, 1>>(true);
expectType<GreaterThan<2, 1n>>(true);
expectType<GreaterThan<-1n, -2>>(true);
expectType<GreaterThan<1n, 2n>>(false);
expectType<GreaterThan<1n, 2>>(false);
expectType<GreaterThan<1, 2n>>(false);
expectType<GreaterThan<1n, 1>>(false);

// === unions ===
expectType<GreaterThan<100 | 200, 50>>(true);
expectType<GreaterThan<25, -100 | -15 | 2 | 21>>(true);
expectType<GreaterThan<10 | 15, -5 | 5>>(true);
expectType<GreaterThan<100n | 200, 50n>>(true);

expectType<GreaterThan<10, 50 | 100>>(false);
expectType<GreaterThan<50 | 25 | 0 | -16, 100>>(false);
expectType<GreaterThan<1 | 2 | 3, 3 | 4>>(false);
expectType<GreaterThan<10n, 50 | 100n>>(false);

expectType<GreaterThan<-10, -90 | 90>>({} as boolean);
expectType<GreaterThan<-16 | 16, 0>>({} as boolean);
expectType<GreaterThan<-4 | 45, 20 | 30>>({} as boolean);
expectType<GreaterThan<1 | -1 | 3, 0 | 2>>({} as boolean);
expectType<GreaterThan<1n | 3, 0 | 2n>>({} as boolean);

expectType<GreaterThan<PositiveInfinity, -999>>(true);
expectType<GreaterThan<PositiveInfinity, -999n>>(true);
expectType<GreaterThan<PositiveInfinity, 999>>(true);
expectType<GreaterThan<PositiveInfinity, 999n>>(true);
expectType<GreaterThan<999, PositiveInfinity>>(false);
expectType<GreaterThan<999n, PositiveInfinity>>(false);
expectType<GreaterThan<999, NegativeInfinity>>(true);
expectType<GreaterThan<999n, NegativeInfinity>>(true);
expectType<GreaterThan<-999, NegativeInfinity>>(true);
expectType<GreaterThan<-999n, NegativeInfinity>>(true);
expectType<GreaterThan<PositiveInfinity, PositiveInfinity>>(false);
expectType<GreaterThan<NegativeInfinity, NegativeInfinity>>(false);
expectType<GreaterThan<PositiveInfinity, NegativeInfinity>>(true);

// Non-literal `number`
expectType<GreaterThan<number, number>>({} as boolean);
expectType<GreaterThan<number, bigint>>({} as boolean);
expectType<GreaterThan<number, 1>>({} as boolean);
expectType<GreaterThan<1, number>>({} as boolean);

// Non-literal `bigint`
expectType<GreaterThan<bigint, bigint>>({} as boolean);
expectType<GreaterThan<bigint, number>>({} as boolean);
expectType<GreaterThan<bigint, 1>>({} as boolean);
expectType<GreaterThan<1, bigint>>({} as boolean);

