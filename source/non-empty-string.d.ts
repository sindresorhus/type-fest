/**
Matches any non-empty string.

This is useful when you need a string that is not empty, for example as a function parameter.

@example
```
import type {NonEmptyString} from 'type-fest';
declare function foo<T extends string>(str: NonEmptyString<T>): void;
foo('a');
//=> OK
foo('');
//=> Error: Argument of type '""' is not assignable to parameter of type 'never'.
```

@category String
*/
export type NonEmptyString<T extends string> = T extends '' ? never : T;

