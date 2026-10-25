import {expectTypeOf} from 'nz';
import type {Opaque, Replace, StringRepeat, Tagged} from '../index.d.ts';

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

// A non-literal `boolean` option resolves like the default, so only the first match is replaced.
expectTypeOf<Replace<'aa', 'a', 'x', {all: boolean}>>().toBe<'xa'>();

// Broad and invalid inputs also resolve with a non-literal `boolean` option.
expectTypeOf<Replace<string, 'a', 'x', {all: boolean}>>().toBe<string>();
expectTypeOf<Replace<never, 'a', 'x', {all: boolean}>>().toBe<never>();
expectTypeOf<Replace<'abc', any, 'x', {all: boolean}>>().toBe<string>();
// @ts-expect-error - Only strings can be searched.
type UnknownInput = Replace<unknown, 'a', 'x', {all: boolean}>;

// Brands do not change input characters or matching and replacement text.
expectTypeOf<Replace<'abc', Tagged<'b', 'Search'>, 'x'>>().toBe<'axc'>();
expectTypeOf<Replace<Tagged<'abc', 'Text'>, 'b', 'x'>>().toBe<'axc'>();
expectTypeOf<Replace<'abc', 'b', Tagged<'x', 'Replacement'>>>().toBe<'axc'>();
expectTypeOf<Replace<Opaque<'foofoo', 'Text'>, Opaque<'foo', 'Search'>, Opaque<'x', 'Replacement'>, {all: true}>>().toBe<'xx'>();
expectTypeOf<Replace<Tagged<'aa' | 'bb', 'Text'>, Tagged<'a' | 'b', 'Search'>, Tagged<'x' | 'y', 'Replacement'>, {all: true}>>().toBe<'xx' | 'yy' | 'aa' | 'bb'>();
expectTypeOf<Replace<Tagged<'aa' | 'bb', 'Text'>, Tagged<'a' | 'b', 'Search'>, Tagged<'x' | 'y', 'Replacement'>>>().toBe<'aa' | 'bb' | 'xa' | 'ya' | 'xb' | 'yb'>();
expectTypeOf<Replace<'abc', '', '', {all: true}>>().toBe<'abc'>();
expectTypeOf<Replace<Tagged<'ab', 'Text'>, Tagged<'', 'Search'>, Tagged<'-', 'Replacement'>, {all: true}>>().toBe<'-a-b-'>();
expectTypeOf<Replace<Tagged<'ab', 'Text'>, Tagged<'', 'Search'>, Tagged<'-', 'Replacement'>>>().toBe<'-ab'>();
expectTypeOf<Replace<Tagged<`id:${number}`, 'Text'>, Tagged<`${number}`, 'Search'>, Tagged<'N', 'Replacement'>>>().toBe<'id:N'>();
expectTypeOf<Replace<Tagged<'ab', 'Text'>, Tagged<string, 'Search'>, 'x'>>().toBe<string>();
expectTypeOf<Replace<Tagged<string, 'Text'>, 'a', 'x'>>().toBe<string>();
expectTypeOf<Replace<Tagged<'ab', 'Text'>, 'a', Tagged<string, 'Replacement'>>>().toBe<`${string}b`>();

expectTypeOf<Replace<Tagged<Tagged<'abc', 'First'>, 'Second'>, Tagged<Tagged<'b', 'First'>, 'Second'>, Tagged<Tagged<'x', 'First'>, 'Second'>>>().toBe<'axc'>();
expectTypeOf<Replace<'abc' & {readonly __brand: unique symbol}, 'b', 'x'>>().toBe<'axc'>();
expectTypeOf<Replace<Tagged<'', 'Text'>, Tagged<'', 'Search'>, Tagged<'x', 'Replacement'>, {all: true}>>().toBe<'x'>();
expectTypeOf<Replace<Tagged<'abab', 'Text'>, Tagged<'ab', 'Search'>, Tagged<'', 'Replacement'>, {all: true}>>().toBe<''>();
expectTypeOf<Replace<Tagged<'abc', 'Text'>, Tagged<'z', 'Search'>, 'x'>>().toBe<'abc'>();
expectTypeOf<Replace<never, Tagged<'a', 'Search'>, 'x'>>().toBe<never>();
expectTypeOf<Replace<'abc', never, Tagged<'x', 'Replacement'>>>().toBe<never>();
expectTypeOf<Replace<Tagged<'abc', 'Text'>, 'b', never>>().toBe<never>();
expectTypeOf<Replace<Tagged<'abc', 'Text'>, any, 'x'>>().toBe<string>();
// @ts-expect-error
expectTypeOf<Replace<'abc', unknown, 'x'>>();
// @ts-expect-error
expectTypeOf<Replace<'abc', 'b', unknown>>();

// A partially known input can contain an earlier match or lose its casing constraint.
expectTypeOf<'file.js.ts'>().toBeAssignableTo<Replace<`${string}.ts`, '.ts', '.js'>>();
expectTypeOf<'bBC'>().toBeAssignableTo<Replace<Uppercase<string>, 'A', 'b'>>();
expectTypeOf<'bBC'>().toBeAssignableTo<Replace<Uppercase<string>, 'A', 'b', {all: true}>>();

// Unknown input parts may hold additional matches, even for all-match and non-literal options.
expectTypeOf<Replace<`${string}.ts`, '.ts', '.js'>>().toBe<string>();
expectTypeOf<Replace<`${string}.ts`, '.ts', '.js', {all: true}>>().toBe<string>();
expectTypeOf<Replace<`${string}.ts`, '.ts', '.js', {all: boolean}>>().toBe<string>();
expectTypeOf<Replace<`${string}.ts`, '.ts', '.js', {all: false} | {all: true}>>().toBe<string>();
expectTypeOf<Replace<Lowercase<string>, 'a', 'A'>>().toBe<string>();
expectTypeOf<Replace<Capitalize<string>, 'A', 'a'>>().toBe<string>();
expectTypeOf<Replace<`${number}`, '1', 'x'>>().toBe<string>();
expectTypeOf<Replace<`prefix${string}`, 'prefix', 'changed'>>().toBe<string>();
expectTypeOf<Replace<'file.ts' | `${string}.ts`, '.ts', '.js'>>().toBe<string>();
expectTypeOf<Replace<Tagged<`${string}.ts`, 'Filename'>, '.ts', '.js'>>().toBe<string>();
expectTypeOf<Replace<Opaque<Uppercase<string>, 'UppercaseText'>, 'A', 'b', {all: true}>>().toBe<string>();
expectTypeOf<Replace<Tagged<`prefix${string}`, 'Text'>, Tagged<'prefix', 'Search'>, Tagged<'changed', 'Replacement'>>>().toBe<string>();

// Exact literals and placeholder searches still use their dedicated matchers.
expectTypeOf<Replace<'file.ts.ts', '.ts', '.js'>>().toBe<'file.js.ts'>();
expectTypeOf<Replace<'file.ts.ts', '.ts', '.js', {all: true}>>().toBe<'file.js.js'>();
expectTypeOf<Replace<'ABC', 'A', 'b'>>().toBe<'bBC'>();
expectTypeOf<Replace<'123', '1', 'x'>>().toBe<'x23'>();
expectTypeOf<Replace<`item.${number}`, `${number}`, 'id'>>().toBe<'item.id'>();
expectTypeOf<Replace<Uppercase<string>, '', 'prefix:'>>().toBe<`prefix:${Uppercase<string>}`>();
expectTypeOf<Replace<Uppercase<string>, '', 'prefix:', {all: true}>>().toBe<string>();
expectTypeOf<Replace<'abc', 'b', `${number}`>>().toBe<`a${number}c`>();

// Impossible inputs or operands remain impossible, rather than taking a wide-input fallback.
expectTypeOf<Replace<never, 'a', 'x'>>().toBe<never>();
expectTypeOf<Replace<never, 'a', 'x', {all: true}>>().toBe<never>();
expectTypeOf<Replace<Uppercase<string>, never, 'x'>>().toBe<never>();
expectTypeOf<Replace<Uppercase<string>, 'A', never>>().toBe<never>();
expectTypeOf<Replace<any, 'A', 'b'>>().toBe<string>();
expectTypeOf<Replace<Uppercase<string>, 'A', 'b', never>>().toBe<string>();
// @ts-expect-error Unknown inputs do not satisfy the string constraint.
type UnknownPartialInput = Replace<unknown, 'A', 'b'>;

declare const filename: `${string}.ts`;
expectTypeOf(replace(filename, '.ts', '.js')).toBe<string>();
expectTypeOf(replaceAll(filename, '.ts', '.js')).toBe<string>();

// Generic input and options retain their supported return constraints and reductions.
function _stringResult<Input extends string, Search extends string, Replacement extends string, Options extends {all?: boolean}>(value: Replace<Input, Search, Replacement, Options>): string {
	return value;
}

function _unchangedWithOptions<Options extends {all?: boolean}>(value: Replace<'abc', 'z', 'x', Options>): 'abc' {
	return value;
}

function _singleMatchWithOptions<Options extends {all?: boolean}>(value: Replace<'abc', 'b', 'x', Options>): 'axc' {
	return value;
}

function _neverSearch<Input extends string, Options extends {all?: boolean}>(value: Replace<Input, never, 'x', Options>): never {
	return value;
}

// A match consumes its characters once, even when occurrences overlap or the replacement is another match.
expectTypeOf<Replace<'aaaaa', 'aa', 'a', {all: true}>>().toBe<'aaa'>();
expectTypeOf<Replace<'aaaaaa', 'aa', 'a', {all: true}>>().toBe<'aaa'>();
expectTypeOf<Replace<'aaaaaaaa', 'aa', 'a', {all: true}>>().toBe<'aaaa'>();
expectTypeOf<Replace<'aaaaa', 'aa', 'X', {all: true}>>().toBe<'XXa'>();

declare function normalizeRoutes<const Routes extends readonly string[]>(routes: Routes): {readonly [Key in keyof Routes]: Replace<Routes[Key], '/', '.', {all: true}>};
const normalizedRoutes = normalizeRoutes(['api/v1/users/session', 'api/v1/users/settings']);
expectTypeOf(normalizedRoutes).toBe<readonly ['api.v1.users.session', 'api.v1.users.settings']>();

function _constructUnmatchedRoute<Options extends {all?: boolean}>(): Replace<'api.users', '/', '.', Options> {
	return 'api.users';
}

function _holdReplacedRoute<Input extends string>(result: Replace<Input, '/', '.', {all: true}>): {readonly result: Replace<Input, '/', '.', {all: true}>} {
	return {result};
}

// Pair traversal handles even and odd match counts beyond the former single-step recursion budget.
type FifteenHundredZeroes = StringRepeat<'0', 1500>;
type FifteenHundredOnes = StringRepeat<'1', 1500>;
expectTypeOf<Replace<FifteenHundredZeroes, '0', '1', {all: true}>>().toBe<FifteenHundredOnes>();
expectTypeOf<Replace<`${FifteenHundredZeroes}X0`, '0', '1', {all: true}>>().toBe<`${FifteenHundredOnes}X1`>();

// Line-ending normalization consumes CRLF as one match and leaves existing LF endings intact.
expectTypeOf<Replace<'first\r\nsecond\nthird\r\n', '\r\n', '\n'>>().toBe<'first\nsecond\nthird\r\n'>();
expectTypeOf<Replace<'first\r\nsecond\nthird\r\n', '\r\n', '\n', {all: true}>>().toBe<'first\nsecond\nthird\n'>();
expectTypeOf<Replace<'first\rsecond\n', '\r\n', '\n', {all: true}>>().toBe<'first\rsecond\n'>();
expectTypeOf<Replace<'\r\n\r\n', '\r\n', '', {all: true}>>().toBe<''>();

// Normalized searches retain enum alternatives and match template placeholders without branding the result.
enum SearchSeparator {
	Dash = '-',
	Underscore = '_',
}
expectTypeOf<Replace<Tagged<'a-b_c', 'Text'>, SearchSeparator, Tagged<'/', 'Replacement'>, {all: true}>>()
	.toBe<'a/b_c' | 'a-b/c'>();
expectTypeOf<Replace<Tagged<`id:${number}-old`, 'Text'>, Tagged<`${number}`, 'Search'>, 'value'>>()
	.toBe<'id:value-old'>();

function _readReplacedNumericTemplate<Value extends number>(value: Replace<`${Value}`, '0', 'x'>): string {
	return value;
}
