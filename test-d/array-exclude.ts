import {expectType} from 'tsd';
import type {ArrayExclude} from '../index.d.ts';

// All required elements
expectType<[1, 3, 4]>({} as ArrayExclude<[1, 2, 3, 4], 2>);

// All optional elements
expectType<[1?, 3?, 4?]>({} as ArrayExclude<[1?, 2?, 3?, 4?], 2>);

// Mixed required and optional elements
expectType<[1, 3?, 4?]>({} as ArrayExclude<[1, 2, 3?, 4?], 2>);
expectType<[1, 3?, 4?]>({} as ArrayExclude<[1, 2?, 3?, 4?], 2>);

// Explicit undefined in optional elements
expectType<[1, undefined?, 3?]>({} as ArrayExclude<[1, (2 | undefined)?, 3?], 2>);

// Union elements
expectType<[1, 3, 4 | 5]>({} as ArrayExclude<[1, 2 | 3, 4 | 5], 2>);

// Excluding unions
expectType<[1, 3, 5]>({} as ArrayExclude<[1, 2 | 3, 4 | 5], 2 | 4>);

// Required and rest element
// Trailing rest element
expectType<[2, ...string[]]>({} as ArrayExclude<[1, 2, ...string[]], 1>);
expectType<string[]>({} as ArrayExclude<[1, 2, ...string[]], 1 | 2>);
// Leading rest element
expectType<[...string[], 2]>({} as ArrayExclude<[...string[], 1, 2], 1>);
expectType<string[]>({} as ArrayExclude<[...string[], 1, 2], 1 | 2>);
// Rest element in the middle
expectType<[1, ...string[], 3]>({} as ArrayExclude<[1, 2, ...string[], 3, 4], 2 | 4>);
expectType<string[]>({} as ArrayExclude<[1, 2, ...string[], 3, 4], 1 | 2 | 3 | 4>);

// Optional and rest element
expectType<[1?, ...string[]]>({} as ArrayExclude<[1?, 2?, ...string[]], 2>);
expectType<string[]>({} as ArrayExclude<[1?, 2?, ...string[]], 1 | 2>);

// Required, optional, and rest element
expectType<[1, 4?, ...string[]]>({} as ArrayExclude<[1, 2, 3?, 4?, ...string[]], 2 | 3>);

// Excluding rest element
// Trailing rest element
expectType<[1, 2]>({} as ArrayExclude<[1, 2, ...string[]], string>);
expectType<[1?, 2?]>({} as ArrayExclude<[1?, 2?, ...string[]], string>);
expectType<[1, 2, 3?, 4?]>({} as ArrayExclude<[1, 2, 3?, 4?, ...string[]], string>);
expectType<[1, 2, ...number[]]>({} as ArrayExclude<[1, 2, ...Array<string | number>], string>);
expectType<[1?, 2?, ...number[]]>({} as ArrayExclude<[1?, 2?, ...Array<string | number>], string>);
expectType<[1, 2, 3?, 4?, ...number[]]>({} as ArrayExclude<[1, 2, 3?, 4?, ...Array<string | number>], string>);
// Leading rest element
expectType<[1, 2]>({} as ArrayExclude<[...string[], 1, 2], string>);
expectType<[...number[], 1, 2]>({} as ArrayExclude<[...Array<string | number>, 1, 2], string>);
// Rest element in the middle
expectType<[1, 2, 3]>({} as ArrayExclude<[1, ...string[], 2, 3], string>);
expectType<[1, ...number[], 2, 3]>({} as ArrayExclude<[1, ...Array<string | number>, 2, 3], string>);

// Excluding both rest element and non-rest elements
expectType<[1, 3?, 5?, ...number[]]>({} as ArrayExclude<[1, 2, 3?, (4 | 5)?, ...Array<string | number>], 2 | 4 | string>);

// All elements excluded
expectType<[]>({} as ArrayExclude<[1, 2, 3], 1 | 2 | 3>);
expectType<[]>({} as ArrayExclude<[string, number], string | number>);
expectType<[]>({} as ArrayExclude<[1, 2?, 3?, ...string[]], any>);
expectType<[]>({} as ArrayExclude<[1, 2?, 3?, ...string[]], unknown>);

// No elements excluded
expectType<[1, 2, 3]>({} as ArrayExclude<[1, 2, 3], 4>);
expectType<[1, 2?, 3?, ...string[]]>({} as ArrayExclude<[1, 2?, 3?, ...string[]], never>);

// Non-tuple arrays
expectType<string[]>({} as ArrayExclude<Array<string | number>, number>);
expectType<never[]>({} as ArrayExclude<Array<string | number>, string | number>);
