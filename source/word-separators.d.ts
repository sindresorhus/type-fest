import type {Whitespace} from './whitespace.d.ts';

/**
A union of characters commonly used to separate words in identifiers: hyphens, underscores, and all Unicode whitespace.

This mirrors the default word separators used by casing utilities like [`CamelCase`](https://github.com/sindresorhus/type-fest/blob/main/source/camel-case.d.ts).

@example
```
import type {WordSeparators} from 'type-fest';

type IsWordSeparator<T extends string> = T extends WordSeparators ? true : false;

type A = IsWordSeparator<'-'>;
//=> true

type B = IsWordSeparator<'_'>;
//=> true

type C = IsWordSeparator<'a'>;
//=> false
```

@category String
@category Template literal
*/
export type WordSeparators = '-' | '_' | Whitespace;

export {};
