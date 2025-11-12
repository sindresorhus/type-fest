/**
Returns a boolean for whether the given type is `never`.

@link https://github.com/microsoft/TypeScript/issues/31751#issuecomment-498526919
@link https://stackoverflow.com/a/53984913/10292952
@link https://www.zhenghao.io/posts/ts-never

Useful in type utilities, such as checking if something does not occur.

@example
```
import type {IsNever, And} from 'type-fest';

type A = IsNever<never>;
//=> true

type B = IsNever<any>;
//=> false

type C = IsNever<unknown>;
//=> false

type D = IsNever<never[]>;
//=> false

type E = IsNever<object>;
//=> false

type F = IsNever<string>;
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4DkUBuKUANHAIIB2AJgL5wBmUEIcA5EqgLQMrYxsA3AChhnNOTgBeODnxEoAHkqFiAPhEB6TVLUIoAVxSjxcAELTZeVUoCGlRBuHbdjWwBtsxscjQBhSzkbRQNKAGtKCAB3SicXPQYPLxNfOAARQOsFZRsAbQBdOJ0EpO9TAFFM+WJFCAAjACsUAGMYItdEzzLUgDEq4P4oYEoAc3aSrqA)

@example
```
import type {IsNever} from 'type-fest';

type IsTrue<T> = T extends true ? true : false;

// When a distributive conditional is instantiated with `never`, the entire conditional results in `never`.
type A = IsTrue<never>;
//   ^? type A = never

// If you don't want that behaviour, you can explicitly add an `IsNever` check before the distributive condtional.
type IsTrueFixed<T> =
	IsNever<T> extends true ? false : T extends true ? true : false;

type B = IsTrueFixed<never>;
//   ^? type B = false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4DkUBuKUAvnAGZQQhwDkSqAtOStjLQNwBQXDaOAFSgBXFAB4BAPjgBeOALgoAHjBQA7ACbYEItAH4douAC4KAQwA22FNy4B6O3ADqAC3VwzcDcDZRgAI2EYYCI4AGMITWBgyMs4H3i1NjM1YLNVDTgAd2iXOAADNUJifIAaBDdFVOAoNAiomLU42uxhCxhtYDUCoqIofIA6XmQ0AEFZOEFdMV7iSW4HOCWAPQM+OHG5WageRcxyOEQIYS9I+myU+BgXdLh-FBuCYGOocqOTsJTFJTALYDDohZEB4NJkvvkcPg+vlwm4wgBrO4ocjQNDXNDeXwBIIhOqRDSNSxDdZTUQAMWAShQGgk0hkXAAkJDilBad9VJptDBdHADORLNYTPJ2eotIZ9OKhfyrDYeOsAEITUkoClUmnbeb2RwrNYjOCKuTS6xAA)

@category Type Guard
@category Utilities
*/
export type IsNever<T> = [T] extends [never] ? true : false;

export {};
