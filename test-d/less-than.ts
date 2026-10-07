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
expectType<LessThan<1, 1 | 2>>({} as boolean);

expectType<LessThan<PositiveInfinity, -999>>(false);
expectType<LessThan<PositiveInfinity, 999>>(false);
expectType<LessThan<999, PositiveInfinity>>(true);
expectType<LessThan<999, NegativeInfinity>>(false);
expectType<LessThan<-999, NegativeInfinity>>(false);
expectType<LessThan<PositiveInfinity, PositiveInfinity>>(false);
expectType<LessThan<NegativeInfinity, NegativeInfinity>>(false);
expectType<LessThan<PositiveInfinity, NegativeInfinity>>(false);

// Non-literal `number`
expectType<LessThan<number, number>>({} as boolean);
expectType<LessThan<number, 1>>({} as boolean);
expectType<LessThan<1, number>>({} as boolean);

// Decimal fractions are compared by integer part, then fraction padded with zeros.
expectType<LessThan<1.05, 1.1>>(true);
expectType<LessThan<1.25, 1.5>>(true);
expectType<LessThan<-1.5, -1.05>>(true);
expectType<LessThan<0.05, 0.5>>(true);

// A number in exponential notation is larger or smaller than any number in plain decimal notation, so the result is known when only one side is exponential.
declare const plainLessThanExponent: LessThan<1e20, 1e21>;
expectType<true>(plainLessThanExponent);
declare const smallPlainLessThanExponent: LessThan<5, 1e21>;
expectType<true>(smallPlainLessThanExponent);
declare const negativeExponentLessThanPlain: LessThan<1e-7, 1>;
expectType<true>(negativeExponentLessThanPlain);
declare const zeroLessThanNegativeExponent: LessThan<0, 1e-7>;
expectType<true>(zeroLessThanNegativeExponent);

// Two numbers that are both in exponential notation can't be compared digit by digit, so the result is `boolean`.
declare const bothExponent: LessThan<1e21, 2e21>;
expectType<boolean>(bothExponent);
