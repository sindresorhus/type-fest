import {
	WordSeparators,
	UpperCaseChars,
	SplitIncludingDelimiters,
	DelimiterCase,
	KebabCase,
	SnakeCase
} from '../source/delimitor-case';
import {expectType, expectAssignable} from 'tsd';

const splitFromCamel: SplitIncludingDelimiters<'fooBar', WordSeparators | UpperCaseChars> = ['foo', 'B', 'ar'];
expectType<['foo', 'B', 'ar']>(splitFromCamel);
const splitFromComplexCamel: SplitIncludingDelimiters<'fooBarAbc123', WordSeparators | UpperCaseChars> = ['foo', 'B', 'ar', 'A', 'bc123'];
expectType<['foo', 'B', 'ar', 'A', 'bc123']>(splitFromComplexCamel);
const splitFromWordSeparators: SplitIncludingDelimiters<'foo-bar_car far', WordSeparators> = ['foo', '-', 'bar', '_', 'car', ' ', 'far'];
expectType<['foo', '-', 'bar', '_', 'car', ' ', 'far']>(splitFromWordSeparators);

// DelimiterCase
const delimitorFromCamel: DelimiterCase<'fooBar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimitorFromCamel);

const delimitorFromComplexCamel: DelimiterCase<'fooBarAbc123', '#'> = 'foo#bar#abc123';
expectType<'foo#bar#abc123'>(delimitorFromComplexCamel);

const delimitorFromKebab: DelimiterCase<'foo-bar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimitorFromKebab);

const delimitorFromSpace: DelimiterCase<'foo bar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimitorFromSpace);

const delimitorFromSnake: DelimiterCase<'foo_bar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimitorFromSnake);

const noDelimiterFromMono: DelimiterCase<'foobar', '#'> = 'foobar';
expectType<'foobar'>(noDelimiterFromMono);

// KebabCase
const kebabFromCamel: KebabCase<'fooBar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromCamel);

const kebabFromKebab: KebabCase<'foo-bar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromKebab);

const kebabFromSpace: KebabCase<'foo bar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromSpace);

const kebabFromSnake: KebabCase<'foo_bar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromSnake);

const noKebabFromMono: KebabCase<'foobar'> = 'foobar';
expectType<'foobar'>(noKebabFromMono);

// SnakeCase
const snakeFromCamel: SnakeCase<'fooBar'> = 'foo_bar';
expectType<'foo_bar'>(snakeFromCamel);

const snakeFromKebab: SnakeCase<'foo-bar'> = 'foo_bar';
expectType<'foo_bar'>(snakeFromKebab);

const snakeFromSpace: SnakeCase<'foo bar'> = 'foo_bar';
expectType<'foo_bar'>(snakeFromSpace);

const snakeFromSnake: SnakeCase<'foo_bar'> = 'foo_bar';
expectType<'foo_bar'>(snakeFromSnake);

const noSnakeFromMono: SnakeCase<'foobar'> = 'foobar';
expectType<'foobar'>(noSnakeFromMono);

// Verifying example
type KebabCasedProps<T> = {
	[K in keyof T as DelimiterCase<K, '-'>]: T[K]
};

type AlternativeKebabCasedProps<T> = {
	[K in keyof T as KebabCase<K>]: T[K]
};

type SnakeCasedProps<T> = {
	[K in keyof T as SnakeCase<K>]: T[K]
};

interface CliOptions {
	dryRun: boolean;
	includeFile: string;
	foo: number;
}

expectAssignable<KebabCasedProps<CliOptions>>({
	'dry-run': true,
	'include-file': 'bar.js',
	foo: 123
});

expectAssignable<AlternativeKebabCasedProps<CliOptions>>({
	'dry-run': true,
	'include-file': 'bar.js',
	foo: 123
});

expectAssignable<SnakeCasedProps<CliOptions>>({
	dry_run: true,
	include_file: 'bar.js',
	foo: 123
});
