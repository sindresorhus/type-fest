import {
	KebabCase
} from '../ts41/kebab-case';
import {expectType} from 'tsd';

const kebabFromCamel: KebabCase<'fooBar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromCamel);

const kebabFromKebab: KebabCase<'foo-bar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromKebab);

const kebabFromSpace: KebabCase<'foo bar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromSpace);

const kebabFromSnake: KebabCase<'foo_bar'> = 'foo-bar';
expectType<'foo-bar'>(kebabFromSnake);

const noKebabFromMono: KebabCase<'foobar'> = 'foobar';
expectType<'foobar'>(noKebabFromMono);
