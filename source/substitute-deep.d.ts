import type {IsArrayOfUnknownLength, NonRecursiveType} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {Replace} from './replace.d.ts'; // For `@link`
import type {RequiredDeep} from './required-deep.d.ts'; // For `@link`
import type {Schema} from './schema.d.ts'; // For `@link`
import type {Tagged} from './tagged.d.ts'; // For `@link`

/**
Recursively replaces every occurrence of a type in another type.

Matching uses assignability: a `Find` of `string` also matches `'literal'`, but not the other way around. Unions are distributed, so `SubstituteDeep<string | undefined, undefined, null>` is `string | null`, and `SubstituteDeep<string | null, null, undefined>` is `string | undefined`. The input is checked before its members, so a `Find` of `object` replaces whole objects. Replacements are not traversed. A `Find` of `any` or `unknown` matches everything except `any` and `never`.

Optional and `readonly` modifiers are preserved for objects, arrays, and tuples. To require every key and turn absent values into `null`, replace `undefined` with `null` before applying {@link RequiredDeep}. Making keys required first can discard their implicit `undefined`.

Single-value built-ins, such as `Date`, `RegExp`, typed arrays, and DOM nodes, are kept as they are unless they match `Find`.

Use-cases:
- Converting `undefined` to `null` in models, such as GraphQL responses.
- Converting `null` to `undefined` in models, such as REST or JSON responses.
- Replacing runtime-specific types, such as `Date`, for another SDK.
- Replacing functions with strings before JSON serialization.

@example
```
import type {RequiredDeep, SubstituteDeep} from 'type-fest';

type User = {
	id: number;
	name?: string;
	createdAt?: Date;
};

// Replace `Date` with its JSON representation.
type SerializedUser = SubstituteDeep<User, Date, string>;
//=> {id: number; name?: string; createdAt?: string}

// Require every property, representing absence as `null`.
type NullableUser = RequiredDeep<SubstituteDeep<User, undefined, null>>;
//=> {id: number; name: string | null; createdAt: Date | null}

// Replace `null` with `undefined`.
type ApiUser = {
	name: string | null;
	tags: Array<string | null>;
};

type NormalizedUser = SubstituteDeep<ApiUser, null, undefined>;
//=> {name: string | undefined; tags: (string | undefined)[]}
```

@see {@link Replace} to replace substrings in string types.
@see {@link Schema} to replace every leaf value with one type.

Known limitations:
- Arrays and tuples with extra properties, including {@link Tagged} types, lose those properties; tuples also lose their fixed length, and an optional element becomes `| undefined` in the rebuilt array. `Map`, `Set`, and `Promise` subclasses or types with extra members lose those members too. For example, `SubstituteDeep<Date[] & {tag: Date}, Date, string>` is `string[]`. Extra numeric keys or an overlapping property such as `length` may instead leave array methods using the original element type.
- `Readonly<Map>`, `Readonly<Set>`, and `Readonly<Promise>` are rebuilt as mutable `Map`, `Set`, and `Promise`. `Readonly` only makes their methods readonly properties, so `set` and `add` are still callable, and the readonly modifiers do not affect assignability. Use `ReadonlyMap` and `ReadonlySet` for a collection that cannot be changed.
- `ReadonlyDate` does not match a `Find` of `Date`. Use `ReadonlyDate` as `Find` to match both.
- `WeakMap` keys and `WeakSet` items are preserved to avoid invalid weak references. `WeakMap` values are transformed.
- Functions and non-`Promise` thenables are preserved unless they match `Find`.
- Recursion only through tuples, such as `type List = null | readonly [string, List]`, hits the instantiation depth limit. Recursive objects and arrays of unknown length are supported.
- `any` is returned unchanged.

@category Type
@category Object
@category Array
@category Set
@category Map
*/
export type SubstituteDeep<Type, Find, ReplaceWith> =
	// `any` has no known members, so mapping it would give an index signature of the replacement instead of `any`.
	IsAny<Type> extends true
		? Type
		// Distributing over unions lets a member match on its own, so `string | undefined` with a `Find` of `undefined` becomes `string | null` instead of keeping the whole union.
		: Type extends unknown
			? [Type] extends [Find]
				? ReplaceWith
				// `Promise` is rebuilt around its value. The other non-recursive types, including functions and thenables, are leaves.
				: Type extends Promise<infer ValueType>
					? Promise<SubstituteDeep<ValueType, Find, ReplaceWith>>
					: Type extends NonRecursiveType
						? Type
						: Type extends readonly unknown[]
							? IsArrayOfUnknownLength<Type> extends false
								// Numeric keys are tuple indices, so only other keys count as extra properties.
								? [Exclude<keyof Type, keyof unknown[] | `${number}`>] extends [never]
									// A homomorphic mapped type keeps the length, labels, optional elements, the rest element and `readonly`, without a recursion step per element.
									? {[Key in keyof Type]: SubstituteDeep<Type[Key], Find, ReplaceWith>}
									// A tuple or array with extra properties is not mapped member by member, because its array methods would keep the old element type. Rebuilding it as an array keeps the result consistent.
									: SubstituteArray<Type, Find, ReplaceWith>
								// An array of unknown length is rebuilt directly, because mapping it makes a recursive element type, such as `JsonValue`, infinitely deep.
								: SubstituteArray<Type, Find, ReplaceWith>
							: Type extends Map<infer KeyType, infer ValueType>
								? Map<SubstituteDeep<KeyType, Find, ReplaceWith>, SubstituteDeep<ValueType, Find, ReplaceWith>>
								: Type extends ReadonlyMap<infer KeyType, infer ValueType>
									? ReadonlyMap<SubstituteDeep<KeyType, Find, ReplaceWith>, SubstituteDeep<ValueType, Find, ReplaceWith>>
									// A weak key has to be an object, so the key is kept instead of inserting a replacement that may be a primitive. The value is safe to replace.
									: Type extends WeakMap<infer KeyType, infer ValueType>
										? WeakMap<KeyType, SubstituteDeep<ValueType, Find, ReplaceWith>>
										: Type extends Set<infer ItemType>
											? Set<SubstituteDeep<ItemType, Find, ReplaceWith>>
											: Type extends ReadonlySet<infer ItemType>
												? ReadonlySet<SubstituteDeep<ItemType, Find, ReplaceWith>>
												// A weak item has to be an object, so the whole collection is kept.
												: Type extends WeakSet<WeakKey>
													? Type
													: Type extends object
														// `keyof object` is `never`, so mapping `object` itself would turn it into `{}`, which accepts a primitive.
														? IsEqual<Type, object> extends true
															? Type
															: {[Key in keyof Type]: SubstituteDeep<Type[Key], Find, ReplaceWith>}
														: Type
			: never;

/**
Internal helper for {@link SubstituteDeep} that rebuilds an array or tuple with substituted elements, keeping its mutability. Used where mapping would make a recursive element type infinitely deep or would leave the array methods on the old element type.
*/
type SubstituteArray<Type extends readonly unknown[], Find, ReplaceWith> =
	Type extends unknown[]
		? Array<SubstituteDeep<Type[number], Find, ReplaceWith>>
		: ReadonlyArray<SubstituteDeep<Type[number], Find, ReplaceWith>>;

export {};
