import {expectTypeOf} from 'nz';
import type {SnakeCase} from '../index.d.ts';

const snakeFromCamel: SnakeCase<'fooBar'> = 'foo_bar';
expectTypeOf(snakeFromCamel).toBe<'foo_bar'>();

const snakeFromPascal: SnakeCase<'FooBar'> = 'foo_bar';
expectTypeOf(snakeFromPascal).toBe<'foo_bar'>();

const snakeFromKebab: SnakeCase<'foo-bar'> = 'foo_bar';
expectTypeOf(snakeFromKebab).toBe<'foo_bar'>();

const snakeFromSpace: SnakeCase<'foo bar'> = 'foo_bar';
expectTypeOf(snakeFromSpace).toBe<'foo_bar'>();

const snakeFromSnake: SnakeCase<'foo_bar'> = 'foo_bar';
expectTypeOf(snakeFromSnake).toBe<'foo_bar'>();

const noSnakeFromMono: SnakeCase<'foobar'> = 'foobar';
expectTypeOf(noSnakeFromMono).toBe<'foobar'>();

const snakeFromCamelPascal: SnakeCase<'FooBar'> = 'foo_bar';
expectTypeOf(snakeFromCamelPascal).toBe<'foo_bar'>();

const snakeFromComplexKebab: SnakeCase<'foo-bar-abc-123'> = 'foo_bar_abc_123';
expectTypeOf(snakeFromComplexKebab).toBe<'foo_bar_abc_123'>();

const snakeFromMixed: SnakeCase<'foo-bar_abc xyzBarFoo'> =
	'foo_bar_abc_xyz_bar_foo';
expectTypeOf(snakeFromMixed).toBe<'foo_bar_abc_xyz_bar_foo'>();

const snakeFromVendorPrefixedCssProperty: SnakeCase<'-webkit-animation'> =
	'webkit_animation';
expectTypeOf(snakeFromVendorPrefixedCssProperty).toBe<'webkit_animation'>();

const snakeFromDoublePrefixedKebab: SnakeCase<'--very-prefixed'> =
	'very_prefixed';
expectTypeOf(snakeFromDoublePrefixedKebab).toBe<'very_prefixed'>();

const snakeFromRepeatedSeparators: SnakeCase<'foo____bar'> = 'foo_bar';
expectTypeOf(snakeFromRepeatedSeparators).toBe<'foo_bar'>();

const snakeFromUppercase: SnakeCase<'FOO'> = 'foo';
expectTypeOf(snakeFromUppercase).toBe<'foo'>();

const snakeFromLowercase: SnakeCase<'foo'> = 'foo';
expectTypeOf(snakeFromLowercase).toBe<'foo'>();

const snakeFromScreamingSnakeCase: SnakeCase<'FOO_BAR'> = 'foo_bar';
expectTypeOf(snakeFromScreamingSnakeCase).toBe<'foo_bar'>();

const snakeFromScreamingKebabCase: SnakeCase<'FOO-BAR'> = 'foo_bar';
expectTypeOf(snakeFromScreamingKebabCase).toBe<'foo_bar'>();

const snakeFromMixed2: SnakeCase<'parseHTML'> = 'parse_html';
expectTypeOf(snakeFromMixed2).toBe<'parse_html'>();

const snakeFromMixed3: SnakeCase<'parseHTMLItem'> = 'parse_html_item';
expectTypeOf(snakeFromMixed3).toBe<'parse_html_item'>();

const snakeFromNumberInTheMiddleSplitOnNumbers: SnakeCase<'foo2bar', {splitOnNumbers: true}> =
	'foo_2_bar';
expectTypeOf(snakeFromNumberInTheMiddleSplitOnNumbers).toBe<'foo_2_bar'>();

const snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase: SnakeCase<'foO2Bar', {splitOnNumbers: true}> =
	'fo_o_2_bar';
expectTypeOf(snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase).toBe<'fo_o_2_bar'>();

const snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase2: SnakeCase<'foO2bar', {splitOnNumbers: true}> =
	'fo_o_2_bar';
expectTypeOf(snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase2).toBe<'fo_o_2_bar'>();

const snakeFromNumberInTheMiddleNoSplitOnNumbers: SnakeCase<'foo2bar'> = 'foo2bar';
expectTypeOf(snakeFromNumberInTheMiddleNoSplitOnNumbers).toBe<'foo2bar'>();

const snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase: SnakeCase<'foo2Bar'> = 'foo2_bar';
expectTypeOf(snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase).toBe<'foo2_bar'>();

const snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2: SnakeCase<'foO2bar'> = 'fo_o2bar';
expectTypeOf(snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2).toBe<'fo_o2bar'>();

const snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3: SnakeCase<'FOO22Bar'> = 'foo22_bar';
expectTypeOf(snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3).toBe<'foo22_bar'>();

// Punctuation
declare const withPunctuation: SnakeCase<'onDialog:close'>;
expectTypeOf(withPunctuation).toBe<'on_dialog:close'>();

declare const withPunctuationSplit: SnakeCase<'onDialog:close', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplit).toBe<'on_dialog_close'>();

declare const withPunctuation2: SnakeCase<'foo-bar>>baz'>;
expectTypeOf(withPunctuation2).toBe<'foo_bar>>baz'>();

declare const withPunctuationSplit2: SnakeCase<'foo-bar>>baz', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplit2).toBe<'foo_bar_baz'>();

declare const withPunctuation3: SnakeCase<'card::after'>;
expectTypeOf(withPunctuation3).toBe<'card::after'>();

declare const withPunctuationSplit3: SnakeCase<'card::after', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplit3).toBe<'card_after'>();

declare const withPunctuation4: SnakeCase<'div.card::after'>;
expectTypeOf(withPunctuation4).toBe<'div.card::after'>();

declare const withPunctuationSplit4: SnakeCase<'div.card::after', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplit4).toBe<'div_card_after'>();

declare const withPunctuationAndNumber: SnakeCase<'foo-bar::01'>;
expectTypeOf(withPunctuationAndNumber).toBe<'foo_bar::01'>();

declare const withPunctuationSplitAndNumber: SnakeCase<'foo-bar::01', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplitAndNumber).toBe<'foo_bar_01'>();

declare const withPunctuationSplitAndNumberSplit: SnakeCase<'foo-bar::01', {splitOnPunctuation: true; splitOnNumbers: true}>;
expectTypeOf(withPunctuationSplitAndNumberSplit).toBe<'foo_bar_01'>();

declare const withPunctuationAndNumberSplit2: SnakeCase<'foo-bar::01', {splitOnNumbers: true}>;
expectTypeOf(withPunctuationAndNumberSplit2).toBe<'foo_bar::01'>();

declare const withPunctuationSplitAndNumberSplit2: SnakeCase<'foo-bar::01', {splitOnNumbers: true; splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplitAndNumberSplit2).toBe<'foo_bar_01'>();

declare const withPunctuationSplitAndNumber2: SnakeCase<'foo-bar::01', {splitOnNumbers: true; splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplitAndNumber2).toBe<'foo_bar_01'>();

// A delimiter is not emitted next to punctuation, so the two never double up. See the note in `DelimiterCase`.
expectTypeOf<SnakeCase<'foo.Bar'>>().toBe<'foo.bar'>();

// An acronym keeps its last capital when the next character is not a lowercase letter, such as punctuation or a character with no case.
expectTypeOf<SnakeCase<'getURL!'>>().toBe<'get_url!'>();
