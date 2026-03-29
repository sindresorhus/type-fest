import type {_DefaultDelimiterCaseOptions, DelimiterCase} from './delimiter-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {WordsOptions} from './words.d.ts';

/**
Convert a string literal to kebab-case.

This can be useful when, for example, converting a camel-cased object property to a kebab-cased CSS class name or a command-line flag.

@example
```
import type {KebabCase} from 'type-fest';

// Simple
type KebabCase1 = KebabCase<'fooBar'>;
//=> 'foo-bar'

type KebabCase2 = KebabCase<'p2pNetwork', {splitOnNumbers: false}>;
//=> 'p2p-network'

type KebabCase3 = KebabCase<'div.card::after', {splitOnPunctuation: true}>;
//=> 'div-card-after'

// Advanced
type KebabCasedProperties<T> = {
	[K in keyof T as KebabCase<K>]: T[K]
};

type CliOptions = {
	dryRun: boolean;
	includeFile: string;
	foo: number;
};

const rawCliOptions: KebabCasedProperties<CliOptions> = {
	'dry-run': true,
	'include-file': 'bar.js',
	foo: 123,
};
```

@category Change case
@category Template literal
*/
export type KebabCase<
	Value,
	Options extends WordsOptions = {},
> = DelimiterCase<Value, '-', ApplyDefaultOptions<WordsOptions, _DefaultDelimiterCaseOptions, Options>>;

export {};
