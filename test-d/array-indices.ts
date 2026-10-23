import {expectTypeOf} from 'nz';
import type {ArrayIndices, FixedLengthArray, TupleOf} from '../index.d.ts';

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

// Sentinel inputs and unconstrained elements do not invent fixed positions.
expectTypeOf<ArrayIndices<any>>().toBe<number>();
expectTypeOf<ArrayIndices<never>>().toBe<never>();
expectTypeOf<ArrayIndices<unknown[]>>().toBe<number>();
expectTypeOf<ArrayIndices<readonly []>>().toBe<never>();
expectTypeOf<ArrayIndices<readonly [any, unknown, never]>>().toBe<0 | 1 | 2>();
expectTypeOf<ArrayIndices<readonly [] | readonly [string?, number?]>>().toBe<0 | 1>();
// @ts-expect-error Indices require an array type.
type UnknownIndices = ArrayIndices<unknown>;

// A length refinement alone does not declare the indexed positions of a tuple.
expectTypeOf<ArrayIndices<string[] & {length: 3}>>().toBe<never>();
expectTypeOf<ArrayIndices<FixedLengthArray<string, 3>>>().toBe<0 | 1 | 2>();
type FiftyPositions = ArrayIndices<TupleOf<50>>;
expectTypeOf<0 | 10 | 49>().toBeAssignableTo<FiftyPositions>();
expectTypeOf<50>().not.toBeAssignableTo<FiftyPositions>();

// Generic results remain numeric and preserve a concrete tuple's index/value correlation.
function _numericIndex<Values extends readonly unknown[]>(index: ArrayIndices<Values>): number {
	return index;
}

function readIndexedValue<Values extends readonly unknown[], Index extends ArrayIndices<Values>>(array: Values, index: Index): Values[Index] {
	return array[index];
}

const indexedValues = ['first', 2, true] as const;
expectTypeOf(readIndexedValue(indexedValues, 0)).toBe<'first'>();
expectTypeOf(readIndexedValue(indexedValues, 1)).toBe<2>();
expectTypeOf(readIndexedValue(indexedValues, 2)).toBe<true>();
// @ts-expect-error The inferred tuple has no position three.
readIndexedValue(indexedValues, 3);
