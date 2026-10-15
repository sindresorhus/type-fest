import {expectTypeOf} from 'nz';
import type {DelimiterCase} from '../source/delimiter-case.d.ts';

// DelimiterCase
const delimiterFromCamel: DelimiterCase<'fooBar', '#'> = 'foo#bar';
expectTypeOf(delimiterFromCamel).toBe<'foo#bar'>();

const delimiterFromComplexCamel: DelimiterCase<'fooBarAbc123', '#'> = 'foo#bar#abc123';
expectTypeOf(delimiterFromComplexCamel).toBe<'foo#bar#abc123'>();

const delimiterFromComplexCamelSplitOnNumbers: DelimiterCase<
	'fooBarAbc123',
	'#',
	{splitOnNumbers: true}
> = 'foo#bar#abc#123';
expectTypeOf(delimiterFromComplexCamelSplitOnNumbers).toBe<'foo#bar#abc#123'>();

const delimiterFromComplexCamelNoSplitOnNumbers: DelimiterCase<'fooBarAbc123', '#'> = 'foo#bar#abc123';
expectTypeOf(delimiterFromComplexCamelNoSplitOnNumbers).toBe<'foo#bar#abc123'>();

const delimiterNumberInTheMiddle: DelimiterCase<'p2pNetwork', '#', {splitOnNumbers: true}> = 'p#2#p#network';
expectTypeOf(delimiterNumberInTheMiddle).toBe<'p#2#p#network'>();

const delimiterNumberInTheMiddleNoSplitOnNumbers: DelimiterCase<'p2pNetwork', '#'> = 'p2p#network';
expectTypeOf(delimiterNumberInTheMiddleNoSplitOnNumbers).toBe<'p2p#network'>();

const delimiterFromPascal: DelimiterCase<'FooBar', '#'> = 'foo#bar';
expectTypeOf(delimiterFromPascal).toBe<'foo#bar'>();

const delimiterFromKebab: DelimiterCase<'foo-bar', '#'> = 'foo#bar';
expectTypeOf(delimiterFromKebab).toBe<'foo#bar'>();

const delimiterFromComplexKebab: DelimiterCase<'foo-bar-abc-123', '#'> =
	'foo#bar#abc#123';
expectTypeOf(delimiterFromComplexKebab).toBe<'foo#bar#abc#123'>();

const delimiterFromSpace: DelimiterCase<'foo bar', '#'> = 'foo#bar';
expectTypeOf(delimiterFromSpace).toBe<'foo#bar'>();

const delimiterFromTab: DelimiterCase<'foo\tbar', '#'> = 'foo#bar';
expectTypeOf(delimiterFromTab).toBe<'foo#bar'>();

const delimiterFromSnake: DelimiterCase<'foo_bar', '#'> = 'foo#bar';
expectTypeOf(delimiterFromSnake).toBe<'foo#bar'>();

const noDelimiterFromMono: DelimiterCase<'foobar', '#'> = 'foobar';
expectTypeOf(noDelimiterFromMono).toBe<'foobar'>();

const delimiterFromMixed: DelimiterCase<'foo-bar_abc xyzBarFoo', '#'> =
	'foo#bar#abc#xyz#bar#foo';
expectTypeOf(delimiterFromMixed).toBe<'foo#bar#abc#xyz#bar#foo'>();

const delimiterFromVendorPrefixedCssProperty: DelimiterCase<
	'-webkit-animation',
	'#'
> = 'webkit#animation';
expectTypeOf(delimiterFromVendorPrefixedCssProperty).toBe<'webkit#animation'>();

const delimiterFromDoublePrefixedKebab: DelimiterCase<'--very-prefixed', '#'> =
	'very#prefixed';
expectTypeOf(delimiterFromDoublePrefixedKebab).toBe<'very#prefixed'>();

const delimiterFromRepeatedSeparators: DelimiterCase<'foo____bar', '#'> =
	'foo#bar';
expectTypeOf(delimiterFromRepeatedSeparators).toBe<'foo#bar'>();

const delimiterFromString: DelimiterCase<string, '#'> = 'foobar';
expectTypeOf(delimiterFromString).toBe<string>();

const delimiterFromScreamingSnake: DelimiterCase<'FOO_BAR', '#'> = 'foo#bar';
expectTypeOf(delimiterFromScreamingSnake).toBe<'foo#bar'>();

const delimiterFromSeparatorBeforeCapital: DelimiterCase<'Foo Bar_Baz-Qux', '#'> = 'foo#bar#baz#qux';
expectTypeOf(delimiterFromSeparatorBeforeCapital).toBe<'foo#bar#baz#qux'>();

const delimiterFromMixed2: DelimiterCase<'parseHTML', '#'> = 'parse#html';
expectTypeOf(delimiterFromMixed2).toBe<'parse#html'>();

const delimiterFromMixed3: DelimiterCase<'parseHTMLItem', '#'> =
	'parse#html#item';
expectTypeOf(delimiterFromMixed3).toBe<'parse#html#item'>();

const delimiterFromNumberInTheMiddleSplitOnNumbers: DelimiterCase<'foo2bar', '#', {splitOnNumbers: true}> = 'foo#2#bar';
expectTypeOf(delimiterFromNumberInTheMiddleSplitOnNumbers).toBe<'foo#2#bar'>();

const delimiterFromNumberInTheMiddleSplitOnNumbersEdgeCase: DelimiterCase<'foO2Bar', '#', {splitOnNumbers: true}> = 'fo#o#2#bar';
expectTypeOf(delimiterFromNumberInTheMiddleSplitOnNumbersEdgeCase).toBe<'fo#o#2#bar'>();

const delimiterFromNumberInTheMiddleSplitOnNumbersEdgeCase2: DelimiterCase<'foO2bar', '#', {splitOnNumbers: true}> = 'fo#o#2#bar';
expectTypeOf(delimiterFromNumberInTheMiddleSplitOnNumbersEdgeCase2).toBe<'fo#o#2#bar'>();

const delimiterFromNumberInTheMiddleNoSplitOnNumbers: DelimiterCase<'foo2bar', '#'> = 'foo2bar';
expectTypeOf(delimiterFromNumberInTheMiddleNoSplitOnNumbers).toBe<'foo2bar'>();

const delimiterFromNumberInTheMiddleNoSplitOnNumbersEdgeCase: DelimiterCase<'foo2Bar', '#'> = 'foo2#bar';
expectTypeOf(delimiterFromNumberInTheMiddleNoSplitOnNumbersEdgeCase).toBe<'foo2#bar'>();

const delimiterFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2: DelimiterCase<'foO2bar', '#'> = 'fo#o2bar';
expectTypeOf(delimiterFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2).toBe<'fo#o2bar'>();

const delimiterFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3: DelimiterCase<'FOO22Bar', '#'> = 'foo22#bar';
expectTypeOf(
	delimiterFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3,
).toBe<'foo22#bar'>();

declare const unionValue: DelimiterCase<'fooBar' | 'barBaz', '#'>;
expectTypeOf(unionValue).toBe<'foo#bar' | 'bar#baz'>();

declare const unionDelimiter: DelimiterCase<'fooBarBaz', '#' | '$'>;
expectTypeOf(unionDelimiter).toBe<'foo#bar#baz' | 'foo$bar$baz'>();

declare const unionValueAndDelimiter: DelimiterCase<'fooBarBaz' | 'barBazFoo', '#' | '$'>;
expectTypeOf(unionValueAndDelimiter).toBe<'foo#bar#baz' | 'bar#baz#foo' | 'foo$bar$baz' | 'bar$baz$foo'>();

const stringPart: DelimiterCase<`foo${string}`, '#'> = 'fooSomeString';
expectTypeOf(stringPart).toBe<`foo${string}`>();

declare const withPunctuation: DelimiterCase<'onDialog:close', '#'>;
expectTypeOf(withPunctuation).toBe<'on#dialog:close'>();

declare const withPunctuationAndSplit: DelimiterCase<'onDialog:close', '#', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationAndSplit).toBe<'on#dialog#close'>();

declare const withPunctuation2: DelimiterCase<'foo-bar>>baz', '#'>;
expectTypeOf(withPunctuation2).toBe<'foo#bar>>baz'>();

declare const withPunctuationAndSplit2: DelimiterCase<'foo-bar>>baz', '#', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationAndSplit2).toBe<'foo#bar#baz'>();

declare const withPunctuation3: DelimiterCase<'card::after', '#'>;
expectTypeOf(withPunctuation3).toBe<'card::after'>();

declare const withPunctuationAndSplit3: DelimiterCase<'card::after', '#', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationAndSplit3).toBe<'card#after'>();

declare const withPunctuation4: DelimiterCase<'div.card::after', '#'>;
expectTypeOf(withPunctuation4).toBe<'div.card::after'>();

declare const withPunctuationAndSplit4: DelimiterCase<'div.card::after', '#', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationAndSplit4).toBe<'div#card#after'>();

declare const withPunctuationAndNumber: DelimiterCase<'foo-bar::01', '#'>;
expectTypeOf(withPunctuationAndNumber).toBe<'foo#bar::01'>();

declare const withPunctuationAndNumber2: DelimiterCase<'foo-bar::01', '#', {splitOnNumbers: true}>;
expectTypeOf(withPunctuationAndNumber2).toBe<'foo#bar::01'>();

declare const withPunctuationSplitAndNumber: DelimiterCase<'foo-bar::01', '#', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplitAndNumber).toBe<'foo#bar#01'>();

declare const withPunctuationSplitAndNumberSplit: DelimiterCase<'foo-bar::01', '#', {splitOnPunctuation: true; splitOnNumbers: true}>;
expectTypeOf(withPunctuationSplitAndNumberSplit).toBe<'foo#bar#01'>();

declare const startsWithPunctuation: DelimiterCase<'^fooBarBaz', ':'>;
expectTypeOf(startsWithPunctuation).toBe<'^foo:bar:baz'>();

declare const startsWithPunctuationSameAsDelimiter: DelimiterCase<'#fooBarBaz', '#'>;
expectTypeOf(startsWithPunctuationSameAsDelimiter).toBe<'#foo#bar#baz'>();

declare const emptyStringDelimiter: DelimiterCase<'fooBarBaz', ''>;
expectTypeOf(emptyStringDelimiter).toBe<'foobarbaz'>();

declare const moreThanOneLengthDelimiter: DelimiterCase<'fooBarBaz', '__'>;
expectTypeOf(moreThanOneLengthDelimiter).toBe<'foo__bar__baz'>();

declare const moreThanOneLengthDelimiter1: DelimiterCase<'fooBarBaz', '-->'>;
expectTypeOf(moreThanOneLengthDelimiter1).toBe<'foo-->bar-->baz'>();

declare const anyValue: DelimiterCase<any, '#'>;
expectTypeOf(anyValue).toBe<any>();

declare const anyValue1: DelimiterCase<any, any>;
expectTypeOf(anyValue1).toBe<any>();

declare const anyValue2: DelimiterCase<any, never>;
expectTypeOf(anyValue2).toBe<any>();

declare const neverValue: DelimiterCase<never, '#'>;
expectTypeOf(neverValue).toBe<never>();

declare const neverValue1: DelimiterCase<never, any>;
expectTypeOf(neverValue1).toBe<never>();

declare const neverValue2: DelimiterCase<never, never>;
expectTypeOf(neverValue2).toBe<never>();

declare const anyDelimiter: DelimiterCase<'fooBar', any>;
expectTypeOf(anyDelimiter).toBe<`foo${Lowercase<any>}bar`>();

declare const neverDelimiter: DelimiterCase<'fooBar', never>;
expectTypeOf(neverDelimiter).toBe<never>();

// Verifying example
type OddCasedProperties<T> = {
	[K in keyof T as DelimiterCase<K, '#'>]: T[K];
};

type CliOptions = {
	dryRun: boolean;
	includeFile: string;
	foo: number;
};

({
	'dry#run': true,
	'include#file': 'bar.js',
	foo: 123,
}) satisfies OddCasedProperties<CliOptions>;

// A delimiter is not emitted next to punctuation, so the two never double up. The case where the next word begins with punctuation was already handled; the case where the previous word ends with one produced `foo#-bar`.
expectTypeOf<DelimiterCase<'foo.Bar', '#'>>().toBe<'foo.bar'>();
expectTypeOf<DelimiterCase<'foo .bar', '#'>>().toBe<'foo.bar'>();
