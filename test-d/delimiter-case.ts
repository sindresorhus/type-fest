import {expectType, expectAssignable} from 'tsd';
import type {DelimiterCase} from '../source/delimiter-case.d.ts';

// DelimiterCase
const delimiterFromCamel: DelimiterCase<'fooBar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromCamel);

const delimiterFromComplexCamel: DelimiterCase<'fooBarAbc123', '#'> = 'foo#bar#abc123';
expectType<'foo#bar#abc123'>(delimiterFromComplexCamel);

const delimiterFromComplexCamelSplitOnNumbers: DelimiterCase<
'fooBarAbc123',
'#',
{splitOnNumbers: true}
> = 'foo#bar#abc#123';
expectType<'foo#bar#abc#123'>(delimiterFromComplexCamelSplitOnNumbers);

const delimiterFromComplexCamelNoSplitOnNumbers: DelimiterCase<'fooBarAbc123', '#'> = 'foo#bar#abc123';
expectType<'foo#bar#abc123'>(delimiterFromComplexCamelNoSplitOnNumbers);

const delimiterNumberInTheMiddle: DelimiterCase<'p2pNetwork', '#', {splitOnNumbers: true}> = 'p#2#p#network';
expectType<'p#2#p#network'>(delimiterNumberInTheMiddle);

const delimiterNumberInTheMiddleNoSplitOnNumbers: DelimiterCase<'p2pNetwork', '#'> = 'p2p#network';
expectType<'p2p#network'>(delimiterNumberInTheMiddleNoSplitOnNumbers);

const delimiterFromPascal: DelimiterCase<'FooBar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromPascal);

const delimiterFromKebab: DelimiterCase<'foo-bar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromKebab);

const delimiterFromComplexKebab: DelimiterCase<'foo-bar-abc-123', '#'>
	= 'foo#bar#abc#123';
expectType<'foo#bar#abc#123'>(delimiterFromComplexKebab);

const delimiterFromSpace: DelimiterCase<'foo bar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromSpace);

const delimiterFromTab: DelimiterCase<'foo\tbar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromTab);

const delimiterFromSnake: DelimiterCase<'foo_bar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromSnake);

const noDelimiterFromMono: DelimiterCase<'foobar', '#'> = 'foobar';
expectType<'foobar'>(noDelimiterFromMono);

const delimiterFromMixed: DelimiterCase<'foo-bar_abc xyzBarFoo', '#'>
	= 'foo#bar#abc#xyz#bar#foo';
expectType<'foo#bar#abc#xyz#bar#foo'>(delimiterFromMixed);

const delimiterFromVendorPrefixedCssProperty: DelimiterCase<
'-webkit-animation',
'#'
> = 'webkit#animation';
expectType<'webkit#animation'>(delimiterFromVendorPrefixedCssProperty);

const delimiterFromDoublePrefixedKebab: DelimiterCase<'--very-prefixed', '#'>
	= 'very#prefixed';
expectType<'very#prefixed'>(delimiterFromDoublePrefixedKebab);

const delimiterFromRepeatedSeparators: DelimiterCase<'foo____bar', '#'>
	= 'foo#bar';
expectType<'foo#bar'>(delimiterFromRepeatedSeparators);

const delimiterFromString: DelimiterCase<string, '#'> = 'foobar';
expectType<string>(delimiterFromString);

const delimiterFromScreamingSnake: DelimiterCase<'FOO_BAR', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromScreamingSnake);

const delimiterFromMixed2: DelimiterCase<'parseHTML', '#'> = 'parse#html';
expectType<'parse#html'>(delimiterFromMixed2);

const delimiterFromMixed3: DelimiterCase<'parseHTMLItem', '#'>
	= 'parse#html#item';
expectType<'parse#html#item'>(delimiterFromMixed3);

const delimiterFromNumberInTheMiddleSplitOnNumbers: DelimiterCase<'foo2bar', '#', {splitOnNumbers: true}> = 'foo#2#bar';
expectType<'foo#2#bar'>(delimiterFromNumberInTheMiddleSplitOnNumbers);

const delimiterFromNumberInTheMiddleSplitOnNumbersEdgeCase: DelimiterCase<'foO2Bar', '#', {splitOnNumbers: true}> = 'fo#o#2#bar';
expectType<'fo#o#2#bar'>(delimiterFromNumberInTheMiddleSplitOnNumbersEdgeCase);

const delimiterFromNumberInTheMiddleSplitOnNumbersEdgeCase2: DelimiterCase<'foO2bar', '#', {splitOnNumbers: true}> = 'fo#o#2#bar';
expectType<'fo#o#2#bar'>(delimiterFromNumberInTheMiddleSplitOnNumbersEdgeCase2);

const delimiterFromNumberInTheMiddleNoSplitOnNumbers: DelimiterCase<'foo2bar', '#'> = 'foo2bar';
expectType<'foo2bar'>(delimiterFromNumberInTheMiddleNoSplitOnNumbers);

const delimiterFromNumberInTheMiddleNoSplitOnNumbersEdgeCase: DelimiterCase<'foo2Bar', '#'> = 'foo2#bar';
expectType<'foo2#bar'>(delimiterFromNumberInTheMiddleNoSplitOnNumbersEdgeCase);

const delimiterFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2: DelimiterCase<'foO2bar', '#'> = 'fo#o2bar';
expectType<'fo#o2bar'>(delimiterFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2);

const delimiterFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3: DelimiterCase<'FOO22Bar', '#'> = 'foo22#bar';
expectType<'foo22#bar'>(
	delimiterFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3,
);

declare const unionValue: DelimiterCase<'fooBar' | 'barBaz', '#'>;
expectType<'foo#bar' | 'bar#baz'>(unionValue);

declare const unionDelimiter: DelimiterCase<'fooBar', '#' | '$'>;
expectType<'foo#bar' | 'foo$bar'>(unionDelimiter);

declare const unionValueAndDelimiter: DelimiterCase<'fooBar' | 'barBaz', '#' | '$'>;
expectType<'foo#bar' | 'bar#baz' | 'foo$bar' | 'bar$baz'>(unionValueAndDelimiter);

const stringPart: DelimiterCase<`foo${string}`, '#'> = 'fooSomeString';
expectType<`foo${string}`>(stringPart);

declare const withPunctuation: DelimiterCase<'onDialog:close', '#'>;
expectType<'on#dialog:close'>(withPunctuation);

declare const withPunctuation2: DelimiterCase<'foo-bar>>baz', '#'>;
expectType<'foo#bar>>baz'>(withPunctuation2);

declare const withPunctuation3: DelimiterCase<'card::after', '#'>;
expectType<'card::after'>(withPunctuation3);

declare const withPunctuation4: DelimiterCase<'div.card::after', '#'>;
expectType<'div.card::after'>(withPunctuation4);

declare const withPunctuationAndNumber: DelimiterCase<'foo-bar::01', '#'>;
expectType<'foo#bar::01'>(withPunctuationAndNumber);

declare const withPunctuationAndNumber2: DelimiterCase<'foo-bar::01', '#', {splitOnNumbers: true}>;
expectType<'foo#bar::#01'>(withPunctuationAndNumber2);

// Verifying example
type OddCasedProperties<T> = {
	[K in keyof T as DelimiterCase<K, '#'>]: T[K];
};

type CliOptions = {
	dryRun: boolean;
	includeFile: string;
	foo: number;
};

expectAssignable<OddCasedProperties<CliOptions>>({
	'dry#run': true,
	'include#file': 'bar.js',
	foo: 123,
});
