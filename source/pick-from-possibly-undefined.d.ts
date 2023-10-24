/**
It allows to `Pick` properties from a type that may be undefined

@example:
```
type User = {
    id: number;
    name: string;
    email: string;
} | undefined;

type UserWithId = PickFromPossiblyUndefined<User, 'id' | 'name'>;
```

// Results in: UserWithId = { id: number, name: string }

@category Object
 **/
export type PickFromPossiblyUndefined<Type, Props extends keyof NonNullable<Type>> = Type extends undefined
	? never
	: NonNullable<Type> extends object
		? Pick<NonNullable<Type>, Props>
		: never;
