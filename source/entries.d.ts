import type {_ArrayEntry, _MapEntry, _ObjectEntry, _SetEntry} from './entry.d.ts';

type ArrayEntries<BaseType extends readonly unknown[]> = Array<_ArrayEntry<BaseType>>;
type MapEntries<BaseType> = Array<_MapEntry<BaseType>>;
type ObjectEntries<BaseType> = Array<_ObjectEntry<BaseType>>;
type SetEntries<BaseType extends Set<unknown>> = Array<_SetEntry<BaseType>>;

/**
Many collections have an `entries` method which returns an array of a given object's own enumerable string-keyed property [key, value] pairs. The `Entries` type will return the type of that collection's entries.

For example the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries|`Object`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries|`Map`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries|`Array`}, and {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries|`Set`} collections all have this method. Note that `WeakMap` and `WeakSet` do not have this method since their entries are not enumerable.

@see `Entry` if you want to just access the type of a single entry.

@example
```
import type {Entries} from 'type-fest';

interface Example {
	someKey: number;
}

const manipulatesEntries = (examples: Entries<Example>) => examples.map(example => [
	// Does some arbitrary processing on the key (with type information available)
	example[0].toUpperCase(),

	// Does some arbitrary processing on the value (with type information available)
	example[1].toFixed()
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
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gUQHYysFAZwF84AzKCEOAciVQFoyiYaBuAKA+FxSjICGAYzSYAHgPAAbNOg4BIQlRQBpFIgBccbAFcQAIz6diXIRGyF4IAdmBgdUgTCI48BQnAC8cABQoJ0kRarvhEADzikmAyAHwAlF4xcP5RMoQAdNZgfgHRaJ5JANoKAPQlcAAiEERwSiBoAlD6wHiNiHBglCKEhDwA5nDmCAAWaADW6r4A7i3DCMhoPGTQ1jDAQwIAbgLAjvoycQopgYUADAC66TAQAKpgqFAAwgKEKD5xADRc8mWV1R51BpNFpQNodLpEXrYAZDGCjODbKQ6NA+GZw+aoOBLFZOdbYOBbHZ7A5HXIyQoARku1wAYsAxCgACbvDjnOKcDhmCzwY55YJk-IYQFqTRwCnEThcyzJXChDzeADy+gAVighDB0ihZe4cqkUAkXnAQu4IgKYpLzNKIDoYPZ4N5rLZ7I5nIRjUQ-NqiOyuL8lar1YROZb4BAVWqYJFAl4MAItOKLdzBuH1e7CMEvYQwvQUBAyMmA5GzTHCoUaAIaB8xedzhzfgBBKCgxBBqXwRrNqN5EvlyvVxPSjsCRBpjNucI5vMEpvDruxEtnKu985VylVqm133lACyAjArZDcCyc8F2BQUzgu+ypd765rPrbR73o6NmezCynx+L3hvFbvm44X4AGUUBgA8k1eIs9RjM8LxAmAfDLP9qwfQ9IJfNN31QKd0O-OBfz7ZdVwpf82CAA)

@category Object
@category Map
@category Set
@category Array
*/
export type Entries<BaseType> =
	BaseType extends Map<unknown, unknown> ? MapEntries<BaseType>
		: BaseType extends Set<unknown> ? SetEntries<BaseType>
			: BaseType extends readonly unknown[] ? ArrayEntries<BaseType>
				: BaseType extends object ? ObjectEntries<BaseType>
					: never;

export {};
