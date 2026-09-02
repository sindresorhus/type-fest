import {expectType, expectAssignable, expectNotAssignable} from 'tsd';
import type {IntRange} from '../source/int-range.d.ts';

declare const test: IntRange<0, 5>;
expectType<0 | 1 | 2 | 3 | 4>(test);

declare const startTest: IntRange<5, 10>;
expectType<5 | 6 | 7 | 8 | 9>(startTest);

declare const stepTest1: IntRange<10, 20, 2>;
expectType<10 | 12 | 14 | 16 | 18>(stepTest1);

// Test for step > end - start
declare const stepTest2: IntRange<10, 20, 100>;
expectType<10>(stepTest2);

declare const maxNumberTest: IntRange<0, 999>;
expectAssignable<number>(maxNumberTest);

// A range that spans both sides of zero is generated in two halves, so it can be much wider
type WideTest = IntRange<-998, 998>;
expectAssignable<WideTest>(-998);
expectAssignable<WideTest>(0);
expectAssignable<WideTest>(997);
expectNotAssignable<WideTest>(998);

// Empty range
declare const emptyTest: IntRange<5, 5>;
expectType<never>(emptyTest);

// Negative start
declare const negativeTest: IntRange<-2, 2>;
expectType<-2 | -1 | 0 | 1>(negativeTest);

// Both negative
declare const bothNegativeTest: IntRange<-5, -2>;
expectType<-5 | -4 | -3>(bothNegativeTest);

// Empty negative range
declare const emptyNegativeTest: IntRange<-5, -5>;
expectType<never>(emptyNegativeTest);

// Single negative value
declare const singleNegativeTest: IntRange<-1, 0>;
expectType<-1>(singleNegativeTest);

// Negative start with a step crossing zero
declare const negativeStepTest: IntRange<-5, 5, 3>;
expectType<-5 | -2 | 1 | 4>(negativeStepTest);

// Negative start with step > end - start
declare const negativeStepTest2: IntRange<-2, 2, 100>;
expectType<-2>(negativeStepTest2);

// A non-positive step falls back to `1`, same as for a non-negative start
declare const zeroStepTest: IntRange<-2, 2, 0>;
expectType<-2 | -1 | 0 | 1>(zeroStepTest);

// Start greater than end
declare const reversedTest: IntRange<2, -2>;
expectType<never>(reversedTest);

declare const reversedTest2: IntRange<5, 2>;
expectType<never>(reversedTest2);

declare const reversedFromZeroTest: IntRange<0, -1>;
expectType<never>(reversedFromZeroTest);

declare const anyTest: IntRange<any, any>;
expectType<never>(anyTest);

declare const neverTest: IntRange<never, never>;
expectType<never>(neverTest);

// @ts-expect-error
type UnknownTest = IntRange<unknown, unknown>;
