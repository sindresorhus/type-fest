import {expectTypeOf} from 'nz';
import type {ArraySlice} from '../index.d.ts';

expectTypeOf<ArraySlice<[0, 1, 2, 3]>>().toBe<[0, 1, 2, 3]>();
expectTypeOf<[0, 1, 2] | [0, 1, 2, 3]>().toBe<ArraySlice<[0, 1, 2] | [0, 1, 2, 3], 0>>();
expectTypeOf<[0, 1] | [3, 2]>().toBe<ArraySlice<[0, 1, 2] | [3, 2, 1, 0], 0, 2>>();
expectTypeOf<ArraySlice<[0, 1, 2, 3]>>().toBe<[0, 1, 2, 3]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], 1>>().toBe<[1, 2, 3]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], 1, 2>>().toBe<[1]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], 1, -1>>().toBe<[1, 2]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], -1, -1>>().toBe<[]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], -2, -1>>().toBe<[2]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], -100>>().toBe<[0, 1, 2, 3]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], -100, 4>>().toBe<[0, 1, 2, 3]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], -100, 3>>().toBe<[0, 1, 2]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], -100, -1>>().toBe<[0, 1, 2]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], 2, 1>>().toBe<[]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], -10, 1>>().toBe<[0]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], 0, -3>>().toBe<[0]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], 0, -4>>().toBe<[]>();
expectTypeOf<ArraySlice<[], -10, 1>>().toBe<[]>();
expectTypeOf<ArraySlice<[]>>().toBe<[]>();

expectTypeOf<ArraySlice<[...string[], 1, 2]>>().toBe<[...string[], 1, 2]>();
expectTypeOf<ArraySlice<[...string[], 1, 2], 0>>().toBe<[...string[], 1, 2]>();
expectTypeOf<ArraySlice<[...string[], 1, 2], 0, 2>>().toBe<[string | 1 | 2, string | 1 | 2]>();
expectTypeOf<ArraySlice<[...string[], 1, 2], 1, 4>>().toBe<[string | 1 | 2, string | 1 | 2, string | 1 | 2]>();

expectTypeOf<ArraySlice<[1, 2, 3, ...string[]]>>().toBe<[1, 2, 3, ...string[]]>();
expectTypeOf<ArraySlice<[1, 2, 3, ...string[]], 0>>().toBe<[1, 2, 3, ...string[]]>();
expectTypeOf<ArraySlice<[1, 2, 3, ...string[]], 0, 3>>().toBe<[1, 2, 3]>();
expectTypeOf<ArraySlice<[1, 2, 3, ...string[]], 1, 5>>().toBe<[2, 3, string, string]>();

expectTypeOf<ArraySlice<[1, 2, 3, ...string[], 4, 5]>>().toBe<[1, 2, 3, ...string[], 4, 5]>();
expectTypeOf<ArraySlice<[1, 2, 3, ...string[], 4, 5], 0>>().toBe<[1, 2, 3, ...string[], 4, 5]>();
expectTypeOf<ArraySlice<[1, 2, 3, ...string[], 4, 5], 1, 5>>().toBe<[2, 3, string | 4 | 5, string | 4 | 5]>();
expectTypeOf<ArraySlice<[1, 2, 3, ...string[], 4, 5], 0>>().toBe<[1, 2, 3, ...string[], 4, 5]>();
expectTypeOf<ArraySlice<[1, 2, 3, ...string[], 4, 5], 1>>().toBe<[2, 3, ...string[], 4, 5]>();
expectTypeOf<ArraySlice<[1, 2, 3, ...string[], 4, 5], 3>>().toBe<[...string[], 4, 5]>();
expectTypeOf<ArraySlice<[1, 2, 3, ...string[], 4, 5], 10>>().toBe<[...string[], 4, 5]>();

// Unions
// Array is union
expectTypeOf<[0, 1, 2] | ['a', 'b', 'c', 'd']>().toBe<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 0>>(); // Positive start, no end
expectTypeOf<[1, 2] | ['c', 'd']>().toBe<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], -2>>(); // Negative start, no end
expectTypeOf<[0, 1] | ['a', 'b']>().toBe<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 0, 2>>(); // Positive start, positive end
expectTypeOf<[1] | ['c']>().toBe<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], -2, -1>>(); // Negative start, negative end
expectTypeOf<[0, 1] | ['b']>().toBe<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], -3, 2>>(); // Negative start, positive end
expectTypeOf<[1] | ['b', 'c']>().toBe<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 1, -1>>(); // Positive start, negative end

// Start is union
expectTypeOf<[1, 2, 3] | [2, 3]>().toBe<ArraySlice<[0, 1, 2, 3], 1 | -2>>(); // Positive/Negative start, no end
expectTypeOf<[2] | [1, 2]>().toBe<ArraySlice<[0, 1, 2, 3], 2 | -3, 3>>(); // Positive/Negative start, positive end
expectTypeOf<[2] | [0, 1, 2]>().toBe<ArraySlice<[0, 1, 2, 3], 0 | -2, -1>>(); // Positive/Negative start, negative end

// End is union
expectTypeOf<[0] | [0, 1]>().toBe<ArraySlice<[0, 1, 2, 3], 0, 1 | -2>>(); // Positive start, positive/negative end
expectTypeOf<[] | [2]>().toBe<ArraySlice<[0, 1, 2, 3], -2, 2 | -1>>(); // Negative start, positive/negative end

// Array and start are unions
expectTypeOf<[1, 2] | [2] | ['b', 'c', 'd'] | ['d']>().toBe<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 1 | -1>>(); // Positive/Negative start, no end
expectTypeOf<[1] | ['b'] | []>().toBe<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 1 | -2, 2>>(); // Positive/Negative start, positive end
expectTypeOf<[0, 1] | [1] | ['a', 'b', 'c'] | ['c']>().toBe<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 0 | -2, -1>>(); // Positive/Negative start, negative end

// Array and end are unions
expectTypeOf<[2] | [] | ['c']>().toBe<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 2, 3 | -1>>(); // Positive start, positive/negative end
expectTypeOf<[0, 1, 2] | [0] | ['b', 'c'] | ['b']>().toBe<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], -3, 3 | -2>>(); // Negative start, positive/negative end

// Start and end are unions
// Positive/Negative start, positive/negative end
expectTypeOf<[0, 1] | [0, 1, 2] | [] | [1] | [1, 2]>().toBe<ArraySlice<[0, 1, 2, 3], -5 | 0 | 1, -2 | 0 | 3>>();

// Array, start and end are unions
// Positive/Negative start, positive/negative end
expectTypeOf<[1] | [1, 2] | [0, 1] | [0, 1, 2] | ['a', 'b', 'c', 'd'] | ['a', 'b', 'c'] | ['b', 'c'] | ['b', 'c', 'd']>().toBe<ArraySlice<[0, 1, 2] | ['a', 'b', 'c', 'd'], 1 | -4, 4 | -1>>();

// Optional elements (https://github.com/sindresorhus/type-fest/issues/1090)
declare const withOptionalParameter: (a: number, b: string, isLast?: boolean) => void;
expectTypeOf<ArraySlice<Parameters<typeof withOptionalParameter>, 1>>().toBe<[string, (boolean | undefined)?]>();
expectTypeOf<ArraySlice<Parameters<typeof withOptionalParameter>, -2>>().toBe<[string, (boolean | undefined)?]>();
expectTypeOf<ArraySlice<Parameters<typeof withOptionalParameter>>>().toBe<[number, string, (boolean | undefined)?]>();
expectTypeOf<ArraySlice<Parameters<typeof withOptionalParameter>, 1, 2>>().toBe<[string]>();
expectTypeOf<ArraySlice<Parameters<typeof withOptionalParameter>, 3>>().toBe<[]>();
expectTypeOf<ArraySlice<[number, string?, boolean?], 1>>().toBe<[string?, boolean?]>();
expectTypeOf<ArraySlice<[number?, string?], 0>>().toBe<[number?, string?]>();
expectTypeOf<ArraySlice<[number, string?], -1>>().toBe<[string?]>();
expectTypeOf<ArraySlice<[number, string?], 1, 2>>().toBe<[string?]>();
expectTypeOf<ArraySlice<readonly [number, string?, boolean?], 1>>().toBe<readonly [string?, boolean?]>();

// A variable-length array can be shorter than the requested range, so the slice keeps an unknown length.
expectTypeOf<ArraySlice<number[], 0, -1>>().toBe<number[]>();
expectTypeOf<ArraySlice<number[], -2>>().toBe<number[]>();
expectTypeOf<ArraySlice<number[], 1, 3>>().toBe<number[]>();
expectTypeOf<ArraySlice<number[], 0, 2>>().toBe<number[]>();
expectTypeOf<ArraySlice<readonly number[], 1, 3>>().toBe<readonly number[]>();
expectTypeOf<ArraySlice<Array<number | string>, 1, 3>>().toBe<Array<number | string>>();

// A `readonly` array keeps its `readonly` modifier no matter which branch produces the slice.
expectTypeOf<ArraySlice<readonly number[]>>().toBe<readonly number[]>();
expectTypeOf<ArraySlice<readonly number[], 0>>().toBe<readonly number[]>();
expectTypeOf<ArraySlice<readonly number[], 2>>().toBe<readonly number[]>();
expectTypeOf<ArraySlice<readonly number[], -2>>().toBe<readonly number[]>();
expectTypeOf<ArraySlice<number[]>>().toBe<number[]>();
expectTypeOf<ArraySlice<number[], 2>>().toBe<number[]>();

expectTypeOf<ArraySlice<readonly [1, 2, 3]>>().toBe<readonly [1, 2, 3]>();
expectTypeOf<ArraySlice<readonly [1, 2, 3], 1>>().toBe<readonly [2, 3]>();
expectTypeOf<ArraySlice<readonly [1, 2, 3], 0, 2>>().toBe<readonly [1, 2]>();
expectTypeOf<ArraySlice<readonly [1, 2, 3], -1>>().toBe<readonly [3]>();
expectTypeOf<ArraySlice<readonly [1, 2, 3], 3>>().toBe<readonly []>();
expectTypeOf<ArraySlice<readonly [1, 2, 3], 1, 1>>().toBe<readonly []>();
expectTypeOf<ArraySlice<readonly [], 0>>().toBe<readonly []>();
expectTypeOf<ArraySlice<readonly [1, 2, 3, ...string[]], 1, 2>>().toBe<readonly [2]>();
expectTypeOf<ArraySlice<[1, 2, 3, ...string[]], 1, 2>>().toBe<[2]>();

// An array with a statically known prefix still produces a fixed-length slice.
expectTypeOf<ArraySlice<[...string[], 1, 2], 0, 2>>().toBe<[string | 1 | 2, string | 1 | 2]>();

// A non-literal index can be any value, so the slice can start or end anywhere and its length is unknown.
expectTypeOf<ArraySlice<[0, 1, 2, 3, 4], number>>().toBe<Array<0 | 1 | 2 | 3 | 4>>();
expectTypeOf<ArraySlice<[0, 1, 2, 3, 4], number, 4>>().toBe<Array<0 | 1 | 2 | 3 | 4>>();
expectTypeOf<ArraySlice<readonly [0, 1, 2, 3, 4], number>>().toBe<ReadonlyArray<0 | 1 | 2 | 3 | 4>>();

// A negative `End` is resolved against the longest length a tuple with optional elements can have, so the result is that longest-case slice. See the known limitation in the docs.
declare const optionalTailNegativeEnd: ArraySlice<[1, 2?], 0, -1>;
expectTypeOf(optionalTailNegativeEnd).toBe<[1]>();

declare const allOptionalNegativeEnd: ArraySlice<[1?, 2?], 0, -1>;
expectTypeOf(allOptionalNegativeEnd).toBe<[1?]>();

// A fractional index truncates toward zero at runtime, but the range is resolved through the tuple helpers, which have no answer for a decimal, so the whole slice comes out as `never`. The runtime answers `[1, 2, 3].slice(1.5)` with `[2, 3]` and `[1, 2, 3, 4].slice(0, 2.5)` with `[1, 2]`. Round the index before passing it, or use `StringSlice` for a string.
expectTypeOf<ArraySlice<[1, 2, 3], 1.5>>().toBe<never>();
expectTypeOf<ArraySlice<[1, 2, 3, 4], 0, 2.5>>().toBe<never>();

// Empty ranges remain empty even when the source length is unknown.
expectTypeOf<ArraySlice<string[], 2, 1>>().toBe<[]>();
expectTypeOf<ArraySlice<readonly [1, ...string[]], 2, 2>>().toBe<readonly []>();
expectTypeOf<ArraySlice<string[], 0, 0>>().toBe<[]>();

// An omitted start still defaults to zero when an end is supplied.
expectTypeOf<ArraySlice<[1, 2, ...string[]], never, 2>>().toBe<[1, 2]>();

// An index of `1e21` or more is printed in exponential notation, and is still clamped to the length.
declare const exponentEnd: ArraySlice<[1, 2, 3], 1, 1e21>;
expectTypeOf(exponentEnd).toBe<[2, 3]>();

declare const exponentEndFromStart: ArraySlice<[1, 2, 3], 0, 1e21>;
expectTypeOf(exponentEndFromStart).toBe<[1, 2, 3]>();

declare const exponentStart: ArraySlice<[1, 2, 3], 1e21>;
expectTypeOf(exponentStart).toBe<[]>();

declare const negativeExponentStart: ArraySlice<[1, 2, 3], -1e21>;
expectTypeOf(negativeExponentStart).toBe<[1, 2, 3]>();

declare const negativeExponentEnd: ArraySlice<[1, 2, 3], 0, -1e21>;
expectTypeOf(negativeExponentEnd).toBe<[]>();

// A negative index counts back from the end, like `Array#slice()` (https://github.com/sindresorhus/type-fest/issues/1325)
expectTypeOf<ArraySlice<readonly [1, 2, 3, 4], -2, -1>>().toBe<readonly [3]>();
expectTypeOf<ArraySlice<readonly ['a', 3], -2, -1>>().toBe<readonly ['a']>();
expectTypeOf<ArraySlice<readonly ['a', 3], -3, 2>>().toBe<readonly ['a', 3]>();
expectTypeOf<ArraySlice<readonly ['a', 3], 1, -2>>().toBe<readonly []>();
expectTypeOf<ArraySlice<readonly ['a', 3], -1, -1>>().toBe<readonly []>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], -4>>().toBe<[0, 1, 2, 3]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], -4, -1>>().toBe<[0, 1, 2]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], -3, 3>>().toBe<[1, 2]>();
expectTypeOf<ArraySlice<[0, 1, 2, 3], 1, -4>>().toBe<[]>();

// A negative index on an array without a fixed length gives an array of unknown length instead of `[]`. This can be wider than the runtime result, for example `[...string[], 1, 2]` sliced from `-2` is always `[1, 2]`.
expectTypeOf<ArraySlice<string[], -2, -1>>().toBe<string[]>();
expectTypeOf<ArraySlice<unknown[], -1>>().toBe<unknown[]>();
expectTypeOf<ArraySlice<any[], -2>>().toBe<any[]>();
expectTypeOf<ArraySlice<readonly any[], -2, -1>>().toBe<readonly any[]>();
expectTypeOf<ArraySlice<any, -2>>().toBe<any[]>();
expectTypeOf<ArraySlice<[1, 2, ...string[]], -2, -1>>().toBe<Array<string | 1 | 2>>();
expectTypeOf<ArraySlice<[...string[], 1, 2], -2>>().toBe<Array<string | 1 | 2>>();
expectTypeOf<ArraySlice<readonly [1, ...string[]], -1>>().toBe<ReadonlyArray<string | 1>>();

// `never` is an empty union of arrays, so its slice is `never` too.
expectTypeOf<ArraySlice<never, -2>>().toBe<never>();
