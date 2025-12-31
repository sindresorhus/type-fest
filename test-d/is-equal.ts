import {expectType} from 'tsd';
import type {IsEqual, TupleOf} from '../index.d.ts';

expectType<false>({} as IsEqual<number, string>);
expectType<true>({} as IsEqual<1, 1>);
expectType<false>({} as IsEqual<'A', 'B'>);
expectType<true>({} as IsEqual<'foo', 'foo'>);
expectType<false>({} as IsEqual<true, false>);
expectType<true>({} as IsEqual<false, false>);

expectType<false>({} as IsEqual<any, number>);
expectType<false>({} as IsEqual<'', never>);
expectType<true>({} as IsEqual<any, any>);
expectType<true>({} as IsEqual<never, never>);
expectType<false>({} as IsEqual<any, never>);
expectType<false>({} as IsEqual<never, any>);
expectType<false>({} as IsEqual<any, unknown>);
expectType<false>({} as IsEqual<never, unknown>);
expectType<false>({} as IsEqual<unknown, never>);
expectType<false>({} as IsEqual<[never], [unknown]>);
expectType<false>({} as IsEqual<[unknown], [never]>);
expectType<false>({} as IsEqual<[any], [never]>);
expectType<true>({} as IsEqual<[any], [any]>);
expectType<true>({} as IsEqual<[never], [never]>);

expectType<false>({} as IsEqual<1 | 2, 1>);
expectType<false>({} as IsEqual<1 | 2, 2 | 3>);
expectType<true>({} as IsEqual<1 | 2, 2 | 1>);
expectType<false>({} as IsEqual<boolean, true>);

expectType<true>({} as IsEqual<{a: 1}, {a: 1}>);
expectType<false>({} as IsEqual<{a: 1}, {a?: 1}>);
expectType<false>({} as IsEqual<{a: 1}, {readonly a: 1}>);

expectType<true>({} as IsEqual<[], []>);
expectType<true>({} as IsEqual<readonly [], readonly []>);
expectType<false>({} as IsEqual<readonly [], []>);
expectType<true>({} as IsEqual<number[], number[]>);
expectType<true>({} as IsEqual<readonly number[], readonly number[]>);
expectType<false>({} as IsEqual<readonly number[], number[]>);
expectType<true>({} as IsEqual<[string], [string]>);
expectType<false>({} as IsEqual<[string], [string, number]>);
expectType<false>({} as IsEqual<[0, 1] | [0, 2], [0, 2]>);

type LongTupleNumber = TupleOf<50, 0>;
expectType<true>({} as IsEqual<LongTupleNumber, LongTupleNumber>);

type ReadonlyLongTupleNumber = Readonly<TupleOf<50, 0>>;
expectType<true>({} as IsEqual<ReadonlyLongTupleNumber, ReadonlyLongTupleNumber>);

expectType<false>({} as IsEqual<ReadonlyLongTupleNumber, LongTupleNumber>);

// Missing all generic parameters.
// @ts-expect-error
type A = IsEqual;

// Missing `Y` generic parameter.
// @ts-expect-error
type B = IsEqual<number>;

// Test for issue https://github.com/sindresorhus/type-fest/issues/537
type UnionType = IsEqual<{a: 1} | {a: 1}, {a: 1}>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<UnionType>(true);

type IntersectionType = IsEqual<{a: 1} & {a: 1}, {a: 1}>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<IntersectionType>(true);

// Test for PR https://github.com/sindresorhus/type-fest/pull/1231
type BranchOnWrappedTupleMatches<Tpl> = (Tpl extends [[0, 2]] ? 'Foo' : 'Bar');
type BranchOnWrappedTupleDoesNotMatch<Tpl> = (Tpl extends [[0, 1]] ? 'Foo' : 'Bar');
type BranchOnTupleMatches<Tpl> = (Tpl extends [0, 2] ? 'Foo' : 'Bar');
type BranchOnTupleDoesNotMatch<Tpl> = (Tpl extends [0, 1] ? 'Foo' : 'Bar');

declare const equalWrappedTupleIntersectionToBeNeverAndNever: IsEqual<(BranchOnWrappedTupleMatches<[[0, 2]]> & BranchOnWrappedTupleDoesNotMatch<[[0, 2]]>), never>;
expectType<true>(equalWrappedTupleIntersectionToBeNeverAndNever);

declare const equalWrappedTupleIntersectionToBeNeverAndNeverExpanded: [0, 2] extends infer Tpl ? IsEqual<(BranchOnWrappedTupleMatches<[Tpl]> & BranchOnWrappedTupleDoesNotMatch<[Tpl]>), never> : never;
expectType<true>(equalWrappedTupleIntersectionToBeNeverAndNeverExpanded);

declare const equalTupleIntersectionToBeNeverAndNever: IsEqual<(BranchOnTupleMatches<[0, 2]> & BranchOnTupleDoesNotMatch<[0, 2]>), never>;
expectType<true>(equalTupleIntersectionToBeNeverAndNever);

declare const equalTupleIntersectionToBeNeverAndNeverExpanded: [0, 2] extends infer Tpl ? IsEqual<(BranchOnTupleMatches<Tpl> & BranchOnTupleDoesNotMatch<Tpl>), never> : never;
expectType<true>(equalTupleIntersectionToBeNeverAndNeverExpanded);

declare const equalTupleIntersectionAndTuple: IsEqual<[{a: 1}] & [{a: 1}], [{a: 1}]>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>(equalTupleIntersectionAndTuple);

// Test for Issue https://github.com/sindresorhus/type-fest/issues/1305
type Assignability<T, U, _V extends IsEqual<T, U>> = any;
type TestAssignability<T> = Assignability<T, T, true>;
