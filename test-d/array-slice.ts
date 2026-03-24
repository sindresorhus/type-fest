import {expectType} from 'tsd';
import type {ArraySlice} from '../index.d.ts';

expectType<ArraySlice<[0, 1, 2, 3]>>([0, 1, 2, 3]);
expectType<ArraySlice<[0, 1, 2] | [0, 1, 2, 3], 0>>({} as [0, 1, 2] | [0, 1, 2, 3]);
expectType<ArraySlice<[0, 1, 2] | [3, 2, 1, 0], 0, 2>>({} as [0, 1] | [3, 2]);
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
expectType<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 0>>({} as [0, 1, 2] | ['a', 'b', 'c', 'd']); // Positive start, no end
expectType<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], -2>>({} as [1, 2] | ['c', 'd']); // Negative start, no end
expectType<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 0, 2>>({} as [0, 1] | ['a', 'b']); // Positive start, positive end
expectType<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], -2, -1>>({} as [1] | ['c']); // Negative start, negative end
expectType<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], -3, 2>>({} as [0, 1] | ['b']); // Negative start, positive end
expectType<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 1, -1>>({} as [1] | ['b', 'c']); // Positive start, negative end

// Start is union
expectType<ArraySlice<[0, 1, 2, 3], 1 | -2>>({} as [1, 2, 3] | [2, 3]); // Positive/Negative start, no end
expectType<ArraySlice<[0, 1, 2, 3], 2 | -3, 3>>({} as [2] | [1, 2]); // Positive/Negative start, positive end
expectType<ArraySlice<[0, 1, 2, 3], 0 | -2, -1>>({} as [2] | [0, 1, 2]); // Positive/Negative start, negative end

// End is union
expectType<ArraySlice<[0, 1, 2, 3], 0, 1 | -2>>({} as [0] | [0, 1]); // Positive start, positive/negative end
expectType<ArraySlice<[0, 1, 2, 3], -2, 2 | -1>>({} as [] | [2]); // Negative start, positive/negative end

// Array and start are unions
expectType<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 1 | -1>>({} as [1, 2] | [2] | ['b', 'c', 'd'] | ['d']); // Positive/Negative start, no end
expectType<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 1 | -2, 2>>({} as [1] | ['b'] | []); // Positive/Negative start, positive end
expectType<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 0 | -2, -1>>({} as [0, 1] | [1] | ['a', 'b', 'c'] | ['c']); // Positive/Negative start, negative end

// Array and end are unions
expectType<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 2, 3 | -1>>({} as [2] | [] | ['c']); // Positive start, positive/negative end
expectType<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], -3, 3 | -2>>({} as [0, 1, 2] | [0] | ['b', 'c'] | ['b']); // Negative start, positive/negative end

// Start and end are unions
expectType<ArraySlice<[0, 1, 2, 3], -5 | 0 | 1, -2 | 0 | 3>>( // Positive/Negative start, positive/negative end
	{} as [0, 1] | [0, 1, 2] | [] | [1] | [1, 2],
);

// Array, start and end are unions
expectType<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 1 | -4, 4 | -1>>( // Positive/Negative start, positive/negative end
	{} as [1] | [1, 2] | [0, 1] | [0, 1, 2] | ['a', 'b', 'c', 'd'] | ['a', 'b', 'c'] | ['b', 'c'] | ['b', 'c', 'd'],
);
