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
