import {expectTypeOf} from 'expect-type';
import type {ScreamingSnakeCase} from '../index';

const screamingSnakeFromCamel: ScreamingSnakeCase<'fooBar'> = 'FOO_BAR';
expectTypeOf(screamingSnakeFromCamel).toEqualTypeOf<'FOO_BAR'>();

const screamingSnakeFromKebab: ScreamingSnakeCase<'foo-bar'> = 'FOO_BAR';
expectTypeOf(screamingSnakeFromKebab).toEqualTypeOf<'FOO_BAR'>();

const screamingSnakeFromSpace: ScreamingSnakeCase<'foo bar'> = 'FOO_BAR';
expectTypeOf(screamingSnakeFromSpace).toEqualTypeOf<'FOO_BAR'>();

const screamingSnakeFromSnake: ScreamingSnakeCase<'foo_bar'> = 'FOO_BAR';
expectTypeOf(screamingSnakeFromSnake).toEqualTypeOf<'FOO_BAR'>();

const screamingSnakeFromScreamingSnake: ScreamingSnakeCase<'FOO_BAR'> = 'FOO_BAR';
expectTypeOf(screamingSnakeFromScreamingSnake).toEqualTypeOf<'FOO_BAR'>();

const noScreamingSnakeFromMono: ScreamingSnakeCase<'foobar'> = 'FOOBAR';
expectTypeOf(noScreamingSnakeFromMono).toEqualTypeOf<'FOOBAR'>();

const nonStringFromNonString: ScreamingSnakeCase<[]> = [];
expectTypeOf(nonStringFromNonString).toEqualTypeOf<[]>();
