import {expectType} from 'tsd';
import type {SnakeCase} from '../index.d.ts';

const snakeFromCamel: SnakeCase<'fooBar'> = 'foo_bar';
expectType<'foo_bar'>(snakeFromCamel);

const snakeFromPascal: SnakeCase<'FooBar'> = 'foo_bar';
expectType<'foo_bar'>(snakeFromPascal);

const snakeFromKebab: SnakeCase<'foo-bar'> = 'foo_bar';
expectType<'foo_bar'>(snakeFromKebab);

const snakeFromSpace: SnakeCase<'foo bar'> = 'foo_bar';
expectType<'foo_bar'>(snakeFromSpace);

const snakeFromSnake: SnakeCase<'foo_bar'> = 'foo_bar';
expectType<'foo_bar'>(snakeFromSnake);

const noSnakeFromMono: SnakeCase<'foobar'> = 'foobar';
expectType<'foobar'>(noSnakeFromMono);

const snakeFromCamelPascal: SnakeCase<'FooBar'> = 'foo_bar';
expectType<'foo_bar'>(snakeFromCamelPascal);

const snakeFromComplexKebab: SnakeCase<'foo-bar-abc-123'> = 'foo_bar_abc_123';
expectType<'foo_bar_abc_123'>(snakeFromComplexKebab);

const snakeFromMixed: SnakeCase<'foo-bar_abc xyzBarFoo'>
	= 'foo_bar_abc_xyz_bar_foo';
expectType<'foo_bar_abc_xyz_bar_foo'>(snakeFromMixed);

const snakeFromVendorPrefixedCssProperty: SnakeCase<'-webkit-animation'>
	= 'webkit_animation';
expectType<'webkit_animation'>(snakeFromVendorPrefixedCssProperty);

const snakeFromDoublePrefixedKebab: SnakeCase<'--very-prefixed'>
	= 'very_prefixed';
expectType<'very_prefixed'>(snakeFromDoublePrefixedKebab);

const snakeFromRepeatedSeparators: SnakeCase<'foo____bar'> = 'foo_bar';
expectType<'foo_bar'>(snakeFromRepeatedSeparators);

const snakeFromUppercase: SnakeCase<'FOO'> = 'foo';
expectType<'foo'>(snakeFromUppercase);

const snakeFromLowercase: SnakeCase<'foo'> = 'foo';
expectType<'foo'>(snakeFromLowercase);

const snakeFromScreamingSnakeCase: SnakeCase<'FOO_BAR'> = 'foo_bar';
expectType<'foo_bar'>(snakeFromScreamingSnakeCase);

const snakeFromScreamingKebabCase: SnakeCase<'FOO-BAR'> = 'foo_bar';
expectType<'foo_bar'>(snakeFromScreamingKebabCase);

const snakeFromMixed2: SnakeCase<'parseHTML'> = 'parse_html';
expectType<'parse_html'>(snakeFromMixed2);

const snakeFromMixed3: SnakeCase<'parseHTMLItem'> = 'parse_html_item';
expectType<'parse_html_item'>(snakeFromMixed3);

const snakeFromNumberInTheMiddleSplitOnNumbers: SnakeCase<'foo2bar', {splitOnNumbers: true}>
	= 'foo_2_bar';
expectType<'foo_2_bar'>(snakeFromNumberInTheMiddleSplitOnNumbers);

const snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase: SnakeCase<'foO2Bar', {splitOnNumbers: true}>
	= 'fo_o_2_bar';
expectType<'fo_o_2_bar'>(snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase);

const snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase2: SnakeCase<'foO2bar', {splitOnNumbers: true}>
	= 'fo_o_2_bar';
expectType<'fo_o_2_bar'>(snakeFromNumberInTheMiddleSplitOnNumbersEdgeCase2);

const snakeFromNumberInTheMiddleNoSplitOnNumbers: SnakeCase<'foo2bar'> = 'foo2bar';
expectType<'foo2bar'>(snakeFromNumberInTheMiddleNoSplitOnNumbers);

const snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase: SnakeCase<'foo2Bar'> = 'foo2_bar';
expectType<'foo2_bar'>(snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase);

const snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2: SnakeCase<'foO2bar'> = 'fo_o2bar';
expectType<'fo_o2bar'>(snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2);

const snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3: SnakeCase<'FOO22Bar'> = 'foo22_bar';
expectType<'foo22_bar'>(snakeFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3);

declare const withPunctuation: SnakeCase<'onDialog:close'>;
expectType<'on_dialog:close'>(withPunctuation);

declare const withPunctuation2: SnakeCase<'foo-bar>>baz'>;
expectType<'foo_bar>>baz'>(withPunctuation2);

declare const withPunctuation3: SnakeCase<'card::after'>;
expectType<'card::after'>(withPunctuation3);

declare const withPunctuation4: SnakeCase<'div.card::after'>;
expectType<'div.card::after'>(withPunctuation4);

declare const withPunctuationAndNumber: SnakeCase<'foo-bar::01'>;
expectType<'foo_bar::01'>(withPunctuationAndNumber);

declare const withPunctuationAndNumber2: SnakeCase<'foo-bar::01', {splitOnNumbers: true}>;
expectType<'foo_bar::_01'>(withPunctuationAndNumber2);
