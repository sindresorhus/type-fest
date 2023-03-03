/**
Returns a boolean for whether a given string is a literal.

@link https://github.com/sindresorhus/type-fest/issues/541

Use-cases:
- If you want to make sure that a given type is an explicit literal string, and not a generic string

@example
```
import type {IsStringLiteral} from 'type-fest';

IsStringLiteral<'red'>; // true
IsStringLiteral<string>; // false
```

@category Template literal
*/
export type IsStringLiteral<T> = T extends string
	? string extends T
		? false
		: true
	: false;
