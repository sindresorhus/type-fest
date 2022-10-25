/**
Returns a boolean indicating if `T` is any.

This type is usefull when used inside other types.

@example
```ts
import type {IsAny} from 'type-fest';

function execute<T>(data: T, should_print: IsAny<T>) {}

```

@category Utilities
 */
export type IsAny<Cond> = 0 extends 1 & Cond ? true : false;
