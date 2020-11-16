type SplitIncludingDelimitor<Source extends string, Delimitor extends string> =
	string extends Source ? string[] :
	Source extends '' ? [] :
	Source extends `${infer FirstPart}${Delimitor}${infer SecondPart}` ?
	(
		Source extends `${FirstPart}${infer UsedDelimitor}${SecondPart}`
			? [FirstPart, UsedDelimitor, ...SplitIncludingDelimitor<SecondPart, Delimitor>]
			: never
	) :
	[Source];

type UpperCaseChars = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'X' | 'Y' | 'Z';
type WordSeparators = '-'|'_'|' ';

type StringPartToKebabCase<StringPart extends string, UsedWordSeparators extends string, UsedUpperCaseChars extends string> =
	StringPart extends UsedWordSeparators ? '-' :
	StringPart extends UsedUpperCaseChars ? `-${Lowercase<StringPart>}` :
	StringPart;

type StringArrayToKebabCase<Parts extends any[], UsedWordSeparators extends string, UsedUpperCaseChars extends string> =
	Parts extends [`${infer FirstPart}`, ...infer RemainingParts]
		? `${StringPartToKebabCase<FirstPart, UsedWordSeparators, UsedUpperCaseChars>}${StringArrayToKebabCase<RemainingParts, UsedWordSeparators, UsedUpperCaseChars>}`
		: '';

/**
Converts a string literal that may use another casing than kebab casing to kebab casing

This can be useful when eg. converting a camel cased object property to eg. a CSS class name or a CLI option.

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
export type KebabCase<Value> = Value extends string
	? StringArrayToKebabCase<SplitIncludingDelimitor<Value, WordSeparators | UpperCaseChars>, WordSeparators, UpperCaseChars>
	: Value;
