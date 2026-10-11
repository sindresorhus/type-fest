import {expectTypeOf} from 'nz';
import type {IsEqual} from '../../index.d.ts';
import type {IsNumeric, PositiveNumericStringGt, StartsWith, ToString} from '../../source/internal/index.d.ts';

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
