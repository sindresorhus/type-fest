import type {ToString} from './internal';
import type {EmptyObject} from './empty-object';
import type {IsAny} from './is-any';
import type {IsNever} from './is-never';
import type {UnknownArray} from './unknown-array';
import type {UnknownRecord} from './unknown-record';

/**
Return the part of the given array with a fixed index.

@example
```
type A = [string, number, boolean, ...string[]];
type B = FilterFixedIndexArray<A>;
//=> [string, number, boolean]
```
*/
type FilterFixedIndexArray<T extends UnknownArray, Result extends UnknownArray = []> =
	number extends T['length'] ?
		T extends readonly [infer U, ...infer V]
			? FilterFixedIndexArray<V, [...Result, U]>
			: Result
		: T;

/**
Return the part of the given array with a non-fixed index.

@example
```
type A = [string, number, boolean, ...string[]];
type B = FilterNotFixedIndexArray<A>;
//=> string[]
```
*/
type FilterNotFixedIndexArray<T extends UnknownArray> =
T extends readonly [...FilterFixedIndexArray<T>, ...infer U]
	? U
	: [];

/**
Generate a union of all possible paths to properties in the given object.

It also works with arrays.

Use-case: You want a type-safe way to access deeply nested properties in an object.

@example
```
import type {Paths} from 'type-fest';

type Project = {
	filename: string;
	listA: string[];
	listB: [{filename: string}];
	folder: {
		subfolder: {
			filename: string;
		};
	};
};

type ProjectPaths = Paths<Project>;
//=> 'filename' | 'listA' | 'listB' | 'folder' | `listA.${number}` | 'listB.0' | 'listB.0.filename' | 'folder.subfolder' | 'folder.subfolder.filename'

declare function open<Path extends ProjectPaths>(path: Path): void;

open('filename'); // Pass
open('folder.subfolder'); // Pass
open('folder.subfolder.filename'); // Pass
open('foo'); // TypeError

// Also works with arrays
open('listA.1'); // Pass
open('listB.0'); // Pass
open('listB.1'); // TypeError. Because listB only has one element.
```

@category Object
@category Array
*/
export type Paths<T extends UnknownRecord | UnknownArray> =
	IsAny<T> extends true
		? never
		: T extends UnknownArray
			? number extends T['length']
				// We need to handle the fixed and non-fixed index part of the array separately.
				? InternalPaths<FilterFixedIndexArray<T>>
				| InternalPaths<Array<FilterNotFixedIndexArray<T>[number]>>
				: InternalPaths<T>
			: InternalPaths<T>;

export type InternalPaths<_T extends UnknownRecord | UnknownArray, T = Required<_T>> =
	T extends EmptyObject | readonly []
		? never
		: {
			[Key in keyof T]:
			Key extends string | number // Limit `Key` to string or number.
				? T[Key] extends UnknownRecord | UnknownArray
					? (
						IsNever<Paths<T[Key]>> extends false
							// If `Key` is a number, return `Key | `${Key}``, because both `array[0]` and `array['0']` work.
							? Key | ToString<Key> | `${Key}.${Paths<T[Key]>}`
							: Key | ToString<Key>
					)
					: Key | ToString<Key>
				: never
		}[keyof T & (T extends UnknownArray ? number : unknown)];
