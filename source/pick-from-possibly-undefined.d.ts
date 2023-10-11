/**
It allows to pick properties from a type that may be undefined

@example:
type User = {
    id: number;
    name: string;
    email: string;
} | undefined;

type UserWithId = PickFromPossiblyUndefined<User, 'id' | 'name'>;

Results in: UserWithId = { id: number, name: string } | undefined

@category Object
 **/
export type PickFromPossiblyUndefined<Type, Props extends keyof NonNullable<Type>> = NonNullable<Type> extends object
	? Pick<NonNullable<Type>, Props>
	: NonNullable<Type>;
