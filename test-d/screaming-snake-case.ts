import {expectType} from 'tsd';
import type {ScreamingSnakeCase} from '../index.d.ts';

const snakeFromCamel: ScreamingSnakeCase<'fooBar'> = 'FOO_BAR';
expectType<'FOO_BAR'>(snakeFromCamel);

const snakeFromPascal: ScreamingSnakeCase<'FooBar'> = 'FOO_BAR';
expectType<'FOO_BAR'>(snakeFromPascal);

const snakeFromKebab: ScreamingSnakeCase<'foo-bar'> = 'FOO_BAR';
expectType<'FOO_BAR'>(snakeFromKebab);

const snakeFromSpace: ScreamingSnakeCase<'foo bar'> = 'FOO_BAR';
expectType<'FOO_BAR'>(snakeFromSpace);

const snakeFromSnake: ScreamingSnakeCase<'foo_bar'> = 'FOO_BAR';
expectType<'FOO_BAR'>(snakeFromSnake);

const noSnakeFromMono: ScreamingSnakeCase<'foobar'> = 'FOOBAR';
expectType<'FOOBAR'>(noSnakeFromMono);

const snakeFromCamelPascal: ScreamingSnakeCase<'FooBar'> = 'FOO_BAR';
expectType<'FOO_BAR'>(snakeFromCamelPascal);

const snakeFromComplexKebab: ScreamingSnakeCase<'foo-bar-abc-123'>
	= 'FOO_BAR_ABC_123';
expectType<'FOO_BAR_ABC_123'>(snakeFromComplexKebab);

const snakeFromMixed: ScreamingSnakeCase<'foo-bar_abc xyzBarFoo'>
	= 'FOO_BAR_ABC_XYZ_BAR_FOO';
expectType<'FOO_BAR_ABC_XYZ_BAR_FOO'>(snakeFromMixed);

const snakeFromVendorPrefixedCssProperty: ScreamingSnakeCase<'-webkit-animation'>
	= 'WEBKIT_ANIMATION';
expectType<'WEBKIT_ANIMATION'>(snakeFromVendorPrefixedCssProperty);

const snakeFromDoublePrefixedKebab: ScreamingSnakeCase<'--very-prefixed'>
	= 'VERY_PREFIXED';
expectType<'VERY_PREFIXED'>(snakeFromDoublePrefixedKebab);

const snakeFromRepeatedSeparators: ScreamingSnakeCase<'foo____bar'> = 'FOO_BAR';
expectType<'FOO_BAR'>(snakeFromRepeatedSeparators);

const snakeFromUppercase: ScreamingSnakeCase<'FOO'> = 'FOO';
expectType<'FOO'>(snakeFromUppercase);

const snakeFromLowercase: ScreamingSnakeCase<'foo'> = 'FOO';
expectType<'FOO'>(snakeFromLowercase);

const snakeFromScreamingSnakeCase: ScreamingSnakeCase<'FOO_BAR'> = 'FOO_BAR';
expectType<'FOO_BAR'>(snakeFromScreamingSnakeCase);

const snakeFromScreamingKebabCase: ScreamingSnakeCase<'FOO-BAR'> = 'FOO_BAR';
expectType<'FOO_BAR'>(snakeFromScreamingKebabCase);

const snakeFromMixed2: ScreamingSnakeCase<'parseHTML'> = 'PARSE_HTML';
expectType<'PARSE_HTML'>(snakeFromMixed2);

const snakeFromMixed3: ScreamingSnakeCase<'parseHTMLItem'> = 'PARSE_HTML_ITEM';
expectType<'PARSE_HTML_ITEM'>(snakeFromMixed3);

const snakeFromNumberInTheMiddleSplitOnNumbers: ScreamingSnakeCase<'foo2bar', {splitOnNumbers: true}> = 'FOO_2_BAR';
expectType<'FOO_2_BAR'>(snakeFromNumberInTheMiddleSplitOnNumbers);

const snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase: ScreamingSnakeCase<'foO2Bar', {splitOnNumbers: true}> = 'FO_O_2_BAR';
expectType<'FO_O_2_BAR'>(snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase);

const snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase2: ScreamingSnakeCase<'foO2bar', {splitOnNumbers: true}> = 'FO_O_2_BAR';
expectType<'FO_O_2_BAR'>(snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase2);

const snakeFromNumberInTheMiddleNoSplitOnNumbers: ScreamingSnakeCase<'foo2bar'> = 'FOO2BAR';
expectType<'FOO2BAR'>(snakeFromNumberInTheMiddleNoSplitOnNumbers);

const snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase: ScreamingSnakeCase<'foo2Bar'> = 'FOO2_BAR';
expectType<'FOO2_BAR'>(snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase);

const snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2: ScreamingSnakeCase<'foO2bar'> = 'FO_O2BAR';
expectType<'FO_O2BAR'>(snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2);

const snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3: ScreamingSnakeCase<'FOO22Bar'> = 'FOO22_BAR';
expectType<'FOO22_BAR'>(snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3);

const nonStringFromNonString: ScreamingSnakeCase<[]> = [];
expectType<[]>(nonStringFromNonString);

declare const withPunctuation: ScreamingSnakeCase<'onDialog:close'>;
expectType<'ON_DIALOG:CLOSE'>(withPunctuation);

declare const withPunctuation2: ScreamingSnakeCase<'foo-bar>>baz'>;
expectType<'FOO_BAR>>BAZ'>(withPunctuation2);

declare const withPunctuation3: ScreamingSnakeCase<'card::after'>;
expectType<'CARD::AFTER'>(withPunctuation3);

declare const withPunctuation4: ScreamingSnakeCase<'div.card::after'>;
expectType<'DIV.CARD::AFTER'>(withPunctuation4);

declare const withPunctuationAndNumber: ScreamingSnakeCase<'foo-bar::01'>;
expectType<'FOO_BAR::01'>(withPunctuationAndNumber);

declare const withPunctuationAndNumber2: ScreamingSnakeCase<'foo-bar::01', {splitOnNumbers: true}>;
expectType<'FOO_BAR::_01'>(withPunctuationAndNumber2);
