import {expectType} from 'tsd';
import type {HasWritableKeys} from '../index.d.ts';

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

type HasWritableKeys1 = HasWritableKeys<TestType1>;
type HasWritableKeys2 = HasWritableKeys<TestType2>;
type HasWritableKeys3 = HasWritableKeys<TestType3>;

declare const test1: HasWritableKeys1;
declare const test2: HasWritableKeys2;
declare const test3: HasWritableKeys3;

expectType<true>(test1);
expectType<false>(test2);
expectType<true>(test3);
