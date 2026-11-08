import {expectTypeOf} from 'nz';
import type {ArrayIndices, FixedLengthArray, IndexTuple, TupleOf, UnknownArray} from '../index.d.ts';

// A dense tuple maps each position to its literal index, whatever the element types are.
expectTypeOf<IndexTuple<['a', 'b', 'c']>>().toBe<[0, 1, 2]>();
expectTypeOf<IndexTuple<[unknown]>>().toBe<[0]>();
expectTypeOf<IndexTuple<[never]>>().toBe<[0]>();
expectTypeOf<IndexTuple<[string | undefined, number]>>().toBe<[0, 1]>();
expectTypeOf<IndexTuple<[1, 'a', true, null, undefined, symbol]>>().toBe<[0, 1, 2, 3, 4, 5]>();
expectTypeOf<IndexTuple<[]>>().toBe<[]>();

// A readonly tuple gives a readonly result.
expectTypeOf<IndexTuple<readonly ['a', 'b']>>().toBe<readonly [0, 1]>();
expectTypeOf<IndexTuple<readonly []>>().toBe<readonly []>();

// An array of unknown length indexes with any numeric index.
expectTypeOf<IndexTuple<string[]>>().toBe<number[]>();
expectTypeOf<IndexTuple<readonly string[]>>().toBe<readonly number[]>();
expectTypeOf<IndexTuple<unknown[]>>().toBe<number[]>();
expectTypeOf<IndexTuple<readonly unknown[]>>().toBe<readonly number[]>();
expectTypeOf<IndexTuple<any[]>>().toBe<number[]>();
expectTypeOf<IndexTuple<readonly any[]>>().toBe<readonly number[]>();
expectTypeOf<IndexTuple<never[]>>().toBe<number[]>();
expectTypeOf<IndexTuple<readonly never[]>>().toBe<readonly number[]>();
expectTypeOf<IndexTuple<[...string[]]>>().toBe<number[]>();
expectTypeOf<IndexTuple<readonly [...string[]]>>().toBe<readonly number[]>();

// A variable-length rest element makes the length non-literal, wherever it is.
expectTypeOf<IndexTuple<[string, ...number[]]>>().toBe<number[]>();
expectTypeOf<IndexTuple<readonly [string, ...number[]]>>().toBe<readonly number[]>();
expectTypeOf<IndexTuple<[1, ...string[], 2]>>().toBe<number[]>();
expectTypeOf<IndexTuple<readonly [1, ...string[], 2]>>().toBe<readonly number[]>();
expectTypeOf<IndexTuple<[...string[], 1, 2]>>().toBe<number[]>();
expectTypeOf<IndexTuple<readonly [...string[], 1, 2]>>().toBe<readonly number[]>();

// An empty rest element is normalized to a fixed tuple.
expectTypeOf<IndexTuple<[string, ...[]]>>().toBe<[0]>();
expectTypeOf<IndexTuple<readonly [string, ...[]]>>().toBe<readonly [0]>();

// Optional elements produce a union of tuples, one per possible length, unless the tuple also has a variable-length rest element.
expectTypeOf<IndexTuple<[string, number?]>>().toBe<[0] | [0, 1]>();
expectTypeOf<IndexTuple<[string?]>>().toBe<[] | [0]>();
expectTypeOf<IndexTuple<[string?, number?]>>().toBe<[] | [0] | [0, 1]>();
expectTypeOf<IndexTuple<readonly [string?, number?]>>().toBe<readonly [] | readonly [0] | readonly [0, 1]>();
expectTypeOf<IndexTuple<[string?, ...number[]]>>().toBe<number[]>();
expectTypeOf<IndexTuple<readonly [string?, ...number[]]>>().toBe<readonly number[]>();

// A rest element that is a union of fixed-length tuples still gives a union of tuples.
expectTypeOf<IndexTuple<[string, ...([number] | [number, number])]>>().toBe<[0, 1] | [0, 1, 2]>();
expectTypeOf<IndexTuple<readonly [string, ...([number] | [number, number])]>>().toBe<readonly [0, 1] | readonly [0, 1, 2]>();
expectTypeOf<IndexTuple<[string, ...([] | [number])]>>().toBe<[0] | [0, 1]>();
expectTypeOf<IndexTuple<readonly [string, ...([] | [number])]>>().toBe<readonly [0] | readonly [0, 1]>();

// The union is distributed before reading the indices.
expectTypeOf<IndexTuple<[1, 2] | [1, 2, 3]>>().toBe<[0, 1] | [0, 1, 2]>();
expectTypeOf<IndexTuple<[] | [1, 2, 3]>>().toBe<[] | [0, 1, 2]>();
expectTypeOf<IndexTuple<[] | string[]>>().toBe<[] | number[]>();
expectTypeOf<IndexTuple<[1, 2] | number[]>>().toBe<[0, 1] | number[]>();
expectTypeOf<IndexTuple<[1, 2] | readonly [1, 2, 3]>>().toBe<[0, 1] | readonly [0, 1, 2]>();
expectTypeOf<IndexTuple<[string] | readonly [string]>>().toBe<[0] | readonly [0]>();

// Sentinel inputs do not invent indices.
expectTypeOf<IndexTuple<any>>().toBe<number[]>();
expectTypeOf<IndexTuple<never>>().toBe<never>();
expectTypeOf<IndexTuple<readonly [any, unknown, never]>>().toBe<readonly [0, 1, 2]>();

// A literal length gives the indices it implies, even without a tuple's key declarations.
expectTypeOf<IndexTuple<string[] & {length: 0}>>().toBe<[]>();
expectTypeOf<IndexTuple<string[] & {length: 1}>>().toBe<[0]>();
expectTypeOf<IndexTuple<readonly string[] & {length: 3}>>().toBe<readonly [0, 1, 2]>();

// `FixedLengthArray` is readonly and has a literal length.
expectTypeOf<IndexTuple<FixedLengthArray<string, 0>>>().toBe<readonly []>();
expectTypeOf<IndexTuple<FixedLengthArray<string, 1>>>().toBe<readonly [0]>();
expectTypeOf<IndexTuple<FixedLengthArray<string, 3>>>().toBe<readonly [0, 1, 2]>();

type Fifty = IndexTuple<TupleOf<50>>;
expectTypeOf<Fifty['length']>().toBe<50>();
expectTypeOf<0 | 10 | 49>().toBeAssignableTo<Fifty[number]>();
expectTypeOf<50>().not.toBeAssignableTo<Fifty[number]>();

// Multi-digit keys map to their own index.
expectTypeOf<IndexTuple<TupleOf<11>>[10]>().toBe<10>();
expectTypeOf<IndexTuple<TupleOf<50>>[number]>().toBe<ArrayIndices<TupleOf<50>>>();

// For these inputs, the union of the tuple matches `ArrayIndices`.
expectTypeOf<IndexTuple<['a', 'b', 'c']>[number]>().toBe<ArrayIndices<['a', 'b', 'c']>>();
expectTypeOf<IndexTuple<readonly [string, number?]>[number]>().toBe<ArrayIndices<readonly [string, number?]>>();
expectTypeOf<IndexTuple<[string?]>[number]>().toBe<ArrayIndices<[string?]>>();
expectTypeOf<IndexTuple<[string, ...number[]]>[number]>().toBe<ArrayIndices<[string, ...number[]]>>();
expectTypeOf<IndexTuple<[...string[], 1, 2]>[number]>().toBe<ArrayIndices<[...string[], 1, 2]>>();
expectTypeOf<IndexTuple<readonly string[]>[number]>().toBe<ArrayIndices<readonly string[]>>();
expectTypeOf<IndexTuple<[1, 2] | readonly [1, 2]>[number]>().toBe<ArrayIndices<[1, 2] | readonly [1, 2]>>();
expectTypeOf<IndexTuple<[]>[number]>().toBe<ArrayIndices<[]>>();
expectTypeOf<IndexTuple<FixedLengthArray<string, 0>>[number]>().toBe<ArrayIndices<FixedLengthArray<string, 0>>>();
expectTypeOf<IndexTuple<FixedLengthArray<string, 3>>[number]>().toBe<ArrayIndices<FixedLengthArray<string, 3>>>();
expectTypeOf<IndexTuple<any>[number]>().toBe<ArrayIndices<any>>();
expectTypeOf<IndexTuple<never>[number]>().toBe<ArrayIndices<never>>();
expectTypeOf<IndexTuple<never[]>[number]>().toBe<ArrayIndices<never[]>>();

// A value must list every index exactly once.
const values = ['a', 'b', 'c'] as const;
const positions: IndexTuple<typeof values> = [0, 1, 2];

// @ts-expect-error Missing an index.
const missingPosition: IndexTuple<typeof values> = [0, 1];

// @ts-expect-error A duplicate index.
const duplicatePosition: IndexTuple<typeof values> = [0, 1, 1];

// @ts-expect-error Out of range.
const outOfRangePosition: IndexTuple<typeof values> = [0, 1, 3];

// @ts-expect-error A readonly value is not assignable to a mutable result.
const mutablePositions: IndexTuple<['a', 'b']> = [0, 1] as readonly [0, 1];

// @ts-expect-error Indices require an array or tuple type.
type InvalidInput = IndexTuple<unknown>;

// Pair each element with its literal index in a mapped type.
type Positioned<Tuple extends UnknownArray> = {
	[Index in keyof Tuple]: [IndexTuple<Tuple>[Index & keyof IndexTuple<Tuple>], Tuple[Index]];
};

expectTypeOf<Positioned<['apple', 'banana', 'plum']>>().toBe<[[0, 'apple'], [1, 'banana'], [2, 'plum']]>();
expectTypeOf<Positioned<readonly ['apple', 'banana']>>().toBe<readonly [[0, 'apple'], [1, 'banana']]>();

// Indexing the union in an optional tuple can pair an element with an index where it cannot appear.
expectTypeOf<Positioned<[string, number?]>>().toBe<[[0, string], [0 | 1, number | undefined]?]>();

// The pattern assumes a dense tuple, so a variable-length array pairs every key with `number`.
expectTypeOf<Positioned<string[]>>().toBe<Array<[number, string]>>();
