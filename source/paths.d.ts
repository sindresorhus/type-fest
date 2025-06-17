import type {ExtendsStrict} from './extends-strict.d.ts';
import type {IsStringLiteral} from './is-literal.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {LiteralUnion} from './literal-union.d.ts';
import type {EmptyObject} from './empty-object.d.ts';
import type {Subtract} from './subtract.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {
	ApplyDefaultOptions,
	VariablePartOfArray,
	StaticPartOfArray,
	NonRecursiveType,
	CollapseLiterals,
	IsNumberLike,
	EmptyArray,
	ToString,
	OwnKeys,
} from './internal/index.d.ts';

/**
Paths options.

@see {@link Paths}
*/
export type PathsOptions = {
	/**
	The maximum depth to recurse when searching for paths. Range: 0 ~ 10.

	@default 5
	*/
	maxRecursionDepth?: number;

	/**
	Use bracket notation for array indices and numeric object keys.

	@default false

	@example
	```
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

	@default false

	@example
	```
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
	type ArrayExample = {
		array: Array<{foo: string}>;
		tuple: [string, {bar: string}];
	};

	type AllPaths = Paths<ArrayExample, {leavesOnly: false}>;
	//=> 'array' | `array.${number}` | `array.${number}.foo` | 'tuple' | 'tuple.0' | 'tuple.1' | 'tuple.1.bar'

	type LeafPaths = Paths<ArrayExample, {leavesOnly: true}>;
	//=> `array.${number}.foo` | 'tuple.0' | 'tuple.1.bar'
	```
	*/
	leavesOnly?: boolean;

	/**
	Only include paths at the specified depth. By default all paths up to {@link PathsOptions.maxRecursionDepth | `maxRecursionDepth`} are included.

	Note: Depth starts at `0` for root properties.

	@default number

	@example
	```
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
};

type DefaultPathsOptions = {
	maxRecursionDepth: 5;
	bracketNotation: false;
	leavesOnly: false;
	depth: number;
};

type PathableKeys = string | number;

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
export type Paths<T, Options extends PathsOptions = {}> = _Paths<T, ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, Options>>;

type _Paths<T, Options extends Required<PathsOptions>> =
	T extends NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
		? never
		: IsAny<T> extends true
			? never
			: T extends UnknownArray
				? number extends T['length']
					? // We need to handle the fixed and non-fixed index part of the array separately.
					| InternalPaths<StaticPartOfArray<T>, Options> // ! Should this be updated to use `ExcludeRestElement`.
					| InternalPaths<Array<VariablePartOfArray<T>[number]>, Options> // ! And this to use `ExtractRestElement`.
					: InternalPaths<T, Options>
				: T extends object
					? InternalPaths<T, Options>
					: never;

/**
Transform object key based on notation style:
 1. If `BracketNotation` is true and 'Key' is a number-like value like 3 or '3', transform 'Key' to `[${Key}]`, else to `${Key}` | Key
 2. Otherwise, transform 'Key' to `${Key}` | Key
*/
type TransformKey<Key extends PathableKeys, BracketNotation> =
	BracketNotation extends true
		? IsNumberLike<Key> extends true
			? `[${Key}]`
			: Key // If `Key` is not a `number` so its a `string`.
		: (Key | ToString<Key>); // If `Key` is a `number`, return `Key | `${Key}``.

/**
Filter object values for `leaves`.
*/
type FilterLeaves<T, K extends keyof T, Key, MaxDepth, LeavesOnly> =
	LeavesOnly extends true
		? MaxDepth extends 0
			? Key
			: T[K] extends EmptyObject | EmptyArray | NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
				? Key
				: never
		: Key;

/**
Filter out wide string types (e.g., `string`, `Uppercase<string>`), and return there `LiteralUnion` form.

So `string` became `(string & {})` and `on${number}` -> `(on${number} & {})`.
*/
type FilterWideTypes<Key> =
	Key extends string
		? ExtendsStrict<`${Key}`, `${number}` | `[${number}]`> extends false // Exclude pure `number` keys.
			? IsStringLiteral<Key> extends false // TODO: Replace with `IsStringPrimitive` when approved.
				? LiteralUnion<never, Key> // Prevent returning wide types like `string`, instead returns `(string & {})`.
				: Key // If `Key` is a literal no need to wrap it in `LiteralUnion`
			: Key
		: Key;

/**
Strict check whether `T` is a wide primitive (`string` or `number`).
*/
type IsPrimitive<T> = ExtendsStrict<string, T> | ExtendsStrict<number, T>;

/**
Concatenate the current path segment with the next one.
*/
type JoinPath<T extends PathableKeys, K extends PathableKeys, BracketNotation> =
	BracketNotation extends true
		? K extends `[${PathableKeys}]${string}` // Check if its a bracket notation.
			? `${T}${K}` // If next node is `number` key like `[3]`, no need to add `.` before it.
			: `${T}.${K}`
		: `${T}.${K}`;

type InternalPaths<T, Options extends Required<PathsOptions>> =
	Options extends { // Spreading Options for easier work.
		bracketNotation: infer BracketNotation extends boolean;
		maxRecursionDepth: infer MaxDepth extends number;
		leavesOnly: infer LeavesOnly extends boolean;
		depth: infer Depth extends number;
	} ? Required<T> extends infer T
			? IsNever<OwnKeys<T>> extends true
				? never // Ignore empty array/object but not index signature types (e.g, `Record<string, number>`).
				: {
					[Key in keyof T as Key extends OwnKeys<T> // Map over own property keys only.
						? IsStringLiteral<Key> extends true
							? Key
							: '_' // Placeholder for wide types.
						: never
					]: Key extends PathableKeys // Limit `Key` to string or number.
						? TransformKey<Key, BracketNotation> extends infer TranformedKey extends PathableKeys
							? (
								// If `depth` is provided, the condition becomes truthy only when it reaches `0`.
								// Otherwise, since `depth` defaults to `number`, the condition is always truthy, returning paths at all depths.
								0 extends Depth
									? FilterWideTypes<
										FilterLeaves<T, Key, TranformedKey, MaxDepth, LeavesOnly>
									> // Wrap wide types with a `LiteralUnion` syntax (type & {}).
									: never
							) | (
								// Recursively generate paths for the current key
								MaxDepth extends 0
									? never // Limit the depth to prevent infinite recursion
									: _Paths<T[Key], {
										maxRecursionDepth: Subtract<MaxDepth, 1>;
										bracketNotation: BracketNotation;
										depth: Subtract<Depth, 1>;
										leavesOnly: LeavesOnly;
									}> extends infer SubPath
										? SubPath extends PathableKeys // To distribute `SubPath`
											? FilterWideTypes<
												JoinPath<
													TranformedKey,
													CollapseLiterals<SubPath>, // Remove `{}` from (type & {}) in nested paths.
													BracketNotation
												>
											> // Wrap wide types with a `LiteralUnion` syntax (type & {}).
											: never
										: never
							)
							: never
						: never
				} extends infer Result
					? Result[keyof Result]
					: never
			: never
		: never;
