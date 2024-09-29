import type {IsEqual} from './is-equal';

/**
An if-else-like type that resolves depending on whether the two given types are equal.

@see {@link IsEqual}

@example
```
import type {IfEqual} from 'type-fest';

type ShouldBeTrue = IfEqual<boolean, boolean>;
//=> true

type ShouldBeBar = IfEqual<'not', 'equal', 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
*/
export type IfEqual<
	A,
	B,
	TypeIfEqual = true,
	TypeIfNotEqual = false,
> = IsEqual<A, B> extends true ? TypeIfEqual : TypeIfNotEqual;
