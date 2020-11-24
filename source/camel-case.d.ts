import {WordSeparators} from './delimiter-case';

type Split<S extends string, D extends string> =
  string extends S ? string[] :
  S extends '' ? [] :
  S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] :
  [S];

type InnerCamelCaseStringArray<Parts extends any[]> =
  Parts extends [`${infer FirstPart}`, ...infer RemainingParts]
    ? FirstPart extends undefined
      ? ''
      : `${Capitalize<FirstPart>}${InnerCamelCaseStringArray<RemainingParts>}`
    : '';

type CamelCaseStringArray<Parts extends string[]> =
  Parts extends [`${infer FirstPart}`, ...infer RemainingParts]
    ? `${FirstPart}${InnerCamelCaseStringArray<RemainingParts>}`
    : never;

/**
Converts a string literal from any typical non-camel-case casing to camel-case

This can be useful when eg. converting some kebab cased CLI options or a snake cased database result

@example
```
import {CamelCase} from 'type-fest';

type CamelCasedProps<T> = {
	[K in keyof T as CamelCase<K>]: T[K]
};

interface RawOptions {
	'dry-run': boolean;
	'full_family_name': string;
	foo: number;
}

const dbResult: CamelCasedProps<ModelProps> = {
	dryRun: true,
	fullFamilyName: 'bar.js',
	foo: 123
};
```
*/
export type CamelCase<K> = K extends string ? CamelCaseStringArray<Split<K, WordSeparators>> : K;
