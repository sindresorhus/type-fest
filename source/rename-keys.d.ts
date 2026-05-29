import type {KeysOfUnion} from './keys-of-union.d.ts';

/**
Rename multiple keys in an object type at once, preserving each value type and modifiers (optional, readonly).

Each entry in the rename map relabels one source key to one target key. Keys absent from the map are kept unchanged. See {@link RenameKey} for the single-key variant.

Map entries must be required and their targets must not collide: an entry whose target already exists as a kept key, or two entries sharing a target, are rejected, because collapsing keys would also collapse their modifiers. Swapping keys (each renamed away to the other's name) is allowed since no key is lost.

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

The rename map constraint enforces that every source key exists on the input so you can't mess up the key names and you also get intellisense:

@example
```
import type {RenameKeys} from 'type-fest';

type User = {id: string; name: string};

// @ts-expect-error 'nme' is not a key of User.
type Bad = RenameKeys<User, {nme: 'fullName'}>;
```

@category Object
*/
export type RenameKeys<
	BaseType,
	RenameMap extends Partial<Record<KeysOfUnion<BaseType>, PropertyKey>> & {
		[Key in keyof RenameMap]: Key extends KeysOfUnion<BaseType>
			? RenameMap[Key] extends PropertyKey
				? RenameMap[Key] extends Exclude<KeysOfUnion<BaseType>, keyof RenameMap>
					? never
					: RenameMap[Key] extends RenameMap[Exclude<keyof RenameMap, Key>]
						? never
						: RenameMap[Key]
				: never
			: never;
	},
> = {
	[Key in keyof BaseType as Key extends keyof RenameMap
		? RenameMap[Key] extends PropertyKey
			? RenameMap[Key]
			: Key
		: Key]: BaseType[Key];
};

export {};
