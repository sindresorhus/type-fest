import {expectType} from 'tsd';
import type {ExcludeSpread} from '../index.d.ts';

// Basic Static Tuples (No Spread)
expectType<ExcludeSpread<[]>>({} as []);
expectType<ExcludeSpread<[1]>>({} as [1]);
expectType<ExcludeSpread<[1, 2, 3]>>({} as [1, 2, 3]);
expectType<ExcludeSpread<readonly ['a', 'b']>>({} as readonly ['a', 'b']);

// Leading Spread
expectType<ExcludeSpread<[...string[], 1]>>({} as [1]);
expectType<ExcludeSpread<[...number[], 'a', 'b']>>({} as ['a', 'b']);
expectType<ExcludeSpread<[...any[], true]>>({} as [true]);
expectType<ExcludeSpread<[...[], 'last']>>({} as ['last']);
expectType<ExcludeSpread<[...never[], 'end']>>({} as ['end']);
expectType<ExcludeSpread<[...unknown[], 2, 3]>>({} as [2, 3]);

// Middle Spread
expectType<ExcludeSpread<['a', ...string[], 'z']>>({} as ['a', 'z']);
expectType<ExcludeSpread<['x', ...boolean[], true]>>({} as ['x', true]);
expectType<ExcludeSpread<['x', ...any[], 'y']>>({} as ['x', 'y']);
expectType<ExcludeSpread<['x', ...readonly number[], 'y']>>({} as ['x', 'y']);

// Trailing Spread
expectType<ExcludeSpread<[1, 2, ...string[]]>>({} as [1, 2]);
expectType<ExcludeSpread<['foo', ...Array<'bar'>]>>({} as ['foo']);
expectType<ExcludeSpread<[number, ...number[]]>>({} as [number]);

// Only Spread
expectType<ExcludeSpread<string[]>>({} as []);
expectType<ExcludeSpread<readonly number[]>>({} as readonly []);
expectType<ExcludeSpread<readonly [...boolean[]]>>({} as readonly []);
expectType<ExcludeSpread<[...string[]]>>({} as []);

// Optional & Mixed Optional
expectType<ExcludeSpread<[string?, boolean?, ...number[]]>>({} as [string?, boolean?]);
expectType<ExcludeSpread<[1?, ...string[]]>>({} as [1?]);

// Unions
expectType<ExcludeSpread<[1, ...string[]] | [2, ...number[]]>>({} as [1] | [2]);
expectType<ExcludeSpread<[...boolean[], 'end'] | ['start', ...string[]]>>({} as ['end'] | ['start']);

// Readonly and Nested
expectType<ExcludeSpread<readonly [...number[], 'done']>>({} as readonly ['done']);
expectType<ExcludeSpread<readonly [1, ...string[], 2]>>({} as readonly [1, 2]);

// Arrays with Arrays Inside
expectType<ExcludeSpread<[[1, 2], ...number[], [3, 4]]>>({} as [[1, 2], [3, 4]]);
expectType<ExcludeSpread<[['a'], ...string[], ['z']]>>({} as [['a'], ['z']]);

// Edge: Never / Any
expectType<ExcludeSpread<any>>({} as any);
expectType<ExcludeSpread<never>>({} as never);
