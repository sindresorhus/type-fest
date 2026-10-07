import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {RequireExactlyOne} from './require-exactly-one.d.ts';
import type {IfNotAnyOrNever, RequireNone} from './internal/index.d.ts';
import type {If} from './if.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Create a type that requires exactly one of the given keys or none of the given keys, while keeping the remaining keys as is.

@example
```
import type {RequireOneOrNone} from 'type-fest';

type Responder = RequireOneOrNone<{
	text: () => string;
	json: () => string;
	secure: boolean;
}, 'text' | 'json'>;

const responder1: Responder = {
	secure: true,
};

const responder2: Responder = {
	text: () => '{"message": "hi"}',
	secure: true,
};

const responder3: Responder = {
	json: () => '{"message": "ok"}',
	secure: true,
};
```

@category Object
*/
export type RequireOneOrNone<ObjectType, KeysType extends KeysOfUnion<ObjectType> = KeysOfUnion<ObjectType>> =
	IfNotAnyOrNever<ObjectType, {
		ifNot: If<IsNever<KeysType>,
			ObjectType,
			_RequireOneOrNone<ObjectType, If<IsAny<KeysType>, KeysOfUnion<ObjectType>, KeysType>>>;
	}>;

// The keys are intersected with each member's own inside the distribution, because `keyof` of a union is the intersection of its members' keys, so a key only one member has would otherwise be dropped before the type ever saw it.
type _RequireOneOrNone<ObjectType, KeysType extends PropertyKey> = ObjectType extends unknown
	? (
		| RequireExactlyOne<ObjectType, KeysType & keyof ObjectType>
		| RequireNone<KeysType & keyof ObjectType>
	) & Omit<ObjectType, KeysType & keyof ObjectType> // Ignore unspecified keys.
	& RequireNone<Exclude<KeysType, keyof ObjectType>> // Forbid the keys of the other union members.
	: never;

export {};
