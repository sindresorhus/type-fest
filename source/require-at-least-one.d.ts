import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {Except} from './except.d.ts';
import type {If} from './if.d.ts';
import type {IfNotAnyOrNever} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Create a type that requires at least one of the given keys, while keeping the remaining keys as is.

Note: For a union, a member that has none of the given keys is kept as it is. For example, with `{kind: 'circle'; radius?: number; diameter?: number} | {kind: 'square'; side: number}` and the keys `'radius' | 'diameter'`, a square needs neither key.

Note: An index signature cannot be required, so if the keys include one (for example, the default keys of `Record<string, number>`), the type accepts `{}`.

@example
```
import type {RequireAtLeastOne} from 'type-fest';

type Responder = {
	text?: () => string;
	json?: () => string;
	secure?: boolean;
};

const responder: RequireAtLeastOne<Responder, 'text' | 'json'> = {
	json: () => '{"message": "ok"}',
	secure: true,
};
```

@category Object
*/
export type RequireAtLeastOne<
	ObjectType,
	KeysType extends KeysOfUnion<ObjectType> = KeysOfUnion<ObjectType>,
> =
	IfNotAnyOrNever<ObjectType, {
		ifNot: If<IsNever<KeysType>,
			never,
			_RequireAtLeastOne<ObjectType, If<IsAny<KeysType>, KeysOfUnion<ObjectType>, KeysType>>>;
	}>;

// The keys are intersected with each member's own inside the distribution, because `keyof` of a union is the intersection of its members' keys, so a key only one member has would otherwise be dropped before the mapped type ever saw it.
type _RequireAtLeastOne<ObjectType, KeysType> = ObjectType extends unknown
	// A member that has none of the keys is left as it is.
	? If<IsNever<KeysType & keyof ObjectType>, ObjectType, _RequireAtLeastOneOfOne<ObjectType, KeysType & keyof ObjectType>>
	: never;

type _RequireAtLeastOneOfOne<ObjectType, KeysType extends keyof ObjectType> = {
	// For each `Key` in `KeysType` make a mapped type:
	[Key in KeysType]-?: Required<Pick<ObjectType, Key>> // 1. Make `Key`'s type required
		& Partial<Pick<ObjectType, Exclude<KeysType, Key>>>; // 2. Make all other keys in `KeysType` optional
}[KeysType]
& Except<ObjectType, KeysType>; // 3. Add the remaining keys not in `KeysType`

export {};
