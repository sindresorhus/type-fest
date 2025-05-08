import {expectType} from 'tsd';
import type {HasReadonlyKeys} from '../index.d.ts';

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

type HasReadonlyKeys1 = HasReadonlyKeys<TestType1>;
type HasReadonlyKeys2 = HasReadonlyKeys<TestType2>;
type HasReadonlyKeys3 = HasReadonlyKeys<TestType3>;

declare const test1: HasReadonlyKeys1;
declare const test2: HasReadonlyKeys2;
declare const test3: HasReadonlyKeys3;

expectType<true>(test1);
expectType<true>(test2);
expectType<false>(test3);
