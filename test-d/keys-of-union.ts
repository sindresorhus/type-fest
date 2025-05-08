import {expectType} from 'tsd';
import type {KeysOfUnion, UnknownRecord} from '../index.d.ts';

// When passing types that are not unions, it behaves exactly as the `keyof` operator.

type Example1 = {
	string: string;
	number: number;
	boolean: boolean;
	null: null;
	array: number[];
};

type Expected1 = keyof Example1;

declare const actual1: KeysOfUnion<Example1>;

expectType<Expected1>(actual1);

// When passing a type that is a union, it returns a union of all keys of all union members.

type Example2 = {
	common: string;
	a: number;
} | {
	common: string;
	b: string;
} | {
	common: string;
	c: boolean;
};

type Expected2 = 'common' | 'a' | 'b' | 'c';

declare const actual2: KeysOfUnion<Example2>;

expectType<Expected2>(actual2);

// With property modifiers
declare const actual3: KeysOfUnion<{a?: string; readonly b: number} | {a: number; b: string}>;
expectType<'a' | 'b'>(actual3);

// `KeysOfUnion<T>` should NOT be assignable to `keyof T`
type Assignability1<T, _K extends keyof T> = unknown;
// @ts-expect-error
type Test1<T> = Assignability1<T, KeysOfUnion<T>>;

// `keyof T` should be assignable to `KeysOfUnion<T>`
type Assignability2<T, _K extends KeysOfUnion<T>> = unknown;
type Test2<T> = Assignability2<T, keyof T>;

// `KeysOfUnion<T>` should be assignable to `PropertyKey`
type Assignability3<_T, _K extends PropertyKey> = unknown;
type Test3<T> = Assignability3<T, KeysOfUnion<T>>;

// `PropertyKey` should NOT be assignable to `KeysOfUnion<T>`
type Assignability4<T, _K extends KeysOfUnion<T>> = unknown;
// @ts-expect-error
type Test4<T> = Assignability4<T, PropertyKey>;

// `keyof T` should be assignable to `KeysOfUnion<T>` even when `T` is constrained to `Record<string, unknown>`
type Assignability5<T extends Record<string, unknown>, _K extends KeysOfUnion<T>> = unknown;
type Test5<T extends Record<string, unknown>> = Assignability5<T, keyof T>;

// `keyof T` should be assignable to `KeysOfUnion<T>` even when `T` is constrained to `object`
type Assignability6<T extends object, _K extends KeysOfUnion<T>> = unknown;
type Test6<T extends object> = Assignability6<T, keyof T>;

// `keyof T` should be assignable to `KeysOfUnion<T>` even when `T` is constrained to `UnknownRecord`
type Assignability7<T extends UnknownRecord, _K extends KeysOfUnion<T>> = unknown;
type Test7<T extends UnknownRecord> = Assignability7<T, keyof T>;

// `KeysOfUnion<T>` should NOT be assignable to `keyof T` even when `T` is constrained to `Record<string, unknown>`
type Assignability8<T extends Record<string, unknown>, _K extends keyof T> = unknown;
// @ts-expect-error
type Test8<T extends Record<string, unknown>> = Assignability8<T, KeysOfUnion<T>>;

// `KeysOfUnion<T>` should NOT be assignable to `keyof T` even when `T` is constrained to `object`
type Assignability9<T extends object, _K extends keyof T> = unknown;
// @ts-expect-error
type Test9<T extends object> = Assignability9<T, KeysOfUnion<T>>;

// `KeysOfUnion<T>` should NOT be assignable to `keyof T` even when `T` is constrained to `UnknownRecord`
// type Assignability10<T extends UnknownRecord, _K extends keyof T> = unknown;
// The following line should error but it doesn't, this is an issue with the existing implementation of `KeysOfUnion`
// type Test10<T extends UnknownRecord> = Assignability10<T, KeysOfUnion<T>>;
