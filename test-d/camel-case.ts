import {expectType, expectAssignable} from 'tsd';
import type {CamelCase} from '../index.d.ts';

// CamelCase
const camelFromPascal: CamelCase<'FooBar'> = 'fooBar';
expectType<'fooBar'>(camelFromPascal);

const camelFromKebab: CamelCase<'foo-bar'> = 'fooBar';
expectType<'fooBar'>(camelFromKebab);

const camelFromComplexKebab: CamelCase<'foo-bar-abc-123'> = 'fooBarAbc123';
expectType<'fooBarAbc123'>(camelFromComplexKebab);

const camelFromSpace: CamelCase<'foo bar'> = 'fooBar';
expectType<'fooBar'>(camelFromSpace);

const camelFromSnake: CamelCase<'foo_bar'> = 'fooBar';
expectType<'fooBar'>(camelFromSnake);

const noDelimiterFromMono: CamelCase<'foobar'> = 'foobar';
expectType<'foobar'>(noDelimiterFromMono);

const camelFromMixed: CamelCase<'foo-bar_abc xyzBarFoo'> = 'fooBarAbcXyzBarFoo';
expectType<'fooBarAbcXyzBarFoo'>(camelFromMixed);

const camelFromVendorPrefixedCssProperty: CamelCase<'-webkit-animation'> = 'webkitAnimation';
expectType<'webkitAnimation'>(camelFromVendorPrefixedCssProperty);

const camelFromDoublePrefixedKebab: CamelCase<'--very-prefixed'> = 'veryPrefixed';
expectType<'veryPrefixed'>(camelFromDoublePrefixedKebab);

const camelFromRepeatedSeparators: CamelCase<'foo____bar'> = 'fooBar';
expectType<'fooBar'>(camelFromRepeatedSeparators);

const camelFromUppercase: CamelCase<'FOO'> = 'foo';
expectType<'foo'>(camelFromUppercase);

const camelFromLowercase: CamelCase<'foo'> = 'foo';
expectType<'foo'>(camelFromLowercase);

const camelFromScreamingSnakeCase: CamelCase<'FOO_BAR'> = 'fooBar';
expectType<'fooBar'>(camelFromScreamingSnakeCase);

const camelFromScreamingKebabCase: CamelCase<'FOO-BAR'> = 'fooBar';
expectType<'fooBar'>(camelFromScreamingKebabCase);

// Verifying example
type CamelCasedProperties<T> = {
	[K in keyof T as CamelCase<K>]: T[K]
};

type RawOptions = {
	'dry-run': boolean;
	'full_family_name': string;
	foo: number;
	BAR: string;
	QUZ_QUX: number;
	'OTHER-FIELD': boolean;
};

expectAssignable<CamelCasedProperties<RawOptions>>({
	dryRun: true,
	fullFamilyName: 'bar.js',
	foo: 123,
	bar: 'foo',
	quzQux: 6,
	otherField: false,
});

expectType<CamelCase<'fooBAR'>>('fooBar');
expectType<CamelCase<'fooBAR', {preserveConsecutiveUppercase: true}>>('fooBAR');

expectType<CamelCase<'fooBARBiz'>>('fooBarBiz');
expectType<CamelCase<'fooBARBiz', {preserveConsecutiveUppercase: true}>>('fooBARBiz');

expectType<CamelCase<'foo BAR-Biz_BUZZ', {preserveConsecutiveUppercase: true}>>('fooBARBizBUZZ');
expectType<CamelCase<'foo BAR-Biz_BUZZ', {preserveConsecutiveUppercase: false}>>('fooBarBizBuzz');
expectType<CamelCase<'foo\tBAR-Biz_BUZZ'>>('fooBarBizBuzz');

expectType<CamelCase<string, {preserveConsecutiveUppercase: true}>>('string' as string);
expectType<CamelCase<string>>('string' as string);

// Test splitOnNumbers option
expectType<'a1bText'>('' as CamelCase<'a1b_text', {splitOnNumbers: false}>);
expectType<'a1BText'>('' as CamelCase<'a1b_text', {splitOnNumbers: true}>);
expectType<'a1BText'>('' as CamelCase<'a1b_text'>);

expectType<'p2pNetwork'>('' as CamelCase<'p2pNetwork', {splitOnNumbers: false}>);
expectType<'p2PNetwork'>('' as CamelCase<'p2pNetwork', {splitOnNumbers: true}>);

// Punctuation
expectType<CamelCase<'onDialog:close'>>('onDialog:close');
expectType<CamelCase<'foo-bar>>baz'>>('fooBar>>baz');
expectType<CamelCase<'foo-bar::01'>>('fooBar::01');

expectType<CamelCase<'onDialog:close', {splitOnPunctuation: true}>>('onDialogClose');
expectType<CamelCase<'foo-bar>>baz', {splitOnPunctuation: true}>>('fooBarBaz');
expectType<CamelCase<'fooBAR:biz', {splitOnPunctuation: true; preserveConsecutiveUppercase: true}>>('fooBARBiz');
expectType<CamelCase<'foo-bar::01', {splitOnPunctuation: true}>>('fooBar01');
expectType<CamelCase<'foo-bar::01', {splitOnPunctuation: true; splitOnNumbers: false}>>('fooBar01');
expectType<CamelCase<'foo-bar::01', {splitOnPunctuation: true; splitOnNumbers: true}>>('fooBar01');

expectType<CamelCase<'foo_bar', {preserveLeadingUnderscores: true}>>('fooBar');
expectType<CamelCase<'_foo_bar', {preserveLeadingUnderscores: true}>>('_fooBar');
expectType<CamelCase<'__foo_bar', {preserveLeadingUnderscores: true}>>('__fooBar');
expectType<CamelCase<'_FOO_BAR', {preserveLeadingUnderscores: true}>>('_fooBar');
expectType<CamelCase<'__FOO_BAR', {preserveLeadingUnderscores: true}>>('__fooBar');
expectType<CamelCase<'_foo-bar', {preserveLeadingUnderscores: true}>>('_fooBar');
expectType<CamelCase<'_fooBAR', {preserveLeadingUnderscores: true; preserveConsecutiveUppercase: true}>>('_fooBAR');
expectType<CamelCase<'_foo_bar'>>('fooBar');
expectType<CamelCase<'_foo_bar', {preserveLeadingUnderscores: false}>>('fooBar');
