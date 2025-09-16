import {expectType} from 'tsd';
import type {IsEqual} from '../index.d.ts';
import type {BuildTuple} from '../source/internal/index.d.ts';

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

type LongTupleNumber = BuildTuple<50, 0>;
const equalLongTupleNumberAndLongTupleNumber: IsEqual<LongTupleNumber, LongTupleNumber> = true;
expectType<true>(equalLongTupleNumberAndLongTupleNumber);

type ReadonlyLongTupleNumber = Readonly<BuildTuple<50, 0>>;
const equalLongReadonlyTupleNumberAndLongReadonlyTupleNumber: IsEqual<ReadonlyLongTupleNumber, ReadonlyLongTupleNumber> = true;
expectType<true>(equalLongReadonlyTupleNumberAndLongReadonlyTupleNumber);

const notEqualLongTupleNumberAndLongTupleNumber: IsEqual<ReadonlyLongTupleNumber, LongTupleNumber> = false;
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

// Test for PR https://github.com/sindresorhus/type-fest/pull/1231
type BranchOnWrappedTupleMatches<Tpl> = (Tpl extends [[0, 2]] ? ['A', true] : ['A', false]);
type BranchOnWrappedTupleDoesNotMatch<Tpl> = (Tpl extends [[0, 1]] ? ['A', true] : ['A', false]);
type BranchOnTupleMatches<Tpl> = (Tpl extends [0, 2] ? ['A', true] : ['A', false]);
type BranchOnTupleDoesNotMatch<Tpl> = (Tpl extends [0, 1] ? ['A', true] : ['A', false]);

const equalWrappedTupleIntersectionToBeNeverAndNever: IsEqual<(BranchOnWrappedTupleMatches<[[0, 2]]> & BranchOnWrappedTupleDoesNotMatch<[[0, 2]]>), never> = true;
expectType<true>(equalWrappedTupleIntersectionToBeNeverAndNever);

const equalWrappedTupleIntersectionToBeNeverAndNeverExpanded: [0, 2] extends infer Tpl ? IsEqual<(BranchOnWrappedTupleMatches<[Tpl]> & BranchOnWrappedTupleDoesNotMatch<[Tpl]>), never> : never = true;
expectType<true>(equalWrappedTupleIntersectionToBeNeverAndNeverExpanded);

const equalTupleIntersectionToBeNeverAndNever: IsEqual<(BranchOnTupleMatches<[0, 2]> & BranchOnTupleDoesNotMatch<[0, 2]>), never> = true;
expectType<true>(equalTupleIntersectionToBeNeverAndNever);

const equalTupleIntersectionToBeNeverAndNeverExpanded: [0, 2] extends infer Tpl ? IsEqual<(BranchOnTupleMatches<Tpl> & BranchOnTupleDoesNotMatch<Tpl>), never> : never = true;
expectType<true>(equalTupleIntersectionToBeNeverAndNeverExpanded);
