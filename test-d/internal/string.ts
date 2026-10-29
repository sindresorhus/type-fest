import {expectTypeOf} from 'nz';
import type {IsEqual, LiteralUnion, Opaque, StringRepeat, Tagged} from '../../index.d.ts';
import type {CasedString, ConsistsOnlyOf, IsNumeric, PositiveNumericStringGt, StartsWith, ToPath, ToString, UnwrapPathBrand} from '../../source/internal/index.d.ts';

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

// Every ordered decimal-digit pair is compared, including equality.
type DecimalDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
type DigitComparisonRow<Left extends string, Right extends readonly string[] = DecimalDigits> = {
	[Index in keyof Right]: PositiveNumericStringGt<Left, Right[Index]>;
};
expectTypeOf<DigitComparisonRow<'0'>>().toBe<[false, false, false, false, false, false, false, false, false, false]>();
expectTypeOf<DigitComparisonRow<'1'>>().toBe<[true, false, false, false, false, false, false, false, false, false]>();
expectTypeOf<DigitComparisonRow<'2'>>().toBe<[true, true, false, false, false, false, false, false, false, false]>();
expectTypeOf<DigitComparisonRow<'3'>>().toBe<[true, true, true, false, false, false, false, false, false, false]>();
expectTypeOf<DigitComparisonRow<'4'>>().toBe<[true, true, true, true, false, false, false, false, false, false]>();
expectTypeOf<DigitComparisonRow<'5'>>().toBe<[true, true, true, true, true, false, false, false, false, false]>();
expectTypeOf<DigitComparisonRow<'6'>>().toBe<[true, true, true, true, true, true, false, false, false, false]>();
expectTypeOf<DigitComparisonRow<'7'>>().toBe<[true, true, true, true, true, true, true, false, false, false]>();
expectTypeOf<DigitComparisonRow<'8'>>().toBe<[true, true, true, true, true, true, true, true, false, false]>();
expectTypeOf<DigitComparisonRow<'9'>>().toBe<[true, true, true, true, true, true, true, true, true, false]>();

// Fractional digits still compare after a shared prefix, including equal neighboring values.
expectTypeOf<PositiveNumericStringGt<'120.00409', '120.00408'>>().toBe<true>();
expectTypeOf<PositiveNumericStringGt<'120.00408', '120.00409'>>().toBe<false>();
expectTypeOf<PositiveNumericStringGt<'120.00409', '120.00409'>>().toBe<false>();
expectTypeOf<PositiveNumericStringGt<'120.00409', '120.0041'>>().toBe<false>();

function _readLowerFractionDigit<Digit extends '1' | '2'>(comparison: PositiveNumericStringGt<`0.${Digit}`, '0.9'>): false {
	return comparison;
}

// Path tokenization keeps its segments and its established recursion budget.
expectTypeOf<ToPath<'users[0].profile.name'>>().toBe<['users', '0', 'profile', 'name']>();
expectTypeOf<ToPath<`${StringRepeat<'a.', 999>}z`>['length']>().toBe<1000>();
expectTypeOf<ToPath<`a${StringRepeat<'[0]', 998>}`>['length']>().toBe<999>();

function _readPathSegments<Path extends string>(segments: ToPath<Path>): string[] {
	return segments;
}

// An empty substring only constructs the empty string and must not recurse forever.
expectTypeOf<ConsistsOnlyOf<'', ''>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abc', ''>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'' | 'abc', ''>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<'aaa', '' | 'a'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abba', 'a' | 'b'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abba', '' | 'a' | 'b'>>().toBe<true>();
expectTypeOf<ConsistsOnlyOf<'abc', '' | 'a' | 'b'>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<any, ''>>().toBe<boolean>();
expectTypeOf<ConsistsOnlyOf<never, ''>>().toBe<never>();
expectTypeOf<ConsistsOnlyOf<'abc', never>>().toBe<false>();
expectTypeOf<ConsistsOnlyOf<'', never>>().toBe<true>();
// @ts-expect-error The input must be a string.
type UnknownRepeatedString = ConsistsOnlyOf<unknown, ''>;
// @ts-expect-error The repeated substring must be a string.
type UnknownRepeatedSubstring = ConsistsOnlyOf<'abc', unknown>;

// Mixed primitive and branded values are compared together while accepted identities remain intact.
expectTypeOf<CasedString<'foo-bar' | Tagged<'baz-qux', 'Text'>, 'foo-bar' | 'baz-qux', '-'>>()
	.toBe<'foo-bar' | Tagged<'baz-qux', 'Text'>>();
expectTypeOf<CasedString<Opaque<'foo-bar', 'Text'>, 'foo-bar', '-'>>().toBe<Opaque<'foo-bar', 'Text'>>();
expectTypeOf<CasedString<ClassName.Primary | Tagged<'baz-qux', 'Text'>, 'foo-bar' | 'baz-qux', '-'>>()
	.toBe<ClassName.Primary | Tagged<'baz-qux', 'Text'>>();
expectTypeOf<CasedString<'foo-bar' | Tagged<'baz.qux', 'Text'>, 'foo-bar' | 'baz.qux', '-'>>().toBe<never>();
// @ts-expect-error Only strings can be validated as cased text.
type UnknownCasedValue = CasedString<unknown, string, '-'>;

function _readCasedIdentity<Value extends string, Result extends string>(value: CasedString<Value, Result, '-'>): Value {
	return value;
}

// Each right-hand numeric alternative keeps its integer and fractional parts together.
expectTypeOf<PositiveNumericStringGt<'1.2', '1.1' | '2.0'>>().toBe<boolean>();
expectTypeOf<PositiveNumericStringGt<'2.1', '2' | '3'>>().toBe<boolean>();
expectTypeOf<PositiveNumericStringGt<'2.1', '1' | '2'>>().toBe<true>();
expectTypeOf<PositiveNumericStringGt<'1.5' | '2.1', '1.1' | '0.1'>>().toBe<true>();
expectTypeOf<PositiveNumericStringGt<'1.2', '1.3' | '2.0'>>().toBe<false>();

function _readLowerUnionFraction<Digit extends '1' | '2'>(value: PositiveNumericStringGt<`0.${Digit}`, '0.3' | '1'>): false {
	return value;
}

// An equal alternative does not erase another alternative that is strictly smaller.
expectTypeOf<PositiveNumericStringGt<'2', '1' | '2'>>().toBe<boolean>();
expectTypeOf<PositiveNumericStringGt<'1.2', '1.1' | '1.2'>>().toBe<boolean>();
expectTypeOf<PositiveNumericStringGt<'1' | '2', '1' | '2'>>().toBe<boolean>();
expectTypeOf<PositiveNumericStringGt<'1', '1' | '2'>>().toBe<false>();
expectTypeOf<PositiveNumericStringGt<'3', '1' | '2'>>().toBe<true>();

function _readEqualNumericUnion<Value extends '1' | '2'>(value: PositiveNumericStringGt<Value, Value>): false {
	// @ts-expect-error Independent alternatives of the same union can be strictly ordered.
	return value;
}

function _readUpperNumericUnion<Value extends '1' | '2'>(value: PositiveNumericStringGt<'3', Value>): true {
	return value;
}

// An empty right-hand choice leaves no comparison, including when the left side is dynamic.
expectTypeOf<PositiveNumericStringGt<any, never>>().toBe<never>();
expectTypeOf<PositiveNumericStringGt<never, any>>().toBe<never>();
expectTypeOf<PositiveNumericStringGt<any, '1'>>().toBe<boolean>();
expectTypeOf<PositiveNumericStringGt<'1', any>>().toBe<false>();
// @ts-expect-error The right operand must be numeric text.
type UnknownRightNumericText = PositiveNumericStringGt<'1', unknown>;

// A generic integer string must not make its fractional comparison a constant true.
function _readGenericIntegerFraction<Value extends `${bigint}`>(value: PositiveNumericStringGt<`0.${Value}`, Value>): true {
	// @ts-expect-error A valid integer such as '1' makes this comparison false.
	return value;
}

expectTypeOf<PositiveNumericStringGt<'0.1', '1'>>().toBe<false>();
