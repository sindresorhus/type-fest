import {expectType} from 'tsd';
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

expectType<'a'>(test1);
expectType<never>(test2);
expectType<'a' | 'b'>(test3);

expectType<'a' | 'c'>({} as RequiredKeysOf<{readonly a: string; readonly b?: number; c: boolean; d?: string}>);

// Unions
expectType<'b' | 'c'>({} as RequiredKeysOf<{a?: string; b: number} | {readonly c: string; readonly d?: number}>);
expectType<'a' | 'b'>({} as RequiredKeysOf<{a?: string; b?: number} | {a: string; b: number}>);

// Arrays
expectType<keyof []>({} as RequiredKeysOf<[]>);
expectType<keyof readonly [string, number, boolean]>({} as RequiredKeysOf<readonly [string, number, boolean]>);
expectType<Exclude<keyof [string, number?, boolean?], '1' | '2'>>({} as RequiredKeysOf<[string, number?, boolean?]>);
expectType<Exclude<keyof [string, number, boolean?], '2'>>({} as RequiredKeysOf<[string?] | readonly [string, number?] | [string, number, boolean?]>);

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
