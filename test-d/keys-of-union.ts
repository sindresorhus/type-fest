import {expectType} from 'tsd';
import type {KeysOfUnion} from '../index';

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
