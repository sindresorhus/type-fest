import {expectTypeOf} from 'nz';
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

expectTypeOf(test1).toBe<'b'>();
expectTypeOf(test2).toBe<'a' | 'b'>();
expectTypeOf(test3).toBe<never>();

expectTypeOf<OptionalKeysOf<{readonly a?: string; readonly b: number; c?: boolean; d: string}>>().toBe<'a' | 'c'>();

// Unions
expectTypeOf<OptionalKeysOf<{a: string; b?: number} | {readonly c?: string; readonly d: number}>>().toBe<'b' | 'c'>();
expectTypeOf<OptionalKeysOf<{a: string; b: number} | {a?: string; b?: number}>>().toBe<'a' | 'b'>();

// Arrays
expectTypeOf<OptionalKeysOf<[]>>().toBe<never>();
expectTypeOf<OptionalKeysOf<readonly [string, number, boolean]>>().toBe<never>();
expectTypeOf<OptionalKeysOf<[string, number?, boolean?]>>().toBe<'1' | '2'>();
expectTypeOf<OptionalKeysOf<[string?] | readonly [string, number?] | [string, number, boolean?]>>().toBe<'0' | '1' | '2'>();

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

// A union reports the keys of each of its members, so the result can name a key that is not a key of the union itself. `keyof` of a union is the intersection of its members' keys, so `keyof` of the union below is `never` while the result is `'a' | 'b'`. See the note on unions in the docs.
expectTypeOf<OptionalKeysOf<{a?: 1} | {b?: 2}>>().toBe<'a' | 'b'>();
expectTypeOf<OptionalKeysOf<{a?: 1; b?: 2} | {a?: 1}>>().toBe<'a' | 'b'>();

// Absence stays distinct from a required value that happens to accept undefined.
declare const optionalMetadata: unique symbol;
type OptionalMetadataModel = {[key: `data-${string}`]: unknown; readonly id: string; requiredUndefined: string | undefined; note?: string | undefined; readonly [optionalMetadata]?: never};
expectTypeOf<OptionalKeysOf<OptionalMetadataModel>>().toBe<'note' | typeof optionalMetadata>();
expectTypeOf<OptionalKeysOf<readonly [string, number?] & {readonly label?: string}>>().toBe<'1' | 'label'>();
expectTypeOf<OptionalKeysOf<any>>().toBe<never>();
expectTypeOf<OptionalKeysOf<never>>().toBe<never>();
// @ts-expect-error Unknown has no object properties to classify.
type UnknownOptionalFields = OptionalKeysOf<unknown>;

enum OptionalField {
	Note = 'note',
}
type OptionalAliasModel = {[OptionalField.Note]?: string} & {note?: string; id: number};
expectTypeOf<OptionalKeysOf<OptionalAliasModel>>().toBe<OptionalField.Note>();

function _optionalKey<Base extends object>(key: OptionalKeysOf<Base>): keyof Base {
	return key;
}

function _readOptional<Value>(model: Pick<{id: number; note?: Value}, OptionalKeysOf<{id: number; note?: Value}>>): Value | undefined {
	return model.note;
}

declare function optionalFields<const Model extends object>(model: Model): Pick<Model, OptionalKeysOf<Model>>;
const optionalModel: {readonly id: number; readonly note?: string} = {id: 1};
const inferredOptionalFields = optionalFields(optionalModel);
expectTypeOf(inferredOptionalFields).toBe<{readonly note?: string}>();
// @ts-expect-error The selected property keeps its original readonly modifier.
inferredOptionalFields.note = 'valid';

// The selected keys remain usable in generic construction and type predicates.
function _pickOptionalFields<Base extends object>(value: Base): Pick<Base, OptionalKeysOf<Base>> {
	return value;
}

function _isOptionalField<Base extends object>(key: keyof Base, fields: ReadonlyArray<OptionalKeysOf<Base>>): key is OptionalKeysOf<Base> {
	const declaredFields: ReadonlyArray<keyof Base> = fields;
	return declaredFields.includes(key);
}

expectTypeOf<OptionalKeysOf<[string?, ...number[]]>>().toBe<'0'>();
