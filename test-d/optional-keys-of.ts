import {expectType} from 'tsd';
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

expectType<'b'>(test1);
expectType<'a' | 'b'>(test2);
expectType<never>(test3);

expectType<'a' | 'c'>({} as OptionalKeysOf<{readonly a?: string; readonly b: number; c?: boolean; d: string}>);

// Unions
expectType<'b' | 'c'>({} as OptionalKeysOf<{a: string; b?: number} | {readonly c?: string; readonly d: number}>);
expectType<'a' | 'b'>({} as OptionalKeysOf<{a: string; b: number} | {a?: string; b?: number}>);

// Arrays
expectType<never>({} as OptionalKeysOf<[]>);
expectType<never>({} as OptionalKeysOf<readonly [string, number, boolean]>);
expectType<'1' | '2'>({} as OptionalKeysOf<[string, number?, boolean?]>);
expectType<'0' | '1' | '2'>({} as OptionalKeysOf<[string?] | readonly [string, number?] | [string, number, boolean?]>);
