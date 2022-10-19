import {expectTypeOf} from 'expect-type';
import type {OptionalKeysOf} from '../index';

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

declare const test1: OptionalKeysOf1;
declare const test2: OptionalKeysOf2;
declare const test3: OptionalKeysOf3;

expectTypeOf(test1).toEqualTypeOf<'b'>();
expectTypeOf(test2).toEqualTypeOf<'a' | 'b'>();
expectTypeOf(test3).toEqualTypeOf<never>();
