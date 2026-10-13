import {expectTypeOf} from 'nz';
import type {GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual, Opaque, Tagged} from '../index.d.ts';
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
declare const negativeExponentGreaterThanPlain: GreaterThan<1e-7, 0.000001>;
expectTypeOf(negativeExponentGreaterThanPlain).toBe<false>();
declare const plainGreaterThanNegativeExponent: GreaterThan<0.000001, 1e-7>;
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

// Comparison uses the primitive values under every tag layer.
expectTypeOf<GreaterThan<Tagged<Tagged<5, 'Value'>, 'Validated'>, 3>>().toBe<true>();
expectTypeOf<GreaterThan<3, Tagged<Tagged<5, 'Value'>, 'Validated'>>>().toBe<false>();
expectTypeOf<GreaterThanOrEqual<Tagged<Tagged<5, 'Value'>, 'Validated'>, 5>>().toBe<true>();

// Works with `bigint`, and with a `bigint` compared to a `number`.
expectTypeOf<GreaterThan<2n, 1n>>().toBe<true>();
expectTypeOf<GreaterThan<2n, 1>>().toBe<true>();
expectTypeOf<GreaterThan<2, 1n>>().toBe<true>();
expectTypeOf<GreaterThan<-1n, -2>>().toBe<true>();
expectTypeOf<GreaterThan<1n, 2n>>().toBe<false>();
expectTypeOf<GreaterThan<1n, 2>>().toBe<false>();
expectTypeOf<GreaterThan<1, 2n>>().toBe<false>();
expectTypeOf<GreaterThan<1n, 1>>().toBe<false>();

expectTypeOf<GreaterThan<100n | 200, 50n>>().toBe<true>();
expectTypeOf<GreaterThan<10n, 50 | 100n>>().toBe<false>();
expectTypeOf<GreaterThan<1n | 3, 0 | 2n>>().toBe<boolean>();
expectTypeOf<GreaterThan<PositiveInfinity, -999n>>().toBe<true>();
expectTypeOf<GreaterThan<PositiveInfinity, 999n>>().toBe<true>();
expectTypeOf<GreaterThan<999n, PositiveInfinity>>().toBe<false>();
expectTypeOf<GreaterThan<999n, NegativeInfinity>>().toBe<true>();
expectTypeOf<GreaterThan<-999n, NegativeInfinity>>().toBe<true>();
expectTypeOf<GreaterThan<number, bigint>>().toBe<boolean>();

// Non-literal `bigint`
expectTypeOf<GreaterThan<bigint, bigint>>().toBe<boolean>();
expectTypeOf<GreaterThan<bigint, number>>().toBe<boolean>();
expectTypeOf<GreaterThan<bigint, 1>>().toBe<boolean>();
expectTypeOf<GreaterThan<1, bigint>>().toBe<boolean>();

// An infinity compared to the non-literal `bigint` is `boolean` too, like the non-literal `number`, to keep the rule simple.
expectTypeOf<GreaterThan<PositiveInfinity, bigint>>().toBe<boolean>();
expectTypeOf<GreaterThan<bigint, PositiveInfinity>>().toBe<boolean>();
expectTypeOf<GreaterThan<NegativeInfinity, bigint>>().toBe<boolean>();
expectTypeOf<GreaterThan<bigint, NegativeInfinity>>().toBe<boolean>();

// A `bigint` compares with a decimal `number` by value.
expectTypeOf<GreaterThan<2n, 1.5>>().toBe<true>();
expectTypeOf<GreaterThan<1.5, 2n>>().toBe<false>();
expectTypeOf<GreaterThan<-1n, -1.5>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<5n, 5>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<5, 5n>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<1n, 1.5>>().toBe<false>();
expectTypeOf<LessThan<1n, 1.5>>().toBe<true>();
expectTypeOf<LessThanOrEqual<2n, 1.5>>().toBe<false>();
expectTypeOf<GreaterThan<0n, -0>>().toBe<false>();
expectTypeOf<GreaterThanOrEqual<0n, -0>>().toBe<true>();

// Large `bigint` values beyond `Number.MAX_SAFE_INTEGER` are compared digit by digit.
expectTypeOf<GreaterThan<123_456_789_012_345_678_901_234_567_890n, 123_456_789_012_345_678_901_234_567_889n>>().toBe<true>();
expectTypeOf<LessThan<-123_456_789_012_345_678_901_234_567_890n, -123_456_789_012_345_678_901_234_567_889n>>().toBe<true>();

// Branded `bigint` values are unwrapped.
expectTypeOf<GreaterThan<Tagged<5n, 'A'>, 3n>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<3n, Tagged<3n, 'A'>>>().toBe<true>();

// `never` is not a value, so there is nothing to compare.
expectTypeOf<GreaterThan<never, 1n>>().toBe<never>();

// `any` could be any value, so the result is `boolean`, as with a `number`.
expectTypeOf<GreaterThan<any, 1n>>().toBe<boolean>();
expectTypeOf<GreaterThan<1n, any>>().toBe<boolean>();

// A `bigint` against a `number` of `1e+21` and above is `boolean`, because the `number` is printed in exponential notation and cannot be compared digit by digit. A smaller exponent is still decided.
expectTypeOf<GreaterThan<1_000_000_000_000_000_000_001n, 1e21>>().toBe<boolean>();
expectTypeOf<GreaterThan<1e21, 1_000_000_000_000_000_000_000n>>().toBe<boolean>();
expectTypeOf<GreaterThan<-1_000_000_000_000_000_000_000n, -1e21>>().toBe<boolean>();
expectTypeOf<GreaterThanOrEqual<1_000_000_000_000_000_000_000n, 1e21>>().toBe<boolean>();
expectTypeOf<LessThan<1e21, 1_000_000_000_000_000_000_001n>>().toBe<boolean>();
expectTypeOf<LessThanOrEqual<1e21, 1_000_000_000_000_000_000_000n>>().toBe<boolean>();
expectTypeOf<GreaterThan<1e-7, 0n>>().toBe<true>();
expectTypeOf<GreaterThan<1e-7, 1n>>().toBe<false>();
