import {expectType, expectAssignable} from 'tsd';
import type {DelimiterCase} from '../source/delimiter-case';

// DelimiterCase
const delimiterFromCamel: DelimiterCase<'fooBar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromCamel);

const delimiterFromComplexCamel: DelimiterCase<'fooBarAbc123', '#', {splitOnNumber: false}> = 'foo#bar#abc123';
expectType<'foo#bar#abc123'>(delimiterFromComplexCamel);

const delimiterFromComplexCamelSplitOnNumber: DelimiterCase<
'fooBarAbc123',
'#',
{splitOnNumber: true}
> = 'foo#bar#abc#123';
expectType<'foo#bar#abc#123'>(delimiterFromComplexCamelSplitOnNumber);

const delimiterFromComplexCamelNoSplitOnNumber: DelimiterCase<'fooBarAbc123', '#', {splitOnNumber: false}> = 'foo#bar#abc123';
expectType<'foo#bar#abc123'>(delimiterFromComplexCamelNoSplitOnNumber);

const delimiterNumberInTheMiddle: DelimiterCase<'p2pNetwork', '#'> = 'p#2#p#network';
expectType<'p#2#p#network'>(delimiterNumberInTheMiddle);

const delimiterNumberInTheMiddleNoSplitOnNumber: DelimiterCase<'p2pNetwork', '#', {splitOnNumber: false}> = 'p2p#network';
expectType<'p2p#network'>(delimiterNumberInTheMiddleNoSplitOnNumber);

const delimiterFromPascal: DelimiterCase<'FooBar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromPascal);

const delimiterFromKebab: DelimiterCase<'foo-bar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromKebab);

const delimiterFromComplexKebab: DelimiterCase<'foo-bar-abc-123', '#'> = 'foo#bar#abc#123';
expectType<'foo#bar#abc#123'>(delimiterFromComplexKebab);

const delimiterFromSpace: DelimiterCase<'foo bar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromSpace);

const delimiterFromTab: DelimiterCase<'foo\tbar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromTab);

const delimiterFromSnake: DelimiterCase<'foo_bar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromSnake);

const noDelimiterFromMono: DelimiterCase<'foobar', '#'> = 'foobar';
expectType<'foobar'>(noDelimiterFromMono);

const delimiterFromMixed: DelimiterCase<'foo-bar_abc xyzBarFoo', '#'> = 'foo#bar#abc#xyz#bar#foo';
expectType<'foo#bar#abc#xyz#bar#foo'>(delimiterFromMixed);

const delimiterFromVendorPrefixedCssProperty: DelimiterCase<'-webkit-animation', '#'> = 'webkit#animation';
expectType<'webkit#animation'>(delimiterFromVendorPrefixedCssProperty);

const delimiterFromDoublePrefixedKebab: DelimiterCase<'--very-prefixed', '#'> = 'very#prefixed';
expectType<'very#prefixed'>(delimiterFromDoublePrefixedKebab);

const delimiterFromRepeatedSeparators: DelimiterCase<'foo____bar', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromRepeatedSeparators);

const delimiterFromString: DelimiterCase<string, '#'> = 'foobar';
expectType<string>(delimiterFromString);

const delimiterFromScreamingSnake: DelimiterCase<'FOO_BAR', '#'> = 'foo#bar';
expectType<'foo#bar'>(delimiterFromScreamingSnake);

const delimiterFromMixed2: DelimiterCase<'parseHTML', '#'> = 'parse#html';
expectType<'parse#html'>(delimiterFromMixed2);

const delimiterFromMixed3: DelimiterCase<'parseHTMLItem', '#'> = 'parse#html#item';
expectType<'parse#html#item'>(delimiterFromMixed3);

const delimiterFromNumberInTheMiddleSplitOnNumber: DelimiterCase<'foo2bar', '#'> = 'foo#2#bar';
expectType<'foo#2#bar'>(delimiterFromNumberInTheMiddleSplitOnNumber);

const delimiterFromNumberInTheMiddleSplitOnNumberEdgeCase: DelimiterCase<'foO2Bar', '#'> = 'fo#o#2#bar';
expectType<'fo#o#2#bar'>(delimiterFromNumberInTheMiddleSplitOnNumberEdgeCase);

const delimiterFromNumberInTheMiddleSplitOnNumberEdgeCase2: DelimiterCase<'foO2bar', '#'> = 'fo#o#2#bar';
expectType<'fo#o#2#bar'>(delimiterFromNumberInTheMiddleSplitOnNumberEdgeCase2);

const delimiterFromNumberInTheMiddleNoSplitOnNumber: DelimiterCase<'foo2bar', '#', {splitOnNumber: false}> = 'foo2bar';
expectType<'foo2bar'>(delimiterFromNumberInTheMiddleNoSplitOnNumber);

const delimiterFromNumberInTheMiddleNoSplitOnNumberEdgeCase: DelimiterCase<'foo2Bar', '#', {splitOnNumber: false}> = 'foo2#bar';
expectType<'foo2#bar'>(delimiterFromNumberInTheMiddleNoSplitOnNumberEdgeCase);

const delimiterFromNumberInTheMiddleNoSplitOnNumberEdgeCase2: DelimiterCase<'foO2bar', '#', {splitOnNumber: false}> = 'fo#o2bar';
expectType<'fo#o2bar'>(delimiterFromNumberInTheMiddleNoSplitOnNumberEdgeCase2);

// Verifying example
type OddCasedProperties<T> = {
	[K in keyof T as DelimiterCase<K, '#'>]: T[K]
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
