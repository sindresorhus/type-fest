import {expectAssignable, expectNever, expectType} from 'tsd';
import type {NonEmptyObject, RequireAtLeastOne} from '../index.d.ts';

type TestType1 = {
	a: string;
	b: boolean;
};

type TestType2 = {
	a?: string;
	b?: boolean;
};

type TestType3 = {
	a: string;
	b?: boolean;
};

type TestType4 = {};

declare const test1: NonEmptyObject<TestType1>;
declare const test2: NonEmptyObject<TestType2>;
declare const test3: NonEmptyObject<TestType3>;
declare const test4: NonEmptyObject<TestType4>;

expectType<TestType1>(test1);
expectType<RequireAtLeastOne<TestType2>>(test2);
expectType<TestType3>(test3);
expectNever(test4);

// Unions are checked member by member, since `keyof` only sees the shared keys of a union.
declare const testUnion: NonEmptyObject<TestType2 | {c?: symbol}>;
expectType<RequireAtLeastOne<TestType2, 'a' | 'b'> | RequireAtLeastOne<{c?: symbol}, 'c'>>(testUnion);
expectAssignable<NonEmptyObject<{a?: 1} | {b?: 2}>>({a: 1});
expectAssignable<NonEmptyObject<{a?: 1} | {b?: 2}>>({b: 2});

// Known limitation: an index signature counts as a required key, so a type with one accepts an empty object. This keeps a dictionary usable, since every non-empty value of it is accepted.
expectAssignable<NonEmptyObject<Record<string, unknown>>>({});
expectAssignable<NonEmptyObject<Record<string, unknown>>>({a: 1});
expectAssignable<NonEmptyObject<{[k: string]: number | undefined; a?: number}>>({a: 1, b: 2});
