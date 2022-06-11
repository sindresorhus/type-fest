import {expectType} from 'tsd';
import type {HasOptionalKeys, OptionalKeysOf} from '../index';

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

type OptionalKeysOf1 = OptionalKeysOf<TestType1>;
type OptionalKeysOf2 = OptionalKeysOf<TestType2>;
type OptionalKeysOf3 = OptionalKeysOf<TestType3>;

type HasOptionalKeys1 = HasOptionalKeys<TestType1>;
type HasOptionalKeys2 = HasOptionalKeys<TestType2>;
type HasOptionalKeys3 = HasOptionalKeys<TestType3>;

declare const test1: OptionalKeysOf1;
declare const test2: OptionalKeysOf2;
declare const test3: OptionalKeysOf3;

declare const test4: HasOptionalKeys1;
declare const test5: HasOptionalKeys2;
declare const test6: HasOptionalKeys3;

expectType<'b'>(test1);
expectType<'a' | 'b'>(test2);
expectType<never>(test3);

expectType<true>(test4);
expectType<true>(test5);
expectType<false>(test6);
