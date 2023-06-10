import {expectType} from 'tsd';
import type {ReadonlyKeysOf} from '../index';

type TestType1 = {
	a: string;
	readonly b: boolean;
};

type TestType2 = {
	readonly a: string;
	readonly b: boolean;
};

type TestType3 = {
	a: string;
	b: boolean;
};

type ReadonlyKeysOf1 = ReadonlyKeysOf<TestType1>;
type ReadonlyKeysOf2 = ReadonlyKeysOf<TestType2>;
type ReadonlyKeysOf3 = ReadonlyKeysOf<TestType3>;

declare const test1: ReadonlyKeysOf1;
declare const test2: ReadonlyKeysOf2;
declare const test3: ReadonlyKeysOf3;

expectType<'b'>(test1);
expectType<'a' | 'b'>(test2);
expectType<never>(test3);
