import type {Primitive} from './primitive.d.ts';

export type _LiteralStringUnion<T> = LiteralUnion<T, string>;

/**
Allows creating a union type by combining primitive types and literal types without sacrificing auto-completion in IDEs for the literal type part of the union.

Currently, when a union type of a primitive type is combined with literal types, TypeScript loses all information about the combined literals. Thus, when such type is used in an IDE with autocompletion, no suggestions are made for the declared literals.

This type is a workaround for [Microsoft/TypeScript#29729](https://github.com/Microsoft/TypeScript/issues/29729). It will be removed as soon as it's not needed anymore.

@example
```
import type {LiteralUnion} from 'type-fest';

// Before

type Pet = 'dog' | 'cat' | string;

const petWithoutAutocomplete: Pet = '';
// Start typing in your TypeScript-enabled IDE.
// You **will not** get auto-completion for `dog` and `cat` literals.

// After

type Pet2 = LiteralUnion<'dog' | 'cat', string>;

const petWithAutoComplete: Pet2 = '';
// You **will** get auto-completion for `dog` and `cat` literals.
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gGWDFUCGANgKoB2wEpAvnAGZQQhwDkSqAtLSgM4zMDcAKEEB6EXABCKWtBTC2aAAop4AXhYATCAHNmcAD4sAxvj4G4vKMFLahgo5V5xUMAOo4AFhACuMAIK+EA7ghCooAFxwymosAqLiAMow+LAIyNbacNZwiD5QcAAqyCgJRlZgMOwopPgARqEacACSACIAogB08XAAmj5wAFQDAO7AhIRwpBAwQ3DaKnD4gezBYKEwFKR00HAABlrau4ukjbsmMEeEOHhE3F3dfrS4UPLFUSoATHDq2M9EZJsADzMA56QzMc7MAA0FhgVhsAD47A5SE4XO4YB4AjAIABhRhrMKRaJfdTMOJiXr9IajcazebwJY4lYE9abbb5fY6I74E57c6Xa4EQh3IA)

@category Type
*/
export type LiteralUnion<
	LiteralType,
	BaseType extends Primitive,
> = LiteralType | (BaseType & Record<never, never>);

export {};
