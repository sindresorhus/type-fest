import {expectTypeOf} from 'expect-type';
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
} from '../index';

// Finite
declare const infinity: Finite<PositiveInfinity | NegativeInfinity>;
declare const infinityMixed: Finite<1 | PositiveInfinity | NegativeInfinity>;

expectTypeOf(infinity).toEqualTypeOf<never>();
expectTypeOf(infinityMixed).toEqualTypeOf<1>();

// Integer
declare const integer: Integer<1>;
declare const integerMixed: Integer<1 | 1.5>;
declare const nonInteger: Integer<1.5>;
declare const infinityInteger: Integer<PositiveInfinity | NegativeInfinity>;

expectTypeOf(integer).toEqualTypeOf<1>();
expectTypeOf(integerMixed).toEqualTypeOf<never>(); // This may be undesired behavior
expectTypeOf(nonInteger).toEqualTypeOf<never>();
expectTypeOf(infinityInteger).toEqualTypeOf<never>();

// Float
declare const float: Float<1.5>;
declare const floatMixed: Float<1 | 1.5>;
declare const nonFloat: Float<1>;
declare const infinityFloat: Float<PositiveInfinity | NegativeInfinity>;

expectTypeOf(float).toEqualTypeOf<1.5>();
expectTypeOf(floatMixed).toEqualTypeOf<1.5>();
expectTypeOf(nonFloat).toEqualTypeOf<never>();
expectTypeOf(infinityFloat).toEqualTypeOf<PositiveInfinity | NegativeInfinity>(); // According to Number.isInteger

// Negative
declare const negative: Negative<-1 | -1n | 0 | 0n | 1 | 1n>;

expectTypeOf(negative).toEqualTypeOf<-1 | -1n>();

// NegativeInteger
declare const negativeInteger: NegativeInteger<-1 | 0 | 1>;

expectTypeOf(negativeInteger).toEqualTypeOf<-1>();

// NegativeFloat
declare const negativeFloat: NegativeFloat<-1.5 | -1 | 0 | 1 | 1.5>;

expectTypeOf(negativeFloat).toEqualTypeOf<-1.5>();

// NonNegative
declare const nonNegative: NonNegative<-1 | -1n | 0 | 0n | 1 | 1n>;

expectTypeOf(nonNegative).toEqualTypeOf<0 | 0n | 1 | 1n>();

// NonNegativeInteger
declare const nonNegativeInteger: NonNegativeInteger<-1 | 0 | 1>;

expectTypeOf(nonNegativeInteger).toEqualTypeOf<0 | 1>();
