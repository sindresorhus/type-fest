import {expectTypeOf} from 'nz';
import type {Flavor, IsWhitespace, Opaque, StringRepeat, Tagged, WhitespaceCharacter} from '../index.d.ts';

expectTypeOf<IsWhitespace<''>>().toBe<false>();
expectTypeOf<IsWhitespace<' '>>().toBe<true>();
expectTypeOf<IsWhitespace<'\n'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{9}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'a'>>().toBe<false>();
expectTypeOf<IsWhitespace<'a '>>().toBe<false>();
expectTypeOf<IsWhitespace<'   '>>().toBe<true>();
expectTypeOf<IsWhitespace<' \t '>>().toBe<true>();

// More ECMAScript whitespace characters are accepted alone.
expectTypeOf<IsWhitespace<'\v'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\f'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\r'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{A0}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{1680}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{2028}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{2029}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{202F}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{205F}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{3000}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{FEFF}'>>().toBe<true>();

// Mixed whitespace keeps the result, but any other character breaks it.
expectTypeOf<IsWhitespace<'\v\f\r'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{FEFF}\r\n\t '>>().toBe<true>();
expectTypeOf<IsWhitespace<`${WhitespaceCharacter}\u{3000}${WhitespaceCharacter}`>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{2028}\u{9}\u{2029}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\t.\n'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\u{3000}-\u{3000}'>>().toBe<false>();

// Every supported whitespace character can be combined without changing the classification.
expectTypeOf<IsWhitespace<`${WhitespaceCharacter}${WhitespaceCharacter}`>>().toBe<true>();
expectTypeOf<IsWhitespace<'\t\u{A0}\u{3000}\r\n'>>().toBe<true>();

// A single unsupported character breaks an otherwise all-whitespace string.
expectTypeOf<IsWhitespace<' \u{85} '>>().toBe<false>();
expectTypeOf<IsWhitespace<' \u{200B} '>>().toBe<false>();

// Broad and special inputs never produce `true`.
expectTypeOf<IsWhitespace<' \t' | 'ready'>>().toBe<boolean>();
expectTypeOf<IsWhitespace<string>>().toBe<boolean>();
expectTypeOf<IsWhitespace<any>>().toBe<boolean>();
expectTypeOf<IsWhitespace<never>>().toBe<never>();
// @ts-expect-error Whitespace classification requires a string.
type UnknownWhitespace = IsWhitespace<unknown>;

// The result is always assignable to `boolean`.
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
expectTypeOf<IsWhitespace<'\u{FEFF}indent'>>().toBe<false>();
expectTypeOf<IsWhitespace<'indent\u{FEFF}'>>().toBe<false>();

// Characters that other whitespace definitions include are not whitespace here.
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

// Unions keep `true` only when every member matches.
expectTypeOf<IsWhitespace<WhitespaceCharacter | ''>>().toBe<boolean>();
expectTypeOf<IsWhitespace<WhitespaceCharacter | 'x'>>().toBe<boolean>();

// Non-finite string types cannot establish an all-whitespace string.
expectTypeOf<IsWhitespace<`${number}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<`${bigint}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<` ${string}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<`${string} `>>().toBe<boolean>();
expectTypeOf<IsWhitespace<`${string}${string}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<`\t${string}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<`${string}\t`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<`${string | number}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Uppercase<string>>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Lowercase<string>>>().toBe<boolean>();
expectTypeOf<IsWhitespace<`\t${Uppercase<string>}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<`${Lowercase<string>} `>>().toBe<boolean>();
expectTypeOf<IsWhitespace<` ${any}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Tagged<`\t${string}`, 'Text'>>>().toBe<boolean>();

// Brand metadata must not hide the underlying characters.
expectTypeOf<IsWhitespace<Tagged<' \t', 'Indentation'>>>().toBe<true>();
expectTypeOf<IsWhitespace<Tagged<'', 'Text'>>>().toBe<false>();
expectTypeOf<IsWhitespace<Tagged<' text ', 'Text'>>>().toBe<false>();
expectTypeOf<IsWhitespace<Tagged<string, 'Text'>>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Tagged<` ${string}`, 'Text'>>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Opaque<'\r\n', 'Text'>>>().toBe<true>();
expectTypeOf<IsWhitespace<Opaque<'', 'Text'>>>().toBe<false>();
expectTypeOf<IsWhitespace<Opaque<' x ', 'Text'>>>().toBe<false>();
expectTypeOf<IsWhitespace<Opaque<string, 'Text'>>>().toBe<boolean>();
expectTypeOf<IsWhitespace<' \t' & {readonly __brand: 'Indentation'}>>().toBe<true>();
expectTypeOf<IsWhitespace<Tagged<Tagged<'\t\n', 'Text'>, 'Validated'>>>().toBe<true>();
expectTypeOf<IsWhitespace<Tagged<' ' | '', 'Text'>>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Tagged<'\t', 'Text'> | '\n'>>().toBe<true>();
expectTypeOf<IsWhitespace<Tagged<'\t', 'Text'> | 'text'>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Tagged<never, 'Text'>>>().toBe<never>();

// `Tagged`, `Opaque`, and `Flavor` all classify by the underlying string.
expectTypeOf<IsWhitespace<Flavor<' \t', 'Indentation'>>>().toBe<true>();
expectTypeOf<IsWhitespace<Flavor<'', 'Text'>>>().toBe<false>();
expectTypeOf<IsWhitespace<Flavor<' text ', 'Text'>>>().toBe<false>();
expectTypeOf<IsWhitespace<Flavor<string, 'Text'>>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Flavor<' ' | '', 'Text'>>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Opaque<' \t'>>>().toBe<true>();
expectTypeOf<IsWhitespace<Opaque<''>>>().toBe<false>();
expectTypeOf<IsWhitespace<Opaque<'\t', 123>>>().toBe<true>();
expectTypeOf<IsWhitespace<Opaque<'' | '\t'>>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Opaque<string> | '\t'>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Opaque<Tagged<'\t', 'Text'>>>>().toBe<true>();
expectTypeOf<IsWhitespace<Tagged<' ', 'A' | 'B'>>>().toBe<true>();
expectTypeOf<IsWhitespace<Tagged<Tagged<'', 'Text'>, 'Validated'>>>().toBe<false>();
expectTypeOf<IsWhitespace<Tagged<'' | '\t', 'Text'>>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Tagged<string, 'Text'> & Tagged<'\t', 'Other'>>>().toBe<true>();
expectTypeOf<IsWhitespace<' \t' & {readonly __brand: 'Indentation'}>>().toBe<true>();
expectTypeOf<IsWhitespace<' : ' & {readonly __brand: 'Indentation'}>>().toBe<false>();

// Enumerate the ECMAScript set independently so an omitted character cannot silently pass.
type EcmaWhitespace =
	| '\t'
	| '\n'
	| '\v'
	| '\f'
	| '\r'
	| ' '
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
expectTypeOf<{
	[Character in EcmaWhitespace]: [
		IsWhitespace<Character>,
		IsWhitespace<`${Character}${Character}${Character}`>,
		IsWhitespace<`\r${Character}\n`>,
	];
}>().toBe<{[Character in EcmaWhitespace]: [true, true, true]}>();

// Invisible characters, combining marks, and neighboring code points are not whitespace.
type OtherInvisibleCharacter = '\u{AD}' | '\u{301}' | '\u{34F}' | '\u{61C}' | '\u{115F}' | '\u{17B4}' | '\u{200E}' | '\u{200F}' | '\u{2061}' | '\u{2066}' | '\u{FFA0}';
expectTypeOf<IsWhitespace<OtherInvisibleCharacter>>().toBe<false>();
expectTypeOf<IsWhitespace<` ${OtherInvisibleCharacter}\t`>>().toBe<false>();
type WhitespaceNeighbor =
	| '\u{8}'
	| '\u{E}'
	| '\u{1F}'
	| '\u{21}'
	| '\u{9F}'
	| '\u{A1}'
	| '\u{167F}'
	| '\u{1681}'
	| '\u{1FFF}'
	| '\u{2027}'
	| '\u{202A}'
	| '\u{202E}'
	| '\u{2030}'
	| '\u{205E}'
	| '\u{2FFF}'
	| '\u{3001}'
	| '\u{FEFE}'
	| '\u{FF00}';
expectTypeOf<IsWhitespace<WhitespaceNeighbor>>().toBe<false>();
expectTypeOf<IsWhitespace<`\n${WhitespaceNeighbor} `>>().toBe<false>();
expectTypeOf<IsWhitespace<'\t\0\n'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\t\u{D800}\n'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\t\u{DC00}\n'>>().toBe<false>();
expectTypeOf<IsWhitespace<'\t\u{E0020}\n'>>().toBe<false>();

// Enum members are classified by their string values.
enum Token {
	Empty = '',
	Indentation = ' \t',
	LineBreak = '\r\n',
	Content = 'text',
}

expectTypeOf<IsWhitespace<Token.Empty>>().toBe<false>();
expectTypeOf<IsWhitespace<Token.Indentation>>().toBe<true>();
expectTypeOf<IsWhitespace<Token.LineBreak>>().toBe<true>();
expectTypeOf<IsWhitespace<Token.Content>>().toBe<false>();
expectTypeOf<IsWhitespace<Token>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Token.Indentation | Token.LineBreak>>().toBe<true>();
expectTypeOf<IsWhitespace<Token.Empty | Token.Content>>().toBe<false>();
expectTypeOf<IsWhitespace<Tagged<Token.Indentation, 'Text'>>>().toBe<true>();
expectTypeOf<IsWhitespace<Token.Indentation | ''>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Token.Empty | Token.Indentation>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Tagged<Token.Empty, 'Text'>>>().toBe<false>();
expectTypeOf<IsWhitespace<`\t${Token.Indentation}`>>().toBe<true>();

enum NumericToken {
	Zero,
	One,
}

// @ts-expect-error Numeric enum members are numbers, not strings.
type NumericEnumInput = IsWhitespace<NumericToken>;

// Finite template literals are unions of complete strings; optional characters can produce emptiness.
expectTypeOf<IsWhitespace<`${'' | ' '}${'' | '\t'}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<`${'' | ' '}\n${'' | '\t'}`>>().toBe<true>();
expectTypeOf<IsWhitespace<`\t${boolean}\n`>>().toBe<false>();
expectTypeOf<IsWhitespace<`${boolean}`>>().toBe<false>();
expectTypeOf<IsWhitespace<`\t${0 | 1}\n`>>().toBe<false>();
expectTypeOf<IsWhitespace<`${WhitespaceCharacter}${'' | 'x'}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<`${never}`>>().toBe<never>();

// Finite template literal unions expand to literal unions and classify each expansion.
expectTypeOf<IsWhitespace<` ${' ' | '\t'}`>>().toBe<true>();
expectTypeOf<IsWhitespace<`\t${' ' | '\t'}\n`>>().toBe<true>();
expectTypeOf<IsWhitespace<`\t${'' | ' '}`>>().toBe<true>();
expectTypeOf<IsWhitespace<` ${'' | 'x'}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<`\t${WhitespaceCharacter}`>>().toBe<true>();
expectTypeOf<IsWhitespace<`\t${WhitespaceCharacter | 'x'}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<`${WhitespaceCharacter}${'\u{200B}' | ''}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<` ${never}`>>().toBe<never>();
expectTypeOf<IsWhitespace<`${never} `>>().toBe<never>();
expectTypeOf<IsWhitespace<`${null | undefined}`>>().toBe<false>();
expectTypeOf<IsWhitespace<`${' ' | 0}`>>().toBe<boolean>();

// Non-literal inputs remain undecidable even when they have known content.
expectTypeOf<IsWhitespace<Capitalize<string>>>().toBe<boolean>();
expectTypeOf<IsWhitespace<Uncapitalize<string>>>().toBe<boolean>();
expectTypeOf<IsWhitespace<` ${string}\n`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<`text${string}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<` ${number} `>>().toBe<boolean>();
expectTypeOf<IsWhitespace<' ' | `${bigint}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<'text' | `${number}`>>().toBe<boolean>();
expectTypeOf<IsWhitespace<string & {}>>().toBe<boolean>();

// Long inputs must not cause premature success or hit the compiler's recursion limit.
type LongWhitespace = StringRepeat<' \t\r\n\u{A0}', 100>;
expectTypeOf<IsWhitespace<LongWhitespace>>().toBe<true>();
expectTypeOf<IsWhitespace<`x${LongWhitespace}`>>().toBe<false>();
expectTypeOf<IsWhitespace<`${LongWhitespace}x`>>().toBe<false>();
expectTypeOf<IsWhitespace<`${StringRepeat<' ', 250>}x${StringRepeat<'\t', 250>}`>>().toBe<false>();
expectTypeOf<IsWhitespace<`${LongWhitespace}\u{200B}`>>().toBe<false>();
expectTypeOf<IsWhitespace<LongWhitespace | ''>>().toBe<boolean>();

expectTypeOf<IsWhitespace<StringRepeat<'\t', 900>>>().toBe<true>();
expectTypeOf<IsWhitespace<StringRepeat<'\u{3000}', 200>>>().toBe<true>();
expectTypeOf<IsWhitespace<`\r\n${StringRepeat<'\u{2028}', 200>}`>>().toBe<true>();
expectTypeOf<IsWhitespace<Tagged<StringRepeat<'\t', 500>, 'Indentation'>>>().toBe<true>();
expectTypeOf<IsWhitespace<`x${StringRepeat<' ', 900>}`>>().toBe<false>();
expectTypeOf<IsWhitespace<`${StringRepeat<' ', 900>}x`>>().toBe<false>();

// Generic consumers can infer results and filter token unions without losing the original values.
declare function isWhitespace<const Value extends string>(value: Value): IsWhitespace<Value>;
expectTypeOf(isWhitespace(' \t')).toBe<true>();
expectTypeOf(isWhitespace('')).toBe<false>();
expectTypeOf(isWhitespace('text')).toBe<false>();
expectTypeOf(isWhitespace(' ' as string)).toBe<boolean>();
expectTypeOf(isWhitespace(' ' as ' ' | 'text')).toBe<boolean>();

declare function isWhitespaceCharacter<Value extends WhitespaceCharacter>(value: Value): IsWhitespace<Value>;
expectTypeOf(isWhitespaceCharacter(' ')).toBe<true>();
expectTypeOf(isWhitespaceCharacter('\u{3000}')).toBe<true>();

type WhitespaceTokens<Value extends string> = Value extends unknown
	? IsWhitespace<Value> extends true ? Value : never
	: never;
expectTypeOf<WhitespaceTokens<'' | ' ' | '\r\n' | 'text'>>().toBe<' ' | '\r\n'>();
expectTypeOf<WhitespaceTokens<'\u{FEFF}' | '\u{85}' | '\u{200B}'>>().toBe<'\u{FEFF}'>();
expectTypeOf<WhitespaceTokens<Tagged<' \t', 'Text'> | 'text'>>().toBe<Tagged<' \t', 'Text'>>();
expectTypeOf<WhitespaceTokens<Tagged<'\t', 'A'> | Tagged<'\n', 'B'> | 'x'>>().toBe<Tagged<'\t', 'A'> | Tagged<'\n', 'B'>>();
expectTypeOf<WhitespaceTokens<WhitespaceCharacter | ''>>().toBe<WhitespaceCharacter>();
expectTypeOf<WhitespaceTokens<string>>().toBe<never>();
expectTypeOf<WhitespaceTokens<never>>().toBe<never>();

type NonWhitespaceTokens<Value extends string> = Value extends unknown
	? IsWhitespace<Value> extends false ? Value : never
	: never;
expectTypeOf<NonWhitespaceTokens<'' | ' ' | 'x' | '\t'>>().toBe<'' | 'x'>();
expectTypeOf<NonWhitespaceTokens<' ' | '\r\n'>>().toBe<never>();
expectTypeOf<NonWhitespaceTokens<Tagged<' ', 'Text'> | 'x'>>().toBe<'x'>();
expectTypeOf<NonWhitespaceTokens<never>>().toBe<never>();
expectTypeOf<NonWhitespaceTokens<string>>().toBe<never>();

// Reject non-string inputs rather than coercing them.
// @ts-expect-error Numbers are not strings.
type NumberInput = IsWhitespace<0>;
// @ts-expect-error Null is not a string.
type NullInput = IsWhitespace<null>;
// @ts-expect-error Undefined is not a string.
type UndefinedInput = IsWhitespace<undefined>;
// @ts-expect-error Booleans are not strings.
type BooleanInput = IsWhitespace<boolean>;
// @ts-expect-error String objects are not primitive strings.
type BoxedStringInput = IsWhitespace<String>;
// @ts-expect-error Every union member must be a string.
type InvalidUnionInput = IsWhitespace<' ' | 0>;
// @ts-expect-error Symbols are not strings.
type SymbolInput = IsWhitespace<symbol>;
// @ts-expect-error Bigints are not strings.
type BigintInput = IsWhitespace<1n>;
// @ts-expect-error Plain object types are not strings.
type ObjectInput = IsWhitespace<{}>;
// @ts-expect-error Arrays are not strings.
type ArrayInput = IsWhitespace<string[]>;
