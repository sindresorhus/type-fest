import {expectTypeOf} from 'expect-type';
import type {SnakeCase} from '../index';

const snakeFromCamel: SnakeCase<'fooBar'> = 'foo_bar';
expectTypeOf(snakeFromCamel).toEqualTypeOf<'foo_bar'>();

const snakeFromPascal: SnakeCase<'FooBar'> = 'foo_bar';
expectTypeOf(snakeFromPascal).toEqualTypeOf<'foo_bar'>();

const snakeFromKebab: SnakeCase<'foo-bar'> = 'foo_bar';
expectTypeOf(snakeFromKebab).toEqualTypeOf<'foo_bar'>();

const snakeFromSpace: SnakeCase<'foo bar'> = 'foo_bar';
expectTypeOf(snakeFromSpace).toEqualTypeOf<'foo_bar'>();

const snakeFromSnake: SnakeCase<'foo_bar'> = 'foo_bar';
expectTypeOf(snakeFromSnake).toEqualTypeOf<'foo_bar'>();

const noSnakeFromMono: SnakeCase<'foobar'> = 'foobar';
expectTypeOf(noSnakeFromMono).toEqualTypeOf<'foobar'>();
