import {expectTypeOf} from 'nz';
import type {UndefinedOnPartialDeep} from '../source/undefined-on-partial-deep.d.ts';
import type {JsonValue} from '../source/json-value.d.ts';

type TestType1 = UndefinedOnPartialDeep<{required: string; optional?: string; optional2?: number; optional3?: string}>;
expectTypeOf<TestType1>().toBe<{required: string; optional?: string | undefined; optional2?: number | undefined; optional3?: string | undefined}>();
({required: '', optional: undefined, optional2: 1}) satisfies TestType1;

type TestType2 = UndefinedOnPartialDeep<{optional?: string | undefined}>;
expectTypeOf<TestType2>().toBe<{optional?: string | undefined}>();
({optional: undefined}) satisfies TestType2;

type TestType3 = UndefinedOnPartialDeep<{requiredWithUndefind: string | undefined}>;
expectTypeOf<TestType3>().toBe<{requiredWithUndefind: string | undefined}>();
({requiredWithUndefind: undefined}) satisfies TestType3;

// Test null and undefined
type NullType = UndefinedOnPartialDeep<{null?: null}>;
expectTypeOf<NullType>().toBe<{null?: null | undefined}>();
({null: undefined}) satisfies NullType;
type UndefinedType = UndefinedOnPartialDeep<{ud?: undefined}>;
expectTypeOf<UndefinedType>().toBe<{ud?: undefined}>();
({ud: undefined}) satisfies UndefinedType;

// Test mixed types
type MixedType = UndefinedOnPartialDeep<{
	required: string;
	union?: 'test1' | 'test2';
	boolean?: boolean;
	string?: string;
	symbol?: symbol;
	date?: Date;
	regExp?: RegExp;
	func?: (arguments0: string, arguments1: number) => boolean;
}>;
({
	required: '',
	union: undefined,
	boolean: undefined,
	string: undefined,
	symbol: undefined,
	date: undefined,
	regExp: undefined,
	func: undefined,
}) satisfies MixedType;
expectTypeOf<MixedType>().toBe<{
	required: string;
	union?: 'test1' | 'test2' | undefined;
	boolean?: boolean | undefined;
	string?: string | undefined;
	symbol?: symbol | undefined;
	date?: Date | undefined;
	regExp?: RegExp | undefined;
	func?: ((arguments0: string, arguments1: number) => boolean) | undefined;
}>();

// Test object
type ObjectType = UndefinedOnPartialDeep<{obj?: {key: string}}>;
expectTypeOf<ObjectType>().toBe<{obj?: {key: string} | undefined}>();
({obj: undefined}) satisfies ObjectType;

type ObjectDeepType = UndefinedOnPartialDeep<{obj?: {subObj?: {key?: string}}}>;
expectTypeOf<ObjectDeepType>().toBe<{obj?: {subObj?: {key?: string | undefined} | undefined} | undefined}>();
({obj: undefined}) satisfies ObjectDeepType;
({obj: {subObj: undefined}}) satisfies ObjectDeepType;
({obj: {subObj: {key: undefined}}}) satisfies ObjectDeepType;

// Test map
type MapType = UndefinedOnPartialDeep<{map?: Map<string, {key?: string}>}>;
expectTypeOf<MapType>().toBe<{map?: Map<string, {key?: string | undefined}> | undefined}>();
({map: undefined}) satisfies MapType;
({map: new Map([['', {key: undefined}]])}) satisfies MapType;

// Test set
type SetType = UndefinedOnPartialDeep<{set?: Set<{key?: string}>}>;
expectTypeOf<SetType>().toBe<{set?: Set<{key?: string | undefined}> | undefined}>();
({set: undefined}) satisfies SetType;
({set: new Set([{key: undefined}])}) satisfies SetType;

// Test array and tuple
type TupleType = UndefinedOnPartialDeep<{tuple?: [string, number]}>;
expectTypeOf<TupleType>().toBe<{tuple?: [string, number] | undefined}>();
({tuple: undefined}) satisfies TupleType;
type ArrayType = UndefinedOnPartialDeep<{array?: string[]}>;
expectTypeOf<ArrayType>().toBe<{array?: string[] | undefined}>();
({array: undefined}) satisfies ArrayType;
type ArrayDeepType = UndefinedOnPartialDeep<{array?: Array<{subArray?: string[]}>}>;
expectTypeOf<ArrayDeepType>().toBe<{array?: Array<{subArray?: string[] | undefined}> | undefined}>();
({array: undefined}) satisfies ArrayDeepType;
({array: [{subArray: undefined}]}) satisfies ArrayDeepType;
type ObjectListType = UndefinedOnPartialDeep<{array?: Array<{key?: string}>}>;
expectTypeOf<ObjectListType>().toBe<{array?: Array<{key?: string | undefined}> | undefined}>();
({array: undefined}) satisfies ObjectListType;
({array: [{key: undefined}]}) satisfies ObjectListType;

// Test readonly array
type ReadonlyType = UndefinedOnPartialDeep<{readonly?: readonly string[]}>;
expectTypeOf<ReadonlyType>().toBe<{readonly?: readonly string[] | undefined}>();
({readonly: undefined}) satisfies ReadonlyType;
// eslint-disable-next-line @typescript-eslint/array-type
type ReadonlyArrayTest = UndefinedOnPartialDeep<{readonly?: ReadonlyArray<string>}>;
expectTypeOf<ReadonlyArrayTest>().toBe<{readonly?: readonly string[] | undefined}>();
({readonly: undefined}) satisfies ReadonlyArrayTest;

// A tuple with optional elements keeps its length, which a variadic rest would not.
declare const optionalTail: UndefinedOnPartialDeep<[string, (number | undefined)?]>;
expectTypeOf(optionalTail).toBe<[string, (number | undefined)?]>();

declare const allOptional: UndefinedOnPartialDeep<[(string | undefined)?, (number | undefined)?]>;
expectTypeOf(allOptional).toBe<[(string | undefined)?, (number | undefined)?]>();

declare const readonlyOptionalTail: UndefinedOnPartialDeep<readonly [string, (number | undefined)?]>;
expectTypeOf(readonlyOptionalTail).toBe<readonly [string, (number | undefined)?]>();

declare const leadingFixed: UndefinedOnPartialDeep<[string, ...number[]]>;
expectTypeOf(leadingFixed).toBe<[string, ...number[]]>();

declare const optionalArray: UndefinedOnPartialDeep<Array<{a?: string; b?: number}>>;
expectTypeOf(optionalArray).toBe<Array<{a?: string | undefined; b?: number | undefined}>>();

// A tuple with a rest element at the start keeps the rest element at the start, which a variadic rest in the middle would not.
declare const leadingRest: UndefinedOnPartialDeep<[...string[], number]>;
expectTypeOf(leadingRest).toBe<[...string[], number]>();

declare const readonlyLeadingRest: UndefinedOnPartialDeep<readonly [...string[], number]>;
expectTypeOf(readonlyLeadingRest).toBe<readonly [...string[], number]>();

declare const middleRest: UndefinedOnPartialDeep<[1, ...string[], 2]>;
expectTypeOf(middleRest).toBe<[1, ...string[], 2]>();

declare const leadingRestWithOptional: UndefinedOnPartialDeep<[...string[], {a?: number}]>;
expectTypeOf(leadingRestWithOptional).toBe<[...string[], {a?: number | undefined}]>();

declare const emptyReadonlyTuple: UndefinedOnPartialDeep<readonly []>;
expectTypeOf(emptyReadonlyTuple).toBe<readonly []>();

// A `WeakMap` and a `WeakSet` are containers, so their value or item type is converted the same way a `Map`'s and a `Set`'s is. Without that they fall through to the object branch and come back as an object of the container's own methods, which is not a `WeakSet` at all.
declare const weakSet: UndefinedOnPartialDeep<{a: WeakSet<{b?: number}>}>;
expectTypeOf(weakSet).toBe<{a: WeakSet<{b?: number | undefined}>}>();

declare const weakMap: UndefinedOnPartialDeep<{a: WeakMap<object, {b?: number}>}>;
expectTypeOf(weakMap).toBe<{a: WeakMap<object, {b?: number | undefined}>}>();

// These are non-recursive, so they are kept as is. Mapping over one replaces it with a plain object of its own members, so a `Uint8Array` came back as a fifty property object literal.
declare const promise: UndefinedOnPartialDeep<{a: Promise<unknown>}>;
expectTypeOf(promise).toBe<{a: Promise<unknown>}>();

declare const typedArray: UndefinedOnPartialDeep<{a: Uint8Array}>;
expectTypeOf(typedArray).toBe<{a: Uint8Array}>();

declare const arrayBuffer: UndefinedOnPartialDeep<{a: ArrayBuffer}>;
expectTypeOf(arrayBuffer).toBe<{a: ArrayBuffer}>();

declare const dataView: UndefinedOnPartialDeep<{a: DataView}>;
expectTypeOf(dataView).toBe<{a: DataView}>();

declare const sharedArrayBuffer: UndefinedOnPartialDeep<{a: SharedArrayBuffer}>;
expectTypeOf(sharedArrayBuffer).toBe<{a: SharedArrayBuffer}>();

// A recursive element type is walked lazily, so it does not become infinitely deep.
({json: [{a: 1}]}) satisfies UndefinedOnPartialDeep<{json: JsonValue}>;

// Optional tuple elements accept an explicit `undefined`, even when it was not explicitly declared in the input.
[undefined] satisfies UndefinedOnPartialDeep<[string?]>;
['value', undefined] satisfies UndefinedOnPartialDeep<readonly [string, number?]>;
[{name: undefined}] satisfies UndefinedOnPartialDeep<[{name?: string}?]>;
