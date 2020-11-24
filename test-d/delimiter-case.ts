import {
	WordSeparators,
	UpperCaseChars,
	SplitIncludingDelimiters,
	DelimiterCase
} from '../source/delimiter-case';
import {expectType, expectAssignable} from 'tsd';

const splitFromCamel: SplitIncludingDelimiters<'fooBar', WordSeparators | UpperCaseChars> = ['foo', 'B', 'ar'];
expectType<['foo', 'B', 'ar']>(splitFromCamel);
const splitFromComplexCamel: SplitIncludingDelimiters<'fooBarAbc123', WordSeparators | UpperCaseChars> = ['foo', 'B', 'ar', 'A', 'bc123'];
expectType<['foo', 'B', 'ar', 'A', 'bc123']>(splitFromComplexCamel);
const splitFromWordSeparators: SplitIncludingDelimiters<'foo-bar_car far', WordSeparators> = ['foo', '-', 'bar', '_', 'car', ' ', 'far'];
expectType<['foo', '-', 'bar', '_', 'car', ' ', 'far']>(splitFromWordSeparators);

// DelimiterCase
const delimiterFromCamel: DelimiterCase<'fooBar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromCamel);

const delimiterFromComplexCamel: DelimiterCase<'fooBarAbc123', '#'> = 'foo#bar#abc123';
expectType<'foo#bar#abc123'>(delimiterFromComplexCamel);

const delimiterFromKebab: DelimiterCase<'foo-bar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromKebab);

const delimiterFromSpace: DelimiterCase<'foo bar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromSpace);

const delimiterFromSnake: DelimiterCase<'foo_bar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromSnake);

const noDelimiterFromMono: DelimiterCase<'foobar', '#'> = 'foobar';
expectType<'foobar'>(noDelimiterFromMono);

// Verifying example
type OddCasedProps<T> = {
	[K in keyof T as DelimiterCase<K, '#'>]: T[K]
};

interface CliOptions {
	dryRun: boolean;
	includeFile: string;
	foo: number;
}

expectAssignable<OddCasedProps<CliOptions>>({
	'dry#run': true,
	'include#file': 'bar.js',
	foo: 123
});
