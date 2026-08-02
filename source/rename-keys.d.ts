import type {IsLiteral} from './is-literal.d.ts';
import type {ReadonlyKeysOf} from './readonly-keys-of.d.ts';
import type {RequiredKeysOf} from './required-keys-of.d.ts';
import type {OptionalKeysOf} from './optional-keys-of.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {SetRequired} from './set-required.d.ts';
import type {SetReadonly} from './set-readonly.d.ts';
import type {IfNotAnyOrNever, IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';

/**
Rename keys in an object type according to a map of old-to-new names.

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

Note: When multiple source keys map to the same target, the target's value type is the union of the contributors' value types. The target is optional only when every contributor is optional, and is `readonly` when any contributor is `readonly`. With `exactOptionalPropertyTypes` disabled, the value type of a mixed-optionality merge also includes `undefined`.

@example
```
import type {RenameKeys} from 'type-fest';

// All colliding keys are required, so the target is required.
type A = RenameKeys<{a: 1; b: 2}, {a: 'x'; b: 'x'}>;
//=> {x: 1 | 2}

// All colliding keys are optional, so the target is optional.
type B = RenameKeys<{a?: 1; b?: 2}, {a: 'x'; b: 'x'}>;
//=> {x?: 1 | 2}

// One of the colliding keys is required, so the target is required.
type C = RenameKeys<{a: 1; b?: 2}, {a: 'x'; b: 'x'}>;
//=> {x: 1 | 2}

// One of the colliding keys is `readonly`, so the target is `readonly`.
type D = RenameKeys<{readonly a: 1; b: 2}, {a: 'x'; b: 'x'}>;
//=> {readonly x: 1 | 2}
```

@example
```
// @exactOptionalPropertyTypes: false
import type {RenameKeys} from 'type-fest';

// With `exactOptionalPropertyTypes` disabled, a mixed-optionality merge includes `undefined`.
type E = RenameKeys<{a?: 1; b: 2}, {a: 'x'; b: 'x'}>;
//=> {x: 1 | 2 | undefined}
```

Note: A union target distributes, producing one output key per member.

@example
```
import type {RenameKeys} from 'type-fest';

type A = RenameKeys<{a: string}, {a: 'b' | 'c'}>;
//=> {b: string; c: string}
```

Note: An entry whose value is not a literal `PropertyKey` (such as `string`) is also ignored, leaving that key's name unchanged.

@example
```
import type {RenameKeys} from 'type-fest';

type A = RenameKeys<{a: 1}, {a: string}>;
//=> {a: 1}

type B = RenameKeys<{a: 1; b: 2}, {a: 'x'; b: symbol}>;
//=> {x: 1; b: 2}
```

Note: A rename map entry whose key is not a property of the source type is ignored.

@example
```
import type {RenameKeys} from 'type-fest';

type A = RenameKeys<{a: 1; b: 2}, {a: 'x'; c: 'y'}>;
//=> {x: 1; b: 2}
```

@category Object
*/
export type RenameKeys<
	BaseType extends object,
	RenameMap extends Record<PropertyKey, PropertyKey>,
> = IfNotAnyOrNever<BaseType, {
	ifNot: BaseType extends unknown // For distributing `BaseType`
		? RenameMap extends unknown // For distributing `RenameMap`
			? RenameOnce<BaseType, NormalizeMap<RenameMap>>
			: never
		: never;
}>;

type RenameOnce<BaseType extends object, RenameMap extends Record<PropertyKey, PropertyKey>> =
	RestoreMergedUndefined<BaseType, RenameMap,
		ApplyReadonly<BaseType, RenameMap,
			ApplyRequired<BaseType, RenameMap,
				RenameNaive<BaseType, RenameMap>>>>;

type RenameNaive<BaseType extends object, RenameMap extends Record<PropertyKey, PropertyKey>> = {
	// Two keys mapping to one target produce a union value and keep only the first key's modifiers.
	// Like for example, `{a?: 1; b: 2}` with `{a: 'x'; b: 'x'}` produces `{x?: 1 | 2}`, taking `a`'s optional.
	[Key in keyof BaseType as TargetOf<Key, RenameMap>]: Required<BaseType>[Key];
};

// A merged target kept only one modifier in `RenameNaive`, so re-force these from every contributor.
type ApplyRequired<BaseType extends object, RenameMap extends Record<PropertyKey, PropertyKey>, Renamed> =
	SetRequired<Renamed, TargetOf<RequiredKeysOf<OmitIndexSignature<BaseType>>, RenameMap> & keyof Renamed>;

type ApplyReadonly<BaseType extends object, RenameMap extends Record<PropertyKey, PropertyKey>, Renamed> =
	SetReadonly<Renamed, TargetOf<ReadonlyKeysOf<OmitIndexSignature<BaseType>>, RenameMap> & keyof Renamed>;

// `exactOptionalPropertyTypes` off keeps `undefined` on a target that merged a required and an optional source.
// Source `{a?: 1; x: 2}` with `{a: 'x'}` gives `{x: 1 | 2 | undefined}`.
type RestoreMergedUndefined<BaseType extends object, RenameMap extends Record<PropertyKey, PropertyKey>, Result> =
	IsExactOptionalPropertyTypesEnabled extends true
		? Result
		: {
			[Key in keyof Result]: Key extends MergedTargets<BaseType, RenameMap>
				? Result[Key] | undefined
				: Result[Key];
		};

type MergedTargets<BaseType extends object, RenameMap extends Record<PropertyKey, PropertyKey>> =
	// Targets renamed from both a required and an optional key prefer the required modifier.
	// Required `b` and optional `a` both rename to `x` in `{a?: 1; b: 2}` with `{a: 'x'; b: 'x'}`.
	TargetOf<RequiredKeysOf<OmitIndexSignature<BaseType>>, RenameMap>
	& TargetOf<OptionalKeysOf<OmitIndexSignature<BaseType>>, RenameMap>;

type NormalizeMap<RenameMap extends Record<PropertyKey, PropertyKey>> = {
	-readonly [Key in keyof RenameMap as true extends IsLiteral<RenameMap[Key]> ? Key : never]-?: RenameMap[Key];
};

type TargetOf<SourceKey extends PropertyKey, RenameMap extends Record<PropertyKey, PropertyKey>> =
	SourceKey extends keyof RenameMap ? RenameMap[SourceKey] : SourceKey;

export {};
