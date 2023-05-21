/**
Represents an object with at least 1 non-optional key.

This is useful where you need an object where all keys are optional, but there must be at least 1 key.

@example
```
import type {NonEmptyObject} from 'type-fest';

interface User {
	name: string;
	surname: string;
	id: number;
}

type UpdateRequest<Entity extends object> = NonEmptyObject<Entity>;

const update1: UpdateRequest<User> = {
	name: 'Alice',
	surname: 'Acme',
};

const update2: UpdateRequest<User> = {}; // that's a bug!
```

@category Utilities
*/
export type NonEmptyObject<T> = {
	[K in keyof T]-?: Pick<Required<T>, K>
}[keyof T]
