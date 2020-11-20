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
Converts a string literal that may use another casing than the desired delimiter based casing to the desired casing

This can be useful when eg. converting a camel cased object property to eg. a kebab cased CSS class name or CLI option.

@example
```
import {DelimiterCase, KebabCase, SnakeCase} from 'type-fest';

type KebabCasedProps<T> = {
	[K in keyof T as DelimiterCase<K, '-'>]: T[K]
};

type AlternativeKebabCasedProps<T> = {
	[K in keyof T as KebabCase<K>]: T[K]
};

type SnakeCasedProps<T> = {
	[K in keyof T as SnakeCase<K>]: T[K]
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

export type DelimiterCase<Value, Delimiter extends string> = Value extends string
	? StringArrayToDelimiterCase<
		SplitIncludingDelimiters<Value, WordSeparators | UpperCaseChars>,
		WordSeparators,
		UpperCaseChars,
		Delimiter
	>
	: Value;

export type KebabCase<Value> = DelimiterCase<Value, '-'>;

export type SnakeCase<Value> = DelimiterCase<Value, '_'>;
