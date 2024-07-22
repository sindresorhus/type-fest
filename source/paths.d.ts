import type {StaticPartOfArray, VariablePartOfArray, NonRecursiveType, ToString} from './internal';
import type {EmptyObject} from './empty-object';
import type {IsAny} from './is-any';
import type {IsNever} from './is-never';
import type {UnknownArray} from './unknown-array';
import type {Subtract} from './subtract';
import type {GreaterThan} from './greater-than';

/**
Paths options.

@see {@link Paths}
*/
export type PathsOptions = {
	/**
	The maximum depth to recurse when searching for paths.

	@default 10
	*/
	maxRecursionDepth?: number;
};

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
export type Paths<T, Options extends PathsOptions = {}> =
	T extends NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
		? never
		: IsAny<T> extends true
			? never
			: T extends UnknownArray
				? number extends T['length']
					// We need to handle the fixed and non-fixed index part of the array separately.
					? InternalPaths<StaticPartOfArray<T>, Options>
					| InternalPaths<Array<VariablePartOfArray<T>[number]>, Options>
					: InternalPaths<T, Options>
				: T extends object
					? InternalPaths<T, Options>
					: never;

type InternalPaths<T, Options extends PathsOptions = {}> =
	(Options['maxRecursionDepth'] extends number ? Options['maxRecursionDepth'] : 10) extends infer MaxDepth extends number
		? Required<T> extends infer T
			? T extends EmptyObject | readonly []
				? never
				: {
					[Key in keyof T]:
					Key extends string | number // Limit `Key` to string or number.
						// If `Key` is a number, return `Key | `${Key}``, because both `array[0]` and `array['0']` work.
						?
						| Key
						| ToString<Key>
						| (
							GreaterThan<MaxDepth, 0> extends true // Limit the depth to prevent infinite recursion
								? IsNever<Paths<T[Key], {maxRecursionDepth: Subtract<MaxDepth, 1>}>> extends false
									? `${Key}.${Paths<T[Key], {maxRecursionDepth: Subtract<MaxDepth, 1>}>}`
									: never
								: never
						)
						: never
				}[keyof T & (T extends UnknownArray ? number : unknown)]
			: never
		: never;
