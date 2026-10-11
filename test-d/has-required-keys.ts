import {expectTypeOf} from 'nz';
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

expectTypeOf(test1).toBe<true>();
expectTypeOf(test2).toBe<false>();
expectTypeOf(test3).toBe<true>();
