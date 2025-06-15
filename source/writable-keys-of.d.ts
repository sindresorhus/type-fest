import type {IsReadonlyKeyOf, ReadonlyKeysOf} from './readonly-keys-of.d.ts';
import type {Not} from './internal/type.d.ts';

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

/**
Returns a boolean to whether `Key` is a readonly key of `Type`.

This is useful when writing utility types or schema validators that need to differentiate `writable` keys.

@example
```
import type {IsWritableKeyOf} from 'type-fest';

interface User {
	name: string;
	surname: string;
	readonly id: number;
}

interface Admin {
	name: string;
	id: string
}

type T1 = IsWritableKeyOf<User, 'name'>
//=> true

type T2 = IsWritableKeyOf<User, 'id'>
//=> false

type T3 = IsWritableKeyOf<User, 'name' | 'id'>
//=> boolean

type T4 = IsWritableKeyOf<User | Admin, 'name'>
//=> true

type T5 = IsWritableKeyOf<User | Admin, 'id'>
//=> boolean
```

@category Type Guard
@category Utilities
*/
export type IsWritableKeyOf<Type extends object, Key extends keyof Type> = Not<IsReadonlyKeyOf<Type, Key>>;
