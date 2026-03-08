type MapKey<BaseType> = BaseType extends Map<infer KeyType, unknown> ? KeyType : never;
type MapValue<BaseType> = BaseType extends Map<unknown, infer ValueType> ? ValueType : never;

export type _ArrayEntry<BaseType extends readonly unknown[]> = [number, BaseType[number]];
export type _MapEntry<BaseType> = [MapKey<BaseType>, MapValue<BaseType>];
/**
Create a type that represents the type of an entry of an object type.

This is useful when you want to work with `Object.entries()` directly without going through the generic {@link Entry} type, which may lose type information with generic type parameters due to TypeScript's conditional type limitations.

@see {@link ObjectEntries} for the array of all entries.
@see {@link Entry} for a version that works with all collection types.

@example
```
import type {ObjectEntry} from 'type-fest';

type Example = {
	a: number;
	b: string;
};

type ExampleEntry = ObjectEntry<Example>;
//=> [keyof Example, number | string]
```

@category Object
*/
export type ObjectEntry<BaseType> = [keyof BaseType, BaseType[keyof BaseType]];
export type _SetEntry<BaseType> = BaseType extends Set<infer ItemType> ? [ItemType, ItemType] : never;

/**
Many collections have an `entries` method which returns an array of a given object's own enumerable string-keyed property [key, value] pairs. The `Entry` type will return the type of that collection's entry.

For example the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries|`Object`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries|`Map`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries|`Array`}, and {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries|`Set`} collections all have this method. Note that `WeakMap` and `WeakSet` do not have this method since their entries are not enumerable.

@see `Entries` if you want to just access the type of the array of entries (which is the return of the `.entries()` method).

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
	BaseType extends Map<unknown, unknown> ? _MapEntry<BaseType>
		: BaseType extends Set<unknown> ? _SetEntry<BaseType>
			: BaseType extends readonly unknown[] ? _ArrayEntry<BaseType>
				: BaseType extends object ? ObjectEntry<BaseType>
					: never;

export {};
