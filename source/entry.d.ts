import type {ObjectEntries} from './entries.d.ts'; // For `@link`

type MapKey<BaseType> = BaseType extends ReadonlyMap<infer KeyType, unknown> ? KeyType : never;
type MapValue<BaseType> = BaseType extends ReadonlyMap<unknown, infer ValueType> ? ValueType : never;

/**
The key-value pairs `Array.prototype.entries` yields.

An array of unknown length has one index type and one element type, so a single pair describes every entry. A tuple has an index per position, so it gets one pair per position instead, which keeps each index paired with its own element: `[1, 'a']` is not an entry of `['a', 1]`.
*/
export type _ArrayEntry<BaseType extends readonly unknown[]> = number extends BaseType['length']
	? [number, BaseType[number]]
	: keyof BaseType extends infer Key
		// A tuple's positions are its numeric keys, spelled as strings. Anything else on `keyof` belongs to the array every tuple is, so it is not an index and has no entry.
		? Key extends `${infer Index extends number}`
			? [Index, BaseType[Key & keyof BaseType]]
			: never
		: never;
export type _MapEntry<BaseType> = [MapKey<BaseType>, MapValue<BaseType>];
/**
The key-value pairs `Object.entries` yields.

The result is one pair per key rather than a single pair over the union of the keys and the union of the values, so that a key stays paired with its own value: `Object.entries({a: 'x', b: 1})` never yields `['b', 'x']`. The uncorrelated form also made this type's own example fail on a second member, since `example[1]` would no longer be known to be a number.
*/
export type _ObjectEntry<BaseType extends object> = [keyof BaseType] extends [never]
	// A type with no keys at all, such as `object`, gives a pair of `never`s rather than `never`, so the entries of a generic `T extends object`, which are read through that constraint, can still be destructured.
	? [never, never]
	: ObjectEntry<BaseType>;

/**
Create a type that describes a single key-value pair produced by `Object.entries`, even for a generic object type.

Use-case: Type the result of `Object.entries` in a generic function. `Entry` handles several kinds of collections, so for a type parameter, TypeScript reads it through the constraint. For `ObjectType extends Record<string, unknown>`, the key and value become `string` and `unknown`.

Each key stays paired with its own value. A number key becomes a string, and a symbol key has no entry, since `Object.entries` only yields string keys.

Note: For a union of object types, use `Entry`, because `ObjectEntry` only includes the keys that every member has. `ObjectEntry` is not for arrays, because it also includes `length` and the array methods.

Note: To index a generic object with a key, use `object[key as keyof ObjectType]`. A number key is a string here, and TypeScript cannot match it to the number in `keyof ObjectType`. This is not needed when the constraint has a string index signature, such as `Record<string, unknown>`.

@example
```
import type {ObjectEntry} from 'type-fest';

type Example = {
	a: number;
	b: string;
};

type ExampleEntry = ObjectEntry<Example>;
//=> ['a', number] | ['b', string]

function logEntries<ObjectType extends Record<string, unknown>>(object: ObjectType) {
	for (const [key, value] of Object.entries(object) as Array<ObjectEntry<ObjectType>>) {
		// `key` is a key of `ObjectType` as a string, and `value` is a value of `ObjectType`. With `Entry`, they would be `string` and `unknown`.
		console.log(key, value);
	}
}
```

@see {@link ObjectEntries}
@see {@link Entry}

@category Object
*/
export type ObjectEntry<BaseType extends object> =
	// `never` has every key, so it would otherwise give a pair for each kind of key. The check is not distributive, so a generic `BaseType` is not read through its constraint.
	[BaseType] extends [never]
		? never
		: {
			// `Object.entries` yields every key as a string, because every property key is a string or a symbol at runtime, so a numeric key arrives as its string form. A string key is kept as it is, so a string enum or a branded key keeps its type.
			[Key in Exclude<keyof BaseType, symbol>]: [(Key & string) | `${Key & number}`, BaseType[Key]]
		// A mapped type indexed by its own keys, rather than a conditional type, pairs each key with its own value and still resolves for a generic `BaseType`. A type with only symbol keys has no entry at all, because `Object.entries` never yields one.
		}[Exclude<keyof BaseType, symbol>];

export type _SetEntry<BaseType> = BaseType extends ReadonlySet<infer ItemType> ? [ItemType, ItemType] : never;

/**
Create a type that describes a single key-value pair produced when calling a collection’s `entries` method.

For example the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries|`Object`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries|`Map`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries|`Array`}, and {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries|`Set`} collections all have this method. Note that `WeakMap` and `WeakSet` do not have this method since their entries are not enumerable.

@see `Entries` if you want to just access the type of the array of entries (which is the return of the `.entries()` method).
@see `ObjectEntry` for the entry of a generic object type.

@example
```
import type {Entry} from 'type-fest';

type Example = {
	someKey: number;
};

const manipulatesEntry = (example: Entry<Example>) => [
	// Does some arbitrary processing on the key (with type information available)
	example[0].toUpperCase(),

	// Does some arbitrary processing on the value (with type information available)
	example[1].toFixed(0),
];

const example: Example = {someKey: 1};
const entry = Object.entries(example)[0] as Entry<Example>;
const output = manipulatesEntry(entry);

// Objects
const objectExample = {a: 1};
const objectEntry: Entry<typeof objectExample> = ['a', 1];

// Arrays
const arrayExample = ['a', 1];
const arrayEntryString: Entry<typeof arrayExample> = [0, 'a'];
const arrayEntryNumber: Entry<typeof arrayExample> = [1, 1];

// Maps
const mapExample = new Map([['a', 1]]);
const mapEntry: Entry<typeof mapExample> = ['a', 1];

// Sets
const setExample = new Set(['a', 1]);
const setEntryString: Entry<typeof setExample> = ['a', 'a'];
const setEntryNumber: Entry<typeof setExample> = [1, 1];
```

@category Object
@category Map
@category Array
@category Set
*/
export type Entry<BaseType> =
	// `Map` and `Set` are assignable to `ReadonlyMap` and `ReadonlySet`, so they are matched through those. A map must be matched before a set, because a map is also assignable to `ReadonlySet`.
	BaseType extends ReadonlyMap<unknown, unknown> ? _MapEntry<BaseType>
		: BaseType extends ReadonlySet<unknown> ? _SetEntry<BaseType>
			// A `WeakMap` and a `WeakSet` have no `entries` method, so there is no entry to describe. They are matched before plain objects, because they would otherwise be treated as one. They must come after `Map` and `Set`, because the methods of `WeakMap` and `WeakSet` are compared bivariantly, which makes a `Map` with object keys assignable to `WeakMap<WeakKey, unknown>`.
			: BaseType extends WeakMap<WeakKey, unknown> | WeakSet<WeakKey> ? never
				: BaseType extends readonly unknown[] ? _ArrayEntry<BaseType>
					: BaseType extends object ? _ObjectEntry<BaseType>
						: never;

export {};
