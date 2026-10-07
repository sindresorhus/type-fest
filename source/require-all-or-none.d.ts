import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {If} from './if.d.ts';
import type {IfNotAnyOrNever, RequireNone} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Requires all of the keys in the given object.
*/
type RequireAll<ObjectType, KeysType extends keyof ObjectType> = Required<Pick<ObjectType, KeysType>>;

/**
Create a type that requires all of the given keys or none of the given keys, while keeping the remaining keys as is.

Use-cases:
- Creating interfaces for components with mutually-inclusive keys.

The caveat with `RequireAllOrNone` is that TypeScript doesn't always know at compile time every key that will exist at runtime. Therefore `RequireAllOrNone` can't do anything to prevent extra keys it doesn't know about.

@example
```
import type {RequireAllOrNone} from 'type-fest';

type Responder = {
	text?: () => string;
	json?: () => string;
	secure: boolean;
};

const responder1: RequireAllOrNone<Responder, 'text' | 'json'> = {
	secure: true,
};

const responder2: RequireAllOrNone<Responder, 'text' | 'json'> = {
	text: () => '{"message": "hi"}',
	json: () => '{"message": "ok"}',
	secure: true,
};
```

@category Object
*/
export type RequireAllOrNone<ObjectType, KeysType extends KeysOfUnion<ObjectType> = KeysOfUnion<ObjectType>> =
	IfNotAnyOrNever<ObjectType, {
		ifNot: If<IsNever<KeysType>,
			ObjectType,
			_RequireAllOrNone<ObjectType, If<IsAny<KeysType>, KeysOfUnion<ObjectType>, KeysType>>>;
	}>;

// The keys are intersected with each member's own inside the distribution, because `keyof` of a union is the intersection of its members' keys, so a key only one member has would otherwise be dropped before the type ever saw it.
type _RequireAllOrNone<ObjectType, KeysType> = ObjectType extends unknown
	? (
		| RequireAll<ObjectType, KeysType & keyof ObjectType>
		| RequireNone<KeysType & keyof ObjectType>
	) & Omit<ObjectType, KeysType & keyof ObjectType> // The rest of the keys.
	: never;

export {};
