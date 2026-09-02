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

// === bigint ===
expectType<LessThan<1n, 2n>>(true);
expectType<LessThan<1n, 2>>(true);
expectType<LessThan<1, 2n>>(true);
expectType<LessThan<-2n, -1>>(true);
expectType<LessThan<2n, 1n>>(false);
expectType<LessThan<2n, 1>>(false);
expectType<LessThan<2, 1n>>(false);
expectType<LessThan<1n, 1>>(false);

// === unions ===
expectType<LessThan<10, 50 | 100>>(true);
expectType<LessThan<50 | 25 | 0 | -16, 100>>(true);
expectType<LessThan<1 | 2, 3 | 4>>(true);
expectType<LessThan<10n, 50 | 100n>>(true);

expectType<LessThan<100 | 200, 50>>(false);
expectType<LessThan<25, -100 | -15 | 2 | 21>>(false);
expectType<LessThan<10 | 15, -5 | 10>>(false);
expectType<LessThan<100n | 200, 50n>>(false);

expectType<LessThan<-10, -90 | 90>>({} as boolean);
expectType<LessThan<-16 | 16, 0>>({} as boolean);
expectType<LessThan<-4 | 45, 20 | 30>>({} as boolean);
expectType<LessThan<1 | -1 | 3, 0 | 2>>({} as boolean);
expectType<LessThan<1, 1 | 2>>({} as boolean);
expectType<LessThan<1n | 3, 0 | 2n>>({} as boolean);

expectType<LessThan<PositiveInfinity, -999>>(false);
expectType<LessThan<PositiveInfinity, -999n>>(false);
expectType<LessThan<PositiveInfinity, 999>>(false);
expectType<LessThan<PositiveInfinity, 999n>>(false);
expectType<LessThan<999, PositiveInfinity>>(true);
expectType<LessThan<999n, PositiveInfinity>>(true);
expectType<LessThan<999, NegativeInfinity>>(false);
expectType<LessThan<999n, NegativeInfinity>>(false);
expectType<LessThan<-999, NegativeInfinity>>(false);
expectType<LessThan<-999n, NegativeInfinity>>(false);
expectType<LessThan<PositiveInfinity, PositiveInfinity>>(false);
expectType<LessThan<NegativeInfinity, NegativeInfinity>>(false);
expectType<LessThan<PositiveInfinity, NegativeInfinity>>(false);

// Non-literal `number`
expectType<LessThan<number, number>>({} as boolean);
expectType<LessThan<number, bigint>>({} as boolean);
expectType<LessThan<number, 1>>({} as boolean);
expectType<LessThan<1, number>>({} as boolean);

// Non-literal `bigint`
expectType<LessThan<bigint, bigint>>({} as boolean);
expectType<LessThan<bigint, number>>({} as boolean);
expectType<LessThan<bigint, 1>>({} as boolean);
expectType<LessThan<1, bigint>>({} as boolean);

expectType<LessThan<PositiveInfinity, bigint>>({} as false);
expectType<LessThan<bigint, PositiveInfinity>>({} as true);
expectType<LessThan<NegativeInfinity, bigint>>({} as true);
expectType<LessThan<bigint, NegativeInfinity>>({} as false);
