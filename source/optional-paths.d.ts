import type {MapsSetsOrArrays, NonRecursiveType} from './internal/type.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {GreaterThan} from './greater-than.d.ts';
import type {Sum} from './sum.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Options for the `OptionalPaths` type.

@see {@link OptionalPaths}
*/
export type OptionalPathsOptions = {
	/**
	The maximum depth to recurse when searching for optional paths. Range: 0 ~ 10.

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

For a union, a path is included when the property is optional in any member.

@example
```
import type {OptionalPaths} from 'type-fest';

type A = OptionalPaths<{a: {b?: string; c: number}; d?: boolean}>;
//=> 'a.b' | 'd'

type B = OptionalPaths<[string, number?]>;
//=> '1'

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
export type OptionalPaths<BaseType extends object, Options extends OptionalPathsOptions = {}> =
	// The paths are always strings. The intersection tells TypeScript so for a generic `BaseType`, which makes `OmitDeep<BaseType, OptionalPaths<BaseType>>` valid.
	_OptionalPaths<BaseType, ApplyDefaultOptions<OptionalPathsOptions, DefaultOptionalPathsOptions, Options>> & string;

type _OptionalPaths<BaseType, Options extends Required<OptionalPathsOptions>, Accumulator extends string = '', CurrentDepth extends number = 0> =
	BaseType extends Exclude<NonRecursiveType, Function> | Exclude<MapsSetsOrArrays, UnknownArray> // Also, distributes `BaseType`
		? never
		: IsAny<BaseType> extends true
			? never
			: BaseType extends object
				? RetrieveOptionalPaths<ComputeOptionalPaths<BaseType, Options, Accumulator, CurrentDepth>>
				: never;

type ComputeOptionalPaths<BaseType extends object, Options extends Required<OptionalPathsOptions>, Accumulator extends string = '', CurrentDepth extends number = 0> = {
	[Key in keyof BaseType]-?:
		// Only string paths are produced, not number keys like `Paths` does, so the result can always be passed to `PickDeep` and `OmitDeep`.
		| (IsOptionalKeyOf<BaseType, Key> extends true
			? `${Accumulator}${Key & (string | number)}`
			: never)
		| (GreaterThan<Options['maxRecursionDepth'], CurrentDepth> extends true // Limit the depth to prevent infinite recursion.
			? _OptionalPaths<BaseType[Key], Options, `${Accumulator}${Key & (string | number)}.`, Sum<CurrentDepth, 1>>
			: never)
};

type RetrieveOptionalPaths<PathsObject extends object> = PathsObject extends UnknownArray
	? PathsObject[number]
	// Object returned from `ComputeOptionalPaths` for index signatures might look like `{[x: string]: never; a: 'a'}`,
	// and here if we simply index with `keyof PathsObject`, we would lose the `'a'` path, and just get back `never`.
	// So, we alias all the keys to `string` creating a union of all the value types and then retrieve the union by indexing with `string`.
	: {[Key in keyof PathsObject as string]: PathsObject[Key]}[keyof PathsObject extends never ? never : string]; // If `PathsObject` is an empty object, indexing with `string` will produce incorrect result, hence we index conditionally.

export {};
