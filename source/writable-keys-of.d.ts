/**
Extract all writable keys from the given type.

This is useful when you want to create a new type that contains writable keys only.

@example
```
import type {WritableKeysOf, Except} from 'type-fest';

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
// https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
type IfEquals<X, Y, A, B> =
	(<T>() => T extends X ? 1 : 2) extends
	(<T>() => T extends Y ? 1 : 2) ? A : B;

export type WritableKeysOf<T> = NonNullable<{
	[P in keyof T]: IfEquals<
	{[Q in P]: T[P]},
	{-readonly [Q in P]: T[P]},
	P,
	never
	>
}[keyof T]>;
