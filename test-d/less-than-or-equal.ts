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
expectType<LessThanOrEqual<PositiveInfinity, -999>>(false);
expectType<LessThanOrEqual<PositiveInfinity, 999>>(false);
expectType<LessThanOrEqual<999, PositiveInfinity>>(true);
expectType<LessThanOrEqual<999, NegativeInfinity>>(false);
expectType<LessThanOrEqual<-999, NegativeInfinity>>(false);
expectType<LessThanOrEqual<PositiveInfinity, PositiveInfinity>>(true);
expectType<LessThanOrEqual<NegativeInfinity, NegativeInfinity>>(true);
expectType<LessThanOrEqual<PositiveInfinity, NegativeInfinity>>(false);

// Non-literal `number`
expectType<LessThanOrEqual<number, number>>({} as boolean);
expectType<LessThanOrEqual<number, 1>>({} as boolean);
expectType<LessThanOrEqual<1, number>>({} as boolean);

// A number in exponential notation is larger or smaller than any number in plain decimal notation.
declare const plainLessThanOrEqualExponent: LessThanOrEqual<5, 1e21>;
expectType<true>(plainLessThanOrEqualExponent);
declare const exponentLessThanOrEqualPlain: LessThanOrEqual<1e21, 5>;
expectType<false>(exponentLessThanOrEqualPlain);
declare const negativeExponentLessThanOrEqualPlain: LessThanOrEqual<1e-7, 0.5>;
expectType<true>(negativeExponentLessThanOrEqualPlain);
declare const bothExponent: LessThanOrEqual<1e21, 2e21>;
expectType<boolean>(bothExponent);
