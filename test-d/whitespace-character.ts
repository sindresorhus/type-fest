import {expectTypeOf} from 'nz';
import type {StringLength, WhitespaceCharacter} from '../index.d.ts';

// ASCII whitespace and all four ECMAScript line terminators.
expectTypeOf<'\t'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\n'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\v'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\f'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\r'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<' '>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{2028}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{2029}'>().toBeAssignableTo<WhitespaceCharacter>();

// Every non-ASCII space separator, including non-breaking and typographic spaces.
expectTypeOf<'\u{A0}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{1680}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{2000}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{2001}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{2002}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{2003}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{2004}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{2005}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{2006}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{2007}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{2008}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{2009}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{200A}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{202F}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{205F}'>().toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\u{3000}'>().toBeAssignableTo<WhitespaceCharacter>();

// ECMAScript includes the BOM even though Unicode's White_Space property does not.
expectTypeOf<'\u{FEFF}'>().toBeAssignableTo<WhitespaceCharacter>();

// Reject NEL, obsolete whitespace, zero-width formatting, and visible blank glyphs.
expectTypeOf<Extract<'\u{85}' | '\u{180E}' | '\u{200B}' | '\u{200C}' | '\u{200D}' | '\u{2060}' | '\u{2800}' | '\u{3164}', WhitespaceCharacter>>().toBe<never>();

// Other control characters and the code points bordering the space separator range are not whitespace.
expectTypeOf<Extract<'\0' | '\b' | '\u{1C}' | '\u{1D}' | '\u{1E}' | '\u{1F}' | '\u{7F}' | '\u{1FFF}' | '\u{200B}', WhitespaceCharacter>>().toBe<never>();

// The union contains single characters only, not empty strings or whitespace sequences.
expectTypeOf<StringLength<WhitespaceCharacter>>().toBe<1>();
expectTypeOf<''>().not.toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<'\r\n'>().not.toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<Extract<`${WhitespaceCharacter}${WhitespaceCharacter}`, WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<' x ' | 'x' | ',' | '0' | '😀', WhitespaceCharacter>>().toBe<never>();

// Broad inputs cannot guarantee a single whitespace character.
expectTypeOf<WhitespaceCharacter>().toBeAssignableTo<string>();
expectTypeOf<string>().not.toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<unknown>().not.toBeAssignableTo<WhitespaceCharacter>();
expectTypeOf<Extract<number | boolean | null | undefined, WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<WhitespaceCharacter, any>>().toBe<WhitespaceCharacter>();
expectTypeOf<Extract<WhitespaceCharacter, unknown>>().toBe<WhitespaceCharacter>();
expectTypeOf<Extract<WhitespaceCharacter, never>>().toBe<never>();

// Filter a union of candidate separators without widening its literal members.
expectTypeOf<Extract<' ' | '\t' | ',', WhitespaceCharacter>>().toBe<' ' | '\t'>();
expectTypeOf<Exclude<'\n' | '\u{FEFF}' | '\u{85}' | '\u{200B}' | ';', WhitespaceCharacter>>().toBe<'\u{85}' | '\u{200B}' | ';'>();

// Template literals can require a whitespace separator in a small grammar.
type Assignment = `${string}${WhitespaceCharacter}=${WhitespaceCharacter}${string}`;
expectTypeOf<'size\t= large'>().toBeAssignableTo<Assignment>();
expectTypeOf<'size\u{A0}=\u{3000}large'>().toBeAssignableTo<Assignment>();
expectTypeOf<'size=large'>().not.toBeAssignableTo<Assignment>();
expectTypeOf<'size\u{85}=\u{200B}large'>().not.toBeAssignableTo<Assignment>();

// Parse field names and values using any member of the union as the delimiter.
type ParseField<Field extends string> = Field extends `${infer Name}${WhitespaceCharacter}${infer Value}` ? [Name, Value] : never;
expectTypeOf<ParseField<`size${WhitespaceCharacter}large`>>().toBe<['size', 'large']>();
expectTypeOf<ParseField<'size\tlarge' | 'color\u{3000}blue'>>().toBe<['size', 'large'] | ['color', 'blue']>();
expectTypeOf<ParseField<'size\u{FEFF}large'>>().toBe<['size', 'large']>();
expectTypeOf<ParseField<'size\u{85}large' | 'size\u{200B}large' | 'size:large'>>().toBe<never>();

// Reject the remaining ASCII controls, including characters recognized as whitespace by other languages.
expectTypeOf<Extract<'\u{1}' | '\u{2}' | '\u{3}' | '\u{4}' | '\u{5}' | '\u{6}' | '\u{7}', WhitespaceCharacter>>().toBe<never>();
type OtherAsciiControls = '\u{E}' | '\u{F}' | '\u{10}' | '\u{11}' | '\u{12}' | '\u{13}' | '\u{14}' | '\u{15}' | '\u{16}' | '\u{17}' | '\u{18}' | '\u{19}' | '\u{1A}' | '\u{1B}';
expectTypeOf<Extract<OtherAsciiControls, WhitespaceCharacter>>().toBe<never>();

// Adjacent code points prevent accidentally broadening isolated characters into ranges.
expectTypeOf<Extract<'\u{1F}' | '\u{21}' | '\u{9F}' | '\u{A1}' | '\u{167F}' | '\u{1681}', WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<'\u{2027}' | '\u{202A}' | '\u{202E}' | '\u{2030}' | '\u{205E}' | '\u{2060}', WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<'\u{2FFF}' | '\u{3001}' | '\u{FEFE}' | '\u{FF00}', WhitespaceCharacter>>().toBe<never>();

// Invisible formatting, combining marks, and blank-looking characters are not trim whitespace.
expectTypeOf<Extract<'\u{AD}' | '\u{34F}' | '\u{61C}' | '\u{115F}' | '\u{1160}' | '\u{17B4}' | '\u{17B5}', WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<'\u{200E}' | '\u{200F}' | '\u{2061}' | '\u{2066}' | '\u{2069}' | '\u{FFA0}', WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<'\u{E0001}' | '\u{E0020}' | '\u{E007F}' | '\u{D800}' | '\u{DC00}', WhitespaceCharacter>>().toBe<never>();

// A whitespace member cannot be prefixed or suffixed with another character.
expectTypeOf<Extract<`x${WhitespaceCharacter}`, WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<`${WhitespaceCharacter}x`, WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<`\u{200B}${WhitespaceCharacter}`, WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<`${WhitespaceCharacter}\u{200B}`, WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<`\r\n${WhitespaceCharacter}`, WhitespaceCharacter>>().toBe<never>();

// Filtering starts with the candidate type; broad strings do not become a whitespace literal.
expectTypeOf<Extract<string, WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<unknown, WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<never, WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<any, WhitespaceCharacter>>().toBe<any>();
expectTypeOf<Extract<symbol | bigint | object | readonly [' '], WhitespaceCharacter>>().toBe<never>();
expectTypeOf<Extract<`${number}` | `${bigint}` | `${boolean}`, WhitespaceCharacter>>().toBe<never>();

// Unicode spaces and line terminators retain their literal identity under case conversions.
expectTypeOf<Uppercase<WhitespaceCharacter>>().toBe<WhitespaceCharacter>();
expectTypeOf<Lowercase<WhitespaceCharacter>>().toBe<WhitespaceCharacter>();
expectTypeOf<Capitalize<WhitespaceCharacter>>().toBe<WhitespaceCharacter>();
expectTypeOf<Uncapitalize<WhitespaceCharacter>>().toBe<WhitespaceCharacter>();

// Each side of the documented assignment grammar needs its own whitespace character.
expectTypeOf<'size= large'>().not.toBeAssignableTo<Assignment>();
expectTypeOf<'size =large'>().not.toBeAssignableTo<Assignment>();
expectTypeOf<'size\u{85}= large'>().not.toBeAssignableTo<Assignment>();
expectTypeOf<'size =\u{85}large'>().not.toBeAssignableTo<Assignment>();
expectTypeOf<'size\u{180E}= large'>().not.toBeAssignableTo<Assignment>();
expectTypeOf<'size =\u{200B}large'>().not.toBeAssignableTo<Assignment>();
expectTypeOf<'size\r=\nlarge'>().toBeAssignableTo<Assignment>();
expectTypeOf<'size\u{2028}=\u{2029}large'>().toBeAssignableTo<Assignment>();
expectTypeOf<`size${WhitespaceCharacter}= large`>().toBeAssignableTo<Assignment>();
expectTypeOf<`size =${WhitespaceCharacter}large`>().toBeAssignableTo<Assignment>();

// Delimiter matching also works at the beginning or end, with empty fields preserved.
expectTypeOf<ParseField<`${WhitespaceCharacter}large`>>().toBe<['', 'large']>();
expectTypeOf<ParseField<`size${WhitespaceCharacter}`>>().toBe<['size', '']>();
expectTypeOf<ParseField<WhitespaceCharacter>>().toBe<['', '']>();
expectTypeOf<ParseField<''>>().toBe<never>();
expectTypeOf<ParseField<'size\nlarge'>>().toBe<['size', 'large']>();
expectTypeOf<ParseField<'size\u{2028}large'>>().toBe<['size', 'large']>();
expectTypeOf<ParseField<'size\u{180E}large' | 'size\u{2060}large'>>().toBe<never>();
expectTypeOf<ParseField<'size large' | 'missing'>>().toBe<['size', 'large']>();
expectTypeOf<ParseField<never>>().toBe<never>();
expectTypeOf<ParseField<string>>().toBe<never>();
