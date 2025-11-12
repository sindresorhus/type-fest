/**
Represents an array with `unknown` value.

Use case: You want a type that all arrays can be assigned to, but you don't care about the value.

@example
```
import type {UnknownArray} from 'type-fest';

type IsArray<T> = T extends UnknownArray ? true : false;

type A = IsArray<['foo']>;
//=> true

type B = IsArray<readonly number[]>;
//=> true

type C = IsArray<string>;
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gVQHYGtsQDu2AglFAIaIC+cAZlBCHAORKoC0dKAzjCwG4AUEPZoAkjzKVEAHgAqAPjgBeOPLgoAHjBTYAJjzg58RUuSpwA-AigBXNAC56FADY8Uw0cjQlVcSWkqWQBtFjoICBYAXUVhAHp4lWUYexQRMTgAIX9AizkoFAp9CGxXRDhsOxAAIxQoENiEpJS0jJ84AGFcqXzZPihgbABzOKFE5Jd3FCA)

@category Type
@category Array
*/
export type UnknownArray = readonly unknown[];

export {};
