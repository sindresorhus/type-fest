import {expectType} from 'tsd';
import type {ExtractSpread} from '../index.d.ts';

// Simple Spread Detection
expectType<ExtractSpread<['start', ...string[]]>>({} as string);
expectType<ExtractSpread<['foo', ...number[], true]>>({} as number);
expectType<ExtractSpread<['foo', ...boolean[], 'bar']>>({} as boolean);
expectType<ExtractSpread<[...Array<'foo'>, unknown]>>({} as 'foo');
expectType<ExtractSpread<['bar', ...Array<5>]>>({} as 5);

// Leading Spread
expectType<ExtractSpread<[...string[], 1]>>({} as string);
expectType<ExtractSpread<[...number[], 'a', 'b']>>({} as number);
expectType<ExtractSpread<[...any[], true]>>({} as any);
expectType<ExtractSpread<[...[], 'last']>>({} as never);
expectType<ExtractSpread<[...never[], 'end']>>({} as never);
expectType<ExtractSpread<[...unknown[], 2, 3]>>({} as unknown);

// Middle Spread
expectType<ExtractSpread<['a', ...string[], 'z']>>({} as string);
expectType<ExtractSpread<['x', ...boolean[], true]>>({} as boolean);
expectType<ExtractSpread<['x', ...any[], 'y']>>({} as any);

// Trailing Spread
expectType<ExtractSpread<[1, 2, ...string[]]>>({} as string);
expectType<ExtractSpread<['foo', ...Array<'bar'>]>>({} as 'bar');
expectType<ExtractSpread<[number, ...number[]]>>({} as number);

// Spread Only
expectType<ExtractSpread<string[]>>({} as string);
expectType<ExtractSpread<readonly number[]>>({} as number);
expectType<ExtractSpread<readonly [...boolean[]]>>({} as boolean);
expectType<ExtractSpread<[...string[]]>>({} as string);

// Optional & Mixed Optional
expectType<ExtractSpread<[string?, boolean?, ...number[]]>>({} as number);
expectType<ExtractSpread<[1?, ...string[]]>>({} as string);

// No Spread
expectType<ExtractSpread<[1, 2, 3]>>({} as never);
expectType<ExtractSpread<readonly ['a', 'b']>>({} as never);
expectType<ExtractSpread<[]>>({} as never);

// Union
expectType<ExtractSpread<[1, ...string[]] | [2, ...number[]]>>({} as string | number);
expectType<ExtractSpread<[...boolean[], 'end'] | ['start', ...string[]]>>({} as boolean | string);

// Readonly
expectType<ExtractSpread<readonly [...number[], 'done']>>({} as number);
expectType<ExtractSpread<readonly [1, ...string[], 2]>>({} as string);

// Nested Arrays
expectType<ExtractSpread<[[1, 2], ...string[], [3, 4]]>>({} as string);
expectType<ExtractSpread<[['a'], ...boolean[], ['z']]>>({} as boolean);

// Edge: Never / Any
expectType<ExtractSpread<any>>({} as any);
expectType<ExtractSpread<never>>({} as never);
