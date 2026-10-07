import {expectType} from 'tsd';
import type {IsEqual} from '../../index.d.ts';
import type {AsciiPunctuation, IsWhitespace, Whitespace, WordSeparators} from '../../source/internal/index.d.ts';

// The exact set of code points `String.prototype.trim()` removes, checked against the runtime.
type TrimsByJs =
	'\u{9}'
	| '\u{A}'
	| '\u{B}'
	| '\u{C}'
	| '\u{D}'
	| '\u{20}'
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

// The ones it keeps.
type KeptByJs =
	'\u{85}'
	| '\u{180E}'
	| '\u{200B}'
	| '\u{2060}';

expectType<IsEqual<TrimsByJs, Whitespace>>(true);
// Nothing JavaScript keeps may appear in the union.
expectType<IsEqual<KeptByJs & Whitespace, never>>(true);

expectType<IsWhitespace<'\u{20}\u{9}\u{A}'>>(true);
expectType<IsWhitespace<'\u{3000}\u{FEFF}'>>(true);
// An empty string has no characters to classify, and the existing test pins this as `false`.
expectType<IsWhitespace<''>>(false);

// A string is only whitespace when nothing else is in it.
expectType<IsWhitespace<'\u{3000}a\u{3000}'>>(false);
expectType<IsWhitespace<'\u{3000}a'>>(false);
expectType<IsWhitespace<'a\u{3000}'>>(false);

expectType<IsWhitespace<'\u{85}'>>(false);
expectType<IsWhitespace<'\u{180E}'>>(false);
expectType<IsWhitespace<'\u{200B}'>>(false);
expectType<IsWhitespace<'\u{2060}'>>(false);

expectType<IsEqual<WordSeparators, '-' | '_' | '\u{85}' | Whitespace>>(true);

expectType<IsEqual<AsciiPunctuation, '!' | '"' | '#' | '$' | '%' | '&' | '\'' | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | ':' | ';' | '<' | '=' | '>' | '?' | '@' | '[' | '\\' | ']' | '^' | '_' | '`' | '{' | '|' | '}' | '~'>>(true);
