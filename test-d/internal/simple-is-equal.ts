import {expectType} from 'tsd';
import type {TupleOf} from '../../index.d.ts';
import type {SimpleIsEqual} from '../../source/internal/index.d.ts';

expectType<false>({} as SimpleIsEqual<number, string>);
expectType<true>({} as SimpleIsEqual<1, 1>);
expectType<false>({} as SimpleIsEqual<'A', 'B'>);
expectType<true>({} as SimpleIsEqual<'foo', 'foo'>);
expectType<false>({} as SimpleIsEqual<true, false>);
expectType<true>({} as SimpleIsEqual<false, false>);

expectType<false>({} as SimpleIsEqual<any, number>);
expectType<false>({} as SimpleIsEqual<'', never>);
expectType<true>({} as SimpleIsEqual<any, any>);
expectType<true>({} as SimpleIsEqual<never, never>);
expectType<false>({} as SimpleIsEqual<any, never>);
expectType<false>({} as SimpleIsEqual<never, any>);
expectType<false>({} as SimpleIsEqual<any, unknown>);
// `IsEqual` returns `false`, `SimpleIsEqual` returns `true`.
expectType<true>({} as SimpleIsEqual<never, unknown>);
// `IsEqual` returns `false`, `SimpleIsEqual` returns `true`.
expectType<true>({} as SimpleIsEqual<unknown, never>);
expectType<false>({} as SimpleIsEqual<[never], [unknown]>);
expectType<false>({} as SimpleIsEqual<[unknown], [never]>);
expectType<false>({} as SimpleIsEqual<[any], [never]>);
expectType<true>({} as SimpleIsEqual<[any], [any]>);
expectType<true>({} as SimpleIsEqual<[never], [never]>);

expectType<false>({} as SimpleIsEqual<1 | 2, 1>);
expectType<false>({} as SimpleIsEqual<1 | 2, 2 | 3>);
expectType<true>({} as SimpleIsEqual<1 | 2, 2 | 1>);
expectType<false>({} as SimpleIsEqual<boolean, true>);

expectType<true>({} as SimpleIsEqual<{a: 1}, {a: 1}>);
expectType<false>({} as SimpleIsEqual<{a: 1}, {a?: 1}>);
expectType<false>({} as SimpleIsEqual<{a: 1}, {readonly a: 1}>);

expectType<true>({} as SimpleIsEqual<[], []>);
expectType<true>({} as SimpleIsEqual<readonly [], readonly []>);
expectType<false>({} as SimpleIsEqual<readonly [], []>);
expectType<true>({} as SimpleIsEqual<number[], number[]>);
expectType<true>({} as SimpleIsEqual<readonly number[], readonly number[]>);
expectType<false>({} as SimpleIsEqual<readonly number[], number[]>);
expectType<true>({} as SimpleIsEqual<[string], [string]>);
expectType<false>({} as SimpleIsEqual<[string], [string, number]>);
expectType<false>({} as SimpleIsEqual<[0, 1] | [0, 2], [0, 2]>);

type LongTupleNumber = TupleOf<50, 0>;
expectType<true>({} as SimpleIsEqual<LongTupleNumber, LongTupleNumber>);

type ReadonlyLongTupleNumber = Readonly<TupleOf<50, 0>>;
expectType<true>({} as SimpleIsEqual<ReadonlyLongTupleNumber, ReadonlyLongTupleNumber>);

expectType<false>({} as SimpleIsEqual<ReadonlyLongTupleNumber, LongTupleNumber>);

// Missing all generic parameters.
// @ts-expect-error
type A = SimpleIsEqual;

// Missing `Y` generic parameter.
// @ts-expect-error
type B = SimpleIsEqual<number>;

// Test for issue https://github.com/sindresorhus/type-fest/issues/537
type UnionType = SimpleIsEqual<{a: 1} | {a: 1}, {a: 1}>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<UnionType>(true);

type IntersectionType = SimpleIsEqual<{a: 1} & {a: 1}, {a: 1}>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<IntersectionType>(true);

// Test for PR https://github.com/sindresorhus/type-fest/pull/1231
type BranchOnWrappedTupleMatches<Tpl> = (Tpl extends [[0, 2]] ? 'Foo' : 'Bar');
type BranchOnWrappedTupleDoesNotMatch<Tpl> = (Tpl extends [[0, 1]] ? 'Foo' : 'Bar');
type BranchOnTupleMatches<Tpl> = (Tpl extends [0, 2] ? 'Foo' : 'Bar');
type BranchOnTupleDoesNotMatch<Tpl> = (Tpl extends [0, 1] ? 'Foo' : 'Bar');

declare const equalWrappedTupleIntersectionToBeNeverAndNever: SimpleIsEqual<(BranchOnWrappedTupleMatches<[[0, 2]]> & BranchOnWrappedTupleDoesNotMatch<[[0, 2]]>), never>;
expectType<true>(equalWrappedTupleIntersectionToBeNeverAndNever);

// `IsEqual` returns `false`, `SimpleIsEqual` returns `true`.
declare const equalWrappedTupleIntersectionToBeNeverAndNeverExpanded: [0, 2] extends infer Tpl ? SimpleIsEqual<(BranchOnWrappedTupleMatches<[Tpl]> & BranchOnWrappedTupleDoesNotMatch<[Tpl]>), never> : never;
expectType<false>(equalWrappedTupleIntersectionToBeNeverAndNeverExpanded);

declare const equalTupleIntersectionToBeNeverAndNever: SimpleIsEqual<(BranchOnTupleMatches<[0, 2]> & BranchOnTupleDoesNotMatch<[0, 2]>), never>;
expectType<true>(equalTupleIntersectionToBeNeverAndNever);

declare const equalTupleIntersectionToBeNeverAndNeverExpanded: [0, 2] extends infer Tpl ? SimpleIsEqual<(BranchOnTupleMatches<Tpl> & BranchOnTupleDoesNotMatch<Tpl>), never> : never;
expectType<true>(equalTupleIntersectionToBeNeverAndNeverExpanded);

declare const equalTupleIntersectionAndTuple: SimpleIsEqual<[{a: 1}] & [{a: 1}], [{a: 1}]>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>(equalTupleIntersectionAndTuple);

// Test for Issue https://github.com/sindresorhus/type-fest/issues/1305
type Assignability<T, U, _V extends SimpleIsEqual<T, U>> = any;
type TestAssignability<T> = Assignability<T, T, true>;
