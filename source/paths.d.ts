import type {NonRecursiveType, ToString, IsNumberLike, ApplyDefaultOptions, MapsSetsOrArrays, CountExactInArray} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {GreaterThan} from './greater-than.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Sum} from './sum.d.ts';
import type {And} from './and.d.ts';
import type {OptionalKeysOf} from './optional-keys-of.d.ts';
import type {OptionalPaths} from './optional-paths.d.ts'; // For `@link`
import type {NonNullableDeep} from './non-nullable-deep.d.ts'; // For `@link`

/**
Options for the `Paths` type.

@see {@link Paths}
*/
export type PathsOptions = {
	/**
	The maximum depth to recurse when searching for paths. Range: 0 ~ 10.

	@default 5
	*/
	maxRecursionDepth?: number;

	/**
	The maximum number of times to recurse into a circular reference, like a `parent` property that points back to its own type.

	Use it to limit large self-referencing types without lowering {@link PathsOptions.maxRecursionDepth | `maxRecursionDepth`} for the rest of the type. With `0`, the circular property is included, but `Paths` does not go into it. `maxRecursionDepth` still applies.

	When {@link PathsOptions.leavesOnly | `leavesOnly`} is `true`, a path that stops at this limit counts as a leaf.

	@default number

	@example
	```
	import type {Paths} from 'type-fest';

	type Node = {
		value: string;
		parent: Node;
	};

	type A = Paths<Node, {maxCircularDepth: 0}>;
	//=> 'value' | 'parent'

	type B = Paths<Node, {maxCircularDepth: 1}>;
	//=> 'value' | 'parent' | 'parent.value' | 'parent.parent'
	```
	*/
	maxCircularDepth?: number;

	/**
	Use bracket notation for array indices and numeric object keys.

	@default false

	@example
	```
	import type {Paths} from 'type-fest';

	type ArrayExample = {
		array: ['foo'];
	};

	type A = Paths<ArrayExample, {bracketNotation: false}>;
	//=> 'array' | 'array.0'

	type B = Paths<ArrayExample, {bracketNotation: true}>;
	//=> 'array' | 'array[0]'
	```

	@example
	```
	import type {Paths} from 'type-fest';

	type NumberKeyExample = {
		1: ['foo'];
	};

	type A = Paths<NumberKeyExample, {bracketNotation: false}>;
	//=> 1 | '1' | '1.0'

	type B = Paths<NumberKeyExample, {bracketNotation: true}>;
	//=> '[1]' | '[1][0]'
	```
	*/
	bracketNotation?: boolean;

	/**
	Only include leaf paths in the output.

	A path whose value can be `null` or `undefined` is also a leaf, even if the value can be an object too. An optional property (`?`) is not a leaf because of its `undefined`, unless `exactOptionalPropertyTypes` is enabled and the property type explicitly includes `undefined`. To leave out such paths, remove `null` and `undefined` first with {@link NonNullableDeep}.

	@default false

	@example
	```
	import type {Paths} from 'type-fest';

	type Post = {
		id: number;
		author: {
			id: number;
			name: {
				first: string;
				last: string;
			};
		};
	};

	type AllPaths = Paths<Post, {leavesOnly: false}>;
	//=> 'id' | 'author' | 'author.id' | 'author.name' | 'author.name.first' | 'author.name.last'

	type LeafPaths = Paths<Post, {leavesOnly: true}>;
	//=> 'id' | 'author.id' | 'author.name.first' | 'author.name.last'
	```

	@example
	```
	import type {Paths} from 'type-fest';

	type ArrayExample = {
		array: Array<{foo: string}>;
		tuple: [string, {bar: string}];
	};

	type AllPaths = Paths<ArrayExample, {leavesOnly: false}>;
	//=> 'array' | 'tuple' | `array.${number}` | `array.${number}.foo` | 'tuple.0' | 'tuple.1' | 'tuple.1.bar'

	type LeafPaths = Paths<ArrayExample, {leavesOnly: true}>;
	//=> `array.${number}.foo` | 'tuple.0' | 'tuple.1.bar'
	```

	@example
	```
	import type {NonNullableDeep, Paths} from 'type-fest';

	type User = {
		name: string;
		address: {city: string} | null;
	};

	type LeafPaths = Paths<User, {leavesOnly: true}>;
	//=> 'name' | 'address' | 'address.city'

	type NonNullableLeafPaths = Paths<NonNullableDeep<User>, {leavesOnly: true}>;
	//=> 'name' | 'address.city'
	```
	*/
	leavesOnly?: boolean;

	/**
	Only include paths at the specified depth. By default all paths up to {@link PathsOptions.maxRecursionDepth | `maxRecursionDepth`} are included.

	Note: Depth starts at `0` for root properties.

	@default number

	@example
	```
	import type {Paths} from 'type-fest';

	type Post = {
		id: number;
		author: {
			id: number;
			name: {
				first: string;
				last: string;
			};
		};
	};

	type DepthZero = Paths<Post, {depth: 0}>;
	//=> 'id' | 'author'

	type DepthOne = Paths<Post, {depth: 1}>;
	//=> 'author.id' | 'author.name'

	type DepthTwo = Paths<Post, {depth: 2}>;
	//=> 'author.name.first' | 'author.name.last'

	type LeavesAtDepthOne = Paths<Post, {leavesOnly: true; depth: 1}>;
	//=> 'author.id'
	```
	*/
	depth?: number;

	/**
	Include paths to the elements of arrays and tuples.

	When `false`, the path to an array or tuple is still included, but the paths to its elements are not. With {@link PathsOptions.leavesOnly | `leavesOnly`}, the path to an array or tuple then counts as a leaf. If the given type is itself an array or tuple, the result is `never`.

	Use-case: The paths are used with an API that cannot address array elements, like Firestore field paths.

	@default true

	@example
	```
	import type {Paths} from 'type-fest';

	type Project = {
		filename: string;
		listA: string[];
		listB: [{filename: string}];
		folder: {
			name: string;
		};
	};

	type AllPaths = Paths<Project, {recurseIntoArrays: true}>;
	//=> 'filename' | 'listA' | 'listB' | 'folder' | `listA.${number}` | 'listB.0' | 'listB.0.filename' | 'folder.name'

	type WithoutArrayPaths = Paths<Project, {recurseIntoArrays: false}>;
	//=> 'filename' | 'listA' | 'listB' | 'folder' | 'folder.name'

	type LeafPaths = Paths<Project, {recurseIntoArrays: false; leavesOnly: true}>;
	//=> 'filename' | 'listA' | 'listB' | 'folder.name'
	```
	*/
	recurseIntoArrays?: boolean;

	/**
	Only include paths that do not go through an optional key.

	A key is optional when it has the `?` modifier, so a required key whose type includes `undefined` is still included. Index signatures are not optional, and neither is the `number` index of an array or of a tuple with a rest element. For a union, each member is checked separately, so a key that is optional in one member but required in another is included. With {@link PathsOptions.leavesOnly | `leavesOnly`}, an object whose keys are all optional, or a tuple whose elements are all optional, counts as a leaf, like an empty object.

	Use-case: Get the paths to the properties that must be present, like the required fields of a config. To get the paths to optional keys instead, use {@link OptionalPaths}.

	@default false

	@example
	```
	import type {Paths} from 'type-fest';

	type Project = {
		filename: string;
		size?: number;
		options: {
			timeout?: number;
		};
		folder: {
			name: string;
			subfolder?: {
				filename: string;
			};
		};
	};

	type RequiredPaths = Paths<Project, {requiredOnly: true}>;
	//=> 'filename' | 'options' | 'folder' | 'folder.name'

	type RequiredLeafPaths = Paths<Project, {requiredOnly: true; leavesOnly: true}>;
	//=> 'filename' | 'options' | 'folder.name'
	```
	*/
	requiredOnly?: boolean;
};

type DefaultPathsOptions = {
	maxRecursionDepth: 5;
	maxCircularDepth: number;
	bracketNotation: false;
	leavesOnly: false;
	depth: number;
	recurseIntoArrays: true;
	requiredOnly: false;
};

/**
The types that `Paths` does not recurse into.
*/
type NonRecursivePathsType<Options extends Required<PathsOptions>> =
	| NonRecursiveType
	| Exclude<MapsSetsOrArrays, UnknownArray>
	| (Options['recurseIntoArrays'] extends false ? UnknownArray : never);

/**
The optional keys of the given object, which `Paths` leaves out with `requiredOnly`.
*/
type KeysToSkip<T extends object, Options extends Required<PathsOptions>> = Options['requiredOnly'] extends true ? OptionalKeysOf<T> : never;

/**
Whether every key of the given object, or every element of the given tuple, is optional. Symbol keys are ignored, because `Paths` leaves them out.
*/
type HasOnlyOptionalKeys<Value> = Value extends UnknownArray
	? number extends Value['length'] // A non-tuple array or a tuple with a rest element has an index that is not optional.
		? false
		: [] extends Value
			? true
			: false
	: Value extends object
		? IsNever<Exclude<keyof Value & (string | number), OptionalKeysOf<Value>>>
		: false;

/**
Generate a union of all possible paths to properties in the given object.

It also works with arrays.

Use-case: You want a type-safe way to access deeply nested properties in an object.

Note: With a `string` index signature at the top level, the result is `string`, because TypeScript merges the other paths, like `` `${string}.a` ``, into `string`. Use {@link PathsOptions.leavesOnly | `leavesOnly`} or {@link PathsOptions.depth | `depth`} to get the nested paths.

Note: A key that contains a dot gives a path that reads like a nested path, because every `.` separates two keys. `Paths<{'a.b': {c: number}}>` includes `'a.b.c'`, which `Get`, `PickDeep`, and the other path types read as `a` → `b` → `c`. To read such a key, use the array form of `Get`: `Get<{'a.b': {c: number}}, ['a.b', 'c']>` is `number`.

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
// @ts-expect-error
open('foo'); // TypeError

// Also works with arrays
open('listA.1'); // Pass
open('listB.0'); // Pass
// @ts-expect-error
open('listB.1'); // TypeError. Because listB only has one element.
```

@example
```
import type {Paths} from 'type-fest';

type Users = Record<string, {name: string}>;

type AllPaths = Paths<Users>;
//=> string

type LeafPaths = Paths<Users, {leavesOnly: true}>;
//=> `${string}.name`
```

@category Object
@category Array
*/
export type Paths<T, Options extends PathsOptions = {}> = _Paths<T, ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, Options>>;

type _Paths<T, Options extends Required<PathsOptions>, CurrentDepth extends number = 0, Seen extends unknown[] = []> =
	T extends NonRecursivePathsType<Options>
		? never
		: IsAny<T> extends true
			? never
			: T extends object
				? number extends Options['maxCircularDepth']
					// No limit, so skip tracking the seen types, which would prevent TypeScript from reusing instantiations
					? InternalPaths<Required<T>, Options, CurrentDepth, Seen, KeysToSkip<T, Options>>
					: GreaterThan<CountExactInArray<Seen, T>, Options['maxCircularDepth']> extends true // Limit the depth of circular references
						? never
						: InternalPaths<Required<T>, Options, CurrentDepth, [...Seen, T], KeysToSkip<T, Options>>
				: never;

// `T` has its `?` modifiers removed, so the optional keys to skip are passed in as `SkippedKey`.
type InternalPaths<T, Options extends Required<PathsOptions>, CurrentDepth extends number, Seen extends unknown[], SkippedKey> =
	{[Key in keyof T]: Key extends SkippedKey ? never : Key extends string | number // Leave out the keys in `SkippedKey`, and limit `Key` to `string | number`
		? (
			And<Options['bracketNotation'], IsNumberLike<Key>> extends true
				? `[${Key}]`
				: CurrentDepth extends 0
					// Return both `Key` and `ToString<Key>` because for number keys, like `1`, both `1` and `'1'` are valid keys.
					? Key | ToString<Key>
					: `.${(Key | ToString<Key>)}`
		) extends infer TransformedKey extends string | number
			? ((Options['leavesOnly'] extends true
				? Options['maxRecursionDepth'] extends CurrentDepth
					? TransformedKey
					: IsNever<T[Key]> extends true
						? TransformedKey
						: T[Key] extends infer Value // For distributing `T[Key]`
							? (Value extends readonly [] | NonRecursivePathsType<Options>
								? TransformedKey
								: IsNever<keyof Value & (string | number)> extends true // Check for empty object & `unknown`, because `keyof unknown` is `never`. Symbol keys are ignored, because they have no paths.
									? TransformedKey
									: (Options['requiredOnly'] extends true ? HasOnlyOptionalKeys<Value> : false) extends true // With `requiredOnly`, a value whose keys are all optional has no paths, so it counts as a leaf like an empty object.
										? TransformedKey
										: GreaterThan<CountExactInArray<Seen, Value>, Options['maxCircularDepth']> extends true // The path terminates at the circular reference limit, just like it does at `maxRecursionDepth`.
											? TransformedKey
											: never)
							: never // Should never happen
				: TransformedKey
			) extends infer _TransformedKey
				// If `depth` is provided, the condition becomes truthy only when it matches `CurrentDepth`.
				// Otherwise, since `depth` defaults to `number`, the condition is always truthy, returning paths at all depths.
				? CurrentDepth extends Options['depth']
					? _TransformedKey
					: never
				: never)
			// Recursively generate paths for the current key
			| (GreaterThan<Options['maxRecursionDepth'], CurrentDepth> extends true // Limit the depth to prevent infinite recursion
				? `${TransformedKey}${_Paths<T[Key], Options, Sum<CurrentDepth, 1>, Seen> & (string | number)}`
				: never)
			: never
		: never
	}[keyof T & (T extends UnknownArray ? number : unknown)];

export {};
