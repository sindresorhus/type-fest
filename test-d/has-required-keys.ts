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

expectTypeOf<HasRequiredKeys<{}>>().toBe<false>();
expectTypeOf<HasRequiredKeys<object>>().toBe<false>();
expectTypeOf<HasRequiredKeys<any>>().toBe<false>();
expectTypeOf<HasRequiredKeys<never>>().toBe<false>();

// @ts-expect-error
type Unknown = HasRequiredKeys<unknown>;

// Index signatures
expectTypeOf<HasRequiredKeys<Record<string, unknown>>>().toBe<false>();
expectTypeOf<HasRequiredKeys<{[key: number]: string}>>().toBe<false>();
expectTypeOf<HasRequiredKeys<{[key: string]: unknown; a?: string}>>().toBe<false>();
expectTypeOf<HasRequiredKeys<{[key: string]: unknown; a: string}>>().toBe<true>();

// Arrays
expectTypeOf<HasRequiredKeys<[]>>().toBe<false>();
expectTypeOf<HasRequiredKeys<[number?]>>().toBe<false>();
expectTypeOf<HasRequiredKeys<readonly string[]>>().toBe<false>();
expectTypeOf<HasRequiredKeys<[number, string?]>>().toBe<true>();
expectTypeOf<HasRequiredKeys<[string, ...number[]]>>().toBe<true>();
expectTypeOf<HasRequiredKeys<readonly [...number[], string]>>().toBe<true>();

// Unions
expectTypeOf<HasRequiredKeys<{a?: string} | {b: number}>>().toBe<true>();
expectTypeOf<HasRequiredKeys<[number?] | {a?: string}>>().toBe<false>();
expectTypeOf<HasRequiredKeys<[number] | {a?: string}>>().toBe<true>();
