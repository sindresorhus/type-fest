import {expectType} from 'tsd';
import type {ReadonlyKeysOf} from '../index';

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

type ReadonlyKeysOf1 = ReadonlyKeysOf<TestType1>;
type ReadonlyKeysOf2 = ReadonlyKeysOf<TestType2>;
type ReadonlyKeysOf3 = ReadonlyKeysOf<TestType3>;

declare const test1: ReadonlyKeysOf1;
declare const test2: ReadonlyKeysOf2;
declare const test3: ReadonlyKeysOf3;

expectType<'b'>(test1);
expectType<'a' | 'b'>(test2);
expectType<never>(test3);

expectType<'a' | 'c'>({} as ReadonlyKeysOf<{readonly a?: string; b: number; readonly c: boolean}>);
expectType<'c'>({} as ReadonlyKeysOf<{a?: string; b: number; readonly c: boolean}>);

// Unions
expectType<'b' | 'c'>({} as ReadonlyKeysOf<{a: string; readonly b: number} | {readonly c?: string; d?: number}>);
expectType<'a' | 'b'>({} as ReadonlyKeysOf<{a: string; b: number} | {readonly a: string; readonly b: number}>);

// TODO: Uncomment when targeting TypeScript 5.3 or later.
// Arrays
// expectType<never>({} as Extract<ReadonlyKeysOf<[string, number, boolean]>, number | `${number}`>);
// expectType<number | '0' | '1' | '2'>({} as Extract<ReadonlyKeysOf<readonly [string, number, boolean]>, number | `${number}`>);
// expectType<never>({} as Extract<ReadonlyKeysOf<string[]>, number | `${number}`>);
// expectType<number>({} as Extract<ReadonlyKeysOf<readonly string[]>, number | `${number}`>);
