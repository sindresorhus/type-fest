import {expectType} from 'tsd';
import type {ScreamingSnakeCase} from '../index';

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

const snakeFromComplexKebab: ScreamingSnakeCase<'foo-bar-abc-123'> = 'FOO_BAR_ABC_123';
expectType<'FOO_BAR_ABC_123'>(snakeFromComplexKebab);

const snakeFromMixed: ScreamingSnakeCase<'foo-bar_abc xyzBarFoo'> = 'FOO_BAR_ABC_XYZ_BAR_FOO';
expectType<'FOO_BAR_ABC_XYZ_BAR_FOO'>(snakeFromMixed);

const snakeFromVendorPrefixedCssProperty: ScreamingSnakeCase<'-webkit-animation'> = 'WEBKIT_ANIMATION';
expectType<'WEBKIT_ANIMATION'>(snakeFromVendorPrefixedCssProperty);

const snakeFromDoublePrefixedKebab: ScreamingSnakeCase<'--very-prefixed'> = 'VERY_PREFIXED';
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

const snakeFromNumberInTheMiddleSplitOnNumber: ScreamingSnakeCase<'foo2bar'> = 'FOO_2_BAR';
expectType<'FOO_2_BAR'>(snakeFromNumberInTheMiddleSplitOnNumber);

const snakeFromNumberInTheMiddleSplitOnNumberEdgeCase: ScreamingSnakeCase<'foO2Bar'> = 'FO_O_2_BAR';
expectType<'FO_O_2_BAR'>(snakeFromNumberInTheMiddleSplitOnNumberEdgeCase);

const snakeFromNumberInTheMiddleSplitOnNumberEdgeCase2: ScreamingSnakeCase<'foO2bar'> = 'FO_O_2_BAR';
expectType<'FO_O_2_BAR'>(snakeFromNumberInTheMiddleSplitOnNumberEdgeCase2);

const snakeFromNumberInTheMiddleNoSplitOnNumber: ScreamingSnakeCase<'foo2bar', {splitOnNumber: false}> = 'FOO2BAR';
expectType<'FOO2BAR'>(snakeFromNumberInTheMiddleNoSplitOnNumber);

const snakeFromNumberInTheMiddleNoSplitOnNumberEdgeCase: ScreamingSnakeCase<'foo2Bar', {splitOnNumber: false}> = 'FOO2_BAR';
expectType<'FOO2_BAR'>(snakeFromNumberInTheMiddleNoSplitOnNumberEdgeCase);

const snakeFromNumberInTheMiddleNoSplitOnNumberEdgeCase2: ScreamingSnakeCase<'foO2bar', {splitOnNumber: false}> = 'FO_O2BAR';
expectType<'FO_O2BAR'>(snakeFromNumberInTheMiddleNoSplitOnNumberEdgeCase2);

const nonStringFromNonString: ScreamingSnakeCase<[]> = [];
expectType<[]>(nonStringFromNonString);
