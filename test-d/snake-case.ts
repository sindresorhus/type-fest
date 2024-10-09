import {expectType} from 'tsd';
import type {SnakeCase} from '../index';

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

const snakeFromMixed: SnakeCase<'foo-bar_abc xyzBarFoo'> = 'foo_bar_abc_xyz_bar_foo';
expectType<'foo_bar_abc_xyz_bar_foo'>(snakeFromMixed);

const snakeFromVendorPrefixedCssProperty: SnakeCase<'-webkit-animation'> = 'webkit_animation';
expectType<'webkit_animation'>(snakeFromVendorPrefixedCssProperty);

const snakeFromDoublePrefixedKebab: SnakeCase<'--very-prefixed'> = 'very_prefixed';
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
