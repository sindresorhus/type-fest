import {expectType} from 'tsd';
import type {WritableKeysOf} from '../index';

type TestType1 = {
	readonly a: string;
	b: boolean;
};

type TestType2 = {
	a: string;
	b: boolean;
};

type TestType3 = {
	readonly a: string;
	readonly b: boolean;
};

type WritableKeysOf1 = WritableKeysOf<TestType1>;
type WritableKeysOf2 = WritableKeysOf<TestType2>;
type WritableKeysOf3 = WritableKeysOf<TestType3>;

declare const test1: WritableKeysOf1;
declare const test2: WritableKeysOf2;
declare const test3: WritableKeysOf3;

expectType<'b'>(test1);
expectType<'a' | 'b'>(test2);
expectType<never>(test3);

expectType<'a' | 'c'>({} as WritableKeysOf<{a?: string; readonly b: number; c: boolean}>);
expectType<'c'>({} as WritableKeysOf<{readonly a?: string; readonly b: number; c: boolean}>);

// Unions
expectType<'b' | 'c'>({} as WritableKeysOf<{readonly a: string; b: number} | {c?: string; readonly d?: number}>);

// Arrays
// expectType<number | '0' | '1' | '2'>({} as Extract<WritableKeysOf<[string, number, boolean]>, number | `${number}`>);
// expectType<never>({} as Extract<WritableKeysOf<readonly [string, number, boolean]>, number | `${number}`>);
// expectType<number>({} as Extract<WritableKeysOf<string[]>, number | `${number}`>);
// expectType<never>({} as Extract<WritableKeysOf<readonly string[]>, number | `${number}`>);
