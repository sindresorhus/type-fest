import type {EmptyObject} from './empty-object';
import type {UnknownArray} from './unknown-array';
import type {UnknownRecord} from './unknown-record';

type ToString<T> = T extends string | number ? `${T}` : '';

/**
Generate a union of all the possible paths in given object.

Use-case: You want a type-safe way to access deeply nested properties in an object.

@example
```
import type {Paths} from 'type-fest';

type Project = {
	fileName: string;
	folder: {
		subfolder: {
			fileName: string;
		};
	};
};

type ProjectPaths = Paths<Project>;
//=> "fileName" | "folder" | "folder.subfolder" | "folder.subfolder.fileName"

declare function open<Path extends ProjectPaths>(path: Path): void;

open('fileName'); // Pass
open('folder.subfolder'); // Pass
open('folder.subfolder.fileName'); // Pass
open('foo'); // TypeError
```

@category Object
*/
export type Paths<T extends UnknownRecord | UnknownArray, RecordType = Required<T>> =
RecordType extends EmptyObject | []
	? ''
	: {
		[Key in keyof RecordType]: RecordType[Key] extends UnknownRecord | UnknownArray
			? Key extends string | number // Handle TS Error: Type instantiation is excessively deep and possibly infinite.
				?
				(
					`${Paths<RecordType[Key]>}` extends ''
						? ToString<Key>
						: ToString<Key> | `${ToString<Key>}.${Paths<RecordType[Key]>}`
				)
				: ToString<Key>
			: ToString<Key>
	}[keyof RecordType & (RecordType extends UnknownArray ? number : unknown)];
