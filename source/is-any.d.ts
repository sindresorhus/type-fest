/**
Returns a boolean indicating if the given type is any.

This type is useful when used inside other types.

@example
```ts
import type {IsAny} from 'type-fest';

function execute<T>(data: T, should_print: IsAny<T>) {
  if(should_print) {
    console.log(data);
  }
}

```

@category Utilities
 */
export type IsAny<Cond> = 0 extends 1 & Cond ? true : false;
