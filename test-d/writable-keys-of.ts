import {expectTypeOf} from 'nz';
import type {UnknownRecord, WritableKeysOf} from '../index.d.ts';

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

expectTypeOf(test1).toBe<'b'>();
expectTypeOf(test2).toBe<'a' | 'b'>();
expectTypeOf(test3).toBe<never>();

expectTypeOf<WritableKeysOf<{a?: string; readonly b: number; c: boolean}>>().toBe<'a' | 'c'>();
expectTypeOf<WritableKeysOf<{readonly a?: string; readonly b: number; c: boolean}>>().toBe<'c'>();

// Unions
expectTypeOf<WritableKeysOf<{readonly a: string; b: number} | {c?: string; readonly d?: number}>>().toBe<'b' | 'c'>();
expectTypeOf<WritableKeysOf<{readonly a: string; readonly b: number} | {a: string; b: number}>>().toBe<'a' | 'b'>();

// Arrays
expectTypeOf<Extract<WritableKeysOf<[string, number, boolean]>, number | `${number}`>>().toBe<number | '0' | '1' | '2'>();
expectTypeOf<Extract<WritableKeysOf<readonly [string, number, boolean]>, number | `${number}`>>().toBe<never>();
expectTypeOf<Extract<WritableKeysOf<string[]>, number | `${number}`>>().toBe<number>();
expectTypeOf<Extract<WritableKeysOf<readonly string[]>, number | `${number}`>>().toBe<never>();

// `WritableKeysOf<T>` should be assignable to `keyof T`
type Assignability1<T, _K extends keyof T> = unknown;
type Test1<T extends object> = Assignability1<T, WritableKeysOf<T>>;

// `keyof T` should NOT be assignable to `WritableKeysOf<T>`
type Assignability2<T extends object, _K extends WritableKeysOf<T>> = unknown;
// @ts-expect-error
type Test2<T extends object> = Assignability2<T, keyof T>;

// `WritableKeysOf<T>` should be assignable to `PropertyKey`
type Assignability3<_T, _K extends PropertyKey> = unknown;
type Test3<T extends object> = Assignability3<T, WritableKeysOf<T>>;

// `PropertyKey` should NOT be assignable to `WritableKeysOf<T>`
type Assignability4<T extends object, _K extends WritableKeysOf<T>> = unknown;
// @ts-expect-error
type Test4<T extends object> = Assignability4<T, PropertyKey>;

// `WritableKeysOf<T>` should be assignable to `keyof T` even when `T` is constrained to `Record<string, unknown>`
type Assignability5<T extends Record<string, unknown>, _K extends keyof T> = unknown;
type Test5<T extends Record<string, unknown>> = Assignability5<T, WritableKeysOf<T>>;

// `WritableKeysOf<T>` should be assignable to `keyof T` even when `T` is constrained to `object`
type Assignability6<T extends object, _K extends keyof T> = unknown;
type Test6<T extends object> = Assignability6<T, WritableKeysOf<T>>;

// `WritableKeysOf<T>` should be assignable to `keyof T` even when `T` is constrained to `UnknownRecord`
type Assignability7<T extends UnknownRecord, _K extends keyof T> = unknown;
type Test7<T extends UnknownRecord> = Assignability7<T, WritableKeysOf<T>>;

// `keyof T` should NOT be assignable to `WritableKeysOf<T>` even when `T` is constrained to `Record<string, unknown>`
type Assignability8<T extends Record<string, unknown>, _K extends WritableKeysOf<T>> = unknown;
// @ts-expect-error
type Test8<T extends Record<string, unknown>> = Assignability8<T, keyof T>;

// `keyof T` should NOT be assignable to `WritableKeysOf<T>` even when `T` is constrained to `object`
type Assignability9<T extends object, _K extends WritableKeysOf<T>> = unknown;
// @ts-expect-error
type Test9<T extends object> = Assignability9<T, keyof T>;

// `keyof T` should NOT be assignable to `WritableKeysOf<T>` even when `T` is constrained to `UnknownRecord`
type Assignability10<T extends UnknownRecord, _K extends WritableKeysOf<T>> = unknown;
// @ts-expect-error
type Test10<T extends UnknownRecord> = Assignability10<T, keyof T>;

// @ts-expect-error
type AllowsOnlyObjects = WritableKeysOf<string>;

// Known limitation: an index signature is reported as a writable key, for the same reason `RequiredKeysOf` reports it as a required key. See the note in that type's docs.
declare const indexSignature: WritableKeysOf<{[k: string]: string; readonly a: string}>;
expectTypeOf(indexSignature).toBe<string | number>();

declare const onlyIndexSignature: WritableKeysOf<{[k: string]: string}>;
expectTypeOf(onlyIndexSignature).toBe<string | number>();

// A readonly index signature is not a writable key, and it must not swallow the writable named keys next to it
expectTypeOf<WritableKeysOf<{readonly [key: string]: string; readonly a: string}>>().toBe<never>();
expectTypeOf<WritableKeysOf<{readonly [key: string]: unknown; id: number}>>().toBe<'id'>();
expectTypeOf<WritableKeysOf<{readonly [key: string]: unknown; a: string; b?: string}>>().toBe<'a' | 'b'>();

// A union reports the keys of each of its members, so the result can name a key that is not a key of the union itself. `keyof` of a union is the intersection of its members' keys, so `keyof` of the union below is `never` while the result is `'a' | 'b'`. See the note on unions in the docs.
expectTypeOf<WritableKeysOf<{a: 1} | {b: 2}>>().toBe<'a' | 'b'>();
expectTypeOf<WritableKeysOf<{a: 1; b: 2} | {a: 1}>>().toBe<'a' | 'b'>();

// `any` has every key, and none of them are readonly, consistent with `RequiredKeysOf<any>`
expectTypeOf<WritableKeysOf<any>>().toBe<string | number | symbol>();
