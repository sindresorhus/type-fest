import type {IsNotFalse, IsPrimitive} from './internal/index.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';
import type {IsNumericLiteral} from './is-numeric-literal.d.ts';
import type {IsBooleanLiteral} from './is-boolean-literal.d.ts';
import type {IsSymbolLiteral} from './is-symbol-literal.d.ts';

/**
Returns a boolean for whether the given type is a [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsLiteral} from 'type-fest';

type A = IsLiteral<1>;
//=> true

type B = IsLiteral<number>;
//=> false

type C = IsLiteral<1n>;
//=> true

type D = IsLiteral<bigint>;
//=> false

type E = IsLiteral<'type-fest'>;
//=> true

type F = IsLiteral<string>;
//=> false

type G = IsLiteral<`on${string}`>;
//=> false

declare const symbolLiteral: unique symbol;
type H = IsLiteral<typeof symbolLiteral>;
//=> true

type I = IsLiteral<symbol>;
//=> false

type J = IsLiteral<true>;
//=> true

type K = IsLiteral<boolean>;
//=> false
```

@category Type Guard
@category Utilities
*/
export type IsLiteral<T> =
	[T] extends [boolean]
		? IsBooleanLiteral<T>
		: T extends number | bigint
			? IsNumericLiteral<T>
			: T extends string
				? IsStringLiteral<T>
				: T extends symbol
					? IsSymbolLiteral<T>
					: true;

export {};
