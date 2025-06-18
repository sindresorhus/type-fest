import type {Primitive} from './primitive.d.ts';
import type {Simplify} from './simplify.d.ts';

/** Shorthand for: `LiteralUnion<T, string>` */
export type LiteralStringUnion<T> = LiteralUnion<T, string>;

/**
Allows creating a union type by combining primitive types and literal types without sacrificing auto-completion in IDEs for the literal type part of the union.

Currently, when a union type of a primitive type is combined with literal types, TypeScript loses all information about the combined literals. Thus, when such type is used in an IDE with autocompletion, no suggestions are made for the declared literals.

This type is a workaround for [Microsoft/TypeScript#29729](https://github.com/Microsoft/TypeScript/issues/29729). It will be removed as soon as it's not needed anymore.

@example
```
import type {LiteralUnion} from 'type-fest';

// Before

type Pet1 = 'dog' | 'cat' | string;
//=> type Pet1 = string

const pet1: Pet1 = '';
```
Start typing in your TypeScript-enabled IDE.

You **will *not*** get auto-completion for `dog` and `cat` literals.

```
// After

type Pet2 = LiteralUnion<'dog' | 'cat', string>;
//=> type Pet2 = 'dog' | 'cat' | (string & {})

const pet2: Pet2 = '';
```
You **will** get auto-completion for `dog` and `cat` literals.

@category Type
*/
export type LiteralUnion<LiteralType, PrimitiveType extends Primitive> = LiteralType | (PrimitiveType & Simplify<{}>);
