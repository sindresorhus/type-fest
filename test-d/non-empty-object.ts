import {expectType} from 'tsd';
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

type NonEmptyObject1 = NonEmptyObject<TestType1>;
type NonEmptyObject2 = NonEmptyObject<TestType2>;
type NonEmptyObject3 = NonEmptyObject<TestType3>;
type NonEmptyObject4 = NonEmptyObject<TestType4>;

declare const test1: NonEmptyObject1;
declare const test2: NonEmptyObject2;
declare const test3: NonEmptyObject3;
declare const test4: NonEmptyObject4;

expectType<TestType1>(test1);
expectType<{a: string; b?: boolean}|{a?: string; b: boolean}>(test2);
expectType<TestType3|{a?: string; b: boolean}>(test3);
expectType<never>(test4);
