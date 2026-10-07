import {expectNotAssignable, expectType, expectAssignable} from 'tsd';
import type {ArrayIndices} from '../index.d.ts';

const values = ['a', 'b', 'c'] as const;
type ValueKeys = ArrayIndices<typeof values>;

declare const test: 0 | 1 | 2;
expectType<ValueKeys>(test);

expectAssignable<ValueKeys>(0);
expectAssignable<ValueKeys>(1);
expectAssignable<ValueKeys>(2);

expectNotAssignable<ValueKeys>(-1);
expectNotAssignable<ValueKeys>(3);

type TupleKeys = ArrayIndices<['a', 2]>;

declare const testTuple: 0 | 1;
expectType<TupleKeys>(testTuple);

expectAssignable<TupleKeys>(0);
expectAssignable<TupleKeys>(1);

expectNotAssignable<TupleKeys>(-1);
expectNotAssignable<TupleKeys>(2);

// An array of unknown length can be indexed with any number.
declare const unknownLength: ArrayIndices<string[]>;
expectType<number>(unknownLength);

declare const restTuple: ArrayIndices<readonly [string, ...number[]]>;
expectType<number>(restTuple);

// A tuple that already has an optional element still has valid indices for it.
declare const optionalTail: ArrayIndices<readonly [string, (number | undefined)?]>;
expectType<0 | 1>(optionalTail);

declare const allOptional: ArrayIndices<readonly [string?]>;
expectType<0>(allOptional);

declare const optionalThenRest: ArrayIndices<readonly [string?, ...number[]]>;
expectType<number>(optionalThenRest);

declare const emptyTuple: ArrayIndices<[]>;
expectType<never>(emptyTuple);

// A union of tuples contributes the indices of every member, since `keyof` of a union is the intersection of the members' keys and would otherwise drop them.
declare const unionOfTuples: ArrayIndices<[1, 2] | [1, 2, 3]>;
expectType<0 | 1 | 2>(unionOfTuples);

declare const unionWithEmptyTuple: ArrayIndices<[] | [1, 2, 3]>;
expectType<0 | 1 | 2>(unionWithEmptyTuple);

declare const unionOfVariableLength: ArrayIndices<[1, 2] | number[]>;
expectType<number>(unionOfVariableLength);
