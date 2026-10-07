import {expectType, expectAssignable} from 'tsd';
import type {IntClosedRange} from '../source/int-closed-range.d.ts';

declare const test: IntClosedRange<0, 5>;
expectType<0 | 1 | 2 | 3 | 4 | 5>(test);

declare const startTest: IntClosedRange<5, 10>;
expectType<5 | 6 | 7 | 8 | 9 | 10>(startTest);

declare const stepTest1: IntClosedRange<10, 20, 2>;
expectType<10 | 12 | 14 | 16 | 18 | 20>(stepTest1);

// Test for step > end - start
declare const stepTest2: IntClosedRange<10, 20, 100>;
expectType<10>(stepTest2);

type Int0_998 = IntClosedRange<0, 998>;
declare const maxNumberTest: Int0_998;
expectAssignable<number>(maxNumberTest);
expectAssignable<Int0_998>(998);

// Negative bound
declare const minNumberTest: IntClosedRange<-998, -996>;
expectType<-998 | -997 | -996>(minNumberTest);

// Single value
declare const singleTest: IntClosedRange<5, 5>;
expectType<5>(singleTest);

// Negative start
declare const negativeTest: IntClosedRange<-2, 2>;
expectType<-2 | -1 | 0 | 1 | 2>(negativeTest);

// Both negative
declare const bothNegativeTest: IntClosedRange<-5, -2>;
expectType<-5 | -4 | -3 | -2>(bothNegativeTest);

// Negative start with a step crossing zero
declare const negativeStepTest: IntClosedRange<-4, 4, 2>;
expectType<-4 | -2 | 0 | 2 | 4>(negativeStepTest);

// Negative start with step > end - start
declare const negativeStepTest2: IntClosedRange<-2, 2, 100>;
expectType<-2>(negativeStepTest2);

// Start greater than end
declare const reversedTest: IntClosedRange<2, -2>;
expectType<never>(reversedTest);

declare const reversedFromZeroTest: IntClosedRange<0, -1>;
expectType<never>(reversedFromZeroTest);

declare const anyTest: IntClosedRange<any, any>;
expectType<never>(anyTest);

declare const neverTest: IntClosedRange<never, never>;
expectType<never>(neverTest);

// @ts-expect-error
type UnknownTest = IntClosedRange<unknown, unknown>;

// A union bound silently keeps only its first member, so `IntClosedRange<0, 5 | 10>` gives `0..5` where the range `0..10` is what the numbers mean.
declare const unionEnd: IntClosedRange<0, 5 | 10>;
expectType<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>(unionEnd);

// The end is inclusive, so a range whose start equals its end is that one value.
declare const singleValue: IntClosedRange<5, 5>;
expectType<5>(singleValue);

declare const emptyRange: IntClosedRange<5, 4>;
expectType<never>(emptyRange);

declare const threeValues: IntClosedRange<0, 2>;
expectType<0 | 1 | 2>(threeValues);

declare const negativeRange: IntClosedRange<-2, 2>;
expectType<-2 | -1 | 0 | 1 | 2>(negativeRange);

// The start is a bound the same way the end is, so it is distributed for the same reason.
declare const unionStart: IntClosedRange<-1 | 0, 1>;
expectType<-1 | 0 | 1>(unionStart);

declare const unionStartOnlyNegative: IntClosedRange<-2 | 0, 0>;
expectType<-2 | -1 | 0>(unionStartOnlyNegative);
