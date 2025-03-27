import {expectType} from 'tsd';
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

// Test with rest elements
expectType<ArrayFlat<[...Array<[number, string]>]>>([null! as number, null! as string]);
expectType<ArrayFlat<[1, 2, ...Array<[string, boolean]>]>>([1, 2, null! as string, null! as boolean]);
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
expectType<ArrayFlat<any[]>>(null! as any[]);
expectType<ArrayFlat<unknown[]>>(null! as unknown[]);
expectType<ArrayFlat<never[]>>(null! as never[]);
