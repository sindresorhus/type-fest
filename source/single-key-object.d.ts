import type {IsEmptyObject} from './empty-object.d.ts';
import type {If} from './if.d.ts';
import type {IsUnion} from './is-union.d.ts';

/**
Create a type that only accepts an object with a single key.

@example
```
import type {SingleKeyObject} from 'type-fest';

declare function someFunction<T>(parameter: SingleKeyObject<T>): void;

someFunction({value: true});

// @ts-expect-error
someFunction({value: true, otherKey: true});
// Error: Argument of type '{value: boolean; otherKey: boolean}' is not assignable to parameter of type 'never'.ts(2345)
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gZWAOwOYA2KA0iogPIBGAVigMYwC+cAZlBCHAORKoC0LFAGcYXANwAoCQBN6BAIZQ0LAK44GwCDjhCOKAGJqNWgDwAVAHwAKMIvkgUMFFABccbPiKkKNejHMWAJRuAG4QwNKSEroOhuowmjhW6CHyBCoobjBQGYyBUQD0BXAAAjBCfCgAHqgMlVDsUNF6ccZJKWkZWTkoADRwEDAAFs7e3bn5EkVwAKIN0G4AglB4Kg448BAsCMhoXB3pmXCUEBBE8jhiA8OjZG4nZygXjFxwwEJwOINw8kJCwHgcPJKEQEBA4LYoPZHM4BtteHscCgQs4uAA6cpWABMAGYACwAVkCQA)

@category Object
*/
export type SingleKeyObject<ObjectType> =
	IsUnion<keyof ObjectType> extends true
		? never
		: If<IsEmptyObject<ObjectType>, never, ObjectType>;

export {};
