import type {IsNegative, Numeric} from './numeric';

/**
An if-else-like type that resolves depending on whether the given number is a negative number, like `-80` or `-0.123`.

@see {@link IsNegative}

@example
```
import type {IfNegative} from 'type-fest';

type ShouldBeTrue = IfNegative<-80>;
//=> true

type ShouldBeBar = IfNegative<0.123, 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
*/
export type IfNegative<
	T extends Numeric,
	TypeIfNegative = true,
	TypeIfNotNegative = false,
> = IsNegative<T> extends true ? TypeIfNegative : TypeIfNotNegative;
