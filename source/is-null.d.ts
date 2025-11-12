/**
Returns a boolean for whether the given type is `null`.

@example
```
import type {IsNull} from 'type-fest';

type NonNullFallback<T, Fallback> = IsNull<T> extends true ? Fallback : T;

type Example1 = NonNullFallback<null, string>;
//=> string

type Example2 = NonNullFallback<number, string>;
//=? number
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4DkCuANoQL5wBmUEIcA5EqgLTkrYy0DcAUFw2rhAB2BYgDEAhsQBG4gMYBrADwAVADRwJ0ufIB8cALxwcIwir0oAHjBSCAJtgRR8aAPwbJhGQrgAuOMu5eZDQAUQtxcEIUAEYDOAFhIkJNT21FQST1NihgQQBzHW4AeiL9PWzcvJ4+ODCIsCiAJjiEkxSvJQyQKRQoLJgc-MKuEv03Lp6oIA)

@category Type Guard
@category Utilities
*/
export type IsNull<T> = [T] extends [null] ? true : false;

export {};
