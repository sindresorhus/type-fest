import type {IsEqual} from './is-equal.js';

/**
Extract all readonly keys from the given type.

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
			[Key in keyof Type as IsReadonlyKeyOf<Type, Key> extends true 
				? Key 
				: never
			]: never
		}) & keyof Type // Intersect with `keyof Type` to ensure result of `ReadonlyKeysOf<Type>` is always assignable to `keyof Type`
		: never; // Should never happen

export type IsReadonlyKeyOf<Type extends object, Key extends keyof Type> =
	Key extends unknown // For distributing `Key`
		? IsEqual<
			{[K in Key]: Type[Key]},
			{readonly [K in Key]: Type[Key]}
		>
		: never; // Should never happen
