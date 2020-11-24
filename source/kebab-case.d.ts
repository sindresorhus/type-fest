import {DelimiterCase} from './delimiter-case';

/**
Converts a string literal from any typical non-kebab-case casing to a kebab-cased  casing

This can be useful when eg. converting a camel cased object property to eg. a kebab cased CSS class name or CLI option.

@example
```
import {KebabCase} from 'type-fest';

type KebabCasedProps<T> = {
	[K in keyof T as KebabCase<K>]: T[K]
};

interface CliOptions {
	dryRun: boolean;
	includeFile: string;
	foo: number;
}

const rawCliOptions: KebabCasedProps<CliOptions> = {
	'dry-run': true,
	'include-file': 'bar.js',
	foo: 123
};
```
*/

export type KebabCase<Value> = DelimiterCase<Value, '-'>;
