import type {IsLiteral} from './is-literal.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {ReadonlyKeysOf} from './readonly-keys-of.d.ts';
import type {RequiredKeysOf} from './required-keys-of.d.ts';
import type {OptionalKeysOf} from './optional-keys-of.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {PickIndexSignature} from './pick-index-signature.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';

/**
Rename keys in an object type according to a map of old-to-new names. Keys absent from the map are returned unchanged. The value type, the optional modifier, and the readonly modifier are applied to the new key.

Distributes over a union of rename maps and over a union of source types.

When multiple source keys map to the same target, the target's value type is the union of the contributors' value types. The target is optional only when every contributor is optional, and is `readonly` when any contributor is `readonly`. With `exactOptionalPropertyTypes` disabled, the value type of a mixed-optionality merge also includes `undefined`.

A union target distributes, producing one output key per member. For example, `{a: 'b' | 'c'}` on a source with `a: string` produces both `b: string` and `c: string`.

A rename map entry whose key is not a property of the source type is ignored, matching the result of `Omit`. The optional modifier on a rename map entry is ignored, so `{a?: 'alpha'}` produces the same result as `{a: 'alpha'}`.

Returns `never` in the following cases.
- A rename map entry's value is not a literal `PropertyKey` (rejects primitives like `string`).
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

type SearchInput = {
	textQuery: string;
	voiceQuery: Blob;
	imageQuery: File;
};

type Normalized = RenameKeys<SearchInput, {textQuery: 'query'; voiceQuery: 'query'; imageQuery: 'query'}>;
//=> {query: string | Blob | File}
```

@category Object
*/
export type RenameKeys<
	BaseType,
	RenameMap extends Record<PropertyKey, PropertyKey>,
> = IsAny<BaseType> extends true
	? never
	: IsNever<BaseType> extends true
		? never
		: BaseType extends BaseType // Once per member when BaseType is a union.
			? BaseType extends object
				? RenameMap extends RenameMap // Once per member when the rename map is a union.
					? _AllTargetsAreLiterals<Required<RenameMap>> extends true
						? _RenameOnce<BaseType, Required<RenameMap>>
						: never
					: never
				: never
			: never;

// True only when every new name in the map is a literal such as 'a' or 1. The
// brackets compare the whole union at once, so one wide target (like string,
// which would turn into an index signature) makes the result false.
type _AllTargetsAreLiterals<RenameMap> = [
	{
		[Key in keyof RenameMap]: IsLiteral<RenameMap[Key]>;
	}[keyof RenameMap],
] extends [true]
	? true
	: false;

// The new name for a source key. A key missing from the map keeps its own name.
type _TargetOf<SourceKey, RenameMap> =
	SourceKey extends keyof RenameMap
		? RenameMap[SourceKey] extends PropertyKey
			? RenameMap[SourceKey]
			: SourceKey
		: SourceKey;

// The value type for one renamed key. With exactOptionalPropertyTypes on, an
// optional key's value should not carry undefined, so Required strips it. With the
// flag off, BaseType[Key] keeps the undefined an optional key may hold.
type _NewValue<BaseType, Key extends keyof BaseType> =
	IsExactOptionalPropertyTypesEnabled extends true
		? Required<Pick<BaseType, Key>>[Key]
		: BaseType[Key];

type _ReadonlyTargets<BaseType extends object, RenameMap> = _TargetOf<ReadonlyKeysOf<BaseType>, RenameMap>;
type _RequiredTargets<BaseType extends object, RenameMap> = _TargetOf<RequiredKeysOf<BaseType>, RenameMap>;
type _OptionalTargets<BaseType extends object, RenameMap> = _TargetOf<OptionalKeysOf<BaseType>, RenameMap>;

// Keeps a new name only when its readonly and required state matches the block
// being built. `Target extends Target` runs this once per name when the new name
// is a union.
type _RouteTarget<Target, ReadOnly, Required, NeedReadonly extends boolean, NeedRequired extends boolean> =
	Target extends Target
		? (Target extends ReadOnly ? true : false) extends NeedReadonly
			? (Target extends Required ? true : false) extends NeedRequired
				? Target
				: never
			: never
		: never;

// Handle the index signature on its own. A literal key like `'b'` counts as a
// match for an index signature's `string` key, so renaming them together would
// mix the two up. PickIndexSignature carries the index signature across
// unchanged, and the named keys go through the rename.
type _RenameOnce<BaseType extends object, RenameMap> = Simplify<
	& PickIndexSignature<BaseType>
	& _RenameLiteralKeys<OmitIndexSignature<BaseType>, RenameMap>
>;

// Rename the named keys, then restore any undefined the required blocks dropped.
// The second argument is the set of new names fed by both a required and an
// optional source key.
type _RenameLiteralKeys<BaseType extends object, RenameMap> =
	_RestoreMergedUndefined<
		_RouteToBlocks<BaseType, RenameMap>,
		_RequiredTargets<BaseType, RenameMap> & _OptionalTargets<BaseType, RenameMap>
	>;

// A new name fed by both a required and an optional source key becomes one
// required key, and the required block's `-?` strips the undefined the optional
// key allowed. With exactOptionalPropertyTypes off that undefined should stay, so add
// it back on those names. With the flag on there is nothing to restore.
type _RestoreMergedUndefined<Result, MixedTargets> =
	IsExactOptionalPropertyTypesEnabled extends true
		? Result
		: {
			[Key in keyof Result]: Key extends MixedTargets
				? Result[Key] | undefined
				: Result[Key];
		};

// Build the renamed keys in four blocks, one for each pairing of readonly or
// mutable with required or optional. When several source keys collide on one new
// name, TS's key remapping would copy only the first key's readonly and optional
// flags, so each block sets its own flags and _RouteTarget sends every name to
// the block that matches.
type _RouteToBlocks<BaseType extends object, RenameMap> =
	// Readonly and required
	& {
		readonly [Key in keyof BaseType as _RouteTarget<
			_TargetOf<Key, RenameMap>,
			_ReadonlyTargets<BaseType, RenameMap>,
			_RequiredTargets<BaseType, RenameMap>,
			true, true
		>]-?: _NewValue<BaseType, Key>;
	}
	// Readonly and optional
	& {
		readonly [Key in keyof BaseType as _RouteTarget<
			_TargetOf<Key, RenameMap>,
			_ReadonlyTargets<BaseType, RenameMap>,
			_RequiredTargets<BaseType, RenameMap>,
			true, false
		>]?: _NewValue<BaseType, Key>;
	}
	// Mutable and required
	& {
		[Key in keyof BaseType as _RouteTarget<
			_TargetOf<Key, RenameMap>,
			_ReadonlyTargets<BaseType, RenameMap>,
			_RequiredTargets<BaseType, RenameMap>,
			false, true
		>]-?: _NewValue<BaseType, Key>;
	}
	// Mutable and optional
	& {
		[Key in keyof BaseType as _RouteTarget<
			_TargetOf<Key, RenameMap>,
			_ReadonlyTargets<BaseType, RenameMap>,
			_RequiredTargets<BaseType, RenameMap>,
			false, false
		>]?: _NewValue<BaseType, Key>;
	};

export {};
