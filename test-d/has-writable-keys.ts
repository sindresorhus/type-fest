import {expectTypeOf} from 'nz';
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

expectTypeOf(test1).toBe<true>();
expectTypeOf(test2).toBe<false>();
expectTypeOf(test3).toBe<true>();

// A readonly index signature must not swallow the writable named keys next to it
expectTypeOf<HasWritableKeys<{readonly [key: string]: unknown; id: number}>>().toBe<true>();
expectTypeOf<HasWritableKeys<{readonly [key: string]: unknown; readonly id: number}>>().toBe<false>();

expectTypeOf<HasWritableKeys<any>>().toBe<true>();
