import {expectType, expectAssignable} from 'tsd';
import type {CamelCase, PascalCase, Tagged} from '../index.d.ts';

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

// Non-literal string types are passed through unchanged, like `DelimiterCase` does.
expectType<CamelCase<Uppercase<string>>>({} as Uppercase<string>);
expectType<CamelCase<Lowercase<string>>>({} as Lowercase<string>);
expectType<CamelCase<`${string}abc`>>({} as `${string}abc`);
expectType<CamelCase<`on${string}`>>({} as `on${string}`);
expectType<CamelCase<string>>(null! as string);

// A string that is entirely uppercase is lowercased before it is split into words, so `preserveConsecutiveUppercase` has no effect on it. See the docs.
expectType<CamelCase<'FOO_BAR', {preserveConsecutiveUppercase: true}>>('fooBar');
expectType<CamelCase<'FOO_BAR', {preserveConsecutiveUppercase: false}>>('fooBar');
expectType<CamelCase<'FOO-BAR', {preserveConsecutiveUppercase: true}>>('fooBar');

// The option does apply to a string that is not entirely uppercase.
expectType<CamelCase<'foo BAR-Biz_BUZZ', {preserveConsecutiveUppercase: true}>>('fooBARBizBUZZ');

// A branded or tagged string is still a finite string literal, so it is converted like any other.
expectType<CamelCase<Tagged<'foo-bar', 'x'>>>('fooBar');
expectType<CamelCase<Tagged<'FooBar', 'x'>>>('fooBar');

// The first word is only uncapitalized, so a character whose uppercase form is more than one character, such as `ß` or the `ﬁ` ligature, is kept there, like the `camelcase` package does.
expectType<CamelCase<'ß'>>('ß');
expectType<CamelCase<'ß-bar'>>('ßBar');
expectType<CamelCase<'ﬁeld'>>('ﬁeld');
expectType<CamelCase<'ﬁ-x'>>('ﬁX');
expectType<CamelCase<'ﬄx'>>('ﬄx');

// A later word is capitalized in full, so the same character expands there, like `camelcase` and `change-case` do.
expectType<'aSSb'>({} as CamelCase<'a-ßb'>);
expectType<'aFIx'>({} as CamelCase<'a-ﬁx'>);
expectType<'ASSb'>({} as PascalCase<'a-ßb'>);

// `PascalCase` capitalizes the first word too, so it expands there.
expectType<PascalCase<'ß'>>('SS');
expectType<PascalCase<'ﬁeld'>>('FIeld');

// A word is capitalized whatever script it is in.
expectType<'aÉcaille'>({} as CamelCase<'a-écaille'>);
expectType<'aÀVache'>({} as CamelCase<'a-à-vache'>);
expectType<'ǆDz'>({} as CamelCase<'ǆ-dz'>);
expectType<'aÖcaille'>({} as CamelCase<'a-öcaille'>);
expectType<'aЖcaille'>({} as CamelCase<'a-жcaille'>);
expectType<'aΑcaille'>({} as CamelCase<'a-αcaille'>);
expectType<'aБcaille'>({} as CamelCase<'a-бcaille'>);

// A word whose first character has no uppercase form is left as it is, in every script, the same way an ASCII digit or punctuation mark is.
expectType<'aאcaille'>({} as CamelCase<'a-אcaille'>);
expectType<'a한caille'>({} as CamelCase<'a-한caille'>);
expectType<'aبcaille'>({} as CamelCase<'a-بcaille'>);

// A branded string that is entirely uppercase is pre-lowered like the same string without the brand, so the entirely-uppercase rule applies to it too and the option has no effect on it.
expectType<CamelCase<'FOO_BAR' & {readonly __brand: 'x'}, {preserveConsecutiveUppercase: true}>>('fooBar');
expectType<CamelCase<Tagged<'FOO_BAR', 'x'>, {preserveConsecutiveUppercase: true}>>('fooBar');

// The leading underscores are read from the string itself, so all of them are kept.
expectType<CamelCase<'__FOO_BAR' & {readonly __brand: 'x'}, {preserveConsecutiveUppercase: true; preserveLeadingUnderscores: true}>>('__fooBar');
