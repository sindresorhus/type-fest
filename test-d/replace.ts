import {expectTypeOf} from 'nz';
import type {Replace, StringRepeat} from '../index.d.ts';

declare function replace<
	Input extends string,
	Search extends string,
	Replacement extends string,
>(
	input: Input,
	search: Search,
	replacement: Replacement,
): Replace<Input, Search, Replacement>;

declare function replaceAll<
	Input extends string,
	Search extends string,
	Replacement extends string,
>(
	input: Input,
	search: Search,
	replacement: Replacement,
): Replace<Input, Search, Replacement, {all: true}>;

expectTypeOf(replace('hello ?', '?', '🦄')).toBe<'hello 🦄'>();
expectTypeOf(replace('hello ??', '?', '❓')).toBe<'hello ❓?'>();
expectTypeOf(replaceAll('10:42:00', ':', '-')).toBe<'10-42-00'>();
expectTypeOf(replaceAll('__userName__', '__', '')).toBe<'userName'>();
expectTypeOf(replaceAll('My Cool Title', ' ', '')).toBe<'MyCoolTitle'>();
expectTypeOf(replaceAll('foobarfoobar', 'ob', 'b')).toBe<'fobarfobar'>();

// Widened inputs and searches do not guarantee a whole-input match.
declare const input: string;
declare const search: string;
expectTypeOf(replace(input, search, 'X')).toBe<string>();
expectTypeOf(replaceAll(input, search, 'X')).toBe<string>();
expectTypeOf(replace('abc', search, 'X')).toBe<string>();
expectTypeOf(replaceAll('abc', search, 'X')).toBe<string>();
expectTypeOf<Replace<never, string, 'X'>>().toBe<never>();

// Unions
expectTypeOf<Replace<'abcabc' | 'cbacba', 'a', ''>>().toBe<'bcabc' | 'cbcba'>();
expectTypeOf<Replace<'abcabc', 'a' | 'b', ''>>().toBe<'bcabc' | 'acabc'>();
expectTypeOf<Replace<'abcabc', 'a', '' | 'A'>>().toBe<'bcabc' | 'Abcabc'>();

expectTypeOf<Replace<'abcabc' | 'cbacba', 'a' | 'b', ''>>().toBe<'bcabc' | 'acabc' | 'cbcba' | 'cacba'>();
expectTypeOf<Replace<'abcabc' | 'cbacba', 'a', '' | 'A'>>().toBe<'bcabc' | 'Abcabc' | 'cbcba' | 'cbAcba'>();
expectTypeOf<Replace<'abcabc', 'a' | 'b', '' | 'A'>>().toBe<'bcabc' | 'Abcabc' | 'acabc' | 'aAcabc'>();

expectTypeOf<Replace<'abcabc' | 'cbacba', 'a' | 'b', '' | 'A'>>().toBe<'bcabc' | 'Abcabc' | 'acabc' | 'aAcabc' | 'cbcba' | 'cbAcba' | 'cacba' | 'cAacba'>();

expectTypeOf<Replace<'abcabc' | 'cbacba', 'a', '', {all: true}>>().toBe<'bcbc' | 'cbcb'>();
expectTypeOf<Replace<'abcabc', 'a' | 'b', '', {all: true}>>().toBe<'bcbc' | 'acac'>();
expectTypeOf<Replace<'abcabc', 'a', '' | 'A', {all: true}>>().toBe<'bcbc' | 'AbcAbc'>();

expectTypeOf<Replace<'abcabc' | 'cbacba', 'a' | 'b', '', {all: true}>>().toBe<'bcbc' | 'acac' | 'cbcb' | 'caca'>();
expectTypeOf<Replace<'abcabc' | 'cbacba', 'a', '' | 'A', {all: true}>>().toBe<'bcbc' | 'AbcAbc' | 'cbcb' | 'cbAcbA'>();
expectTypeOf<Replace<'abcabc', 'a' | 'b', '' | 'A', {all: true}>>().toBe<'bcbc' | 'AbcAbc' | 'acac' | 'aAcaAc'>();

expectTypeOf<Replace<'abcabc' | 'cbacba', 'a' | 'b', '' | 'A', {all: true}>>().toBe<'bcbc' | 'AbcAbc' | 'acac' | 'aAcaAc' | 'cbcb' | 'cbAcbA' | 'caca' | 'cAacAa'>();

// Recursion depth at which a non-tail recursive implementation starts to fail.
type FiftyZeroes = StringRepeat<'0', 50>;
type FiftyOnes = StringRepeat<'1', 50>;
expectTypeOf<Replace<FiftyZeroes, '0', '1', {all: true}>>().toBe<FiftyOnes>();

// Maximum allowed recursion depth for a tail recursive implementation.
type NineHundredNinetyNineZeroes = StringRepeat<'0', 999>;
type NineHundredNinetyNineOnes = StringRepeat<'1', 999>;
expectTypeOf<Replace<NineHundredNinetyNineZeroes, '0', '1', {all: true}>>().toBe<NineHundredNinetyNineOnes>();

// An empty `Search` is a zero-width match, so it matches at the start of the string first, the same way `String.prototype.replace()` does.
declare const prependOnce: Replace<'abc', '', '-'>;
expectTypeOf(prependOnce).toBe<'-abc'>();

declare const prependAll: Replace<'abc', '', '-', {all: true}>;
expectTypeOf(prependAll).toBe<'-a-b-c-'>();

declare const onlyWhenEmpty: Replace<'', '', 'X'>;
expectTypeOf(onlyWhenEmpty).toBe<'X'>();

// Known limitation: the replacement is inserted literally, so the substitution patterns that `String.prototype.replace()` expands are left as they are. See the docs.
declare const substitutesMatch: Replace<'abc', 'b', '$&'>;
expectTypeOf(substitutesMatch).toBe<'a$&c'>();

declare const leavesDollarAlone: Replace<'abc', 'b', 'a$b'>;
expectTypeOf(leavesDollarAlone).toBe<'aa$bc'>();

declare const leavesNonPattern: Replace<'abc', 'b', '$1'>;
expectTypeOf(leavesNonPattern).toBe<'a$1c'>();

// Replacing an empty search in an unknown string must not discard the unknown suffix.
expectTypeOf<Replace<string, '', '-', {all: true}>>().toBe<string>();
expectTypeOf<Replace<`prefix${string}`, '', '-', {all: true}>>().toBe<string>();
expectTypeOf<Replace<`${number}`, '', '-', {all: true}>>().toBe<string>();

// An impossible input stays impossible across the empty-search and ordinary-search branches.
expectTypeOf<Replace<never, '' | 'a', 'x', {all: true}>>().toBe<never>();

// A non-literal `Search` is matched at each position, since the pattern for a literal one infers an empty head and then fails to match the rest (https://github.com/sindresorhus/type-fest/issues/1506).
expectTypeOf<Replace<`foo.${number}.bar.${number}.foo`, `${number}`, '(0|[1-9][0-9]*)', {all: true}>>().toBe<'foo.(0|[1-9][0-9]*).bar.(0|[1-9][0-9]*).foo'>();
expectTypeOf<Replace<`foo${number}bar${number}`, `${number}`, '[0-9]'>>().toBe<`foo[0-9]bar${number}`>();
expectTypeOf<Replace<'fooBarBaz', Uppercase<string>, 'b'>>().toBe<'foobarBaz'>();
expectTypeOf<Replace<'fooBarBaz', Uppercase<string>, 'b', {all: true}>>().toBe<'foobarbaz'>();
expectTypeOf<Replace<'fooBarBaz', 'Baz' | Uppercase<string>, '_'>>().toBe<'fooBar_' | 'foo_arBaz'>();

// A lone whitespace character is not a match, even though TypeScript accepts it as a `${number}`.
expectTypeOf<Replace<`Page ${number} of ${number}`, `${number}`, 'X', {all: true}>>().toBe<'Page X of X'>();
expectTypeOf<Replace<`id ${number}`, `${number}`, 'N'>>().toBe<'id N'>();
expectTypeOf<Replace<'foo bar', `${number}`, 'N', {all: true}>>().toBe<'foo bar'>();

// A search that starts with whitespace still matches it.
expectTypeOf<Replace<`Page ${number} of`, ` ${number}`, '', {all: true}>>().toBe<'Page of'>();

// A placeholder that cannot be split is still a match at the end of the input.
expectTypeOf<Replace<`a${Uppercase<string>}`, Uppercase<string>, 'x'>>().toBe<'ax'>();

// Known limitation: numeric searches match individual digits in literal inputs, retaining signs and decimal points. See the docs.
expectTypeOf<Replace<'a12b', `${number}`, 'N', {all: true}>>().toBe<'aNNb'>();
expectTypeOf<Replace<'a-1b', `${number}`, 'N'>>().toBe<'a-Nb'>();
expectTypeOf<Replace<'a.5b', `${number}`, 'N'>>().toBe<'a.Nb'>();
expectTypeOf<Replace<'a-1b', `${bigint}`, 'N'>>().toBe<'a-Nb'>();
expectTypeOf<Replace<'a-12b', `${number}`, 'N', {all: true}>>().toBe<'a-NNb'>();

// A non-literal `Search` keeps the parts of the input that cannot be split into characters.
expectTypeOf<Replace<string, `${number}`, 'x', {all: true}>>().toBe<string>();
expectTypeOf<Replace<`${string}.${number}`, `${number}`, 'x', {all: true}>>().toBe<`${string}.x`>();
expectTypeOf<Replace<never, `${number}`, 'x', {all: true}>>().toBe<never>();

// A literal `Search` resolves in one step without `all`, so a long input does not reach the recursion limit.
type TwoThousandZeroes = StringRepeat<'0', 2000>;
expectTypeOf<Replace<`${TwoThousandZeroes}a`, 'a', 'b'>>().toBe<`${TwoThousandZeroes}b`>();
