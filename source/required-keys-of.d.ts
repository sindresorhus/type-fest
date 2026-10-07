import type {OptionalKeysOf} from './optional-keys-of.d.ts';

/**
Extract all required keys from the given type.

This is useful when you want to create a new type that contains different type values for the required keys only or use the list of keys for validation purposes, etc...

@example
```
import type {RequiredKeysOf} from 'type-fest';

declare function createValidation<
	Entity extends object,
	Key extends RequiredKeysOf<Entity> = RequiredKeysOf<Entity>,
>(field: Key, validator: (value: Entity[Key]) => boolean): (entity: Entity) => boolean;

type User = {
	name: string;
	surname: string;
	luckyNumber?: number;
};

const validator1 = createValidation<User>('name', value => value.length < 25);
const validator2 = createValidation<User>('surname', value => value.length < 25);

// @ts-expect-error
const validator3 = createValidation<User>('luckyNumber', value => value > 0);
// Error: Argument of type '"luckyNumber"' is not assignable to parameter of type '"name" | "surname"'.
```

Known limitations:
- An index signature is reported as a required key, so `RequiredKeysOf<Record<string, unknown>>` is `string` rather than `never`, and `HasRequiredKeys<Record<string, unknown>>` is `true`. This is because `Exclude<keyof Type, …>` puts the signature back, and the same `Exclude` is relied on to keep the members an array inherits from `Array`.
- A union reports the keys of each of its members, so the result can name a key that is not a key of the union itself. `keyof` of a union is the intersection of its members' keys, so `RequiredKeysOf<{a: string} | {b: number}>` is `'a' | 'b'` while `keyof` of the same union is `never`. Read one member at a time if you need a key that is valid for the whole union.

@category Utilities
*/
export type RequiredKeysOf<Type extends object> =
	Type extends unknown // For distributing `Type`
		? Exclude<keyof Type, OptionalKeysOf<Type>>
		: never; // Should never happen

export {};
