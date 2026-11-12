import {expectTypeOf} from 'nz';
import type {Primitive, TypedArray, UnknownArray, UnknownCollection, UnknownMap, UnknownSet} from '../index.d.ts';

// Mutable and readonly collections, regardless of their contents.
expectTypeOf<string[]>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<readonly number[]>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<unknown[]>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<any[]>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<never[]>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<Map<string, number>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<ReadonlyMap<symbol, {name: string}>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<Map<unknown, unknown>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<Map<any, any>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<Map<never, never>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<Set<string>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<ReadonlySet<() => void>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<Set<unknown>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<Set<any>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<Set<never>>().toBeAssignableTo<UnknownCollection>();

// Tuples, including optional elements and rest elements at either end.
expectTypeOf<[]>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<readonly []>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<[string, number]>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<readonly [name: string, enabled?: boolean]>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<readonly [string?, number?]>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<[string, ...number[]]>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<readonly [...string[], number]>().toBeAssignableTo<UnknownCollection>();

// Weak keys can be objects, functions, symbols, or a union of them.
expectTypeOf<WeakMap<object, string>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<WeakMap<{id: number}, unknown>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<WeakMap<() => void, number>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<WeakMap<symbol, string>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<WeakMap<WeakKey, any>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<WeakMap<never, never>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<WeakSet<object>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<WeakSet<() => void>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<WeakSet<symbol>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<WeakSet<WeakKey>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<WeakSet<never>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<Readonly<WeakMap<object, number>>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<Readonly<WeakSet<object>>>().toBeAssignableTo<UnknownCollection>();

// Nested contents and extra properties do not affect structural matching.
expectTypeOf<ReadonlyMap<string, ReadonlyArray<Set<Promise<unknown>>>>>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<readonly unknown[] & {name: string}>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<ReadonlyMap<string, number> & {expiresAt: Date}>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<WeakSet<object> & {description: string}>().toBeAssignableTo<UnknownCollection>();

declare class UserMap extends Map<string, {name: string}> {
	lastUpdated: Date;
}

expectTypeOf<UserMap>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<Pick<ReadonlyMap<string, number>, keyof ReadonlyMap<string, number>>>().toBeAssignableTo<UnknownCollection>();

// Similar shapes and other built-ins are outside the supported collection families.
expectTypeOf<unknown>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<object>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<{}>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<Extract<Primitive, UnknownCollection>>().toBe<never>();
expectTypeOf<void>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<{items: string[]}>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<Record<string, number>>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<ArrayLike<string>>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<IArguments>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<{size: number; has(value: unknown): boolean}>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<{0: string; length: 1}>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<Iterable<string>>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<IterableIterator<string>>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<Generator<string>>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<AsyncIterable<string>>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<Extract<TypedArray, UnknownCollection>>().toBe<never>();
expectTypeOf<ArrayBuffer>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<DataView>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<Date>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<RegExp>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<Promise<string[]>>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<() => string[]>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<MapConstructor>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<SetConstructor>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<ArrayConstructor>().not.toBeAssignableTo<UnknownCollection>();

// Selecting union members preserves their complete original types.
type CacheValue = string[] | Map<string, number> | WeakSet<object> | {updatedAt: Date};
expectTypeOf<Extract<CacheValue, UnknownCollection>>().toBe<string[] | Map<string, number> | WeakSet<object>>();
expectTypeOf<Exclude<CacheValue, UnknownCollection>>().toBe<{updatedAt: Date}>();
expectTypeOf<Extract<readonly [1, 2?] | UserMap | undefined, UnknownCollection>>().toBe<readonly [1, 2?] | UserMap>();
expectTypeOf<Extract<string | Date | TypedArray, UnknownCollection>>().toBe<never>();
expectTypeOf<Exclude<UnknownCollection, UnknownArray>>().toBe<UnknownMap | UnknownSet | WeakMap<WeakKey, unknown> | WeakSet<WeakKey>>();
expectTypeOf<Extract<UnknownCollection, Iterable<unknown>>>().toBe<UnknownArray | UnknownMap | UnknownSet>();
expectTypeOf<Exclude<UnknownCollection, Iterable<unknown>>>().toBe<WeakMap<WeakKey, unknown> | WeakSet<WeakKey>>();

// Standard conditional-type behavior for `any`, `never`, and `unknown`.
expectTypeOf<Extract<any, UnknownCollection>>().toBe<any>();
expectTypeOf<Extract<never, UnknownCollection>>().toBe<never>();
expectTypeOf<Extract<unknown, UnknownCollection>>().toBe<never>();
expectTypeOf<Exclude<any, UnknownCollection>>().toBe<any>();
expectTypeOf<Exclude<never, UnknownCollection>>().toBe<never>();
expectTypeOf<Exclude<unknown, UnknownCollection>>().toBe<unknown>();

// A collection constraint accepts readonly inputs and rejects other objects.
declare function cacheCollection<Value extends UnknownCollection>(value: Value): Value;
expectTypeOf(cacheCollection(['admin', 'editor'] as const)).toBe<readonly ['admin', 'editor']>();
expectTypeOf(cacheCollection(new WeakMap<symbol, number>())).toBe<WeakMap<symbol, number>>();
// @ts-expect-error A plain object is not a collection.
cacheCollection({name: 'admin'});
// @ts-expect-error Typed arrays are not included.
cacheCollection(new Uint8Array());

// @ts-expect-error Weak collections do not support iteration.
type CollectionIterator = UnknownCollection[typeof Symbol.iterator];
// @ts-expect-error Not every collection has a size property.
type CollectionSize = UnknownCollection['size'];

// The public alias preserves the complete union used by collection-aware utilities.
expectTypeOf<UnknownCollection>().toBe<
	readonly unknown[] | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | WeakMap<WeakKey, unknown> | WeakSet<WeakKey>
>();

// A homomorphic mapped array remains a collection.
expectTypeOf<Partial<readonly string[]>>().toBeAssignableTo<UnknownCollection>();

// Recursive contents are not inspected when matching a collection.
type NestedArray = Array<number | NestedArray>;
type NestedMap = ReadonlyMap<string, NestedMap>;
expectTypeOf<NestedArray>().toBeAssignableTo<UnknownCollection>();
expectTypeOf<NestedMap>().toBeAssignableTo<UnknownCollection>();

// Subclasses retain their collection interface with additional properties.
declare class UserCache extends WeakMap<symbol, {name: string}> {
	lastUpdated: Date;
}

expectTypeOf<UserCache>().toBeAssignableTo<UnknownCollection>();

// A custom implementation is accepted structurally, without extending a built-in class.
type SymbolRegistry = {
	add(value: symbol): SymbolRegistry;
	delete(value: symbol): boolean;
	has(value: symbol): boolean;
	readonly [Symbol.toStringTag]: string;
};
expectTypeOf<SymbolRegistry>().toBeAssignableTo<UnknownCollection>();

// Optional or incomplete collection interfaces do not make a collection.
expectTypeOf<Partial<ReadonlyMap<string, number>>>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<Pick<WeakSet<symbol>, 'add' | 'has'>>().not.toBeAssignableTo<UnknownCollection>();
expectTypeOf<ArrayLike<unknown> & Iterable<unknown>>().not.toBeAssignableTo<UnknownCollection>();

// A mixed union is not wholly a collection.
expectTypeOf<UserMap | {name: string}>().not.toBeAssignableTo<UnknownCollection>();

// A collection constraint preserves each input type and the types of its payloads.
declare const readonlyUsers: ReadonlyMap<string, {readonly name: string}>;
expectTypeOf(cacheCollection(readonlyUsers)).toBe<ReadonlyMap<string, {readonly name: string}>>();
// @ts-expect-error A nullable collection is not guaranteed to be a collection.
cacheCollection(undefined as string[] | undefined);
