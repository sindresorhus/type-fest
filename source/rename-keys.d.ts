import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {IsLiteral} from './is-literal.d.ts';
import type {IsUnion} from './is-union.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {HasOptionalKeys} from './has-optional-keys.d.ts';

/**
Rename keys in an object type according to a map of old-to-new names. Keys absent from the map pass through unchanged. The value type, the optional modifier, and the readonly modifier go to the new key.

Distributes over a union of rename maps and over a union of source types. See {@link RenameKey} for the single-key form.

Returns `never` if any of the following hold:
- A rename map entry's key is not a property of the source type.
- A rename map entry is optional (e.g. `{a?: 'b'}`).
- A rename map entry's value is not a single literal `PropertyKey` (rejects unions like `'b' | 'c'` and primitives like `string`).
- A target collides with a kept property of the source type, or with another rename map entry's target.
- The source type is `any` or `never`.

@example
```
import type {RenameKeys} from 'type-fest';

type User = {
	id: string;
	firstName: string;
	createdAt: Date;
};

type Renamed = RenameKeys<User, {firstName: 'first_name'; createdAt: 'created_at'}>;
//=> {id: string; first_name: string; created_at: Date}
```

@example
```
import type {RenameKeys} from 'type-fest';

type User = {id: string; name: string};

type Typo = RenameKeys<User, {nme: 'fullName'}>;
//=> never

type Collision = RenameKeys<{a: number; b: string}, {a: 'b'}>;
//=> never
```

@see {@link RenameKey}
@category Object
*/
export type RenameKeys<
	BaseType,
	RenameMap extends Record<PropertyKey, PropertyKey>,
> = IsAny<BaseType> extends true
	? never
	: IsNever<BaseType> extends true
		? never
		: RenameMap extends RenameMap // Distribute over a union of maps.
			? HasOptionalKeys<RenameMap> extends true // Reject `{a?: 'b'}`-style entries.
				? never
				: [_AllSourceKeysExist<BaseType, RenameMap>] extends [true] // Reject typo'd source keys.
					? _AllTargetsAreSingleLiterals<RenameMap> extends true // Reject targets that aren't a single literal `PropertyKey`.
						? _HasKeptCollision<BaseType, RenameMap> extends true // Reject targets that collide with a kept literal key.
							? never
							: _HasDuplicateTargets<RenameMap> extends true // Reject duplicate targets across entries.
								? never
								: _RenameOnce<BaseType, RenameMap> // Apply the rename.
						: never
					: never
			: never;

// The literal keys of `BaseType`, with index signatures dropped. Distributes
// over union members so a target that matches a sibling member's key counts
// as a collision.
type _LiteralKeysOf<BaseType> = BaseType extends unknown // Distribute per union member.
	? keyof OmitIndexSignature<BaseType> // Strip index signatures.
	: never;

// True when `T` is a single literal `PropertyKey` (`'a'`, `1`, a unique
// symbol). False for unions (`'a' | 'b'`), primitives (`string`, `number`),
// and non-`PropertyKey` types. Keeps rename targets unambiguous: a union
// target distributes in the mapped-type `as` clause and creates multiple
// output keys; a primitive target widens to an index signature.
type _IsSingleLiteral<T> = IsLiteral<T> extends true // Literal? (`'a'` ok, `string` not ok)
	? IsUnion<T> extends true // Also a union? (`'a' | 'b'`)
		? false
		: true
	: false;

// True when every value in `RenameMap` passes `_IsSingleLiteral`.
//
// The `[X] extends [Y]` tuple-wrap prevents
// `never` distribution. Without it, an empty `RenameMap` would yield
// `{}[never] = never`, and `never extends true ? ... : ...` distributes
// over zero cases and produces `never` rather than `true` or `false`.
// `[never] extends [true]` is true because a tuple position evaluates
// `never` as the bottom value, which keeps the empty-map case vacuous.
type _AllTargetsAreSingleLiterals<RenameMap> = [
	{
		[Key in keyof RenameMap]: _IsSingleLiteral<RenameMap[Key]>;
	}[keyof RenameMap], // Union of every entry's verdict.
] extends [true]
	? true
	: false;

// True when every key in `RenameMap` is a property of `BaseType`. Rejects
// typo'd source keys.
type _AllSourceKeysExist<BaseType, RenameMap> = [
	{
		[Key in keyof RenameMap]: Key extends KeysOfUnion<BaseType> ? true : false; // Source key is in keys of `BaseType`?
	}[keyof RenameMap],
] extends [true]
	? true
	: false;

// True when any rename target matches a kept literal key of `BaseType`.
// Kept keys = `_LiteralKeysOf<BaseType>` minus the source keys in
// `RenameMap`. Index signatures are excluded, so a literal target onto a
// string-indexed object passes. Swapping two keys passes too: both keys
// rename away simultaneously, so neither is kept.
type _HasKeptCollision<BaseType, RenameMap> = [
	{
		[Key in keyof RenameMap]: RenameMap[Key] extends Exclude<_LiteralKeysOf<BaseType>, keyof RenameMap> // Target is in kept literal keys?
			? true
			: false;
	}[keyof RenameMap],
] extends [false] // No entry collides.
	? false
	: true;

// True when two or more entries in `RenameMap` point at the same target.
// The double-nested mapped type compares each target against every other
// target.
type _HasDuplicateTargets<RenameMap> = [
	{
		[Key in keyof RenameMap]: [
			{
				[Other in Exclude<keyof RenameMap, Key>]: RenameMap[Key] extends RenameMap[Other] // This target is a subset of another target?
					? true
					: false;
			}[Exclude<keyof RenameMap, Key>],
		] extends [false]
			? false
			: true;
	}[keyof RenameMap],
] extends [false]
	? false
	: true;

// Apply the rename. For each key on `BaseType`, look it up in `RenameMap`;
// if found, emit it under the new name; otherwise keep the original.
type _RenameOnce<BaseType, RenameMap> = {
	[Key in keyof BaseType as Key extends keyof RenameMap // Key being renamed?
		? RenameMap[Key] extends PropertyKey // Use the new name from the map.
			? RenameMap[Key]
			: Key
		: Key]: BaseType[Key]; // Keep the value.
};

export {};
