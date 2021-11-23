import {expectType} from 'tsd';
import {Finite, Integer, Natural, Negative, NegativeInfinity, NegativeInteger, Positive, PositiveInfinity, PositiveInteger} from '../index';

// Finite
declare const infinity: Finite<PositiveInfinity | NegativeInfinity>;
declare const infinityMixed: Finite<1 | PositiveInfinity | NegativeInfinity>;

expectType<never>(infinity);
expectType<1 | PositiveInfinity | NegativeInfinity>(infinityMixed); // This may be undesired behavior

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

// Positive
declare const positive: Positive<-1 | -1n | 0 | 0n | 1 | 1n>;

expectType<1 | 1n>(positive);

// PositiveInteger
declare const positiveInteger: PositiveInteger<-1 | 0 | 1>;

expectType<1>(positiveInteger);

// Natural
declare const natural: Natural<-1 | -1n | 0 | 0n | 1 | 1n>;

expectType<0 | 0n | 1 | 1n>(natural);
