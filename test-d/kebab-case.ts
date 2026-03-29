import {expectType} from 'tsd';
import type {KebabCase} from '../index.d.ts';

const kebabFromCamel: KebabCase<'fooBar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromCamel);

const kebabFromPascal: KebabCase<'FooBar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromPascal);

const kebabFromKebab: KebabCase<'foo-bar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromKebab);

const kebabFromSpace: KebabCase<'foo bar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromSpace);

const kebabFromSnake: KebabCase<'foo_bar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromSnake);

const noKebabFromMono: KebabCase<'foobar'> = 'foobar';
expectType<'foobar'>(noKebabFromMono);

const kebabFromCamelPascal: KebabCase<'FooBar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromCamelPascal);

const kebabFromComplexKebab: KebabCase<'foo-bar-abc-123'> = 'foo-bar-abc-123';
expectType<'foo-bar-abc-123'>(kebabFromComplexKebab);

const kebabFromMixed: KebabCase<'foo-bar_abc xyzBarFoo'>
	= 'foo-bar-abc-xyz-bar-foo';
expectType<'foo-bar-abc-xyz-bar-foo'>(kebabFromMixed);

const kebabFromVendorPrefixedCssProperty: KebabCase<'-webkit-animation'>
	= 'webkit-animation';
expectType<'webkit-animation'>(kebabFromVendorPrefixedCssProperty);

const kebabFromDoublePrefixedKebab: KebabCase<'--very-prefixed'>
	= 'very-prefixed';
expectType<'very-prefixed'>(kebabFromDoublePrefixedKebab);

const kebabFromRepeatedSeparators: KebabCase<'foo____bar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromRepeatedSeparators);

const kebabFromUppercase: KebabCase<'FOO'> = 'foo';
expectType<'foo'>(kebabFromUppercase);

const kebabFromLowercase: KebabCase<'foo'> = 'foo';
expectType<'foo'>(kebabFromLowercase);

const kebabFromScreamingSnakeCase: KebabCase<'FOO_BAR'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromScreamingSnakeCase);

const kebabFromScreamingKebabCase: KebabCase<'FOO-BAR'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromScreamingKebabCase);

const kebabFromMixed2: KebabCase<'parseHTML'> = 'parse-html';
expectType<'parse-html'>(kebabFromMixed2);

const kebabFromMixed3: KebabCase<'parseHTMLItem'> = 'parse-html-item';
expectType<'parse-html-item'>(kebabFromMixed3);

const kebabFromNumberInTheMiddleSplitOnNumbers: KebabCase<'foo2bar', {splitOnNumbers: true}> = 'foo-2-bar';
expectType<'foo-2-bar'>(kebabFromNumberInTheMiddleSplitOnNumbers);

const kebabFromNumberInTheMiddleSplitOnNumbersEdgeCase: KebabCase<'foO2Bar', {splitOnNumbers: true}> = 'fo-o-2-bar';
expectType<'fo-o-2-bar'>(kebabFromNumberInTheMiddleSplitOnNumbersEdgeCase);

const kebabFromNumberInTheMiddleSplitOnNumbersEdgeCase2: KebabCase<'foO2bar', {splitOnNumbers: true}> = 'fo-o-2-bar';
expectType<'fo-o-2-bar'>(kebabFromNumberInTheMiddleSplitOnNumbersEdgeCase2);

const kebabFromNumberInTheMiddleNoSplitOnNumbers: KebabCase<'foo2bar'> = 'foo2bar';
expectType<'foo2bar'>(kebabFromNumberInTheMiddleNoSplitOnNumbers);

const kebabFromNumberInTheMiddleNoSplitOnNumbersEdgeCase: KebabCase<'foo2Bar'> = 'foo2-bar';
expectType<'foo2-bar'>(kebabFromNumberInTheMiddleNoSplitOnNumbersEdgeCase);

const kebabFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2: KebabCase<'foO2bar'> = 'fo-o2bar';
expectType<'fo-o2bar'>(kebabFromNumberInTheMiddleNoSplitOnNumbersEdgeCase2);

const kebabFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3: KebabCase<'FOO22Bar'> = 'foo22-bar';
expectType<'foo22-bar'>(kebabFromNumberInTheMiddleNoSplitOnNumbersEdgeCase3);

// Punctuation
expectType<KebabCase<'onDialog:close'>>('on-dialog:close');
expectType<KebabCase<'foo-bar>>baz'>>('foo-bar>>baz');
expectType<KebabCase<'card::after'>>('card::after');
expectType<KebabCase<'div.card::after'>>('div.card::after');

expectType<KebabCase<'onDialog:close', {splitOnPunctuation: true}>>('on-dialog-close');
expectType<KebabCase<'foo-bar>>baz', {splitOnPunctuation: true}>>('foo-bar-baz');
expectType<KebabCase<'card::after', {splitOnPunctuation: true}>>('card-after');
expectType<KebabCase<'div.card::after', {splitOnPunctuation: true}>>('div-card-after');

// Punctuation with number
expectType<KebabCase<'foo-bar::01'>>('foo-bar::01');
expectType<KebabCase<'foo-bar::01', {splitOnNumbers: true}>>('foo-bar::-01');

expectType<KebabCase<'foo-bar::01', {splitOnPunctuation: true, splitOnNumbers:false}>>('foo-bar-01');
expectType<KebabCase<'foo-bar::01', {splitOnNumbers: true; splitOnPunctuation: true}>>('foo-bar-01');

