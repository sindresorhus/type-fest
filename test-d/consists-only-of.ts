import {expectTypeOf} from 'nz';
import type {Alphanumeric, ConsistsOnlyOf, DigitCharacter, LowercaseLetter, Opaque, StringRepeat, Tagged, WhitespaceCharacter} from '../index.d.ts';

// Characters must belong to the allowed set, in any order and with repetitions.
expectTypeOf<ConsistsOnlyOf<'0123456789', DigitCharacter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'007', DigitCharacter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'1', DigitCharacter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'a12', DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'1a2', DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'12a', DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'-12', DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'+12', DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'12.3', DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'1e3', DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<' 12', DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'12\n', DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'１２', DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'abcxyz', LowercaseLetter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'aBa', LowercaseLetter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'User42', Alphanumeric>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'user_42', Alphanumeric>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'user_42', Alphanumeric | '_'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<' \t\r\n\u{A0}', WhitespaceCharacter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<' \u{200B}', WhitespaceCharacter>>().toBe<false>();

// A pattern must repeat completely, rather than merely contain allowed characters.
expectTypeOf<ConsistsOnlyOf<'aaa', 'a'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'ababab', 'ab'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'ab', 'ab'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'aba', 'ab'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'aabb', 'ab'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'baba', 'ab'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'a', 'ab'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'abc', 'a'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'aBa', 'a'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'foofoo', 'Foo'>>().toBe<false>();

// Pattern unions allow mixing members of different lengths.
expectTypeOf<ConsistsOnlyOf<'abba', 'a' | 'b'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'redbluebluered', 'red' | 'blue'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'redgreen', 'red' | 'blue'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'abxyzab', 'ab' | 'xyz'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abxy', 'ab' | 'xyz'>>().toBe<false>();

// Overlapping patterns match when at least one complete segmentation succeeds.
expectTypeOf<ConsistsOnlyOf<'ab', 'a' | 'ab'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'aab', 'a' | 'ab'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abab', 'a' | 'ab'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'aaa', 'a' | 'aa'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abc', 'a' | 'ab' | 'bc'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abc', 'a' | 'ab' | 'c'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'ababc', 'a' | 'ab' | 'bc'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abac', 'a' | 'ab' | 'bc'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'aaab', 'a' | 'aa'>>().toBe<false>();

// An empty pattern only constructs the empty string and must not recurse forever.
expectTypeOf<ConsistsOnlyOf<'', 'a'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'', ''>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'', DigitCharacter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abc', ''>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'' | 'abc', ''>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'aaa', '' | 'a'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abba', '' | 'a' | 'b'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abc', '' | 'a' | 'b'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'aab', '' | 'a' | 'ab'>>().toBe<true>();

// Input unions distribute: all matches return `true`, no matches return `false`, and mixed results return `boolean`.
expectTypeOf<ConsistsOnlyOf<'1' | '42', DigitCharacter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'x' | 'y', DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'1' | 'a', '1' | '2'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'' | '12', DigitCharacter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'' | 'abc', DigitCharacter>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'ab' | 'aab', 'a' | 'ab'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'ab' | 'ac', 'a' | 'ab'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<`${'a' | 'b'}${'a' | 'b'}`, 'a' | 'b'>>().toBe<true>();

// Spaces, escapes, and regular expression characters are literal tokens.
expectTypeOf<ConsistsOnlyOf<' \t\t ', ' ' | '\t'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'\r\n\r\n', '\r\n'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'\r\n\n', '\r\n'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'\0\0', '\0'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'.*.*', '.*'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'anything', '.*'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'[a]+[a]+', '[a]+'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'aaaa', '[a]+'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'\\\\', '\\'>>().toBe<true>();

// Unicode tokens match exactly, without case folding or normalization.
expectTypeOf<ConsistsOnlyOf<'你好你好', '你好'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'🦄🦄', '🦄'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'🦄🌈🦄', '🦄' | '🌈'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'👩‍💻👩‍💻', '👩‍💻'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'éé', 'é'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'e\u{301}e\u{301}', 'é'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'É', 'é'>>().toBe<false>();

// Unknown inputs and patterns cannot be validated statically.
expectTypeOf<ConsistsOnlyOf<string, 'a'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<`a${string}`, 'a'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<`b${string}`, 'a'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<`${number}`, DigitCharacter>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<Uppercase<string>, 'A'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'abc', string>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'abc', `a${string}`>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'123', `${number}`>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'abc', 'abc' | `${number}`>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<string, string>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<string, ''>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'', string>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'', any>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<any, 'a'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<any, ''>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'abc', any>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<any, any>>().toBe<boolean>();

// An empty input union has no results; an empty pattern union constructs only the empty string.
expectTypeOf<ConsistsOnlyOf<never, 'a'>>().toBe<never>();
expectTypeOf<ConsistsOnlyOf<never, ''>>().toBe<never>();
expectTypeOf<ConsistsOnlyOf<never, string>>().toBe<never>();
expectTypeOf<ConsistsOnlyOf<never, any>>().toBe<never>();
expectTypeOf<ConsistsOnlyOf<never, never>>().toBe<never>();
expectTypeOf<ConsistsOnlyOf<Tagged<never, 'Id'>, 'a'>>().toBe<never>();
expectTypeOf<ConsistsOnlyOf<Opaque<never, 'Id'>, 'a'>>().toBe<never>();
expectTypeOf<ConsistsOnlyOf<'abc', never>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'', never>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'' | 'abc', never>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<string, never>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<any, never>>().toBe<boolean>();

// Brands preserve the characters in both inputs and patterns.
expectTypeOf<ConsistsOnlyOf<Tagged<'123', 'Id'>, DigitCharacter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<Tagged<'12x', 'Id'>, DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'abab', Tagged<'ab', 'Token'>>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<Tagged<'aab', 'Text'>, Tagged<'a' | 'ab', 'Token'>>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<Tagged<'12' | 'x', 'Id'>, DigitCharacter>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<Tagged<'', 'Text'>, ''>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'aaa', Tagged<'' | 'a', 'Token'>>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<Tagged<string, 'Id'>, DigitCharacter>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'aaa', Tagged<string, 'Token'>>>().toBe<boolean>();

enum Token {
	A = 'a',
	Ab = 'ab',
}

expectTypeOf<ConsistsOnlyOf<Token.Ab, 'ab'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abab', Token.Ab>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'aab', Token>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<Token, 'ab'>>().toBe<boolean>();

// Keep the literal recursion in tail position for realistic long inputs.
expectTypeOf<ConsistsOnlyOf<StringRepeat<'1234567890', 50>, DigitCharacter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<`${StringRepeat<'ab', 200>}a`, 'ab'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<StringRepeat<'ab', 100>, 'a' | 'ab'>>().toBe<true>();

// Segmentation cannot rely on always choosing the longest or shortest available token.
expectTypeOf<ConsistsOnlyOf<'ababa', 'ab' | 'aba' | 'ba'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abababa', 'ab' | 'aba' | 'ba'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abaaba', 'ab' | 'aba' | 'ba'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'ababaa', 'ab' | 'aba' | 'ba'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'abac', 'ab' | 'aba' | 'ac'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abacabac', 'ab' | 'aba' | 'ac'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abacabaca', 'ab' | 'aba' | 'ac'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'a', 'aa' | 'aaa'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'aaaa', 'aa' | 'aaa'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'aaaaa', 'aa' | 'aaa'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'aaaaaaa', 'aa' | 'aaa'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'aaaaaaab', 'aa' | 'aaa'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'foobarfoo', 'foo' | 'foobar'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'foobarfoobar', 'foo' | 'foobar'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'foobarfoob', 'foo' | 'foobar'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'abcabc', 'abc' | 'abcabc' | 'abcabcabc'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abcab', 'abc' | 'abcabc' | 'abcabcabc'>>().toBe<false>();

// Finite template literal patterns form a set of complete tokens, including boolean spellings.
expectTypeOf<ConsistsOnlyOf<'truefalse', `${boolean}`>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'falsetruefalse', `${boolean}`>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'truth', `${boolean}`>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'truefals', `${boolean}`>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'10212011', `${1 | 2}${0 | 1}`>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'1022', `${1 | 2}${0 | 1}`>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'101', `${1 | 2}${0 | 1}`>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'GETPOSTGET', Uppercase<'get' | 'post'>>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'GetPOST', Uppercase<'get' | 'post'>>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'a-b_a_', `${'a' | 'b'}${'-' | '_'}`>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'a-b', `${'a' | 'b'}${'-' | '_'}`>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<`${boolean}${boolean}`, `${boolean}`>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<`${boolean}!`, `${boolean}`>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<`${'a' | 'ab'}${'ab' | 'b'}`, 'a' | 'ab' | 'b'>>().toBe<true>();

// Empty alternatives do not change whether a non-empty segmentation succeeds.
expectTypeOf<ConsistsOnlyOf<'abac', '' | 'ab' | 'aba' | 'ac'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abaca', '' | 'ab' | 'aba' | 'ac'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'abac', '' | 'ab' | Tagged<'aba', 'Token'> | 'ac'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abaca', '' | 'ab' | Tagged<'aba', 'Token'> | 'ac'>>().toBe<false>();

// An empty input accepts every pattern, including non-literal and `never` patterns.
expectTypeOf<ConsistsOnlyOf<'', Uppercase<string>>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'', `${bigint}`>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'', `token:${string}`>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'', Tagged<never, 'Token'>>>().toBe<true>();

// A `never` pattern is `false` for a non-empty literal input, even when branded.
expectTypeOf<ConsistsOnlyOf<'abc', Tagged<never, 'Token'>>>().toBe<false>();

// Conventional, opaque, and nested brands are metadata on the original characters.
type BrandedInput = '123' & {readonly __brand: 'Input'};
type BrandedPattern = 'ab' & {readonly __brand: 'Pattern'};
expectTypeOf<ConsistsOnlyOf<BrandedInput, DigitCharacter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<BrandedInput, '1' | '2'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'abab', BrandedPattern>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'aba', BrandedPattern>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<Opaque<'123', 'Id'>, DigitCharacter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<Opaque<'12x', 'Id'>, DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'abab', Opaque<'ab', 'Token'>>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'aba', Opaque<'ab', 'Token'>>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<Tagged<Tagged<'123', 'Id'>, 'Validated'>, DigitCharacter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abab', Tagged<Tagged<'ab', 'Token'>, 'Validated'>>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<Tagged<'123', 'Id'> | '42', DigitCharacter>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<Tagged<'123', 'Id'> | 'x', DigitCharacter>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<Tagged<'x', 'Id'> | 'y', DigitCharacter>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'aab', Tagged<'a', 'Token'> | 'ab'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abac', 'ab' | Tagged<'aba', 'Token'> | 'ac'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abaca', 'ab' | Tagged<'aba', 'Token'> | 'ac'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<Opaque<'', 'Text'>, Opaque<'', 'Token'>>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'a', Opaque<'', 'Token'>>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<Opaque<string, 'Text'>, 'a'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'a', Opaque<string, 'Token'>>>().toBe<boolean>();

enum OptionalToken {
	Empty = '',
	A = 'a',
	Ab = 'ab',
}

// An enum's empty member is ignored just like a plain empty alternative.
expectTypeOf<ConsistsOnlyOf<OptionalToken.Empty, never>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<OptionalToken, 'a' | 'ab'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<OptionalToken, 'ab'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'aab', OptionalToken>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'aba', OptionalToken>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abb', OptionalToken>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'ab', OptionalToken.Empty>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'', OptionalToken>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<Tagged<OptionalToken.Ab, 'Text'>, 'ab'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abab', Tagged<OptionalToken.Ab, 'Token'>>>().toBe<true>();

// Unicode and escape sequences are matched as written, including combining marks.
expectTypeOf<ConsistsOnlyOf<'e\u{301}e\u{301}', 'e\u{301}'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'éé', 'e\u{301}'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'e\u{301}', 'e' | '\u{301}'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'🦄🌈', '🦄🌈'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'🦄🌈🦄', '🦄🌈'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'İ', 'i'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'ßß', 'ss'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'\u{200B}\u{200B}', '\u{200B}'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'\t \t ', '\t '>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'\t  ', '\t '>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'\n\r', '\r\n'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'`value``value`', '`value`'>>().toBe<true>();

// Every infinite string form remains undecidable in either position.
expectTypeOf<ConsistsOnlyOf<Lowercase<string>, 'a'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<Capitalize<string>, 'A'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<Uncapitalize<string>, 'a'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<`${bigint}`, DigitCharacter>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<`${string}a`, 'a'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<`a${string}b`, 'ab'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'aaa', Lowercase<string>>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'A', Capitalize<string>>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'a', Uncapitalize<string>>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'123', `${bigint}`>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'a', `${string}a`>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'ab', `a${string}b`>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'a', 'a' | `${bigint}`>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'ab', '' | `a${string}`>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'ab' | `${number}`, 'ab'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<Tagged<`a${string}`, 'Text'>, 'a'>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'a', Tagged<`a${string}`, 'Token'>>>().toBe<boolean>();

// Generic consumers can infer the predicate from arguments and filter literal unions.
declare function consistsOnlyOf<const Value extends string, const Patterns extends readonly string[]>(value: Value, patterns: Patterns): ConsistsOnlyOf<Value, Patterns[number]>;
expectTypeOf(consistsOnlyOf('abab', ['ab'])).toBe<true>();
expectTypeOf(consistsOnlyOf('aba', ['ab'])).toBe<false>();
expectTypeOf(consistsOnlyOf('', ['ab'])).toBe<true>();
expectTypeOf(consistsOnlyOf('aab', ['a', 'ab'])).toBe<true>();
expectTypeOf(consistsOnlyOf('ab' as 'ab' | 'ac', ['ab'])).toBe<boolean>();
expectTypeOf(consistsOnlyOf('ab' as string, ['ab'])).toBe<boolean>();
expectTypeOf(consistsOnlyOf('ab', [] as string[])).toBe<boolean>();
expectTypeOf(consistsOnlyOf('', [])).toBe<true>();
expectTypeOf(consistsOnlyOf('ab', [])).toBe<false>();

type OnlyDigits<Value extends string> = Value extends unknown
	? ConsistsOnlyOf<Value, DigitCharacter> extends true ? Value : never
	: never;
expectTypeOf<OnlyDigits<'123' | 'abc' | '42' | '-1'>>().toBe<'123' | '42'>();
expectTypeOf<OnlyDigits<'' | '0' | '1.5'>>().toBe<'' | '0'>();
expectTypeOf<OnlyDigits<'abc' | 'def'>>().toBe<never>();
expectTypeOf<OnlyDigits<string>>().toBe<never>();
expectTypeOf<OnlyDigits<never>>().toBe<never>();
expectTypeOf<OnlyDigits<Tagged<'123', 'Id'> | Tagged<'x', 'Id'>>>().toBe<Tagged<'123', 'Id'>>();

// Check every binary string up to four characters against independently enumerated accepted values.
type BinaryCharacter = 'a' | 'b';
type BinaryPair = `${BinaryCharacter}${BinaryCharacter}`;
type BinaryText = '' | BinaryCharacter | BinaryPair | `${BinaryPair}${BinaryCharacter}` | `${BinaryPair}${BinaryPair}`;

type SegmentationResults<Pattern extends string> = {
	[Value in BinaryText]: ConsistsOnlyOf<Value, Pattern>;
};

type ExpectedResults<Accepted extends BinaryText> = {
	[Value in BinaryText]: Value extends Accepted ? true : false;
};

// An empty token set constructs only the empty string.
expectTypeOf<SegmentationResults<never>>().toBe<ExpectedResults<''>>();

// Empty tokens cannot advance through a non-empty input.
expectTypeOf<SegmentationResults<''>>().toBe<ExpectedResults<''>>();

// A single character must account for every character.
expectTypeOf<SegmentationResults<'a'>>().toBe<ExpectedResults<'' | 'a' | 'aa' | 'aaa' | 'aaaa'>>();
expectTypeOf<SegmentationResults<'b'>>().toBe<ExpectedResults<'' | 'b' | 'bb' | 'bbb' | 'bbbb'>>();

// A multi-character token must repeat in full.
expectTypeOf<SegmentationResults<'ab'>>().toBe<ExpectedResults<'' | 'ab' | 'abab'>>();
expectTypeOf<SegmentationResults<'ba'>>().toBe<ExpectedResults<'' | 'ba' | 'baba'>>();

// A complete character set accepts every input.
expectTypeOf<SegmentationResults<'a' | 'b'>>().toBe<ExpectedResults<BinaryText>>();

// Equal-character pairs accept only complete runs of pairs.
expectTypeOf<SegmentationResults<'aa' | 'bb'>>().toBe<ExpectedResults<'' | 'aa' | 'bb' | 'aaaa' | 'aabb' | 'bbaa' | 'bbbb'>>();

// Different pairs may alternate at token boundaries.
expectTypeOf<SegmentationResults<'ab' | 'ba'>>().toBe<ExpectedResults<'' | 'ab' | 'ba' | 'abab' | 'abba' | 'baab' | 'baba'>>();

// All two-character tokens accept exactly the even lengths.
expectTypeOf<SegmentationResults<'aa' | 'ab' | 'ba' | 'bb'>>().toBe<ExpectedResults<'' | BinaryPair | `${BinaryPair}${BinaryPair}`>>();

// Overlapping tokens require preserving both possible remainders.
expectTypeOf<SegmentationResults<'a' | 'ab'>>().toBe<ExpectedResults<'' | 'a' | 'aa' | 'ab' | 'aaa' | 'aab' | 'aba' | 'aaaa' | 'aaab' | 'aaba' | 'abaa' | 'abab'>>();
expectTypeOf<SegmentationResults<'a' | 'ba'>>().toBe<ExpectedResults<'' | 'a' | 'aa' | 'ba' | 'aaa' | 'aba' | 'baa' | 'aaaa' | 'aaba' | 'abaa' | 'baaa' | 'baba'>>();
expectTypeOf<SegmentationResults<'aa' | 'ab'>>().toBe<ExpectedResults<'' | 'aa' | 'ab' | 'aaaa' | 'aaab' | 'abaa' | 'abab'>>();

// Tokens with different lengths may appear in either order.
expectTypeOf<SegmentationResults<'a' | 'bb'>>().toBe<ExpectedResults<'' | 'a' | 'aa' | 'bb' | 'aaa' | 'abb' | 'bba' | 'aaaa' | 'aabb' | 'abba' | 'bbaa' | 'bbbb'>>();

// Shared prefixes do not make partial tokens valid.
expectTypeOf<SegmentationResults<'ab' | 'aba'>>().toBe<ExpectedResults<'' | 'ab' | 'aba' | 'abab'>>();
expectTypeOf<SegmentationResults<'aba' | 'bab'>>().toBe<ExpectedResults<'' | 'aba' | 'bab'>>();
expectTypeOf<SegmentationResults<'a' | 'abb'>>().toBe<ExpectedResults<'' | 'a' | 'aa' | 'aaa' | 'abb' | 'aaaa' | 'aabb' | 'abba'>>();

// Tokens can exceed the length of most candidate inputs.
expectTypeOf<SegmentationResults<'aaa' | 'aaaa'>>().toBe<ExpectedResults<'' | 'aaa' | 'aaaa'>>();

// An empty alternative leaves non-empty token matching unchanged.
expectTypeOf<SegmentationResults<'' | 'ab' | 'ba'>>().toBe<ExpectedResults<'' | 'ab' | 'ba' | 'abab' | 'abba' | 'baab' | 'baba'>>();

// Tokens longer than every non-empty candidate still accept the empty input.
expectTypeOf<SegmentationResults<'aaaaa' | 'bbbbb'>>().toBe<ExpectedResults<''>>();

// The result retains its boolean constraint for generic callers.
function _asBoolean<Value extends string, Pattern extends string>(result: ConsistsOnlyOf<Value, Pattern>): boolean {
	return result;
}

// @ts-expect-error The input must be a string.
type UnknownRepeatedString = ConsistsOnlyOf<unknown, ''>;
// @ts-expect-error The pattern must be a string.
type UnknownRepeatedPattern = ConsistsOnlyOf<'abc', unknown>;
// @ts-expect-error Numbers are not implicitly converted to strings.
type NumberInput = ConsistsOnlyOf<123, DigitCharacter>;
// @ts-expect-error Numbers are not implicitly converted to patterns.
type NumberPattern = ConsistsOnlyOf<'123', number>;
// @ts-expect-error Null is not a string.
type NullInput = ConsistsOnlyOf<null, 'a'>;
// @ts-expect-error Undefined is not a string.
type UndefinedPattern = ConsistsOnlyOf<'abc', undefined>;
// @ts-expect-error Every input union member must be a string.
type InvalidUnion = ConsistsOnlyOf<'abc' | 123, 'a'>;
