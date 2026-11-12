import {expectTypeOf} from 'nz';
import type {ArrayZip, TupleOf} from '../index.d.ts';

expectTypeOf<ArrayZip<['name', 'age'], [string, number]>>().toBe<[['name', string], ['age', number]]>();
expectTypeOf<ArrayZip<[1, 2, 3], ['a', 'b']>>().toBe<[[1, 'a'], [2, 'b']]>();
expectTypeOf<ArrayZip<[1], ['a', 'b']>>().toBe<[[1, 'a']]>();
expectTypeOf<ArrayZip<[], [1]>>().toBe<[]>();
expectTypeOf<ArrayZip<[1], []>>().toBe<[]>();
expectTypeOf<ArrayZip<[], string[]>>().toBe<[]>();
expectTypeOf<ArrayZip<number[], []>>().toBe<[]>();
expectTypeOf<ArrayZip<number[], string[]>>().toBe<Array<[number, string]>>();
expectTypeOf<ArrayZip<[1, ...number[]], string[]>>().toBe<Array<[number, string]>>();
expectTypeOf<ArrayZip<[1], string[]>>().toBe<Array<[1, string]>>();
expectTypeOf<ArrayZip<readonly [1, 2], ['a', 'b']>>().toBe<readonly [readonly [1, 'a'], readonly [2, 'b']]>();
expectTypeOf<ArrayZip<[1], readonly ['a']>>().toBe<readonly [readonly [1, 'a']]>();
expectTypeOf<ArrayZip<readonly number[], string[]>>().toBe<ReadonlyArray<readonly [number, string]>>();
expectTypeOf<ArrayZip<readonly [{value: number}], [1]>>().toBe<readonly [readonly [{value: number}, 1]]>();
expectTypeOf<ArrayZip<[1] | [2], ['a'] | ['b']>>().toBe<[[1, 'a']] | [[1, 'b']] | [[2, 'a']] | [[2, 'b']]>();
expectTypeOf<ArrayZip<[1] | readonly [2], ['a']>>().toBe<[[1, 'a']] | readonly [readonly [2, 'a']]>();
expectTypeOf<ArrayZip<[1?], [2]>>().toBe<never>();
expectTypeOf<ArrayZip<[1], [2?]>>().toBe<never>();
expectTypeOf<ArrayZip<[any, never, unknown], [1, 2, 3]>>().toBe<[[any, 1], [never, 2], [unknown, 3]]>();
expectTypeOf<ArrayZip<any, [1]>>().toBe<any>();
expectTypeOf<ArrayZip<[1], any>>().toBe<any>();
expectTypeOf<ArrayZip<never, [1]>>().toBe<never>();
expectTypeOf<ArrayZip<[1], never>>().toBe<never>();
expectTypeOf<ArrayZip<any, never>>().toBe<any>();
expectTypeOf<[[1, 'b']]>().not.toBeAssignableTo<ArrayZip<[1], ['a']>>();

// @ts-expect-error The first input must be an array.
type UnknownFirst = ArrayZip<unknown, [1]>;
// @ts-expect-error The second input must be an array.
type UnknownSecond = ArrayZip<[1], unknown>;

// Fixed tuples.
expectTypeOf<ArrayZip<[], []>>().toBe<[]>();
expectTypeOf<ArrayZip<readonly [], readonly []>>().toBe<readonly []>();
expectTypeOf<ArrayZip<[1, 2, 3], ['a', 'b', 'c']>>().toBe<[[1, 'a'], [2, 'b'], [3, 'c']]>();
expectTypeOf<ArrayZip<[1, 2], ['a', 'b', 'c', 'd']>>().toBe<[[1, 'a'], [2, 'b']]>();
expectTypeOf<ArrayZip<[name: 'id', age: 'age'], [string, number]>>().toBe<[['id', string], ['age', number]]>();
expectTypeOf<ArrayZip<[1 | 2, 3], ['a', 'b' | 'c']>>().toBe<[[1 | 2, 'a'], [3, 'b' | 'c']]>();
expectTypeOf<ArrayZip<[[1], [2]], [['a'], ['b']]>>().toBe<[[[1], ['a']], [[2], ['b']]]>();
expectTypeOf<ArrayZip<[undefined, null], [void, undefined]>>().toBe<[[undefined, void], [null, undefined]]>();

// Readonly inputs.
expectTypeOf<ArrayZip<readonly [1], readonly ['a']>>().toBe<readonly [readonly [1, 'a']]>();
expectTypeOf<ArrayZip<readonly [], [1]>>().toBe<readonly []>();
expectTypeOf<ArrayZip<[1], readonly []>>().toBe<readonly []>();
expectTypeOf<ArrayZip<readonly [[1]], [[2]]>>().toBe<readonly [readonly [[1], [2]]]>();
expectTypeOf<ArrayZip<readonly number[], readonly string[]>>().toBe<ReadonlyArray<readonly [number, string]>>();

const names = ['id', 'title'] as const;
const kinds = ['number', 'string'] as const;
expectTypeOf<ArrayZip<typeof names, typeof kinds>>().toBe<readonly [readonly ['id', 'number'], readonly ['title', 'string']]>();

// Arrays of unknown length.
expectTypeOf<ArrayZip<string[], [1, 2]>>().toBe<Array<[string, 1 | 2]>>();
expectTypeOf<ArrayZip<never[], string[]>>().toBe<Array<[never, string]>>();
expectTypeOf<ArrayZip<any[], [1]>>().toBe<Array<[any, 1]>>();
expectTypeOf<ArrayZip<[...string[], 1], [2]>>().toBe<Array<[string | 1, 2]>>();
expectTypeOf<ArrayZip<[1, ...string[], 2], [3, 4]>>().toBe<Array<[1 | string | 2, 3 | 4]>>();
expectTypeOf<ArrayZip<[1, 2, ...string[]], ['a', 'b', 'c']>>().toBe<Array<[1 | 2 | string, 'a' | 'b' | 'c']>>();
expectTypeOf<ArrayZip<[1, ...string[]], readonly number[]>>().toBe<ReadonlyArray<readonly [1 | string, number]>>();

// Optional elements, including in otherwise valid unions.
expectTypeOf<ArrayZip<[1, 2?], [3, 4]>>().toBe<never>();
expectTypeOf<ArrayZip<[1?, ...number[]], number[]>>().toBe<never>();
expectTypeOf<ArrayZip<[1] | [2?], ['a']>>().toBe<[[1, 'a']]>();

// Every combination of the unions, with the readonly modifier decided per combination.
expectTypeOf<ArrayZip<[1] | readonly [2], ['a'] | readonly ['b']>>().toBe<
	| [[1, 'a']]
	| readonly [readonly [1, 'b']]
	| readonly [readonly [2, 'a']]
	| readonly [readonly [2, 'b']]
>();
expectTypeOf<ArrayZip<[1] | number[], ['a']>>().toBe<[[1, 'a']] | Array<[number, 'a']>>();

// Long tuples.
expectTypeOf<ArrayZip<TupleOf<200, 1>, TupleOf<200, 'a'>>['length']>().toBe<200>();
expectTypeOf<ArrayZip<TupleOf<200, 1>, TupleOf<150, 'a'>>['length']>().toBe<150>();
expectTypeOf<ArrayZip<TupleOf<200, 1>, TupleOf<200, 'a'>>[199]>().toBe<[1, 'a']>();

// Assignability.
expectTypeOf<[[1, 'a']]>().toBeAssignableTo<ArrayZip<readonly [1], ['a']>>();
expectTypeOf<ArrayZip<readonly [1], ['a']>>().not.toBeAssignableTo<[[1, 'a']]>();
expectTypeOf<[[1, 'a'], [2, 'b']]>().not.toBeAssignableTo<ArrayZip<[1], ['a']>>();
expectTypeOf<Array<[number, string]>>().toBeAssignableTo<ArrayZip<number[], string[]>>();

declare const fields: ArrayZip<['name', 'age'], [string, number]>;
expectTypeOf(fields[1][0]).toBe<'age'>();
expectTypeOf(fields[1][1]).toBe<number>();
// @ts-expect-error There are only two pairs.
const _missing: unknown = fields[2];
