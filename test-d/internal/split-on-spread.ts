import {expectType} from 'tsd';
import type {ExcludeSpread, ExtractSpread, SplitOnSpread} from '../../source/slpit-on-spread.d.ts';

// Fixed Tuples
expectType<SplitOnSpread<[]>>({} as [[], [], []]);
expectType<SplitOnSpread<[1]>>({} as [[1], [], []]);
expectType<SplitOnSpread<[1, 2, 3]>>({} as [[1, 2, 3], [], []]);
expectType<SplitOnSpread<readonly ['a', 'b', 'c']>>({} as [readonly ['a', 'b', 'c'], [], []]);

// Finite Spread
expectType<SplitOnSpread<[...[number, number], string]>>({} as [[number, number, string], [], []]);
expectType<SplitOnSpread<[...number[], string[]]>>({} as [[], number[], [string[]]]);
expectType<SplitOnSpread<[...[string?, number?]]>>({} as [[string?, number?], [], []]);
expectType<SplitOnSpread<[...[never], 1]>>({} as [[never, 1], [], []]);
expectType<SplitOnSpread<[...[], 1]>>({} as [[1], [], []]);

// Infinite Spread
expectType<SplitOnSpread<[1, ...number[]]>>({} as [[1], number[], []]);
expectType<SplitOnSpread<['start', ...string[]]>>({} as [['start'], string[], []]);
expectType<SplitOnSpread<[1, ...number[], 2]>>({} as [[1], number[], [2]]);
expectType<SplitOnSpread<['start', ...string[], 'end']>>({} as [['start'], string[], ['end']]);
expectType<SplitOnSpread<string[]>>({} as [[], string[], []]);
expectType<SplitOnSpread<number[]>>({} as [[], number[], []]);
expectType<SplitOnSpread<any[]>>({} as [[], any[], []]);
expectType<SplitOnSpread<unknown[]>>({} as [[], unknown[], []]);
expectType<SplitOnSpread<readonly any[]>>({} as [[], any[], []]);
expectType<SplitOnSpread<readonly [...number[], 2]>>({} as [[], number[], [2]]);
expectType<SplitOnSpread<[...string[], 'end']>>({} as [[], string[], ['end']]);
expectType<SplitOnSpread<[...string[]]>>({} as [[], string[], []]);
expectType<SplitOnSpread<[...never[], 1]>>({} as [[], never[], [1]]);
expectType<SplitOnSpread<[...Array<[number, number | string]>, unknown]>>({} as [[], Array<[number, number | string]>, [unknown]]);

// Edge cases
expectType<SplitOnSpread<readonly []>>({} as [readonly [], [], []]);
expectType<SplitOnSpread<readonly [number]>>({} as [readonly [number], [], []]);
expectType<SplitOnSpread<[...[], 1]>>({} as [[1], [], []]);

// Readonly
expectType<SplitOnSpread<readonly [1, 2, 3]>>({} as [readonly [1, 2, 3], [], []]);
expectType<SplitOnSpread<readonly [...number[], 2]>>({} as [[], number[], [2]]);

// ExtractSpread
expectType<ExtractSpread<['start', ...string[]]>>({} as string);
expectType<ExtractSpread<['foo', ...number[], true]>>({} as number);
expectType<ExtractSpread<['foo', ...boolean[], 'bar']>>({} as boolean);
expectType<ExtractSpread<[...Array<'foo'>, unknown]>>({} as 'foo');
expectType<ExtractSpread<['bar', ...Array<5>]>>({} as 5);

// ExcludeSpread
expectType<ExcludeSpread<['start', ...string[]]>>({} as ['start']);
expectType<ExcludeSpread<['foo', ...number[], true]>>({} as ['foo', true]);
expectType<ExcludeSpread<['foo', ...boolean[], 'bar']>>({} as ['foo', 'bar']);
expectType<ExcludeSpread<[...Array<'foo'>, unknown]>>({} as [unknown]);
expectType<ExcludeSpread<['bar', ...Array<5>]>>({} as ['bar']);
