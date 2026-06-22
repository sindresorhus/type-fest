import type {IsLiteral} from './is-literal.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsReadonlyKeyOf} from './is-readonly-key-of.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';

/**
Rename keys in an object type according to a map of old-to-new names. Keys absent from the map pass through unchanged. The value type, the optional modifier, and the readonly modifier go to the new key.

Distributes over a union of rename maps and over a union of source types.

When multiple source keys end up at the same target, the target's value type is the union of the contributors' value types. The target keeps the optional modifier only when every contributor is optional, and is `readonly` when any contributor is `readonly`. With `exactOptionalPropertyTypes` disabled, mixed-optionality merges also union `undefined` into the value type.

A union target distributes, producing one output key per member. For example, `{a: 'b' | 'c'}` on a source with `a: string` produces both `b: string` and `c: string`.

A rename map entry whose key is not a property of the source type is ignored, matching the behavior of `Omit`. The optional modifier on a rename map entry is ignored, so `{a?: 'alpha'}` behaves the same as `{a: 'alpha'}`.

Returns `never` if any of the following hold:
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

// `Required<Pick>` strips the optional-modifier-induced `undefined` so an
// optional source merging into a required target does not leak `undefined`
// into the value when EOPT is on. With EOPT off, the natural `BaseType[Key]`
// keeps `undefined` so mixed-optionality merges still admit it.
type _NewValue<BaseType, Key extends keyof BaseType> =
	IsExactOptionalPropertyTypesEnabled extends true
		? Required<Pick<BaseType, Key>>[Key]
		: BaseType[Key];

// TS's mapped-type key-remapping picks the readonly modifier of the first
// source iterated, not "any". This collects the targets that need to be
// forced readonly.
type _ReadonlyTargets<BaseType extends object, RenameMap> = {
	[Key in keyof BaseType]: Key extends keyof BaseType
		? IsReadonlyKeyOf<BaseType, Key> extends true
			? _TargetOf<Key, RenameMap>
			: never
		: never;
}[keyof BaseType];

type _RenameOnce<BaseType extends object, RenameMap> = Simplify<
	& {
		readonly [Key in keyof BaseType as _TargetOf<Key, RenameMap> extends _ReadonlyTargets<BaseType, RenameMap>
			? _TargetOf<Key, RenameMap>
			: never]: _NewValue<BaseType, Key>;
	}
	& {
		[Key in keyof BaseType as _TargetOf<Key, RenameMap> extends _ReadonlyTargets<BaseType, RenameMap>
			? never
			: _TargetOf<Key, RenameMap>]: _NewValue<BaseType, Key>;
	}
>;

export {};
