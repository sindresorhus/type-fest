/**
Extract all readonly keys from the given type.

This is useful when you want to create a new type that contains readonly keys only.

@example
```
import type {ReadonlyKeysOf, Except} from 'type-fest';

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
// https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
type IfEquals<X, Y, A, B> =
	(<T>() => T extends X ? 1 : 2) extends
	(<T>() => T extends Y ? 1 : 2) ? A : B;

export type ReadonlyKeysOf<T> = NonNullable<{
	[P in keyof T]: IfEquals<
	{[Q in P]: T[P]},
	{readonly [Q in P]: T[P]},
	P,
	never
	>
}[keyof T]>;
