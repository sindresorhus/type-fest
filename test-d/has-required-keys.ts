import {expectTypeOf} from 'expect-type';
import type {HasRequiredKeys} from '../index';

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

expectTypeOf(test1).toEqualTypeOf<true>();
expectTypeOf(test2).toEqualTypeOf<false>();
expectTypeOf(test3).toEqualTypeOf<true>();
