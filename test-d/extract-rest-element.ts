import {expectType} from 'tsd';
import type {ExtractRestElement, TupleOf} from '../index.d.ts';

// Leading rest element
expectType<ExtractRestElement<[...string[], 1]>>({} as string);
expectType<ExtractRestElement<[...number[], 'a', 'b']>>({} as number);
expectType<ExtractRestElement<[...any[], true]>>({} as any);
expectType<ExtractRestElement<[...never[], 'end']>>({} as never);
expectType<ExtractRestElement<[...unknown[], 2, 3]>>({} as unknown);

// Middle rest element
expectType<ExtractRestElement<['a', ...string[], 'z']>>({} as string);
expectType<ExtractRestElement<['x', ...boolean[], true]>>({} as boolean);
expectType<ExtractRestElement<['x', ...any[], 'y']>>({} as any);

// Trailing rest element
expectType<ExtractRestElement<[1, 2, ...string[]]>>({} as string);
expectType<ExtractRestElement<['foo', ...Array<'bar'>]>>({} as 'bar');
expectType<ExtractRestElement<[number, ...number[]]>>({} as number);

// Rest element only
expectType<ExtractRestElement<string[]>>({} as string);
expectType<ExtractRestElement<readonly number[]>>({} as number);
expectType<ExtractRestElement<readonly [...boolean[]]>>({} as boolean);
expectType<ExtractRestElement<[...string[]]>>({} as string);

// Optional
expectType<ExtractRestElement<[string?, boolean?, ...number[]]>>({} as number);
expectType<ExtractRestElement<[number, boolean?, ...number[]]>>({} as number);
expectType<ExtractRestElement<[1?, ...string[]]>>({} as string);

// No rest element
expectType<ExtractRestElement<[1, 2, 3]>>({} as never);
expectType<ExtractRestElement<readonly ['a', 'b']>>({} as never);
expectType<ExtractRestElement<[]>>({} as never);

// Union
expectType<ExtractRestElement<[1, ...string[]] | [2, ...number[]]>>({} as string | number);
expectType<ExtractRestElement<[...boolean[], 'end'] | ['start', ...string[]]>>({} as boolean | string);

// Readonly
expectType<ExtractRestElement<readonly [...number[], 'done']>>({} as number);
expectType<ExtractRestElement<readonly [1, ...string[], 2]>>({} as string);

// Nested arrays
expectType<ExtractRestElement<[[1, 2], ...string[], [3, 4]]>>({} as string);
expectType<ExtractRestElement<[['a'], ...boolean[], ['z']]>>({} as boolean);

// Edge: `never` / `any`
expectType<ExtractRestElement<any>>({} as any);
expectType<ExtractRestElement<never>>({} as never);

// Long tuples
type FiftyZeroes = TupleOf<50, '0'>;
expectType<ExtractRestElement<[...FiftyZeroes, ...number[]]>>({} as number);

type NineHundredNinetyNineZeroes = TupleOf<999, '0'>;
expectType<ExtractRestElement<[...NineHundredNinetyNineZeroes, ...number[]]>>({} as number);
