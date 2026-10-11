import {expectTypeOf} from 'nz';
import type {ScreamingSnakeCase} from '../index.d.ts';

const snakeFromCamel: ScreamingSnakeCase<'fooBar'> = 'FOO_BAR';
expectTypeOf(snakeFromCamel).toBe<'FOO_BAR'>();

const snakeFromPascal: ScreamingSnakeCase<'FooBar'> = 'FOO_BAR';
expectTypeOf(snakeFromPascal).toBe<'FOO_BAR'>();

const snakeFromKebab: ScreamingSnakeCase<'foo-bar'> = 'FOO_BAR';
expectTypeOf(snakeFromKebab).toBe<'FOO_BAR'>();

const snakeFromSpace: ScreamingSnakeCase<'foo bar'> = 'FOO_BAR';
expectTypeOf(snakeFromSpace).toBe<'FOO_BAR'>();

const snakeFromSnake: ScreamingSnakeCase<'foo_bar'> = 'FOO_BAR';
expectTypeOf(snakeFromSnake).toBe<'FOO_BAR'>();

const noSnakeFromMono: ScreamingSnakeCase<'foobar'> = 'FOOBAR';
expectTypeOf(noSnakeFromMono).toBe<'FOOBAR'>();

const snakeFromCamelPascal: ScreamingSnakeCase<'FooBar'> = 'FOO_BAR';
expectTypeOf(snakeFromCamelPascal).toBe<'FOO_BAR'>();

const snakeFromComplexKebab: ScreamingSnakeCase<'foo-bar-abc-123'> =
	'FOO_BAR_ABC_123';
expectTypeOf(snakeFromComplexKebab).toBe<'FOO_BAR_ABC_123'>();

const snakeFromMixed: ScreamingSnakeCase<'foo-bar_abc xyzBarFoo'> =
	'FOO_BAR_ABC_XYZ_BAR_FOO';
expectTypeOf(snakeFromMixed).toBe<'FOO_BAR_ABC_XYZ_BAR_FOO'>();

const snakeFromVendorPrefixedCssProperty: ScreamingSnakeCase<'-webkit-animation'> =
	'WEBKIT_ANIMATION';
expectTypeOf(snakeFromVendorPrefixedCssProperty).toBe<'WEBKIT_ANIMATION'>();

const snakeFromDoublePrefixedKebab: ScreamingSnakeCase<'--very-prefixed'> =
	'VERY_PREFIXED';
expectTypeOf(snakeFromDoublePrefixedKebab).toBe<'VERY_PREFIXED'>();

const snakeFromRepeatedSeparators: ScreamingSnakeCase<'foo____bar'> = 'FOO_BAR';
expectTypeOf(snakeFromRepeatedSeparators).toBe<'FOO_BAR'>();

const snakeFromUppercase: ScreamingSnakeCase<'FOO'> = 'FOO';
expectTypeOf(snakeFromUppercase).toBe<'FOO'>();

const snakeFromLowercase: ScreamingSnakeCase<'foo'> = 'FOO';
expectTypeOf(snakeFromLowercase).toBe<'FOO'>();

const snakeFromScreamingSnakeCase: ScreamingSnakeCase<'FOO_BAR'> = 'FOO_BAR';
expectTypeOf(snakeFromScreamingSnakeCase).toBe<'FOO_BAR'>();

const snakeFromScreamingKebabCase: ScreamingSnakeCase<'FOO-BAR'> = 'FOO_BAR';
expectTypeOf(snakeFromScreamingKebabCase).toBe<'FOO_BAR'>();

const snakeFromMixed2: ScreamingSnakeCase<'parseHTML'> = 'PARSE_HTML';
expectTypeOf(snakeFromMixed2).toBe<'PARSE_HTML'>();

const snakeFromMixed3: ScreamingSnakeCase<'parseHTMLItem'> = 'PARSE_HTML_ITEM';
expectTypeOf(snakeFromMixed3).toBe<'PARSE_HTML_ITEM'>();

const snakeFromNumberInTheMiddleSplitOnNumbers: ScreamingSnakeCase<'foo2bar', {splitOnNumbers: true}> = 'FOO_2_BAR';
expectTypeOf(snakeFromNumberInTheMiddleSplitOnNumbers).toBe<'FOO_2_BAR'>();

const snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase: ScreamingSnakeCase<'foO2Bar', {splitOnNumbers: true}> = 'FO_O_2_BAR';
expectTypeOf(snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase).toBe<'FO_O_2_BAR'>();

const snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase2: ScreamingSnakeCase<'foO2bar', {splitOnNumbers: true}> = 'FO_O_2_BAR';
expectTypeOf(snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase2).toBe<'FO_O_2_BAR'>();

const snakeFromNumberInTheMiddleNoSplitOnNumbers: ScreamingSnakeCase<'foo2bar'> = 'FOO2BAR';
expectTypeOf(snakeFromNumberInTheMiddleNoSplitOnNumbers).toBe<'FOO2BAR'>();

const snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase: ScreamingSnakeCase<'foo2Bar'> = 'FOO2_BAR';
expectTypeOf(snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase).toBe<'FOO2_BAR'>();

const snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2: ScreamingSnakeCase<'foO2bar'> = 'FO_O2BAR';
expectTypeOf(snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2).toBe<'FO_O2BAR'>();

const snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3: ScreamingSnakeCase<'FOO22Bar'> = 'FOO22_BAR';
expectTypeOf(snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3).toBe<'FOO22_BAR'>();

const nonStringFromNonString: ScreamingSnakeCase<[]> = [];
expectTypeOf(nonStringFromNonString).toBe<[]>();

declare const withPunctuation: ScreamingSnakeCase<'onDialog:close'>;
expectTypeOf(withPunctuation).toBe<'ON_DIALOG:CLOSE'>();

declare const withPunctuationSplit: ScreamingSnakeCase<'onDialog:close', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplit).toBe<'ON_DIALOG_CLOSE'>();

declare const withPunctuation2: ScreamingSnakeCase<'foo-bar>>baz'>;
expectTypeOf(withPunctuation2).toBe<'FOO_BAR>>BAZ'>();

declare const withPunctuationSplit2: ScreamingSnakeCase<'foo-bar>>baz', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplit2).toBe<'FOO_BAR_BAZ'>();

declare const withPunctuation3: ScreamingSnakeCase<'card::after'>;
expectTypeOf(withPunctuation3).toBe<'CARD::AFTER'>();

declare const withPunctuationSplit3: ScreamingSnakeCase<'card::after', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplit3).toBe<'CARD_AFTER'>();

declare const withPunctuation4: ScreamingSnakeCase<'div.card::after'>;
expectTypeOf(withPunctuation4).toBe<'DIV.CARD::AFTER'>();

declare const withPunctuationSplit4: ScreamingSnakeCase<'div.card::after', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplit4).toBe<'DIV_CARD_AFTER'>();

declare const withPunctuationAndNumber: ScreamingSnakeCase<'foo-bar::01'>;
expectTypeOf(withPunctuationAndNumber).toBe<'FOO_BAR::01'>();

declare const withPunctuationAndNumber2: ScreamingSnakeCase<'foo-bar::01', {splitOnNumbers: true}>;
expectTypeOf(withPunctuationAndNumber2).toBe<'FOO_BAR::01'>();

declare const withPunctuationSplitAndNumber: ScreamingSnakeCase<'foo-bar::01', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplitAndNumber).toBe<'FOO_BAR_01'>();

declare const withPunctuationSplitAndNumberSplit: ScreamingSnakeCase<'foo-bar::01', {splitOnNumbers: true; splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplitAndNumberSplit).toBe<'FOO_BAR_01'>();

// A delimiter is not emitted next to punctuation, so the two never double up. See the note in `DelimiterCase`.
expectTypeOf<ScreamingSnakeCase<'foo.Bar'>>().toBe<'FOO.BAR'>();
