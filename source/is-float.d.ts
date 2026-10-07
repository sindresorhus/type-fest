import type {IsAny} from './is-any.d.ts';
import type {UnwrapBrand} from './internal/object.d.ts';

/**
Returns a boolean for whether the given number is a float, like `1.5` or `-1.5`.

Use-case:
- If you want to make a conditional branch based on the result of whether a number is a float or not.

@example
```
import type {IsFloat, PositiveInfinity} from 'type-fest';

type A = IsFloat<1.5>;
//=> true

type B = IsFloat<-1.5>;
//=> true

type C = IsFloat<1e-7>;
//=> true

type D = IsFloat<1.0>;
//=> false

type E = IsFloat<PositiveInfinity>;
//=> false

type F = IsFloat<1.23e+21>;
//=> false
```

@category Type Guard
@category Numeric
*/
// A branded or tagged literal is still a literal, so the brand is removed first, because `${T}` does not reduce for a literal intersected with an object type.
export type IsFloat<T> =
	// `any` is not a float and is not the absence of one either, so it answers `boolean`, the same as `IsInteger` does for it. `IsNumericLiteral`, `IsBooleanLiteral`, `IsStringLiteral` and `IsSymbolLiteral` answer `false` for `any` instead, because each of them narrows to one kind of literal, while a number may be either a float or an integer.
	IsAny<T> extends true
		? boolean
		: _IsFloat<UnwrapBrand<T>>;

type _IsFloat<T> = T extends number
	? `${T}` extends `${number}e${infer E extends '-' | '+'}${number}`
		? E extends '-'
			? true
			: false
		: `${T}` extends `${number}.${number}`
			? true
			: false
	: false;

export {};
