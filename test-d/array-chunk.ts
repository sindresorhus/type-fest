import {expectTypeOf} from 'nz';
import type {ArrayChunk, Tagged, TupleOf} from '../index.d.ts';

expectTypeOf<ArrayChunk<[1, 2, 3, 4, 5], 2>>().toBe<[[1, 2], [3, 4], [5]]>();
expectTypeOf<ArrayChunk<[1, 2], 1>>().toBe<[[1], [2]]>();
expectTypeOf<ArrayChunk<[1, 2], 2>>().toBe<[[1, 2]]>();
expectTypeOf<ArrayChunk<[1, 2], 3>>().toBe<[[1, 2]]>();
expectTypeOf<ArrayChunk<[1, 2, 3, 4], Tagged<2, 'ChunkSize'>>>().toBe<[[1, 2], [3, 4]]>();
expectTypeOf<ArrayChunk<[], 2>>().toBe<[]>();
expectTypeOf<ArrayChunk<readonly [1, 2, 3], 2>>().toBe<readonly [readonly [1, 2], readonly [3]]>();
expectTypeOf<ArrayChunk<readonly [], 2>>().toBe<readonly []>();
expectTypeOf<ArrayChunk<readonly [{value: number}], 2>>().toBe<readonly [readonly [{value: number}]]>();
expectTypeOf<ArrayChunk<string[], 2>>().toBe<string[][]>();
expectTypeOf<ArrayChunk<readonly string[], 2>>().toBe<ReadonlyArray<readonly string[]>>();
expectTypeOf<ArrayChunk<[1, ...number[]], 2>>().toBe<number[][]>();
expectTypeOf<ArrayChunk<[1, 2?], 2>>().toBe<never>();
expectTypeOf<ArrayChunk<[1, 2], 0>>().toBe<never>();
expectTypeOf<ArrayChunk<[1, 2], -1>>().toBe<never>();
expectTypeOf<ArrayChunk<[1, 2], 1.5>>().toBe<never>();
expectTypeOf<ArrayChunk<[1, 2], number>>().toBe<never>();
expectTypeOf<ArrayChunk<[1] | [2, 3], 2>>().toBe<[[1]] | [[2, 3]]>();
expectTypeOf<ArrayChunk<[1, 2], 1 | 2>>().toBe<[[1], [2]] | [[1, 2]]>();
expectTypeOf<ArrayChunk<[1, 2, 3], 0 | 2>>().toBe<[[1, 2], [3]]>();
expectTypeOf<ArrayChunk<[any, never, unknown], 2>>().toBe<[[any, never], [unknown]]>();
expectTypeOf<ArrayChunk<any, 2>>().toBe<any>();
expectTypeOf<ArrayChunk<[1], any>>().toBe<any>();
expectTypeOf<ArrayChunk<never, 2>>().toBe<never>();
expectTypeOf<ArrayChunk<[1], never>>().toBe<never>();
expectTypeOf<ArrayChunk<never, any>>().toBe<any>();
expectTypeOf<[[1], [2, 3]]>().not.toBeAssignableTo<ArrayChunk<[1, 2, 3], 2>>();

// @ts-expect-error The input must be an array.
type UnknownArray = ArrayChunk<unknown, 2>;
// @ts-expect-error The size must be a number.
type UnknownSize = ArrayChunk<[1], unknown>;

// Even and uneven splits.
expectTypeOf<ArrayChunk<[1, 2, 3, 4, 5, 6], 3>>().toBe<[[1, 2, 3], [4, 5, 6]]>();
expectTypeOf<ArrayChunk<[1, 2, 3, 4, 5, 6, 7], 3>>().toBe<[[1, 2, 3], [4, 5, 6], [7]]>();
expectTypeOf<ArrayChunk<[1], 1>>().toBe<[[1]]>();
expectTypeOf<ArrayChunk<[1], 100>>().toBe<[[1]]>();
expectTypeOf<ArrayChunk<[], 1>>().toBe<[]>();

// Element types are kept as they are.
expectTypeOf<ArrayChunk<[1 | 2, string, {value: 3}], 2>>().toBe<[[1 | 2, string], [{value: 3}]]>();
expectTypeOf<ArrayChunk<[[1, 2], [3]], 1>>().toBe<[[[1, 2]], [[3]]]>();
expectTypeOf<ArrayChunk<[a: 1, b: 2, c: 3], 2>>().toBe<[[1, 2], [3]]>();
expectTypeOf<ArrayChunk<[undefined, null, void], 2>>().toBe<[[undefined, null], [void]]>();

// Readonly inputs make the chunks readonly, but not the elements in them.
expectTypeOf<ArrayChunk<readonly [[1], [2]], 1>>().toBe<readonly [readonly [[1]], readonly [[2]]]>();
expectTypeOf<ArrayChunk<readonly [1, 2, 3, 4], Tagged<2, 'ChunkSize'>>>().toBe<readonly [readonly [1, 2], readonly [3, 4]]>();

const values = [1, 2, 3] as const;
expectTypeOf<ArrayChunk<typeof values, 2>>().toBe<readonly [readonly [1, 2], readonly [3]]>();

// Arrays of unknown length.
expectTypeOf<ArrayChunk<never[], 2>>().toBe<never[][]>();
expectTypeOf<ArrayChunk<Array<string | number>, 3>>().toBe<Array<Array<string | number>>>();
expectTypeOf<ArrayChunk<[...string[], 1], 2>>().toBe<Array<Array<string | 1>>>();
expectTypeOf<ArrayChunk<[1, ...string[], 2], 2>>().toBe<Array<Array<1 | string | 2>>>();
expectTypeOf<ArrayChunk<readonly [1, ...string[]], 2>>().toBe<ReadonlyArray<ReadonlyArray<1 | string>>>();

// Invalid sizes.
expectTypeOf<ArrayChunk<[1, 2], -2>>().toBe<never>();
expectTypeOf<ArrayChunk<[1, 2], 0.5>>().toBe<never>();
expectTypeOf<ArrayChunk<[1, 2], -0.5>>().toBe<never>();
expectTypeOf<ArrayChunk<[], 0>>().toBe<never>();
expectTypeOf<ArrayChunk<string[], 0>>().toBe<never>();
expectTypeOf<ArrayChunk<string[], number>>().toBe<never>();
expectTypeOf<ArrayChunk<[1, 2], 0 | -1 | 1.5>>().toBe<never>();

// Optional elements, including in otherwise valid unions.
expectTypeOf<ArrayChunk<[1?], 1>>().toBe<never>();
expectTypeOf<ArrayChunk<[1, 2?, ...number[]], 2>>().toBe<never>();
expectTypeOf<ArrayChunk<[1, 2] | [3?], 1>>().toBe<[[1], [2]]>();

// Every array and size combination of the unions.
expectTypeOf<ArrayChunk<[1] | [1, 2], 1 | 2>>().toBe<[[1]] | [[1], [2]] | [[1, 2]]>();
expectTypeOf<ArrayChunk<[1, 2] | readonly [3, 4], 1>>().toBe<[[1], [2]] | readonly [readonly [3], readonly [4]]>();
expectTypeOf<ArrayChunk<[1, 2] | string[], 2>>().toBe<[[1, 2]] | string[][]>();

// Long tuples.
expectTypeOf<ArrayChunk<TupleOf<100, 0>, 10>['length']>().toBe<10>();
expectTypeOf<ArrayChunk<TupleOf<100, 0>, 10>[9]>().toBe<TupleOf<10, 0>>();
expectTypeOf<ArrayChunk<TupleOf<101, 0>, 10>[10]>().toBe<[0]>();
expectTypeOf<ArrayChunk<TupleOf<500, 0>, 1>['length']>().toBe<500>();
expectTypeOf<ArrayChunk<TupleOf<500, 0>, 500>>().toBe<[TupleOf<500, 0>]>();

// Assignability.
expectTypeOf<[[1, 2], [3]]>().toBeAssignableTo<ArrayChunk<[1, 2, 3], 2>>();
expectTypeOf<[[1, 2, 3]]>().not.toBeAssignableTo<ArrayChunk<[1, 2, 3], 2>>();
expectTypeOf<[[1, 2], [3]]>().toBeAssignableTo<ArrayChunk<readonly [1, 2, 3], 2>>();
expectTypeOf<ArrayChunk<readonly [1, 2, 3], 2>>().not.toBeAssignableTo<[[1, 2], [3]]>();
expectTypeOf<string[][]>().toBeAssignableTo<ArrayChunk<string[], 2>>();

declare const rows: ArrayChunk<[1, 2, 3], 2>;
expectTypeOf(rows[0][1]).toBe<2>();
expectTypeOf(rows[1][0]).toBe<3>();
// @ts-expect-error The last chunk has only one element.
const _missing: unknown = rows[1][1];
expectTypeOf<ArrayChunk<TupleOf<900, 0>, 1>['length']>().toBe<900>();
