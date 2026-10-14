import {expectTypeOf} from 'nz';
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

expectTypeOf(test1).toBe<TestType1>();
expectTypeOf(test2).toBe<RequireAtLeastOne<TestType2>>();
expectTypeOf(test3).toBe<TestType3>();
expectTypeOf(test4).toBe<never>();

// Unions are checked member by member, since `keyof` only sees the shared keys of a union.
declare const testUnion: NonEmptyObject<TestType2 | {c?: symbol}>;
expectTypeOf(testUnion).toBe<RequireAtLeastOne<TestType2, 'a' | 'b'> | RequireAtLeastOne<{c?: symbol}, 'c'>>();
({a: 1}) satisfies NonEmptyObject<{a?: 1} | {b?: 2}>;
({b: 2}) satisfies NonEmptyObject<{a?: 1} | {b?: 2}>;

// Known limitation: an index signature counts as a required key, so a type with one accepts an empty object. This keeps a dictionary usable, since every non-empty value of it is accepted.
({}) satisfies NonEmptyObject<Record<string, unknown>>;
({a: 1}) satisfies NonEmptyObject<Record<string, unknown>>;
({a: 1, b: 2}) satisfies NonEmptyObject<{[k: string]: number | undefined; a?: number}>;
expectTypeOf<NonEmptyObject<Record<string, number>>>().toBe<Record<string, number>>();
expectTypeOf<NonEmptyObject<string[]>>().toBe<string[]>();
