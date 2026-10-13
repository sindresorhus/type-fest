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
	Tagged,
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
const infinityValue = Infinity;
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

// Multiple tags do not change whether the primitive value is negative.
expectTypeOf<IsNegative<Tagged<Tagged<-5, 'Value'>, 'Validated'>>>().toBe<true>();
expectTypeOf<IsNegative<Tagged<Tagged<5, 'Value'>, 'Validated'>>>().toBe<false>();

// Sign filters preserve the brand on accepted values and reject opposite signs.
type NegativeAmount = Tagged<-5, 'Amount'>;
type PositiveAmount = Tagged<5, 'Amount'>;
expectTypeOf<Negative<NegativeAmount>>().toBe<NegativeAmount>();
expectTypeOf<NonNegative<NegativeAmount>>().toBe<never>();
expectTypeOf<NegativeInteger<NegativeAmount>>().toBe<NegativeAmount>();
expectTypeOf<NonNegativeInteger<NegativeAmount>>().toBe<never>();
expectTypeOf<NegativeFloat<Tagged<-1.5, 'Amount'>>>().toBe<Tagged<-1.5, 'Amount'>>();
expectTypeOf<Negative<PositiveAmount>>().toBe<never>();
expectTypeOf<NonNegative<PositiveAmount>>().toBe<PositiveAmount>();

// Zero remains non-negative, including when branded.
type ZeroAmount = Tagged<0, 'Amount'>;
expectTypeOf<Negative<ZeroAmount>>().toBe<never>();
expectTypeOf<NonNegative<ZeroAmount>>().toBe<ZeroAmount>();
expectTypeOf<NonNegativeInteger<ZeroAmount>>().toBe<ZeroAmount>();

// Bigint signs follow the same filtering rules.
type NegativeBigint = Tagged<-5n, 'Amount'>;
type PositiveBigint = Tagged<5n, 'Amount'>;
expectTypeOf<Negative<NegativeBigint>>().toBe<NegativeBigint>();
expectTypeOf<NonNegative<NegativeBigint>>().toBe<never>();
expectTypeOf<Negative<PositiveBigint>>().toBe<never>();
expectTypeOf<NonNegative<PositiveBigint>>().toBe<PositiveBigint>();

// Distribute before checking the sign and preserve each accepted member's brand.
expectTypeOf<Negative<NegativeAmount | PositiveAmount | ZeroAmount>>().toBe<NegativeAmount>();
expectTypeOf<NonNegative<NegativeAmount | PositiveAmount | ZeroAmount>>().toBe<PositiveAmount | ZeroAmount>();
expectTypeOf<NegativeInteger<NegativeAmount | PositiveAmount | Tagged<-1.5, 'Amount'>>>().toBe<NegativeAmount>();
expectTypeOf<NegativeFloat<NegativeAmount | Tagged<-1.5 | 1.5, 'Amount'>>>().toBe<Tagged<-1.5, 'Amount'>>();

// Sign checks also work for stacked tags and user-defined primitive brands.
type ValidatedNegative = Tagged<NegativeAmount, 'Validated'>;
type CustomNegative = -5 & {readonly __brand: 'Amount'};
expectTypeOf<Negative<ValidatedNegative>>().toBe<ValidatedNegative>();
expectTypeOf<NonNegative<ValidatedNegative>>().toBe<never>();
expectTypeOf<Negative<CustomNegative>>().toBe<CustomNegative>();
expectTypeOf<NonNegative<CustomNegative>>().toBe<never>();
expectTypeOf<Negative<Opaque<-5, 'Amount'>>>().toBe<Opaque<-5, 'Amount'>>();

// Filtering cannot identify a negative member of a widened number.
expectTypeOf<Negative<Tagged<number, 'Amount'>>>().toBe<never>();
expectTypeOf<NonNegative<Tagged<number, 'Amount'>>>().toBe<Tagged<number, 'Amount'>>();
expectTypeOf<Negative<never>>().toBe<never>();
expectTypeOf<NonNegative<never>>().toBe<never>();
