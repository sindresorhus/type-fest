import {expectType} from 'tsd';
import type {ScreamingSnakeCase} from '../index';

const screamingSnakeFromCamel: ScreamingSnakeCase<'fooBar'> = 'FOO_BAR';
expectType<'FOO_BAR'>(screamingSnakeFromCamel);

const screamingSnakeFromKebab: ScreamingSnakeCase<'foo-bar'> = 'FOO_BAR';
expectType<'FOO_BAR'>(screamingSnakeFromKebab);

const screamingSnakeFromSpace: ScreamingSnakeCase<'foo bar'> = 'FOO_BAR';
expectType<'FOO_BAR'>(screamingSnakeFromSpace);

const screamingSnakeFromSnake: ScreamingSnakeCase<'foo_bar'> = 'FOO_BAR';
expectType<'FOO_BAR'>(screamingSnakeFromSnake);

const screamingSnakeFromScreamingSnake: ScreamingSnakeCase<'FOO_BAR'> = 'FOO_BAR';
expectType<'FOO_BAR'>(screamingSnakeFromScreamingSnake);

const noScreamingSnakeFromMono: ScreamingSnakeCase<'foobar'> = 'FOOBAR';
expectType<'FOOBAR'>(noScreamingSnakeFromMono);

const nonStringFromNonString: ScreamingSnakeCase<[]> = [];
expectType<[]>(nonStringFromNonString);
