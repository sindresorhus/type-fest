import {expectType} from 'tsd';
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

expectType<'b'>(test1);
expectType<'a' | 'b'>(test2);
expectType<never>(test3);

expectType<'a' | 'c'>({} as WritableKeysOf<{a?: string; readonly b: number; c: boolean}>);
expectType<'c'>({} as WritableKeysOf<{readonly a?: string; readonly b: number; c: boolean}>);

// Unions
expectType<'b' | 'c'>({} as WritableKeysOf<{readonly a: string; b: number} | {c?: string; readonly d?: number}>);
expectType<'a' | 'b'>({} as WritableKeysOf<{readonly a: string; readonly b: number} | {a: string; b: number}>);

// Arrays
expectType<number | '0' | '1' | '2'>({} as Extract<WritableKeysOf<[string, number, boolean]>, number | `${number}`>);
expectType<never>({} as Extract<WritableKeysOf<readonly [string, number, boolean]>, number | `${number}`>);
expectType<number>({} as Extract<WritableKeysOf<string[]>, number | `${number}`>);
expectType<never>({} as Extract<WritableKeysOf<readonly string[]>, number | `${number}`>);

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
