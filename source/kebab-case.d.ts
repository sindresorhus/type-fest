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

const someVariable: KebabCase<'fooBar'> = 'foo-bar';
const someVariableNoSplitOnNumbers: KebabCase<'p2pNetwork', {splitOnNumbers: false}> = 'p2p-network';

// Advanced

type KebabCasedProperties<T> = {
	[K in keyof T as KebabCase<K>]: T[K]
};

interface CliOptions {
	dryRun: boolean;
	includeFile: string;
	foo: number;
}

const rawCliOptions: KebabCasedProperties<CliOptions> = {
	'dry-run': true,
	'include-file': 'bar.js',
	foo: 123
};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gaRQIwIY4DCeAzigL5wBmUEIcA5EqgLRUokwMDcAULwHoBcAMqgwAGxT8AxhAB2nOCTooAanijACUgFxxs+IqRQAeBlQgQAQpoYA+OAF5GliC3xQevOYvgqQdU1tHCkAOQgRSWAYAHl5MIBXEBwUKBJ9QwJiMnMwACYwMJQYAHdoAGsGABoMEmi4hOTU9P0qPAkyckcXBgKwFnkS8qgqvkFhAEEAEwA3PHkZFGn+ZjQs4zJpgAVaVFhgDlMAFR6MXgBIAG1MOGB5OAqURAgqOGO4UgNcbJNTTHsAF19McboDeORxvcYGl2ks4IQJMBYmAYMAFCRzhdplBEAAlRLyfQ4KxSBZ8C73GQSRLTFAAMWAemUMC08gA5hS3Pp5M00nxyLIMfAoHhSojkaj0YpMj9NstdhB9mijhKUWiMWd0JcGDjECwoISGPpWYkUNUdVSaXS2EyUMbGJ4AHQAKxINUu3LgAEZ8gBmCHcIA)

@category Change case
@category Template literal
*/
export type KebabCase<
	Value,
	Options extends WordsOptions = {},
> = DelimiterCase<Value, '-', ApplyDefaultOptions<WordsOptions, _DefaultDelimiterCaseOptions, Options>>;

export {};
