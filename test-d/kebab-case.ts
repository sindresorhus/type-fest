import {expectTypeOf} from 'nz';
import type {KebabCase} from '../index.d.ts';

const kebabFromCamel: KebabCase<'fooBar'> = 'foo-bar';
expectTypeOf(kebabFromCamel).toBe<'foo-bar'>();

const kebabFromPascal: KebabCase<'FooBar'> = 'foo-bar';
expectTypeOf(kebabFromPascal).toBe<'foo-bar'>();

const kebabFromKebab: KebabCase<'foo-bar'> = 'foo-bar';
expectTypeOf(kebabFromKebab).toBe<'foo-bar'>();

const kebabFromSpace: KebabCase<'foo bar'> = 'foo-bar';
expectTypeOf(kebabFromSpace).toBe<'foo-bar'>();

const kebabFromSnake: KebabCase<'foo_bar'> = 'foo-bar';
expectTypeOf(kebabFromSnake).toBe<'foo-bar'>();

const noKebabFromMono: KebabCase<'foobar'> = 'foobar';
expectTypeOf(noKebabFromMono).toBe<'foobar'>();

const kebabFromCamelPascal: KebabCase<'FooBar'> = 'foo-bar';
expectTypeOf(kebabFromCamelPascal).toBe<'foo-bar'>();

const kebabFromComplexKebab: KebabCase<'foo-bar-abc-123'> = 'foo-bar-abc-123';
expectTypeOf(kebabFromComplexKebab).toBe<'foo-bar-abc-123'>();

const kebabFromMixed: KebabCase<'foo-bar_abc xyzBarFoo'> =
	'foo-bar-abc-xyz-bar-foo';
expectTypeOf(kebabFromMixed).toBe<'foo-bar-abc-xyz-bar-foo'>();

const kebabFromVendorPrefixedCssProperty: KebabCase<'-webkit-animation'> =
	'webkit-animation';
expectTypeOf(kebabFromVendorPrefixedCssProperty).toBe<'webkit-animation'>();

const kebabFromDoublePrefixedKebab: KebabCase<'--very-prefixed'> =
	'very-prefixed';
expectTypeOf(kebabFromDoublePrefixedKebab).toBe<'very-prefixed'>();

const kebabFromRepeatedSeparators: KebabCase<'foo____bar'> = 'foo-bar';
expectTypeOf(kebabFromRepeatedSeparators).toBe<'foo-bar'>();

const kebabFromUppercase: KebabCase<'FOO'> = 'foo';
expectTypeOf(kebabFromUppercase).toBe<'foo'>();

const kebabFromLowercase: KebabCase<'foo'> = 'foo';
expectTypeOf(kebabFromLowercase).toBe<'foo'>();

const kebabFromScreamingSnakeCase: KebabCase<'FOO_BAR'> = 'foo-bar';
expectTypeOf(kebabFromScreamingSnakeCase).toBe<'foo-bar'>();

const kebabFromScreamingKebabCase: KebabCase<'FOO-BAR'> = 'foo-bar';
expectTypeOf(kebabFromScreamingKebabCase).toBe<'foo-bar'>();

const kebabFromMixed2: KebabCase<'parseHTML'> = 'parse-html';
expectTypeOf(kebabFromMixed2).toBe<'parse-html'>();

const kebabFromMixed3: KebabCase<'parseHTMLItem'> = 'parse-html-item';
expectTypeOf(kebabFromMixed3).toBe<'parse-html-item'>();

const kebabFromNumberInTheMiddleSplitOnNumbers: KebabCase<'foo2bar', {splitOnNumbers: true}> = 'foo-2-bar';
expectTypeOf(kebabFromNumberInTheMiddleSplitOnNumbers).toBe<'foo-2-bar'>();

const kebabFromNumberInTheMiddleSplitOnNumbersEdgeCase: KebabCase<'foO2Bar', {splitOnNumbers: true}> = 'fo-o-2-bar';
expectTypeOf(kebabFromNumberInTheMiddleSplitOnNumbersEdgeCase).toBe<'fo-o-2-bar'>();

const kebabFromNumberInTheMiddleSplitOnNumbersEdgeCase2: KebabCase<'foO2bar', {splitOnNumbers: true}> = 'fo-o-2-bar';
expectTypeOf(kebabFromNumberInTheMiddleSplitOnNumbersEdgeCase2).toBe<'fo-o-2-bar'>();

const kebabFromNumberInTheMiddleNoSplitOnNumbers: KebabCase<'foo2bar'> = 'foo2bar';
expectTypeOf(kebabFromNumberInTheMiddleNoSplitOnNumbers).toBe<'foo2bar'>();

const kebabFromNumberInTheMiddleNoSplitOnNumbersEdgeCase: KebabCase<'foo2Bar'> = 'foo2-bar';
expectTypeOf(kebabFromNumberInTheMiddleNoSplitOnNumbersEdgeCase).toBe<'foo2-bar'>();

const kebabFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2: KebabCase<'foO2bar'> = 'fo-o2bar';
expectTypeOf(kebabFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2).toBe<'fo-o2bar'>();

const kebabFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3: KebabCase<'FOO22Bar'> = 'foo22-bar';
expectTypeOf(kebabFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3).toBe<'foo22-bar'>();

// Punctuation
declare const withPunctuation: KebabCase<'onDialog:close'>;
expectTypeOf(withPunctuation).toBe<'on-dialog:close'>();

declare const withPunctuationAndSplit: KebabCase<'onDialog:close', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationAndSplit).toBe<'on-dialog-close'>();

declare const withPunctuation2: KebabCase<'foo-bar>>baz'>;
expectTypeOf(withPunctuation2).toBe<'foo-bar>>baz'>();

declare const withPunctuationAndSplit2: KebabCase<'foo-bar>>baz', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationAndSplit2).toBe<'foo-bar-baz'>();

declare const withPunctuation3: KebabCase<'card::after'>;
expectTypeOf(withPunctuation3).toBe<'card::after'>();

declare const withPunctuationAndSplit3: KebabCase<'card::after', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationAndSplit3).toBe<'card-after'>();

declare const withPunctuation4: KebabCase<'div.card::after'>;
expectTypeOf(withPunctuation4).toBe<'div.card::after'>();

declare const withPunctuationAndSplit4: KebabCase<'div.card::after', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationAndSplit4).toBe<'div-card-after'>();

declare const withPunctuationAndNumber: KebabCase<'foo-bar::01'>;
expectTypeOf(withPunctuationAndNumber).toBe<'foo-bar::01'>();

declare const withPunctuationSplitAndNumber: KebabCase<'foo-bar::01', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplitAndNumber).toBe<'foo-bar-01'>();

declare const withPunctuationSplitAndNumberSplit: KebabCase<'foo-bar::01', {splitOnPunctuation: true; splitOnNumbers: true}>;
expectTypeOf(withPunctuationSplitAndNumberSplit).toBe<'foo-bar-01'>();

declare const withPunctuationAndNumberSplit2: KebabCase<'foo-bar::01', {splitOnNumbers: true}>;
expectTypeOf(withPunctuationAndNumberSplit2).toBe<'foo-bar::01'>();

declare const withPunctuationSplitAndNumberSplit2: KebabCase<'foo-bar::01', {splitOnNumbers: true; splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplitAndNumberSplit2).toBe<'foo-bar-01'>();

// A delimiter is not emitted next to punctuation, so the two never double up. The case where the next word begins with punctuation was already handled; the case where the previous word ends with one produced `foo.-bar`.
expectTypeOf<KebabCase<'foo.Bar'>>().toBe<'foo.bar'>();
expectTypeOf<KebabCase<'foo .bar'>>().toBe<'foo.bar'>();
expectTypeOf<KebabCase<'a.b.c'>>().toBe<'a.b.c'>();
expectTypeOf<KebabCase<'a-b.c'>>().toBe<'a-b.c'>();

expectTypeOf<KebabCase<'a\u{85}b'>>().toBe<'a-b'>();

// An acronym keeps its last capital when the next character is not a lowercase letter, such as punctuation or a character with no case.
expectTypeOf<KebabCase<'userID?'>>().toBe<'user-id?'>();
expectTypeOf<KebabCase<'parseJSON😀'>>().toBe<'parse-json😀'>();
