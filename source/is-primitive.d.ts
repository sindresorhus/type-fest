import type {IsNotFalse, Extends} from './internal/type.js';
import type {Primitive} from './primitive.js';
import type {Numeric} from './numeric.js';
import type {IsAny} from './is-any.js';
import type {And} from './and.js';

/**
Returns a boolean for whether the given type `T` is the specified `PrimitiveType`.

@example
```
type ex = PrimitiveCheck<number, number>
//   ^? type ex = true

type ex = PrimitiveCheck<1, number>
//   ^? type ex = false

type ex = PrimitiveCheck<(string & {}), string> // Because (string & {}) does not change the type string it just hide's it. See PrimitiveUnion
//   ^? type ex = true
```
*/
type PrimitiveCheck<T, PrimitiveType extends Primitive> = (
	IsAny<T> extends false // Cannot be wider than `any`
		? And<
		Extends<T, PrimitiveType>, // Must be narrower than `PrimitiveType`
		Extends<PrimitiveType, T> // Must be wider than `PrimitiveType`
		>
		: false
);

/**
Returns a boolean for whether the given type `T` is one of the specified primitive types in `PrimitiveUnionType`.

@example
```
type ex = PrimitiveChecks<number, Numeric>
//   ^? type ex = true

type ex = PrimitiveChecks<bigint, Numeric>
//   ^? type ex = true

type ex = PrimitiveChecks<string, Numeric>
//   ^? type ex = false
```
*/
type PrimitiveChecks<T, PrimitiveUnionType extends Primitive> = (
	// Conditional type to force union distribution.
	// If `T` is none of the primitive types in the union `PrimitiveUnionType`, then `PrimitiveCheck<T, PrimitiveType>` will evaluate to `false` for the whole union.
	// If `T` is one of the primitive types in the union, it will evaluate to `boolean` (i.e. `true | false`)
	IsNotFalse<
	PrimitiveUnionType extends Primitive
		? PrimitiveCheck<T, PrimitiveUnionType>
		: never
	>
);

/**
Returns a boolean for whether the given type is strictly a `string` [primitive type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean).

@example
```
import type {IsStringPrimitive} from 'type-fest';

type ex = IsStringPrimitive<string>
//   ^? type ex = true

type ex = IsStringPrimitive<(string & {})>
//   ^? type ex = true

type ex = IsStringPrimitive<`on${string}`>
//   ^? type ex = false

type ex = IsStringPrimitive<Capitalize<string>>
//   ^? type ex = false

```

@see IsStringLiteral
@category Type Guard
@category Utilities
*/
export type IsStringPrimitive<T> = PrimitiveCheck<T, string>;

/**
Returns a boolean for whether the given type is strictly a `number` or `bigint` [primitive type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean).

@example
```
type ex = IsNumericPrimitive<Numeric>
//   ^? type ex = true

type ex = IsNumericPrimitive<number>
//   ^? type ex = true

type ex = IsNumericPrimitive<bigint>
//   ^? type ex = true

type ex = IsNumericPrimitive<1>
//   ^? type ex = false

```

@see IsNumericLiteral
@category Type Guard
@category Utilities
*/
export type IsNumericPrimitive<T> = (
	T extends Numeric
		? PrimitiveChecks<T, Numeric>
		: false
);

/**
Returns a boolean for whether the given type is strictly a `boolean` [primitive type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean).

@example
```
import type {IsBooleanPrimitive} from 'type-fest';

type ex = IsBooleanPrimitive<boolean>
//   ^? type ex = true

type ex = IsBooleanPrimitive<true | false>
//   ^? type ex = true

type ex = IsBooleanPrimitive<true>
//   ^? type ex = false

type ex = IsBooleanPrimitive<false>
//   ^? type ex = false

```

@see IsBooleanLiteral
@category Type Guard
@category Utilities
*/
export type IsBooleanPrimitive<T> = PrimitiveCheck<T, boolean>;

/**
Returns a boolean for whether the given type is strictly a `symbol` [primitive type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean).

@example
```
type ex = IsSymbolPrimitive<symbol>
//   ^? type ex = true

type ex = IsSymbolPrimitive<typeof Symbol('foo')>
//   ^? type ex = false

```

@see IsSymbolLiteral
@category Type Guard
@category Utilities
*/
export type IsSymbolPrimitive<T> = PrimitiveCheck<T, symbol>;

/** Helper type for `IsPrimitive`. */
type IsPrimitiveUnion<T> =
	| IsStringPrimitive<T>
	| IsNumericPrimitive<T>
	| IsBooleanPrimitive<T>
	| IsSymbolPrimitive<T>;

/**
Returns a boolean for whether the given type is strictly a [primitive type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean).

@example
```
type ex = IsPrimitive<number>
//   ^? type ex = true

type ex = IsPrimitive<string>
//   ^? type ex = true

type ex = IsPrimitive<'string'>
//   ^? type ex = false

type ex = IsPrimitive<object>
//   ^? type ex = false

```

@author benzaria
@see IsLiteral
@category Type Guard
@category Utilities
*/
export type IsPrimitive<T> = (
	Extends<T, Primitive> extends true
		? IsNotFalse<IsPrimitiveUnion<T>>
		: false
);
