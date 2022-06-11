import {expectType} from 'tsd';
import type {HasRequiredKeys, RequiredKeysOf} from '../index';

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

type HasRequiredKeys1 = HasRequiredKeys<TestType1>;
type HasRequiredKeys2 = HasRequiredKeys<TestType2>;
type HasRequiredKeys3 = HasRequiredKeys<TestType3>;

declare const test1: RequiredKeysOf1;
declare const test2: RequiredKeysOf2;
declare const test3: RequiredKeysOf3;

declare const test4: HasRequiredKeys1;
declare const test5: HasRequiredKeys2;
declare const test6: HasRequiredKeys3;

expectType<'a'>(test1);
expectType<never>(test2);
expectType<'a' | 'b'>(test3);

expectType<true>(test4);
expectType<false>(test5);
expectType<true>(test6);
