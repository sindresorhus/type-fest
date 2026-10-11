import {expectTypeOf} from 'nz';
import type {RequiredKeysOf, UnknownRecord} from '../index.d.ts';

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

expectTypeOf(test1).toBe<'a'>();
expectTypeOf(test2).toBe<never>();
expectTypeOf(test3).toBe<'a' | 'b'>();

expectTypeOf<RequiredKeysOf<{readonly a: string; readonly b?: number; c: boolean; d?: string}>>().toBe<'a' | 'c'>();

// Unions
expectTypeOf<RequiredKeysOf<{a?: string; b: number} | {readonly c: string; readonly d?: number}>>().toBe<'b' | 'c'>();
expectTypeOf<RequiredKeysOf<{a?: string; b?: number} | {a: string; b: number}>>().toBe<'a' | 'b'>();

// Arrays
expectTypeOf<RequiredKeysOf<[]>>().toBe<keyof []>();
expectTypeOf<RequiredKeysOf<readonly [string, number, boolean]>>().toBe<keyof readonly [string, number, boolean]>();
expectTypeOf<RequiredKeysOf<[string, number?, boolean?]>>().toBe<Exclude<keyof [string, number?, boolean?], '1' | '2'>>();
expectTypeOf<RequiredKeysOf<[string?] | readonly [string, number?] | [string, number, boolean?]>>().toBe<Exclude<keyof [string, number, boolean?], '2'>>();

// `RequiredKeysOf<T>` should be assignable to `keyof T`
type Assignability1<T, _K extends keyof T> = unknown;
type Test1<T extends object> = Assignability1<T, RequiredKeysOf<T>>;

// `keyof T` should NOT be assignable to `RequiredKeysOf<T>`
type Assignability2<T extends object, _K extends RequiredKeysOf<T>> = unknown;
// @ts-expect-error
type Test2<T extends object> = Assignability2<T, keyof T>;

// `RequiredKeysOf<T>` should be assignable to `PropertyKey`
type Assignability3<_T, _K extends PropertyKey> = unknown;
type Test3<T extends object> = Assignability3<T, RequiredKeysOf<T>>;

// `PropertyKey` should NOT be assignable to `RequiredKeysOf<T>`
type Assignability4<T extends object, _K extends RequiredKeysOf<T>> = unknown;
// @ts-expect-error
type Test4<T extends object> = Assignability4<T, PropertyKey>;

// `RequiredKeysOf<T>` should be assignable to `keyof T` even when `T` is constrained to `Record<string, unknown>`
type Assignability5<T extends Record<string, unknown>, _K extends keyof T> = unknown;
type Test5<T extends Record<string, unknown>> = Assignability5<T, RequiredKeysOf<T>>;

// `RequiredKeysOf<T>` should be assignable to `keyof T` even when `T` is constrained to `object`
type Assignability6<T extends object, _K extends keyof T> = unknown;
type Test6<T extends object> = Assignability6<T, RequiredKeysOf<T>>;

// `RequiredKeysOf<T>` should be assignable to `keyof T` even when `T` is constrained to `UnknownRecord`
type Assignability7<T extends UnknownRecord, _K extends keyof T> = unknown;
type Test7<T extends UnknownRecord> = Assignability7<T, RequiredKeysOf<T>>;

// `keyof T` should NOT be assignable to `RequiredKeysOf<T>` even when `T` is constrained to `Record<string, unknown>`
type Assignability8<T extends Record<string, unknown>, _K extends RequiredKeysOf<T>> = unknown;
// @ts-expect-error
type Test8<T extends Record<string, unknown>> = Assignability8<T, keyof T>;

// `keyof T` should NOT be assignable to `RequiredKeysOf<T>` even when `T` is constrained to `object`
type Assignability9<T extends object, _K extends RequiredKeysOf<T>> = unknown;
// @ts-expect-error
type Test9<T extends object> = Assignability9<T, keyof T>;

// `keyof T` should NOT be assignable to `RequiredKeysOf<T>` even when `T` is constrained to `UnknownRecord`
type Assignability10<T extends UnknownRecord, _K extends RequiredKeysOf<T>> = unknown;
// @ts-expect-error
type Test10<T extends UnknownRecord> = Assignability10<T, keyof T>;

// Known limitation: an index signature is reported as a required key, because `Exclude<keyof Type, …>` puts it back. See the note in the docs.
declare const indexSignature: RequiredKeysOf<{[x: string]: unknown; a?: string}>;
expectTypeOf(indexSignature).toBe<string | number>();

declare const onlyIndexSignature: RequiredKeysOf<Record<string, unknown>>;
expectTypeOf(onlyIndexSignature).toBe<string>();

// A union reports the keys of each of its members, so the result can name a key that is not a key of the union itself. `keyof` of a union is the intersection of its members' keys, so `keyof` of the union below is `never` while the result is `'a' | 'b'`. See the note on unions in the docs.
expectTypeOf<RequiredKeysOf<{a: 1} | {b: 2}>>().toBe<'a' | 'b'>();
expectTypeOf<RequiredKeysOf<{a: 1; b: 2} | {a: 1}>>().toBe<'a' | 'b'>();
