// TODO: Test equality
import {expectAssignable, expectType} from 'tsd';
import type {UndefinedOnPartialDeep} from '../source/undefined-on-partial-deep.d.ts';
import type {JsonValue} from '../source/json-value.d.ts';

type TestType1 = UndefinedOnPartialDeep<{required: string; optional?: string; optional2?: number; optional3?: string}>;
expectAssignable<TestType1>({required: '', optional: undefined, optional2: 1});

type TestType2 = UndefinedOnPartialDeep<{optional?: string | undefined}>;
expectAssignable<TestType2>({optional: undefined});

type TestType3 = UndefinedOnPartialDeep<{requiredWithUndefind: string | undefined}>;
expectAssignable<TestType3>({requiredWithUndefind: undefined});

// Test null and undefined
type NullType = UndefinedOnPartialDeep<{null?: null}>;
expectAssignable<NullType>({null: undefined});
type UndefinedType = UndefinedOnPartialDeep<{ud?: undefined}>;
expectAssignable<UndefinedType>({ud: undefined});

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
expectAssignable<MixedType>({
	required: '',
	union: undefined,
	boolean: undefined,
	string: undefined,
	symbol: undefined,
	date: undefined,
	regExp: undefined,
	func: undefined,
});

// Test object
type ObjectType = UndefinedOnPartialDeep<{obj?: {key: string}}>;
expectAssignable<ObjectType>({obj: undefined});

type ObjectDeepType = UndefinedOnPartialDeep<{obj?: {subObj?: {key?: string}}}>;
expectAssignable<ObjectDeepType>({obj: undefined});
expectAssignable<ObjectDeepType>({obj: {subObj: undefined}});
expectAssignable<ObjectDeepType>({obj: {subObj: {key: undefined}}});

// Test map
type MapType = UndefinedOnPartialDeep<{map?: Map<string, {key?: string}>}>;
expectAssignable<MapType>({map: undefined});
expectAssignable<MapType>({map: new Map([['', {key: undefined}]])});

// Test set
type SetType = UndefinedOnPartialDeep<{set?: Set<{key?: string}>}>;
expectAssignable<SetType>({set: undefined});
expectAssignable<SetType>({set: new Set([{key: undefined}])});

// Test array and tuple
type TupleType = UndefinedOnPartialDeep<{tuple?: [string, number]}>;
expectAssignable<TupleType>({tuple: undefined});
type ArrayType = UndefinedOnPartialDeep<{array?: string[]}>;
expectAssignable<ArrayType>({array: undefined});
type ArrayDeepType = UndefinedOnPartialDeep<{array?: Array<{subArray?: string[]}>}>;
expectAssignable<ArrayDeepType>({array: undefined});
expectAssignable<ArrayDeepType>({array: [{subArray: undefined}]});
type ObjectListType = UndefinedOnPartialDeep<{array?: Array<{key?: string}>}>;
expectAssignable<ObjectListType>({array: undefined});
expectAssignable<ObjectListType>({array: [{key: undefined}]});

// Test readonly array
type ReadonlyType = UndefinedOnPartialDeep<{readonly?: readonly string[]}>;
expectAssignable<ReadonlyType>({readonly: undefined});
// eslint-disable-next-line @typescript-eslint/array-type
type ReadonlyArrayTest = UndefinedOnPartialDeep<{readonly?: ReadonlyArray<string>}>;
expectAssignable<ReadonlyArrayTest>({readonly: undefined});

// A tuple with optional elements keeps its length, which a variadic rest would not.
declare const optionalTail: UndefinedOnPartialDeep<[string, (number | undefined)?]>;
expectType<[string, (number | undefined)?]>(optionalTail);

declare const allOptional: UndefinedOnPartialDeep<[(string | undefined)?, (number | undefined)?]>;
expectType<[(string | undefined)?, (number | undefined)?]>(allOptional);

declare const readonlyOptionalTail: UndefinedOnPartialDeep<readonly [string, (number | undefined)?]>;
expectType<readonly [string, (number | undefined)?]>(readonlyOptionalTail);

declare const leadingFixed: UndefinedOnPartialDeep<[string, ...number[]]>;
expectType<[string, ...number[]]>(leadingFixed);

declare const optionalArray: UndefinedOnPartialDeep<Array<{a?: string; b?: number}>>;
expectType<Array<{a?: string | undefined; b?: number | undefined}>>(optionalArray);

// A tuple with a rest element at the start keeps the rest element at the start, which a variadic rest in the middle would not.
declare const leadingRest: UndefinedOnPartialDeep<[...string[], number]>;
expectType<[...string[], number]>(leadingRest);

declare const readonlyLeadingRest: UndefinedOnPartialDeep<readonly [...string[], number]>;
expectType<readonly [...string[], number]>(readonlyLeadingRest);

declare const middleRest: UndefinedOnPartialDeep<[1, ...string[], 2]>;
expectType<[1, ...string[], 2]>(middleRest);

declare const leadingRestWithOptional: UndefinedOnPartialDeep<[...string[], {a?: number}]>;
expectType<[...string[], {a?: number | undefined}]>(leadingRestWithOptional);

declare const emptyReadonlyTuple: UndefinedOnPartialDeep<readonly []>;
expectType<readonly []>(emptyReadonlyTuple);

// A `WeakMap` and a `WeakSet` are containers, so their value or item type is converted the same way a `Map`'s and a `Set`'s is. Without that they fall through to the object branch and come back as an object of the container's own methods, which is not a `WeakSet` at all.
declare const weakSet: UndefinedOnPartialDeep<{a: WeakSet<{b?: number}>}>;
expectType<{a: WeakSet<{b?: number | undefined}>}>(weakSet);

declare const weakMap: UndefinedOnPartialDeep<{a: WeakMap<object, {b?: number}>}>;
expectType<{a: WeakMap<object, {b?: number | undefined}>}>(weakMap);

// These are non-recursive, so they are kept as is. Mapping over one replaces it with a plain object of its own members, so a `Uint8Array` came back as a fifty property object literal.
declare const promise: UndefinedOnPartialDeep<{a: Promise<unknown>}>;
expectType<{a: Promise<unknown>}>(promise);

declare const typedArray: UndefinedOnPartialDeep<{a: Uint8Array}>;
expectType<{a: Uint8Array}>(typedArray);

declare const arrayBuffer: UndefinedOnPartialDeep<{a: ArrayBuffer}>;
expectType<{a: ArrayBuffer}>(arrayBuffer);

declare const dataView: UndefinedOnPartialDeep<{a: DataView}>;
expectType<{a: DataView}>(dataView);

declare const sharedArrayBuffer: UndefinedOnPartialDeep<{a: SharedArrayBuffer}>;
expectType<{a: SharedArrayBuffer}>(sharedArrayBuffer);

// A recursive element type is walked lazily, so it does not become infinitely deep.
expectAssignable<UndefinedOnPartialDeep<{json: JsonValue}>>({json: [{a: 1}]});

// Optional tuple elements accept an explicit `undefined`, even when it was not explicitly declared in the input.
expectAssignable<UndefinedOnPartialDeep<[string?]>>([undefined]);
expectAssignable<UndefinedOnPartialDeep<readonly [string, number?]>>(['value', undefined]);
expectAssignable<UndefinedOnPartialDeep<[{name?: string}?]>>([{name: undefined}]);
