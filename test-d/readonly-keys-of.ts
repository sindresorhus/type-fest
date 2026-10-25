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

// Readonly accessors and declared fields are selected, while writable fields are not.
declare class ReadonlyAccount {
	readonly id: string;
	name: string;
	get balance(): number;
}
expectTypeOf<ReadonlyKeysOf<ReadonlyAccount>>().toBe<'id' | 'balance'>();
expectTypeOf<ReadonlyKeysOf<{[key: string]: unknown; readonly id: number}>>().toBe<'id'>();
expectTypeOf<ReadonlyKeysOf<{readonly empty: never; readonly optional?: unknown; mutable: any}>>().toBe<'empty' | 'optional'>();
expectTypeOf<ReadonlyKeysOf<any>>().toBe<never>();
expectTypeOf<ReadonlyKeysOf<never>>().toBe<never>();
// @ts-expect-error An unknown value has no known object properties.
type UnknownReadonlyKeys = ReadonlyKeysOf<unknown>;

type ReadonlyValue<Value> = {readonly id: Value; label: string};
function _readonlyValueKey<Value>(): ReadonlyKeysOf<ReadonlyValue<Value>> {
	return 'id';
}

function _readReadonlyValue<Value>(value: ReadonlyValue<Value>, key: ReadonlyKeysOf<ReadonlyValue<Value>>): Value {
	return value[key];
}

declare function selectServerFields<const Model extends object>(model: Model): Pick<Model, ReadonlyKeysOf<Model>>;
const serverFields = selectServerFields({id: 'session', data: {count: 1}});
expectTypeOf(serverFields).toBe<{readonly id: 'session'; readonly data: {readonly count: 1}}>();
// @ts-expect-error An otherwise valid value cannot replace a readonly property.
serverFields.id = 'session';

function isReadonlyField<Base extends object>(key: keyof Base, fields: ReadonlyArray<ReadonlyKeysOf<Base>>): key is ReadonlyKeysOf<Base> {
	return new Set<PropertyKey>(fields).has(key);
}

function _readCheckedReadonlyField<Base extends object>(value: Base, key: keyof Base, fields: ReadonlyArray<ReadonlyKeysOf<Base>>) {
	return isReadonlyField(key, fields) ? value[key] : undefined;
}

expectTypeOf(_readCheckedReadonlyField({id: 'session', label: 'name'} as ReadonlyValue<'session'>, 'id', ['id'])).toBe<'session' | undefined>();

enum ReadonlyField {
	Value = 'value',
}
declare const readonlySymbol: unique symbol;
expectTypeOf<ReadonlyKeysOf<{readonly [ReadonlyField.Value]: string; readonly [readonlySymbol]?: number; mutable: boolean}>>()
	.toBe<ReadonlyField.Value | typeof readonlySymbol>();

// Preserve the existing queries for an indeterminate `any` key domain.
expectTypeOf<ReadonlyKeysOf<Record<any, unknown>>>().toBe<never>();
expectTypeOf<ReadonlyKeysOf<Readonly<Record<any, unknown>>>>().toBe<any>();
