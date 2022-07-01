import {expectType} from 'tsd';
import type {RequiredKeysOf} from '../index';

type TestType1 = {
	a: string;
	b?: boolean;
};

type TestType2 = {
	a?: string;
	b?: boolean;
};

type TestType3 = {
	a: string;
	b: boolean;
};

type RequiredKeysOf1 = RequiredKeysOf<TestType1>;
type RequiredKeysOf2 = RequiredKeysOf<TestType2>;
type RequiredKeysOf3 = RequiredKeysOf<TestType3>;

declare const test1: RequiredKeysOf1;
declare const test2: RequiredKeysOf2;
declare const test3: RequiredKeysOf3;

expectType<'a'>(test1);
expectType<never>(test2);
expectType<'a' | 'b'>(test3);
