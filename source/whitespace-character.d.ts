/**
Matches a single whitespace character.

Uses the [ECMAScript trimming semantics](https://tc39.es/ecma262/multipage/text-processing.html#sec-trimstring): `WhiteSpace` plus `LineTerminator`, including line breaks and `U+FEFF` (BOM). Unlike Unicode's `White_Space` property, this excludes `U+0085` (NEXT LINE) and includes `U+FEFF`. It also excludes `U+180E` (MONGOLIAN VOWEL SEPARATOR) and `U+200B` (ZERO WIDTH SPACE).

Useful for type-level string parsing and separator validation. Matches exactly one character, not an empty string or a sequence of whitespace characters.

@example
```
import type {WhitespaceCharacter} from 'type-fest';

type Separator = Extract<' ' | '\t' | ',', WhitespaceCharacter>;
//=> ' ' | '\t'

type Assignment = `${string}${WhitespaceCharacter}=${WhitespaceCharacter}${string}`;

const assignment: Assignment = 'size\t= large';
```

@category String
@category Template literal
*/
export type WhitespaceCharacter =
	| '\u{9}' // '\t'
	| '\u{A}' // '\n'
	| '\u{B}' // '\v'
	| '\u{C}' // '\f'
	| '\u{D}' // '\r'
	| '\u{20}' // ' '
	| '\u{A0}'
	| '\u{1680}'
	| '\u{2000}'
	| '\u{2001}'
	| '\u{2002}'
	| '\u{2003}'
	| '\u{2004}'
	| '\u{2005}'
	| '\u{2006}'
	| '\u{2007}'
	| '\u{2008}'
	| '\u{2009}'
	| '\u{200A}'
	| '\u{2028}'
	| '\u{2029}'
	| '\u{202F}'
	| '\u{205F}'
	| '\u{3000}'
	| '\u{FEFF}';

export {};
