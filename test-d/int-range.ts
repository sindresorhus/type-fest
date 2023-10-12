import {expectType, expectError} from 'tsd';
import type {IntRange} from '../source/int-range';

declare const test: IntRange<0, 5>;
expectType<0 | 1 | 2 | 3 | 4>(test);

declare const startTest: IntRange<5, 10>;
expectType<5 | 6 | 7 | 8 | 9>(startTest);

declare const stepTest1: IntRange<10, 20, 2>;
expectType<10 | 12 | 14 | 16 | 18>(stepTest1);

// Test for step > end - start
declare const stepTest2: IntRange<10, 20, 100>;
expectType<10>(stepTest2);
