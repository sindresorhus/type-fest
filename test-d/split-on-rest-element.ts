import {expectType} from 'tsd';
import type {SplitOnRestElement} from '../index.d.ts';

// Fixed Tuples (No Rest element)
expectType<SplitOnRestElement<[]>>({} as [[], [], []]);
expectType<SplitOnRestElement<[1]>>({} as [[1], [], []]);
expectType<SplitOnRestElement<[1, 2, 3]>>({} as [[1, 2, 3], [], []]);
expectType<SplitOnRestElement<readonly ['a', 'b', 'c']>>({} as [['a', 'b', 'c'], [], []]);

// Finite Rest elements (flattened manually or fixed-length rest element)
expectType<SplitOnRestElement<[...[1, 2], 3]>>({} as [[1, 2, 3], [], []]);
expectType<SplitOnRestElement<[...[string?, number?]]>>({} as [[string?, number?], [], []]);
expectType<SplitOnRestElement<[...[string?, number?]], {preserveOptionalModifier: false}>>({} as [[string, number], [], []]);
expectType<SplitOnRestElement<[...[never], 1]>>({} as [[never, 1], [], []]);
expectType<SplitOnRestElement<[...[], 1]>>({} as [[1], [], []]);

// Infinite Rest elements (true variadic)
expectType<SplitOnRestElement<[1, ...number[]]>>({} as [[1], number[], []]);
expectType<SplitOnRestElement<[1, ...number[], 2]>>({} as [[1], number[], [2]]);
expectType<SplitOnRestElement<['a', ...string[], 'b']>>({} as [['a'], string[], ['b']]);
expectType<SplitOnRestElement<[...boolean[], string]>>({} as [[], boolean[], [string]]);
expectType<SplitOnRestElement<[...string[], 'x', 'y']>>({} as [[], string[], ['x', 'y']]);
expectType<SplitOnRestElement<[...string[]]>>({} as [[], string[], []]);
expectType<SplitOnRestElement<[...never[]]>>({} as [[], never[], []]);
expectType<SplitOnRestElement<[...never[], 1]>>({} as [[], never[], [1]]);
expectType<SplitOnRestElement<[undefined, ...boolean[], null]>>({} as [[undefined], boolean[], [null]]);
expectType<SplitOnRestElement<[void, ...never[], 1]>>({} as [[void], never[], [1]]);
expectType<SplitOnRestElement<[null, ...any[], null]>>({} as [[null], any[], [null]]);

// Generic Arrays
expectType<SplitOnRestElement<string[]>>({} as [[], string[], []]);
expectType<SplitOnRestElement<number[]>>({} as [[], number[], []]);
expectType<SplitOnRestElement<unknown[]>>({} as [[], unknown[], []]);
expectType<SplitOnRestElement<any[]>>({} as [[], any[], []]);

// Readonly
expectType<SplitOnRestElement<readonly []>>({} as [[], [], []]);
expectType<SplitOnRestElement<readonly [number]>>({} as [[number], [], []]);
expectType<SplitOnRestElement<readonly [...number[], 2]>>({} as [[], number[], [2]]);
expectType<SplitOnRestElement<readonly [1, ...string[], 2]>>({} as [[1], string[], [2]]);
expectType<SplitOnRestElement<readonly [1, 2, 3]>>({} as [[1, 2, 3], [], []]);

// Unions
expectType<SplitOnRestElement<[...Array<string | number>, boolean]>>({} as [[], Array<string | number>, [boolean]]);
expectType<SplitOnRestElement<[...Array<{id: string}>, number]>>({} as [[], Array<{id: string}>, [number]]);
expectType<SplitOnRestElement<[1, ...Array<[string, number]>, 2]>>({} as [[1], Array<[string, number]>, [2]]);
expectType<SplitOnRestElement<[1, 2] | [3, 4]>>({} as [[1, 2], [], []] | [[3, 4], [], []]);
expectType<SplitOnRestElement<[1, ...number[]] | ['foo', ...string[]]>>({} as [[1], number[], []] | [['foo'], string[], []]);

// Exotic Types
expectType<SplitOnRestElement<[...[], ...[], ...[], 42]>>({} as [[42], [], []]);
expectType<SplitOnRestElement<[...unknown[], true]>>({} as [[], unknown[], [true]]);

// Optional/Undefined/Falsy
expectType<SplitOnRestElement<[0, 1?, 2?, ...never[]]>>({} as [[0, 1?, 2?], never[], []]);
expectType<SplitOnRestElement<[0, 1?, 2?, ...never[]], {preserveOptionalModifier: false}>>({} as [[0, 1, 2], never[], []]);
expectType<SplitOnRestElement<[number?, ...string[]]>>({} as [[number?], string[], []]);
expectType<SplitOnRestElement<[number?, ...string[]], {preserveOptionalModifier: false}>>({} as [[number], string[], []]);

// Edge: Never / Any
expectType<SplitOnRestElement<any>>({} as any);
expectType<SplitOnRestElement<never>>({} as never);
