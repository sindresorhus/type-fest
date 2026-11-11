import {expectTypeOf} from 'nz';
import type {If, IsNumberLike, IsNumericString, LiteralUnion, NonNegativeIntegerString, Opaque, Tagged, WhitespaceCharacter} from '../index.d.ts';

// `IsNumericString` follows TypeScript's own lenient numeric-string rule, and then rejects anything that is padded with whitespace, so a bare hexadecimal form still counts.
expectTypeOf<IsNumericString<''>>().toBe<false>();
expectTypeOf<IsNumericString<'0'>>().toBe<true>();
expectTypeOf<IsNumericString<'1'>>().toBe<true>();
expectTypeOf<IsNumericString<'-1'>>().toBe<true>();
expectTypeOf<IsNumericString<'123'>>().toBe<true>();
expectTypeOf<IsNumericString<'1e2'>>().toBe<true>();
expectTypeOf<IsNumericString<'1.23'>>().toBe<true>();
expectTypeOf<IsNumericString<'123.456'>>().toBe<true>();
expectTypeOf<IsNumericString<'1.23e4'>>().toBe<true>();
expectTypeOf<IsNumericString<'1.23e-4'>>().toBe<true>();
expectTypeOf<IsNumericString<' '>>().toBe<false>();
expectTypeOf<IsNumericString<'\n'>>().toBe<false>();
expectTypeOf<IsNumericString<'\u{9}'>>().toBe<false>();
expectTypeOf<IsNumericString<' 1.2'>>().toBe<false>();
expectTypeOf<IsNumericString<'1 2'>>().toBe<false>();
expectTypeOf<IsNumericString<'1_200'>>().toBe<false>();
expectTypeOf<IsNumericString<' 1 '>>().toBe<false>();
expectTypeOf<IsNumericString<'-1.1'>>().toBe<true>();
expectTypeOf<IsNumericString<'1e5'>>().toBe<true>();
expectTypeOf<IsNumericString<'0x10'>>().toBe<true>();
expectTypeOf<IsNumericString<'a'>>().toBe<false>();
expectTypeOf<IsNumericString<' 1'>>().toBe<false>();
expectTypeOf<IsNumericString<'1 '>>().toBe<false>();
expectTypeOf<IsNumericString<'1_0'>>().toBe<false>();

// A brand does not change whether the underlying string is numeric.
expectTypeOf<IsNumericString<Tagged<'42', 'Amount'>>>().toBe<true>();
expectTypeOf<IsNumericString<Tagged<' 42', 'Amount'>>>().toBe<false>();

// Signs, leading zeros, and decimal points do not require a canonical spelling.
expectTypeOf<IsNumericString<'+1'>>().toBe<true>();
expectTypeOf<IsNumericString<'-0'>>().toBe<true>();
expectTypeOf<IsNumericString<'+0'>>().toBe<true>();
expectTypeOf<IsNumericString<'007'>>().toBe<true>();
expectTypeOf<IsNumericString<'00.50'>>().toBe<true>();
expectTypeOf<IsNumericString<'.5'>>().toBe<true>();
expectTypeOf<IsNumericString<'-.5'>>().toBe<true>();
expectTypeOf<IsNumericString<'+.5'>>().toBe<true>();
expectTypeOf<IsNumericString<'1.'>>().toBe<true>();

// Exponents support both cases and either sign, but must have digits.
expectTypeOf<IsNumericString<'1E3'>>().toBe<true>();
expectTypeOf<IsNumericString<'1e+3'>>().toBe<true>();
expectTypeOf<IsNumericString<'-.5E-2'>>().toBe<true>();
expectTypeOf<IsNumericString<'1.e2'>>().toBe<true>();
expectTypeOf<IsNumericString<'1e'>>().toBe<false>();
expectTypeOf<IsNumericString<'e3'>>().toBe<false>();
expectTypeOf<IsNumericString<'1e+'>>().toBe<false>();
expectTypeOf<IsNumericString<'1e+-2'>>().toBe<false>();
expectTypeOf<IsNumericString<'1e2e3'>>().toBe<false>();

// Radix-prefixed strings are numeric, but cannot have signs or decimal parts.
expectTypeOf<IsNumericString<'0xFF'>>().toBe<true>();
expectTypeOf<IsNumericString<'0Xff'>>().toBe<true>();
expectTypeOf<IsNumericString<'0b101'>>().toBe<true>();
expectTypeOf<IsNumericString<'0B10'>>().toBe<true>();
expectTypeOf<IsNumericString<'0o17'>>().toBe<true>();
expectTypeOf<IsNumericString<'0O17'>>().toBe<true>();
expectTypeOf<IsNumericString<'0x'>>().toBe<false>();
expectTypeOf<IsNumericString<'0xGG'>>().toBe<false>();
expectTypeOf<IsNumericString<'0b2'>>().toBe<false>();
expectTypeOf<IsNumericString<'0o8'>>().toBe<false>();
expectTypeOf<IsNumericString<'-0x10'>>().toBe<false>();
expectTypeOf<IsNumericString<'+0b10'>>().toBe<false>();
expectTypeOf<IsNumericString<'0x1.5'>>().toBe<false>();

// Matching does not require an exact number round trip, but overflow is rejected.
expectTypeOf<IsNumericString<'9007199254740993'>>().toBe<true>();
expectTypeOf<IsNumericString<'0.12345678901234567890'>>().toBe<true>();
expectTypeOf<IsNumericString<'1e308'>>().toBe<true>();
expectTypeOf<IsNumericString<'1e309'>>().toBe<false>();
expectTypeOf<IsNumericString<'1e-400'>>().toBe<true>();
expectTypeOf<IsNumericString<'Infinity'>>().toBe<false>();
expectTypeOf<IsNumericString<'-Infinity'>>().toBe<false>();
expectTypeOf<IsNumericString<'NaN'>>().toBe<false>();

// Each ECMAScript whitespace character is rejected on either side and on its own.
expectTypeOf<{[Whitespace in WhitespaceCharacter]: IsNumericString<`${Whitespace}42`>}>().toBe<Record<WhitespaceCharacter, false>>();
expectTypeOf<{[Whitespace in WhitespaceCharacter]: IsNumericString<`42${Whitespace}`>}>().toBe<Record<WhitespaceCharacter, false>>();
expectTypeOf<{[Whitespace in WhitespaceCharacter]: IsNumericString<Whitespace>}>().toBe<Record<WhitespaceCharacter, false>>();
expectTypeOf<IsNumericString<'\t-1.5\r\n'>>().toBe<false>();
expectTypeOf<IsNumericString<' 0x10 '>>().toBe<false>();
expectTypeOf<IsNumericString<'1\t2'>>().toBe<false>();
expectTypeOf<IsNumericString<'\u{200B}1'>>().toBe<false>();
expectTypeOf<IsNumericString<'1\u{0085}'>>().toBe<false>();

// Reject malformed text, localized numbers, units, and JavaScript literal suffixes.
expectTypeOf<IsNumericString<'.'>>().toBe<false>();
expectTypeOf<IsNumericString<'+'>>().toBe<false>();
expectTypeOf<IsNumericString<'-.'>>().toBe<false>();
expectTypeOf<IsNumericString<'--1'>>().toBe<false>();
expectTypeOf<IsNumericString<'1.2.3'>>().toBe<false>();
expectTypeOf<IsNumericString<'1,000'>>().toBe<false>();
expectTypeOf<IsNumericString<'1,5'>>().toBe<false>();
expectTypeOf<IsNumericString<'12px'>>().toBe<false>();
expectTypeOf<IsNumericString<'1n'>>().toBe<false>();
expectTypeOf<IsNumericString<'１２'>>().toBe<false>();
expectTypeOf<IsNumericString<'١٢'>>().toBe<false>();
expectTypeOf<IsNumericString<'½'>>().toBe<false>();
expectTypeOf<IsNumericString<'\u{2212}1'>>().toBe<false>();

// A predicate accepts arbitrary input types without coercing them to strings.
expectTypeOf<IsNumericString<any>>().toBe<boolean>();
expectTypeOf<IsNumericString<never>>().toBe<false>();
expectTypeOf<IsNumericString<unknown>>().toBe<false>();
expectTypeOf<IsNumericString<string>>().toBe<false>();
expectTypeOf<IsNumericString<number>>().toBe<false>();
expectTypeOf<IsNumericString<42>>().toBe<false>();
expectTypeOf<IsNumericString<bigint>>().toBe<false>();
expectTypeOf<IsNumericString<42n>>().toBe<false>();
expectTypeOf<IsNumericString<boolean>>().toBe<false>();
expectTypeOf<IsNumericString<symbol>>().toBe<false>();
expectTypeOf<IsNumericString<null>>().toBe<false>();
expectTypeOf<IsNumericString<undefined>>().toBe<false>();
expectTypeOf<IsNumericString<void>>().toBe<false>();
expectTypeOf<IsNumericString<{}>>().toBe<false>();
expectTypeOf<IsNumericString<['42']>>().toBe<false>();
expectTypeOf<IsNumericString<{toString(): '42'; valueOf(): 42}>>().toBe<false>();

// Unions distribute; a wide string can absorb numeric literal alternatives.
expectTypeOf<IsNumericString<'1' | '0x10' | '-.5'>>().toBe<true>();
expectTypeOf<IsNumericString<'auto' | '' | 42>>().toBe<false>();
expectTypeOf<IsNumericString<'42' | 'auto'>>().toBe<boolean>();
expectTypeOf<IsNumericString<'42' | ' 42'>>().toBe<boolean>();
expectTypeOf<IsNumericString<'42' | number>>().toBe<boolean>();
expectTypeOf<IsNumericString<'42' | null | undefined>>().toBe<boolean>();
expectTypeOf<IsNumericString<'42' | string>>().toBe<false>();
expectTypeOf<IsNumericString<LiteralUnion<'42', string>>>().toBe<boolean>();
expectTypeOf<IsNumericString<LiteralUnion<'auto', string>>>().toBe<false>();

// Infinite template patterns follow TypeScript assignability, not value enumeration.
expectTypeOf<IsNumericString<`${number}`>>().toBe<true>();
expectTypeOf<IsNumericString<`${bigint}`>>().toBe<false>();
expectTypeOf<IsNumericString<` ${number}`>>().toBe<false>();
expectTypeOf<IsNumericString<`${number} `>>().toBe<false>();
expectTypeOf<IsNumericString<`+${number}`>>().toBe<false>();
expectTypeOf<IsNumericString<`${number}px`>>().toBe<false>();
expectTypeOf<IsNumericString<`${number}.${number}`>>().toBe<false>();
expectTypeOf<IsNumericString<`${boolean}`>>().toBe<false>();
expectTypeOf<IsNumericString<Uppercase<string>>>().toBe<false>();
expectTypeOf<IsNumericString<`${number}` | 'auto'>>().toBe<boolean>();
expectTypeOf<IsNumericString<`0${1 | 2}`>>().toBe<true>();

// Branded values retain the same classification without requiring an exact identity.
expectTypeOf<IsNumericString<Opaque<'42', 'Amount'>>>().toBe<true>();
expectTypeOf<IsNumericString<Opaque<'42 ', 'Amount'>>>().toBe<false>();
expectTypeOf<IsNumericString<'42' & {readonly brand: unique symbol}>>().toBe<true>();
expectTypeOf<IsNumericString<Tagged<Tagged<'42', 'Amount'>, 'Validated'>>>().toBe<true>();
expectTypeOf<IsNumericString<Tagged<'0x10', 'Amount'>>>().toBe<true>();
expectTypeOf<IsNumericString<Tagged<'', 'Amount'>>>().toBe<false>();
expectTypeOf<IsNumericString<Tagged<'auto', 'Amount'>>>().toBe<false>();
expectTypeOf<IsNumericString<Tagged<string, 'Amount'>>>().toBe<false>();
expectTypeOf<IsNumericString<Tagged<number, 'Amount'>>>().toBe<false>();
expectTypeOf<IsNumericString<Tagged<`${number}`, 'Amount'>>>().toBe<true>();
expectTypeOf<IsNumericString<Tagged<'42' | 'auto', 'Amount'>>>().toBe<boolean>();
expectTypeOf<IsNumericString<Tagged<LiteralUnion<'42', string>, 'Amount'>>>().toBe<boolean>();

// String enum members are checked by their values, including whitespace.
enum NumericText {
	Decimal = '42',
	Hex = '0x10',
	Padded = ' 42',
	Invalid = 'auto',
}

expectTypeOf<IsNumericString<NumericText.Decimal>>().toBe<true>();
expectTypeOf<IsNumericString<NumericText.Hex>>().toBe<true>();
expectTypeOf<IsNumericString<NumericText.Padded>>().toBe<false>();
expectTypeOf<IsNumericString<NumericText.Invalid>>().toBe<false>();
expectTypeOf<IsNumericString<NumericText>>().toBe<boolean>();
expectTypeOf<IsNumericString<typeof NumericText>>().toBe<false>();

// The related types have distinct contracts.
expectTypeOf<IsNumberLike<' 42'>>().toBe<true>();
expectTypeOf<IsNumberLike<42>>().toBe<true>();
expectTypeOf<IsNumericString<NonNegativeIntegerString<'007'>>>().toBe<true>();
expectTypeOf<If<IsNumericString<'42'>, number, string>>().toBe<number>();
expectTypeOf<If<IsNumericString<'42' | 'auto'>, number, string>>().toBe<number | string>();

// Type transformations can select numeric string keys and convert known query values.
type Fields = {'42': string; ' 42': string; name: string; 0: string};
expectTypeOf<{[Key in keyof Fields]: IsNumericString<Key> extends true ? Key : never}[keyof Fields]>().toBe<'42'>();

type Query = {page: '2'; search: 'cats'};
expectTypeOf<{[Key in keyof Query]: IsNumericString<Query[Key]> extends true ? number : Query[Key]}>().toBe<{page: number; search: 'cats'}>();

function _numericStringResult<Value>(result: IsNumericString<Value>): boolean {
	return result;
}

// Decimal forms accept redundant zeros, including after a sign or decimal point.
expectTypeOf<IsNumericString<'000'>>().toBe<true>();
expectTypeOf<IsNumericString<'08'>>().toBe<true>();
expectTypeOf<IsNumericString<'09'>>().toBe<true>();
expectTypeOf<IsNumericString<'-007'>>().toBe<true>();
expectTypeOf<IsNumericString<'+007'>>().toBe<true>();
expectTypeOf<IsNumericString<'0.'>>().toBe<true>();
expectTypeOf<IsNumericString<'-0.'>>().toBe<true>();
expectTypeOf<IsNumericString<'+0.'>>().toBe<true>();
expectTypeOf<IsNumericString<'00.'>>().toBe<true>();
expectTypeOf<IsNumericString<'.0'>>().toBe<true>();
expectTypeOf<IsNumericString<'-.0'>>().toBe<true>();
expectTypeOf<IsNumericString<'+.0'>>().toBe<true>();
expectTypeOf<IsNumericString<'-00.00'>>().toBe<true>();
expectTypeOf<IsNumericString<'+00.00'>>().toBe<true>();

// Exponent digits can have leading zeros and do not need an integer mantissa.
expectTypeOf<IsNumericString<'0e0'>>().toBe<true>();
expectTypeOf<IsNumericString<'-0E+0'>>().toBe<true>();
expectTypeOf<IsNumericString<'+0e-0'>>().toBe<true>();
expectTypeOf<IsNumericString<'01e002'>>().toBe<true>();
expectTypeOf<IsNumericString<'+.5E+02'>>().toBe<true>();
expectTypeOf<IsNumericString<'-1.E-02'>>().toBe<true>();
expectTypeOf<IsNumericString<'.0e3'>>().toBe<true>();
expectTypeOf<IsNumericString<'1e-'>>().toBe<false>();
expectTypeOf<IsNumericString<'.e3'>>().toBe<false>();
expectTypeOf<IsNumericString<'1ee3'>>().toBe<false>();
expectTypeOf<IsNumericString<'1e++2'>>().toBe<false>();
expectTypeOf<IsNumericString<'1e--2'>>().toBe<false>();
expectTypeOf<IsNumericString<'1e2.5'>>().toBe<false>();
expectTypeOf<IsNumericString<'1e0x2'>>().toBe<false>();
expectTypeOf<IsNumericString<'1e2n'>>().toBe<false>();

// Rounding and underflow do not prevent matching a finite number.
expectTypeOf<IsNumericString<'1.7976931348623157e308'>>().toBe<true>();
expectTypeOf<IsNumericString<'1.7976931348623159e308'>>().toBe<false>();
expectTypeOf<IsNumericString<'-1.7976931348623157e308'>>().toBe<true>();
expectTypeOf<IsNumericString<'-1.7976931348623159e308'>>().toBe<false>();
expectTypeOf<IsNumericString<'+1e309'>>().toBe<false>();
expectTypeOf<IsNumericString<'-1e309'>>().toBe<false>();
expectTypeOf<IsNumericString<'5e-324'>>().toBe<true>();
expectTypeOf<IsNumericString<'2e-324'>>().toBe<true>();
expectTypeOf<IsNumericString<'-1e-400'>>().toBe<true>();

// Radix digits may have leading zeros, but the prefix is required in full.
expectTypeOf<IsNumericString<'0x0'>>().toBe<true>();
expectTypeOf<IsNumericString<'0X000A'>>().toBe<true>();
expectTypeOf<IsNumericString<'0x1e3'>>().toBe<true>();
expectTypeOf<IsNumericString<'0b0'>>().toBe<true>();
expectTypeOf<IsNumericString<'0B0001'>>().toBe<true>();
expectTypeOf<IsNumericString<'0o0'>>().toBe<true>();
expectTypeOf<IsNumericString<'0O007'>>().toBe<true>();
expectTypeOf<IsNumericString<'0b'>>().toBe<false>();
expectTypeOf<IsNumericString<'0o'>>().toBe<false>();
expectTypeOf<IsNumericString<'+0x10'>>().toBe<false>();
expectTypeOf<IsNumericString<'-0b10'>>().toBe<false>();
expectTypeOf<IsNumericString<'+0o10'>>().toBe<false>();
expectTypeOf<IsNumericString<'-0o10'>>().toBe<false>();
expectTypeOf<IsNumericString<'00x10'>>().toBe<false>();
expectTypeOf<IsNumericString<'0_x10'>>().toBe<false>();
expectTypeOf<IsNumericString<'0x1p2'>>().toBe<false>();
expectTypeOf<IsNumericString<'0b1.0'>>().toBe<false>();
expectTypeOf<IsNumericString<'0o1.0'>>().toBe<false>();
expectTypeOf<IsNumericString<'0b1e2'>>().toBe<false>();
expectTypeOf<IsNumericString<'0o1e2'>>().toBe<false>();
expectTypeOf<IsNumericString<'0x1_0'>>().toBe<false>();
expectTypeOf<IsNumericString<'0b1_0'>>().toBe<false>();
expectTypeOf<IsNumericString<'0o1_0'>>().toBe<false>();
expectTypeOf<IsNumericString<'0x10n'>>().toBe<false>();

// Signs, operators, separators, and suffixes must not be parsed as numeric prefixes.
expectTypeOf<IsNumericString<'-'>>().toBe<false>();
expectTypeOf<IsNumericString<'+.'>>().toBe<false>();
expectTypeOf<IsNumericString<'++1'>>().toBe<false>();
expectTypeOf<IsNumericString<'+-1'>>().toBe<false>();
expectTypeOf<IsNumericString<'-+1'>>().toBe<false>();
expectTypeOf<IsNumericString<'1+'>>().toBe<false>();
expectTypeOf<IsNumericString<'1-'>>().toBe<false>();
expectTypeOf<IsNumericString<'1..'>>().toBe<false>();
expectTypeOf<IsNumericString<'..1'>>().toBe<false>();
expectTypeOf<IsNumericString<'1/2'>>().toBe<false>();
expectTypeOf<IsNumericString<'1+2'>>().toBe<false>();
expectTypeOf<IsNumericString<'1_0.5'>>().toBe<false>();
expectTypeOf<IsNumericString<'1.5_0'>>().toBe<false>();
expectTypeOf<IsNumericString<'1e1_0'>>().toBe<false>();
expectTypeOf<IsNumericString<'10%'>>().toBe<false>();
expectTypeOf<IsNumericString<'$10'>>().toBe<false>();
expectTypeOf<IsNumericString<'1f'>>().toBe<false>();
expectTypeOf<IsNumericString<'1d'>>().toBe<false>();
expectTypeOf<IsNumericString<'+Infinity'>>().toBe<false>();
expectTypeOf<IsNumericString<'infinity'>>().toBe<false>();
expectTypeOf<IsNumericString<'+NaN'>>().toBe<false>();
expectTypeOf<IsNumericString<'true'>>().toBe<false>();
expectTypeOf<IsNumericString<'null'>>().toBe<false>();

// Each whitespace character is rejected inside numeric syntax and at branded string boundaries.
expectTypeOf<{[Whitespace in WhitespaceCharacter]: IsNumericString<`+${Whitespace}1`>}>().toBe<Record<WhitespaceCharacter, false>>();
expectTypeOf<{[Whitespace in WhitespaceCharacter]: IsNumericString<`1${Whitespace}.5`>}>().toBe<Record<WhitespaceCharacter, false>>();
expectTypeOf<{[Whitespace in WhitespaceCharacter]: IsNumericString<`1.${Whitespace}5`>}>().toBe<Record<WhitespaceCharacter, false>>();
expectTypeOf<{[Whitespace in WhitespaceCharacter]: IsNumericString<`1${Whitespace}e2`>}>().toBe<Record<WhitespaceCharacter, false>>();
expectTypeOf<{[Whitespace in WhitespaceCharacter]: IsNumericString<`1e${Whitespace}2`>}>().toBe<Record<WhitespaceCharacter, false>>();
expectTypeOf<{[Whitespace in WhitespaceCharacter]: IsNumericString<`1e+${Whitespace}2`>}>().toBe<Record<WhitespaceCharacter, false>>();
expectTypeOf<{[Whitespace in WhitespaceCharacter]: IsNumericString<`0${Whitespace}x10`>}>().toBe<Record<WhitespaceCharacter, false>>();
expectTypeOf<{[Whitespace in WhitespaceCharacter]: IsNumericString<`0b${Whitespace}1`>}>().toBe<Record<WhitespaceCharacter, false>>();
expectTypeOf<{[Whitespace in WhitespaceCharacter]: IsNumericString<Tagged<`${Whitespace}0x10`, 'Input'>>}>().toBe<Record<WhitespaceCharacter, false>>();
expectTypeOf<{[Whitespace in WhitespaceCharacter]: IsNumericString<Tagged<`1e2${Whitespace}`, 'Input'>>}>().toBe<Record<WhitespaceCharacter, false>>();
expectTypeOf<IsNumericString<'\t\n\r'>>().toBe<false>();
expectTypeOf<IsNumericString<'\u{FEFF}+1.5e-3\u{A0}'>>().toBe<false>();
expectTypeOf<IsNumericString<'\u{0}1'>>().toBe<false>();
expectTypeOf<IsNumericString<'1\u{0}'>>().toBe<false>();
expectTypeOf<IsNumericString<'\u{180E}1'>>().toBe<false>();
expectTypeOf<IsNumericString<'1\u{180E}'>>().toBe<false>();

// Literal template expansions classify each resulting string, including mixed results.
expectTypeOf<IsNumericString<`${'+' | '-'}${0 | 1}.${0 | 5}`>>().toBe<true>();
expectTypeOf<IsNumericString<`${1 | 2}${'e' | 'E'}${'+' | '-'}${0 | 3}`>>().toBe<true>();
expectTypeOf<IsNumericString<`0${'x' | 'X'}${'a' | 'F'}`>>().toBe<true>();
expectTypeOf<IsNumericString<`0${'b' | 'B'}${0 | 1}`>>().toBe<true>();
expectTypeOf<IsNumericString<`0${'o' | 'O'}${0 | 7}`>>().toBe<true>();
expectTypeOf<IsNumericString<`${1 | 2}${'' | 'px'}`>>().toBe<boolean>();
expectTypeOf<IsNumericString<`${'' | ' '}${1 | 2}`>>().toBe<boolean>();
expectTypeOf<IsNumericString<`0b${1 | 2}`>>().toBe<boolean>();
expectTypeOf<IsNumericString<`1e${308 | 309}`>>().toBe<boolean>();
expectTypeOf<IsNumericString<`${'auto' | 'none'}${1 | 2}`>>().toBe<false>();
expectTypeOf<IsNumericString<`${never}`>>().toBe<false>();
expectTypeOf<IsNumericString<`${null | undefined}`>>().toBe<false>();
expectTypeOf<IsNumericString<Lowercase<'0XFF'>>>().toBe<true>();
expectTypeOf<IsNumericString<Uppercase<'1e+3'>>>().toBe<true>();
expectTypeOf<IsNumericString<Lowercase<string>>>().toBe<false>();
expectTypeOf<IsNumericString<`${number}${number}`>>().toBe<false>();
expectTypeOf<IsNumericString<`${number}e${number}`>>().toBe<false>();
expectTypeOf<IsNumericString<`${number}${string}`>>().toBe<false>();
expectTypeOf<IsNumericString<`${string}${number}`>>().toBe<false>();
expectTypeOf<IsNumericString<`${number | bigint}`>>().toBe<boolean>();

// Normalization of unions and intersections happens before the predicate is evaluated.
expectTypeOf<IsNumericString<'42' | never>>().toBe<true>();
expectTypeOf<IsNumericString<'42' | unknown>>().toBe<false>();
expectTypeOf<IsNumericString<'42' | any>>().toBe<boolean>();
expectTypeOf<IsNumericString<'42' | bigint | symbol | object>>().toBe<boolean>();
expectTypeOf<IsNumericString<PropertyKey>>().toBe<false>();
expectTypeOf<IsNumericString<'42' & {}>>().toBe<true>();
expectTypeOf<IsNumericString<'42' & unknown>>().toBe<true>();
expectTypeOf<IsNumericString<string & `${number}`>>().toBe<true>();
expectTypeOf<IsNumericString<'42' & `${number}`>>().toBe<true>();
expectTypeOf<IsNumericString<'42' & number>>().toBe<false>();
expectTypeOf<IsNumericString<number & string>>().toBe<false>();
expectTypeOf<IsNumericString<any & never>>().toBe<false>();
expectTypeOf<IsNumericString<LiteralUnion<'1' | '2', string>>>().toBe<boolean>();
expectTypeOf<IsNumericString<LiteralUnion<'auto' | 'none', string>>>().toBe<false>();

// Supported brands also preserve scientific, signed, decimal, and invalid forms.
expectTypeOf<IsNumericString<Tagged<'1e3', 'Input'>>>().toBe<true>();
expectTypeOf<IsNumericString<Tagged<'+.5', 'Input'>>>().toBe<true>();
expectTypeOf<IsNumericString<Tagged<'-0', 'Input'>>>().toBe<true>();
expectTypeOf<IsNumericString<Tagged<'0b10', 'Input'>>>().toBe<true>();
expectTypeOf<IsNumericString<Tagged<'0o17', 'Input'>>>().toBe<true>();
expectTypeOf<IsNumericString<Tagged<'1e309', 'Input'>>>().toBe<false>();
expectTypeOf<IsNumericString<Tagged<'1_000', 'Input'>>>().toBe<false>();
expectTypeOf<IsNumericString<Tagged<'42' | '43', 'Input'>>>().toBe<true>();
expectTypeOf<IsNumericString<Tagged<' 42' | 'auto', 'Input'>>>().toBe<false>();
expectTypeOf<IsNumericString<Tagged<never, 'Input'>>>().toBe<false>();
expectTypeOf<IsNumericString<Tagged<any, 'Input'>>>().toBe<boolean>();
expectTypeOf<IsNumericString<Tagged<unknown, 'Input'>>>().toBe<false>();
expectTypeOf<IsNumericString<Opaque<'+.5', 'Input'>>>().toBe<true>();
expectTypeOf<IsNumericString<Opaque<'1e3', 'Input'>>>().toBe<true>();
expectTypeOf<IsNumericString<Opaque<'1_000', 'Input'>>>().toBe<false>();
expectTypeOf<IsNumericString<'1.5' & {readonly brand?: 'Input'}>>().toBe<true>();
expectTypeOf<IsNumericString<' 1.5' & {readonly brand?: 'Input'}>>().toBe<false>();

// Wrapper objects and string-producing functions do not become primitive strings.
expectTypeOf<IsNumericString<object>>().toBe<false>();
expectTypeOf<IsNumericString<InstanceType<typeof String>>>().toBe<false>();
expectTypeOf<IsNumericString<InstanceType<typeof Number>>>().toBe<false>();
expectTypeOf<IsNumericString<() => '42'>>().toBe<false>();
expectTypeOf<IsNumericString<{[Symbol.toPrimitive](): '42'}>>().toBe<false>();
expectTypeOf<IsNumericString<readonly ['42']>>().toBe<false>();
expectTypeOf<IsNumericString<string[]>>().toBe<false>();
expectTypeOf<IsNumericString<Promise<'42'>>>().toBe<false>();

// Numeric index signatures remain numbers, while numeric template keys are strings.
expectTypeOf<IsNumericString<keyof Record<number, unknown>>>().toBe<false>();
expectTypeOf<IsNumericString<keyof Record<`${number}`, unknown>>>().toBe<true>();
expectTypeOf<IsNumericString<keyof Record<string, unknown>>>().toBe<false>();
expectTypeOf<IsNumericString<keyof {0: string; '1.5': string}>>().toBe<boolean>();

// Const type parameters preserve literal arguments for this predicate.
declare function classifyNumericString<Value>(value: Value): IsNumericString<Value>;
declare function classifyConstNumericString<const Value>(value: Value): IsNumericString<Value>;

expectTypeOf(classifyNumericString('42')).toBe<false>();
expectTypeOf(classifyConstNumericString('42')).toBe<true>();
expectTypeOf(classifyConstNumericString(' 42')).toBe<false>();
expectTypeOf(classifyConstNumericString('auto')).toBe<false>();
expectTypeOf(classifyConstNumericString(42)).toBe<false>();
expectTypeOf(classifyConstNumericString('42' as string)).toBe<false>();

// The documentation examples classify their exact inputs.
expectTypeOf<IsNumericString<'8080'>>().toBe<true>();
expectTypeOf<IsNumericString<'5e-3'>>().toBe<true>();
expectTypeOf<IsNumericString<' 8080 '>>().toBe<false>();
expectTypeOf<IsNumericString<8080>>().toBe<false>();

// Property selection preserves readonly fields and excludes uncertain or impossible values.
type Configuration = {
	readonly port: '8080';
	scale: '1e3';
	padded: ' 42';
	optional?: '42';
	mixed: '42' | 'auto';
	widened: string;
	count: number;
	unknown: unknown;
	untyped: any;
	impossible: never;
};
expectTypeOf<{
	[Key in keyof Configuration as IsNumericString<Configuration[Key]> extends true ? Key : never]: Configuration[Key];
}>().toBe<{readonly port: '8080'; scale: '1e3'}>();

// A direct conditional requires every result to be true; explicit distribution filters members.
type NumericStringMembers<Value> = Value extends unknown ? IsNumericString<Value> extends true ? Value : never : never;
expectTypeOf<IsNumericString<'42' | 'auto'> extends true ? number : string>().toBe<string>();
expectTypeOf<NumericStringMembers<'42' | 'auto' | ' 42' | 42>>().toBe<'42'>();
expectTypeOf<NumericStringMembers<'0x10' | '1e3' | '.5'>>().toBe<'0x10' | '1e3' | '.5'>();
expectTypeOf<NumericStringMembers<unknown>>().toBe<never>();
expectTypeOf<NumericStringMembers<any>>().toBe<never>();
expectTypeOf<NumericStringMembers<never>>().toBe<never>();
