type SplitIncludingDelimitor<S extends string, D extends string> =
    string extends S ? string[] :
    S extends '' ? [] :
    S extends `${infer T}${D}${infer U}` ?
    ( S extends `${T}${infer Z}${U}` ? [T, Z, ...SplitIncludingDelimitor<U, D>] : never ) :
    [S];

type Join<S extends any[], D extends string> =
    string[] extends S ? string :
    S extends [`${infer T}`, ...infer U] ?
    U[0] extends undefined ? T : `${T}${D}${Join<U, D>}` :
    '';

type UpperCaseChars = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'X' | 'Y' | 'Z';
type WordSeparators = "-"|"_"|" ";

type StringPartToKebabCase<K extends string, S extends string, L extends string> =
    K extends S ? '-' :
    K extends L ? `-${Lowercase<K>}` :
    K;
type StringArrayToKebabCase<K extends any[], S extends string, L extends string> =
    K extends [`${infer T}`, ...infer U] ? `${StringPartToKebabCase<T, S, L>}${StringArrayToKebabCase<U, S, L>}` :
		'';

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
export type KebabCase<K> = K extends string ? StringArrayToKebabCase<SplitIncludingDelimitor<K, WordSeparators | UpperCaseChars>, WordSeparators, UpperCaseChars> : K;
