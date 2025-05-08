import {expectType} from 'tsd';
import type {StringSlice} from '../index.d.ts';

expectType<StringSlice<'abcde'>>('abcde');
expectType<StringSlice<'abcde'>>('abcde');
expectType<StringSlice<'abcde', 0, -1>>('abcd');
expectType<StringSlice<'abcde', 1, -1>>('bcd');
expectType<StringSlice<'abcde', 1, 2>>('b');
expectType<StringSlice<'abcde', 1, 3>>('bc');
expectType<StringSlice<'abcde', -100, -1>>('abcd');
expectType<StringSlice<'abcde', -100, -3>>('ab');
expectType<StringSlice<'abcde', 3, 100>>('de');
expectType<StringSlice<'abcde', 1, 1>>('');
expectType<StringSlice<'abcde', 100, 1>>('');
expectType<StringSlice<string>>(null! as string);
expectType<StringSlice<string, 1>>(null! as string);
expectType<StringSlice<string, 1, 2>>(null! as string);
