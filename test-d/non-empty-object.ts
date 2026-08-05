import {expectNever, expectType} from 'tsd';
import type {NonEmptyObject, RequireAtLeastOne} from '../index.d.ts';

type TestType1 = {
	a: string;
	b: boolean;
};

type TestType2 = {
	a?: string;
	b?: boolean;
};

type TestType3 = {
	a: string;
	b?: boolean;
};

type TestType4 = {};

declare const test1: NonEmptyObject<TestType1>;
declare const test2: NonEmptyObject<TestType2>;
declare const test3: NonEmptyObject<TestType3>;
declare const test4: NonEmptyObject<TestType4>;

expectType<TestType1>(test1);
expectType<RequireAtLeastOne<TestType2>>(test2);
expectType<TestType3>(test3);
expectNever(test4);

// Regression: pure index signatures should resolve to `never`,
// preventing {} from being silently accepted.
// See: https://github.com/sindresorhus/type-fest/issues/821
type PureIndexSignature = {[argument: string]: string | number | undefined};
type NestedIndexSignature = {[filter: string]: NonEmptyObject<{[argument: string]: string | number | undefined}>};

declare const testIndexOnly: NonEmptyObject<PureIndexSignature>;
expectNever(testIndexOnly);

// @ts-expect-error - {} must NOT be assignable to NonEmptyObject<PureIndexSignature>
const _badPure: NonEmptyObject<PureIndexSignature> = {};

// @ts-expect-error - {} must NOT be assignable to the nested NonEmptyObject
const _badNested: NestedIndexSignature = {foo: {}};
