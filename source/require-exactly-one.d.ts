import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {If} from './if.d.ts';
import type {IfNotAnyOrNever} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Create a type that requires exactly one of the given keys and disallows more, while keeping the remaining keys as is.

Use-cases:
- Creating interfaces for components that only need one of the keys to display properly.
- Declaring generic keys in a single place for a single use-case that gets narrowed down via `RequireExactlyOne`.

The caveat with `RequireExactlyOne` is that TypeScript doesn't always know at compile time every key that will exist at runtime. Therefore `RequireExactlyOne` can't do anything to prevent extra keys it doesn't know about.

Note: For a union, a member that has none of the given keys is kept as it is. For example, with `{kind: 'circle'; radius?: number; diameter?: number} | {kind: 'square'; side: number}` and the keys `'radius' | 'diameter'`, a square needs neither key.

@example
```
import type {RequireExactlyOne} from 'type-fest';

type Responder = {
	text: () => string;
	json: () => string;
	secure: boolean;
};

const responder: RequireExactlyOne<Responder, 'text' | 'json'> = {
	// Adding a `text` key here would cause a compile error.

	json: () => '{"message": "ok"}',
	secure: true,
};
```

@category Object
*/
export type RequireExactlyOne<ObjectType, KeysType extends KeysOfUnion<ObjectType> = KeysOfUnion<ObjectType>> =
	IfNotAnyOrNever<ObjectType, {
		ifNot: If<IsNever<KeysType>,
			never,
			_RequireExactlyOne<ObjectType, If<IsAny<KeysType>, KeysOfUnion<ObjectType>, KeysType>>>;
	}>;

// The keys are intersected with each member's own inside the distribution, because `keyof` of a union is the intersection of its members' keys, so a key only one member has would otherwise be dropped before the mapped type ever saw it.
type _RequireExactlyOne<ObjectType, KeysType extends PropertyKey> = ObjectType extends unknown
	// A member that has none of the keys is left as it is.
	? If<IsNever<KeysType & keyof ObjectType>, ObjectType, _RequireExactlyOneOfOne<ObjectType, KeysType & keyof ObjectType, KeysType>>
	: never;

// `AllKeysType` also has the keys of the other union members, so they are forbidden next to the required key too.
type _RequireExactlyOneOfOne<ObjectType, KeysType extends keyof ObjectType, AllKeysType extends PropertyKey> =
	{[Key in KeysType]: (
		Required<Pick<ObjectType, Key>>
		& Partial<Record<Exclude<AllKeysType, Key>, never>>
	)}[KeysType] & Omit<ObjectType, KeysType>;

export {};
