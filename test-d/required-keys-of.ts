import {expectType} from 'tsd';
import type {RequiredKeysOf} from '../index';

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

type RequiredKeysOf1 = RequiredKeysOf<TestType1>;
type RequiredKeysOf2 = RequiredKeysOf<TestType2>;
type RequiredKeysOf3 = RequiredKeysOf<TestType3>;

declare const test1: RequiredKeysOf1;
declare const test2: RequiredKeysOf2;
declare const test3: RequiredKeysOf3;

expectType<'a'>(test1);
expectType<never>(test2);
expectType<'a' | 'b'>(test3);

expectType<'a' | 'c'>({} as RequiredKeysOf<{readonly a: string; readonly b?: number; c: boolean; d?: string}>);

// Unions
expectType<'b' | 'c'>({} as RequiredKeysOf<{a?: string; b: number} | {readonly c: string; readonly d?: number}>);
expectType<'a' | 'b'>({} as RequiredKeysOf<{a?: string; b?: number} | {a: string; b: number}>);

// Arrays
expectType<keyof []>({} as RequiredKeysOf<[]>);
expectType<keyof readonly [string, number, boolean]>({} as RequiredKeysOf<readonly [string, number, boolean]>);
expectType<Exclude<keyof [string, number?, boolean?], '1' | '2'>>({} as RequiredKeysOf<[string, number?, boolean?]>);
expectType<Exclude<keyof [string, number, boolean?], '2'>>({} as RequiredKeysOf<[string?] | readonly [string, number?] | [string, number, boolean?]>);
