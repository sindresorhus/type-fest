import {expectType} from 'tsd';
import type {IsEqual} from '../index.d.ts';
import type {BuildTuple} from '../source/internal/index.d.ts';

expectType<false>({} as IsEqual<number, string>);
expectType<true>({} as IsEqual<1, 1>);
expectType<false>({} as IsEqual<any, number>);
expectType<false>({} as IsEqual<1 | 2, 1>);
expectType<false>({} as IsEqual<any, never>);
expectType<false>({} as IsEqual<[any], [never]>);
expectType<true>({} as IsEqual<never, never>);
expectType<true>({} as IsEqual<[never], [never]>);
expectType<true>({} as IsEqual<[], []>);
expectType<true>({} as IsEqual<readonly [], readonly []>);
expectType<false>({} as IsEqual<readonly [], []>);
expectType<true>({} as IsEqual<number[], number[]>);
expectType<true>({} as IsEqual<readonly number[], readonly number[]>);
expectType<false>({} as IsEqual<readonly number[], number[]>);
expectType<false>({} as IsEqual<[0, 1] | [0, 2], [0, 2]>);

type LongTupleNumber = BuildTuple<50, 0>;
expectType<true>({} as IsEqual<LongTupleNumber, LongTupleNumber>);

type ReadonlyLongTupleNumber = Readonly<BuildTuple<50, 0>>;
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

type OverloadFunction = {
	(fullName: string): string;
	(firstName: string, lastName: string): string;
};
// [T] & [T] is not simplified in TypeScript, so this test may fail depending on the definition of IsEqual.
type InferOverloadFunction = OverloadFunction extends infer F ? F extends (0 extends 0 ? F : 1) ? [F] : 2 : 3;
type expectTrueIntersectionOverloadFunction = IsEqual<[OverloadFunction] & [OverloadFunction], InferOverloadFunction>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
declare const equalTrueIntersectionOverloadFunction: expectTrueIntersectionOverloadFunction;
expectType<true>(equalTrueIntersectionOverloadFunction);

type OverloadFunctionStringArrayReturn = {
	(s: string): string[];
	(ss: string[]): string[];
};
// [T] & [T] is not simplified in TypeScript, so this test may fail depending on the definition of IsEqual.
type InferOverloadFunctionStringArrayReturn = OverloadFunctionStringArrayReturn extends infer F ? F extends (0 extends 0 ? F : 1) ? [F] : 2 : 3;
type expectTrueIntersectionOverloadFunctionStringArrayReturn = IsEqual<[OverloadFunctionStringArrayReturn] & [OverloadFunctionStringArrayReturn], InferOverloadFunctionStringArrayReturn>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
declare const equalTrueIntersectionOverloadFunctionStringArrayReturn: expectTrueIntersectionOverloadFunctionStringArrayReturn;
expectType<true>(equalTrueIntersectionOverloadFunctionStringArrayReturn);

type OverloadFunctionSomeTypeReturn = {
	<T>(value: T): T;
	<T>(value: T[]): T[];
};
// [T] & [T] is not simplified in TypeScript, so this test may fail depending on the definition of IsEqual.
type InferOverloadFunctionSomeTypeReturn = OverloadFunctionSomeTypeReturn extends infer F ? F extends (0 extends 0 ? F : 1) ? [F] : 2 : 3;
type expectTrueIntersectionOverloadFunctionSomeTypeReturn = IsEqual<[OverloadFunctionSomeTypeReturn] & [OverloadFunctionSomeTypeReturn], InferOverloadFunctionSomeTypeReturn>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
declare const equalTrueIntersectionOverloadFunctionSomeTypeReturn: expectTrueIntersectionOverloadFunctionSomeTypeReturn;
expectType<true>(equalTrueIntersectionOverloadFunctionSomeTypeReturn);
