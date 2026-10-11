import {expectTypeOf} from 'nz';
import type {Entry, Entries} from '../index.d.ts';

// Objects
const objectExample = {a: 1};

const objectEntry: Entry<typeof objectExample> = ['a', 1];
expectTypeOf(objectEntry).toBeAssignableTo<[string, number]>();

const objectEntries: Entries<typeof objectExample> = [objectEntry];
expectTypeOf(objectEntries).toBeAssignableTo<Array<[string, number]>>();

// Maps
const mapExample = new Map([['a', 1]]);

const mapEntry: Entry<typeof mapExample> = ['a', 1];
expectTypeOf(mapEntry).toBeAssignableTo<[string, number]>();

const mapEntries: Entries<typeof mapExample> = [mapEntry];
expectTypeOf(mapEntries).toBeAssignableTo<Array<[string, number]>>();

// Arrays
const arrayExample = ['a', 1];

const arrayEntryString: Entry<typeof arrayExample> = [0, 'a'];
expectTypeOf(arrayEntryString).toBeAssignableTo<[number, (string | number)]>();

const arrayEntryNumber: Entry<typeof arrayExample> = [1, 1];
expectTypeOf(arrayEntryNumber).toBeAssignableTo<[number, (string | number)]>();

const arrayEntries: Entries<typeof arrayExample> = [
	arrayEntryString,
	arrayEntryNumber,
];
expectTypeOf(arrayEntries).toBeAssignableTo<Array<[number, (string | number)]>>();

// Sets
const setExample = new Set(['a', 1]);

const setEntryString: Entry<typeof setExample> = ['a', 'a'];
expectTypeOf(setEntryString).toBeAssignableTo<[(string | number), (string | number)]>();

const setEntryNumber: Entry<typeof setExample> = [1, 1];
expectTypeOf(setEntryNumber).toBeAssignableTo<[(string | number), (string | number)]>();

const setEntries: Entries<typeof setExample> = [
	setEntryString,
	setEntryNumber,
];
expectTypeOf(setEntries).toBeAssignableTo<Array<[(string | number), (string | number)]>>();

// A readonly map and a readonly set have an `entries` method, just like their mutable counterparts.
declare const readonlyMapEntries: Entries<ReadonlyMap<string, number>>;
expectTypeOf(readonlyMapEntries).toBe<Array<[string, number]>>();

declare const readonlySetEntries: Entries<ReadonlySet<number>>;
expectTypeOf(readonlySetEntries).toBe<Array<[number, number]>>();

declare const readonlyMapEntry: Entry<ReadonlyMap<string, number>>;
expectTypeOf(readonlyMapEntry).toBe<[string, number]>();

declare const readonlySetEntry: Entry<ReadonlySet<number>>;
expectTypeOf(readonlySetEntry).toBe<[number, number]>();

// A `WeakMap` and a `WeakSet` have no `entries` method, so there is no entry to describe. See the docs.
declare const weakMapEntry: Entry<WeakMap<object, string>>;
expectTypeOf(weakMapEntry).toBe<never>();

declare const weakSetEntry: Entry<WeakSet<object>>;
expectTypeOf(weakSetEntry).toBe<never>();

declare const weakMapEntries: Entries<WeakMap<object, string>>;
expectTypeOf(weakMapEntries).toBe<never>();

declare const weakSetEntries: Entries<WeakSet<object>>;
expectTypeOf(weakSetEntries).toBe<never>();

// A `Map` with object, `unknown`, or `any` keys is assignable to `WeakMap<WeakKey, unknown>`, because the methods of `WeakMap` are compared bivariantly, and the same holds for a `Set` and `WeakSet`. They are still a `Map` and a `Set`, so they have entries.
type ObjectItem = {id: number};

declare const objectKeyMapEntry: Entry<Map<ObjectItem, string>>;
expectTypeOf(objectKeyMapEntry).toBe<[ObjectItem, string]>();

declare const objectKeyMapEntries: Entries<Map<ObjectItem, string>>;
expectTypeOf(objectKeyMapEntries).toBe<Array<[ObjectItem, string]>>();

declare const objectItemSetEntry: Entry<Set<ObjectItem>>;
expectTypeOf(objectItemSetEntry).toBe<[ObjectItem, ObjectItem]>();

declare const objectItemSetEntries: Entries<Set<ObjectItem>>;
expectTypeOf(objectItemSetEntries).toBe<Array<[ObjectItem, ObjectItem]>>();

declare const readonlyObjectKeyMapEntries: Entries<ReadonlyMap<object, number>>;
expectTypeOf(readonlyObjectKeyMapEntries).toBe<Array<[object, number]>>();

declare const anyMapEntry: Entry<Map<any, any>>;
expectTypeOf(anyMapEntry).toBe<[any, any]>();

declare const unknownMapEntry: Entry<Map<unknown, unknown>>;
expectTypeOf(unknownMapEntry).toBe<[unknown, unknown]>();

declare const unknownMapEntries: Entries<Map<unknown, unknown>>;
expectTypeOf(unknownMapEntries).toBe<Array<[unknown, unknown]>>();

declare const unknownSetEntry: Entry<Set<unknown>>;
expectTypeOf(unknownSetEntry).toBe<[unknown, unknown]>();

declare const anySetEntries: Entries<Set<any>>;
expectTypeOf(anySetEntries).toBe<Array<[any, any]>>();

declare const symbolKeyMapEntry: Entry<Map<symbol, number>>;
expectTypeOf(symbolKeyMapEntry).toBe<[symbol, number]>();

// `Object.entries` yields every key as a string, so a numeric key arrives as its string form, and it never yields a symbol key at all, so a type with only symbol keys has no entries. The key was typed as `keyof`, so `Entry<{1: number}>` claimed the key was the number `1`, and `example[0].toUpperCase()` in the type's own example only type-checked because the example's key happened to be a string already.
declare const numericKey: Entry<{1: number}>;
expectTypeOf(numericKey).toBe<['1', number]>();

declare const numberRecord: Entry<Record<number, string>>;
expectTypeOf(numberRecord).toBe<[`${number}`, string]>();

declare const symbolOnly: Entry<{[key: symbol]: number}>;
expectTypeOf(symbolOnly).toBe<never>();

declare const stringRecord: Entry<Record<string, number>>;
expectTypeOf(stringRecord).toBe<[string, number]>();

// A string key is already a string, so the shape of the common case is unchanged.
declare const stringKey: Entry<{someKey: number}>;
expectTypeOf(stringKey).toBe<['someKey', number]>();

declare const mixedKeys: Entry<{a: string; 1: number}>;
expectTypeOf(mixedKeys).toBe<['a', string] | ['1', number]>();

// `Object.entries` pairs each key with its own value, so the pairs have to stay correlated. The type used to be `['a' | '1', string | number]`, which also admits `['a', 1]` and `['1', 'x']`, neither of which `Object.entries` can produce, and which made the type's own example fail to type-check on a second member, since `example[1]` would no longer be known to be a number.
declare const correlatedEntry: Entry<{a: string; b: number}>;
expectTypeOf(correlatedEntry).toBe<['a', string] | ['b', number]>();

declare const correlatedEntries: Entries<{a: string; b: number}>;
expectTypeOf(correlatedEntries).toBe<Array<['a', string] | ['b', number]>>();

// An optional member reads as `T | undefined`, so its pair carries the `undefined` too. Note that `Object.entries` skips an absent key rather than yielding it as `undefined`, so the pair describes a value the runtime can produce from a key that is present and holds nothing, which is the reading a caller narrowing on `entry[1]` has to make.
declare const optionalCorrelatedEntry: Entry<{a: string; b?: number}>;
expectTypeOf(optionalCorrelatedEntry).toBe<['a', string] | ['b', number | undefined]>();

declare const numericKeyEntries: Entries<{1: number}>;
expectTypeOf(numericKeyEntries).toBe<Array<['1', number]>>();

// `Array.prototype.entries` pairs each index with its own element, so a tuple's pairs have to stay correlated too. The type used to be `Array<[number, string | number]>`, which also admits `[1, 'a']`, and `entries[0][1]` was not known to be a string.
declare const tupleEntry: Entry<[string, number]>;
expectTypeOf(tupleEntry).toBe<[0, string] | [1, number]>();

declare const tupleEntries: Entries<[string, number]>;
expectTypeOf(tupleEntries).toBe<Array<[0, string] | [1, number]>>();

declare const readonlyTupleEntries: Entries<readonly [string, number]>;
expectTypeOf(readonlyTupleEntries).toBe<Array<[0, string] | [1, number]>>();

// An empty tuple has no entries, so there is no pair to describe.
declare const emptyTupleEntries: Entries<[]>;
expectTypeOf(emptyTupleEntries).toBe<never[]>();

// The entries of a generic object can be destructured. The compiler reads them through the constraint `object`, which has no keys.
function entriesOfGeneric<ObjectType extends object>(object: ObjectType) {
	for (const [key, value] of Object.entries(object) as Entries<ObjectType>) {
		expectTypeOf(key).toBe<never>();
		expectTypeOf(value).toBe<never>();
	}
}

// Tuple optional elements can be absent, and a hole is yielded as `undefined` by array entries.
expectTypeOf<Entry<readonly [string, number?]>>().toBe<[0, string] | [1, number | undefined]>();

// Destructuring a correlated entry keeps its value narrowable by the key.
function narrowEntry(entry: Entry<{text: string; count: number}>) {
	const [key, value] = entry;

	if (key === 'text') {
		expectTypeOf(value).toBe<string>();
	} else {
		expectTypeOf(value).toBe<number>();
	}
}
