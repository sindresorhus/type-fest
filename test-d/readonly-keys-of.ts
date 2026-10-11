import {expectTypeOf} from 'nz';
import type {ReadonlyKeysOf, UnknownRecord} from '../index.d.ts';

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

expectTypeOf(test1).toBe<'b'>();
expectTypeOf(test2).toBe<'a' | 'b'>();
expectTypeOf(test3).toBe<never>();

expectTypeOf<ReadonlyKeysOf<{readonly a?: string; b: number; readonly c: boolean}>>().toBe<'a' | 'c'>();
expectTypeOf<ReadonlyKeysOf<{a?: string; b: number; readonly c: boolean}>>().toBe<'c'>();

// Unions
expectTypeOf<ReadonlyKeysOf<{a: string; readonly b: number} | {readonly c?: string; d?: number}>>().toBe<'b' | 'c'>();
expectTypeOf<ReadonlyKeysOf<{a: string; b: number} | {readonly a: string; readonly b: number}>>().toBe<'a' | 'b'>();

// Arrays
expectTypeOf<Extract<ReadonlyKeysOf<[string, number, boolean]>, number | `${number}`>>().toBe<never>();
expectTypeOf<Extract<ReadonlyKeysOf<readonly [string, number, boolean]>, number | `${number}`>>().toBe<number | '0' | '1' | '2'>();
expectTypeOf<Extract<ReadonlyKeysOf<string[]>, number | `${number}`>>().toBe<never>();
expectTypeOf<Extract<ReadonlyKeysOf<readonly string[]>, number | `${number}`>>().toBe<number>();

// `ReadonlyKeysOf<T>` should be assignable to `keyof T`
type Assignability1<T, _K extends keyof T> = unknown;
type Test1<T extends object> = Assignability1<T, ReadonlyKeysOf<T>>;

// `keyof T` should NOT be assignable to `ReadonlyKeysOf<T>`
type Assignability2<T extends object, _K extends ReadonlyKeysOf<T>> = unknown;
// @ts-expect-error
type Test2<T extends object> = Assignability2<T, keyof T>;

// `ReadonlyKeysOf<T>` should be assignable to `PropertyKey`
type Assignability3<_T, _K extends PropertyKey> = unknown;
type Test3<T extends object> = Assignability3<T, ReadonlyKeysOf<T>>;

// `PropertyKey` should NOT be assignable to `ReadonlyKeysOf<T>`
type Assignability4<T extends object, _K extends ReadonlyKeysOf<T>> = unknown;
// @ts-expect-error
type Test4<T extends object> = Assignability4<T, PropertyKey>;

// `ReadonlyKeysOf<T>` should be assignable to `keyof T` even when `T` is constrained to `Record<string, unknown>`
type Assignability5<T extends Record<string, unknown>, _K extends keyof T> = unknown;
type Test5<T extends Record<string, unknown>> = Assignability5<T, ReadonlyKeysOf<T>>;

// `ReadonlyKeysOf<T>` should be assignable to `keyof T` even when `T` is constrained to `object`
type Assignability6<T extends object, _K extends keyof T> = unknown;
type Test6<T extends object> = Assignability6<T, ReadonlyKeysOf<T>>;

// `ReadonlyKeysOf<T>` should be assignable to `keyof T` even when `T` is constrained to `UnknownRecord`
type Assignability7<T extends UnknownRecord, _K extends keyof T> = unknown;
type Test7<T extends UnknownRecord> = Assignability7<T, ReadonlyKeysOf<T>>;

// `keyof T` should NOT be assignable to `ReadonlyKeysOf<T>` even when `T` is constrained to `Record<string, unknown>`
type Assignability8<T extends Record<string, unknown>, _K extends ReadonlyKeysOf<T>> = unknown;
// @ts-expect-error
type Test8<T extends Record<string, unknown>> = Assignability8<T, keyof T>;

// `keyof T` should NOT be assignable to `ReadonlyKeysOf<T>` even when `T` is constrained to `object`
type Assignability9<T extends object, _K extends ReadonlyKeysOf<T>> = unknown;
// @ts-expect-error
type Test9<T extends object> = Assignability9<T, keyof T>;

// `keyof T` should NOT be assignable to `ReadonlyKeysOf<T>` even when `T` is constrained to `UnknownRecord`
type Assignability10<T extends UnknownRecord, _K extends ReadonlyKeysOf<T>> = unknown;
// @ts-expect-error
type Test10<T extends UnknownRecord> = Assignability10<T, keyof T>;

// @ts-expect-error
type AllowsOnlyObjects = ReadonlyKeysOf<string>;

// A union reports the keys of each of its members, so the result can name a key that is not a key of the union itself. `keyof` of a union is the intersection of its members' keys, so `keyof` of the union below is `never` while the result is `'a' | 'b'`. See the note on unions in the docs.
expectTypeOf<ReadonlyKeysOf<{readonly a: 1} | {readonly b: 2}>>().toBe<'a' | 'b'>();
expectTypeOf<ReadonlyKeysOf<{readonly a: 1; readonly b: 2} | {readonly a: 1; c: 3}>>().toBe<'a' | 'b'>();
