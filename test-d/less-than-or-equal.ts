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

// === bigint ===
expectType<LessThanOrEqual<1n, 2n>>(true);
expectType<LessThanOrEqual<1n, 2>>(true);
expectType<LessThanOrEqual<1, 2n>>(true);
expectType<LessThanOrEqual<-2n, -1>>(true);
expectType<LessThanOrEqual<1n, 1>>(true);
expectType<LessThanOrEqual<1, 1n>>(true);
expectType<LessThanOrEqual<2n, 1n>>(false);
expectType<LessThanOrEqual<2n, 1>>(false);
expectType<LessThanOrEqual<2, 1n>>(false);

expectType<LessThanOrEqual<PositiveInfinity, -999>>(false);
expectType<LessThanOrEqual<PositiveInfinity, -999n>>(false);
expectType<LessThanOrEqual<PositiveInfinity, 999>>(false);
expectType<LessThanOrEqual<PositiveInfinity, 999n>>(false);
expectType<LessThanOrEqual<999, PositiveInfinity>>(true);
expectType<LessThanOrEqual<999n, PositiveInfinity>>(true);
expectType<LessThanOrEqual<999, NegativeInfinity>>(false);
expectType<LessThanOrEqual<999n, NegativeInfinity>>(false);
expectType<LessThanOrEqual<-999, NegativeInfinity>>(false);
expectType<LessThanOrEqual<-999n, NegativeInfinity>>(false);
expectType<LessThanOrEqual<PositiveInfinity, PositiveInfinity>>(true);
expectType<LessThanOrEqual<NegativeInfinity, NegativeInfinity>>(true);
expectType<LessThanOrEqual<PositiveInfinity, NegativeInfinity>>(false);

// Non-literal `number`
expectType<LessThanOrEqual<number, number>>({} as boolean);
expectType<LessThanOrEqual<number, 1>>({} as boolean);
expectType<LessThanOrEqual<1, number>>({} as boolean);

// Non-literal `bigint`
expectType<LessThanOrEqual<bigint, bigint>>({} as boolean);
expectType<LessThanOrEqual<bigint, 1>>({} as boolean);
expectType<LessThanOrEqual<1, bigint>>({} as boolean);
