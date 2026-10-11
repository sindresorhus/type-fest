import {expectTypeOf} from 'nz';
import type {ExtractRestElement, TupleOf} from '../index.d.ts';

// Leading rest element
expectTypeOf<string>().toBe<ExtractRestElement<[...string[], 1]>>();
expectTypeOf<number>().toBe<ExtractRestElement<[...number[], 'a', 'b']>>();
expectTypeOf<any>().toBe<ExtractRestElement<[...any[], true]>>();
expectTypeOf<never>().toBe<ExtractRestElement<[...never[], 'end']>>();
expectTypeOf<unknown>().toBe<ExtractRestElement<[...unknown[], 2, 3]>>();

// Middle rest element
expectTypeOf<string>().toBe<ExtractRestElement<['a', ...string[], 'z']>>();
expectTypeOf<boolean>().toBe<ExtractRestElement<['x', ...boolean[], true]>>();
expectTypeOf<any>().toBe<ExtractRestElement<['x', ...any[], 'y']>>();

// Trailing rest element
expectTypeOf<string>().toBe<ExtractRestElement<[1, 2, ...string[]]>>();
expectTypeOf<'bar'>().toBe<ExtractRestElement<['foo', ...Array<'bar'>]>>();
expectTypeOf<number>().toBe<ExtractRestElement<[number, ...number[]]>>();

// Rest element only
expectTypeOf<string>().toBe<ExtractRestElement<string[]>>();
expectTypeOf<number>().toBe<ExtractRestElement<readonly number[]>>();
expectTypeOf<boolean>().toBe<ExtractRestElement<readonly [...boolean[]]>>();
expectTypeOf<string>().toBe<ExtractRestElement<[...string[]]>>();

// Optional
expectTypeOf<number>().toBe<ExtractRestElement<[string?, boolean?, ...number[]]>>();
expectTypeOf<number>().toBe<ExtractRestElement<[number, boolean?, ...number[]]>>();
expectTypeOf<string>().toBe<ExtractRestElement<[1?, ...string[]]>>();

// No rest element
expectTypeOf<never>().toBe<ExtractRestElement<[1, 2, 3]>>();
expectTypeOf<never>().toBe<ExtractRestElement<readonly ['a', 'b']>>();
expectTypeOf<never>().toBe<ExtractRestElement<[]>>();

// Union
expectTypeOf<string | number>().toBe<ExtractRestElement<[1, ...string[]] | [2, ...number[]]>>();
expectTypeOf<boolean | string>().toBe<ExtractRestElement<[...boolean[], 'end'] | ['start', ...string[]]>>();

// Readonly
expectTypeOf<number>().toBe<ExtractRestElement<readonly [...number[], 'done']>>();
expectTypeOf<string>().toBe<ExtractRestElement<readonly [1, ...string[], 2]>>();

// Nested arrays
expectTypeOf<string>().toBe<ExtractRestElement<[[1, 2], ...string[], [3, 4]]>>();
expectTypeOf<boolean>().toBe<ExtractRestElement<[['a'], ...boolean[], ['z']]>>();

// Edge: `never` / `any`
expectTypeOf<any>().toBe<ExtractRestElement<any>>();
expectTypeOf<never>().toBe<ExtractRestElement<never>>();

// Long tuples
type FiftyZeroes = TupleOf<50, '0'>;
expectTypeOf<number>().toBe<ExtractRestElement<[...FiftyZeroes, ...number[]]>>();

type NineHundredNinetyNineZeroes = TupleOf<999, '0'>;
expectTypeOf<number>().toBe<ExtractRestElement<[...NineHundredNinetyNineZeroes, ...number[]]>>();
