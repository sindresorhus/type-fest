import type {MapsSetsOrArrays, NonRecursiveType} from './internal/type.d.ts';
import type {ApplyDefaultOptions, NormalizedKeys} from './internal/object.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {GreaterThan} from './greater-than.d.ts';
import type {Sum} from './sum.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
OptionalPaths options.

@see {@link OptionalPaths}
*/
export type OptionalPathsOptions = {
	/**
	The maximum depth to recurse when searching for optional paths.

	@default 5

	@example
	```
	import type {OptionalPaths} from 'type-fest';

	type Recursive = {foo?: Recursive};

	type A = OptionalPaths<Recursive>;
	//=> 'foo' | 'foo.foo' | 'foo.foo.foo' | 'foo.foo.foo.foo' | 'foo.foo.foo.foo.foo' | 'foo.foo.foo.foo.foo.foo'

	type B = OptionalPaths<Recursive, {maxRecursionDepth: 3}>;
	//=> 'foo' | 'foo.foo' | 'foo.foo.foo' | 'foo.foo.foo.foo'

	type C = OptionalPaths<Recursive, {maxRecursionDepth: 0}>;
	//=> 'foo'
	```
	*/
	maxRecursionDepth?: number;
};

type DefaultOptionalPathsOptions = {
	maxRecursionDepth: 5;
};

/**
Get a union of all paths to optional properties in the given object.

Use-cases:
- Can be used in conjunction with `PickDeep`/`OmitDeep` to select/remove all optional properties from an object.

@example
```
import type {OptionalPaths} from 'type-fest';

type A = OptionalPaths<{a: {b?: string; c: number}; d?: boolean}>;
//=> 'a.b' | 'd'

type B = OptionalPaths<[string, number?]>;
//=> 1 | '1'

type C = OptionalPaths<{[x: string]: string; a?: string; b: string}>;
//=> 'a'
```

@example
```
import type {OptionalPaths, PickDeep, OmitDeep} from 'type-fest';

type UserFields = {
	id: string;
	avatarUrl?: string;
	role?: string;
	preferences: {
		theme: string;
		alerts?: boolean;
	};
};

type OptionalUserFields = PickDeep<UserFields, OptionalPaths<UserFields>>;
//=> {
// 	avatarUrl?: string;
// 	role?: string;
// 	preferences: {
// 		alerts?: boolean;
// 	};
// }

type RequiredUserFields = OmitDeep<UserFields, OptionalPaths<UserFields>>;
//=> {id: string; preferences: {theme: string}}
```

@see {@link OptionalPathsOptions}

@category Object
@category Array
*/
export type OptionalPaths<T extends object, Options extends OptionalPathsOptions = {}> =
	_OptionalPaths<T, ApplyDefaultOptions<OptionalPathsOptions, DefaultOptionalPathsOptions, Options>>;

type _OptionalPaths<T, Options extends Required<OptionalPathsOptions>, Acc extends string = '', CurrentDepth extends number = 0> =
	T extends Exclude<NonRecursiveType, Function> | Exclude<MapsSetsOrArrays, UnknownArray> // Also, distributes `T`
		? never
		: IsAny<T> extends true
			? never
			: T extends object
				? RetrieveOptionalPaths<ComputeOptionalPaths<T, Options, Acc, CurrentDepth>>
				: never;

type ComputeOptionalPaths<T extends object, Options extends Required<OptionalPathsOptions>, Acc extends string = '', CurrentDepth extends number = 0> = {
	[Key in keyof T]-?:
		| (IsOptionalKeyOf<T, Key> extends true
			? CurrentDepth extends 0
				// We only want to normalize keys at the root level,
				// because we don't want an object like `{1: {2?: string}}` to produce a result of `'1.2' | 1.2`.
				? NormalizedKeys<`${Acc}${Key & (string | number)}`>
				: `${Acc}${Key & (string | number)}`
			: never)
		| (GreaterThan<Options['maxRecursionDepth'], CurrentDepth> extends true // Limit the depth to prevent infinite recursion.
			? _OptionalPaths<T[Key], Options, `${Acc}${Key & (string | number)}.`, Sum<CurrentDepth, 1>>
			: never)
};

type RetrieveOptionalPaths<T extends object> = T extends UnknownArray
	? T[number]
	// Object returned from `ComputeOptionalPaths` for index signatures might look like `{[x: string]: never; a: 'a'}`,
	// and here if we simply index with `keyof T`, we would lose the `'a'` path, and just get back `never`.
	// So, we alias all the keys to `string` creating a union of all the value types and then retrieve the union by indexing with `string`.
	: {[P in keyof T as string]: T[P]}[keyof T extends never ? never : string]; // If `T` is an empty object, indexing with `string` will produce incorrect result, hence we index conditionally.

export {};
