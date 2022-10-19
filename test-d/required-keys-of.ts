import {expectTypeOf} from 'expect-type';
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

expectTypeOf(test1).toEqualTypeOf<'a'>();
expectTypeOf(test2).toEqualTypeOf<never>();
expectTypeOf(test3).toEqualTypeOf<'a' | 'b'>();
