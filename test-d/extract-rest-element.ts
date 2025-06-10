import {expectType} from 'tsd';
import type {ExtractRestElement} from '../index.d.ts';

// Simple Rest element detection
expectType<ExtractRestElement<['start', ...string[]]>>({} as string);
expectType<ExtractRestElement<['foo', ...number[], true]>>({} as number);
expectType<ExtractRestElement<['foo', ...boolean[], 'bar']>>({} as boolean);
expectType<ExtractRestElement<[...Array<'foo'>, unknown]>>({} as 'foo');
expectType<ExtractRestElement<['bar', ...Array<5>]>>({} as 5);

// Leading Rest element
expectType<ExtractRestElement<[...string[], 1]>>({} as string);
expectType<ExtractRestElement<[...number[], 'a', 'b']>>({} as number);
expectType<ExtractRestElement<[...any[], true]>>({} as any);
expectType<ExtractRestElement<[...[], 'last']>>({} as never);
expectType<ExtractRestElement<[...never[], 'end']>>({} as never);
expectType<ExtractRestElement<[...unknown[], 2, 3]>>({} as unknown);

// Middle Rest element
expectType<ExtractRestElement<['a', ...string[], 'z']>>({} as string);
expectType<ExtractRestElement<['x', ...boolean[], true]>>({} as boolean);
expectType<ExtractRestElement<['x', ...any[], 'y']>>({} as any);

// Trailing Rest element
expectType<ExtractRestElement<[1, 2, ...string[]]>>({} as string);
expectType<ExtractRestElement<['foo', ...Array<'bar'>]>>({} as 'bar');
expectType<ExtractRestElement<[number, ...number[]]>>({} as number);

// Rest element Only
expectType<ExtractRestElement<string[]>>({} as string);
expectType<ExtractRestElement<readonly number[]>>({} as number);
expectType<ExtractRestElement<readonly [...boolean[]]>>({} as boolean);
expectType<ExtractRestElement<[...string[]]>>({} as string);

// Optional & Mixed Optional
expectType<ExtractRestElement<[string?, boolean?, ...number[]]>>({} as number);
expectType<ExtractRestElement<[1?, ...string[]]>>({} as string);

// No Rest element
expectType<ExtractRestElement<[1, 2, 3]>>({} as never);
expectType<ExtractRestElement<readonly ['a', 'b']>>({} as never);
expectType<ExtractRestElement<[]>>({} as never);

// Union
expectType<ExtractRestElement<[1, ...string[]] | [2, ...number[]]>>({} as string | number);
expectType<ExtractRestElement<[...boolean[], 'end'] | ['start', ...string[]]>>({} as boolean | string);

// Readonly
expectType<ExtractRestElement<readonly [...number[], 'done']>>({} as number);
expectType<ExtractRestElement<readonly [1, ...string[], 2]>>({} as string);

// Nested Arrays
expectType<ExtractRestElement<[[1, 2], ...string[], [3, 4]]>>({} as string);
expectType<ExtractRestElement<[['a'], ...boolean[], ['z']]>>({} as boolean);

// Edge: Never / Any
expectType<ExtractRestElement<any>>({} as any);
expectType<ExtractRestElement<never>>({} as never);
