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

type TestTypeWithIndexSignature = {
	[x: string]: string;
};

type TestTypeWithOptionalIndexSignature = {
	[x: string]: string;
	a?: string;
};

type TestTypeWithRequiredKeyAndIndexSignature = {
	[x: string]: string;
	a: string;
};

declare const test1: NonEmptyObject<TestType1>;
declare const test2: NonEmptyObject<TestType2>;
declare const test3: NonEmptyObject<TestType3>;
declare const test4: NonEmptyObject<TestType4>;
declare const test5: NonEmptyObject<TestTypeWithOptionalIndexSignature>;
declare const test6: NonEmptyObject<TestTypeWithRequiredKeyAndIndexSignature>;

expectType<TestType1>(test1);
expectType<RequireAtLeastOne<TestType2>>(test2);
expectType<TestType3>(test3);
expectNever(test4);

// Index-signature-only types should route through RequireAtLeastOne
// (RequireAtLeastOne itself has a known limitation with pure index signatures)
expectType<RequireAtLeastOne<TestTypeWithIndexSignature>>({} as NonEmptyObject<TestTypeWithIndexSignature>);

// Types with optional keys + index signature should also be non-empty
expectType<RequireAtLeastOne<TestTypeWithOptionalIndexSignature>>(test5);

// Types with explicit required keys + index signature pass through
expectType<TestTypeWithRequiredKeyAndIndexSignature>(test6);
