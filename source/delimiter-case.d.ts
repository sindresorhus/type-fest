export type UpperCaseChars = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'X' | 'Y' | 'Z';
export type WordSeparators = '-' | '_' | ' ';

export type SplitIncludingDelimiters<Source extends string, Delimiter extends string> =
	Source extends '' ? [] :
	Source extends `${infer FirstPart}${Delimiter}${infer SecondPart}` ?
	(
		Source extends `${FirstPart}${infer UsedDelimiter}${SecondPart}`
			? UsedDelimiter extends Delimiter
				? Source extends `${infer FirstPart}${UsedDelimiter}${infer SecondPart}`
					? [...SplitIncludingDelimiters<FirstPart, Delimiter>, UsedDelimiter, ...SplitIncludingDelimiters<SecondPart, Delimiter>]
					: never
				: never
			: never
	) :
	[Source];

type StringPartToDelimiterCase<StringPart extends string, UsedWordSeparators extends string, UsedUpperCaseChars extends string, Delimiter extends string> =
	StringPart extends UsedWordSeparators ? Delimiter :
	StringPart extends UsedUpperCaseChars ? `${Delimiter}${Lowercase<StringPart>}` :
	StringPart;

type StringArrayToDelimiterCase<Parts extends any[], UsedWordSeparators extends string, UsedUpperCaseChars extends string, Delimiter extends string> =
	Parts extends [`${infer FirstPart}`, ...infer RemainingParts]
		? `${StringPartToDelimiterCase<FirstPart, UsedWordSeparators, UsedUpperCaseChars, Delimiter>}${StringArrayToDelimiterCase<RemainingParts, UsedWordSeparators, UsedUpperCaseChars, Delimiter>}`
		: '';

/**
Convert a string literal from any typical casing to one based on a custom delimiter.

This can be useful when, for example, converting a camel-cased object property to an oddly cased one.

Also see KebabCase and SnakeCase.

@example
```
import {DelimiterCase} from 'type-fest';

type OddlyCasedProps<T> = {
	[K in keyof T as DelimiterCase<K, '#'>]: T[K]
};

interface SomeOptions {
	dryRun: boolean;
	includeFile: string;
	foo: number;
}

const rawCliOptions: OddlyCasedProps<SomeOptions> = {
	'dry#run': true,
	'include#file': 'bar.js',
	foo: 123
};
```
*/

export type DelimiterCase<Value, Delimiter extends string> = Value extends string
	? StringArrayToDelimiterCase<
		SplitIncludingDelimiters<Value, WordSeparators | UpperCaseChars>,
		WordSeparators,
		UpperCaseChars,
		Delimiter
	>
	: Value;
