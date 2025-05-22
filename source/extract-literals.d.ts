import type {ApplyDefaultOptions} from './internal/object.js';
import type {UnwrapTagged, TagContainer} from './tagged.js';
import type {IsPrimitive} from './is-primitive.js';
import type {IsLiteral} from './is-literal.js';
import type {Primitive} from './primitive.js';
import type {Not} from './internal/type.js';

/**
ExtactLiterals options.

@see {@link ExtactLiterals}
*/
export type ExtractLiteralsOptions = {
	/**
	Whether to remove infinite signature types (e.g., `abc${string}`).

	@default true
	*/
	strict?: boolean;
};

export type DefaultExtractLiteralsOptions = {
	strict: true;
};

/**
Creates a union of the literal members from a given union type, removing wide primitive or infinite types.

This utility helps you extract only the literal members from a "literal union" type
(e.g., `'foo' | 'bar' | string` becomes `'foo' | 'bar'`), saving you from defining separate types for literals and unions.

It works with all primitive and tagged types, and supports two strictness modes:

- **Strict mode (`Strict = true`)**: Removes any infinite signature type (e.g., `abc${string}`, `123${number}`).
- **Non-strict mode (`Strict = false`)**: Removes only wide primitive types (e.g., `string`, `number`).

@default true

@example
```ts
import type { ExtractLiterals } from 'type-fest';

// String example:
type Pet = LiteralUnion<'dog' | 'cat' | `${string}Dog`, string>;
//    ^? type Pet = 'dog' | 'cat' | `${string}Dog` | (string & {})
type PetLiteralStrict = ExtractLiterals<Pet>;
//    ^? type PetLiteralNonStrict = 'dog' | 'cat'
type PetLiteralNonStrict = ExtractLiterals<Pet, false>;
//    ^? type PetLiteralStrict = 'dog' | 'cat' | `${string}Dog`

// Number example:
type Nums = LiteralUnion<0 | 1 | 2, number>;
//    ^? type Nums = 0 | 1 | 2 | (number & {})
type NumsLiteral = ExtractLiterals<Nums>;
//    ^? type NumsLiteral = 0 | 1 | 2

// Symbol example:
declare const sym1: unique symbol;
declare const sym2: unique symbol;
type Symbols = LiteralUnion<typeof sym1 | typeof sym2, symbol>;
//    ^? type Symbols = typeof sym1 | typeof sym2 | (symbol & {})
type SymbolsLiteral = ExtractLiterals<Symbols>;
//    ^? type SymbolsLiteral = typeof sym1 | typeof sym2

// BigInt example:
type Big = LiteralUnion<1n | 2n, bigint>;
//    ^? type Big = 1n | 2n | (bigint & {})
type BigLiteral = ExtractLiterals<Big>;
//    ^? type BigLiteral = 1n | 2n

```

@author benzaria
@see LiteralUnion
@category Type
*/
export type ExtractLiterals<
	LiteralUnion extends Primitive,
	Options extends ExtractLiteralsOptions = {},
> = LiteralUnion extends infer Member
	? ((
		Member extends TagContainer<any>
			? UnwrapTagged<Member>
			: Member
	) extends infer Type
		? ApplyDefaultOptions<
		ExtractLiteralsOptions,
		DefaultExtractLiteralsOptions,
		Options
		>['strict'] extends true
			? Not<IsLiteral<Type>>
			: IsPrimitive<Type>
		: never
	) extends true
		? never
		: Member
	: never;
