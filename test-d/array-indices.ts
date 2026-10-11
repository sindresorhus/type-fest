import {expectTypeOf} from 'nz';
import type {ArrayIndices} from '../index.d.ts';

const values = ['a', 'b', 'c'] as const;
type ValueKeys = ArrayIndices<typeof values>;

declare const test: 0 | 1 | 2;
expectTypeOf(test).toBe<ValueKeys>();

expectTypeOf<0>().toBeAssignableTo<ValueKeys>();
expectTypeOf<1>().toBeAssignableTo<ValueKeys>();
expectTypeOf<2>().toBeAssignableTo<ValueKeys>();

expectTypeOf<-1>().not.toBeAssignableTo<ValueKeys>();
expectTypeOf<3>().not.toBeAssignableTo<ValueKeys>();

type TupleKeys = ArrayIndices<['a', 2]>;

declare const testTuple: 0 | 1;
expectTypeOf(testTuple).toBe<TupleKeys>();

expectTypeOf<0>().toBeAssignableTo<TupleKeys>();
expectTypeOf<1>().toBeAssignableTo<TupleKeys>();

expectTypeOf<-1>().not.toBeAssignableTo<TupleKeys>();
expectTypeOf<2>().not.toBeAssignableTo<TupleKeys>();

// An array of unknown length can be indexed with any number.
declare const unknownLength: ArrayIndices<string[]>;
expectTypeOf(unknownLength).toBe<number>();

declare const restTuple: ArrayIndices<readonly [string, ...number[]]>;
expectTypeOf(restTuple).toBe<number>();

// A tuple that already has an optional element still has valid indices for it.
declare const optionalTail: ArrayIndices<readonly [string, (number | undefined)?]>;
expectTypeOf(optionalTail).toBe<0 | 1>();

declare const allOptional: ArrayIndices<readonly [string?]>;
expectTypeOf(allOptional).toBe<0>();

declare const optionalThenRest: ArrayIndices<readonly [string?, ...number[]]>;
expectTypeOf(optionalThenRest).toBe<number>();

declare const emptyTuple: ArrayIndices<[]>;
expectTypeOf(emptyTuple).toBe<never>();

// A union of tuples contributes the indices of every member, since `keyof` of a union is the intersection of the members' keys and would otherwise drop them.
declare const unionOfTuples: ArrayIndices<[1, 2] | [1, 2, 3]>;
expectTypeOf(unionOfTuples).toBe<0 | 1 | 2>();

declare const unionWithEmptyTuple: ArrayIndices<[] | [1, 2, 3]>;
expectTypeOf(unionWithEmptyTuple).toBe<0 | 1 | 2>();

declare const unionOfVariableLength: ArrayIndices<[1, 2] | number[]>;
expectTypeOf(unionOfVariableLength).toBe<number>();
