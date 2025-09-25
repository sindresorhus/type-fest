import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {FixedLengthArray} from '../index.d.ts';

type FixedToThreeStrings = FixedLengthArray<string, 3>;

expectAssignable<FixedToThreeStrings>(['a', 'b', 'c']);

declare const threeStrings: FixedToThreeStrings;
expectType<string>(threeStrings[0]);
expectType<string>(threeStrings[1]);
expectType<string>(threeStrings[2]);
expectType<string | undefined>(threeStrings[3]);

expectNotAssignable<FixedToThreeStrings>(['a', 'b', 123]);
expectNotAssignable<FixedToThreeStrings>(['a']);
expectNotAssignable<FixedToThreeStrings>(['a', 'b']);
expectNotAssignable<FixedToThreeStrings>(['a', 'b', 'c', 'd']);

expectAssignable<FixedLengthArray<string | number, 3>>(['a', 'b', 'c']);
expectAssignable<FixedLengthArray<string | number, 3>>([3, 2, 1]);
expectAssignable<FixedLengthArray<string | number, 3>>(['a', 'b', 3]);
expectAssignable<FixedLengthArray<string | number, 3>>([1, 'b', 3]);
expectNotAssignable<FixedLengthArray<string | number, 3>>([1, 'b', 3, 4]);
expectNotAssignable<FixedLengthArray<string | number, 3>>([1, 'b', true]);

expectAssignable<FixedLengthArray<string, 2 | 3>>(['a', 'b']);
expectAssignable<FixedLengthArray<string, 2 | 3>>(['a', 'b', 'c']);
expectNotAssignable<FixedLengthArray<string, 2 | 3>>(['a']);
expectNotAssignable<FixedLengthArray<string, 2 | 3>>([1, 2]);
