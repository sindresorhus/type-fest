import type {IsEqual} from './is-equal.d.ts';

/**
Extract all readonly keys from the given `Type`.

This is useful when you want to create a new type that contains readonly keys only.

@example
```
import type {ReadonlyKeysOf} from 'type-fest';

interface User {
	name: string;
	surname: string;
	readonly id: number;
}

type UpdateResponse<Entity extends object> = Pick<Entity, ReadonlyKeysOf<Entity>>;

const update1: UpdateResponse<User> = {
    id: 123,
};
```

@category Utilities
*/
export type ReadonlyKeysOf<Type extends object> =
	Type extends unknown // For distributing `Type`
		? (keyof {
			[Key in keyof Type as
			IsReadonlyKeyOf<Type, Key> extends false
				? never
				: Key
			]: never
		}) & keyof Type // Intersect with `keyof Type` to ensure result of `ReadonlyKeysOf<Type>` is always assignable to `keyof Type`
		: never; // Should never happen

/**
Returns a boolean to whether `Key` is a readonly key of `Type`.

This is useful when writing utility types or schema validators that need to differentiate `readonly` keys.

@example
```
import type {IsReadonlyKeyOf} from 'type-fest';

interface User {
	name: string;
	surname: string;
	readonly id: number;
}

interface Admin {
	name: string;
	id: string
}

type T1 = IsReadonlyKeyOf<User, 'id'>
//=> true

type T2 = IsReadonlyKeyOf<User, 'name'>
//=> false

type T3 = IsReadonlyKeyOf<User, 'name' | 'id'>
//=> boolean

type T4 = IsReadonlyKeyOf<User | Admin, 'name'>
//=> false

type T5 = IsReadonlyKeyOf<User | Admin, 'id'>
//=> boolean
```

@category Type Guard
@category Utilities
*/
export type IsReadonlyKeyOf<Type extends object, Key extends keyof Type> =
	Key extends unknown // For distributing `Key`
		? IsEqual<
			{[K in Key]: Type[Key]},
			{readonly [K in Key]: Type[Key]}
		>
		: never; // Should never happen
