import {expectTypeOf} from 'nz';
import type {IsEqual, LiteralUnion, Opaque, StringRepeat, Tagged} from '../../index.d.ts';
import type {CasedString, ConsistsOnlyOf, IsNumeric, PositiveNumericStringGt, StartsWith, ToString, UnwrapPathBrand} from '../../source/internal/index.d.ts';

expectTypeOf<IsEqual<ToString<'a'>, 'a'>>().toBe<true>();
expectTypeOf<IsEqual<ToString<1>, '1'>>().toBe<true>();
expectTypeOf<IsEqual<ToString<-1>, '-1'>>().toBe<true>();
expectTypeOf<IsEqual<ToString<boolean>, never>>().toBe<true>();
expectTypeOf<IsEqual<ToString<'a' | 1>, 'a' | '1'>>().toBe<true>();
expectTypeOf<IsEqual<ToString<never>, never>>().toBe<true>();

expectTypeOf<IsEqual<StartsWith<'abcde', 'abc'>, true>>().toBe<true>();
expectTypeOf<IsEqual<StartsWith<'abcde', 'bc'>, false>>().toBe<true>();
expectTypeOf<IsEqual<StartsWith<'abcde', ''>, true>>().toBe<true>();
expectTypeOf<IsEqual<StartsWith<'abcde', 'abcde'>, true>>().toBe<true>();
expectTypeOf<IsEqual<StartsWith<'abcde', 'abcdef'>, false>>().toBe<true>();
expectTypeOf<IsEqual<StartsWith<'', ''>, true>>().toBe<true>();
expectTypeOf<IsEqual<StartsWith<'', 'a'>, false>>().toBe<true>();

// An unknown operand cannot be decided, so no boolean is claimed.
expectTypeOf<IsEqual<StartsWith<string, 'bc'>, never>>().toBe<true>();
expectTypeOf<IsEqual<StartsWith<'abcde', string>, never>>().toBe<true>();

// `IsNumeric` follows TypeScript's own lenient numeric-string rule, and then rejects anything that is padded with whitespace, so a bare hexadecimal form still counts.
expectTypeOf<IsEqual<IsNumeric<'1'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumeric<'-1.1'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumeric<'1e5'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumeric<'+1'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumeric<'.5'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumeric<'0x10'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumeric<'a'>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsNumeric<''>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsNumeric<' 1'>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsNumeric<'1 '>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsNumeric<'1_0'>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsNumeric<'Infinity'>, false>>().toBe<true>();

expectTypeOf<IsEqual<ConsistsOnlyOf<'', 'a'>, true>>().toBe<true>();
expectTypeOf<IsEqual<ConsistsOnlyOf<'aaa', 'a'>, true>>().toBe<true>();
expectTypeOf<IsEqual<ConsistsOnlyOf<'ababab', 'ab'>, true>>().toBe<true>();
expectTypeOf<IsEqual<ConsistsOnlyOf<'aBa', 'a'>, false>>().toBe<true>();
expectTypeOf<IsEqual<ConsistsOnlyOf<'abc', 'a'>, false>>().toBe<true>();

// A wide string cannot match the pattern, so it answers `false`, a mixed union answers `boolean`, and `never` spreads as usual.
expectTypeOf<IsEqual<ConsistsOnlyOf<string, 'a'>, false>>().toBe<true>();
expectTypeOf<IsEqual<ConsistsOnlyOf<'1' | 'a', '1' | '2'>, boolean>>().toBe<true>();
expectTypeOf<IsEqual<ConsistsOnlyOf<never, 'a'>, never>>().toBe<true>();

// A number in exponential notation is larger (`e+`) or smaller (`e-`) than any number in plain decimal notation, so only two exponential numbers are undecided.
expectTypeOf<IsEqual<PositiveNumericStringGt<'1e+21', '999'>, true>>().toBe<true>();
expectTypeOf<IsEqual<PositiveNumericStringGt<'999', '1e+21'>, false>>().toBe<true>();
expectTypeOf<IsEqual<PositiveNumericStringGt<'1e-7', '0'>, true>>().toBe<true>();
expectTypeOf<IsEqual<PositiveNumericStringGt<'0', '1e-7'>, false>>().toBe<true>();
expectTypeOf<IsEqual<PositiveNumericStringGt<'1e-7', '0.000001'>, false>>().toBe<true>();
expectTypeOf<IsEqual<PositiveNumericStringGt<'0.000001', '1e-7'>, true>>().toBe<true>();
expectTypeOf<IsEqual<PositiveNumericStringGt<'1e+21', '1e-7'>, true>>().toBe<true>();
expectTypeOf<IsEqual<PositiveNumericStringGt<'1e-7', '1e+21'>, false>>().toBe<true>();
expectTypeOf<IsEqual<PositiveNumericStringGt<'1e+21', '1e+21'>, false>>().toBe<true>();
expectTypeOf<IsEqual<PositiveNumericStringGt<'2e+21', '1e+21'>, boolean>>().toBe<true>();
expectTypeOf<IsEqual<PositiveNumericStringGt<'2e-7', '1e-7'>, boolean>>().toBe<true>();

// Path normalization strips metadata while keeping autocomplete alternatives distinct.
expectTypeOf<UnwrapPathBrand<Tagged<'users.0.name', 'Path'>>>().toBe<'users.0.name'>();
expectTypeOf<UnwrapPathBrand<Opaque<'users[0].name', 'Path'>>>().toBe<'users[0].name'>();
expectTypeOf<UnwrapPathBrand<Tagged<Tagged<1, 'Index'>, 'Validated'>>>().toBe<1>();
expectTypeOf<UnwrapPathBrand<'a.b' & {readonly __brand: unique symbol}>>().toBe<'a.b'>();
expectTypeOf<UnwrapPathBrand<Tagged<'a.b' | 'c', 'Path'>>>().toBe<'a.b' | 'c'>();
expectTypeOf<UnwrapPathBrand<LiteralUnion<'a.b', string>>>().toBe<LiteralUnion<'a.b', string>>();
expectTypeOf<UnwrapPathBrand<LiteralUnion<0, number>>>().toBe<LiteralUnion<0, number>>();
expectTypeOf<UnwrapPathBrand<string & {}>>().toBe<string & {}>();
expectTypeOf<UnwrapPathBrand<number & {}>>().toBe<number & {}>();
expectTypeOf<UnwrapPathBrand<Tagged<string, 'Path'>>>().toBe<string>();
expectTypeOf<UnwrapPathBrand<Tagged<number, 'Index'>>>().toBe<number>();
expectTypeOf<UnwrapPathBrand<any>>().toBe<any>();
expectTypeOf<UnwrapPathBrand<never>>().toBe<never>();
expectTypeOf<UnwrapPathBrand<unknown>>().toBe<unknown>();

// Integer lengths decide before digit values; equal lengths compare the first differing digit.
expectTypeOf<PositiveNumericStringGt<'100', '99'>>().toBe<true>();
expectTypeOf<PositiveNumericStringGt<'99', '100'>>().toBe<false>();
expectTypeOf<PositiveNumericStringGt<'12', '129'>>().toBe<false>();
expectTypeOf<PositiveNumericStringGt<'129', '12'>>().toBe<true>();
expectTypeOf<PositiveNumericStringGt<'987', '987'>>().toBe<false>();
expectTypeOf<PositiveNumericStringGt<'100001', '100000'>>().toBe<true>();
expectTypeOf<PositiveNumericStringGt<'299', '300'>>().toBe<false>();
expectTypeOf<PositiveNumericStringGt<'10.01', '9.99'>>().toBe<true>();
expectTypeOf<PositiveNumericStringGt<'9.99', '10.01'>>().toBe<false>();
expectTypeOf<PositiveNumericStringGt<'0.009', '0.01'>>().toBe<false>();

// Numeric text keeps all digits beyond JavaScript's integer precision.
expectTypeOf<PositiveNumericStringGt<'18446744073709551616', '18446744073709551615'>>().toBe<true>();
expectTypeOf<PositiveNumericStringGt<'10000000000000000000', '9999999999999999999'>>().toBe<true>();
type LongIntegerPrefix = StringRepeat<'1', 128>;
expectTypeOf<PositiveNumericStringGt<`${LongIntegerPrefix}2`, `${LongIntegerPrefix}1`>>().toBe<true>();
expectTypeOf<PositiveNumericStringGt<`${LongIntegerPrefix}1`, `${LongIntegerPrefix}2`>>().toBe<false>();
expectTypeOf<PositiveNumericStringGt<never, '1'>>().toBe<never>();
expectTypeOf<PositiveNumericStringGt<'1', never>>().toBe<never>();
// @ts-expect-error Numeric text must be a string.
type UnknownNumericText = PositiveNumericStringGt<unknown, '1'>;

function _numericTextResult<Left extends `${number}`, Right extends `${number}`>(result: PositiveNumericStringGt<Left, Right>): boolean {
	return result;
}

declare function compareNumericText<Left extends `${number}`, Right extends `${number}`>(left: Left, right: Right): PositiveNumericStringGt<Left, Right>;
expectTypeOf(compareNumericText('100', '99')).toBe<true>();
expectTypeOf(compareNumericText('1.05', '1.5')).toBe<false>();

// `CasedString` keeps a value that the transform leaves alone, and only that value.
expectTypeOf<CasedString<'foo-bar', 'foo-bar', '-'>>().toBe<'foo-bar'>();
expectTypeOf<CasedString<'fooBar', 'foo-bar', '-'>>().toBe<never>();
expectTypeOf<CasedString<'foo', 'foo', '_'>>().toBe<'foo'>();

// An empty string is rejected, even though the transform keeps it.
expectTypeOf<CasedString<'', '', '-'>>().toBe<never>();

// The allowed punctuation is the only punctuation the value may hold.
expectTypeOf<CasedString<'foo.bar', 'foo.bar', '-'>>().toBe<never>();
expectTypeOf<CasedString<'foo-bar', 'foo-bar', '_'>>().toBe<never>();
expectTypeOf<CasedString<'foo_bar', 'foo_bar', '_'>>().toBe<'foo_bar'>();
expectTypeOf<CasedString<'foo_bar', 'foo_bar', never>>().toBe<never>();

// One invalid member rejects the whole union.
expectTypeOf<CasedString<'foo-bar' | 'baz-qux', 'foo-bar' | 'baz-qux', '-'>>().toBe<'foo-bar' | 'baz-qux'>();
expectTypeOf<CasedString<'foo-bar' | 'foo.bar', 'foo-bar' | 'foo.bar', '-'>>().toBe<never>();
expectTypeOf<CasedString<'foo-bar' | 'bazQux', 'foo-bar' | 'baz-qux', '-'>>().toBe<never>();
expectTypeOf<CasedString<'foo-bar' | '', 'foo-bar', '-'>>().toBe<never>();

// A wide string, and a type that is not a literal, are rejected.
expectTypeOf<CasedString<string, string, '-'>>().toBe<never>();
expectTypeOf<CasedString<`${string}-${string}`, string, '-'>>().toBe<never>();
expectTypeOf<CasedString<any, any, '-'>>().toBe<never>();
expectTypeOf<CasedString<never, never, '-'>>().toBe<never>();

// A branded literal is compared by its primitive value, and the brand is kept.
expectTypeOf<CasedString<Tagged<'foo-bar', 'Brand'>, 'foo-bar', '-'>>().toBe<Tagged<'foo-bar', 'Brand'>>();
expectTypeOf<CasedString<Tagged<'foo.bar', 'Brand'>, 'foo.bar', '-'>>().toBe<never>();
expectTypeOf<CasedString<Tagged<'', 'Brand'>, '', '-'>>().toBe<never>();
expectTypeOf<CasedString<Tagged<'', 'Brand'> | 'foo-bar', 'foo-bar', '-'>>().toBe<never>();

// A string enum member is compared by its value, and the member is kept.
enum ClassName {
	Primary = 'foo-bar',
	Secondary = 'foo.bar',
}

expectTypeOf<CasedString<ClassName.Primary, 'foo-bar', '-'>>().toBe<ClassName.Primary>();
expectTypeOf<CasedString<ClassName.Secondary, 'foo.bar', '-'>>().toBe<never>();
