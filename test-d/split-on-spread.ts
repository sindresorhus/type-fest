import {expectType} from 'tsd';
import type {SplitOnSpread} from '../index.d.ts';

// Fixed Tuples (No Spread)
expectType<SplitOnSpread<[]>>({} as [[], [], []]);
expectType<SplitOnSpread<[1]>>({} as [[1], [], []]);
expectType<SplitOnSpread<[1, 2, 3]>>({} as [[1, 2, 3], [], []]);
expectType<SplitOnSpread<readonly ['a', 'b', 'c']>>({} as [['a', 'b', 'c'], [], []]);

// Finite Spreads (flattened manually or fixed-length spread)
expectType<SplitOnSpread<[...[1, 2], 3]>>({} as [[1, 2, 3], [], []]);
expectType<SplitOnSpread<[...[string?, number?]]>>({} as [[string?, number?], [], []]);
expectType<SplitOnSpread<[...[string?, number?]], {keepOptionals: false}>>({} as [[string, number], [], []]);
expectType<SplitOnSpread<[...[never], 1]>>({} as [[never, 1], [], []]);
expectType<SplitOnSpread<[...[], 1]>>({} as [[1], [], []]);

// Infinite Spreads (true variadic)
expectType<SplitOnSpread<[1, ...number[]]>>({} as [[1], [number], []]);
expectType<SplitOnSpread<[1, ...number[], 2]>>({} as [[1], [number], [2]]);
expectType<SplitOnSpread<['a', ...string[], 'b']>>({} as [['a'], [string], ['b']]);
expectType<SplitOnSpread<[...boolean[], string]>>({} as [[], [boolean], [string]]);
expectType<SplitOnSpread<[...string[], 'x', 'y']>>({} as [[], [string], ['x', 'y']]);
expectType<SplitOnSpread<[...string[]]>>({} as [[], [string], []]);
expectType<SplitOnSpread<[...never[]]>>({} as [[], [never], []]);
expectType<SplitOnSpread<[...never[], 1]>>({} as [[], [never], [1]]);
expectType<SplitOnSpread<[undefined, ...boolean[], null]>>({} as [[undefined], [boolean], [null]]);
expectType<SplitOnSpread<[void, ...never[], 1]>>({} as [[void], [never], [1]]);
expectType<SplitOnSpread<[null, ...any[], null]>>({} as [[null], [any], [null]]);

// Generic Arrays
expectType<SplitOnSpread<string[]>>({} as [[], [string], []]);
expectType<SplitOnSpread<number[]>>({} as [[], [number], []]);
expectType<SplitOnSpread<unknown[]>>({} as [[], [unknown], []]);
expectType<SplitOnSpread<any[]>>({} as [[], [any], []]);

// Readonly
expectType<SplitOnSpread<readonly []>>({} as [[], [], []]);
expectType<SplitOnSpread<readonly [number]>>({} as [[number], [], []]);
expectType<SplitOnSpread<readonly [...number[], 2]>>({} as [[], [number], [2]]);
expectType<SplitOnSpread<readonly [1, ...string[], 2]>>({} as [[1], [string], [2]]);
expectType<SplitOnSpread<readonly [1, 2, 3]>>({} as [[1, 2, 3], [], []]);

// Unions
expectType<SplitOnSpread<[...Array<string | number>, boolean]>>({} as [[], [string | number], [boolean]]);
expectType<SplitOnSpread<[...Array<{id: string}>, number]>>({} as [[], [{id: string}], [number]]);
expectType<SplitOnSpread<[1, ...Array<[string, number]>, 2]>>({} as [[1], [[string, number]], [2]]);
expectType<SplitOnSpread<[1, 2] | [3, 4]>>({} as [[1, 2], [], []] | [[3, 4], [], []]);
expectType<SplitOnSpread<[1, ...number[]] | ['foo', ...string[]]>>({} as [[1], [number], []] | [['foo'], [string], []]);

// Exotic Types
expectType<SplitOnSpread<[...[], ...[], ...[], 42]>>({} as [[42], [], []]);
expectType<SplitOnSpread<[...unknown[], true]>>({} as [[], [unknown], [true]]);

// Optional/Undefined/Falsy
expectType<SplitOnSpread<[0, 1?, 2?, ...never[]]>>({} as [[0, 1?, 2?], [never], []]);
expectType<SplitOnSpread<[0, 1?, 2?, ...never[]], {keepOptionals: false}>>({} as [[0, 1, 2], [never], []]);
expectType<SplitOnSpread<[number?, ...string[]]>>({} as [[number?], [string], []]);
expectType<SplitOnSpread<[number?, ...string[]], {keepOptionals: false}>>({} as [[number], [string], []]);

// Edge: Never / Any
expectType<SplitOnSpread<any>>({} as any);
expectType<SplitOnSpread<never>>({} as never);
