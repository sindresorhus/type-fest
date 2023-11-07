import type {EmptyObject} from './empty-object';
import type {IsAny} from './is-any';
import type {IsNever} from './is-never';
import type {UnknownArray} from './unknown-array';
import type {UnknownRecord} from './unknown-record';

type ToString<T> = T extends string | number ? `${T}` : never;

/**
Return the part of the given array with fixed index

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
Return the part of the given array with not fixed index

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
Generate a union of all possible paths to properties in the given object. Also works with arrays.

Use-case: You want a type-safe way to access deeply nested properties in an object.

@example
```
import type {Paths} from 'type-fest';

type Project = {
	filename: string;
	filelist1: string[];
	filelist2: [{filename: string}];
	folder: {
		subfolder: {
			filename: string;
		};
	};
};

type ProjectPaths = Paths<Project>;
//=> "filename" | "filelist" | "filelist2" | "folder" | `filelist1.${number}` | "filelist2.0" | "filelist2.0.filename" | "folder.subfolder" | "folder.subfolder.filename"

declare function open<Path extends ProjectPaths>(path: Path): void;

open('filename'); // Pass
open('folder.subfolder'); // Pass
open('folder.subfolder.filename'); // Pass
open('foo'); // TypeError

// Also works with arrays
open('filelist1.1'); // Pass
open('filelist2.0'); // Pass
open('filelist2.1'); // TypeError. Because filelist2 only has one element
```

@category Object
*/
export type Paths<T extends UnknownRecord | UnknownArray> =
	IsAny<T> extends true
		? never
		: T extends UnknownArray
			? number extends T['length']
				// Need handle the fixed index part of array and not fixed index part of array separately
				? InternalPaths<FilterFixedIndexArray<T>>
				| InternalPaths<Array<FilterNotFixedIndexArray<T>[number]>>
				: InternalPaths<T>
			: InternalPaths<T>;

export type InternalPaths<_T extends UnknownRecord | UnknownArray, T = Required<_T>> =
	T extends EmptyObject | readonly []
		? never
		: {
			[Key in keyof T]:
			Key extends string | number // Limit `Key` to string or number
				? T[Key] extends UnknownRecord | UnknownArray
					? (
						IsNever<Paths<T[Key]>> extends false
						// If `Key` is number, return `Key | `${Key}``. Because both `array[0]` and `array['0']` are work.
							? Key | ToString<Key> | `${Key}.${Paths<T[Key]>}`
							: Key | ToString<Key>
					)
					: Key | ToString<Key>
				: never
		}[keyof T & (T extends UnknownArray ? number : unknown)];
