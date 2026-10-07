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

// A union bound silently keeps only its first member, so `IntRange<0, 5 | 10>` gives `0..4` where the range `0..9` is what the numbers mean. The union of both single-bound ranges is what is expected, because a range covers every value up to the bound.
declare const unionEnd: IntRange<0, 5 | 10>;
expectType<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>(unionEnd);

// The start is a bound the same way the end is, so it is distributed for the same reason.
declare const unionStart: IntRange<-1 | 0, 2>;
expectType<-1 | 0 | 1>(unionStart);

declare const unionStartOnlyNegative: IntRange<-2 | 0, 1>;
expectType<-2 | -1 | 0>(unionStartOnlyNegative);

declare const unionStartBothSigns: IntRange<-2 | 1, 3>;
expectType<-2 | -1 | 0 | 1 | 2>(unionStartBothSigns);

declare const unionStartWithStep: IntRange<0 | 2, 6, 2>;
expectType<0 | 2 | 4>(unionStartWithStep);

// The end is exclusive, so a range whose start equals its end is empty. `show.sh` truncates a long union, which makes an inclusive end look plausible, so these count the members exactly.
declare const emptyRange: IntRange<0, 0>;
expectType<never>(emptyRange);

declare const singleValue: IntRange<0, 1>;
expectType<0>(singleValue);

declare const threeValues: IntRange<0, 3>;
expectType<0 | 1 | 2>(threeValues);

declare const fromThree: IntRange<3, 6>;
expectType<3 | 4 | 5>(fromThree);

declare const stepTwoShort: IntRange<0, 4, 2>;
expectType<0 | 2>(stepTwoShort);

declare const stepTwoOnEnd: IntRange<0, 5, 2>;
expectType<0 | 2 | 4>(stepTwoOnEnd);

declare const negativeRange: IntRange<-3, 3>;
expectType<-3 | -2 | -1 | 0 | 1 | 2>(negativeRange);

// A union bound is distributed for every shape of pair, including one where the members are equal to each other and one where they are far apart.
expectType<0 | 1>({} as IntRange<0 | 1, 2>);
expectType<-3 | -2 | -1 | 0>({} as IntRange<-3 | 0, 1>);
expectType<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>({} as IntRange<0, 5 | 10>);
expectType<0 | 2 | 4 | 6 | 8>({} as IntRange<0, 9, 2 | 4>);

// Different steps produce complete ranges independently, rather than mixing the steps between iterations.
expectType<0 | 2 | 3 | 4 | 6>({} as IntRange<0, 7, 2 | 3>);
expectType<-4 | -2 | -1 | 0 | 2>({} as IntRange<-4, 3, 2 | 3>);
