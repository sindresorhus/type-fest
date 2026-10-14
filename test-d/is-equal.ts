import {expectTypeOf} from 'nz';
import type {IsEqual, Simplify, SimplifyDeep, TupleOf} from '../index.d.ts';

expectTypeOf<IsEqual<number, string>>().toBe<false>();
expectTypeOf<IsEqual<1, 1>>().toBe<true>();
expectTypeOf<IsEqual<'A', 'B'>>().toBe<false>();
expectTypeOf<IsEqual<'foo', 'foo'>>().toBe<true>();
expectTypeOf<IsEqual<true, false>>().toBe<false>();
expectTypeOf<IsEqual<false, false>>().toBe<true>();

expectTypeOf<IsEqual<any, number>>().toBe<false>();
expectTypeOf<IsEqual<'', never>>().toBe<false>();
expectTypeOf<IsEqual<any, any>>().toBe<true>();
expectTypeOf<IsEqual<never, never>>().toBe<true>();
expectTypeOf<IsEqual<any, never>>().toBe<false>();
expectTypeOf<IsEqual<never, any>>().toBe<false>();
expectTypeOf<IsEqual<any, unknown>>().toBe<false>();
expectTypeOf<IsEqual<never, unknown>>().toBe<false>();
expectTypeOf<IsEqual<unknown, never>>().toBe<false>();
expectTypeOf<IsEqual<[never], [unknown]>>().toBe<false>();
expectTypeOf<IsEqual<[unknown], [never]>>().toBe<false>();
expectTypeOf<IsEqual<[any], [never]>>().toBe<false>();
expectTypeOf<IsEqual<[any], [any]>>().toBe<true>();
expectTypeOf<IsEqual<[never], [never]>>().toBe<true>();

expectTypeOf<IsEqual<1 | 2, 1>>().toBe<false>();
expectTypeOf<IsEqual<1 | 2, 2 | 3>>().toBe<false>();
expectTypeOf<IsEqual<1 | 2, 2 | 1>>().toBe<true>();
expectTypeOf<IsEqual<boolean, true>>().toBe<false>();

expectTypeOf<IsEqual<{a: 1}, {a: 1}>>().toBe<true>();
expectTypeOf<IsEqual<{a: 1}, {a?: 1}>>().toBe<false>();
expectTypeOf<IsEqual<{a: 1}, {readonly a: 1}>>().toBe<false>();

expectTypeOf<IsEqual<[], []>>().toBe<true>();
expectTypeOf<IsEqual<readonly [], readonly []>>().toBe<true>();
expectTypeOf<IsEqual<readonly [], []>>().toBe<false>();
expectTypeOf<IsEqual<number[], number[]>>().toBe<true>();
expectTypeOf<IsEqual<readonly number[], readonly number[]>>().toBe<true>();
expectTypeOf<IsEqual<readonly number[], number[]>>().toBe<false>();
expectTypeOf<IsEqual<[string], [string]>>().toBe<true>();
expectTypeOf<IsEqual<[string], [string, number]>>().toBe<false>();
expectTypeOf<IsEqual<[0, 1] | [0, 2], [0, 2]>>().toBe<false>();

type LongTupleNumber = TupleOf<50, 0>;
expectTypeOf<IsEqual<LongTupleNumber, LongTupleNumber>>().toBe<true>();

type ReadonlyLongTupleNumber = Readonly<TupleOf<50, 0>>;
expectTypeOf<IsEqual<ReadonlyLongTupleNumber, ReadonlyLongTupleNumber>>().toBe<true>();

expectTypeOf<IsEqual<ReadonlyLongTupleNumber, LongTupleNumber>>().toBe<false>();

// Missing all generic parameters.
// @ts-expect-error
type A = IsEqual;

// Missing `Y` generic parameter.
// @ts-expect-error
type B = IsEqual<number>;

// Test for issue https://github.com/sindresorhus/type-fest/issues/537
type UnionType = IsEqual<{a: 1} | {a: 1}, {a: 1}>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectTypeOf<UnionType>().toBe<true>();

type IntersectionType = IsEqual<{a: 1} & {a: 1}, {a: 1}>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectTypeOf<IntersectionType>().toBe<true>();

// Test for PR https://github.com/sindresorhus/type-fest/pull/1231
type BranchOnWrappedTupleMatches<Tpl> = (Tpl extends [[0, 2]] ? 'Foo' : 'Bar');
type BranchOnWrappedTupleDoesNotMatch<Tpl> = (Tpl extends [[0, 1]] ? 'Foo' : 'Bar');
type BranchOnTupleMatches<Tpl> = (Tpl extends [0, 2] ? 'Foo' : 'Bar');
type BranchOnTupleDoesNotMatch<Tpl> = (Tpl extends [0, 1] ? 'Foo' : 'Bar');

declare const equalWrappedTupleIntersectionToBeNeverAndNever: IsEqual<(BranchOnWrappedTupleMatches<[[0, 2]]> & BranchOnWrappedTupleDoesNotMatch<[[0, 2]]>), never>;
expectTypeOf(equalWrappedTupleIntersectionToBeNeverAndNever).toBe<true>();

declare const equalWrappedTupleIntersectionToBeNeverAndNeverExpanded: [0, 2] extends infer Tpl ? IsEqual<(BranchOnWrappedTupleMatches<[Tpl]> & BranchOnWrappedTupleDoesNotMatch<[Tpl]>), never> : never;
expectTypeOf(equalWrappedTupleIntersectionToBeNeverAndNeverExpanded).toBe<true>();

declare const equalTupleIntersectionToBeNeverAndNever: IsEqual<(BranchOnTupleMatches<[0, 2]> & BranchOnTupleDoesNotMatch<[0, 2]>), never>;
expectTypeOf(equalTupleIntersectionToBeNeverAndNever).toBe<true>();

declare const equalTupleIntersectionToBeNeverAndNeverExpanded: [0, 2] extends infer Tpl ? IsEqual<(BranchOnTupleMatches<Tpl> & BranchOnTupleDoesNotMatch<Tpl>), never> : never;
expectTypeOf(equalTupleIntersectionToBeNeverAndNeverExpanded).toBe<true>();

declare const equalTupleIntersectionAndTuple: IsEqual<[{a: 1}] & [{a: 1}], [{a: 1}]>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectTypeOf(equalTupleIntersectionAndTuple).toBe<true>();

// Test for Issue https://github.com/sindresorhus/type-fest/issues/1305
type Assignability<T, U, _V extends IsEqual<T, U>> = any;
type TestAssignability<T> = Assignability<T, T, true>;

// Known limitation: An intersection of object types is not equal to the same type written as one object. `Simplify` and `SimplifyDeep` are the documented workaround.
expectTypeOf<IsEqual<{a: 0} & {b: 0}, {a: 0; b: 0}>>().toBe<false>();
expectTypeOf<IsEqual<Simplify<{a: 0} & {b: 0}>, Simplify<{a: 0; b: 0}>>>().toBe<true>();
expectTypeOf<IsEqual<SimplifyDeep<{x: {a: 0} & {b: 0}}>, SimplifyDeep<{x: {a: 0; b: 0}}>>>().toBe<true>();
