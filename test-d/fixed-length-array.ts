import {expectTypeOf} from 'nz';
import type {FixedLengthArray} from '../index.d.ts';

type FixedToThreeStrings = FixedLengthArray<string, 3>;
declare const fixedToThreeStrings: FixedToThreeStrings;

['a', 'b', 'c'] satisfies FixedToThreeStrings;
expectTypeOf<FixedToThreeStrings>().toBeAssignableTo<readonly [string, string, string]>();
expectTypeOf<FixedToThreeStrings>().toBeAssignableTo<readonly string[]>();

// Reading within bounds
expectTypeOf<FixedToThreeStrings[0]>().toBe<string>();
expectTypeOf<FixedToThreeStrings[1]>().toBe<string>();
expectTypeOf<FixedToThreeStrings[2]>().toBe<string>();

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

expectTypeOf<FixedToThreeStrings['length']>().toBe<3>();

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

expectTypeOf<['a', 'b', 123]>().not.toBeAssignableTo<FixedToThreeStrings>();
expectTypeOf<['a']>().not.toBeAssignableTo<FixedToThreeStrings>();
expectTypeOf<['a', 'b']>().not.toBeAssignableTo<FixedToThreeStrings>();
expectTypeOf<['a', 'b', 'c', 'd']>().not.toBeAssignableTo<FixedToThreeStrings>();

// `length` must describe the array that `TupleOf` actually builds, so a decimal part is ignored and a negative length yields an empty tuple.
expectTypeOf<FixedLengthArray<string, 3.5>['length']>().toBe<3>();
expectTypeOf<FixedLengthArray<string, -2>['length']>().toBe<0>();
expectTypeOf<FixedLengthArray<string, 2 | 3>['length']>().toBe<2 | 3>();
expectTypeOf<FixedLengthArray<string, number>['length']>().toBe<number>();

type FixedLength = FixedLengthArray<string, number>;
declare const fixedLength: FixedLength;

expectTypeOf<string[]>().toBeAssignableTo<FixedLength>();
expectTypeOf<FixedLength>().toBeAssignableTo<readonly string[]>();

// Reading
// Note: The extra `undefined` is only present when `noUncheckedIndexedAccess` is enabled.
expectTypeOf(fixedLength[0]).toBe<string | undefined>();
expectTypeOf(fixedLength[100]).toBe<string | undefined>();
// Note: Reading directly from the type doesn't include `undefined`.
expectTypeOf<FixedLength[100]>().toBe<string>();

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

['a', 'b', 'c'] satisfies FixedLengthArray<string | number, 3>;
[3, 2, 1] satisfies FixedLengthArray<string | number, 3>;
['a', 'b', 3] satisfies FixedLengthArray<string | number, 3>;
[1, 'b', 3] satisfies FixedLengthArray<string | number, 3>;
expectTypeOf<[1, 'b', 3, 4]>().not.toBeAssignableTo<FixedLengthArray<string | number, 3>>();
expectTypeOf<[1, 'b', true]>().not.toBeAssignableTo<FixedLengthArray<string | number, 3>>();

['a', 'b'] satisfies FixedLengthArray<string, 2 | 3>;
['a', 'b', 'c'] satisfies FixedLengthArray<string, 2 | 3>;
expectTypeOf<['a']>().not.toBeAssignableTo<FixedLengthArray<string, 2 | 3>>();
expectTypeOf<[1, 2]>().not.toBeAssignableTo<FixedLengthArray<string, 2 | 3>>();
