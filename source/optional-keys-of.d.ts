/**
Extract all optional keys from the given `Type`.

This is useful when you want to create a new type that contains different type values for the optional keys only.

@example
```
import type {OptionalKeysOf, Except} from 'type-fest';

interface User {
	name: string;
	surname: string;

	luckyNumber?: number;
}

const REMOVE_FIELD = Symbol('remove field symbol');
type UpdateOperation<Entity extends object> = Except<Partial<Entity>, OptionalKeysOf<Entity>> & {
	[Key in OptionalKeysOf<Entity>]?: Entity[Key] | typeof REMOVE_FIELD;
};

const update1: UpdateOperation<User> = {
	name: 'Alice'
};

const update2: UpdateOperation<User> = {
	name: 'Bob',
	luckyNumber: REMOVE_FIELD
};
```

@category Utilities
*/
export type OptionalKeysOf<Type extends object> =
	Type extends unknown // For distributing `Type`
		? (keyof {
			[Key in keyof Type as 
				IsOptionalKeyOf<Type, Key> extends false 
					? never 
					: Key
			]: never
		}) & keyof Type // Intersect with `keyof Type` to ensure result of `OptionalKeysOf<Type>` is always assignable to `keyof Type`
		: never; // Should never happen

/**
Returns a boolean to whether `Key` is an optional key of `Type`.

This is useful when writing utility types or schema validators that need to differentiate `optional` keys.

@example
```
import type {IsOptionalKeyOf} from 'type-fest';

interface User {
	name: string;
	surname: string;

	luckyNumber?: number;
}

interface Admin {
	name: string;
	surname?: string
}

type T1 = IsOptionalKeyOf<User, 'luckyNumber'>
//=> true

type T2 = IsOptionalKeyOf<User, 'name'>
//=> false

type T3 = IsOptionalKeyOf<User, 'name' | 'luckyNumber'>
//=> boolean

type T4 = IsOptionalKeyOf<User | Admin, 'name'>
//=> false

type T5 = IsOptionalKeyOf<User | Admin, 'surname'>
//=> boolean
```

@category Type Guard
@category Utilities
*/
export type IsOptionalKeyOf<Type extends object, Key extends keyof Type> =
	Key extends unknown // For distributing `Key`
		? Type extends Record<Key, Type[Key]> 
			? false 
			: true
		: never; // Should never happen
