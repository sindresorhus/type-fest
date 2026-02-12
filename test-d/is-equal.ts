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

// Lambda cases.
type SpecificNumericLambda = (value: {a: 1}) => {b: 1};
type SpecificNumericLambda1 = (value: {a: 2}) => {b: 1};
type NumberLambda = (value: {a: number}) => {b: number};
type AnyLambda = (value: {a: any}) => {b: any};
type UnknownLambda = (value: {a: unknown}) => {b: unknown};
type NeverLambda = (value: {a: never}) => {b: never};
expectType<true>({} as IsEqual<SpecificNumericLambda, SpecificNumericLambda>);
expectType<false>({} as IsEqual<SpecificNumericLambda, SpecificNumericLambda1>);
expectType<false>({} as IsEqual<SpecificNumericLambda, NumberLambda>);
expectType<false>({} as IsEqual<NumberLambda, SpecificNumericLambda>);
expectType<true>({} as IsEqual<UnknownLambda, UnknownLambda>);
expectType<true>({} as IsEqual<NeverLambda, NeverLambda>);
expectType<false>({} as IsEqual<NeverLambda, UnknownLambda>);
expectType<false>({} as IsEqual<UnknownLambda, NeverLambda>);
expectType<false>({} as IsEqual<NeverLambda, AnyLambda>);
expectType<false>({} as IsEqual<AnyLambda, NeverLambda>);
expectType<true>({} as IsEqual<AnyLambda, AnyLambda>);
expectType<false>({} as IsEqual<AnyLambda, NumberLambda>);
expectType<false>({} as IsEqual<NumberLambda, AnyLambda>);

// Lambda: Identical Union and Intersection cases.
expectType<true>({} as IsEqual<SpecificNumericLambda & SpecificNumericLambda, SpecificNumericLambda>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<SpecificNumericLambda | SpecificNumericLambda, SpecificNumericLambda>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
type NumberLambdaIntersection = (value: {a: number} & {a: number}) => {b: number}; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
type NumberLambdaUnion = (value: {a: number} | {a: number}) => {b: number}; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
type NumberLambdaReturnIntersection = (value: {a: number}) => {b: number} & {b: number}; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
type NumberLambdaReturnUnion = (value: {a: number}) => {b: number} | {b: number}; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
type NumberLambdaBothIntersection = (value: {a: number} & {a: number}) => {b: number} & {b: number}; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
type NumberLambdaBothUnion = (value: {a: number} | {a: number}) => {b: number} | {b: number}; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

expectType<true>({} as IsEqual<NumberLambdaIntersection, NumberLambda>);
expectType<true>({} as IsEqual<NumberLambdaUnion, NumberLambda>);
expectType<true>({} as IsEqual<NumberLambdaReturnIntersection, NumberLambda>);
expectType<true>({} as IsEqual<NumberLambdaReturnUnion, NumberLambda>);
expectType<true>({} as IsEqual<NumberLambdaBothIntersection, NumberLambda>);
expectType<true>({} as IsEqual<NumberLambdaBothUnion, NumberLambda>);
expectType<true>({} as IsEqual<AnyLambda & AnyLambda, AnyLambda>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<AnyLambda | AnyLambda, AnyLambda>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<NeverLambda & NeverLambda, NeverLambda>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<NeverLambda | NeverLambda, NeverLambda>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<UnknownLambda & UnknownLambda, UnknownLambda>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<UnknownLambda | UnknownLambda, UnknownLambda>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// Date cases.
const foo = {date: new Date(), a: null} as const;
expectType<true>({} as IsEqual<typeof foo, typeof foo>);
expectType<false>({} as IsEqual<{a: null}, typeof foo>);
expectType<false>({} as IsEqual<{date: Date}, typeof foo>);
// Date: Identical Union and Intersection cases.

// Set cases.
expectType<true>({} as IsEqual<Set<string>, Set<string>>);
expectType<false>({} as IsEqual<Set<number>, Set<string>>);
expectType<false>({} as IsEqual<Set<0>, Set<number>>);

// Set: Identical Union and Intersection cases.
expectType<true>({} as IsEqual<{a: {b: Set<0> & Set<0>}}, {a: {b: Set<0>}}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<{a: {b: Set<0> | Set<0>}}, {a: {b: Set<0>}}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// Set: Identical Union and Intersection cases.
expectType<true>({} as IsEqual<{a: {b: Set<0> & Set<0>}}, {a: {b: Set<0>}}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<{a: {b: Set<0> | Set<0>}}, {a: {b: Set<0>}}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// Map cases.
expectType<true>({} as IsEqual<Map<string, number>, Map<string, number>>);
expectType<false>({} as IsEqual<Map<string, number>, Map<string, 0>>);
expectType<false>({} as IsEqual<Map<string, 0>, Map<string, number>>);
expectType<true>({} as IsEqual<Map<string, unknown>, Map<string, unknown>>);
expectType<true>({} as IsEqual<Map<string, never>, Map<string, never>>);
expectType<false>({} as IsEqual<Map<string, never>, Map<string, unknown>>);
expectType<false>({} as IsEqual<Map<string, unknown>, Map<string, never>>);
expectType<true>({} as IsEqual<Map<string, any>, Map<string, any>>);
expectType<false>({} as IsEqual<Map<string, any>, Map<string, number>>);
expectType<false>({} as IsEqual<Map<string, number>, Map<string, any>>);

// Map: Identical Union and Intersection cases.
expectType<true>({} as IsEqual<Map<string, number> | Map<string, number>, Map<string, number>>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<Map<string, number> & Map<string, number>, Map<string, number>>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

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

// Ensure `{a: t; b: s}` === `{a: t} & {b: s}`, not equal to `{a: u} & {b: v}` if `u` !== `t` or `v` !== `s`.
expectType<true>({} as IsEqual<{a: 0} & {b: 0}, {a: 0; b: 0}>);
expectType<true>({} as IsEqual<{aa: {a: {x: 0} & {y: 0}} & {b: 0}}, {aa: {a: {x: 0; y: 0}; b: 0}}>);
expectType<false>({} as IsEqual<{a: 1} & {b: 0}, {a: 0; b: 0}>);
expectType<false>({} as IsEqual<{aa: {a: {x: 1} & {y: 0}} & {b: 0}}, {aa: {a: {x: 0; y: 0}; b: 0}}>);

// Ensure `{a: t} | {a: t}` === `{a: t}`
expectType<true>({} as IsEqual<{a: 0} & ({b: 0} | {b: 0}), {a: 0; b: 0}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<{aa: {a: {x: 0} & ({y: 0} | {y: 0})} & {b: 0}}, {aa: {a: {x: 0; y: 0}; b: 0}}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<false>({} as IsEqual<{readonly a: 0} & ({b: 0} | {b: 0}), {a: 0; b: 0}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<false>({} as IsEqual<{readonly aa: {a: 0} & ({b: 0} | {b: 0})}, {aa: {a: 0; b: 0}}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// `readonly key` should not be equal to `key` whether recursively or not.
expectType<false>({} as IsEqual<{readonly a: 0} & {b: 0}, {a: 0; b: 0}>);
expectType<false>({} as IsEqual<{readonly aa: {a: 0} & {b: 0}}, {aa: {a: 0; b: 0}}>);
expectType<false>({} as IsEqual<{readonly aa: {a: 0} & {b: 0} | {a: 0} & {b: 0}}, {aa: {a: 0; b: 0}}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<false>({} as IsEqual<{aa: {a: 0} & {b: 0} | {a: 0} & {b: 0}}, {aa: {readonly a: 0; b: 0}}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// Assume that two lambdas `Parameters` and `ReturnType` are equal, `IsEqual` returns `true`.
type ArgumentsExpected = (a: {a: number}) => {b: number};
type ArgumentsIdenticalUnion = (a: {a: number} | {a: number}) => ({b: number} | {b: number}); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<ArgumentsIdenticalUnion, ArgumentsExpected>);
type ArgumentsIdenticalIntersection = (a: {a: number} & {a: number}) => ({b: number} & {b: number}); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<ArgumentsIdenticalIntersection, (a: {a: number}) => {b: number}>);
type ArgumentsDeepExpected = (a: {a: {b: number}}) => {b: {b: number}};
type ArgumentsIdenticalUnionDeep = (a: {a: {b: number} | {b: number}}) => {b: {b: number} | {b: number}}; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<ArgumentsIdenticalUnionDeep, ArgumentsDeepExpected>);
type ArgumentsIdenticalIntersectionDeep = (a: {a: {b: number} & {b: number}}) => {b: {b: number} & {b: number}}; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<ArgumentsIdenticalIntersectionDeep, ArgumentsDeepExpected>);

// Deep identical union/intersection in tuples.
type TupleDeepIdenticalExpected = {a: [{b: 0}]};
expectType<true>({} as IsEqual<{a: [{b: 0} | {b: 0}]} | {a: [{b: 0}]}, TupleDeepIdenticalExpected>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<true>({} as IsEqual<{a: [{b: 0} & {b: 0}]} | {a: [{b: 0}]}, TupleDeepIdenticalExpected>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
