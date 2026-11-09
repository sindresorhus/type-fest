import {expectTypeOf} from 'nz';
import type {IsEqual, IsWhitespace, WhitespaceCharacter} from '../../index.d.ts';
import type {WordSeparators} from '../../source/internal/index.d.ts';

// The exact set of code points `String.prototype.trim()` removes, kept as an independent copy so `WhitespaceCharacter` cannot drift.
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

// The ones `String.prototype.trim()` keeps.
type KeptByJs =
	'\u{85}'
	| '\u{180E}'
	| '\u{200B}'
	| '\u{2060}';

expectTypeOf<IsEqual<TrimsByJs, WhitespaceCharacter>>().toBe<true>();
// Nothing JavaScript keeps may appear in the union.
expectTypeOf<IsEqual<KeptByJs & WhitespaceCharacter, never>>().toBe<true>();

expectTypeOf<IsWhitespace<'\u{20}\u{9}\u{A}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{3000}\u{FEFF}'>>().toBe<true>();
// `IsWhitespace` rejects the empty string by design; `ConsistsOnlyOf` alone would return `true`.
expectTypeOf<IsWhitespace<''>>().toBe<false>();

// A string is only whitespace when nothing else is in it.
expectTypeOf<IsWhitespace<'\u{3000}a\u{3000}'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\u{3000}a'>>().toBe<false>();
expectTypeOf<IsWhitespace<'a\u{3000}'>>().toBe<false>();

expectTypeOf<IsWhitespace<'\u{85}'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\u{180E}'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\u{200B}'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\u{2060}'>>().toBe<false>();

expectTypeOf<IsEqual<WordSeparators, '-' | '_' | '\u{85}' | WhitespaceCharacter>>().toBe<true>();
