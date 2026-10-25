/**
Returns a boolean for whether the given type includes `undefined`.

Note: `IsOptional<unknown>` and `IsOptional<void>` are `false`, because `undefined` is assignable to them but is not a member of them. `IsOptional<any>` is `true`.

@example
```ts
import type {IsOptional} from 'type-fest';

type A = IsOptional<string>;
//=> false

type B = IsOptional<string | undefined>;
//=> true

type C = IsOptional<string | null>;
//=> false

type D = IsOptional<string | null | undefined>;
//=> true
```

@category Type Guard
@category Utilities
*/
// Extraction yields `undefined`, `never`, or `any`; only the first and last include `undefined`.
export type IsOptional<T> = undefined extends Extract<T, undefined> ? true : false;

export {};
