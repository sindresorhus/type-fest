import {expectTypeOf} from 'expect-type';
import type {KebabCase} from '../index';

const kebabFromCamel: KebabCase<'fooBar'> = 'foo-bar';
expectTypeOf(kebabFromCamel).toEqualTypeOf<'foo-bar'>();

const kebabFromKebab: KebabCase<'foo-bar'> = 'foo-bar';
expectTypeOf(kebabFromKebab).toEqualTypeOf<'foo-bar'>();

const kebabFromSpace: KebabCase<'foo bar'> = 'foo-bar';
expectTypeOf(kebabFromSpace).toEqualTypeOf<'foo-bar'>();

const kebabFromSnake: KebabCase<'foo_bar'> = 'foo-bar';
expectTypeOf(kebabFromSnake).toEqualTypeOf<'foo-bar'>();

const noKebabFromMono: KebabCase<'foobar'> = 'foobar';
expectTypeOf(noKebabFromMono).toEqualTypeOf<'foobar'>();
