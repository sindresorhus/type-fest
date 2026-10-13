import type {Entry, ObjectEntry} from './entry.d.ts';

/**
Create a type that represents the type of the entries of an object type.

This is useful when you want to work with `Object.entries()` directly without going through the generic {@link Entries} type, which may lose type information with generic type parameters due to TypeScript's conditional type limitations.

@see {@link ObjectEntry} for the type of a single entry.
@see {@link Entries} for a version that works with all collection types.

@example
```
import type {ObjectEntries} from 'type-fest';

type Example = {
	a: number;
	b: string;
};

type ExampleEntries = ObjectEntries<Example>;
//=> ObjectEntry<Example>[]
```

@category Object
*/
export type ObjectEntries<BaseType> = Array<ObjectEntry<BaseType>>;

/**
Create a type that describes the key-value pairs produced when calling a collection’s `entries` method.

For example the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries|`Object`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries|`Map`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries|`Array`}, and {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries|`Set`} collections all have this method. Note that `WeakMap` and `WeakSet` do not have this method since their entries are not enumerable.

@see `Entry` if you want to just access the type of a single entry.

@example
```
import type {Entries} from 'type-fest';

type Example = {
	someKey: number;
};

const manipulatesEntries = (examples: Entries<Example>) => examples.map(example => [
	// Does some arbitrary processing on the key (with type information available)
	example[0].toUpperCase(),

	// Does some arbitrary processing on the value (with type information available)
	example[1].toFixed(0),
]);

const example: Example = {someKey: 1};
const entries = Object.entries(example) as Entries<Example>;
const output = manipulatesEntries(entries);

// Objects
const objectExample = {a: 1};
const objectEntries: Entries<typeof objectExample> = [['a', 1]];

// Arrays
const arrayExample = ['a', 1];
const arrayEntries: Entries<typeof arrayExample> = [[0, 'a'], [1, 1]];

// Maps
const mapExample = new Map([['a', 1]]);
const mapEntries: Entries<typeof mapExample> = [['a', 1]];

// Sets
const setExample = new Set(['a', 1]);
const setEntries: Entries<typeof setExample> = [['a', 'a'], [1, 1]];
```

@category Object
@category Map
@category Set
@category Array
*/
export type Entries<BaseType> =
	// A `WeakMap` and a `WeakSet` have no `entries` method, so there are no entries to describe, not even an empty list of them.
	BaseType extends WeakMap<WeakKey, unknown> | WeakSet<WeakKey>
		// The methods of `WeakMap` and `WeakSet` are compared bivariantly, so a `Map` with object keys or a `Set` with object items also lands here, and it does have entries. It is checked here rather than first so that the entries of a generic `T extends object` are still read as `[never, never][]`.
		? BaseType extends ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
			? Array<Entry<BaseType>>
			: never
		: BaseType extends object
			? Array<Entry<BaseType>>
			: never;

export {};
