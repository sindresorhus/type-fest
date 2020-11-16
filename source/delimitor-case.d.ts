export type UpperCaseChars = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'X' | 'Y' | 'Z';
export type WordSeparators = '-'|'_'|' ';

export type SplitIncludingDelimitors<Source extends string, Delimitor extends string> =
	Source extends '' ? [] :
	Source extends `${infer FirstPart}${Delimitor}${infer SecondPart}` ?
	(
		Source extends `${FirstPart}${infer UsedDelimitor}${SecondPart}`
			? UsedDelimitor extends Delimitor
				? Source extends `${infer FirstPart}${UsedDelimitor}${infer SecondPart}`
					? [...SplitIncludingDelimitors<FirstPart, Delimitor>, UsedDelimitor, ...SplitIncludingDelimitors<SecondPart, Delimitor>]
					: never
				: never
			: never
	) :
	[Source];

type StringPartToDelimitorCase<StringPart extends string, UsedWordSeparators extends string, UsedUpperCaseChars extends string, Delimitor extends string> =
	StringPart extends UsedWordSeparators ? Delimitor :
	StringPart extends UsedUpperCaseChars ? `${Delimitor}${Lowercase<StringPart>}` :
	StringPart;

type StringArrayToDelimitorCase<Parts extends any[], UsedWordSeparators extends string, UsedUpperCaseChars extends string, Delimitor extends string> =
	Parts extends [`${infer FirstPart}`, ...infer RemainingParts]
		? `${StringPartToDelimitorCase<FirstPart, UsedWordSeparators, UsedUpperCaseChars, Delimitor>}${StringArrayToDelimitorCase<RemainingParts, UsedWordSeparators, UsedUpperCaseChars, Delimitor>}`
		: '';

/**
Converts a string literal that may use another casing than the desired delimitor based casing to the desired casing

This can be useful when eg. converting a camel cased object property to eg. a kebab cased CSS class name or CLI option.

@example
```
import {DelimitorCase, KebabCase, SnakeCase} from 'type-fest';

type KebabCasedProps<T> = {
	[K in keyof T as DelimitorCase<K, '-'>]: T[K]
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

export type DelimitorCase<Value, Delimitor extends string> = Value extends string
	? StringArrayToDelimitorCase<
		SplitIncludingDelimitors<Value, WordSeparators | UpperCaseChars>,
		WordSeparators,
		UpperCaseChars,
		Delimitor
	>
	: Value;

export type KebabCase<Value> = DelimitorCase<Value, '-'>;

export type SnakeCase<Value> = DelimitorCase<Value, '_'>;
