import {expectType} from 'tsd';
import type {GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual, Opaque} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

declare const never: never;

expectType<GreaterThan<1, 2>>(false);
expectType<GreaterThan<2, 1>>(true);
expectType<GreaterThan<10, 2>>(true);
expectType<GreaterThan<10, -2>>(true);
expectType<GreaterThan<2, 2>>(false);
expectType<GreaterThan<-2, -2>>(false);
expectType<GreaterThan<-2, -3>>(true);

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

// Non-literal `number`
expectType<GreaterThan<number, number>>({} as boolean);
expectType<GreaterThan<number, 1>>({} as boolean);
expectType<GreaterThan<1, number>>({} as boolean);

// Decimal fractions are compared by integer part, then fraction padded with zeros.
expectType<GreaterThan<1.1, 1.05>>(true);
expectType<GreaterThan<1.05, 1.1>>(false);
expectType<GreaterThan<1.5, 1.25>>(true);
expectType<GreaterThan<1.25, 1.5>>(false);
expectType<GreaterThan<10.5, 9.99>>(true);
expectType<GreaterThan<100.5, 99.99>>(true);
expectType<GreaterThan<-1.5, -1.05>>(false);
expectType<GreaterThan<-1.05, -1.5>>(true);
expectType<GreaterThan<0.5, 0.05>>(true);

// TypeScript prints numbers of `1e21` and above, and below `1e-6`, in exponential notation. Such a number is larger or smaller than any number in plain decimal notation, so the result is known when only one side is exponential.
declare const exponentGreaterThanPlain: GreaterThan<1e21, 1e20>;
expectType<true>(exponentGreaterThanPlain);
declare const plainGreaterThanExponent: GreaterThan<5, 1e21>;
expectType<false>(plainGreaterThanExponent);
declare const negativeExponentGreaterThanZero: GreaterThan<1e-7, 0>;
expectType<true>(negativeExponentGreaterThanZero);
declare const negativeExponentGreaterThanPlain: GreaterThan<1e-7, 0.000_001>;
expectType<false>(negativeExponentGreaterThanPlain);
declare const plainGreaterThanNegativeExponent: GreaterThan<0.000_001, 1e-7>;
expectType<true>(plainGreaterThanNegativeExponent);
declare const zeroGreaterThanNegativeExponent: GreaterThan<0, 1e-7>;
expectType<false>(zeroGreaterThanNegativeExponent);
declare const exponentGreaterThanNegativeExponent: GreaterThan<1e21, 1e-7>;
expectType<true>(exponentGreaterThanNegativeExponent);
declare const negativeExponentGreaterThanExponent: GreaterThan<1e-7, 1e21>;
expectType<false>(negativeExponentGreaterThanExponent);
declare const negatedExponentGreaterThanPlain: GreaterThan<-1e21, -5>;
expectType<false>(negatedExponentGreaterThanPlain);
declare const plainGreaterThanNegatedExponent: GreaterThan<-5, -1e21>;
expectType<true>(plainGreaterThanNegatedExponent);

// Two numbers that are both in exponential notation can't be compared digit by digit, so the result is `boolean`.
declare const bothExponent: GreaterThan<2e21, 1e21>;
expectType<boolean>(bothExponent);
declare const bothNegativeExponent: GreaterThan<2e-7, 1e-7>;
expectType<boolean>(bothNegativeExponent);

// A branded literal is still a literal, so the comparison reads it correctly. The brand-aware siblings such as `IsNumericLiteral` unwrap it too.
declare const brandedSecond: GreaterThan<0, Opaque<-5, 'A'>>;
expectType<true>(brandedSecond);

declare const brandedFirst: GreaterThan<Opaque<-5, 'A'>, 0>;
expectType<false>(brandedFirst);

// Comparing magnitudes must read the underlying values, not just recognize the signs.
expectType<true>({} as GreaterThan<Opaque<5, 'A'>, 3>);
expectType<false>({} as GreaterThan<3, Opaque<5, 'A'>>);
expectType<true>({} as GreaterThan<Opaque<5, 'A'>, Opaque<3, 'B'>>);
expectType<true>({} as GreaterThan<Opaque<-3, 'A'>, Opaque<-5, 'B'>>);

// Equal underlying values compare equally even when their brands differ.
expectType<true>({} as GreaterThanOrEqual<Opaque<5, 'A'>, Opaque<5, 'B'>>);
expectType<false>({} as LessThan<Opaque<5, 'A'>, Opaque<5, 'B'>>);
expectType<true>({} as LessThanOrEqual<Opaque<5, 'A'>, Opaque<5, 'B'>>);
