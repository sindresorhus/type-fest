import {expectType} from 'tsd';
import {Integer, Natural, Negative, NegativeInteger, Positive, PositiveInteger} from '../index';

// Integer
declare const integer: Integer<1>;
declare const integerMixed: Integer<1 | 1.5>;
declare const nonInteger: Integer<1.5>;
// See https://github.com/microsoft/TypeScript/issues/31752
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
declare const infinity: Integer<1e999 | -1e999>;

expectType<1>(integer);
expectType<never>(integerMixed); // This may be undesired behavior
expectType<never>(nonInteger);
expectType<never>(infinity);

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
