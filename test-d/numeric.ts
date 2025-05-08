import {expectType} from 'tsd';
import type {
	Finite,
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

expectType<never>(infinity);
expectType<1>(infinityMixed);

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

expectType<1>(integer);
expectType<1>(integerWithDecimal);
expectType<never>(numberType);
expectType<1 | -1>(integerMixed);
expectType<1e+100>(bigInteger);
expectType<0o10>(octalInteger);
expectType<0b10>(binaryInteger);
expectType<0x10>(hexadecimalInteger);
expectType<never>(nonInteger);
expectType<never>(infinityInteger);
expectType<never>(infinityInteger2);

// Float
declare const float: Float<1.5>;
declare const floatMixed: Float<1 | 1.5 | -1.5>;
declare const nonFloat: Float<1>;
declare const infinityFloat: Float<PositiveInfinity | NegativeInfinity>;

expectType<1.5>(float);
expectType<1.5 | -1.5>(floatMixed);
expectType<never>(nonFloat);
expectType<never>(infinityFloat);

// Negative
declare const negative: Negative<-1 | -1n | 0 | 0n | 1 | 1n>;

expectType<-1 | -1n>(negative);

// NegativeInteger
declare const negativeInteger: NegativeInteger<-1 | 0 | 1>;

expectType<-1>(negativeInteger);

// NegativeFloat
declare const negativeFloat: NegativeFloat<-1.5 | -1 | 0 | 1 | 1.5>;

expectType<-1.5>(negativeFloat);

// NonNegative
declare const nonNegative: NonNegative<-1 | -1n | 0 | 0n | 1 | 1n>;

expectType<0 | 0n | 1 | 1n>(nonNegative);

// NonNegativeInteger
declare const nonNegativeInteger: NonNegativeInteger<-1 | 0 | 1>;

expectType<0 | 1>(nonNegativeInteger);
