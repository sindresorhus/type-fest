import {expectType} from 'tsd';
import type {ArraySlice} from '../index.d.ts';

expectType<ArraySlice<[0, 1, 2, 3]>>([0, 1, 2, 3]);
expectType<ArraySlice<[0, 1, 2, 3]>>([0, 1, 2, 3]);
expectType<ArraySlice<[0, 1, 2, 3], 1>>([1, 2, 3]);
expectType<ArraySlice<[0, 1, 2, 3], 1, 2>>([1]);
expectType<ArraySlice<[0, 1, 2, 3], 1, -1>>([1, 2]);
expectType<ArraySlice<[0, 1, 2, 3], -1, -1>>([]);
expectType<ArraySlice<[0, 1, 2, 3], -2, -1>>([2]);
expectType<ArraySlice<[0, 1, 2, 3], -100>>([0, 1, 2, 3]);
expectType<ArraySlice<[0, 1, 2, 3], -100, 4>>([0, 1, 2, 3]);
expectType<ArraySlice<[0, 1, 2, 3], -100, 3>>([0, 1, 2]);
expectType<ArraySlice<[0, 1, 2, 3], -100, -1>>([0, 1, 2]);
expectType<ArraySlice<[0, 1, 2, 3], 2, 1>>([]);
expectType<ArraySlice<[0, 1, 2, 3], -10, 1>>([0]);
expectType<ArraySlice<[0, 1, 2, 3], 0, -3>>([0]);
expectType<ArraySlice<[0, 1, 2, 3], 0, -4>>([]);
expectType<ArraySlice<[], -10, 1>>([]);
expectType<ArraySlice<[]>>([]);

expectType<ArraySlice<[...string[], 1, 2]>>([...(null! as string[]), 1, 2]);
expectType<ArraySlice<[...string[], 1, 2], 0>>([...(null! as string[]), 1, 2]);
expectType<ArraySlice<[...string[], 1, 2], 0, 2>>([null! as (string | 1 | 2), null! as (string | 1 | 2)]);
expectType<ArraySlice<[...string[], 1, 2], 1, 4>>([null! as (string | 1 | 2), null! as (string | 1 | 2), null! as (string | 1 | 2)]);

expectType<ArraySlice<[1, 2, 3, ...string[]]>>([1, 2, 3, ...(null! as string[])]);
expectType<ArraySlice<[1, 2, 3, ...string[]], 0>>([1, 2, 3, ...(null! as string[])]);
expectType<ArraySlice<[1, 2, 3, ...string[]], 0, 3>>([1, 2, 3]);
expectType<ArraySlice<[1, 2, 3, ...string[]], 1, 5>>([2, 3, null! as string, null! as string]);

expectType<ArraySlice<[1, 2, 3, ...string[], 4, 5]>>([1, 2, 3, ...(null! as string[]), 4, 5]);
expectType<ArraySlice<[1, 2, 3, ...string[], 4, 5], 0>>([1, 2, 3, ...(null! as string[]), 4, 5]);
expectType<ArraySlice<[1, 2, 3, ...string[], 4, 5], 1, 5>>([2, 3, null! as (string | 4 | 5), null! as (string | 4 | 5)]);
expectType<ArraySlice<[1, 2, 3, ...string[], 4, 5], 0>>([1, 2, 3, ...(null! as string[]), 4, 5]);
expectType<ArraySlice<[1, 2, 3, ...string[], 4, 5], 1>>([2, 3, ...(null! as string[]), 4, 5]);
expectType<ArraySlice<[1, 2, 3, ...string[], 4, 5], 3>>([...(null! as string[]), 4, 5]);
expectType<ArraySlice<[1, 2, 3, ...string[], 4, 5], 10>>([...(null! as string[]), 4, 5]);

// Unions
// Array is union
expectType<ArraySlice<[0, 1, 2] | [0, 1, 2, 3], 0>>({} as [0, 1, 2] | [0, 1, 2, 3]);
expectType<ArraySlice<[0, 1, 2] | [3, 2, 1, 0], 0, 2>>({} as [0, 1] | [3, 2]);

// Start is union
expectType<ArraySlice<[0, 1, 2, 3], 1 | 3>>({} as [1, 2, 3] | [3]);
expectType<ArraySlice<[0, 1, 2, 3], 0 | 2, 3>>({} as [0, 1, 2] | [2]);

// End is union
expectType<ArraySlice<[0, 1, 2, 3], 1, 2 | 3>>({} as [1] | [1, 2]);

// Array and start are unions
expectType<ArraySlice<[0, 1, 2] | [3, 2, 1, 0], 1 | 2>>({} as [1, 2] | [2] | [2, 1, 0] | [1, 0]);

// Array and end are unions
expectType<ArraySlice<[0, 1, 2] | [3, 2, 1, 0], 1, 2 | 3>>({} as [1] | [1, 2] | [2] | [2, 1]);

// Start and end are unions
expectType<ArraySlice<[0, 1, 2, 3], 0 | 1, 2 | 3>>({} as [0, 1] | [0, 1, 2] | [1] | [1, 2]);

// Array, start and end are unions
expectType<ArraySlice<[0, 1, 2] | [3, 2, 1, 0], 0 | 1, 2 | 3>>({} as [0, 1] | [0, 1, 2] | [1] | [1, 2] | [3, 2] | [3, 2, 1] | [2] | [2, 1]);
