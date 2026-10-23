import {expectTypeOf} from 'nz';
import type {IsEqual, LiteralUnion, Opaque, Tagged} from '../../index.d.ts';
import type {ConsistsOnlyOf, IsNumeric, PositiveNumericStringGt, StartsWith, ToString, UnwrapPathBrand} from '../../source/internal/index.d.ts';

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
