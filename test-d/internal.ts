import {expectType} from 'tsd';
import type {IsWhitespace, IsNumeric} from '../source/internal';

expectType<IsWhitespace<''>>(false);
expectType<IsWhitespace<' '>>(true);
expectType<IsWhitespace<'\n'>>(true);
expectType<IsWhitespace<'\u0009'>>(true);

expectType<IsNumeric<''>>(false);
expectType<IsNumeric<'0'>>(true);
expectType<IsNumeric<'1'>>(true);
expectType<IsNumeric<'-1'>>(true);
expectType<IsNumeric<'123'>>(true);
expectType<IsNumeric<'1.23'>>(true);
expectType<IsNumeric<'123.456'>>(true);
expectType<IsNumeric<'1.23e4'>>(true);
expectType<IsNumeric<'1.23e-4'>>(true);
expectType<IsNumeric<' '>>(false);
expectType<IsNumeric<'\n'>>(false);
expectType<IsNumeric<'\u0009'>>(false);

