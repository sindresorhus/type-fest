import type {IsBooleanLiteral, IsLiteral, IsNumericLiteral, IsStringLiteral, IsSymbolLiteral} from './is-literal';

/**
An if-else-like type that resolves depending on whether the given type is a `string` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

@see {@link IsStringLiteral}

@example
```
import type {IfStringLiteral} from 'type-fest';

type ShouldBeTrue = IfStringLiteral<'string'>;
//=> true

type ShouldBeBar = IfStringLiteral<false, 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
 */
export type IfStringLiteral<
	T,
	TypeIfStringLiteral = true,
	TypeIfNotStringLiteral = false,
> = IsStringLiteral<T> extends true ? TypeIfStringLiteral : TypeIfNotStringLiteral;

/**
An if-else-like type that resolves depending on whether the given type is a `number` or `bigint` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

@see {@link IsNumericLiteral}

@example
```
import type {IfNumericLiteral} from 'type-fest';

type ShouldBeTrue = IfNumericLiteral<1>;
//=> true

type ShouldBeBar = IfNumericLiteral<'not numeric', 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
 */
export type IfNumericLiteral<
	T,
	TypeIfNumericLiteral = true,
	TypeIfNotNumericLiteral = false,
> = IsNumericLiteral<T> extends true ? TypeIfNumericLiteral : TypeIfNotNumericLiteral;

/**
An if-else-like type that resolves depending on whether the given type is a `true` or `false` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

@see {@link IsBooleanLiteral}

@example
```
import type {IfBooleanLiteral} from 'type-fest';

type ShouldBeTrue = IfBooleanLiteral<true>;
//=> true

type ShouldBeBar = IfBooleanLiteral<'not boolean', 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
 */
export type IfBooleanLiteral<
	T,
	TypeIfBooleanLiteral = true,
	TypeIfNotBooleanLiteral = false,
> = IsBooleanLiteral<T> extends true ? TypeIfBooleanLiteral : TypeIfNotBooleanLiteral;

/**
An if-else-like type that resolves depending on whether the given type is a `symbol` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

@see {@link IsSymbolLiteral}

@example
```
import type {IfSymbolLiteral} from 'type-fest';

type ShouldBeTrue = IfSymbolLiteral<Symbol("key")>;
//=> true

type ShouldBeBar = IfSymbolLiteral<'not symbol', 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
 */
export type IfSymbolLiteral<
	T,
	TypeIfSymbolLiteral = true,
	TypeIfNotSymbolLiteral = false,
> = IsSymbolLiteral<T> extends true ? TypeIfSymbolLiteral : TypeIfNotSymbolLiteral;

/**
An if-else-like type that resolves depending on whether the given type is a [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

@see {@link IsLiteral}

@example
```
import type {IfLiteral} from 'type-fest';

type ShouldBeTrue = IfLiteral<"literal">;
//=> true

type ShouldBeBar = IfLiteral<{}, 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
 */
export type IfLiteral<
	T,
	TypeIfLiteral = true,
	TypeIfNotLiteral = false,
> = IsLiteral<T> extends true ? TypeIfLiteral : TypeIfNotLiteral;
