import {KebabCase} from '../source/kebab-case';
import {expectType, expectAssignable} from 'tsd';

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

// Verifying example
type KebabCasedProps<T> = {
	[K in keyof T as KebabCase<K>]: T[K]
};

interface CliOptions {
	dryRun: boolean;
	includeFile: string;
	foo: number;
}

expectAssignable<KebabCasedProps<CliOptions>>({
	'dry-run': true,
	'include-file': 'bar.js',
	foo: 123
});
