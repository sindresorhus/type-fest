import type {UnwrapTagged, TagContainer} from './tagged.js';
import type {Primitive} from './primitive.d.ts';
import type {IsLiteral} from './is-literal.js';
import type {Not} from './internal/type.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {ValueOf} from './value-of.d.ts';

/**
Create a union by removing all Non-Literal primitive types from a union, while retaining literal types.

This utility helps you extract only the literal members from a "literal union" type
(e.g., `'foo' | 'bar' | string` becomes `'foo' | 'bar'`), saving you from defining separate types for literals and unions.

It works with all primitive and tagged types, and supports two strictness modes:

- **Strict mode (`Strict = true`)**: Removes any infinite signature type (e.g., `abc${string}`, `123${number}`), keeping only genuine literals.
- **Non-strict mode (`Strict = false`)**: Removes only wide primitive types (e.g., `string`, `number`).

@default false

@example
```ts
import type { LoosenUnion } from 'type-fest';

// String example:
type Pet = LiteralUnion<'dog' | 'cat' | `${string}Dog`, string>;
//    ^? type Pet = 'dog' | 'cat' | `${string}Dog` | (string & {})
type PetLiteralNonStrict = LoosenUnion<Pet>;
//    ^? type PetLiteralNonStrict = 'dog' | 'cat' | `${string}Dog`
type PetLiteralStrict = LoosenUnion<Pet, true>;
//    ^? type PetLiteralStrict = 'dog' | 'cat'

// Number example:
type Nums = LiteralUnion<0 | 1 | 2, number>;
//    ^? type Nums = 0 | 1 | 2 | (number & {})
type NumsLiteral = LoosenUnion<Nums>;
//    ^? type NumsLiteral = 0 | 1 | 2

// Symbol example:
declare const sym1: unique symbol;
declare const sym2: unique symbol;
type Symbols = LiteralUnion<typeof sym1 | typeof sym2, symbol>;
//    ^? type Symbols = typeof sym1 | typeof sym2 | (symbol & {})
type SymbolsLiteral = LoosenUnion<Symbols>;
//    ^? type SymbolsLiteral = typeof sym1 | typeof sym2

// BigInt example:
type Big = LiteralUnion<1n | 2n, bigint>;
//    ^? type Big = 1n | 2n | (bigint & {})
type BigLiteral = LoosenUnion<Big>;
//    ^? type BigLiteral = 1n | 2n

```

@author benzaria
@see LiteralUnion
@category Type
*/
export type LoosenUnion<
	LiteralUnion extends Primitive,
	Strict extends boolean = false,
> = ValueOf<{
	[P in Primitive as string]: LiteralUnion extends P
		? _LoosenUnion<LiteralUnion, P, Strict>
		: never
}>;

type _LoosenUnion<U, P, S> = ValueOf<{
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

- LoosenUnion iterates over all primitive types (string, number, symbol, bigint, boolean).
- For each, if the input type extends that primitive, applies _LoosenUnion.
- _LoosenUnion iterates over the union members:
	- In non-strict mode, removes (type & {}) (the canonical "widened" type).
	- In strict mode, removes any non-literal (infinite template literal types).
	- Otherwise, keeps the literal member.

*/
