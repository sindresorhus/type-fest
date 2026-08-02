import {expectType} from 'tsd';
import type {HasRequiredKeys} from '../index.d.ts';

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

type HasRequiredKeys1 = HasRequiredKeys<TestType1>;
type HasRequiredKeys2 = HasRequiredKeys<TestType2>;
type HasRequiredKeys3 = HasRequiredKeys<TestType3>;

declare const test1: HasRequiredKeys1;
declare const test2: HasRequiredKeys2;
declare const test3: HasRequiredKeys3;

expectType<true>(test1);
expectType<false>(test2);
expectType<true>(test3);
