import {ArrayEntry, MapEntry, ObjectEntry, SetEntry} from './entry';

type ArrayEntries<BaseType extends readonly unknown[]> = Array<ArrayEntry<BaseType>>;
type MapEntries<BaseType> = Array<MapEntry<BaseType>>;
type ObjectEntries<BaseType> = Array<ObjectEntry<BaseType>>;
type SetEntries<BaseType extends Set<unknown>> = Array<SetEntry<BaseType>>;

/**
Many collections have a `.entries()` method that will return an enumerable array of that structure's keys and values. The `Entries` type will return the type of that collection's entries given the type itself.

For example the `Object`, `Map`, `Array`, and `Set` collections all have this method. Note that since `WeakMap` and `WeakSet` do not have this method since their entries are not enumerable.

@see `Entry` if you want to just access the type of a single entry.

@example
```
interface Example {
	someKey: number;
}

const manipulatesEntries = (examples: Entries<Example>) => {
	return examples.map(example => [
		// does some arbitrary processing on the key (with type information available)
		example[0].toUpperCase(),

		// does some arbitrary processing on the value (with type information available)
		example[1].toFixed(),
	]);
};

const example: Example = { someKey: 1 };
const entries = Object.entries(example) as Entries<Example>;
const output = manipulatesEntries(entries);

// Objects
const objectExample = { a: 1 };
const objectEntries: Entries<typeof objectExample> = [['a', 1]];

// Maps
const mapExample = new Map([['a', 1]]);
const mapEntries: Entries<typeof map> = [['a', 1]];

// Arrays
const arrayExample = ['a', 1];
const arrayEntries: Entries<typeof arrayExample> = [[0, 'a'], [1, 1]];

// Sets
const setExample = new Set(['a', 1]);
const setEntries: Entries<typeof setExample> = [['a', 'a'], [1, 1]];
```
*/
export type Entries<BaseType> =
		BaseType extends Map<unknown, unknown> ? MapEntries<BaseType>
	: BaseType extends Set<unknown> ? SetEntries<BaseType>
	: BaseType extends unknown[] ? ArrayEntries<BaseType>
	: BaseType extends object ? ObjectEntries<BaseType>
	: never;
