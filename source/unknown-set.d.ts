/**
Represents a set with `unknown` value.

Use case: You want a type that all sets can be assigned to, but you don't care about the value.

@example
```
import type {UnknownSet} from 'type-fest';

type IsSet<T> = T extends UnknownSet ? true : false;

type A = IsSet<Set<string>>;
//=> true

type B = IsSet<ReadonlySet<number>>;
//=> true

type C = IsSet<string>;
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gVQHYGtsQDu2AyijAL5wBmUEIcA5EqgLTUoDOMjA3AFD8WaAJKcyMADwAVAHxwAvHGlwUADxgpsAE05wc+IqXJwA-AigBXNAC4aAQwA2nFAKHI0AQUVwxEyf7cUMDYAOaysgIA9FEK8jBWKILCcABCPn7kkgBKKPbaENiOiP7YliAARihQEdGx8YnJHnAAwhniWUEh4XVxDs4oQA)

@category Type
*/
export type UnknownSet = ReadonlySet<unknown>;

export {};
