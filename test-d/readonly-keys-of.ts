import {expectType} from 'tsd';
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

expectType<'b'>(test1);
expectType<'a' | 'b'>(test2);
expectType<never>(test3);

expectType<'a' | 'c'>({} as ReadonlyKeysOf<{readonly a?: string; b: number; readonly c: boolean}>);
expectType<'c'>({} as ReadonlyKeysOf<{a?: string; b: number; readonly c: boolean}>);

// Unions
expectType<'b' | 'c'>({} as ReadonlyKeysOf<{a: string; readonly b: number} | {readonly c?: string; d?: number}>);
expectType<'a' | 'b'>({} as ReadonlyKeysOf<{a: string; b: number} | {readonly a: string; readonly b: number}>);

// Arrays
expectType<never>({} as Extract<ReadonlyKeysOf<[string, number, boolean]>, number | `${number}`>);
expectType<number | '0' | '1' | '2'>({} as Extract<ReadonlyKeysOf<readonly [string, number, boolean]>, number | `${number}`>);
expectType<never>({} as Extract<ReadonlyKeysOf<string[]>, number | `${number}`>);
expectType<number>({} as Extract<ReadonlyKeysOf<readonly string[]>, number | `${number}`>);

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
