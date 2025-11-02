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

// Unions
// String is union
expectType<StringSlice<'abcd' | '0123456789'>>({} as 'abcd' | '0123456789');
expectType<StringSlice<'abcd' | '0123456789', 0, 2>>({} as 'ab' | '01');

// Start is union
expectType<StringSlice<'abcd', 1 | 3>>({} as 'bcd' | 'd');
expectType<StringSlice<'abcd', 0 | 2, 3>>({} as 'abc' | 'c');

// End is union
expectType<StringSlice<'abcd', 1, 2 | 3>>({} as 'b' | 'bc');

// String and start are unions
expectType<StringSlice<'abcd' | '0123456789', 1 | 2>>({} as 'bcd' | 'cd' | '123456789' | '23456789');

// String and end are unions
expectType<StringSlice<'abcd' | '0123456789', 1, 2 | 3>>({} as 'b' | 'bc' | '1' | '12');

// Start and end are unions
expectType<StringSlice<'abcd', 0 | 1, 2 | 3>>({} as 'ab' | 'abc' | 'b' | 'bc');

// String, start and end are unions
expectType<StringSlice<'abcd' | '0123456789', 0 | 1, 2 | 3>>(
	{} as 'ab' | 'abc' | 'b' | 'bc' | '01' | '012' | '1' | '12',
);
