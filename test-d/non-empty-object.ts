import {expectType, expectNever} from 'tsd';
import type {NonEmptyObject} from '../index';

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
expectType<{a: string; b?: boolean} | {a?: string; b: boolean}>(test2);
expectType<TestType3 | {a?: string; b: boolean}>(test3);
expectNever(test4);
