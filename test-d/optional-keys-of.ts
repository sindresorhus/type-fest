import {expectType} from 'tsd';
import type {OptionalKeysOf, UnknownRecord} from '../index.d.ts';

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

type OptionalKeysOf1 = OptionalKeysOf<TestType1>;
type OptionalKeysOf2 = OptionalKeysOf<TestType2>;
type OptionalKeysOf3 = OptionalKeysOf<TestType3>;

declare const test1: OptionalKeysOf1;
declare const test2: OptionalKeysOf2;
declare const test3: OptionalKeysOf3;

expectType<'b'>(test1);
expectType<'a' | 'b'>(test2);
expectType<never>(test3);

expectType<'a' | 'c'>({} as OptionalKeysOf<{readonly a?: string; readonly b: number; c?: boolean; d: string}>);

// Unions
expectType<'b' | 'c'>({} as OptionalKeysOf<{a: string; b?: number} | {readonly c?: string; readonly d: number}>);
expectType<'a' | 'b'>({} as OptionalKeysOf<{a: string; b: number} | {a?: string; b?: number}>);

// Arrays
expectType<never>({} as OptionalKeysOf<[]>);
expectType<never>({} as OptionalKeysOf<readonly [string, number, boolean]>);
expectType<'1' | '2'>({} as OptionalKeysOf<[string, number?, boolean?]>);
expectType<'0' | '1' | '2'>({} as OptionalKeysOf<[string?] | readonly [string, number?] | [string, number, boolean?]>);

// `OptionalKeysOf<T>` should be assignable to `keyof T`
type Assignability1<T, _K extends keyof T> = unknown;
type Test1<T extends object> = Assignability1<T, OptionalKeysOf<T>>;

// `keyof T` should NOT be assignable to `OptionalKeysOf<T>`
type Assignability2<T extends object, _K extends OptionalKeysOf<T>> = unknown;
// @ts-expect-error
type Test2<T extends object> = Assignability2<T, keyof T>;

// `OptionalKeysOf<T>` should be assignable to `PropertyKey`
type Assignability3<_T, _K extends PropertyKey> = unknown;
type Test3<T extends object> = Assignability3<T, OptionalKeysOf<T>>;

// `PropertyKey` should NOT be assignable to `OptionalKeysOf<T>`
type Assignability4<T extends object, _K extends OptionalKeysOf<T>> = unknown;
// @ts-expect-error
type Test4<T extends object> = Assignability4<T, PropertyKey>;

// `OptionalKeysOf<T>` should be assignable to `keyof T` even when `T` is constrained to `Record<string, unknown>`
type Assignability5<T extends Record<string, unknown>, _K extends keyof T> = unknown;
type Test5<T extends Record<string, unknown>> = Assignability5<T, OptionalKeysOf<T>>;

// `OptionalKeysOf<T>` should be assignable to `keyof T` even when `T` is constrained to `object`
type Assignability6<T extends object, _K extends keyof T> = unknown;
type Test6<T extends object> = Assignability6<T, OptionalKeysOf<T>>;

// `OptionalKeysOf<T>` should be assignable to `keyof T` even when `T` is constrained to `UnknownRecord`
type Assignability7<T extends UnknownRecord, _K extends keyof T> = unknown;
type Test7<T extends UnknownRecord> = Assignability7<T, OptionalKeysOf<T>>;

// `keyof T` should NOT be assignable to `OptionalKeysOf<T>` even when `T` is constrained to `Record<string, unknown>`
type Assignability8<T extends Record<string, unknown>, _K extends OptionalKeysOf<T>> = unknown;
// @ts-expect-error
type Test8<T extends Record<string, unknown>> = Assignability8<T, keyof T>;

// `keyof T` should NOT be assignable to `OptionalKeysOf<T>` even when `T` is constrained to `object`
type Assignability9<T extends object, _K extends OptionalKeysOf<T>> = unknown;
// @ts-expect-error
type Test9<T extends object> = Assignability9<T, keyof T>;

// `keyof T` should NOT be assignable to `OptionalKeysOf<T>` even when `T` is constrained to `UnknownRecord`
type Assignability10<T extends UnknownRecord, _K extends OptionalKeysOf<T>> = unknown;
// @ts-expect-error
type Test10<T extends UnknownRecord> = Assignability10<T, keyof T>;
