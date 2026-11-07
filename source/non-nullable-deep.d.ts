import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IsArrayOfUnknownLength} from './internal/array.d.ts';
import type {HasMultipleCallSignatures, NonRecursiveLeaf} from './internal/type.d.ts';
import type {FunctionParameters} from './internal/function.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {RequiredDeep} from './required-deep.d.ts'; // For `@link`

/**
@see {@link NonNullableDeep}
*/
export type NonNullableDeepOptions = {
	/**
	The types to keep as is, instead of removing `null` and `undefined`.

	A kept type is left untouched at every depth, including everything inside it. Matching uses assignability.

	@default never

	@example
	```
	import type {NonNullableDeep} from 'type-fest';

	type Color = {red: number | null};
	type Settings = {name: string | null; color: Color};
	type CleanedSettings = NonNullableDeep<Settings, {keep: Color}>;
	//=> {name: string; color: Color}
	```
	*/
	readonly keep?: unknown;
};

/**
Recursively removes `null` and `undefined` from the specified type.

Known limitations:
- A generic function is rebuilt from its `Parameters` and `ReturnType`, which instantiate its type parameter with `unknown`, so `NonNullableDeep<<T>(value: T) => T>` is `(value: unknown) => unknown` rather than the original. Pass the function type through the `keep` option to preserve its generic signature.
- A thenable with members other than `then`, like a query builder, is kept as is, so its resolved value is not cleaned. Rebuilding it as a `PromiseLike` would drop those members.

Use-cases:
- Normalizing data received from external sources where `null`/`undefined` have been cleaned.
- Creating non-nullable variants of deeply nested types.

NOTE: Optional modifiers (`?`) are not removed from properties. For example, `NonNullableDeep<{foo?: string | null | undefined}>` will result in `{foo?: string}`. To remove both optional modifiers and nullables, use {@link RequiredDeep} in conjunction with this type.

@example
```
import type {NonNullableDeep} from 'type-fest';

type UserDraft = {
	name: string | null;
	address: {
		city: string | undefined;
		postalCode: string | null;
		landmark?: string | undefined;
	};
	tags: Array<string | null>;
	visits: Map<string | null, {
		date: Date | null;
		notes: Set<string | undefined>;
	}>;
};

type User = NonNullableDeep<UserDraft>;
//=> {
// 	name: string;
// 	address: {
// 		city: string;
// 		postalCode: string;
// 		landmark?: string;
// 	};
// 	tags: string[];
// 	visits: Map<string, {
// 		date: Date;
// 		notes: Set<string>;
// 	}>;
// }
```

@example
```
import type {NonNullableDeep} from 'type-fest';

type ArrayExample = NonNullableDeep<[{a: number | undefined}, ...Array<{b: string | null}>]>;
//=> [{a: number}, ...{b: string}[]]

type MapExample = NonNullableDeep<{a: Map<{a: string | null}, {c: number | undefined}>}>;
//=> {a: Map<{a: string}, {c: number}>}

type SetExample = NonNullableDeep<Set<{a: string | null}> | null | undefined>;
//=> Set<{a: string}>

type PromiseExample = NonNullableDeep<{a: Promise<{b: string | null}>}>;
//=> {a: Promise<{b: string}>}

type FunctionExample = NonNullableDeep<(a: string | null) => number | undefined>;
//=> (a: string) => number
```

Pass the types to keep as is through the `keep` option to leave matching types untouched at every depth, like a class instance whose nullable internals should not be cleaned. Matching uses assignability, so a plain object type that structurally matches a kept type is kept too, and a wide type, like `object`, keeps every object:

@example
```
import type {NonNullableDeep} from 'type-fest';

class Color {
	name: string | null = null;
	r = 0;
}

type Item = {
	label: string | null;
	color: Color;
};

// Without `keep`, the `Color` fields are cleaned too.
type DeeplyCleaned = NonNullableDeep<Item>;
// {
// 	label: string;
// 	color: {
// 		name: string;
// 		r: number;
// 	};
// }

// With `Color` kept, the class instance is returned as is.
type CleanedExceptColor = NonNullableDeep<Item, {keep: Color}>;
// {
// 	label: string;
// 	color: Color;
// }
```

@see {@link NonNullableDeepOptions}

@category Utilities
@category Object
@category Array
@category Set
@category Map
*/
export type NonNullableDeep<Value, Options extends NonNullableDeepOptions = {}> =
	_NonNullableDeep<Value, ApplyDefaultOptions<NonNullableDeepOptions, {keep: never}, Options>['keep']>;

/**
Internal helper for {@link NonNullableDeep}.
*/
type _NonNullableDeep<Value, Keep> =
	// A kept type is returned as is, including everything inside it. It is matched before everything else, so a kept `Map` or `Set` is not rebuilt either.
	Value extends Keep
		? Value
		// These built-ins are a single value rather than a structure to recurse into. `Function` and `Promise` are excluded on purpose, because a plain function and a promise still have their contents recursed into by the branches below.
		: Value extends NonRecursiveLeaf
			? Exclude<Value, null | undefined> // `Exclude` is used instead of `NonNullable` because `NonNullable<void>` results in `void & {}`.
			: Value extends Map<infer KeyType, infer ValueType>
				? Map<_NonNullableDeep<KeyType, Keep>, _NonNullableDeep<ValueType, Keep>>
				: Value extends Set<infer ItemType>
					? Set<_NonNullableDeep<ItemType, Keep>>
					: Value extends ReadonlyMap<infer KeyType, infer ValueType>
						? ReadonlyMap<_NonNullableDeep<KeyType, Keep>, _NonNullableDeep<ValueType, Keep>>
						: Value extends ReadonlySet<infer ItemType>
							? ReadonlySet<_NonNullableDeep<ItemType, Keep>>
							: Value extends WeakMap<infer KeyType, infer ValueType>
								? WeakMap<_NonNullableDeep<KeyType, Keep>, _NonNullableDeep<ValueType, Keep>>
								: Value extends WeakSet<infer ItemType>
									? WeakSet<_NonNullableDeep<ItemType, Keep>>
									: Value extends Promise<infer ValueType>
										? Promise<_NonNullableDeep<ValueType, Keep>>
										// A thenable is a container like `Promise`, so its value is cleaned instead of the whole thing being walked as a plain object, which would not be thenable anymore. A thenable with other members, like a query builder, is kept as is, because rebuilding it as a `PromiseLike` would drop those members.
										: Value extends PromiseLike<infer ValueType>
											? keyof Value extends 'then'
												? PromiseLike<_NonNullableDeep<ValueType, Keep>>
												: Value
											: Value extends (...arguments_: any[]) => unknown
												? HasMultipleCallSignatures<Value> extends true
													? Value
													// `Parameters` excludes the `this` parameter, so it has to be added back explicitly, otherwise the rebuilt function would accept any `this`. A function that declares no `this` is rebuilt without one, because `this: unknown` would reject a function that declares a `this`.
													: (unknown extends ThisParameterType<Value>
														? (...arguments_: _NonNullableDeep<FunctionParameters<Value>, Keep>) => _NonNullableDeep<ReturnType<Value>, Keep>
														: (
															this: _NonNullableDeep<ThisParameterType<Value>, Keep>,
															...arguments_: _NonNullableDeep<FunctionParameters<Value>, Keep>
														) => _NonNullableDeep<ReturnType<Value>, Keep>)
														& (IsNever<keyof Value> extends true
															? unknown
															: _NonNullableDeep<{[Key in keyof Value]: Value[Key]}, Keep>) // The mapped type removes the call signature; redispatch preserves array methods when the callable is also an array.
												// The `Function` interface has no call signature, so the branch above misses it, and mapping it would produce an uncallable record of its own methods.
												: Value extends Function
													? Value
													: Value extends readonly unknown[]
														? IsArrayOfUnknownLength<Value> extends false
															? {[P in keyof Value]: _NonNullableDeep<Value[P], Keep>}
															// Rebuild arrays directly so recursive element types, such as `JsonValue`, do not expand through a mapped type indefinitely.
															: Value extends unknown[]
																? Array<_NonNullableDeep<Value[number], Keep>>
																: ReadonlyArray<_NonNullableDeep<Value[number], Keep>>
														: Value extends object
															? {[P in keyof Value]: _NonNullableDeep<Value[P], Keep>}
															: unknown;

export {};
