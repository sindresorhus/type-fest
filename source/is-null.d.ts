import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether the given type is `null`.

Checks unions as a whole. Returns `false` for `any`, `never`, and `unknown`.

@example
```
import type {IsNull} from 'type-fest';

type NonNullFallback<T, Fallback> = IsNull<T> extends true ? Fallback : T;

type Example1 = NonNullFallback<null, string>;
//=> string

type Example2 = NonNullFallback<number, string>;
//=> number
```

@category Type Guard
@category Utilities
*/
// `any` and `never` are checked first, because they are assignable to `null` and would otherwise answer `true`.
export type IsNull<Value> = IsAny<Value> extends true ? false : [Value] extends [never] ? false : [Value] extends [null] ? true : false;

export {};
