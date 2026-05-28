import {expectAssignable, expectNotAssignable} from 'tsd';
import type {WordSeparators} from '../index.d.ts';

// Hyphens and underscores are word separators
expectAssignable<WordSeparators>('-');
expectAssignable<WordSeparators>('_');

// Whitespace is also a word separator
expectAssignable<WordSeparators>(' ');
expectAssignable<WordSeparators>('\t');
expectAssignable<WordSeparators>('\n');

// Other characters are not word separators
expectNotAssignable<WordSeparators>('a');
expectNotAssignable<WordSeparators>('.');

// WordSeparators can be used to split an identifier into words
type Split<S extends string> = S extends `${infer Head}${WordSeparators}${infer Tail}`
	? [Head, ...Split<Tail>]
	: [S];

expectAssignable<Split<'hello_world'>>(['hello', 'world'] as const);
expectAssignable<Split<'foo-bar-baz'>>(['foo', 'bar', 'baz'] as const);
expectAssignable<Split<'no separator'>>(['no', 'separator'] as const);
