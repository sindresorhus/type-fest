/**
Returns a boolean for whether the given type is `any`.

@link https://stackoverflow.com/a/49928360/1490091

Useful for disallowing `any`s to be passed to a function or used in a type utility.

@example
```
import type {IsAny} from 'type-fest';

type Must<T> = (
	IsAny<T> extends false
		? IsNever<T> extends false
			? IsUnknown<T> extends false
				? IsUndefined<T> extends false
					? IsNull<T> extends false
						? T
						: never
					: never
				: never
			: never
		: never
);
```

@category Utilities
*/
export type IsAny<T> = 0 extends 1 & T ? true : false;
