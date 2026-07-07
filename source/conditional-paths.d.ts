import type {NonRecursiveType, ToString, IsNumberLike, ApplyDefaultOptions, MapsSetsOrArrays} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {GreaterThan} from './greater-than.d.ts';
import type {Sum} from './sum.d.ts';
import type {And} from './and.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {PathsOptions} from './paths.d.ts';

/**
ConditionalPaths options.

@see {@link ConditionalPaths}
*/
export type ConditionalPathsOptions = Omit<PathsOptions, 'leavesOnly'> & {
	/**
	The condition assertion mode.

	- `'extends'`: include a path when its value type is assignable to `Condition`.
	- `'equality'`: include a path only when its value type is exactly `Condition`.

	@default 'extends'

	@example
	```
	import type {ConditionalPaths} from 'type-fest';

	type Example = {
		a: string;
		b: string | number;
	};

	type ExtendsPaths = ConditionalPaths<Example, string>;
	//=> 'a'

	type EqualityPaths = ConditionalPaths<Example, string | number, {condition: 'equality'}>;
	//=> 'b'
	```
	*/
	condition?: 'extends' | 'equality';
};

type DefaultConditionalPathsOptions = {
	maxRecursionDepth: 5;
	bracketNotation: false;
	depth: number;
	condition: 'extends';
};

/**
Generate a union of all the paths in an object whose value type matches the given `Condition`.

This is the path-aware counterpart of {@link ConditionalKeys}, and it accepts the same {@link PathsOptions | options} as {@link Paths} (such as `maxRecursionDepth`, `bracketNotation`, and `depth`) plus a {@link ConditionalPathsOptions.condition | `condition`} mode.

Use-case: You want a type-safe way to refer only to the nested properties of a specific value type, such as every `string` path or every `number` path in an object.

Note: Use `any` as the `Condition` to match every path, in which case it behaves like {@link Paths}.

@example
```
import type {ConditionalPaths} from 'type-fest';

type User = {
	id: number;
	name: string;
	email: string;
	age: number;
	isActive: boolean;
};

type StringPaths = ConditionalPaths<User, string>;
//=> 'name' | 'email'

type NumberPaths = ConditionalPaths<User, number>;
//=> 'id' | 'age'
```

@example
```
import type {ConditionalPaths} from 'type-fest';

type Post = {
	id: number;
	title: string;
	author: {
		id: number;
		name: string;
		email: string;
	};
	metadata: {
		views: number;
		likes: number;
	};
};

type AllStringPaths = ConditionalPaths<Post, string>;
//=> 'title' | 'author.name' | 'author.email'

type AllNumberPaths = ConditionalPaths<Post, number>;
//=> 'id' | 'author.id' | 'metadata.views' | 'metadata.likes'

// Use `any` to get every path, like `Paths`.
type AllPaths = ConditionalPaths<Post, any>;
//=> 'id' | 'title' | 'author' | 'author.id' | 'author.name' | 'author.email' | 'metadata' | 'metadata.views' | 'metadata.likes'
```

@example
```
import type {ConditionalPaths} from 'type-fest';

// Works with arrays and tuples.
type Data = {
	tags: string[];
	scores: [number, number, number];
	items: Array<{name: string; count: number}>;
};

type StringPaths = ConditionalPaths<Data, string>;
//=> `tags.${number}` | `items.${number}.name`

type NumberPaths = ConditionalPaths<Data, number>;
//=> 'scores.0' | 'scores.1' | 'scores.2' | `items.${number}.count`
```

@see {@link Paths}
@see {@link ConditionalKeys}

@remarks
Traversal mirrors {@link Paths}: every key is recursed into regardless of whether the current key matches `Condition`, so deeper matching paths are always reachable. At each key the value type is tested against `Condition` via a non-distributive (tuple-wrapped) extends check — `[Value] extends [Condition]` — so union value types are compared as a whole. Optional properties are normalised by the internal `Required<T>` call and match their base type (e.g. `name?: string` matches `string`), but explicitly nullable fields do not (e.g. `name: string | null` does not match `string`).

@see https://github.com/sindresorhus/type-fest/issues/1328

@category Object
@category Array
*/
export type ConditionalPaths<Type, Condition, Options extends ConditionalPathsOptions = {}> =
	_ConditionalPaths<Type, Condition, ApplyDefaultOptions<ConditionalPathsOptions, DefaultConditionalPathsOptions, Options>>;

type _ConditionalPaths<ObjectType, Condition, Options extends Required<ConditionalPathsOptions>, CurrentDepth extends number = 0> =
	ObjectType extends NonRecursiveType | Exclude<MapsSetsOrArrays, UnknownArray>
		? never
		: IsAny<ObjectType> extends true
			? never
			: ObjectType extends object
				? InternalConditionalPaths<Required<ObjectType>, Condition, Options, CurrentDepth>
				: never;

// Only emits a path when the value at the current key matches `Condition`. Recursion still
// descends through every key so that deeper matching paths are reachable even when the
// intermediate value itself does not match.
type InternalConditionalPaths<ObjectType, Condition, Options extends Required<ConditionalPathsOptions>, CurrentDepth extends number> =
	{[Key in keyof ObjectType]: Key extends string | number // Limit `Key` to `string | number`
		? (
			And<Options['bracketNotation'], IsNumberLike<Key>> extends true
				? `[${Key}]`
				: CurrentDepth extends 0
					// Return both `Key` and `ToString<Key>` because for number keys, like `1`, both `1` and `'1'` are valid keys.
					? Key | ToString<Key>
					: `.${(Key | ToString<Key>)}`
		) extends infer TransformedKey extends string | number
			? (
				// If `depth` is provided, the condition becomes truthy only when it matches `CurrentDepth`.
				// Otherwise, since `depth` defaults to `number`, the condition is always truthy, returning paths at all depths.
				CurrentDepth extends Options['depth']
					// Only emit this path when the value at `Key` matches `Condition`.
					? AssertCondition<ObjectType[Key], Condition, Options> extends true
						? TransformedKey
						: never
					: never
			)
			// Recursively generate paths for the current key
			| (GreaterThan<Options['maxRecursionDepth'], CurrentDepth> extends true // Limit the depth to prevent infinite recursion
				? `${TransformedKey}${_ConditionalPaths<ObjectType[Key], Condition, Options, Sum<CurrentDepth, 1>> & (string | number)}`
				: never)
			: never
		: never
	}[keyof ObjectType & (ObjectType extends UnknownArray ? number : unknown)];

// Assert the value type against the condition.
// The `extends` check is non-distributive (tuple-wrapped) so union value types are
// compared as a whole — keeping `Condition = any` equivalent to `Paths`.
type AssertCondition<Value, Condition, Options extends Required<ConditionalPathsOptions>> =
	Options['condition'] extends 'equality'
		? IsEqual<Value, Condition>
		: [Value] extends [Condition]
			? true
			: false;

export {};
