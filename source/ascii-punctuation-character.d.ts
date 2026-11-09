/**
Matches a single ASCII punctuation character.

Includes the 32 printable ASCII characters other than letters, digits, and space, including symbols such as `$`, `+`, and `~`, as in [Python's `string.punctuation`](https://docs.python.org/3/library/string.html#string.punctuation). Excludes whitespace and non-ASCII punctuation.

Useful for type-level string parsing and delimiter validation.

@example
```
import type {AsciiPunctuationCharacter} from 'type-fest';

type Separator = Extract<',' | ';' | ' ' | 'a', AsciiPunctuationCharacter>;
//=> ',' | ';'

const delimiter: AsciiPunctuationCharacter = ':';
// @ts-expect-error
const invalidDelimiter: AsciiPunctuationCharacter = '::';
```

@category String
@category Template literal
*/
export type AsciiPunctuationCharacter =
	| '!'
	| '"'
	| '#'
	| '$'
	| '%'
	| '&'
	| '\''
	| '('
	| ')'
	| '*'
	| '+'
	| ','
	| '-'
	| '.'
	| '/'
	| ':'
	| ';'
	| '<'
	| '='
	| '>'
	| '?'
	| '@'
	| '['
	| '\\'
	| ']'
	| '^'
	| '_'
	| '`'
	| '{'
	| '|'
	| '}'
	| '~';

export {};
