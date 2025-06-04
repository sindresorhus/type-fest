import {expectType} from 'tsd';
import type {IsLeadingSpread} from '../../source/internal/array.d.ts';

// Fixed Tuples
expectType<IsLeadingSpread<[]>>(false);
expectType<IsLeadingSpread<[1]>>(false);
expectType<IsLeadingSpread<[1, 2, 3]>>(false);
expectType<IsLeadingSpread<readonly ['a', 'b', 'c']>>(false);

// Finite Spread
expectType<IsLeadingSpread<[...[number, number], string]>>(false);
expectType<IsLeadingSpread<[...number[], string[]]>>(true);
expectType<IsLeadingSpread<[...[string?, number?]]>>(false);
expectType<IsLeadingSpread<[...[never], 1]>>(false);
expectType<IsLeadingSpread<[...[], 1]>>(false);

// Spread at the end (not leading)
expectType<IsLeadingSpread<[1, ...number[]]>>(false);
expectType<IsLeadingSpread<['start', ...string[]]>>(false);

// Spread at the middle (not leading)
expectType<IsLeadingSpread<[1, ...number[], 2]>>(false);
expectType<IsLeadingSpread<['start', ...string[], 'end']>>(false);

// Spread at the start (leading)
expectType<IsLeadingSpread<string[]>>(true);
expectType<IsLeadingSpread<number[]>>(true);
expectType<IsLeadingSpread<any[]>>(true);
expectType<IsLeadingSpread<unknown[]>>(true);
expectType<IsLeadingSpread<readonly any[]>>(true);
expectType<IsLeadingSpread<readonly [...number[], 2]>>(true);
expectType<IsLeadingSpread<[...string[], 'end']>>(true);
expectType<IsLeadingSpread<[...string[]]>>(true);
expectType<IsLeadingSpread<[...never[], 1]>>(true);
expectType<IsLeadingSpread<[...Array<[number, number | string]>, unknown]>>(true);

// Edge cases
expectType<IsLeadingSpread<readonly []>>(false);
expectType<IsLeadingSpread<readonly [number]>>(false);
expectType<IsLeadingSpread<[...[], 1]>>(false);

// Wrapped inferable patterns
type FromFunction<T extends unknown[]> = (...args: T) => void;

declare const f1: FromFunction<[1, 2, 3]>;
declare const f2: FromFunction<number[]>;

type Args1 = Parameters<typeof f1>;
type Args2 = Parameters<typeof f2>;

expectType<IsLeadingSpread<Args1>>(false);
expectType<IsLeadingSpread<Args2>>(true);

// Readonly
expectType<IsLeadingSpread<readonly [1, 2, 3]>>(false);
expectType<IsLeadingSpread<readonly [...number[], 2]>>(true);
