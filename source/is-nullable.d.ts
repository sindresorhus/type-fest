/**
Returns a boolean for whether the given type includes `null`.

@example
```ts
import type {IsNullable} from 'type-fest';

type A = IsNullable<string>
//=> false

type B = IsNullable<string | null>
//=> true

type C = IsNullable<string | undefined>
//=> false

type D = IsNullable<string | null | undefined>
//=> true
```

@category Type Guard
@category Utilities
*/
export type IsNullable<T> = Extract<T, null> extends never ? false : true;
