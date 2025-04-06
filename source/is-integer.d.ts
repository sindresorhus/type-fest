import type {Not} from './internal';
import type {IsFloat} from './is-float';
import type {PositiveInfinity, NegativeInfinity} from './numeric';

/**
Returns a boolean for whether the given number is an integer, like `-5`, `1.0`, or `100`.

Use-case:
- If you want to make a conditional branch based on the result of whether a number is an integer or not.

@example
```
type A = IsInteger<1>;
//=> true

type B = IsInteger<1.0>;
//=> true

type C = IsInteger<-1>;
//=> true

type D = IsInteger<1.23+21>;
//=> true

type E = IsInteger<1.5>;
//=> false

type F = IsInteger<PositiveInfinity>;
//=> false

type G = IsInteger<1e-7>;
//=> false
```

@category Type Guard
@category Numeric
*/
export type IsInteger<T> =
T extends bigint
	? true
	: T extends number
		? number extends T
			? false
			: T extends PositiveInfinity | NegativeInfinity
				? false
				: Not<IsFloat<T>>
		: false;
