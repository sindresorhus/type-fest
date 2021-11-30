import {expectType} from 'tsd';
import {Finite, Integer, Negative, NegativeInfinity, NegativeInteger, NonNegative, NonNegativeInteger, PositiveInfinity} from '../index';

// Finite
declare const infinity: Finite<PositiveInfinity | NegativeInfinity>;
declare const infinityMixed: Finite<1 | PositiveInfinity | NegativeInfinity>;

expectType<never>(infinity);
expectType<1>(infinityMixed);

// Integer
declare const integer: Integer<1>;
declare const integerMixed: Integer<1 | 1.5>;
declare const nonInteger: Integer<1.5>;
declare const infinityInteger: Integer<PositiveInfinity | NegativeInfinity>;

expectType<1>(integer);
expectType<never>(integerMixed); // This may be undesired behavior
expectType<never>(nonInteger);
expectType<never>(infinityInteger);

// Negative
declare const negative: Negative<-1 | -1n | 0 | 0n | 1 | 1n>;

expectType<-1 | -1n>(negative);

// NegativeInteger
declare const negativeInteger: NegativeInteger<-1 | 0 | 1>;

expectType<-1>(negativeInteger);

// NonNegative
declare const nonNegative: NonNegative<-1 | -1n | 0 | 0n | 1 | 1n>;

expectType<0 | 0n | 1 | 1n>(nonNegative);

// NonNegativeInteger
declare const nonNegativeInteger: NonNegativeInteger<-1 | 0 | 1>;

expectType<0 | 1>(nonNegativeInteger);
