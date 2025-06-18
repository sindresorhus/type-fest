import type {ExtendsStrict} from './extends-strict.d.ts';
import type {IsStringLiteral} from './is-literal.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {LiteralUnion} from './literal-union.d.ts';
import type {GreaterThan} from './greater-than.d.ts';
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
					// We need to handle the fixed and non-fixed index part of the array separately.
					? InternalPaths<StaticPartOfArray<T>, Options> | InternalPaths<Array<VariablePartOfArray<T>[number]>, Options>
					: InternalPaths<T, Options>
				: T extends object
					? InternalPaths<T, Options>
					: never;

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

type InternalPaths<T, Options extends Required<PathsOptions>> =
	Options['maxRecursionDepth'] extends infer MaxDepth extends number
		? Required<T> extends infer T
			? OwnKeys<T> extends infer _OwnKeys
				? IsNever<_OwnKeys> extends true
					? never // Ignore empty array/object but not index signature types (e.g, `Record<string, number>`).
					: {
						[Key in keyof T as Key extends _OwnKeys // Map over own property keys only.
							? IsStringLiteral<Key> extends true
								? Key
								: '_' // Placeholder for wide types.
							: never
						]: Key extends PathableKeys // Limit `Key` to string or number.
							? (
								Options['bracketNotation'] extends true
									? IsNumberLike<Key> extends true
										? `[${Key}]`
										: (Key | ToString<Key>)
									: Options['bracketNotation'] extends false
									// If `Key` is a number, return `Key | `${Key}``, because both `array[0]` and `array['0']` work.
										? (Key | ToString<Key>)
										: never
							) extends infer TranformedKey extends PathableKeys ?
							// 1. If style is 'a[0].b' and 'Key' is a numberlike value like 3 or '3', transform 'Key' to `[${Key}]`, else to `${Key}` | Key
							// 2. If style is 'a.0.b', transform 'Key' to `${Key}` | Key
							| ((Options['leavesOnly'] extends true
								? MaxDepth extends 0
									? TranformedKey
									: T[Key] extends infer Value
										? Value extends NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
											? TranformedKey
											: IsNever<OwnKeys<Value>> extends true // Check for empty object/array
												? TranformedKey
												: never
										: never
								: TranformedKey
							) extends infer LeafKeys
								// If `depth` is provided, the condition becomes truthy only when it reaches `0`.
								// Otherwise, since `depth` defaults to `number`, the condition is always truthy, returning paths at all depths.
								? 0 extends Options['depth']
									? FilterWideTypes<LeafKeys>
									: never
								: never)
							| (
								// Recursively generate paths for the current key
								GreaterThan<MaxDepth, 0> extends true // Limit the depth to prevent infinite recursion
									? _Paths<T[Key],
										{
											bracketNotation: Options['bracketNotation'];
											maxRecursionDepth: Subtract<MaxDepth, 1>;
											leavesOnly: Options['leavesOnly'];
											depth: Subtract<Options['depth'], 1>;
										}> extends infer SubPath
										? SubPath extends PathableKeys
											? CollapseLiterals<SubPath> extends infer _SubPath extends PathableKeys
												? FilterWideTypes<
													Options['bracketNotation'] extends true
														? SubPath extends `[${any}]` | `[${any}]${string}`
															? `${TranformedKey}${_SubPath}` // If next node is number key like `[3]`, no need to add `.` before it.
															: `${TranformedKey}.${_SubPath}`
														: `${TranformedKey}.${_SubPath}`
												>
												: never
											: never
										: never
									: never
								)
								: never
							: never
					} extends infer Result
						? Result[keyof Result] // Convert to union.
						: never
				: never
			: never
		: never;
