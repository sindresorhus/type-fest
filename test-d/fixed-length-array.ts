import {expectTypeOf} from 'nz';
import type {FixedLengthArray, Tagged} from '../index.d.ts';

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
// @ts-expect-error
expectTypeOf(fixedToThreeStrings[4]);

// Indexing with a non-literal `number` is not allowed, since it could be out of bounds
declare const index: number;
// @ts-expect-error
type NonLiteralIndex = FixedToThreeStrings[number];
// @ts-expect-error
expectTypeOf(fixedToThreeStrings[index]);
// @ts-expect-error
fixedToThreeStrings[index] = 'd';

// Iterating and destructuring keep the element type, even with `noUncheckedIndexedAccess`
const [first, second, third] = fixedToThreeStrings;
expectTypeOf(first).toBe<string>();
expectTypeOf(second).toBe<string>();
expectTypeOf(third).toBe<string>();

for (const item of fixedToThreeStrings) {
	expectTypeOf(item).toBe<string>();
}

for (const [entryIndex, item] of fixedToThreeStrings.entries()) {
	expectTypeOf(entryIndex).toBe<number>();
	expectTypeOf(item).toBe<string>();
}

// Spreading into an array literal results in `any[]`, since there is no `number` index signature. This is a known limitation.
expectTypeOf([...fixedToThreeStrings]).toBe<any[]>();
// eslint-disable-next-line unicorn/prefer-spread -- spreading results in `any[]`
expectTypeOf(Array.from(fixedToThreeStrings)).toBe<string[]>();
// eslint-disable-next-line unicorn/prefer-spread -- spreading results in `any[]`
expectTypeOf(fixedToThreeStrings.slice()).toBe<string[]>();

// Spreading into function arguments still checks the element type
declare function takesNumbers(...numbers: number[]): void;
// @ts-expect-error
takesNumbers(...fixedToThreeStrings);

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

// A literal length above one digit still builds a fixed-length array.
expectTypeOf<FixedLengthArray<string, 10>['length']>().toBe<10>();
expectTypeOf<FixedLengthArray<string, 10>[9]>().toBe<string>();
// @ts-expect-error Index 10 is out of bounds.
type TenthIndex = FixedLengthArray<string, 10>[10];

// A non-literal length gives `never`, because the length is not known and so the array is not fixed.
expectTypeOf<FixedLengthArray<string, number>>().toBe<never>();
expectTypeOf<FixedLengthArray<string, number | 3>>().toBe<never>();
expectTypeOf<FixedLengthArray<string, any>>().toBe<never>();
expectTypeOf<FixedLengthArray<string, Tagged<number, 'Length'>>>().toBe<never>();
// A brand does not make a non-literal length literal.
expectTypeOf<FixedLengthArray<string, Tagged<number, 'Length'> | 3>>().toBe<never>();
expectTypeOf<FixedLengthArray<string, Tagged<number | 3, 'Length'>>>().toBe<never>();
// The element type does not change the rejection.
expectTypeOf<FixedLengthArray<any, number>>().toBe<never>();
expectTypeOf<FixedLengthArray<unknown, number>>().toBe<never>();
expectTypeOf<FixedLengthArray<never, number>>().toBe<never>();
// A branded literal length still gives a fixed length.
expectTypeOf<FixedLengthArray<string, Tagged<3, 'Length'>>>().toBe<FixedLengthArray<string, 3>>();
// The brand is unwrapped before a union of literal lengths is built.
expectTypeOf<FixedLengthArray<string, Tagged<2 | 3, 'Length'>>>().toBe<FixedLengthArray<string, 2> | FixedLengthArray<string, 3>>();
// Separately branded literal lengths also distribute.
expectTypeOf<FixedLengthArray<string, Tagged<2, 'A'> | Tagged<3, 'B'>>>().toBe<FixedLengthArray<string, 2> | FixedLengthArray<string, 3>>();

// A non-literal length cannot describe a fixed length.
// @ts-expect-error
const _nonLiteralLength: FixedLengthArray<string, number> = ['a', 'b'];

// `Length` must still be a number.
// @ts-expect-error `unknown` is not a number.
type UnknownLength = FixedLengthArray<string, unknown>;
// @ts-expect-error `boolean` is not a number.
type BooleanLength = FixedLengthArray<string, boolean>;
// @ts-expect-error A numeric string is not a number.
type StringLength = FixedLengthArray<string, '3'>;
// @ts-expect-error A bigint is not a number.
type BigintLength = FixedLengthArray<string, 3n>;

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

// Reading within bounds works and reading out of bounds is an error for any element type
expectTypeOf<FixedLengthArray<any, 2>[1]>().toBe<any>();
expectTypeOf<FixedLengthArray<unknown, 2>[1]>().toBe<unknown>();
expectTypeOf<FixedLengthArray<never, 2>[1]>().toBe<never>();
// @ts-expect-error
type AnyOutOfBounds = FixedLengthArray<any, 2>[2];
// @ts-expect-error
type UnknownOutOfBounds = FixedLengthArray<unknown, 2>[2];
// @ts-expect-error
type NeverOutOfBounds = FixedLengthArray<never, 2>[2];
// @ts-expect-error
type EmptyOutOfBounds = FixedLengthArray<string, 0>[0];
// The element type is unchanged, including its brand.
expectTypeOf<FixedLengthArray<Tagged<string, 'Color'>, 2>[1]>().toBe<Tagged<string, 'Color'>>();

// Checking the length narrows to the matching tuple, so every index of that length becomes available.
declare const variableTupleLength: FixedLengthArray<string, 2 | 3>;
if (variableTupleLength.length === 3) {
	expectTypeOf(variableTupleLength[2]).toBe<string>();
}

expectTypeOf<Extract<FixedLengthArray<string, 2 | 3>, {readonly length: 3}>>().toBe<FixedLengthArray<string, 3>>();

expectTypeOf<FixedLengthArray<string, 2 | 3>>().toBe<FixedLengthArray<string, 2> | FixedLengthArray<string, 3>>();
if (variableTupleLength.length === 2) {
	expectTypeOf(variableTupleLength[1]).toBe<string>();
	// @ts-expect-error
	variableTupleLength[2] = 'c';
}

// Normalized lengths remain paired with their own indices.
expectTypeOf<FixedLengthArray<number, 0 | 2>>().toBe<FixedLengthArray<number, 0> | FixedLengthArray<number, 2>>();
expectTypeOf<FixedLengthArray<number, -1 | 2.5>>().toBe<FixedLengthArray<number, 0> | FixedLengthArray<number, 2>>();
expectTypeOf<Extract<FixedLengthArray<number, -1 | 2.5>, {readonly length: 0}>>().toBe<FixedLengthArray<number, 0>>();
expectTypeOf<Extract<FixedLengthArray<number, -1 | 2.5>, {readonly length: 2}>>().toBe<FixedLengthArray<number, 2>>();

// A union of lengths does not allow changing its length or using a mutator.
// @ts-expect-error
variableTupleLength.length = 3;
// @ts-expect-error
type UnionWithoutPush = typeof variableTupleLength['push'];

expectTypeOf<FixedLengthArray<any, 2 | 3>>().toBe<FixedLengthArray<any, 2> | FixedLengthArray<any, 3>>();
expectTypeOf<FixedLengthArray<unknown, 2 | 3>>().toBe<FixedLengthArray<unknown, 2> | FixedLengthArray<unknown, 3>>();
expectTypeOf<FixedLengthArray<never, 2 | 3>>().toBe<FixedLengthArray<never, 2> | FixedLengthArray<never, 3>>();
expectTypeOf<FixedLengthArray<string, never>>().toBe<FixedLengthArray<string, 0>>();
// A `never` length keeps the empty tuple, so only the empty array fits it.
expectTypeOf<[]>().toBeAssignableTo<FixedLengthArray<string, never>>();
expectTypeOf<['a']>().not.toBeAssignableTo<FixedLengthArray<string, never>>();

function makeTriple<const Value>(value: Value): FixedLengthArray<Value, 3> {
	return [value, value, value];
}

const repeatedValue = makeTriple({code: 'red'});
expectTypeOf(repeatedValue[2]).toBe<{readonly code: 'red'}>();
repeatedValue[0] = {code: 'red'};
// @ts-expect-error Const-inferred nested fields stay readonly.
repeatedValue[2].code = 'red';
// @ts-expect-error A valid length value cannot replace the readonly length.
repeatedValue.length = 3;
// @ts-expect-error There is no fourth position.
const _fourthValue: unknown = repeatedValue[3];
// @ts-expect-error Fixed-length results exclude length-changing methods.
type MissingMutator = typeof repeatedValue['push'];

function _copyFixedItems<Value, Length extends number>(values: FixedLengthArray<Value, Length>): Value[] {
	return values.map(value => value);
}

// A literal `Length` is not inferred from the value, so a generic helper must specify it explicitly.
// @ts-expect-error The length is inferred as `number` and then rejected.
_copyFixedItems(fixedToThreeStrings);
_copyFixedItems<string, 3>(fixedToThreeStrings);
// @ts-expect-error A generic length instantiated with `number` does not describe a fixed length.
_copyFixedItems<string, number>(fixedToThreeStrings);

function _readFixedItem<Value>(values: FixedLengthArray<{readonly value: Value}, 3>): Value {
	return values[2].value;
}

// Enum lengths still produce fixed positions and an ordinary numeric length.
enum ChannelCount {
	Rgb = 3,
}
const enumLengthColor: FixedLengthArray<number, ChannelCount.Rgb> = [255, 128, 0];
expectTypeOf(enumLengthColor.length).toBe<3>();
expectTypeOf(enumLengthColor[2]).toBe<number>();
// @ts-expect-error The enum length does not introduce a broad numeric index signature.
expectTypeOf(enumLengthColor[3]);
// @ts-expect-error A three-channel color must contain all three elements.
const incompleteEnumLengthColor: FixedLengthArray<number, ChannelCount.Rgb> = [255, 128];
