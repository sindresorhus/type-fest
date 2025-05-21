import type {UnwrapTagged, TagContainer} from './tagged.js';
import type {IsLiteral} from './is-literal.js';
import type {Primitive} from './primitive.js';
import type {Not} from './internal/type.js';
import type {IsEqual} from './is-equal.js';
import type {ValueOf} from './value-of.js';

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
import type { LiteralOf } from 'type-fest';

// String example:
type Pet = LiteralUnion<'dog' | 'cat' | `${string}Dog`, string>;
//    ^? type Pet = 'dog' | 'cat' | `${string}Dog` | (string & {})
type PetLiteralStrict = LiteralOf<Pet>;
//    ^? type PetLiteralNonStrict = 'dog' | 'cat'
type PetLiteralNonStrict = LiteralOf<Pet, false>;
//    ^? type PetLiteralStrict = 'dog' | 'cat' | `${string}Dog`

// Number example:
type Nums = LiteralUnion<0 | 1 | 2, number>;
//    ^? type Nums = 0 | 1 | 2 | (number & {})
type NumsLiteral = LiteralOf<Nums>;
//    ^? type NumsLiteral = 0 | 1 | 2

// Symbol example:
declare const sym1: unique symbol;
declare const sym2: unique symbol;
type Symbols = LiteralUnion<typeof sym1 | typeof sym2, symbol>;
//    ^? type Symbols = typeof sym1 | typeof sym2 | (symbol & {})
type SymbolsLiteral = LiteralOf<Symbols>;
//    ^? type SymbolsLiteral = typeof sym1 | typeof sym2

// BigInt example:
type Big = LiteralUnion<1n | 2n, bigint>;
//    ^? type Big = 1n | 2n | (bigint & {})
type BigLiteral = LiteralOf<Big>;
//    ^? type BigLiteral = 1n | 2n

```

@author benzaria
@see LiteralUnion
@category Type
*/
export type LiteralOf<
	LiteralUnion extends Primitive,
	Strict extends boolean = true,
> = ValueOf<{
	[P in Primitive as string]: LiteralUnion extends P
		? _LiteralOf<LiteralUnion, P, Strict>
		: never
}>;

type _LiteralOf<U, P, S> = ValueOf<{
	[K in U as string]: (
		S extends true
			? Not<IsLiteral<
			K extends TagContainer<{[J in PropertyKey]: any}>
				? UnwrapTagged<K>
				: K
			>>
			: IsEqual<K, (P & Record<never, never>)>
	) extends true
		? never
		: K
}>;

/**

? Explanation:

- LiteralOf iterates over all primitive types (string, number, symbol, bigint, boolean).
- For each, if the input type extends that primitive, applies _LiteralOf.
- _LiteralOf iterates over the union members:
    - In non-strict mode, removes (type & {}) (the canonical "widened" type).
    - In strict mode, removes any non-literal (infinite template literal types).
    - Otherwise, keeps the literal member.

*/
