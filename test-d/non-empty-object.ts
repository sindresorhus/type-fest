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

type TestType5 = {
	[key: string]: string | number | undefined;
};

type TestType6 = {
	name: string;
	[key: string]: unknown;
};

declare const test1: NonEmptyObject<TestType1>;
declare const test2: NonEmptyObject<TestType2>;
declare const test3: NonEmptyObject<TestType3>;
declare const test4: NonEmptyObject<TestType4>;
declare const test5: NonEmptyObject<TestType5>;
declare const test6: NonEmptyObject<TestType6>;

expectType<TestType1>(test1);
expectType<RequireAtLeastOne<TestType2>>(test2);
expectType<TestType3>(test3);
expectNever(test4);
expectNever(test5);
expectType<TestType6>(test6);
