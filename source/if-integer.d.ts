import type {IsInteger} from './is-integer';

/**
An if-else-like type that resolves depending on whether the given type is an integer, like `-5`, `1.0` or `100`.

@see {@link IsInteger}

@example
```
import type {IfInteger} from 'type-fest';

type ShouldBeTrue = IfInteger<7>;
//=> true

type ShouldBeBar = IfInteger<'not integer', 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
*/
export type IfInteger<
	T,
	TypeIfInteger = true,
	TypeIfNotInteger = false,
> = IsInteger<T> extends true ? TypeIfInteger : TypeIfNotInteger;
