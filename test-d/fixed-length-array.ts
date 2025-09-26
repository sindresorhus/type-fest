import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {FixedLengthArray} from '../index.d.ts';

type FixedToThreeStrings = FixedLengthArray<string, 3>;

expectAssignable<FixedToThreeStrings>(['a', 'b', 'c']);
expectAssignable<readonly [string, string, string]>({} as FixedToThreeStrings);
expectAssignable<readonly string[]>({} as FixedToThreeStrings);

expectType<string>({} as FixedToThreeStrings[0]);
expectType<string>({} as FixedToThreeStrings[1]);
expectType<string>({} as FixedToThreeStrings[2]);
expectType<string | undefined>({} as FixedToThreeStrings[3]);

expectType<3>({} as FixedToThreeStrings['length']);

// @ts-expect-error
type NoSplice = FixedToThreeStrings['splice'];
// @ts-expect-error
type NoPush = FixedToThreeStrings['push'];
// @ts-expect-error
type NoPop = FixedToThreeStrings['pop'];
// @ts-expect-error
type NoShift = FixedToThreeStrings['shift'];
// @ts-expect-error
type NoUnshift = FixedToThreeStrings['unshift'];

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
