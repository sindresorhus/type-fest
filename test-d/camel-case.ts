import {expectTypeOf} from 'nz';
import type {CamelCase, PascalCase, Tagged} from '../index.d.ts';

// CamelCase
const camelFromPascal: CamelCase<'FooBar'> = 'fooBar';
expectTypeOf(camelFromPascal).toBe<'fooBar'>();

const camelFromKebab: CamelCase<'foo-bar'> = 'fooBar';
expectTypeOf(camelFromKebab).toBe<'fooBar'>();

const camelFromComplexKebab: CamelCase<'foo-bar-abc-123'> = 'fooBarAbc123';
expectTypeOf(camelFromComplexKebab).toBe<'fooBarAbc123'>();

const camelFromSpace: CamelCase<'foo bar'> = 'fooBar';
expectTypeOf(camelFromSpace).toBe<'fooBar'>();

const camelFromSnake: CamelCase<'foo_bar'> = 'fooBar';
expectTypeOf(camelFromSnake).toBe<'fooBar'>();

const noDelimiterFromMono: CamelCase<'foobar'> = 'foobar';
expectTypeOf(noDelimiterFromMono).toBe<'foobar'>();

const camelFromMixed: CamelCase<'foo-bar_abc xyzBarFoo'> = 'fooBarAbcXyzBarFoo';
expectTypeOf(camelFromMixed).toBe<'fooBarAbcXyzBarFoo'>();

const camelFromVendorPrefixedCssProperty: CamelCase<'-webkit-animation'> = 'webkitAnimation';
expectTypeOf(camelFromVendorPrefixedCssProperty).toBe<'webkitAnimation'>();

const camelFromDoublePrefixedKebab: CamelCase<'--very-prefixed'> = 'veryPrefixed';
expectTypeOf(camelFromDoublePrefixedKebab).toBe<'veryPrefixed'>();

const camelFromRepeatedSeparators: CamelCase<'foo____bar'> = 'fooBar';
expectTypeOf(camelFromRepeatedSeparators).toBe<'fooBar'>();

const camelFromUppercase: CamelCase<'FOO'> = 'foo';
expectTypeOf(camelFromUppercase).toBe<'foo'>();

const camelFromLowercase: CamelCase<'foo'> = 'foo';
expectTypeOf(camelFromLowercase).toBe<'foo'>();

const camelFromScreamingSnakeCase: CamelCase<'FOO_BAR'> = 'fooBar';
expectTypeOf(camelFromScreamingSnakeCase).toBe<'fooBar'>();

const camelFromScreamingKebabCase: CamelCase<'FOO-BAR'> = 'fooBar';
expectTypeOf(camelFromScreamingKebabCase).toBe<'fooBar'>();

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

({
	dryRun: true,
	fullFamilyName: 'bar.js',
	foo: 123,
	bar: 'foo',
	quzQux: 6,
	otherField: false,
}) satisfies CamelCasedProperties<RawOptions>;

expectTypeOf<CamelCase<'fooBAR'>>().toBe<'fooBar'>();
expectTypeOf<CamelCase<'fooBAR', {preserveConsecutiveUppercase: true}>>().toBe<'fooBAR'>();

expectTypeOf<CamelCase<'fooBARBiz'>>().toBe<'fooBarBiz'>();
expectTypeOf<CamelCase<'fooBARBiz', {preserveConsecutiveUppercase: true}>>().toBe<'fooBARBiz'>();

expectTypeOf<CamelCase<'foo BAR-Biz_BUZZ', {preserveConsecutiveUppercase: true}>>().toBe<'fooBARBizBUZZ'>();
expectTypeOf<CamelCase<'foo BAR-Biz_BUZZ', {preserveConsecutiveUppercase: false}>>().toBe<'fooBarBizBuzz'>();
expectTypeOf<CamelCase<'foo\tBAR-Biz_BUZZ'>>().toBe<'fooBarBizBuzz'>();

expectTypeOf('string' as string).toBe<CamelCase<string, {preserveConsecutiveUppercase: true}>>();
expectTypeOf('string' as string).toBe<CamelCase<string>>();

// Test splitOnNumbers option
expectTypeOf('' as CamelCase<'a1b_text', {splitOnNumbers: false}>).toBe<'a1bText'>();
expectTypeOf('' as CamelCase<'a1b_text', {splitOnNumbers: true}>).toBe<'a1BText'>();
expectTypeOf('' as CamelCase<'a1b_text'>).toBe<'a1BText'>();

expectTypeOf('' as CamelCase<'p2pNetwork', {splitOnNumbers: false}>).toBe<'p2pNetwork'>();
expectTypeOf('' as CamelCase<'p2pNetwork', {splitOnNumbers: true}>).toBe<'p2PNetwork'>();

// Punctuation
expectTypeOf<CamelCase<'onDialog:close'>>().toBe<'onDialog:close'>();
expectTypeOf<CamelCase<'foo-bar>>baz'>>().toBe<'fooBar>>baz'>();
expectTypeOf<CamelCase<'foo-bar::01'>>().toBe<'fooBar::01'>();

expectTypeOf<CamelCase<'onDialog:close', {splitOnPunctuation: true}>>().toBe<'onDialogClose'>();
expectTypeOf<CamelCase<'foo-bar>>baz', {splitOnPunctuation: true}>>().toBe<'fooBarBaz'>();
expectTypeOf<CamelCase<'fooBAR:biz', {splitOnPunctuation: true; preserveConsecutiveUppercase: true}>>().toBe<'fooBARBiz'>();
expectTypeOf<CamelCase<'foo-bar::01', {splitOnPunctuation: true}>>().toBe<'fooBar01'>();
expectTypeOf<CamelCase<'foo-bar::01', {splitOnPunctuation: true; splitOnNumbers: false}>>().toBe<'fooBar01'>();
expectTypeOf<CamelCase<'foo-bar::01', {splitOnPunctuation: true; splitOnNumbers: true}>>().toBe<'fooBar01'>();

expectTypeOf<CamelCase<'foo_bar', {preserveLeadingUnderscores: true}>>().toBe<'fooBar'>();
expectTypeOf<CamelCase<'_foo_bar', {preserveLeadingUnderscores: true}>>().toBe<'_fooBar'>();
expectTypeOf<CamelCase<'__foo_bar', {preserveLeadingUnderscores: true}>>().toBe<'__fooBar'>();
expectTypeOf<CamelCase<'_FOO_BAR', {preserveLeadingUnderscores: true}>>().toBe<'_fooBar'>();
expectTypeOf<CamelCase<'__FOO_BAR', {preserveLeadingUnderscores: true}>>().toBe<'__fooBar'>();
expectTypeOf<CamelCase<'_foo-bar', {preserveLeadingUnderscores: true}>>().toBe<'_fooBar'>();
expectTypeOf<CamelCase<'_fooBAR', {preserveLeadingUnderscores: true; preserveConsecutiveUppercase: true}>>().toBe<'_fooBAR'>();
expectTypeOf<CamelCase<'_foo_bar'>>().toBe<'fooBar'>();
expectTypeOf<CamelCase<'_foo_bar', {preserveLeadingUnderscores: false}>>().toBe<'fooBar'>();

// Non-literal string types are passed through unchanged, like `DelimiterCase` does.
expectTypeOf<Uppercase<string>>().toBe<CamelCase<Uppercase<string>>>();
expectTypeOf<Lowercase<string>>().toBe<CamelCase<Lowercase<string>>>();
expectTypeOf<`${string}abc`>().toBe<CamelCase<`${string}abc`>>();
expectTypeOf<`on${string}`>().toBe<CamelCase<`on${string}`>>();
expectTypeOf<string>().toBe<CamelCase<string>>();

// A string that is entirely uppercase is lowercased before it is split into words, so `preserveConsecutiveUppercase` has no effect on it. See the docs.
expectTypeOf<CamelCase<'FOO_BAR', {preserveConsecutiveUppercase: true}>>().toBe<'fooBar'>();
expectTypeOf<CamelCase<'FOO_BAR', {preserveConsecutiveUppercase: false}>>().toBe<'fooBar'>();
expectTypeOf<CamelCase<'FOO-BAR', {preserveConsecutiveUppercase: true}>>().toBe<'fooBar'>();

// The option does apply to a string that is not entirely uppercase.
expectTypeOf<CamelCase<'foo BAR-Biz_BUZZ', {preserveConsecutiveUppercase: true}>>().toBe<'fooBARBizBUZZ'>();

// A branded or tagged string is still a finite string literal, so it is converted like any other.
expectTypeOf<CamelCase<Tagged<'foo-bar', 'x'>>>().toBe<'fooBar'>();
expectTypeOf<CamelCase<Tagged<'FooBar', 'x'>>>().toBe<'fooBar'>();

// The first word is only uncapitalized, so a character whose uppercase form is more than one character, such as `ß` or the `ﬁ` ligature, is kept there, like the `camelcase` package does.
expectTypeOf<CamelCase<'ß'>>().toBe<'ß'>();
expectTypeOf<CamelCase<'ß-bar'>>().toBe<'ßBar'>();
expectTypeOf<CamelCase<'ﬁeld'>>().toBe<'ﬁeld'>();
expectTypeOf<CamelCase<'ﬁ-x'>>().toBe<'ﬁX'>();
expectTypeOf<CamelCase<'ﬄx'>>().toBe<'ﬄx'>();

// A later word is capitalized in full, so the same character expands there, like `camelcase` and `change-case` do.
expectTypeOf<CamelCase<'a-ßb'>>().toBe<'aSSb'>();
expectTypeOf<CamelCase<'a-ﬁx'>>().toBe<'aFIx'>();
expectTypeOf<PascalCase<'a-ßb'>>().toBe<'ASSb'>();

// `PascalCase` capitalizes the first word too, so it expands there.
expectTypeOf<PascalCase<'ß'>>().toBe<'SS'>();
expectTypeOf<PascalCase<'ﬁeld'>>().toBe<'FIeld'>();

// A word is capitalized whatever script it is in.
expectTypeOf<CamelCase<'a-écaille'>>().toBe<'aÉcaille'>();
expectTypeOf<CamelCase<'a-à-vache'>>().toBe<'aÀVache'>();
expectTypeOf<CamelCase<'ǆ-dz'>>().toBe<'ǆDz'>();
expectTypeOf<CamelCase<'a-öcaille'>>().toBe<'aÖcaille'>();
expectTypeOf<CamelCase<'a-жcaille'>>().toBe<'aЖcaille'>();
expectTypeOf<CamelCase<'a-αcaille'>>().toBe<'aΑcaille'>();
expectTypeOf<CamelCase<'a-бcaille'>>().toBe<'aБcaille'>();

// A word whose first character has no uppercase form is left as it is, in every script, the same way an ASCII digit or punctuation mark is.
expectTypeOf<CamelCase<'a-אcaille'>>().toBe<'aאcaille'>();
expectTypeOf<CamelCase<'a-한caille'>>().toBe<'a한caille'>();
expectTypeOf<CamelCase<'a-بcaille'>>().toBe<'aبcaille'>();

// A branded string that is entirely uppercase is pre-lowered like the same string without the brand, so the entirely-uppercase rule applies to it too and the option has no effect on it.
expectTypeOf<CamelCase<'FOO_BAR' & {readonly __brand: 'x'}, {preserveConsecutiveUppercase: true}>>().toBe<'fooBar'>();
expectTypeOf<CamelCase<Tagged<'FOO_BAR', 'x'>, {preserveConsecutiveUppercase: true}>>().toBe<'fooBar'>();

// The leading underscores are read from the string itself, so all of them are kept.
expectTypeOf<CamelCase<'__FOO_BAR' & {readonly __brand: 'x'}, {preserveConsecutiveUppercase: true; preserveLeadingUnderscores: true}>>().toBe<'__fooBar'>();
