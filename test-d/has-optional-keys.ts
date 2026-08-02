import {expectType} from 'tsd';
import type {HasOptionalKeys} from '../index.d.ts';

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

type HasOptionalKeys1 = HasOptionalKeys<TestType1>;
type HasOptionalKeys2 = HasOptionalKeys<TestType2>;
type HasOptionalKeys3 = HasOptionalKeys<TestType3>;

declare const test1: HasOptionalKeys1;
declare const test2: HasOptionalKeys2;
declare const test3: HasOptionalKeys3;

expectType<true>(test1);
expectType<true>(test2);
expectType<false>(test3);
