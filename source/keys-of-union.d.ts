/**
Create a union of all keys from a given type, even those exclusive to specific union members.

Unlike the native `keyof` keyword, which returns keys present in **all** union members, this type returns keys from **any** member.

@see https://stackoverflow.com/a/49402091

@example
```
import type {KeysOfUnion} from 'type-fest';

type A = {
	common: string;
	a: number;
};

type B = {
	common: string;
	b: string;
};

type C = {
	common: string;
	c: boolean;
};

type Union = A | B | C;

type CommonKeys = keyof Union;
//=> 'common'

type AllKeys = KeysOfUnion<Union>;
//=> 'common' | 'a' | 'b' | 'c'
```

@category Object
*/
export type KeysOfUnion<ObjectType> =
	// Adds no keys, since these are the keys all members share, but it lets the compiler accept a key narrowed with `keyof` when `ObjectType` is generic, such as a conditional type that is not resolved yet.
	| keyof ObjectType
	// Infer a union of each member's keys from function return types.
	// This avoids the record intersections and extra `& Union` that `UnionToIntersection` would create.
	// The outer conditional prevents unresolved generic union keys from being treated as safe to index every member.
	| ((ObjectType extends unknown ? () => keyof ObjectType : never) extends (() => infer Keys extends PropertyKey)
		? Keys
		: never);

export {};
