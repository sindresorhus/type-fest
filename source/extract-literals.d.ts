import type {IsLiteral} from './is-literal.d.ts';
import type {LiteralUnion} from './literal-union.d.ts'; // For `@link`

/**
Extract the literal types from a union, removing wide types like `string` and infinite string types like `` `on${string}` ``.

Use-cases:
- Get the known values from a `LiteralUnion`.
- Get the finite part of a union that also accepts arbitrary values.

Tagged literal types are kept. Members that are not literals, including `null`, `undefined`, and objects, are removed.

Note: TypeScript merges literals into a wider type in the same union, so `'dog' | string` is already `string` and there is nothing to extract. Use `LiteralUnion` to keep the literals.

@example
```
import type {ExtractLiterals, LiteralUnion} from 'type-fest';

type Pet = LiteralUnion<'dog' | 'cat', string>;

type KnownPet = ExtractLiterals<Pet>;
//=> 'dog' | 'cat'

type EventName = ExtractLiterals<'click' | 'hover' | `on${string}`>;
//=> 'click' | 'hover'

type Size = ExtractLiterals<LiteralUnion<1 | 2 | 3, number>>;
//=> 1 | 2 | 3
```

@see {@link LiteralUnion}
@see {@link IsLiteral}
@category Type
*/
export type ExtractLiterals<Union> = Union extends unknown
	? IsLiteral<Union> extends true
		? Union
		: never
	: never;

export {};
