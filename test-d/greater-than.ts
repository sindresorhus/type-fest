import {expectTypeOf} from 'nz';
import type {GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual, Opaque} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

declare const never: never;

expectTypeOf<GreaterThan<1, 2>>().toBe<false>();
expectTypeOf<GreaterThan<2, 1>>().toBe<true>();
expectTypeOf<GreaterThan<10, 2>>().toBe<true>();
expectTypeOf<GreaterThan<10, -2>>().toBe<true>();
expectTypeOf<GreaterThan<2, 2>>().toBe<false>();
expectTypeOf<GreaterThan<-2, -2>>().toBe<false>();
expectTypeOf<GreaterThan<-2, -3>>().toBe<true>();

// === unions ===
expectTypeOf<GreaterThan<100 | 200, 50>>().toBe<true>();
expectTypeOf<GreaterThan<25, -100 | -15 | 2 | 21>>().toBe<true>();
expectTypeOf<GreaterThan<10 | 15, -5 | 5>>().toBe<true>();

expectTypeOf<GreaterThan<10, 50 | 100>>().toBe<false>();
expectTypeOf<GreaterThan<50 | 25 | 0 | -16, 100>>().toBe<false>();
expectTypeOf<GreaterThan<1 | 2 | 3, 3 | 4>>().toBe<false>();

expectTypeOf<boolean>().toBe<GreaterThan<-10, -90 | 90>>();
expectTypeOf<boolean>().toBe<GreaterThan<-16 | 16, 0>>();
expectTypeOf<boolean>().toBe<GreaterThan<-4 | 45, 20 | 30>>();
expectTypeOf<boolean>().toBe<GreaterThan<1 | -1 | 3, 0 | 2>>();

expectTypeOf<GreaterThan<PositiveInfinity, -999>>().toBe<true>();
expectTypeOf<GreaterThan<PositiveInfinity, 999>>().toBe<true>();
expectTypeOf<GreaterThan<999, PositiveInfinity>>().toBe<false>();
expectTypeOf<GreaterThan<999, NegativeInfinity>>().toBe<true>();
expectTypeOf<GreaterThan<-999, NegativeInfinity>>().toBe<true>();
expectTypeOf<GreaterThan<PositiveInfinity, PositiveInfinity>>().toBe<false>();
expectTypeOf<GreaterThan<NegativeInfinity, NegativeInfinity>>().toBe<false>();
expectTypeOf<GreaterThan<PositiveInfinity, NegativeInfinity>>().toBe<true>();

// Non-literal `number`
expectTypeOf<boolean>().toBe<GreaterThan<number, number>>();
expectTypeOf<boolean>().toBe<GreaterThan<number, 1>>();
expectTypeOf<boolean>().toBe<GreaterThan<1, number>>();

// Decimal fractions are compared by integer part, then fraction padded with zeros.
expectTypeOf<GreaterThan<1.1, 1.05>>().toBe<true>();
expectTypeOf<GreaterThan<1.05, 1.1>>().toBe<false>();
expectTypeOf<GreaterThan<1.5, 1.25>>().toBe<true>();
expectTypeOf<GreaterThan<1.25, 1.5>>().toBe<false>();
expectTypeOf<GreaterThan<10.5, 9.99>>().toBe<true>();
expectTypeOf<GreaterThan<100.5, 99.99>>().toBe<true>();
expectTypeOf<GreaterThan<-1.5, -1.05>>().toBe<false>();
expectTypeOf<GreaterThan<-1.05, -1.5>>().toBe<true>();
expectTypeOf<GreaterThan<0.5, 0.05>>().toBe<true>();

// TypeScript prints numbers of `1e21` and above, and below `1e-6`, in exponential notation. Such a number is larger or smaller than any number in plain decimal notation, so the result is known when only one side is exponential.
declare const exponentGreaterThanPlain: GreaterThan<1e21, 1e20>;
expectTypeOf(exponentGreaterThanPlain).toBe<true>();
declare const plainGreaterThanExponent: GreaterThan<5, 1e21>;
expectTypeOf(plainGreaterThanExponent).toBe<false>();
declare const negativeExponentGreaterThanZero: GreaterThan<1e-7, 0>;
expectTypeOf(negativeExponentGreaterThanZero).toBe<true>();
declare const negativeExponentGreaterThanPlain: GreaterThan<1e-7, 0.000_001>;
expectTypeOf(negativeExponentGreaterThanPlain).toBe<false>();
declare const plainGreaterThanNegativeExponent: GreaterThan<0.000_001, 1e-7>;
expectTypeOf(plainGreaterThanNegativeExponent).toBe<true>();
declare const zeroGreaterThanNegativeExponent: GreaterThan<0, 1e-7>;
expectTypeOf(zeroGreaterThanNegativeExponent).toBe<false>();
declare const exponentGreaterThanNegativeExponent: GreaterThan<1e21, 1e-7>;
expectTypeOf(exponentGreaterThanNegativeExponent).toBe<true>();
declare const negativeExponentGreaterThanExponent: GreaterThan<1e-7, 1e21>;
expectTypeOf(negativeExponentGreaterThanExponent).toBe<false>();
declare const negatedExponentGreaterThanPlain: GreaterThan<-1e21, -5>;
expectTypeOf(negatedExponentGreaterThanPlain).toBe<false>();
declare const plainGreaterThanNegatedExponent: GreaterThan<-5, -1e21>;
expectTypeOf(plainGreaterThanNegatedExponent).toBe<true>();

// Two numbers that are both in exponential notation can't be compared digit by digit, so the result is `boolean`.
declare const bothExponent: GreaterThan<2e21, 1e21>;
expectTypeOf(bothExponent).toBe<boolean>();
declare const bothNegativeExponent: GreaterThan<2e-7, 1e-7>;
expectTypeOf(bothNegativeExponent).toBe<boolean>();

// A branded literal is still a literal, so the comparison reads it correctly. The brand-aware siblings such as `IsNumericLiteral` unwrap it too.
declare const brandedSecond: GreaterThan<0, Opaque<-5, 'A'>>;
expectTypeOf(brandedSecond).toBe<true>();

declare const brandedFirst: GreaterThan<Opaque<-5, 'A'>, 0>;
expectTypeOf(brandedFirst).toBe<false>();

// Comparing magnitudes must read the underlying values, not just recognize the signs.
expectTypeOf<GreaterThan<Opaque<5, 'A'>, 3>>().toBe<true>();
expectTypeOf<GreaterThan<3, Opaque<5, 'A'>>>().toBe<false>();
expectTypeOf<GreaterThan<Opaque<5, 'A'>, Opaque<3, 'B'>>>().toBe<true>();
expectTypeOf<GreaterThan<Opaque<-3, 'A'>, Opaque<-5, 'B'>>>().toBe<true>();

// Equal underlying values compare equally even when their brands differ.
expectTypeOf<GreaterThanOrEqual<Opaque<5, 'A'>, Opaque<5, 'B'>>>().toBe<true>();
expectTypeOf<LessThan<Opaque<5, 'A'>, Opaque<5, 'B'>>>().toBe<false>();
expectTypeOf<LessThanOrEqual<Opaque<5, 'A'>, Opaque<5, 'B'>>>().toBe<true>();
