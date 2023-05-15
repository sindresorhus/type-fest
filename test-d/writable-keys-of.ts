import {expectType} from 'tsd';
import type {WritableKeysOf} from '../index';

type TestType1 = {
	readonly a: string;
	b: boolean;
};

type TestType2 = {
	a: string;
	b: boolean;
};

type TestType3 = {
	readonly a: string;
	readonly b: boolean;
};

type WritableKeysOf1 = WritableKeysOf<TestType1>;
type WritableKeysOf2 = WritableKeysOf<TestType2>;
type WritableKeysOf3 = WritableKeysOf<TestType3>;

declare const test1: WritableKeysOf1;
declare const test2: WritableKeysOf2;
declare const test3: WritableKeysOf3;

expectType<'b'>(test1);
expectType<'a' | 'b'>(test2);
expectType<never>(test3);
