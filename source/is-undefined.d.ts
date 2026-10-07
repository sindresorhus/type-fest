/**
Returns a boolean for whether the given type is `undefined`.

@example
```
import type {IsUndefined} from 'type-fest';

type UndefinedFallback<T, Fallback> = IsUndefined<T> extends true ? Fallback : T;

type Example1 = UndefinedFallback<undefined, string>;
//=> string

type Example2 = UndefinedFallback<number, string>;
//=> number
```

@category Type Guard
@category Utilities
*/
// `never` is checked first, because it is assignable to `undefined` and would otherwise answer `true`.
export type IsUndefined<T> = [T] extends [never] ? false : [T] extends [undefined] ? true : false;

export {};
