import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {ArrayFlat, PositiveInfinity} from '../index';

type DeepArrayFlat<T> = ArrayFlat<[[[[[[T]]]]]], 10>;

expectAssignable<ArrayFlat<[1, number[], string[], true]>>([1, 2, 3, 'a', 'b', true]);
expectAssignable<ArrayFlat<[1, number[], true, string[]]>>([1, 2, 3, 'a', 'b', true]);
expectAssignable<ArrayFlat<[string[], [...boolean[], string]]>>(['a', true, true, false, 'b']);

// Basic flattening tests
expectType<ArrayFlat<[]>>([]);
expectType<ArrayFlat<[1, 2, 3]>>([1, 2, 3]);
expectType<ArrayFlat<[[1, 2], [3, 4]]>>([1, 2, 3, 4]);
expectType<ArrayFlat<[1, [2, 3], 4]>>([1, 2, 3, 4]);
expectType<ArrayFlat<[1, [2, [3]], 4]>>([1, 2, [3], 4]);

// Test with explicit depth
// eslint-disable-next-line unicorn/prevent-abbreviations
type Arr = [[0, [1, [2, [3, [4, [5]]]]]]];
expectType<ArrayFlat<Arr, 0>>(null! as Arr);
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
expectType<ArrayFlat<Arr, 1>>([0, [1, [2, [3, [4, [5]]]]]]);
expectType<ArrayFlat<Arr, 2>>([0, 1, [2, [3, [4, [5]]]]]);
expectType<ArrayFlat<Arr, 3>>([0, 1, 2, [3, [4, [5]]]]);
expectType<ArrayFlat<Arr, 4>>([0, 1, 2, 3, [4, [5]]]);
expectType<ArrayFlat<Arr, 5>>([0, 1, 2, 3, 4, [5]]);
expectType<ArrayFlat<Arr, 6>>([0, 1, 2, 3, 4, 5]);
expectType<ArrayFlat<Arr, 7>>([0, 1, 2, 3, 4, 5]);
expectType<ArrayFlat<Arr, PositiveInfinity>>([0, 1, 2, 3, 4, 5]);

// Test with Infinity depth
expectType<ArrayFlat<[1, [2, [3, [4]]]], PositiveInfinity>>([1, 2, 3, 4]);
expectType<ArrayFlat<[[[[[1]]]]], PositiveInfinity>>([1]);

expectAssignable<ArrayFlat<[boolean, [string, number?], boolean]>>(
	[true, 'a', false],
);
expectAssignable<ArrayFlat<[boolean, [string, number?], boolean]>>(
	[true, 'a', 1, false],
);

// Test with different element types
expectType<ArrayFlat<[string, [number, boolean]]>>([null! as string, null! as number, null! as boolean]);
expectType<DeepArrayFlat<[string, [number, boolean]]>>([null! as string, null! as number, null! as boolean]);

expectType<ArrayFlat<[{a: number}, [{b: string}]]>>([null! as {a: number}, null! as {b: string}]);
expectType<DeepArrayFlat<[{a: number}, [{b: string}]]>>([null! as {a: number}, null! as {b: string}]);

// Test with union types
expectType<ArrayFlat<[1, 2] | [[3, 4]]>>(null! as [1, 2] | [3, 4]);
expectType<DeepArrayFlat<[1, 2] | [[3, 4]]>>(null! as [1, 2] | [3, 4]);

expectType<ArrayFlat<[1, [2]] | [[3], 4]>>(null! as [1, 2] | [3, 4]);
expectType<DeepArrayFlat<[1, [2]] | [[3], 4]>>(null! as [1, 2] | [3, 4]);

expectAssignable<ArrayFlat<[...Array<[number, string?]>]>>([1, 3, 5]);
expectAssignable<DeepArrayFlat<[...Array<[number, string?]>]>>([1, 3, 5]);

expectType<ArrayFlat<[1, [2, ...Array<3>], 4]>>(null! as [1, 2, ...Array<3>, 4]);
expectType<DeepArrayFlat<[1, [2, ...Array<3>], 4]>>(null! as [1, 2, ...Array<3>, 4]);

// Test with mixed arrays and tuples
expectType<ArrayFlat<['1', number[], '3']>>(null! as ['1', ...number[], '3']);
expectType<DeepArrayFlat<['1', number[], '3']>>(null! as ['1', ...number[], '3']);
expectAssignable<ArrayFlat<[...number[], string[]]>>([1, 2, 3, 'a', 'b', 'c']);
expectAssignable<DeepArrayFlat<[...number[], string[]]>>([1, 2, 3, 'a', 'b', 'c']);
type MutiSpreadArray = [number, Array<'a'>, Array<'b'>, boolean];
expectAssignable<ArrayFlat<MutiSpreadArray>>([1, 'a', 'b', true]);
expectAssignable<DeepArrayFlat<MutiSpreadArray>>([1, 'a', 'b', true]);
expectAssignable<ArrayFlat<MutiSpreadArray>>([1, 'a', 'a', 'a', 'b', true]);
expectAssignable<DeepArrayFlat<MutiSpreadArray>>([1, 'a', 'a', 'a', 'b', true]);

type SpreadArray = ArrayFlat<[1, ...Array<[2, 3?]>, 4]>;
expectAssignable<SpreadArray>([1, 2, 3, 4]);
expectAssignable<SpreadArray>([1, 2, 2, 4]);
expectAssignable<SpreadArray>([1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4]);
expectAssignable<SpreadArray>([1, 2, 3, 2, 4]);

type SpreadArray2 = ArrayFlat<['start', ...Array<[2, 3, 4?]>, 'end']>;
expectAssignable<SpreadArray2>(['start', 2, 3, 4, 'end']);
expectAssignable<SpreadArray2>(['start', 2, 3, 4, 2, 3, 4, 'end']);
expectAssignable<SpreadArray2>(['start', 2, 3, 4, 2, 3, 4, 2, 3, 4, 'end']);
expectAssignable<SpreadArray2>(['start', 2, 3, 2, 3, 2, 3, 'end']);
expectAssignable<SpreadArray2>(['start', 2, 3, 2, 3, 4, 'end']);

// Test with deeply nested structures
expectType<ArrayFlat<[1, [2, [3, [4, [5]]]]], 3>>([1, 2, 3, 4, [5]]);

// Test with readonly arrays
expectType<ArrayFlat<readonly [1, readonly [2, 3]]>>([1, 2, 3]);
expectType<ArrayFlat<readonly [readonly [1, 2], readonly [3, 4]]>>([1, 2, 3, 4]);

// Edge cases
expectType<ArrayFlat<Array<[]>>>([]);
expectType<ArrayFlat<[[]]>>([]);
expectType<ArrayFlat<[[], []]>>([]);
expectType<ArrayFlat<undefined[]>>(null! as undefined[]);
expectType<ArrayFlat<unknown[]>>(null! as unknown[]);

// Test specifically for non-tuple array handling (Array<T> vs [T, T])
type GenericNumberArrays = number[][];
expectAssignable<ArrayFlat<GenericNumberArrays>>([1, 2, 3, 4, 5]);

// Test for deeply nested non-tuple arrays with specific depths
type DeepGenericArray = number[][][][];
expectAssignable<ArrayFlat<DeepGenericArray, 2>>([[1, 2], [3, 4]]);
expectAssignable<ArrayFlat<DeepGenericArray, 3>>([1, 2, 3, 4]);

// Test for mixed generic arrays and tuples
type MixedGenericAndTuple = Array<[number, string]>;
expectAssignable<ArrayFlat<MixedGenericAndTuple>>([1, 'a', 2, 'b']);

// Test for array with optional elements in nested structure
type NestedOptional = [number, Array<[string?, number?]>];
expectAssignable<ArrayFlat<NestedOptional, 2>>([1, 'a', 2, 'b', 3]);
expectType<ArrayFlat<[boolean, [string, number?], boolean]>>(
	null! as [boolean, string, boolean] | [boolean, string, number | undefined, boolean],
);

// Test for arrays with rest elements in nested structure
type NestedRest = [string, Array<[...number[]]>];
expectAssignable<ArrayFlat<NestedRest, 2>>(['a', 1, 2, 3, 4, 5]);

// Test for flattening arrays with union types in nested structures
type NestedUnion = Array<Array<string | number>>;
expectAssignable<ArrayFlat<NestedUnion>>(['a', 1, 'b', 2]);

// Test for empty array in complex structure
type ComplexWithEmpty = [number, Array<[]>, string];
expectAssignable<ArrayFlat<ComplexWithEmpty>>([1, 'string']);

// Test for array with undefined/null elements
type ArrayWithNullish = [number, [undefined, null]];
expectAssignable<ArrayFlat<ArrayWithNullish>>([1, undefined, null]);

// Test for array with mixed depth elements
type MixedDepthArray = [number, string[], [[boolean]]];
expectAssignable<ArrayFlat<MixedDepthArray>>([1, 'a', 'b', [true]]);

// Test for readonly nested arrays with different depths
type ReadonlyNestedComplex = readonly [number, ReadonlyArray<readonly string[]>];
expectAssignable<ArrayFlat<ReadonlyNestedComplex, 2>>([1, 'a', 'b', 'c']);

// Test for recursive flattening with non-array elements
type RecursiveWithNonArray = [number, [string, {a: number}]];
expectAssignable<ArrayFlat<RecursiveWithNonArray>>([1, 'string', {a: 42}]);
