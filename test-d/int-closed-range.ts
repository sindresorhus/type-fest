import {expectTypeOf} from 'nz';
import type {IntClosedRange} from '../source/int-closed-range.d.ts';

declare const test: IntClosedRange<0, 5>;
expectTypeOf(test).toBe<0 | 1 | 2 | 3 | 4 | 5>();

declare const startTest: IntClosedRange<5, 10>;
expectTypeOf(startTest).toBe<5 | 6 | 7 | 8 | 9 | 10>();

declare const stepTest1: IntClosedRange<10, 20, 2>;
expectTypeOf(stepTest1).toBe<10 | 12 | 14 | 16 | 18 | 20>();

// Test for step > end - start
declare const stepTest2: IntClosedRange<10, 20, 100>;
expectTypeOf(stepTest2).toBe<10>();

type Int0_998 = IntClosedRange<0, 998>;
declare const maxNumberTest: Int0_998;
expectTypeOf(maxNumberTest).toBeAssignableTo<number>();
expectTypeOf<998>().toBeAssignableTo<Int0_998>();

// Negative bound
declare const minNumberTest: IntClosedRange<-998, -996>;
expectTypeOf(minNumberTest).toBe<-998 | -997 | -996>();

// Single value
declare const singleTest: IntClosedRange<5, 5>;
expectTypeOf(singleTest).toBe<5>();

// Negative start
declare const negativeTest: IntClosedRange<-2, 2>;
expectTypeOf(negativeTest).toBe<-2 | -1 | 0 | 1 | 2>();

// Both negative
declare const bothNegativeTest: IntClosedRange<-5, -2>;
expectTypeOf(bothNegativeTest).toBe<-5 | -4 | -3 | -2>();

// Negative start with a step crossing zero
declare const negativeStepTest: IntClosedRange<-4, 4, 2>;
expectTypeOf(negativeStepTest).toBe<-4 | -2 | 0 | 2 | 4>();

// Negative start with step > end - start
declare const negativeStepTest2: IntClosedRange<-2, 2, 100>;
expectTypeOf(negativeStepTest2).toBe<-2>();

// Start greater than end
declare const reversedTest: IntClosedRange<2, -2>;
expectTypeOf(reversedTest).toBe<never>();

declare const reversedFromZeroTest: IntClosedRange<0, -1>;
expectTypeOf(reversedFromZeroTest).toBe<never>();

declare const anyTest: IntClosedRange<any, any>;
expectTypeOf(anyTest).toBe<never>();

declare const neverTest: IntClosedRange<never, never>;
expectTypeOf(neverTest).toBe<never>();

// @ts-expect-error
type UnknownTest = IntClosedRange<unknown, unknown>;

// A union bound silently keeps only its first member, so `IntClosedRange<0, 5 | 10>` gives `0..5` where the range `0..10` is what the numbers mean.
declare const unionEnd: IntClosedRange<0, 5 | 10>;
expectTypeOf(unionEnd).toBe<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>();

// The end is inclusive, so a range whose start equals its end is that one value.
declare const singleValue: IntClosedRange<5, 5>;
expectTypeOf(singleValue).toBe<5>();

declare const emptyRange: IntClosedRange<5, 4>;
expectTypeOf(emptyRange).toBe<never>();

declare const threeValues: IntClosedRange<0, 2>;
expectTypeOf(threeValues).toBe<0 | 1 | 2>();

declare const negativeRange: IntClosedRange<-2, 2>;
expectTypeOf(negativeRange).toBe<-2 | -1 | 0 | 1 | 2>();

// The start is a bound the same way the end is, so it is distributed for the same reason.
declare const unionStart: IntClosedRange<-1 | 0, 1>;
expectTypeOf(unionStart).toBe<-1 | 0 | 1>();

declare const unionStartOnlyNegative: IntClosedRange<-2 | 0, 0>;
expectTypeOf(unionStartOnlyNegative).toBe<-2 | -1 | 0>();
