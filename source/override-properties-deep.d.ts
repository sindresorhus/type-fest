import type {ExactKey, IsPlainObject, Not, ObjectValue} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {MergeDeep, MergeDeepOptions} from './merge-deep.d.ts';
import type {OverrideProperties} from './override-properties.d.ts'; // For `@link`
import type {UnknownArray} from './unknown-array.d.ts';

/**
Override existing properties of the given type deeply. Similar to {@link MergeDeep}, but requires overridden keys to exist at every level.

Use-cases:
- Correcting deeply nested values from an external source, such as an API response, while keeping the shape of the original type.
- Catching a property rename or removal in a generated type before a hand-written override silently goes stale.

Unlike {@link MergeDeep}, an `Override` key that does not exist in `Original`, or in the original value at the same path, is a type error, unless its value is `never` or the original is an array. Value types can change freely. An override of a plain object is merged, so keys you do not mention keep their original value.

The `Options` parameter is passed to {@link MergeDeep} and does not change which keys are checked. See {@link MergeDeepOptions}.

@example
```
import type {OverridePropertiesDeep} from 'type-fest';

type ApiResponse = {
	id: string;
	author: {
		name: string;
		email: string;
	};
};

type Corrected = OverridePropertiesDeep<ApiResponse, {
	id: number;
	author: {
		email: `${string}@${string}`;
	};
}>;
//=> {id: number; author: {name: string; email: `${string}@${string}`}}
```

@example
```
import type {OverridePropertiesDeep} from 'type-fest';

type ApiResponse = {
	author: {
		email: string;
	};
};

// @ts-expect-error `emailAddress` does not exist on `ApiResponse['author']`
type Invalid = OverridePropertiesDeep<ApiResponse, {author: {emailAddress: string}}>;
```

A key is valid when it is declared on the original, covered by an index signature, or a canonical string or number spelling of a numeric key, such as `0` and `'0'`. Plain strings cannot select declared string enum keys. Keys are checked recursively through plain object values, and a missing key is reported at its full path, for example `author.emailAddress`.

Known limitations:
- Only plain object values are checked. Arrays, maps, sets, dates, functions, `object` values, and unions containing a non-plain object are opaque. An optional value's `undefined` part is ignored. Array elements are never checked, even with `recurseIntoArrays`, which can merge in keys the original lacks.
- For a union of plain objects, only the keys common to every member can be overridden; a union of arrays is opaque. A union `Override` is checked member by member, but a member with an extra key can match another member's check.
- Only key existence is checked, not value types.
- An unresolved generic in `Original` or `Override` cannot be checked. This also applies to {@link OverrideProperties}.
- An `unknown` original only accepts `never`-valued keys (`{}` works), while an `any` original or override gives `any`. A key with a `never` value bypasses the check even when it does not exist, as in {@link OverrideProperties}.
- At the root, an `object` rejects every key and a `Map`, `Set`, or `Date` merges to `never`. A root array is opaque, so a non-array override is accepted but merges to `never`.

@see {@link OverrideProperties}
@see {@link MergeDeep}
@see {@link MergeDeepOptions}
@category Object
*/
export type OverridePropertiesDeep<
	Original,
	Override extends OverridePropertiesDeepCheck<Original, Override>,
	Options extends MergeDeepOptions = {},
> = MergeDeep<Original, Override, Options>;

/**
The constraint for {@link OverridePropertiesDeep}. Every key of `Override` must exist in `Original`, unless its value is `never` or the original is an array, and every plain object value is checked against the original value at the same path.

The mapped type is deliberately not recursive. TypeScript reports a circular constraint when a type parameter's constraint refers to itself through a recursive mapped type, but two aliases that call each other are accepted. The recursion therefore goes through {@link OverridePropertyDeepValue}.
*/
type OverridePropertiesDeepCheck<Original, Override> = {
	// A `never`, `any`, or array original is opaque, so its keys are not checked.
	[Key in keyof Override]: [Original] extends [never] | [UnknownArray]
		? Override[Key]
		: IsKnownPropertyKey<Original, Key> extends true
			? OverridePropertyDeepValue<OriginalPropertyValue<Original, Key>, Override[Key]>
			: never;
};

/**
Find the declared key of `Original` that `Key` names, including a canonical numeric spelling of a numeric key and a key covered by an index signature. Returns `never` when `Original` has no such key.
*/
type DeclaredKeyOf<Original, Key extends PropertyKey> =
	[Original] extends [object]
		? ExactKey<Original, Key>
		: never;

/**
Test whether `Key` names a property of `Original`. See {@link DeclaredKeyOf} for the accepted spellings.
*/
type IsKnownPropertyKey<Original, Key extends PropertyKey> = Not<IsNever<DeclaredKeyOf<Original, Key>>>;

/**
Get the value of `Key` in `Original`, matching the spellings described in {@link DeclaredKeyOf}.
*/
type OriginalPropertyValue<Original, Key extends PropertyKey> = ObjectValue<Original, Key>;

/**
Test whether the original value is a plain object whose keys can be checked. An `any` original is not checked, and an `object` original has no declared keys.
*/
type IsCheckableObject<Original> =
	IsAny<Original> extends true
		? false
		: IsEqual<Exclude<Original, undefined>, object> extends true
			? false
			: IsPlainObject<Exclude<Original, undefined>>;

/**
Check an override value against the original value at the same path. A value that is not a plain object is returned as it is, because only object keys are checked. The distribution over `Override` checks the object part of an optional property separately from `undefined`.
*/
type OverridePropertyDeepValue<Original, Override> =
	Override extends unknown
		? IsAny<Override> extends true
			? unknown
			: IsPlainObject<Override> extends true
				? IsCheckableObject<Original> extends true
					? OverridePropertiesDeepCheck<Exclude<Original, undefined>, Override>
					: Override
				: Override
		: never;

export {};
