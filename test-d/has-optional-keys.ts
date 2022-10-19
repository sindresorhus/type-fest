import {expectTypeOf} from 'expect-type';
import type {HasOptionalKeys} from '../index';

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

expectTypeOf(test1).toEqualTypeOf<true>();
expectTypeOf(test2).toEqualTypeOf<true>();
expectTypeOf(test3).toEqualTypeOf<false>();
