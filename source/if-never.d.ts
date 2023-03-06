import type {IsNever} from './is-never';

/**
If the given type `T` is `never`, the returned type is `TypeIfNever`. Otherwise, the return type is `TypeIfNotNever`. If only `T` is specified, `TypeIfNever` will be `true` and `TypeIfNotNever` will be false.

@link https://github.com/microsoft/TypeScript/issues/31751#issuecomment-498526919
@link https://stackoverflow.com/a/53984913/10292952

@example
```
import type {IfNever} from 'type-fest';

```

@category Utilities
*/
export type IfNever<T, TypeIfNever = true, TypeIfNotNever = false> = (
	IsNever<T> extends true ? TypeIfNever : TypeIfNotNever
);
