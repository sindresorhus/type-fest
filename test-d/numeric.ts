import {expectTypeOf} from 'nz';
import type {
	Finite,
	IsNegative,
	Opaque,
	Float,
	Integer,
	Negative,
	NegativeFloat,
	NegativeInfinity,
	NegativeInteger,
	NonNegative,
	NonNegativeInteger,
	PositiveInfinity,
} from '../index.d.ts';

// Finite
declare const infinity: Finite<PositiveInfinity | NegativeInfinity>;
declare const infinityMixed: Finite<1 | PositiveInfinity | NegativeInfinity>;

expectTypeOf(infinity).toBe<never>();
expectTypeOf(infinityMixed).toBe<1>();

// Integer
declare const integer: Integer<1>;
declare const integerWithDecimal: Integer<1.0>; // eslint-disable-line unicorn/no-zero-fractions
declare const numberType: Integer<number>;
declare const integerMixed: Integer<1 | 1.5 | -1>;
declare const bigInteger: Integer<1e+100>;
declare const octalInteger: Integer<0o10>;
declare const binaryInteger: Integer<0b10>;
declare const hexadecimalInteger: Integer<0x10>;
declare const nonInteger: Integer<1.5>;
declare const infinityInteger: Integer<PositiveInfinity | NegativeInfinity>;
const infinityValue = Number.POSITIVE_INFINITY;
declare const infinityInteger2: Integer<typeof infinityValue>;

expectTypeOf(integer).toBe<1>();
expectTypeOf(integerWithDecimal).toBe<1>();
expectTypeOf(numberType).toBe<never>();
expectTypeOf(integerMixed).toBe<1 | -1>();
expectTypeOf(bigInteger).toBe<1e+100>();
expectTypeOf(octalInteger).toBe<0o10>();
expectTypeOf(binaryInteger).toBe<0b10>();
expectTypeOf(hexadecimalInteger).toBe<0x10>();
expectTypeOf(nonInteger).toBe<never>();
expectTypeOf(infinityInteger).toBe<never>();
expectTypeOf(infinityInteger2).toBe<never>();

// Float
declare const float: Float<1.5>;
declare const floatMixed: Float<1 | 1.5 | -1.5>;
declare const nonFloat: Float<1>;
declare const infinityFloat: Float<PositiveInfinity | NegativeInfinity>;

expectTypeOf(float).toBe<1.5>();
expectTypeOf(floatMixed).toBe<1.5 | -1.5>();
expectTypeOf(nonFloat).toBe<never>();
expectTypeOf(infinityFloat).toBe<never>();

// Negative
declare const negative: Negative<-1 | -1n | 0 | 0n | 1 | 1n>;

expectTypeOf(negative).toBe<-1 | -1n>();

// NegativeInteger
declare const negativeInteger: NegativeInteger<-1 | 0 | 1>;

expectTypeOf(negativeInteger).toBe<-1>();

// NegativeFloat
declare const negativeFloat: NegativeFloat<-1.5 | -1 | 0 | 1 | 1.5>;

expectTypeOf(negativeFloat).toBe<-1.5>();

// NonNegative
declare const nonNegative: NonNegative<-1 | -1n | 0 | 0n | 1 | 1n>;

expectTypeOf(nonNegative).toBe<0 | 0n | 1 | 1n>();

// NonNegativeInteger
declare const nonNegativeInteger: NonNegativeInteger<-1 | 0 | 1>;

expectTypeOf(nonNegativeInteger).toBe<0 | 1>();

// A branded literal is still a literal, so the brand is removed before the checks run.
declare const brandedNegative: IsNegative<Opaque<-5, 'A'>>;
expectTypeOf(brandedNegative).toBe<true>();

declare const brandedPositive: IsNegative<Opaque<5, 'A'>>;
expectTypeOf(brandedPositive).toBe<false>();
