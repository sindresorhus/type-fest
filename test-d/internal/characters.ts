import {expectTypeOf} from 'nz';
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

expectTypeOf<IsEqual<TrimsByJs, Whitespace>>().toBe<true>();
// Nothing JavaScript keeps may appear in the union.
expectTypeOf<IsEqual<KeptByJs & Whitespace, never>>().toBe<true>();

expectTypeOf<IsWhitespace<'\u{20}\u{9}\u{A}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{3000}\u{FEFF}'>>().toBe<true>();
// An empty string has no characters to classify, and the existing test pins this as `false`.
expectTypeOf<IsWhitespace<''>>().toBe<false>();

// A string is only whitespace when nothing else is in it.
expectTypeOf<IsWhitespace<'\u{3000}a\u{3000}'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\u{3000}a'>>().toBe<false>();
expectTypeOf<IsWhitespace<'a\u{3000}'>>().toBe<false>();

expectTypeOf<IsWhitespace<'\u{85}'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\u{180E}'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\u{200B}'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\u{2060}'>>().toBe<false>();

expectTypeOf<IsEqual<WordSeparators, '-' | '_' | '\u{85}' | Whitespace>>().toBe<true>();

expectTypeOf<IsEqual<AsciiPunctuation, '!' | '"' | '#' | '$' | '%' | '&' | '\'' | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | ':' | ';' | '<' | '=' | '>' | '?' | '@' | '[' | '\\' | ']' | '^' | '_' | '`' | '{' | '|' | '}' | '~'>>().toBe<true>();
