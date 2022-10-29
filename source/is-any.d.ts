/**
Returns a boolean indicating if the given type is any.

This type is useful when used inside other types.

@example
```ts
import type {IsAny} from 'type-fest';

function execute<T>(data: T, shouldPrint: IsAny<T>) {
	if(shouldPrint) {
		console.log(data);
	}
}

```

@category Utilities
 */
export type IsAny<Cond> = 0 extends 1 & Cond ? true : false;
