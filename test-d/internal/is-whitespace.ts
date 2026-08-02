import {expectType} from 'tsd';
import type {IsWhitespace} from '../../source/internal/index.d.ts';

expectType<IsWhitespace<''>>(false);
expectType<IsWhitespace<' '>>(true);
expectType<IsWhitespace<'\n'>>(true);
expectType<IsWhitespace<'\u{9}'>>(true);
expectType<IsWhitespace<'a'>>(false);
expectType<IsWhitespace<'a '>>(false);
expectType<IsWhitespace<'   '>>(true);
expectType<IsWhitespace<' \t '>>(true);
