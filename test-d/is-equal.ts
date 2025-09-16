import {expectType} from 'tsd';
import type {IsEqual} from '../index.d.ts';

const notEqualNumberAndString: IsEqual<number, string> = false;
expectType<false>(notEqualNumberAndString);

const equalNumbers: IsEqual<1, 1> = true;
expectType<true>(equalNumbers);

const notEqualAnyAndNumber: IsEqual<any, number> = false;
expectType<false>(notEqualAnyAndNumber);

const notEqualUnionAndNumber: IsEqual<1 | 2, 1> = false;
expectType<false>(notEqualUnionAndNumber);

const notEqualAnyAndNever: IsEqual<any, never> = false;
expectType<false>(notEqualAnyAndNever);

const notEqualArrayOfAnyAndArrayOfNever: IsEqual<[any], [never]> = false;
expectType<false>(notEqualArrayOfAnyAndArrayOfNever);

const equalNeverAndNever: IsEqual<never, never> = true;
expectType<true>(equalNeverAndNever);

const equalEmptyArrayAndEmptyArray: IsEqual<[], []> = true;
expectType<true>(equalEmptyArrayAndEmptyArray);

const equalReadonlyEmptyArrayAndReadonlyEmptyArray: IsEqual<readonly [], readonly []> = true;
expectType<true>(equalReadonlyEmptyArrayAndReadonlyEmptyArray);

const notEqualReadonlyEmptyArrayAndReadonlyEmptyArray: IsEqual<readonly [], []> = false;
expectType<false>(notEqualReadonlyEmptyArrayAndReadonlyEmptyArray);

const equalArrayNumberAndArrayNumber: IsEqual<number[], number[]> = true;
expectType<true>(equalArrayNumberAndArrayNumber);

const equalReadonlyArrayNumberAndReadonlyArrayNumber: IsEqual<readonly number[], readonly number[]> = true;
expectType<true>(equalReadonlyArrayNumberAndReadonlyArrayNumber);

const notEqualReadonlyArrayNumberAndReadonlyArrayNumber: IsEqual<readonly number[], number[]> = false;
expectType<false>(notEqualReadonlyArrayNumberAndReadonlyArrayNumber);

type LongTupleNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
const equalLongTupleNumberAndLongTupleNumber: IsEqual<LongTupleNumber, LongTupleNumber> = true;
expectType<true>(equalLongTupleNumberAndLongTupleNumber);

type ReadonlyLongTupleNumber = readonly [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
const equalLongReadonlyTupleNumberAndLongReadonlyTupleNumber: IsEqual<ReadonlyLongTupleNumber, ReadonlyLongTupleNumber> = true;
expectType<true>(equalLongReadonlyTupleNumberAndLongReadonlyTupleNumber);

const notEqualLongTupleNumberAndLongTupleNumber: IsEqual<readonly [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]> = false;
expectType<false>(notEqualLongTupleNumberAndLongTupleNumber);

const notEqualTupleUnionAndTuple: IsEqual<[0, 1] | [0, 2], [0, 2]> = false;
expectType<false>(notEqualTupleUnionAndTuple);

// Missing all generic parameters.
// @ts-expect-error
type A = IsEqual;

// Missing `Y` generic parameter.
// @ts-expect-error
type B = IsEqual<number>;

// Test for issue https://github.com/sindresorhus/type-fest/issues/537
type UnionType = IsEqual<{a: 1} & {a: 1}, {a: 1}>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<UnionType>(true);

type IntersectionType = IsEqual<{a: 1} | {a: 1}, {a: 1}>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<IntersectionType>(true);

type __TupleReturnValueTupleBool_wraped0<Fst> = (Fst extends [[0, 2]] ? ['A', true] : ['A', false]);
type __TupleReturnValueTupleBool_wraped1<Fst> = (Fst extends [[0, 1]] ? ['A', true] : ['A', false]);

const equalWrapedTupleIntersecToBeNeverAndNever: IsEqual<(__TupleReturnValueTupleBool_wraped0<[[0, 2]]> & __TupleReturnValueTupleBool_wraped1<[[0, 2]]>), never> = true;
expectType<true>(equalWrapedTupleIntersecToBeNeverAndNever);
const equalWrapedTupleIntersecToBeNeverAndNeverExpanded: [0, 2] extends infer Fst ? IsEqual<(__TupleReturnValueTupleBool_wraped0<[Fst]> & __TupleReturnValueTupleBool_wraped1<[Fst]>), never> : never = true;
expectType<true>(equalWrapedTupleIntersecToBeNeverAndNeverExpanded);

type __TupleReturnValueTupleBool0<Fst> = (Fst extends [0, 2] ? ['A', true] : ['A', false]);
type __TupleReturnValueTupleBool1<Fst> = (Fst extends [0, 1] ? ['A', true] : ['A', false]);

const equalTupleIntersecToBeNeverAndNever: IsEqual<(__TupleReturnValueTupleBool0<[0, 2]> & __TupleReturnValueTupleBool1<[0, 2]>), never> = true;
expectType<true>(equalTupleIntersecToBeNeverAndNever);
const equalTupleIntersecToBeNeverAndNeverExpanded: [0, 2] extends infer Fst ? IsEqual<(__TupleReturnValueTupleBool0<Fst> & __TupleReturnValueTupleBool1<Fst>), never> : never = true;
expectType<true>(equalTupleIntersecToBeNeverAndNeverExpanded);
