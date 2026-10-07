import {expectType} from 'tsd';
import type {ArraySplice, PositiveInfinity} from '../index.d.ts';

// Test fixed array
type TestTuple = ['a', 'b', 'c', 'd'];

declare const tuple0: ArraySplice<TestTuple, 2, 1>;
expectType<['a', 'b', 'd']>(tuple0);

declare const tuple1: ArraySplice<TestTuple, 2, 1, ['e', 'f']>;
expectType<['a', 'b', 'e', 'f', 'd']>(tuple1);

declare const tuple2: ArraySplice<TestTuple, 2, 0, ['e', 'f']>;
expectType<['a', 'b', 'e', 'f', 'c', 'd']>(tuple2);

declare const tuple3: ArraySplice<TestTuple, 0, 1>;
expectType<['b', 'c', 'd']>(tuple3);

declare const tuple4: ArraySplice<TestTuple, 0, 1, ['e', 'f']>;
expectType<['e', 'f', 'b', 'c', 'd']>(tuple4);

// Test variable array
type TestArray = ['a', 'b', 'c', 'd', ...number[]];

declare const array0: ArraySplice<TestArray, 2, 1>;
expectType<['a', 'b', 'd', ...number[]]>(array0);

declare const array1: ArraySplice<TestArray, 2, 1, ['e', 'f']>;
expectType<['a', 'b', 'e', 'f', 'd', ...number[]]>(array1);

declare const array2: ArraySplice<TestArray, 6, 0, ['e', 'f']>;
expectType<['a', 'b', 'c', 'd', number, number, 'e', 'f', ...number[]]>(array2);

// `splice` clamps an index or delete count past the end of the array, so it must not collapse to `never`.
declare const outOfRangeDeleteCount: ArraySplice<[1, 2, 3], 0, 4>;
expectType<[]>(outOfRangeDeleteCount);

declare const outOfRangeStart: ArraySplice<[1, 2, 3], 4, 0>;
expectType<[1, 2, 3]>(outOfRangeStart);

declare const bothOutOfRange: ArraySplice<[1, 2, 3], 4, 2>;
expectType<[1, 2, 3]>(bothOutOfRange);

declare const startInRangeDeleteCountNot: ArraySplice<[1, 2, 3], 1, 5>;
expectType<[1]>(startInRangeDeleteCountNot);

declare const exactLengthDeleteCount: ArraySplice<[1, 2, 3], 0, 3>;
expectType<[]>(exactLengthDeleteCount);

declare const insertAtEnd: ArraySplice<[1, 2, 3], 3, 0, [4]>;
expectType<[1, 2, 3, 4]>(insertAtEnd);

// A negative start counts backwards from the end of the array, like `splice()` does.
declare const negativeStartLast: ArraySplice<['a', 'b', 'c', 'd'], -1, 1>;
expectType<['a', 'b', 'c']>(negativeStartLast);

declare const negativeStartSecond: ArraySplice<['a', 'b', 'c', 'd'], -2, 1>;
expectType<['a', 'b', 'd']>(negativeStartSecond);

declare const negativeStartExactLength: ArraySplice<['a', 'b', 'c', 'd'], -4, 1>;
expectType<['b', 'c', 'd']>(negativeStartExactLength);

declare const negativeStartFromReadonlyTuple: ArraySplice<readonly ['a', 'b', 'c'], -1, 1>;
expectType<readonly ['a', 'b']>(negativeStartFromReadonlyTuple);

declare const negativeStartInsert: ArraySplice<['a', 'b', 'c', 'd'], -1, 0, ['x']>;
expectType<['a', 'b', 'c', 'x', 'd']>(negativeStartInsert);

// A start before the beginning of the array is clamped to `0`.
declare const negativeStartOutOfRange: ArraySplice<['a', 'b', 'c', 'd'], -10, 1>;
expectType<['b', 'c', 'd']>(negativeStartOutOfRange);

// The end of a variable length array is not statically known, so only the element types survive.
declare const negativeStartVariableArray: ArraySplice<['a', 'b', 'c', 'd', ...number[]], -1, 1>;
expectType<Array<'a' | 'b' | 'c' | 'd' | number>>(negativeStartVariableArray);

// A tuple with optional elements has no single length, so it must be peeled element by element rather than matched against a fixed-length pattern.
declare const optionalHead: ArraySplice<[string?, number?], 0, 1, [unknown]>;
expectType<[unknown, number?]>(optionalHead);

declare const optionalHeadKept: ArraySplice<[string?, number?], 0, 0, [unknown]>;
expectType<[unknown, string?, number?]>(optionalHeadKept);

// An inserted element becomes required even when the element it replaces was optional, because the inserted value is always present.
declare const replaceOptional: ArraySplice<[1, 2?], 1, 1, [unknown]>;
expectType<[1, unknown]>(replaceOptional);

// A start index that is a union splits the tuple at each member, and each half of the pair has to stay with its own tail. Inferring the two halves independently paired them across, so a four element tuple could come out as six elements long.
declare const unionStartInsert: ArraySplice<[1, 2, 3, 4], 1 | 2, 0, ['x']>;
expectType<[1, 'x', 2, 3, 4] | [1, 2, 'x', 3, 4]>(unionStartInsert);

declare const unionStartDelete: ArraySplice<[1, 2, 3], 0 | 2, 1>;
expectType<[2, 3] | [1, 2]>(unionStartDelete);

// The same pairing hazard applies when the array itself is a union, so each member must be spliced against its own halves. Inferring the halves independently produced tuples such as `[1, 'c']`, which mix an element from one member with the rest of the other.
declare const unionArrayDelete: ArraySplice<[1, 2, 3] | ['a', 'b', 'c'], 1, 1>;
expectType<[1, 3] | ['a', 'c']>(unionArrayDelete);

declare const unionArrayInsert: ArraySplice<[1, 2, 3] | ['a', 'b', 'c'], 1, 0, ['x']>;
expectType<[1, 'x', 2, 3] | ['a', 'x', 'b', 'c']>(unionArrayInsert);

declare const unionArrayNegativeStart: ArraySplice<[1, 2, 3] | ['a', 'b', 'c'], -1, 0, ['x']>;
expectType<[1, 2, 'x', 3] | ['a', 'b', 'x', 'c']>(unionArrayNegativeStart);

declare const unionArrayWithVariableLength: ArraySplice<[1, 2, 3] | [1, ...string[]], 1, 1>;
expectType<[1, 3] | [1, ...string[]]>(unionArrayWithVariableLength);

// A negative start is measured from the end of one specific member, so the members have to be distributed over before the start is resolved. Resolving it against the whole union mixes up the members' lengths, and each resolved start is then applied to every member, which produced tuples such as `[2, 3, 4]` and `["a"]` that no `splice` call can produce.
declare const unionArrayNegativeStartDifferentLengths: ArraySplice<[1, 2, 3, 4] | ['a'], -1, 1>;
expectType<[1, 2, 3] | []>(unionArrayNegativeStartDifferentLengths);

declare const unionArrayNegativeStartInsert: ArraySplice<[1, 2, 3, 4] | ['a'], -1, 0, ['x']>;
expectType<[1, 2, 3, 'x', 4] | ['x', 'a']>(unionArrayNegativeStartInsert);

declare const unionArrayNegativeStartDistance: ArraySplice<[1, 2, 3, 4, 5] | ['a'], -2, 1>;
expectType<[1, 2, 3, 5] | []>(unionArrayNegativeStartDistance);

declare const unionArrayNegativeStartReadonly: ArraySplice<[1, 2] | [3, 4, 5], -1, 1>;
expectType<[1] | [3, 4]>(unionArrayNegativeStartReadonly);

// A `readonly` input keeps its `readonly` modifier, whichever branch produced the result.
declare const readonlyTupleDelete: ArraySplice<readonly [1, 2, 3], 1, 1>;
expectType<readonly [1, 3]>(readonlyTupleDelete);

declare const readonlyTupleInsert: ArraySplice<readonly [1, 2, 3], 1, 0, ['x']>;
expectType<readonly [1, 'x', 2, 3]>(readonlyTupleInsert);

declare const readonlyTupleNegativeStart: ArraySplice<readonly [1, 2, 3], -1, 1>;
expectType<readonly [1, 2]>(readonlyTupleNegativeStart);

declare const readonlyArrayWithStaticPart: ArraySplice<readonly string[], 1, 1>;
expectType<readonly [string, ...string[]]>(readonlyArrayWithStaticPart);

declare const readonlyArray: ArraySplice<readonly string[], 0, 1, [number]>;
expectType<readonly [number, ...string[]]>(readonlyArray);

declare const readonlyUnion: ArraySplice<readonly [1, 2, 3] | [4, 5, 6], 1, 1>;
expectType<readonly [1, 3] | [4, 6]>(readonlyUnion);

// A start index inside a rest element is resolved by materialising that many rest elements, so the result claims a minimum length the input never promised: `[string, ...Array<number>]` can be `[string]`, and `splice(3, 1)` on that is a no-op, but the result demands three elements. The existing cases for a rest in the middle pin the same materialisation, because the alternative would drop the fixed elements after the rest, so the claim is deliberate and is stated rather than changed. See the note in the docs.
declare const variadicDelete: ArraySplice<[string, ...number[]], 3, 1>;
expectType<[string, number, number, ...number[]]>(variadicDelete);

declare const variadicDeletePastTheRest: ArraySplice<[string, ...number[]], 6, 1>;
expectType<[string, number, number, number, number, number, ...number[]]>(variadicDeletePastTheRest);

declare const variadicWithAFixedPart: ArraySplice<[string, number, ...number[]], 3, 1>;
expectType<[string, number, number, ...number[]]>(variadicWithAFixedPart);

declare const variadicAtTheStartOfTheRest: ArraySplice<[string, number, ...number[]], 2, 1>;
expectType<[string, number, ...number[]]>(variadicAtTheStartOfTheRest);

// A start index that is inside the declared part still removes that element.
declare const variadicInsideTheFixedPart: ArraySplice<[string, number, ...number[]], 0, 1>;
expectType<[number, ...number[]]>(variadicInsideTheFixedPart);

// Inserting into the rest keeps the rest, and the position is the one the index names.
declare const variadicInsert: ArraySplice<[string, ...number[]], 2, 0, [true]>;
expectType<[string, number, true, ...number[]]>(variadicInsert);

// A tuple with optional elements has no single length, so a start index at or past the optional element is resolved against the longest length and the optional element is promoted to a required one that carries `| undefined`, which is what TypeScript's own tuple spread does with it. `splice()` on `[1]` gives `[1, 9]` and on `[1, 2]` gives `[1, 2, 9]`. A start index before the optional element is unaffected, because the optional element stays last.
declare const optionalElementAtTheStartIndex: ArraySplice<[1, 2?], 2, 0, [9]>;
expectType<[1, 2 | undefined, 9]>(optionalElementAtTheStartIndex);

declare const optionalElementAfterTheStartIndex: ArraySplice<[1, 2?], 1, 0, [9]>;
expectType<[1, 9, 2?]>(optionalElementAfterTheStartIndex);

// A start index that mixes negative and positive members must be distributed before the sign is asked, or the union's `boolean` sign answer takes the positive path wholesale and the negative member is applied as a plain index.
declare const mixedSignUnionDelete: ArraySplice<[1, 2, 3], -1 | 1, 1>;
expectType<[1, 2] | [1, 3]>(mixedSignUnionDelete);

declare const mixedSignUnionInsert: ArraySplice<[1, 2, 3], -1 | 1, 0, [9]>;
expectType<[1, 2, 9, 3] | [1, 9, 2, 3]>(mixedSignUnionInsert);

// A negative start counts from the end, which a start clamped to `0` would not give.
expectType<['a', 'c', 'd']>({} as ArraySplice<['a', 'b', 'c', 'd'], -3, 1>);

// The clamp to the length comes before the index is built, so a huge or infinite index works.
expectType<[]>({} as ArraySplice<[1, 2, 3], 0, PositiveInfinity>);
expectType<[1, 2, 3, 'x']>({} as ArraySplice<[1, 2, 3], PositiveInfinity, 0, ['x']>);

// An index of `1e21` or more is printed in exponential notation, and is still clamped like any other index past the end.
declare const exponentStart: ArraySplice<[1, 2, 3], 1e21, 1>;
expectType<[1, 2, 3]>(exponentStart);

declare const exponentDeleteCount: ArraySplice<[1, 2, 3], 1, 1e21>;
expectType<[1]>(exponentDeleteCount);

declare const negativeExponentStart: ArraySplice<[1, 2, 3], -1e21, 1>;
expectType<[2, 3]>(negativeExponentStart);

// A negative delete count removes nothing.
expectType<[1, 2, 3]>({} as ArraySplice<[1, 2, 3], 1, -1>);

// A non-literal index can be any value, so only the element types are known.
expectType<Array<1 | 2 | 3>>({} as ArraySplice<[1, 2, 3], number, 1>);
expectType<ReadonlyArray<1 | 2 | 3>>({} as ArraySplice<readonly [1, 2, 3], number, 1>);
