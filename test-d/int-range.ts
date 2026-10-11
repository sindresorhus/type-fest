import {expectTypeOf} from 'nz';
import type {IntRange} from '../source/int-range.d.ts';

declare const test: IntRange<0, 5>;
expectTypeOf(test).toBe<0 | 1 | 2 | 3 | 4>();

declare const startTest: IntRange<5, 10>;
expectTypeOf(startTest).toBe<5 | 6 | 7 | 8 | 9>();

declare const stepTest1: IntRange<10, 20, 2>;
expectTypeOf(stepTest1).toBe<10 | 12 | 14 | 16 | 18>();

// Test for step > end - start
declare const stepTest2: IntRange<10, 20, 100>;
expectTypeOf(stepTest2).toBe<10>();

declare const maxNumberTest: IntRange<0, 999>;
expectTypeOf(maxNumberTest).toBeAssignableTo<number>();

// A range that spans both sides of zero is generated in two halves, so it can be much wider
type WideTest = IntRange<-998, 998>;
expectTypeOf<-998>().toBeAssignableTo<WideTest>();
expectTypeOf<0>().toBeAssignableTo<WideTest>();
expectTypeOf<997>().toBeAssignableTo<WideTest>();
expectTypeOf<998>().not.toBeAssignableTo<WideTest>();

// Empty range
declare const emptyTest: IntRange<5, 5>;
expectTypeOf(emptyTest).toBe<never>();

// Negative start
declare const negativeTest: IntRange<-2, 2>;
expectTypeOf(negativeTest).toBe<-2 | -1 | 0 | 1>();

// Both negative
declare const bothNegativeTest: IntRange<-5, -2>;
expectTypeOf(bothNegativeTest).toBe<-5 | -4 | -3>();

// Empty negative range
declare const emptyNegativeTest: IntRange<-5, -5>;
expectTypeOf(emptyNegativeTest).toBe<never>();

// Single negative value
declare const singleNegativeTest: IntRange<-1, 0>;
expectTypeOf(singleNegativeTest).toBe<-1>();

// Negative start with a step crossing zero
declare const negativeStepTest: IntRange<-5, 5, 3>;
expectTypeOf(negativeStepTest).toBe<-5 | -2 | 1 | 4>();

// Negative start with step > end - start
declare const negativeStepTest2: IntRange<-2, 2, 100>;
expectTypeOf(negativeStepTest2).toBe<-2>();

// A non-positive step falls back to `1`, same as for a non-negative start
declare const zeroStepTest: IntRange<-2, 2, 0>;
expectTypeOf(zeroStepTest).toBe<-2 | -1 | 0 | 1>();

// Start greater than end
declare const reversedTest: IntRange<2, -2>;
expectTypeOf(reversedTest).toBe<never>();

declare const reversedTest2: IntRange<5, 2>;
expectTypeOf(reversedTest2).toBe<never>();

declare const reversedFromZeroTest: IntRange<0, -1>;
expectTypeOf(reversedFromZeroTest).toBe<never>();

declare const anyTest: IntRange<any, any>;
expectTypeOf(anyTest).toBe<never>();

declare const neverTest: IntRange<never, never>;
expectTypeOf(neverTest).toBe<never>();

// @ts-expect-error
type UnknownTest = IntRange<unknown, unknown>;

// A union bound silently keeps only its first member, so `IntRange<0, 5 | 10>` gives `0..4` where the range `0..9` is what the numbers mean. The union of both single-bound ranges is what is expected, because a range covers every value up to the bound.
declare const unionEnd: IntRange<0, 5 | 10>;
expectTypeOf(unionEnd).toBe<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>();

// The start is a bound the same way the end is, so it is distributed for the same reason.
declare const unionStart: IntRange<-1 | 0, 2>;
expectTypeOf(unionStart).toBe<-1 | 0 | 1>();

declare const unionStartOnlyNegative: IntRange<-2 | 0, 1>;
expectTypeOf(unionStartOnlyNegative).toBe<-2 | -1 | 0>();

declare const unionStartBothSigns: IntRange<-2 | 1, 3>;
expectTypeOf(unionStartBothSigns).toBe<-2 | -1 | 0 | 1 | 2>();

declare const unionStartWithStep: IntRange<0 | 2, 6, 2>;
expectTypeOf(unionStartWithStep).toBe<0 | 2 | 4>();

// The end is exclusive, so a range whose start equals its end is empty. `show.sh` truncates a long union, which makes an inclusive end look plausible, so these count the members exactly.
declare const emptyRange: IntRange<0, 0>;
expectTypeOf(emptyRange).toBe<never>();

declare const singleValue: IntRange<0, 1>;
expectTypeOf(singleValue).toBe<0>();

declare const threeValues: IntRange<0, 3>;
expectTypeOf(threeValues).toBe<0 | 1 | 2>();

declare const fromThree: IntRange<3, 6>;
expectTypeOf(fromThree).toBe<3 | 4 | 5>();

declare const stepTwoShort: IntRange<0, 4, 2>;
expectTypeOf(stepTwoShort).toBe<0 | 2>();

declare const stepTwoOnEnd: IntRange<0, 5, 2>;
expectTypeOf(stepTwoOnEnd).toBe<0 | 2 | 4>();

declare const negativeRange: IntRange<-3, 3>;
expectTypeOf(negativeRange).toBe<-3 | -2 | -1 | 0 | 1 | 2>();

// A union bound is distributed for every shape of pair, including one where the members are equal to each other and one where they are far apart.
expectTypeOf<IntRange<0 | 1, 2>>().toBe<0 | 1>();
expectTypeOf<IntRange<-3 | 0, 1>>().toBe<-3 | -2 | -1 | 0>();
expectTypeOf<IntRange<0, 5 | 10>>().toBe<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>();
expectTypeOf<IntRange<0, 9, 2 | 4>>().toBe<0 | 2 | 4 | 6 | 8>();

// Different steps produce complete ranges independently, rather than mixing the steps between iterations.
expectTypeOf<IntRange<0, 7, 2 | 3>>().toBe<0 | 2 | 3 | 4 | 6>();
expectTypeOf<IntRange<-4, 3, 2 | 3>>().toBe<-4 | -2 | -1 | 0 | 2>();
