import type {ExactKey, LiteralKeyOf} from './internal/keys.d.ts';
import type {IsLiteral} from './is-literal.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {ReadonlyKeysOf} from './readonly-keys-of.d.ts';
import type {RequiredKeysOf} from './required-keys-of.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {SetRequired} from './set-required.d.ts';
import type {SetReadonly} from './set-readonly.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {NormalizedKeys} from './internal/object.d.ts';
import type {ToString} from './internal/string.d.ts';

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

Note: When multiple source keys map to the same target, the target's value type is the union of the contributors' value types. The target is optional only when every contributor is optional, and is `readonly` when any contributor is `readonly`. Explicitly declared `undefined` remains part of a contributor's value type.

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
import type {RenameKeys} from 'type-fest';

// An optional contributor explicitly allowing `undefined` retains it in a required target.
type E = RenameKeys<{a?: 1 | undefined; b: 2}, {a: 'x'; b: 'x'}>;
//=> {x: 1 | 2 | undefined}
```

Note: A union of literal targets produces one output key per member.

@example
```
import type {RenameKeys} from 'type-fest';

type A = RenameKeys<{a: string}, {a: 'b' | 'c'}>;
//=> {b: string; c: string}
```

Note: An entry is ignored if any target member is not a literal `PropertyKey` (such as `string` or `number`), leaving that key's name unchanged.

@example
```
import type {RenameKeys} from 'type-fest';

type A = RenameKeys<{a: 1}, {a: string}>;
//=> {a: 1}

type B = RenameKeys<{a: 1; b: 2}, {a: 'x'; b: symbol}>;
//=> {x: 1; b: 2}

type C = RenameKeys<{a: 1}, {a: 'b' | number}>;
//=> {a: 1}
```

Note: A rename map entry whose key is not a property of the source type is ignored.

@example
```
import type {RenameKeys} from 'type-fest';

type A = RenameKeys<{a: 1; b: 2}, {a: 'x'; c: 'y'}>;
//=> {x: 1; b: 2}
```

Known limitations:
- Renaming an array or tuple key is unsupported and resolves to `never`. A map that renames none of its keys, such as `{}`, `{a: 'a'}`, or `{missing: 'new'}`, keeps the array or tuple, including in a union.
- A real rename of a callable object drops its call signature, so `RenameKeys<{(a: string): number; p?: number}, {p: 'q'}>` is `{q?: number}` rather than an object that is still callable. A map that renames nothing keeps the call signature. The rename is a mapped type over `keyof`, and that cannot carry a call signature over. `SetFieldType` and `SetNonNullable` drop it the same way.

@category Object
*/
export type RenameKeys<
	BaseType extends object,
	RenameMap extends Record<PropertyKey, PropertyKey>,
> = IfNotAnyOrNever<BaseType, {
	ifNot: BaseType extends unknown // For distributing `BaseType`
		? IsNever<RenameMap> extends true // A `never` map renames nothing, so don't distribute over it
			? BaseType
			: RenameMap extends unknown // For distributing `RenameMap`
				? RenameWithNormalizedMap<BaseType, NormalizeMap<RenameMap>>
				: never
		: never;
}>;

/**
Renames with an already normalized map. A map that changes none of the source's keys skips {@link RenameOnce}, because rebuilding would drop call signatures and array or tuple structure.
*/
type RenameWithNormalizedMap<BaseType extends object, RenameMap extends Record<PropertyKey, PropertyKey>> =
	[RenamesSomething<BaseType, RenameMap>] extends [never]
		? BaseType
		: BaseType extends readonly unknown[]
			? never
			: RenameOnce<BaseType, RenameMap>;

/**
The source keys whose names change, so that a map with only missing source keys or identity entries skips rebuilding the type. The same target lookup is used here and by the rename itself, including numeric keys and index signatures.
*/
type RenamesSomething<BaseType extends object, RenameMap extends Record<PropertyKey, PropertyKey>> = keyof {
	[Key in keyof BaseType as IsEqual<NormalizedKeys<TargetOf<Key, RenameMap>>, NormalizedKeys<Key>> extends true ? never : Key]: never;
};

type RenameOnce<BaseType extends object, RenameMap extends Record<PropertyKey, PropertyKey>> =
	ApplyReadonly<BaseType, RenameMap,
		ApplyRequired<BaseType, RenameMap,
			RenameNaive<BaseType, RenameMap>>>;

type RenameNaive<BaseType extends object, RenameMap extends Record<PropertyKey, PropertyKey>, NumericTargets extends number = TargetOf<LiteralKeyOf<BaseType>, RenameMap> & number> = {
	// Targets with the same numeric spelling share one key before later maps restore their modifiers; retaining both aliases would make those maps drop the property.
	// Like for example, `{a?: 1; b: 2}` with `{a: 'x'; b: 'x'}` produces `{x?: 1 | 2}`, taking `a`'s optional.
	[Key in keyof BaseType as
	Extract<NumericTargets, NormalizedKeys<Extract<TargetOf<Key, RenameMap>, `${NumericTargets}`>>>
	| Exclude<TargetOf<Key, RenameMap>, `${NumericTargets}`>
	]: Required<BaseType>[Key];
};

// A merged target kept only one modifier in `RenameNaive`, so re-force these from every contributor.
// Targets renamed from both a required and an optional key prefer the required modifier: required `b` and optional `a` both rename to `x` in `{a?: 1; b: 2}` with `{a: 'x'; b: 'x'}`.
// Explicitly declared `undefined` stays in the value, so `{a?: 1 | undefined; x: 2}` with `{a: 'x'}` gives `{x: 1 | 2 | undefined}`.
type ApplyRequired<BaseType extends object, RenameMap extends Record<PropertyKey, PropertyKey>, Renamed> =
	SetRequired<Renamed, NormalizedKeys<TargetOf<RequiredKeysOf<OmitIndexSignature<BaseType>>, RenameMap>> & keyof Renamed>;

type ApplyReadonly<BaseType extends object, RenameMap extends Record<PropertyKey, PropertyKey>, Renamed> =
	SetReadonly<Renamed, NormalizedKeys<TargetOf<ReadonlyKeysOf<OmitIndexSignature<BaseType>>, RenameMap>> & keyof Renamed>;

type NormalizeMap<RenameMap extends Record<PropertyKey, PropertyKey>> = {
	// Include a string enum key's literal spelling, so either form can select the rename.
	// Ignore optional-entry absence, but reject the whole target if any member is non-literal.
	-readonly [Key in keyof RenameMap as IsLiteral<Required<RenameMap>[Key]> extends true ? Key | ToString<Key & string> : never]-?: RenameMap[Key];
};

// Numeric keys and their canonical string forms name the same property, so `{'0': 'x'}` also renames `{0: …}`. Other numeric-looking strings, like `'01'`, stay distinct.
type TargetOf<SourceKey extends PropertyKey, RenameMap extends Record<PropertyKey, PropertyKey>> =
	SourceKey extends unknown
		? IsNever<ExactKey<RenameMap, SourceKey>> extends true
			? SourceKey
			: RenameMap[ExactKey<RenameMap, SourceKey>]
		: never;

export {};
