import {expectType} from 'tsd';
import type {SplitOnRestElement, TupleOf, UnknownArray} from '../index.d.ts';

// Fixed tuples (No rest element)
expectType<SplitOnRestElement<[]>>({} as [[], [], []]);
expectType<SplitOnRestElement<[1]>>({} as [[1], [], []]);
expectType<SplitOnRestElement<[1, 2, 3]>>({} as [[1, 2, 3], [], []]);
expectType<SplitOnRestElement<readonly ['a', 'b', 'c']>>({} as readonly [['a', 'b', 'c'], [], []]);

// Rest elements (true variadic)
expectType<SplitOnRestElement<[1, ...number[]]>>({} as [[1], number[], []]);
expectType<SplitOnRestElement<[...string[]]>>({} as [[], string[], []]);
expectType<SplitOnRestElement<[...never[]]>>({} as [[], never[], []]);
expectType<SplitOnRestElement<[1, ...number[], 2]>>({} as [[1], number[], [2]]);
expectType<SplitOnRestElement<['a', ...string[], 'b']>>({} as [['a'], string[], ['b']]);
expectType<SplitOnRestElement<[...boolean[], string]>>({} as [[], boolean[], [string]]);
expectType<SplitOnRestElement<[...string[], 'x', 'y']>>({} as [[], string[], ['x', 'y']]);
expectType<SplitOnRestElement<[...never[], 1]>>({} as [[], never[], [1]]);
expectType<SplitOnRestElement<[undefined, ...boolean[], null]>>({} as [[undefined], boolean[], [null]]);
expectType<SplitOnRestElement<[void, ...never[], 1]>>({} as [[void], never[], [1]]);
expectType<SplitOnRestElement<[null, ...any[], null]>>({} as [[null], any[], [null]]);
expectType<SplitOnRestElement<[...Array<{id: string}>, number]>>({} as [[], Array<{id: string}>, [number]]);
expectType<SplitOnRestElement<[1, ...Array<readonly [string, number]>, 2]>>({} as [[1], Array<readonly [string, number]>, [2]]);

// Generic arrays
expectType<SplitOnRestElement<string[]>>({} as [[], string[], []]);
expectType<SplitOnRestElement<number[]>>({} as [[], number[], []]);
expectType<SplitOnRestElement<unknown[]>>({} as [[], unknown[], []]);
expectType<SplitOnRestElement<any[]>>({} as [[], any[], []]);

// Unions
expectType<SplitOnRestElement<[...Array<string | number>, boolean]>>({} as [[], Array<string | number>, [boolean]]);
expectType<SplitOnRestElement<[1, 2] | [3, 4]>>({} as [[1, 2], [], []] | [[3, 4], [], []]);
expectType<SplitOnRestElement<[1, ...number[]] | ['foo', ...string[]]>>({} as [[1], number[], []] | [['foo'], string[], []]);

// Preserve optional
expectType<SplitOnRestElement<[0, 1?, 2?, ...never[]]>>({} as [[0, 1?, 2?], never[], []]);
expectType<SplitOnRestElement<[number?, ...string[]]>>({} as [[number?], string[], []]);
expectType<SplitOnRestElement<[number, boolean?, ...string[]]>>({} as [[number, boolean?], string[], []]);

// Remove optional
expectType<SplitOnRestElement<[0, 1?, 2?, ...never[]], {preserveOptionalModifier: false}>>({} as [[0, 1, 2], never[], []]);
expectType<SplitOnRestElement<[number?, ...string[]], {preserveOptionalModifier: false}>>({} as [[number], string[], []]);
expectType<SplitOnRestElement<[number, boolean?, ...string[]], {preserveOptionalModifier: false}>>({} as [[number, boolean], string[], []]);

// Readonly
expectType<SplitOnRestElement<readonly []>>({} as readonly [[], [], []]);
expectType<SplitOnRestElement<readonly [number] | [string]>>({} as readonly [[number], [], []] | [[string], [], []]);
expectType<SplitOnRestElement<readonly [...number[], 2]>>({} as readonly [[], number[], [2]]);
expectType<SplitOnRestElement<readonly [1, ...string[], 2] | readonly ['foo'?, ...string[]]>>({} as readonly [[1], string[], [2]] | readonly [['foo'?], string[], []]);
expectType<SplitOnRestElement<readonly [1, 2, 3]>>({} as readonly [[1, 2, 3], [], []]);

// Edge: `never` / `any`
expectType<SplitOnRestElement<any>>({} as any);
expectType<SplitOnRestElement<never>>({} as never);

// Long tuples
type FiftyZeroes = TupleOf<50, '0'>;
expectType<SplitOnRestElement<[...FiftyZeroes, ...number[], ...FiftyZeroes]>>({} as [FiftyZeroes, number[], FiftyZeroes]);

type FourHundredNinetyNineZeroes = TupleOf<499, '0'>;
expectType<SplitOnRestElement<[...FourHundredNinetyNineZeroes, ...number[], ...FourHundredNinetyNineZeroes]>>({} as [FourHundredNinetyNineZeroes, number[], FourHundredNinetyNineZeroes]);

// Generic instantiations
type Assignability<_T extends UnknownArray> = unknown;
type TestAssignability<T extends UnknownArray> = Assignability<SplitOnRestElement<T>>;
