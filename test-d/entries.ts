import {expectAssignable, expectType} from 'tsd';
import type {Entry, Entries} from '../index.d.ts';

// Objects
const objectExample = {a: 1};

const objectEntry: Entry<typeof objectExample> = ['a', 1];
expectAssignable<[string, number]>(objectEntry);

const objectEntries: Entries<typeof objectExample> = [objectEntry];
expectAssignable<Array<[string, number]>>(objectEntries);

// Maps
const mapExample = new Map([['a', 1]]);

const mapEntry: Entry<typeof mapExample> = ['a', 1];
expectAssignable<[string, number]>(mapEntry);

const mapEntries: Entries<typeof mapExample> = [mapEntry];
expectAssignable<Array<[string, number]>>(mapEntries);

// Arrays
const arrayExample = ['a', 1];

const arrayEntryString: Entry<typeof arrayExample> = [0, 'a'];
expectAssignable<[number, (string | number)]>(arrayEntryString);

const arrayEntryNumber: Entry<typeof arrayExample> = [1, 1];
expectAssignable<[number, (string | number)]>(arrayEntryNumber);

const arrayEntries: Entries<typeof arrayExample> = [
	arrayEntryString,
	arrayEntryNumber,
];
expectAssignable<Array<[number, (string | number)]>>(arrayEntries);

// Sets
const setExample = new Set(['a', 1]);

const setEntryString: Entry<typeof setExample> = ['a', 'a'];
expectAssignable<[(string | number), (string | number)]>(setEntryString);

const setEntryNumber: Entry<typeof setExample> = [1, 1];
expectAssignable<[(string | number), (string | number)]>(setEntryNumber);

const setEntries: Entries<typeof setExample> = [
	setEntryString,
	setEntryNumber,
];
expectAssignable<Array<[(string | number), (string | number)]>>(setEntries);

// A readonly map and a readonly set have an `entries` method, just like their mutable counterparts.
declare const readonlyMapEntries: Entries<ReadonlyMap<string, number>>;
expectType<Array<[string, number]>>(readonlyMapEntries);

declare const readonlySetEntries: Entries<ReadonlySet<number>>;
expectType<Array<[number, number]>>(readonlySetEntries);

declare const readonlyMapEntry: Entry<ReadonlyMap<string, number>>;
expectType<[string, number]>(readonlyMapEntry);

declare const readonlySetEntry: Entry<ReadonlySet<number>>;
expectType<[number, number]>(readonlySetEntry);

// A `WeakMap` and a `WeakSet` have no `entries` method, so there is no entry to describe. See the docs.
declare const weakMapEntry: Entry<WeakMap<object, string>>;
expectType<never>(weakMapEntry);

declare const weakSetEntry: Entry<WeakSet<object>>;
expectType<never>(weakSetEntry);

declare const weakMapEntries: Entries<WeakMap<object, string>>;
expectType<never>(weakMapEntries);

declare const weakSetEntries: Entries<WeakSet<object>>;
expectType<never>(weakSetEntries);

// A `Map` with object, `unknown`, or `any` keys is assignable to `WeakMap<WeakKey, unknown>`, because the methods of `WeakMap` are compared bivariantly, and the same holds for a `Set` and `WeakSet`. They are still a `Map` and a `Set`, so they have entries.
type ObjectItem = {id: number};

declare const objectKeyMapEntry: Entry<Map<ObjectItem, string>>;
expectType<[ObjectItem, string]>(objectKeyMapEntry);

declare const objectKeyMapEntries: Entries<Map<ObjectItem, string>>;
expectType<Array<[ObjectItem, string]>>(objectKeyMapEntries);

declare const objectItemSetEntry: Entry<Set<ObjectItem>>;
expectType<[ObjectItem, ObjectItem]>(objectItemSetEntry);

declare const objectItemSetEntries: Entries<Set<ObjectItem>>;
expectType<Array<[ObjectItem, ObjectItem]>>(objectItemSetEntries);

declare const readonlyObjectKeyMapEntries: Entries<ReadonlyMap<object, number>>;
expectType<Array<[object, number]>>(readonlyObjectKeyMapEntries);

declare const anyMapEntry: Entry<Map<any, any>>;
expectType<[any, any]>(anyMapEntry);

declare const unknownMapEntry: Entry<Map<unknown, unknown>>;
expectType<[unknown, unknown]>(unknownMapEntry);

declare const unknownMapEntries: Entries<Map<unknown, unknown>>;
expectType<Array<[unknown, unknown]>>(unknownMapEntries);

declare const unknownSetEntry: Entry<Set<unknown>>;
expectType<[unknown, unknown]>(unknownSetEntry);

declare const anySetEntries: Entries<Set<any>>;
expectType<Array<[any, any]>>(anySetEntries);

declare const symbolKeyMapEntry: Entry<Map<symbol, number>>;
expectType<[symbol, number]>(symbolKeyMapEntry);

// `Object.entries` yields every key as a string, so a numeric key arrives as its string form, and it never yields a symbol key at all, so a type with only symbol keys has no entries. The key was typed as `keyof`, so `Entry<{1: number}>` claimed the key was the number `1`, and `example[0].toUpperCase()` in the type's own example only type-checked because the example's key happened to be a string already.
declare const numericKey: Entry<{1: number}>;
expectType<['1', number]>(numericKey);

declare const numberRecord: Entry<Record<number, string>>;
expectType<[`${number}`, string]>(numberRecord);

declare const symbolOnly: Entry<{[key: symbol]: number}>;
expectType<never>(symbolOnly);

declare const stringRecord: Entry<Record<string, number>>;
expectType<[string, number]>(stringRecord);

// A string key is already a string, so the shape of the common case is unchanged.
declare const stringKey: Entry<{someKey: number}>;
expectType<['someKey', number]>(stringKey);

declare const mixedKeys: Entry<{a: string; 1: number}>;
expectType<['a', string] | ['1', number]>(mixedKeys);

// `Object.entries` pairs each key with its own value, so the pairs have to stay correlated. The type used to be `['a' | '1', string | number]`, which also admits `['a', 1]` and `['1', 'x']`, neither of which `Object.entries` can produce, and which made the type's own example fail to type-check on a second member, since `example[1]` would no longer be known to be a number.
declare const correlatedEntry: Entry<{a: string; b: number}>;
expectType<['a', string] | ['b', number]>(correlatedEntry);

declare const correlatedEntries: Entries<{a: string; b: number}>;
expectType<Array<['a', string] | ['b', number]>>(correlatedEntries);

// An optional member reads as `T | undefined`, so its pair carries the `undefined` too. Note that `Object.entries` skips an absent key rather than yielding it as `undefined`, so the pair describes a value the runtime can produce from a key that is present and holds nothing, which is the reading a caller narrowing on `entry[1]` has to make.
declare const optionalCorrelatedEntry: Entry<{a: string; b?: number}>;
expectType<['a', string] | ['b', number | undefined]>(optionalCorrelatedEntry);

declare const numericKeyEntries: Entries<{1: number}>;
expectType<Array<['1', number]>>(numericKeyEntries);

// `Array.prototype.entries` pairs each index with its own element, so a tuple's pairs have to stay correlated too. The type used to be `Array<[number, string | number]>`, which also admits `[1, 'a']`, and `entries[0][1]` was not known to be a string.
declare const tupleEntry: Entry<[string, number]>;
expectType<[0, string] | [1, number]>(tupleEntry);

declare const tupleEntries: Entries<[string, number]>;
expectType<Array<[0, string] | [1, number]>>(tupleEntries);

declare const readonlyTupleEntries: Entries<readonly [string, number]>;
expectType<Array<[0, string] | [1, number]>>(readonlyTupleEntries);

// An empty tuple has no entries, so there is no pair to describe.
declare const emptyTupleEntries: Entries<[]>;
expectType<never[]>(emptyTupleEntries);

// The entries of a generic object can be destructured. The compiler reads them through the constraint `object`, which has no keys.
function entriesOfGeneric<ObjectType extends object>(object: ObjectType) {
	for (const [key, value] of Object.entries(object) as Entries<ObjectType>) {
		expectType<never>(key);
		expectType<never>(value);
	}
}

// Tuple optional elements can be absent, and a hole is yielded as `undefined` by array entries.
expectType<[0, string] | [1, number | undefined]>({} as Entry<readonly [string, number?]>);

// Destructuring a correlated entry keeps its value narrowable by the key.
function narrowEntry(entry: Entry<{text: string; count: number}>) {
	const [key, value] = entry;

	if (key === 'text') {
		expectType<string>(value);
	} else {
		expectType<number>(value);
	}
}
