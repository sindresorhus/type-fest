import {expectTypeOf} from 'nz';
import type {ExcludeRestElement, TupleOf, UnknownArray} from '../index.d.ts';

// Basic static tuples (No rest element)
expectTypeOf<[]>().toBe<ExcludeRestElement<[]>>();
expectTypeOf<[1]>().toBe<ExcludeRestElement<[1]>>();
expectTypeOf<[1, 2, 3]>().toBe<ExcludeRestElement<[1, 2, 3]>>();
expectTypeOf<readonly ['a', 'b']>().toBe<ExcludeRestElement<readonly ['a', 'b']>>();

// Leading rest element
expectTypeOf<[1]>().toBe<ExcludeRestElement<[...string[], 1]>>();
expectTypeOf<['a', 'b']>().toBe<ExcludeRestElement<[...number[], 'a', 'b']>>();
expectTypeOf<[true]>().toBe<ExcludeRestElement<[...any[], true]>>();
expectTypeOf<['end']>().toBe<ExcludeRestElement<[...never[], 'end']>>();
expectTypeOf<[2, 3]>().toBe<ExcludeRestElement<[...unknown[], 2, 3]>>();

// Middle rest element
expectTypeOf<['a', 'z']>().toBe<ExcludeRestElement<['a', ...string[], 'z']>>();
expectTypeOf<['x', true]>().toBe<ExcludeRestElement<['x', ...boolean[], true]>>();
expectTypeOf<['x', 'y']>().toBe<ExcludeRestElement<['x', ...any[], 'y']>>();
expectTypeOf<['x', 'y']>().toBe<ExcludeRestElement<['x', ...readonly number[], 'y']>>();

// Trailing rest element
expectTypeOf<[1, 2]>().toBe<ExcludeRestElement<[1, 2, ...string[]]>>();
expectTypeOf<['foo']>().toBe<ExcludeRestElement<['foo', ...Array<'bar'>]>>();
expectTypeOf<[number]>().toBe<ExcludeRestElement<[number, ...number[]]>>();

// Only rest element
expectTypeOf<[]>().toBe<ExcludeRestElement<string[]>>();
expectTypeOf<readonly []>().toBe<ExcludeRestElement<readonly number[]>>();
expectTypeOf<readonly []>().toBe<ExcludeRestElement<readonly [...boolean[]]>>();
expectTypeOf<[]>().toBe<ExcludeRestElement<[...string[]]>>();

// Optional & mixed optional
expectTypeOf<[string?, boolean?]>().toBe<ExcludeRestElement<[string?, boolean?, ...number[]]>>();
expectTypeOf<[number, boolean?]>().toBe<ExcludeRestElement<[number, boolean?, ...number[]]>>();
expectTypeOf<[1?]>().toBe<ExcludeRestElement<[1?, ...string[]]>>();

// Unions
expectTypeOf<[1] | [2]>().toBe<ExcludeRestElement<[1, ...string[]] | [2, ...number[]]>>();
expectTypeOf<['end'] | ['start']>().toBe<ExcludeRestElement<[...boolean[], 'end'] | ['start', ...string[]]>>();

// Readonly
expectTypeOf<readonly ['done']>().toBe<ExcludeRestElement<readonly [...number[], 'done']>>();
expectTypeOf<readonly [1, 2]>().toBe<ExcludeRestElement<readonly [1, ...string[], 2]>>();

// Nested Arrays
expectTypeOf<[[1, 2], [3, 4]]>().toBe<ExcludeRestElement<[[1, 2], ...number[], [3, 4]]>>();
expectTypeOf<[['a'], ['z']]>().toBe<ExcludeRestElement<[['a'], ...string[], ['z']]>>();

// Edge: `never` / `any`
expectTypeOf<any>().toBe<ExcludeRestElement<any>>();
expectTypeOf<never>().toBe<ExcludeRestElement<never>>();

// Long tuples
type FiftyZeroes = TupleOf<50, '0'>;
expectTypeOf<FiftyZeroes>().toBe<ExcludeRestElement<[...FiftyZeroes, ...number[]]>>();

type NineHundredNinetyNineZeroes = TupleOf<999, '0'>;
expectTypeOf<NineHundredNinetyNineZeroes>().toBe<ExcludeRestElement<[...NineHundredNinetyNineZeroes, ...number[]]>>();

// Generic instantiations
type Assignability<_T extends UnknownArray> = unknown;
type TestAssignability<T extends UnknownArray> = Assignability<ExcludeRestElement<T>>;

// `readonly` is decided per union member, so a readonly member stays readonly even when the union also has a mutable one.
declare const unionWithReadonly: ExcludeRestElement<[1, 2] | readonly []>;
expectTypeOf(unionWithReadonly).toBe<[1, 2] | readonly []>();

declare const unionOfReadonly: ExcludeRestElement<readonly [1, 2] | readonly [3]>;
expectTypeOf(unionOfReadonly).toBe<readonly [1, 2] | readonly [3]>();
