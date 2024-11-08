import {expectType} from 'tsd';
import type {KebabCase} from '../index';

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

const kebabFromMixed: KebabCase<'foo-bar_abc xyzBarFoo'> = 'foo-bar-abc-xyz-bar-foo';
expectType<'foo-bar-abc-xyz-bar-foo'>(kebabFromMixed);

const kebabFromVendorPrefixedCssProperty: KebabCase<'-webkit-animation'> = 'webkit-animation';
expectType<'webkit-animation'>(kebabFromVendorPrefixedCssProperty);

const kebabFromDoublePrefixedKebab: KebabCase<'--very-prefixed'> = 'very-prefixed';
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

const kebabFromNumberInTheMiddleSplitOnNumber: KebabCase<'foo2bar'> = 'foo-2-bar';
expectType<'foo-2-bar'>(kebabFromNumberInTheMiddleSplitOnNumber);

const kebabFromNumberInTheMiddleSplitOnNumberEdgeCase: KebabCase<'foO2Bar'> = 'fo-o-2-bar';
expectType<'fo-o-2-bar'>(kebabFromNumberInTheMiddleSplitOnNumberEdgeCase);

const kebabFromNumberInTheMiddleSplitOnNumberEdgeCase2: KebabCase<'foO2bar'> = 'fo-o-2-bar';
expectType<'fo-o-2-bar'>(kebabFromNumberInTheMiddleSplitOnNumberEdgeCase2);

const kebabFromNumberInTheMiddleNoSplitOnNumber: KebabCase<'foo2bar', {splitOnNumber: false}> = 'foo2bar';
expectType<'foo2bar'>(kebabFromNumberInTheMiddleNoSplitOnNumber);

const kebabFromNumberInTheMiddleNoSplitOnNumberEdgeCase: KebabCase<'foo2Bar', {splitOnNumber: false}> = 'foo2-bar';
expectType<'foo2-bar'>(kebabFromNumberInTheMiddleNoSplitOnNumberEdgeCase);

const kebabFromNumberInTheMiddleNoSplitOnNumberEdgeCase2: KebabCase<'foO2bar', {splitOnNumber: false}> = 'fo-o2bar';
expectType<'fo-o2bar'>(kebabFromNumberInTheMiddleNoSplitOnNumberEdgeCase2);

const kebabFromNumberInTheMiddleNoSplitOnNumberEdgeCase3: KebabCase<'FOO22Bar', {splitOnNumber: false}> = 'foo22-bar';
expectType<'foo22-bar'>(kebabFromNumberInTheMiddleNoSplitOnNumberEdgeCase3);
