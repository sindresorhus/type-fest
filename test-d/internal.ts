import {expectType} from 'tsd';
import type {IsWhitespace, IsNumeric, IsNotFalse} from '../source/internal';

expectType<IsWhitespace<''>>(false);
expectType<IsWhitespace<' '>>(true);
expectType<IsWhitespace<'\n'>>(true);
expectType<IsWhitespace<'\u{9}'>>(true);
expectType<IsWhitespace<'a'>>(false);
expectType<IsWhitespace<'a '>>(false);
expectType<IsWhitespace<'   '>>(true);
expectType<IsWhitespace<' \t '>>(true);

expectType<IsNumeric<''>>(false);
expectType<IsNumeric<'0'>>(true);
expectType<IsNumeric<'1'>>(true);
expectType<IsNumeric<'-1'>>(true);
expectType<IsNumeric<'123'>>(true);
expectType<IsNumeric<'1e2'>>(true);
expectType<IsNumeric<'1.23'>>(true);
expectType<IsNumeric<'123.456'>>(true);
expectType<IsNumeric<'1.23e4'>>(true);
expectType<IsNumeric<'1.23e-4'>>(true);
expectType<IsNumeric<' '>>(false);
expectType<IsNumeric<'\n'>>(false);
expectType<IsNumeric<'\u{9}'>>(false);
expectType<IsNumeric<' 1.2'>>(false);
expectType<IsNumeric<'1 2'>>(false);
expectType<IsNumeric<'1_200'>>(false);
expectType<IsNumeric<' 1 '>>(false);

expectType<IsNotFalse<true>>(true);
expectType<IsNotFalse<boolean>>(true);
expectType<IsNotFalse<true | false>>(true);
expectType<IsNotFalse<true | false | false | false>>(true);
expectType<IsNotFalse<false>>(false);
expectType<IsNotFalse<false | false>>(false);
expectType<IsNotFalse<false | false | false | false>>(false);
