import {expectAssignable, expectType} from 'tsd';
import type {ArrayFlat, PositiveInfinity} from '../index';

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

// Test with different element types
expectType<ArrayFlat<[string, [number, boolean]]>>([null! as string, null! as number, null! as boolean]);
expectType<ArrayFlat<[{a: number}, [{b: string}]]>>([null! as {a: number}, null! as {b: string}]);

// Test with union types
expectType<ArrayFlat<[1, 2] | [[3, 4]]>>([1, 2] as [1, 2] | [3, 4]);
expectType<ArrayFlat<[1, [2]] | [[3], 4]>>([1, 2] as [1, 2] | [3, 4]);

expectType<ArrayFlat<[...Array<[number, string]>]>>(null! as [number?, string?, number?, string?, number?, string?, number?, string?, number?, string?, number?, string?, number?, string?, number?, string?, number?, string?, number?, string?]);
expectType<ArrayFlat<[1, [2, ...Array<3>], 4]>>([1, 2, ...(null! as Array<3>), 4]);

// Test with mixed arrays and tuples
expectType<ArrayFlat<[1, number[], 3]>>([1, ...(null! as number[]), 3]);
expectType<ArrayFlat<[string, [number, ...boolean[]]]>>([null! as string, null! as number, ...(null! as boolean[])]);

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
