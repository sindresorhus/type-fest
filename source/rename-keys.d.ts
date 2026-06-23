import type {IsLiteral} from './is-literal.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsReadonlyKeyOf} from './is-readonly-key-of.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
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
		: BaseType extends BaseType // Distribute over union sources.
			? BaseType extends object
				? RenameMap extends RenameMap // Distribute over union maps.
					? _AllTargetsAreLiterals<Required<RenameMap>> extends true
						? _RenameOnce<BaseType, Required<RenameMap>>
						: never
					: never
				: never
			: never;

type _AllTargetsAreLiterals<RenameMap> = [
	{
		[Key in keyof RenameMap]: IsLiteral<RenameMap[Key]>;
	}[keyof RenameMap],
] extends [true]
	? true
	: false;

type _TargetOf<SourceKey, RenameMap> =
	SourceKey extends keyof RenameMap
		? RenameMap[SourceKey] extends PropertyKey
			? RenameMap[SourceKey]
			: SourceKey
		: SourceKey;

// `BaseType[Key]` on an optional key includes `undefined`. With EOPT on,
// `Required<Pick>` strips that `undefined`. With EOPT off, the natural
// index access retains it, so mixed-optionality merges include it.
type _NewValue<BaseType, Key extends keyof BaseType> =
	IsExactOptionalPropertyTypesEnabled extends true
		? Required<Pick<BaseType, Key>>[Key]
		: BaseType[Key];

// Targets where at least one contributing source key is readonly.
type _ReadonlyTargets<BaseType extends object, RenameMap> = {
	[Key in keyof BaseType]: Key extends keyof BaseType
		? IsReadonlyKeyOf<BaseType, Key> extends true
			? _TargetOf<Key, RenameMap>
			: never
		: never;
}[keyof BaseType];

// Targets where at least one contributing source key is required.
type _RequiredTargets<BaseType extends object, RenameMap> = {
	[Key in keyof BaseType]: Key extends keyof BaseType
		? IsOptionalKeyOf<BaseType, Key> extends false
			? _TargetOf<Key, RenameMap>
			: never
		: never;
}[keyof BaseType];

// `Target extends Target` distributes per union member.
type _RouteTarget<Target, ReadOnly, Required, NeedReadonly extends boolean, NeedRequired extends boolean> =
	Target extends Target
		? (Target extends ReadOnly ? true : false) extends NeedReadonly
			? (Target extends Required ? true : false) extends NeedRequired
				? Target
				: never
			: never
		: never;

// A literal like `'b'` extends the index signature's `string` key, so
// routing both through the same fragments misclassifies the literals.
type _RenameOnce<BaseType extends object, RenameMap> = Simplify<
	& PickIndexSignature<BaseType>
	& _RenameLiteralKeys<OmitIndexSignature<BaseType>, RenameMap>
>;

// TS's key-remapping inherits the first source's modifiers on collision,
// not "any" or "all". The four fragments specify the modifiers per target.
type _RenameLiteralKeys<BaseType extends object, RenameMap> =
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
