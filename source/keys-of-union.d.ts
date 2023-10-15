/**
Returns a union of all the keys of a given type, including those that are only present in some of the union members.

This is similar to the native `keyof` keyword, however while `keyof` only returns the keys that are present in **ALL** union members, `KeysOfUnion` returns the keys that are present in **ANY** union member.

@link https://stackoverflow.com/a/49402091

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

type CommonKeys = keyof Union; //=> 'common'

type AllKeys = KeysOfUnion<Union>; //=> 'common' | 'a' | 'b' | 'c'
```

@category Object
*/
export type KeysOfUnion<ObjectType> = ObjectType extends unknown
	? keyof ObjectType
	: never;
