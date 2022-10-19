import {expectTypeOf} from 'expect-type';
import type {UpperCaseCharacters, WordSeparators} from '../source/internal';
import type {SplitIncludingDelimiters, DelimiterCase} from '../source/delimiter-case';

const splitFromCamel: SplitIncludingDelimiters<'fooBar', WordSeparators | UpperCaseCharacters> = ['foo', 'B', 'ar'];
expectTypeOf(splitFromCamel).toEqualTypeOf<['foo', 'B', 'ar']>();
const splitFromComplexCamel: SplitIncludingDelimiters<'fooBarAbc123', WordSeparators | UpperCaseCharacters> = ['foo', 'B', 'ar', 'A', 'bc123'];
expectTypeOf(splitFromComplexCamel).toEqualTypeOf<['foo', 'B', 'ar', 'A', 'bc123']>();
const splitFromWordSeparators: SplitIncludingDelimiters<'foo-bar_car far', WordSeparators> = ['foo', '-', 'bar', '_', 'car', ' ', 'far'];
expectTypeOf(splitFromWordSeparators).toEqualTypeOf<['foo', '-', 'bar', '_', 'car', ' ', 'far']>();
const splitFromScreamingSnakeCase: SplitIncludingDelimiters<'FOO_BAR', WordSeparators | UpperCaseCharacters> = ['foo', '_', 'bar'];
expectTypeOf(splitFromScreamingSnakeCase).toEqualTypeOf<['foo', '_', 'bar']>();

// DelimiterCase
const delimiterFromCamel: DelimiterCase<'fooBar', '#'> = 'foo#bar';
expectTypeOf(delimiterFromCamel).toEqualTypeOf<'foo#bar'>();

const delimiterFromComplexCamel: DelimiterCase<'fooBarAbc123', '#'> = 'foo#bar#abc123';
expectTypeOf(delimiterFromComplexCamel).toEqualTypeOf<'foo#bar#abc123'>();

const delimiterFromPascal: DelimiterCase<'FooBar', '#'> = 'foo#bar';
expectTypeOf(delimiterFromPascal).toEqualTypeOf<'foo#bar'>();

const delimiterFromKebab: DelimiterCase<'foo-bar', '#'> = 'foo#bar';
expectTypeOf(delimiterFromKebab).toEqualTypeOf<'foo#bar'>();

const delimiterFromComplexKebab: DelimiterCase<'foo-bar-abc-123', '#'> = 'foo#bar#abc#123';
expectTypeOf(delimiterFromComplexKebab).toEqualTypeOf<'foo#bar#abc#123'>();

const delimiterFromSpace: DelimiterCase<'foo bar', '#'> = 'foo#bar';
expectTypeOf(delimiterFromSpace).toEqualTypeOf<'foo#bar'>();

const delimiterFromSnake: DelimiterCase<'foo_bar', '#'> = 'foo#bar';
expectTypeOf(delimiterFromSnake).toEqualTypeOf<'foo#bar'>();

const noDelimiterFromMono: DelimiterCase<'foobar', '#'> = 'foobar';
expectTypeOf(noDelimiterFromMono).toEqualTypeOf<'foobar'>();

const delimiterFromMixed: DelimiterCase<'foo-bar_abc xyzBarFoo', '#'> = 'foo#bar#abc#xyz#bar#foo';
expectTypeOf(delimiterFromMixed).toEqualTypeOf<'foo#bar#abc#xyz#bar#foo'>();

const delimiterFromVendorPrefixedCssProperty: DelimiterCase<'-webkit-animation', '#'> = '#webkit#animation';
expectTypeOf(delimiterFromVendorPrefixedCssProperty).toEqualTypeOf<'#webkit#animation'>();

const delimiterFromDoublePrefixedKebab: DelimiterCase<'--very-prefixed', '#'> = '##very#prefixed';
expectTypeOf(delimiterFromDoublePrefixedKebab).toEqualTypeOf<'##very#prefixed'>();

const delimiterFromRepeatedSeparators: DelimiterCase<'foo____bar', '#'> = 'foo####bar';
expectTypeOf(delimiterFromRepeatedSeparators).toEqualTypeOf<'foo####bar'>();

const delimiterFromString: DelimiterCase<string, '#'> = 'foobar';
expectTypeOf(delimiterFromString).toEqualTypeOf<string>();

const delimiterFromScreamingSnake: DelimiterCase<'FOO_BAR', '#'> = 'foo#bar';
expectTypeOf(delimiterFromScreamingSnake).toEqualTypeOf<'foo#bar'>();

// Verifying example
type OddCasedProperties<T> = {
	[K in keyof T as DelimiterCase<K, '#'>]: T[K]
};

type CliOptions = {
	dryRun: boolean;
	includeFile: string;
	foo: number;
};

expectTypeOf({
	'dry#run': true,
	'include#file': 'bar.js',
	foo: 123,
}).toMatchTypeOf<OddCasedProperties<CliOptions>>();
