import {expectTypeOf} from 'nz';
import type {WhitespaceCharacter} from '../../index.d.ts';
import type {IsWhitespace} from '../../source/internal/index.d.ts';

expectTypeOf<IsWhitespace<''>>().toBe<false>();
expectTypeOf<IsWhitespace<' '>>().toBe<true>();
expectTypeOf<IsWhitespace<'\n'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{9}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'a'>>().toBe<false>();
expectTypeOf<IsWhitespace<'a '>>().toBe<false>();
expectTypeOf<IsWhitespace<'   '>>().toBe<true>();
expectTypeOf<IsWhitespace<' \t '>>().toBe<true>();

// Every supported whitespace character can be combined without changing the classification.
expectTypeOf<IsWhitespace<`${WhitespaceCharacter}${WhitespaceCharacter}`>>().toBe<true>();
expectTypeOf<IsWhitespace<'\t\u{A0}\u{3000}\r\n'>>().toBe<true>();
expectTypeOf<IsWhitespace<' \u{85} '>>().toBe<false>();
expectTypeOf<IsWhitespace<' \u{200B} '>>().toBe<false>();
expectTypeOf<IsWhitespace<' \t' | 'ready'>>().toBe<boolean>();
expectTypeOf<IsWhitespace<string>>().toBe<false>();
expectTypeOf<IsWhitespace<any>>().toBe<boolean>();
expectTypeOf<IsWhitespace<never>>().toBe<never>();
// @ts-expect-error Whitespace classification requires a string.
type UnknownWhitespace = IsWhitespace<unknown>;

function _readWhitespaceResult<Value extends string>(value: IsWhitespace<Value>): boolean {
	return value;
}

// The public union is accepted as individual characters as well as nonempty sequences.
expectTypeOf<IsWhitespace<WhitespaceCharacter>>().toBe<true>();
expectTypeOf<IsWhitespace<'\r\n'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{FEFF}\u{FEFF}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{2028}\u{2029}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{2007}\u{202F}\u{205F}'>>().toBe<true>();

// A non-whitespace character fails at the start, middle, or end of a sequence.
expectTypeOf<IsWhitespace<`x${WhitespaceCharacter}`>>().toBe<false>();
expectTypeOf<IsWhitespace<`${WhitespaceCharacter}x`>>().toBe<false>();
expectTypeOf<IsWhitespace<`${WhitespaceCharacter}x${WhitespaceCharacter}`>>().toBe<false>();
expectTypeOf<IsWhitespace<'\t\r\n0'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\t😀\n'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\t,\n'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\t\\n\n'>>().toBe<false>();

// Unicode whitespace conventions differ from ECMAScript trimming semantics.
type NonWhitespaceCharacter = '\u{85}' | '\u{180E}' | '\u{200B}' | '\u{200C}' | '\u{200D}' | '\u{2060}' | '\u{2800}' | '\u{3164}';
expectTypeOf<IsWhitespace<NonWhitespaceCharacter>>().toBe<false>();
expectTypeOf<IsWhitespace<`\t${NonWhitespaceCharacter}`>>().toBe<false>();
expectTypeOf<IsWhitespace<`${NonWhitespaceCharacter}\n`>>().toBe<false>();
expectTypeOf<IsWhitespace<`\t${NonWhitespaceCharacter}\n`>>().toBe<false>();
expectTypeOf<IsWhitespace<'\0' | '\b' | '\u{1C}' | '\u{1D}' | '\u{1E}' | '\u{1F}' | '\u{7F}'>>().toBe<false>();

// Distribution preserves both possible answers instead of classifying only one member.
expectTypeOf<IsWhitespace<'' | '\t'>>().toBe<boolean>();
expectTypeOf<IsWhitespace<'\t' | '\r\n' | '\u{FEFF}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'first' | 'second' | ''>>().toBe<false>();
expectTypeOf<IsWhitespace<'\u{A0}' | '\u{85}'>>().toBe<boolean>();
expectTypeOf<IsWhitespace<'\u{FEFF}' | '\u{200B}'>>().toBe<boolean>();

// Broad strings and non-literal placeholders cannot establish an all-whitespace string.
expectTypeOf<IsWhitespace<`${number}`>>().toBe<false>();
expectTypeOf<IsWhitespace<`${bigint}`>>().toBe<false>();
expectTypeOf<IsWhitespace<`${boolean}`>>().toBe<false>();
expectTypeOf<IsWhitespace<` ${string}`>>().toBe<false>();
expectTypeOf<IsWhitespace<`${string} `>>().toBe<false>();
expectTypeOf<IsWhitespace<Uppercase<string>>>().toBe<false>();
expectTypeOf<IsWhitespace<Lowercase<string>>>().toBe<false>();
