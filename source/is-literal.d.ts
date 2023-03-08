import type {Primitive} from './primitive';
import type {Numeric} from './numeric';
import type {IsNever, IsNotFalse} from './internal';

/** @link https://stackoverflow.com/a/52806744/10292952 */
type LiteralCheck<T, LiteralType extends Primitive> = (
	IsNever<T> extends false // Must be wider than `never`
		? [T] extends [LiteralType] // Must be narrower than `LiteralType`
			? [LiteralType] extends [T] // Cannot be wider than `LiteralType`
				? false
				: true
			: false
		: false
);

type LiteralChecks<T, LiteralUnionType> = (
	// Conditional type to force union distribution
	IsNotFalse<LiteralUnionType extends Primitive
		? LiteralCheck<T, LiteralUnionType>
		: never
	>
);

/**
Returns a boolean for whether the given type is a `string` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for constraining strings to be a string literal, or for providing strongly-typed string manipulation functions, as well as constructing parsers and ASTs.

@example
```
import type {IsStringLiteral} from 'type-fest';

type CapitalizedString<T extends string> = IsStringLiteral<T> extends true ? Capitalize<T> : string;

// https://github.com/yankeeinlondon/native-dash/blob/master/src/capitalize.ts
function capitalize<T extends Readonly<string>>(input: T): CapitalizedString<T> {
	return (input.slice(0, 1).toUpperCase() + input.slice(1)) as CapitalizedString<T>;
}

const output = capitalize('hello, world!');
//=> 'Hello, world!'
```

@category Utilities
*/
export type IsStringLiteral<T> = LiteralCheck<T, string>;

/**
Returns a boolean for whether the given type is a `number` or `bigint` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for constructing parsers and ASTs.

@example
```
import type {IsNumericLiteral} from 'type-fest';

```

@category Utilities
*/
export type IsNumericLiteral<T> = LiteralChecks<T, Numeric>;

/**
Returns a boolean for whether the given type is a `true` or `false` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for constructing parsers and ASTs.

@example
```
import type {IsBooleanLiteral} from 'type-fest';

```

@category Utilities
*/
export type IsBooleanLiteral<T> = LiteralCheck<T, boolean>;

/**
Returns a boolean for whether the given type is a `symbol` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for constructing parsers and ASTs.

@example
```
import type {IsSymbolLiteral} from 'type-fest';

```

@category Utilities
*/
export type IsSymbolLiteral<T> = LiteralCheck<T, symbol>;

/** Helper type for `IsLiteral`. */
type IsLiteralUnion<T> =
	| IsStringLiteral<T>
	| IsNumericLiteral<T>
	| IsBooleanLiteral<T>
	| IsSymbolLiteral<T>;

/**
Returns a boolean for whether the given type is a [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

@example
```
import type {IsLiteral} from 'type-fest';

// https://github.com/inocan-group/inferred-types/blob/master/src/types/string-literals/StripLeading.ts
export type StripLeading<A, B> =
	A extends string
		? B extends string
			? IsLiteral<A> extends true
				? string extends B ? never : A extends `${B & string}${infer After}` ? After : A
				: string
			: A
		: A;

function stripLeading<Input extends string, Strip extends string>(input: Input, strip: Strip) {
	return input.replace(`^${strip}`, '') as StripLeading<Input, Strip>;
}

stripLeading('abc123', 'abc');
//=> '123'

const str = 'abc123' as string;

stripLeading(str, 'abc');
//=> string
```

@category Utilities
*/
export type IsLiteral<T extends Primitive> = IsNotFalse<IsLiteralUnion<T>>;
