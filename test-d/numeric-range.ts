import {expectType} from 'tsd';
import {Integer, Natural, Negative, Positive} from '../index';

// Integer
declare const integer: Integer<1>;
declare const integerMixed: Integer<1 | 1.5>;
declare const nonInteger: Integer<1.5>;

expectType<1>(integer);
expectType<never>(integerMixed);
expectType<never>(nonInteger);

// Negative
declare const negative: Negative<-1 | -1n | 0 | 0n | 1 | 1n>;

expectType<-1 | -1n>(negative);

// Positive
declare const positive: Positive<-1 | -1n | 0 | 0n | 1 | 1n>;

expectType<1 | 1n>(positive);

// Natural
declare const natural: Natural<-1 | -1n | 0 | 0n | 1 | 1n>;

expectType<0 | 0n | 1 | 1n>(natural);
