import {expectTypeOf} from 'nz';
import type {ArrayUnique, TupleOf} from '../index.d.ts';

expectTypeOf<ArrayUnique<['id', 'name', 'id']>>().toBe<['id', 'name']>();
expectTypeOf<ArrayUnique<[1, 2, 1, 3, 2]>>().toBe<[1, 2, 3]>();
expectTypeOf<ArrayUnique<[]>>().toBe<[]>();
expectTypeOf<ArrayUnique<readonly []>>().toBe<readonly []>();
expectTypeOf<ArrayUnique<readonly [1, 1, 2]>>().toBe<readonly [1, 2]>();
expectTypeOf<ArrayUnique<[true, false, true, null, null, undefined, undefined]>>().toBe<[true, false, null, undefined]>();
expectTypeOf<ArrayUnique<[1n, 2n, 1n]>>().toBe<[1n, 2n]>();

declare const first: unique symbol;
declare const second: unique symbol;
expectTypeOf<ArrayUnique<[typeof first, typeof second, typeof first]>>().toBe<[typeof first, typeof second]>();

// Deduplication compares exact types, not assignability or runtime object identity.
expectTypeOf<ArrayUnique<[string, 'a', string]>>().toBe<[string, 'a']>();
expectTypeOf<ArrayUnique<[1 | 2, 1, 1 | 2]>>().toBe<[1 | 2, 1]>();
expectTypeOf<ArrayUnique<[{value: 1}, {value: 1}, {value: 2}]>>().toBe<[{value: 1}, {value: 2}]>();
expectTypeOf<ArrayUnique<[[1], readonly [1], [1], readonly [1]]>>().toBe<[[1], readonly [1]]>();
expectTypeOf<ArrayUnique<[any, never, unknown, any, never, unknown]>>().toBe<[any, never, unknown]>();
expectTypeOf<ArrayUnique<string[]>>().toBe<string[]>();
expectTypeOf<ArrayUnique<readonly string[]>>().toBe<readonly string[]>();
expectTypeOf<ArrayUnique<[1, ...number[]]>>().toBe<number[]>();
expectTypeOf<ArrayUnique<[1, 1?]>>().toBe<never>();
expectTypeOf<ArrayUnique<[1, 1] | readonly [2, 2]>>().toBe<[1] | readonly [2]>();
expectTypeOf<ArrayUnique<any>>().toBe<any>();
expectTypeOf<ArrayUnique<never>>().toBe<never>();
expectTypeOf<[1, 1]>().not.toBeAssignableTo<ArrayUnique<[1, 1]>>();

// @ts-expect-error The input must be an array.
type UnknownArray = ArrayUnique<unknown>;

// Order of first occurrences.
expectTypeOf<ArrayUnique<[1, 1, 1]>>().toBe<[1]>();
expectTypeOf<ArrayUnique<['a', 'b', 'c']>>().toBe<['a', 'b', 'c']>();
expectTypeOf<ArrayUnique<['b', 'a', 'b', 'a']>>().toBe<['b', 'a']>();
expectTypeOf<ArrayUnique<[3, 2, 1, 1, 2, 3]>>().toBe<[3, 2, 1]>();
expectTypeOf<ArrayUnique<[1]>>().toBe<[1]>();
expectTypeOf<ArrayUnique<[a: 'id', b: 'id']>>().toBe<['id']>();

// Exact comparison.
expectTypeOf<ArrayUnique<[string, string]>>().toBe<[string]>();
expectTypeOf<ArrayUnique<['a', string, 'a']>>().toBe<['a', string]>();
expectTypeOf<ArrayUnique<[1, number, 1, number]>>().toBe<[1, number]>();
expectTypeOf<ArrayUnique<[true, boolean, false, boolean]>>().toBe<[true, boolean, false]>();
expectTypeOf<ArrayUnique<[1 | 2, 2 | 1]>>().toBe<[1 | 2]>();
expectTypeOf<ArrayUnique<[1, '1']>>().toBe<[1, '1']>();
expectTypeOf<ArrayUnique<[0, -0]>>().toBe<[0]>();
expectTypeOf<ArrayUnique<[{value: 1}, {value?: 1}]>>().toBe<[{value: 1}, {value?: 1}]>();
expectTypeOf<ArrayUnique<[{value: 1}, {readonly value: 1}]>>().toBe<[{value: 1}, {readonly value: 1}]>();
expectTypeOf<ArrayUnique<[() => void, () => void, (value: string) => void]>>().toBe<[() => void, (value: string) => void]>();
expectTypeOf<ArrayUnique<[unknown, any]>>().toBe<[unknown, any]>();
expectTypeOf<ArrayUnique<[undefined, void, undefined]>>().toBe<[undefined, void]>();
expectTypeOf<ArrayUnique<[string[], readonly string[], string[]]>>().toBe<[string[], readonly string[]]>();

const fields = ['id', 'name', 'id', 'email', 'name'] as const;
expectTypeOf<ArrayUnique<typeof fields>>().toBe<readonly ['id', 'name', 'email']>();

// Arrays of unknown length.
expectTypeOf<ArrayUnique<never[]>>().toBe<never[]>();
expectTypeOf<ArrayUnique<Array<1 | 2>>>().toBe<Array<1 | 2>>();
expectTypeOf<ArrayUnique<[...string[], 1]>>().toBe<Array<string | 1>>();
expectTypeOf<ArrayUnique<[1, ...string[], 1]>>().toBe<Array<1 | string>>();
expectTypeOf<ArrayUnique<readonly [1, ...string[]]>>().toBe<ReadonlyArray<1 | string>>();

// Optional elements, including in otherwise valid unions.
expectTypeOf<ArrayUnique<[1?]>>().toBe<never>();
expectTypeOf<ArrayUnique<[1, 2?, ...number[]]>>().toBe<never>();
expectTypeOf<ArrayUnique<[1, 1] | [2?]>>().toBe<[1]>();
expectTypeOf<ArrayUnique<[1, 1] | string[]>>().toBe<[1] | string[]>();

// Long tuples.
expectTypeOf<ArrayUnique<TupleOf<500, 'a'>>>().toBe<['a']>();
expectTypeOf<ArrayUnique<[...TupleOf<100, 'a'>, 'b', ...TupleOf<100, 'a'>, 'c']>>().toBe<['a', 'b', 'c']>();

// Batches skip only exact adjacent duplicates, preserving distinct types within them.
expectTypeOf<ArrayUnique<[0, 0, 0, any, 0, 0]>>().toBe<[0, any]>();
expectTypeOf<ArrayUnique<[never, never, unknown, never, never, never]>>().toBe<[never, unknown]>();
expectTypeOf<ArrayUnique<[1 | 2, 1 | 2, 1, 1 | 2, 1 | 2, 1 | 2]>>().toBe<[1 | 2, 1]>();
expectTypeOf<ArrayUnique<[...TupleOf<5, any>, ...TupleOf<5, never>, ...TupleOf<5, unknown>]>>().toBe<[any, never, unknown]>();
expectTypeOf<ArrayUnique<readonly [1, 1, 1, 1, 1, 2]>>().toBe<readonly [1, 2]>();

function _readUniqueValue<Value>(values: ArrayUnique<readonly [...TupleOf<5, {value: Value}>, 'last']>): Value {
	return values[0].value;
}

// Assignability.
expectTypeOf<['id', 'name']>().toBeAssignableTo<ArrayUnique<readonly ['id', 'name', 'id']>>();
expectTypeOf<ArrayUnique<readonly ['id', 'name', 'id']>>().not.toBeAssignableTo<['id', 'name']>();
expectTypeOf<['name', 'id']>().not.toBeAssignableTo<ArrayUnique<['id', 'name', 'id']>>();
