import type {IsUnknown} from './is-unknown';

/**
If the given type `T` is `unknown`, the returned type is `TypeIfUnknown`.
Otherwise, the return type is `TypeIfNotUnknown`.
If only `T` is specified, `TypeIfUnknown` will be `true` and `TypeIfNotUnknown` will be false.

@example
```
import type {IfUnknown} from 'type-fest';

```

@category Utilities
*/
export type IfUnknown<T, TypeIfUnknown = true, TypeIfNotUnknown = false> = (
	IsUnknown<T> extends true ? TypeIfUnknown : TypeIfNotUnknown
);
