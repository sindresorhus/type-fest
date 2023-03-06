/** Returns a boolean for whether the given type is `null`. */
type IsNull<T> = [T] extends [null] ? true : false;

/**
Returns a boolean for whether the given type is `unknown`.

@link https://github.com/dsherret/conditional-type-checks/pull/16

@example
```
import type {IsUnknown} from 'type-fest';

```

@category Utilities
*/
export type IsUnknown<T> = (
	unknown extends T // `T` can be `unknown` or `any`
		? IsNull<T> extends false // `any` can be `null`, but `unknown` can't be
			? true
			: false
		: false
);

/**
If the given type `T` is `unknown`, the returned type is `TypeIfUnknown`.
Otherwise, the return type is `TypeIfNotUnknown`. If only `T` is specified,
`TypeIfUnknown` will be `true` and `TypeIfNotUnknown` will be false.

@example
```
import type {IfUnknown} from 'type-fest';

```

@category Utilities
*/
export type IfUnknown<T, TypeIfUnknown = true, TypeIfNotUnknown = false> = (
	IsUnknown<T> extends true ? TypeIfUnknown : TypeIfNotUnknown
);
