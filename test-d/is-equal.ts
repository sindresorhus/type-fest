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
