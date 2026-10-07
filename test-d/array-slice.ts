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

// Optional elements (https://github.com/sindresorhus/type-fest/issues/1090)
declare const withOptionalParameter: (a: number, b: string, isLast?: boolean) => void;
expectType<[string, (boolean | undefined)?]>({} as ArraySlice<Parameters<typeof withOptionalParameter>, 1>);
expectType<[string, (boolean | undefined)?]>({} as ArraySlice<Parameters<typeof withOptionalParameter>, -2>);
expectType<[number, string, (boolean | undefined)?]>({} as ArraySlice<Parameters<typeof withOptionalParameter>>);
expectType<[string]>({} as ArraySlice<Parameters<typeof withOptionalParameter>, 1, 2>);
expectType<[]>({} as ArraySlice<Parameters<typeof withOptionalParameter>, 3>);
expectType<[string?, boolean?]>({} as ArraySlice<[number, string?, boolean?], 1>);
expectType<[number?, string?]>({} as ArraySlice<[number?, string?], 0>);
expectType<[string?]>({} as ArraySlice<[number, string?], -1>);
expectType<[string?]>({} as ArraySlice<[number, string?], 1, 2>);
expectType<readonly [string?, boolean?]>({} as ArraySlice<readonly [number, string?, boolean?], 1>);

// A variable-length array can be shorter than the requested range, so the slice keeps an unknown length.
expectType<number[]>({} as ArraySlice<number[], 0, -1>);
expectType<number[]>({} as ArraySlice<number[], -2>);
expectType<number[]>({} as ArraySlice<number[], 1, 3>);
expectType<number[]>({} as ArraySlice<number[], 0, 2>);
expectType<readonly number[]>({} as ArraySlice<readonly number[], 1, 3>);
expectType<Array<number | string>>({} as ArraySlice<Array<number | string>, 1, 3>);

// A `readonly` array keeps its `readonly` modifier no matter which branch produces the slice.
expectType<readonly number[]>({} as ArraySlice<readonly number[]>);
expectType<readonly number[]>({} as ArraySlice<readonly number[], 0>);
expectType<readonly number[]>({} as ArraySlice<readonly number[], 2>);
expectType<readonly number[]>({} as ArraySlice<readonly number[], -2>);
expectType<number[]>({} as ArraySlice<number[]>);
expectType<number[]>({} as ArraySlice<number[], 2>);

expectType<readonly [1, 2, 3]>({} as ArraySlice<readonly [1, 2, 3]>);
expectType<readonly [2, 3]>({} as ArraySlice<readonly [1, 2, 3], 1>);
expectType<readonly [1, 2]>({} as ArraySlice<readonly [1, 2, 3], 0, 2>);
expectType<readonly [3]>({} as ArraySlice<readonly [1, 2, 3], -1>);
expectType<readonly []>({} as ArraySlice<readonly [1, 2, 3], 3>);
expectType<readonly []>({} as ArraySlice<readonly [1, 2, 3], 1, 1>);
expectType<readonly []>({} as ArraySlice<readonly [], 0>);
expectType<readonly [2]>({} as ArraySlice<readonly [1, 2, 3, ...string[]], 1, 2>);
expectType<[2]>({} as ArraySlice<[1, 2, 3, ...string[]], 1, 2>);

// An array with a statically known prefix still produces a fixed-length slice.
expectType<[string | 1 | 2, string | 1 | 2]>({} as ArraySlice<[...string[], 1, 2], 0, 2>);

// A non-literal index can be any value, so the slice can start or end anywhere and its length is unknown.
expectType<Array<0 | 1 | 2 | 3 | 4>>({} as ArraySlice<[0, 1, 2, 3, 4], number>);
expectType<Array<0 | 1 | 2 | 3 | 4>>({} as ArraySlice<[0, 1, 2, 3, 4], number, 4>);
expectType<ReadonlyArray<0 | 1 | 2 | 3 | 4>>({} as ArraySlice<readonly [0, 1, 2, 3, 4], number>);

// A negative `End` is resolved against the longest length a tuple with optional elements can have, so the result is that longest-case slice. See the known limitation in the docs.
declare const optionalTailNegativeEnd: ArraySlice<[1, 2?], 0, -1>;
expectType<[1]>(optionalTailNegativeEnd);

declare const allOptionalNegativeEnd: ArraySlice<[1?, 2?], 0, -1>;
expectType<[1?]>(allOptionalNegativeEnd);

// A fractional index truncates toward zero at runtime, but the range is resolved through the tuple helpers, which have no answer for a decimal, so the whole slice comes out as `never`. The runtime answers `[1, 2, 3].slice(1.5)` with `[2, 3]` and `[1, 2, 3, 4].slice(0, 2.5)` with `[1, 2]`. Round the index before passing it, or use `StringSlice` for a string.
expectType<never>({} as ArraySlice<[1, 2, 3], 1.5>);
expectType<never>({} as ArraySlice<[1, 2, 3, 4], 0, 2.5>);

// Empty ranges remain empty even when the source length is unknown.
expectType<[]>({} as ArraySlice<string[], 2, 1>);
expectType<readonly []>({} as ArraySlice<readonly [1, ...string[]], 2, 2>);
expectType<[]>({} as ArraySlice<string[], 0, 0>);

// An omitted start still defaults to zero when an end is supplied.
expectType<[1, 2]>({} as ArraySlice<[1, 2, ...string[]], never, 2>);

// An index of `1e21` or more is printed in exponential notation, and is still clamped to the length.
declare const exponentEnd: ArraySlice<[1, 2, 3], 1, 1e21>;
expectType<[2, 3]>(exponentEnd);

declare const exponentEndFromStart: ArraySlice<[1, 2, 3], 0, 1e21>;
expectType<[1, 2, 3]>(exponentEndFromStart);

declare const exponentStart: ArraySlice<[1, 2, 3], 1e21>;
expectType<[]>(exponentStart);

declare const negativeExponentStart: ArraySlice<[1, 2, 3], -1e21>;
expectType<[1, 2, 3]>(negativeExponentStart);

declare const negativeExponentEnd: ArraySlice<[1, 2, 3], 0, -1e21>;
expectType<[]>(negativeExponentEnd);
