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
