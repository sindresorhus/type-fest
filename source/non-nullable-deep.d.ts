import type {HasMultipleCallSignatures, NonRecursiveLeaf} from './internal/type.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Simplify} from './simplify.d.ts';

/**
Recursively removes `null` and `undefined` from the specified type.

Known limitations:
- A generic function is rebuilt from its `Parameters` and `ReturnType`, which instantiate its type parameter with `unknown`, so `NonNullableDeep<<T>(value: T) => T>` is `(value: unknown) => unknown` rather than the original. Use the function type as is when it is generic.
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

@category Utilities
@category Object
@category Array
@category Set
@category Map
*/
export type NonNullableDeep<T> =
	// These built-ins are a single value rather than a structure to recurse into. `Function` and `Promise` are excluded on purpose, because a plain function and a promise still have their contents recursed into by the branches below.
	T extends NonRecursiveLeaf
		? Exclude<T, null | undefined> // `Exclude` is used instead of `NonNullable` because `NonNullable<void>` results in `void & {}`.
		: T extends Map<infer KeyType, infer ValueType>
			? Map<NonNullableDeep<KeyType>, NonNullableDeep<ValueType>>
			: T extends Set<infer ItemType>
				? Set<NonNullableDeep<ItemType>>
				: T extends ReadonlyMap<infer KeyType, infer ValueType>
					? ReadonlyMap<NonNullableDeep<KeyType>, NonNullableDeep<ValueType>>
					: T extends ReadonlySet<infer ItemType>
						? ReadonlySet<NonNullableDeep<ItemType>>
						: T extends WeakMap<infer KeyType, infer ValueType>
							? WeakMap<NonNullableDeep<KeyType>, NonNullableDeep<ValueType>>
							: T extends WeakSet<infer ItemType>
								? WeakSet<NonNullableDeep<ItemType>>
								: T extends Promise<infer ValueType>
									? Promise<NonNullableDeep<ValueType>>
									// A thenable is a container like `Promise`, so its value is cleaned instead of the whole thing being walked as a plain object, which would not be thenable anymore. A thenable with other members, like a query builder, is kept as is, because rebuilding it as a `PromiseLike` would drop those members.
									: T extends PromiseLike<infer ValueType>
										? keyof T extends 'then'
											? PromiseLike<NonNullableDeep<ValueType>>
											: T
										: T extends (...arguments_: any[]) => unknown
											? HasMultipleCallSignatures<T> extends true
												? T
												// `Parameters` excludes the `this` parameter, so it has to be added back explicitly, otherwise the rebuilt function would accept any `this`. A function that declares no `this` is rebuilt without one, because `this: unknown` would reject a function that declares a `this`.
												: (unknown extends ThisParameterType<T>
													? (...arguments_: NonNullableDeep<Parameters<T>>) => NonNullableDeep<ReturnType<T>>
													: (this: NonNullableDeep<ThisParameterType<T>>, ...arguments_: NonNullableDeep<Parameters<T>>) => NonNullableDeep<ReturnType<T>>)
												& (IsNever<keyof T> extends true
													? unknown
													: NonNullableDeep<Simplify<T>>) // `Simplify` removes the call signature
											// The `Function` interface has no call signature, so the branch above misses it, and mapping it would produce an uncallable record of its own methods.
											: T extends Function
												? T
												: T extends object
													? {[P in keyof T]: NonNullableDeep<T[P]>}
													: unknown;

export {};
