import type {RequiredKeysOf} from './required-keys-of.d.ts';
import type {RequireAtLeastOne} from './require-at-least-one.d.ts';

/**
Represents an object with at least 1 non-optional key.

This is useful when you need an object where all keys are optional, but there must be at least 1 key.

@example
```
import type {NonEmptyObject} from 'type-fest';

type User = {
	name: string;
	surname: string;
	id: number;
};

type UpdateRequest<Entity extends object> = NonEmptyObject<Partial<Entity>>;

const update1: UpdateRequest<User> = {
	name: 'Alice',
	surname: 'Acme',
};

// At least 1 key is required, therefore this will report a 2322 error:
// Type '{}' is not assignable to type 'UpdateRequest<User>'
// @ts-expect-error
const update2: UpdateRequest<User> = {};
```

@see Use `IsEmptyObject` to check whether an object is empty.

Note: An index signature counts as a required key, so a type with one accepts `{}`.

@category Object
*/
export type NonEmptyObject<T extends object> = T extends unknown // For distributing `T`, so each union member is checked on its own keys
	? RequiredKeysOf<T> extends never ? RequireAtLeastOne<T, keyof T> : T
	: never;

export {};
