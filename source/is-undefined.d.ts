import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether the given type is `undefined`.

Checks unions as a whole. Returns `false` for `any`, `never`, and `unknown`.

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
// `any` and `never` are checked first, because they are assignable to `undefined` and would otherwise answer `true`.
export type IsUndefined<Value> = IsAny<Value> extends true ? false : [Value] extends [never] ? false : [Value] extends [undefined] ? true : false;

export {};
