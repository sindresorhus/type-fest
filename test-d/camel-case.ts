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
