/**
Represents a map with `unknown` key and value.

Use case: You want a type that all maps can be assigned to, but you don't care about the value.

@example
```
import type {UnknownMap} from 'type-fest';

type IsMap<T> = T extends UnknownMap ? true : false;

type A = IsMap<Map<string, number>>;
//=> true

type B = IsMap<ReadonlyMap<number, string>>;
//=> true

type C = IsMap<string>;
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gVQHYGtsQDu2AsgIZgC+cAZlBCHAORKoC0NKAzjEwNwAoAazQBJLuTAAeACoA+OAF44MuCgAeMFNgAmXODnxFSFOAH4EUAK5oAXLTIAbLikHDkaAIJK44yVP8eKGBsAHMAGjhsKxAAIxQoOTlBAHoUxQUYaxQhETgAIR8-CikAJRQyHQhsR0R-aLiEyKCQ0KTU9Mzs3I84AGEiiRKWsOSBNIyHZxQgA)

@category Type
*/
export type UnknownMap = ReadonlyMap<unknown, unknown>;

export {};
