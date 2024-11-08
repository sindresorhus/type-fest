import type {SplitWords, SplitWordsOptions} from './split-words';

/**
Convert an array of words to delimiter case starting with a delimiter with input capitalization.
*/
type DelimiterCaseFromArray<
	Words extends string[],
	Delimiter extends string,
	OutputString extends string = '',
> = Words extends [
	infer FirstWord extends string,
	...infer RemainingWords extends string[],
]
	? `${Delimiter}${FirstWord}${DelimiterCaseFromArray<RemainingWords, Delimiter>}`
	: OutputString;

type RemoveFirstLetter<S extends string> = S extends `${infer _}${infer Rest}` ? Rest : '';

/**
Convert a string literal to a custom string delimiter casing.

This can be useful when, for example, converting a camel-cased object property to an oddly cased one.

@see KebabCase
@see SnakeCase

@example
```
import type {DelimiterCase} from 'type-fest';

// Simple

const someVariable: DelimiterCase<'fooBar', '#'> = 'foo#bar';
const someVariableNoSplitOnNumber: DelimiterCase<'p2pNetwork', '#', {splitOnNumber: false}> = 'p2p#network';

// Advanced

type OddlyCasedProperties<T> = {
	[K in keyof T as DelimiterCase<K, '#'>]: T[K]
};

interface SomeOptions {
	dryRun: boolean;
	includeFile: string;
	foo: number;
}

const rawCliOptions: OddlyCasedProperties<SomeOptions> = {
	'dry#run': true,
	'include#file': 'bar.js',
	foo: 123
};
```

@category Change case
@category Template literal
 */
export type DelimiterCase<Value, Delimiter extends string, Options extends SplitWordsOptions = {splitOnNumber: true}> = Value extends string
	? string extends Value
		? Value
		: Lowercase<RemoveFirstLetter<DelimiterCaseFromArray<SplitWords<Value, Options>, Delimiter>>>
	: Value;
