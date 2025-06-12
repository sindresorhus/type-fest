import type {IsReadonlyKeyOf, ReadonlyKeysOf} from './readonly-keys-of.js';
import type {Not} from './internal/type.js';

/**
Extract all writable keys from the given type.

This is useful when you want to create a new type that contains writable keys only.

@example
```
import type {WritableKeysOf} from 'type-fest';

interface User {
	name: string;
	surname: string;
	readonly id: number;
}

type UpdateRequest<Entity extends object> = Pick<Entity, WritableKeysOf<Entity>>;

const update1: UpdateRequest<User> = {
	name: 'Alice',
	surname: 'Acme',
};
```

@category Utilities
*/
export type WritableKeysOf<Type extends object> =
	Type extends unknown // For distributing `Type`
		? Exclude<keyof Type, ReadonlyKeysOf<Type>>
		: never; // Should never happen

export type IsWritableKeyOf<Type extends object, Key extends keyof Type> = Not<IsReadonlyKeyOf<Type, Key>>;
