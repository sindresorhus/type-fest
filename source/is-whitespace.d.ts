import type {ConsistsOnlyOf} from './consists-only-of.d.ts';
import type {WhitespaceCharacter} from './whitespace-character.d.ts';

/**
Returns a boolean for whether a string is non-empty and consists only of whitespace characters.

Useful for validating indentation and whitespace-only tokens. Matches the characters in {@link WhitespaceCharacter}: the ECMAScript `WhiteSpace` and `LineTerminator` characters that `String.prototype.trim()` removes, which include line breaks and `U+FEFF` (BOM). It excludes `U+0085` (NEXT LINE), `U+180E` (MONGOLIAN VOWEL SEPARATOR), and `U+200B` (ZERO WIDTH SPACE). Strings branded with `Tagged`, `Opaque`, or `Flavor` match by their underlying value.

An empty string returns `false`, while {@link ConsistsOnlyOf} returns `true` for it. Each input union member is checked separately: `true` when every member matches, `false` when none does, and `boolean` when they disagree. A string type that is not a finite union of string literals, such as `string`, `Uppercase<string>`, or `` ` ${string}` ``, returns `boolean`. `any` returns `boolean`, and `never` returns `never`.

@example
```
import type {IsWhitespace} from 'type-fest';

type Indentation = IsWhitespace<' \t'>;
//=> true

type Content = IsWhitespace<' text '>;
//=> false

type Empty = IsWhitespace<''>;
//=> false

type Mixed = IsWhitespace<'' | '\t'>;
//=> boolean

type DynamicInput = IsWhitespace<string>;
//=> boolean
```

@category String
@category Template literal
@category Type Guard
*/
// The naked conditional distributes over union members, keeps `never`, and makes the empty string `false`.
// Delegate the per-character match so `WhitespaceCharacter` remains the only definition of the whitespace set.
export type IsWhitespace<Value extends string> = Value extends '' ? false : ConsistsOnlyOf<Value, WhitespaceCharacter>;

export {};
