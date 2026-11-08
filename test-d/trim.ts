import {expectTypeOf} from 'nz';
import type {Opaque, StringRepeat, Tagged, Trim, WhitespaceCharacter} from '../index.d.ts';

declare function trim<S extends string>(value: S): Trim<S>;

expectTypeOf(trim(' foo')).toBe<'foo'>();
expectTypeOf(trim('bar ')).toBe<'bar'>();
expectTypeOf(trim(' baz ')).toBe<'baz'>();
expectTypeOf(trim('  waldo  ')).toBe<'waldo'>();
expectTypeOf(trim(' fr ed ')).toBe<'fr ed'>();
expectTypeOf(trim(' foo\n')).toBe<'foo'>();
expectTypeOf(trim(' foo\n\t ')).toBe<'foo'>();

// `U+0085` (NEL) is a control character that `String.prototype.trim()` keeps, so it must not be trimmed here either. `WhitespaceCharacter` is the exact set that ECMAScript trims.
expectTypeOf<Trim<'\u{85}foo\u{85}'>>().toBe<'\u{85}foo\u{85}'>();
expectTypeOf<Trim<'\u{85}foo\u{85}bar'>>().toBe<'\u{85}foo\u{85}bar'>();

// Trimming works on the primitive string beneath an input brand.
expectTypeOf<Trim<Tagged<' foo ', 'Text'>>>().toBe<'foo'>();
expectTypeOf<Trim<Tagged<'\n\t', 'Text'>>>().toBe<''>();

expectTypeOf<Trim<Opaque<' foo ', 'Text'>>>().toBe<'foo'>();
expectTypeOf<Trim<Tagged<Tagged<' foo ', 'First'>, 'Second'>>>().toBe<'foo'>();
expectTypeOf<Trim<' foo ' & {readonly __brand: unique symbol}>>().toBe<'foo'>();
expectTypeOf<Trim<Tagged<' foo' | 'bar ', 'Text'>>>().toBe<'foo' | 'bar'>();
expectTypeOf<Trim<Tagged<'foo', 'Text'>>>().toBe<'foo'>();
expectTypeOf<Trim<Tagged<'', 'Text'>>>().toBe<''>();
expectTypeOf<Trim<Tagged<' fo o ', 'Text'>>>().toBe<'fo o'>();
expectTypeOf<Trim<Tagged<'\u{85}foo ', 'Text'>>>().toBe<'\u{85}foo'>();
expectTypeOf<Trim<Tagged<` ${number} `, 'Text'>>>().toBe<`${number}`>();
expectTypeOf<Trim<Tagged<` ${string} `, 'Text'>>>().toBe<string>();
expectTypeOf<Trim<Tagged<string, 'Text'>>>().toBe<string>();
expectTypeOf<Trim<any>>().toBe<any>();
expectTypeOf<Trim<never>>().toBe<never>();
// @ts-expect-error
expectTypeOf<Trim<unknown>>();

// A constrained generic literal retains its known result without widening to string.
function _trimKnownLiteral<Text extends 'abc'>(value: Trim<Text>): 'abc' {
	return value;
}

// Both independent trimming directions retain their supported recursion budget.
expectTypeOf<Trim<`${StringRepeat<' ', 999>}x`>>().toBe<'x'>();
expectTypeOf<Trim<`x${StringRepeat<' ', 999>}`>>().toBe<'x'>();

// Every supported whitespace character is removed at either boundary, but preserved inside a string.
expectTypeOf<Trim<`${WhitespaceCharacter}value${WhitespaceCharacter}`>>().toBe<'value'>();
expectTypeOf<Trim<`${WhitespaceCharacter}${WhitespaceCharacter}`>>().toBe<''>();
expectTypeOf<Trim<`first${WhitespaceCharacter}last`>>().toBe<`first${WhitespaceCharacter}last`>();
expectTypeOf<Trim<'\t\u{A0}\u{FEFF} value \u{3000}\r\n'>>().toBe<'value'>();
expectTypeOf<Trim<' \u{200B} value \u{200B} '>>().toBe<'\u{200B} value \u{200B}'>();
expectTypeOf<Trim<'  😀  '>>().toBe<'😀'>();
expectTypeOf<Trim<'   ' | '\tready\n' | 'done'>>().toBe<'' | 'ready' | 'done'>();

// Known boundary whitespace is removed without narrowing an unknown interpolation.
expectTypeOf<Trim<` \t${number} \n`>>().toBe<`${number}`>();
expectTypeOf<Trim<` \t${bigint} \n`>>().toBe<`${bigint}`>();
expectTypeOf<Trim<` \t${string} \n`>>().toBe<string>();
expectTypeOf<Trim<` \titem-${string} \n`>>().toBe<`item-${string}`>();
expectTypeOf<Trim<` \t${string}-item \n`>>().toBe<`${string}-item`>();
expectTypeOf<Trim<` \t${number} items \n`>>().toBe<`${number} items`>();
expectTypeOf<Trim<Uppercase<string>>>().toBe<Uppercase<string>>();

function _trimGenericLiteral<Text extends ' first ' | '\tsecond\n'>(value: Text): 'first' | 'second' {
	return trim(value);
}

// Removing surrounding indentation does not remove whitespace between lines or words.
expectTypeOf<Trim<'\n\tfirst line\n\tsecond line\n'>>().toBe<'first line\n\tsecond line'>();
expectTypeOf<Trim<` ${'enabled' | 'disabled'}: ${boolean} `>>().toBe<'enabled: true' | 'enabled: false' | 'disabled: true' | 'disabled: false'>();
expectTypeOf<Trim<' \u{85}\t value \t\u{85} '>>().toBe<'\u{85}\t value \t\u{85}'>();

// Left and right trimming work independently for the entire public character set.
expectTypeOf<Trim<`${WhitespaceCharacter}value`>>().toBe<'value'>();
expectTypeOf<Trim<`value${WhitespaceCharacter}`>>().toBe<'value'>();
expectTypeOf<Trim<WhitespaceCharacter>>().toBe<''>();
expectTypeOf<Trim<''>>().toBe<''>();
expectTypeOf<Trim<string>>().toBe<string>();

// Similar-looking separators and control characters stop trimming rather than disappear.
type NonTrimmingCharacter = '\u{85}' | '\u{180E}' | '\u{200B}' | '\u{200C}' | '\u{200D}' | '\u{2060}' | '\u{2800}' | '\u{3164}' | '\0' | '\b' | '\u{1C}' | '\u{1F}' | '\u{7F}';
expectTypeOf<Trim<NonTrimmingCharacter>>().toBe<NonTrimmingCharacter>();
expectTypeOf<Trim<` ${NonTrimmingCharacter} `>>().toBe<NonTrimmingCharacter>();
expectTypeOf<Trim<`${NonTrimmingCharacter} value `>>().toBe<`${NonTrimmingCharacter} value`>();
expectTypeOf<Trim<` value ${NonTrimmingCharacter}`>>().toBe<`value ${NonTrimmingCharacter}`>();
expectTypeOf<Trim<'\0 \tvalue\n \0'>>().toBe<'\0 \tvalue\n \0'>();
expectTypeOf<Trim<'\u{180E}\tvalue\t\u{180E}'>>().toBe<'\u{180E}\tvalue\t\u{180E}'>();
expectTypeOf<Trim<' \u{FEFF}\u{200B}\u{FEFF} '>>().toBe<'\u{200B}'>();

// Interior whitespace stays intact even when it also appears at both boundaries.
expectTypeOf<Trim<'\r\nfirst\r\nsecond\r\n'>>().toBe<'first\r\nsecond'>();
expectTypeOf<Trim<'\u{FEFF}first\u{FEFF}second\u{FEFF}'>>().toBe<'first\u{FEFF}second'>();
expectTypeOf<Trim<'\u{A0}first\u{A0}\u{A0}second\u{A0}'>>().toBe<'first\u{A0}\u{A0}second'>();
expectTypeOf<Trim<'\u{2028}first\u{2029}second\u{2028}'>>().toBe<'first\u{2029}second'>();
expectTypeOf<Trim<' \t😀\t😀\n '>>().toBe<'😀\t😀'>();

// Union members are trimmed independently, including those that become empty or equal.
expectTypeOf<Trim<'' | ' \t' | '\u{FEFF}'>>().toBe<''>();
expectTypeOf<Trim<' value' | 'value ' | '\tvalue\n'>>().toBe<'value'>();
expectTypeOf<Trim<' \u{85} ' | '\tready\n' | ''>>().toBe<'\u{85}' | 'ready' | ''>();
expectTypeOf<Trim<Tagged<'\u{A0}first\u{3000}' | '\u{FEFF}second\n', 'Text'>>>().toBe<'first' | 'second'>();
expectTypeOf<Trim<Tagged<WhitespaceCharacter, 'Text'>>>().toBe<''>();
expectTypeOf<Trim<Tagged<'\u{200B}\tvalue\t', 'Text'>>>().toBe<'\u{200B}\tvalue'>();

// Trimming preserves the domain of known placeholders and intrinsic string types.
expectTypeOf<Trim<`\u{FEFF}${number}\u{3000}`>>().toBe<`${number}`>();
expectTypeOf<Trim<`\u{A0}${bigint}\u{2029}`>>().toBe<`${bigint}`>();
expectTypeOf<Trim<`\t${boolean}\n`>>().toBe<'true' | 'false'>();
expectTypeOf<Trim<` ${Lowercase<string>} `>>().toBe<Lowercase<string>>();
expectTypeOf<Trim<` ${Uppercase<string>} `>>().toBe<Uppercase<string>>();
expectTypeOf<Trim<` ${Capitalize<string>} `>>().toBe<Capitalize<string>>();
expectTypeOf<Trim<` ${Uncapitalize<string>} `>>().toBe<Uncapitalize<string>>();
expectTypeOf<Trim<`\n${number}\t${number}\n`>>().toBe<`${number}\t${number}`>();
