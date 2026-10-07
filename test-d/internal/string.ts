import {expectType} from 'tsd';
import type {IsEqual} from '../../index.d.ts';
import type {IsNumeric, PositiveNumericStringGt, StartsWith, ToString} from '../../source/internal/index.d.ts';

expectType<IsEqual<ToString<'a'>, 'a'>>(true);
expectType<IsEqual<ToString<1>, '1'>>(true);
expectType<IsEqual<ToString<-1>, '-1'>>(true);
expectType<IsEqual<ToString<boolean>, never>>(true);
expectType<IsEqual<ToString<'a' | 1>, 'a' | '1'>>(true);
expectType<IsEqual<ToString<never>, never>>(true);

expectType<IsEqual<StartsWith<'abcde', 'abc'>, true>>(true);
expectType<IsEqual<StartsWith<'abcde', 'bc'>, false>>(true);
expectType<IsEqual<StartsWith<'abcde', ''>, true>>(true);
expectType<IsEqual<StartsWith<'abcde', 'abcde'>, true>>(true);
expectType<IsEqual<StartsWith<'abcde', 'abcdef'>, false>>(true);
expectType<IsEqual<StartsWith<'', ''>, true>>(true);
expectType<IsEqual<StartsWith<'', 'a'>, false>>(true);

// An unknown operand cannot be decided, so no boolean is claimed.
expectType<IsEqual<StartsWith<string, 'bc'>, never>>(true);
expectType<IsEqual<StartsWith<'abcde', string>, never>>(true);

// `IsNumeric` follows TypeScript's own lenient numeric-string rule, and then rejects anything that is padded with whitespace, so a bare hexadecimal form still counts.
expectType<IsEqual<IsNumeric<'1'>, true>>(true);
expectType<IsEqual<IsNumeric<'-1.1'>, true>>(true);
expectType<IsEqual<IsNumeric<'1e5'>, true>>(true);
expectType<IsEqual<IsNumeric<'+1'>, true>>(true);
expectType<IsEqual<IsNumeric<'.5'>, true>>(true);
expectType<IsEqual<IsNumeric<'0x10'>, true>>(true);
expectType<IsEqual<IsNumeric<'a'>, false>>(true);
expectType<IsEqual<IsNumeric<''>, false>>(true);
expectType<IsEqual<IsNumeric<' 1'>, false>>(true);
expectType<IsEqual<IsNumeric<'1 '>, false>>(true);
expectType<IsEqual<IsNumeric<'1_0'>, false>>(true);
expectType<IsEqual<IsNumeric<'Infinity'>, false>>(true);

// A number in exponential notation is larger (`e+`) or smaller (`e-`) than any number in plain decimal notation, so only two exponential numbers are undecided.
expectType<IsEqual<PositiveNumericStringGt<'1e+21', '999'>, true>>(true);
expectType<IsEqual<PositiveNumericStringGt<'999', '1e+21'>, false>>(true);
expectType<IsEqual<PositiveNumericStringGt<'1e-7', '0'>, true>>(true);
expectType<IsEqual<PositiveNumericStringGt<'0', '1e-7'>, false>>(true);
expectType<IsEqual<PositiveNumericStringGt<'1e-7', '0.000001'>, false>>(true);
expectType<IsEqual<PositiveNumericStringGt<'0.000001', '1e-7'>, true>>(true);
expectType<IsEqual<PositiveNumericStringGt<'1e+21', '1e-7'>, true>>(true);
expectType<IsEqual<PositiveNumericStringGt<'1e-7', '1e+21'>, false>>(true);
expectType<IsEqual<PositiveNumericStringGt<'1e+21', '1e+21'>, false>>(true);
expectType<IsEqual<PositiveNumericStringGt<'2e+21', '1e+21'>, boolean>>(true);
expectType<IsEqual<PositiveNumericStringGt<'2e-7', '1e-7'>, boolean>>(true);
