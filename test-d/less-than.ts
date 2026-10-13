import {expectTypeOf} from 'nz';
import type {LessThan} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

declare const never: never;

expectTypeOf<LessThan<1, 2>>().toBe<true>();
expectTypeOf<LessThan<2, 1>>().toBe<false>();
expectTypeOf<LessThan<10, 2>>().toBe<false>();
expectTypeOf<LessThan<10, -2>>().toBe<false>();
expectTypeOf<LessThan<2, 2>>().toBe<false>();
expectTypeOf<LessThan<-2, -2>>().toBe<false>();
expectTypeOf<LessThan<-2, -3>>().toBe<false>();

// === unions ===
expectTypeOf<LessThan<10, 50 | 100>>().toBe<true>();
expectTypeOf<LessThan<50 | 25 | 0 | -16, 100>>().toBe<true>();
expectTypeOf<LessThan<1 | 2, 3 | 4>>().toBe<true>();

expectTypeOf<LessThan<100 | 200, 50>>().toBe<false>();
expectTypeOf<LessThan<25, -100 | -15 | 2 | 21>>().toBe<false>();
expectTypeOf<LessThan<10 | 15, -5 | 10>>().toBe<false>();

expectTypeOf<boolean>().toBe<LessThan<-10, -90 | 90>>();
expectTypeOf<boolean>().toBe<LessThan<-16 | 16, 0>>();
expectTypeOf<boolean>().toBe<LessThan<-4 | 45, 20 | 30>>();
expectTypeOf<boolean>().toBe<LessThan<1 | -1 | 3, 0 | 2>>();
expectTypeOf<boolean>().toBe<LessThan<1, 1 | 2>>();

expectTypeOf<LessThan<PositiveInfinity, -999>>().toBe<false>();
expectTypeOf<LessThan<PositiveInfinity, 999>>().toBe<false>();
expectTypeOf<LessThan<999, PositiveInfinity>>().toBe<true>();
expectTypeOf<LessThan<999, NegativeInfinity>>().toBe<false>();
expectTypeOf<LessThan<-999, NegativeInfinity>>().toBe<false>();
expectTypeOf<LessThan<PositiveInfinity, PositiveInfinity>>().toBe<false>();
expectTypeOf<LessThan<NegativeInfinity, NegativeInfinity>>().toBe<false>();
expectTypeOf<LessThan<PositiveInfinity, NegativeInfinity>>().toBe<false>();

// Non-literal `number`
expectTypeOf<boolean>().toBe<LessThan<number, number>>();
expectTypeOf<boolean>().toBe<LessThan<number, 1>>();
expectTypeOf<boolean>().toBe<LessThan<1, number>>();

// Decimal fractions are compared by integer part, then fraction padded with zeros.
expectTypeOf<LessThan<1.05, 1.1>>().toBe<true>();
expectTypeOf<LessThan<1.25, 1.5>>().toBe<true>();
expectTypeOf<LessThan<-1.5, -1.05>>().toBe<true>();
expectTypeOf<LessThan<0.05, 0.5>>().toBe<true>();

// A number in exponential notation is larger or smaller than any number in plain decimal notation, so the result is known when only one side is exponential.
declare const plainLessThanExponent: LessThan<1e20, 1e21>;
expectTypeOf(plainLessThanExponent).toBe<true>();
declare const smallPlainLessThanExponent: LessThan<5, 1e21>;
expectTypeOf(smallPlainLessThanExponent).toBe<true>();
declare const negativeExponentLessThanPlain: LessThan<1e-7, 1>;
expectTypeOf(negativeExponentLessThanPlain).toBe<true>();
declare const zeroLessThanNegativeExponent: LessThan<0, 1e-7>;
expectTypeOf(zeroLessThanNegativeExponent).toBe<true>();

// Two numbers that are both in exponential notation can't be compared digit by digit, so the result is `boolean`.
declare const bothExponent: LessThan<1e21, 2e21>;
expectTypeOf(bothExponent).toBe<boolean>();

// Works with `bigint`, and with a `bigint` compared to a `number`.
expectTypeOf<LessThan<1n, 2n>>().toBe<true>();
expectTypeOf<LessThan<1n, 2>>().toBe<true>();
expectTypeOf<LessThan<1, 2n>>().toBe<true>();
expectTypeOf<LessThan<-2n, -1>>().toBe<true>();
expectTypeOf<LessThan<2n, 1n>>().toBe<false>();
expectTypeOf<LessThan<2n, 1>>().toBe<false>();
expectTypeOf<LessThan<2, 1n>>().toBe<false>();
expectTypeOf<LessThan<1n, 1>>().toBe<false>();

expectTypeOf<LessThan<10n, 50 | 100n>>().toBe<true>();
expectTypeOf<LessThan<100n | 200, 50n>>().toBe<false>();
expectTypeOf<LessThan<1n | 3, 0 | 2n>>().toBe<boolean>();
expectTypeOf<LessThan<PositiveInfinity, -999n>>().toBe<false>();
expectTypeOf<LessThan<PositiveInfinity, 999n>>().toBe<false>();
expectTypeOf<LessThan<999n, PositiveInfinity>>().toBe<true>();
expectTypeOf<LessThan<999n, NegativeInfinity>>().toBe<false>();
expectTypeOf<LessThan<-999n, NegativeInfinity>>().toBe<false>();
expectTypeOf<LessThan<number, bigint>>().toBe<boolean>();

// Non-literal `bigint`
expectTypeOf<LessThan<bigint, bigint>>().toBe<boolean>();
expectTypeOf<LessThan<bigint, number>>().toBe<boolean>();
expectTypeOf<LessThan<bigint, 1>>().toBe<boolean>();
expectTypeOf<LessThan<1, bigint>>().toBe<boolean>();

expectTypeOf<LessThan<PositiveInfinity, bigint>>().toBe<boolean>();
expectTypeOf<LessThan<bigint, PositiveInfinity>>().toBe<boolean>();
expectTypeOf<LessThan<NegativeInfinity, bigint>>().toBe<boolean>();
expectTypeOf<LessThan<bigint, NegativeInfinity>>().toBe<boolean>();
