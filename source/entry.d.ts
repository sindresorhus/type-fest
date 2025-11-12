type MapKey<BaseType> = BaseType extends Map<infer KeyType, unknown> ? KeyType : never;
type MapValue<BaseType> = BaseType extends Map<unknown, infer ValueType> ? ValueType : never;

export type _ArrayEntry<BaseType extends readonly unknown[]> = [number, BaseType[number]];
export type _MapEntry<BaseType> = [MapKey<BaseType>, MapValue<BaseType>];
export type _ObjectEntry<BaseType> = [keyof BaseType, BaseType[keyof BaseType]];
export type _SetEntry<BaseType> = BaseType extends Set<infer ItemType> ? [ItemType, ItemType] : never;

/**
Many collections have an `entries` method which returns an array of a given object's own enumerable string-keyed property [key, value] pairs. The `Entry` type will return the type of that collection's entry.

For example the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries|`Object`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries|`Map`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries|`Array`}, and {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries|`Set`} collections all have this method. Note that `WeakMap` and `WeakSet` do not have this method since their entries are not enumerable.

@see `Entries` if you want to just access the type of the array of entries (which is the return of the `.entries()` method).

@example
```
import type {Entry} from 'type-fest';

interface Example {
	someKey: number;
}

const manipulatesEntry = (example: Entry<Example>) => [
	// Does some arbitrary processing on the key (with type information available)
	example[0].toUpperCase(),

	// Does some arbitrary processing on the value (with type information available)
	example[1].toFixed(),
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
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gUQHYyogXzgDMoIQ4ByJVAWmJQGcZKBuAKHeFxSmIEMAxmkwAPfuAA2adOwCQjcigDSKRAC442AK4gARrw4FOgiNmZwQ-bMDDbJ-GExx5EcALxwAFCnFSUmi74ADxiEmDSAHwAlB6RcADa8gD0yXAAIhBMcIogaPxQesB4BW5gZMKMjNwA5nBmCAAWaADWat4A7sWNCMho3MTQVjDADfwAbvzADnrS0fK+4dIJAAwAugB0MBAAqmCoUADC-IwoXtEANJxyqRlZjDlKcAVFJfhw5RCV1dh1DTDNOCTSTaNBeLoA3qoOADIaOUbYZ6Tab8WYoeZyRb+BIARk22wAYsBRCgACbnK5rDjsUzmeBYiIBOBhfweDC5FRqTQ4ggcWkWFC4d6eADyegAVihBDANoK8MAmD4-Izoqs1s8HkFEKFlVE+WYLBBtDA7PBPFYbHYHE5GFqfELENFqbcxZLpYwaQb4BAJVKYCzGWz0PxubzPXT6r7pVrAg7gjQUBBiJG3f7dSh4p4EpR+JQLnA8c60gBBKBQfiID38+AFcuIAPSNnZ3P5wvhiy1itagDK8t+sdc8b6SeeZa76cziRW+ZzlCp7ZrY-rDoAcroDFAByEEyPO-WJ02ca35+xbgBZfhgKteyyXhtoTzYFAdOAXsBeBLNvMFtZrJ0L28wBjZk4x3ZMrCAg8s1nY8izgbsUBga8I1ONMlgfLRn3gxCPxgn9-2rHJEJ7Psai3bUwKItD-EnL8Z1zedCNQrU130XhyKHVAR2YqDEiPH9WCAA)

@category Object
@category Map
@category Array
@category Set
*/
export type Entry<BaseType> =
	BaseType extends Map<unknown, unknown> ? _MapEntry<BaseType>
		: BaseType extends Set<unknown> ? _SetEntry<BaseType>
			: BaseType extends readonly unknown[] ? _ArrayEntry<BaseType>
				: BaseType extends object ? _ObjectEntry<BaseType>
					: never;

export {};
