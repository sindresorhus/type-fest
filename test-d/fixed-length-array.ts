import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {FixedLengthArray} from '../index.d.ts';

type FixedToThreeStrings = FixedLengthArray<string, 3>;
declare const fixedToThreeStrings: FixedToThreeStrings;

expectAssignable<FixedToThreeStrings>(['a', 'b', 'c']);
expectAssignable<readonly [string, string, string]>({} as FixedToThreeStrings);
expectAssignable<readonly string[]>({} as FixedToThreeStrings);

// Reading within bounds
expectType<string>({} as FixedToThreeStrings[0]);
expectType<string>({} as FixedToThreeStrings[1]);
expectType<string>({} as FixedToThreeStrings[2]);

// Reading out of bounds
// @ts-expect-error
type OutOfBounds = FixedToThreeStrings[3];

// Writing within bounds
fixedToThreeStrings[0] = 'a';
fixedToThreeStrings[1] = 'b';
fixedToThreeStrings[2] = 'c';

// Writing out of bounds
// @ts-expect-error
fixedToThreeStrings[3] = 'd';

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

type FixedLength = FixedLengthArray<string, number>;
declare const fixedLength: FixedLength;

expectAssignable<FixedLength>({} as string[]);
expectAssignable<readonly string[]>({} as FixedLength);

// Reading
// Note: The extra `undefined` is only present when `noUncheckedIndexedAccess` is enabled.
expectType<string | undefined>(fixedLength[0]);
expectType<string | undefined>(fixedLength[100]);
// Note: Reading directly from the type doesn't include `undefined`.
expectType<string>({} as FixedLength[100]);

// Writing
// This is allowed for now, refer https://github.com/sindresorhus/type-fest/pull/1246#discussion_r2384018774
fixedLength[0] = 'a';
fixedLength[100] = 'b';

// @ts-expect-error
type NoSplice = FixedLength['splice'];
// @ts-expect-error
type NoPush = FixedLength['push'];
// @ts-expect-error
type NoPop = FixedLength['pop'];
// @ts-expect-error
type NoShift = FixedLength['shift'];
// @ts-expect-error
type NoUnshift = FixedLength['unshift'];

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
