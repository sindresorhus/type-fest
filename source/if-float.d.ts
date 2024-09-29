import type {IsFloat} from './is-float';

/**
An if-else-like type that resolves depending on whether the given type is a float, like `1.5` or `-1.5`.

@see {@link IsFloat}

@example
```
import type {IfFloat} from 'type-fest';

type ShouldBeTrue = IfFloat<3.14>;
//=> true

type ShouldBeBar = IfFloat<'not float', 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
*/
export type IfFloat<
	T,
	TypeIfFloat = true,
	TypeIfNotFloat = false,
> = IsFloat<T> extends true ? TypeIfFloat : TypeIfNotFloat;
