import type {IsOptionalKeyOf, OptionalKeysOf} from './optional-keys-of.d.ts';
import type {Not} from './internal/type.d.ts';

/**
Extract all required keys from the given type.

This is useful when you want to create a new type that contains different type values for the required keys only or use the list of keys for validation purposes, etc...

@example
```
import type {RequiredKeysOf} from 'type-fest';

declare function createValidation<Entity extends object, Key extends RequiredKeysOf<Entity> = RequiredKeysOf<Entity>>(field: Key, validator: (value: Entity[Key]) => boolean): ValidatorFn;

interface User {
	name: string;
	surname: string;

	luckyNumber?: number;
}

const validator1 = createValidation<User>('name', value => value.length < 25);
const validator2 = createValidation<User>('surname', value => value.length < 25);
```

@category Utilities
*/
export type RequiredKeysOf<Type extends object> =
	Type extends unknown // For distributing `Type`
		? Exclude<keyof Type, OptionalKeysOf<Type>>
		: never; // Should never happen

/**
Returns a boolean to whether `Key` is a required key of `Type`.

This is useful when writing utility types or schema validators that need to differentiate `required` keys.

@example
```
import type {IsRequiredKeyOf} from 'type-fest';

interface User {
	name: string;
	surname: string;

	luckyNumber?: number;
}

interface Admin {
	name: string;
	surname?: string
}

type T1 = IsRequiredKeyOf<User, 'name'>
//=> true

type T2 = IsRequiredKeyOf<User, 'luckyNumber'>
//=> false

type T3 = IsRequiredKeyOf<User, 'name' | 'luckyNumber'>
//=> boolean

type T4 = IsRequiredKeyOf<User | Admin, 'name'>
//=> true

type T5 = IsRequiredKeyOf<User | Admin, 'surname'>
//=> boolean
```

@category Type Guard
@category Utilities
*/
export type IsRequiredKeyOf<Type extends object, Key extends keyof Type> = Not<IsOptionalKeyOf<Type, Key>>;
