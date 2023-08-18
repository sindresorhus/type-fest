import type {HasRequiredKeys} from './has-required-keys';
import type {RequireAtLeastOne} from './require-at-least-one';

/**
Represents an object with at least 1 non-optional key.

This is useful where you need an object where all keys are optional, but there must be at least 1 key.

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

// at least 1 key is required, therefore this will report a 2322 error
// Type '{}' is not assignable to type 'UpdateRequest<User>'
// you can use "IsEmptyObject" to check if a object is empty
const update2: UpdateRequest<User> = {};
```

@category Object
*/
export type NonEmptyObject<T extends object> = HasRequiredKeys<T> extends true ? T : RequireAtLeastOne<T, keyof T>;
