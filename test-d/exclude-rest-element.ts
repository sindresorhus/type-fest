import {expectType} from 'tsd';
import type {ExcludeRestElement, TupleOf, UnknownArray} from '../index.d.ts';

// Basic static tuples (No rest element)
expectType<ExcludeRestElement<[]>>({} as []);
expectType<ExcludeRestElement<[1]>>({} as [1]);
expectType<ExcludeRestElement<[1, 2, 3]>>({} as [1, 2, 3]);
expectType<ExcludeRestElement<readonly ['a', 'b']>>({} as readonly ['a', 'b']);

// Leading rest element
expectType<ExcludeRestElement<[...string[], 1]>>({} as [1]);
expectType<ExcludeRestElement<[...number[], 'a', 'b']>>({} as ['a', 'b']);
expectType<ExcludeRestElement<[...any[], true]>>({} as [true]);
expectType<ExcludeRestElement<[...never[], 'end']>>({} as ['end']);
expectType<ExcludeRestElement<[...unknown[], 2, 3]>>({} as [2, 3]);

// Middle rest element
expectType<ExcludeRestElement<['a', ...string[], 'z']>>({} as ['a', 'z']);
expectType<ExcludeRestElement<['x', ...boolean[], true]>>({} as ['x', true]);
expectType<ExcludeRestElement<['x', ...any[], 'y']>>({} as ['x', 'y']);
expectType<ExcludeRestElement<['x', ...readonly number[], 'y']>>({} as ['x', 'y']);

// Trailing rest element
expectType<ExcludeRestElement<[1, 2, ...string[]]>>({} as [1, 2]);
expectType<ExcludeRestElement<['foo', ...Array<'bar'>]>>({} as ['foo']);
expectType<ExcludeRestElement<[number, ...number[]]>>({} as [number]);

// Only rest element
expectType<ExcludeRestElement<string[]>>({} as []);
expectType<ExcludeRestElement<readonly number[]>>({} as readonly []);
expectType<ExcludeRestElement<readonly [...boolean[]]>>({} as readonly []);
expectType<ExcludeRestElement<[...string[]]>>({} as []);

// Optional & mixed optional
expectType<ExcludeRestElement<[string?, boolean?, ...number[]]>>({} as [string?, boolean?]);
expectType<ExcludeRestElement<[number, boolean?, ...number[]]>>({} as [number, boolean?]);
expectType<ExcludeRestElement<[1?, ...string[]]>>({} as [1?]);

// Unions
expectType<ExcludeRestElement<[1, ...string[]] | [2, ...number[]]>>({} as [1] | [2]);
expectType<ExcludeRestElement<[...boolean[], 'end'] | ['start', ...string[]]>>({} as ['end'] | ['start']);

// Readonly
expectType<ExcludeRestElement<readonly [...number[], 'done']>>({} as readonly ['done']);
expectType<ExcludeRestElement<readonly [1, ...string[], 2]>>({} as readonly [1, 2]);

// Nested Arrays
expectType<ExcludeRestElement<[[1, 2], ...number[], [3, 4]]>>({} as [[1, 2], [3, 4]]);
expectType<ExcludeRestElement<[['a'], ...string[], ['z']]>>({} as [['a'], ['z']]);

// Edge: `never` / `any`
expectType<ExcludeRestElement<any>>({} as any);
expectType<ExcludeRestElement<never>>({} as never);

// Long tuples
type FiftyZeroes = TupleOf<50, '0'>;
expectType<ExcludeRestElement<[...FiftyZeroes, ...number[]]>>({} as FiftyZeroes);

type NineHundredNinetyNineZeroes = TupleOf<999, '0'>;
expectType<ExcludeRestElement<[...NineHundredNinetyNineZeroes, ...number[]]>>({} as NineHundredNinetyNineZeroes);

// Generic instantiations
type Assignability<_T extends UnknownArray> = unknown;
type TestAssignability<T extends UnknownArray> = Assignability<ExcludeRestElement<T>>;
