import type {ApplyDefaultOptions, UnwrapBrand} from './internal/index.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';
import type {_DefaultWordsOptions, Words, WordsOptions} from './words.d.ts';

/**
CamelCase options.

@see {@link CamelCase}
*/
export type CamelCaseOptions = WordsOptions & {
	/**
	Whether to preserved consecutive uppercase letter.

	Note: A string that is entirely uppercase, such as `'FOO_BAR'`, is lowercased before it is split into words, so the option has no effect on it and the result is `'fooBar'` either way. This keeps `CamelCase<'FOO_BAR'>` the same regardless of the option.

	@default false
	*/
	preserveConsecutiveUppercase?: boolean;

	/**
	Whether to preserve leading underscores.

	This matches the behavior of the [`camelcase`](https://github.com/sindresorhus/camelcase) package v9+.

	@default false
	*/
	preserveLeadingUnderscores?: boolean;
};

export type _DefaultCamelCaseOptions = _DefaultWordsOptions & {
	preserveConsecutiveUppercase: false;
	preserveLeadingUnderscores: false;
};

/**
Extract leading underscores from a string.

@example
```
type A = LeadingUnderscores<'__foo_bar'>;
//=> '__'

type B = LeadingUnderscores<'foo_bar'>;
//=> ''
```
*/
type LeadingUnderscores<Type extends string, Underscores extends string = ''> =
	Type extends `_${infer Rest}`
		? LeadingUnderscores<Rest, `_${Underscores}`>
		: Underscores;

/**
Convert an array of words to camel-case.

The first word is uncapitalized and every other word is capitalized. The first word is never capitalized and then uncapitalized again, because `Capitalize<'ß'>` is `'SS'` and `Uncapitalize<'SS'>` is `'sS'`.
*/
type CamelCaseFromArray<
	Words extends string[],
	Options extends Required<CamelCaseOptions>,
	OutputString extends string = '',
> = Words extends [
	infer FirstWord extends string,
	...infer RemainingWords extends string[],
]
	? (Options['preserveConsecutiveUppercase'] extends true ? FirstWord : Lowercase<FirstWord>) extends infer Word extends string
		? CamelCaseFromArray<RemainingWords, Options, OutputString extends '' ? Uncapitalize<Word> : `${OutputString}${Capitalize<Word>}`>
		: never
	: OutputString;

/**
Convert a string literal to camel-case.

This can be useful when, for example, converting some kebab-cased command-line flags or a snake-cased database result.

By default, consecutive uppercase letter are not preserved. See {@link CamelCaseOptions.preserveConsecutiveUppercase preserveConsecutiveUppercase} option to change this behaviour.

Use the `preserveLeadingUnderscores` option to retain leading underscores, matching the runtime behavior of [`camelcase`](https://github.com/sindresorhus/camelcase) v9+.

@example
```
import type {CamelCase} from 'type-fest';

// Simple

const someVariable: CamelCase<'foo-bar'> = 'fooBar';
const preserveConsecutiveUppercase: CamelCase<'foo-BAR-baz', {preserveConsecutiveUppercase: true}> = 'fooBARBaz';
const splitOnPunctuation: CamelCase<'foo-bar:BAZ', {splitOnPunctuation: true}> = 'fooBarBaz';
const preserveLeadingUnderscores: CamelCase<'_foo_bar', {preserveLeadingUnderscores: true}> = '_fooBar';

// Advanced

type CamelCasedProperties<T> = {
	[K in keyof T as CamelCase<K>]: T[K]
};

type RawOptions = {
	'dry-run': boolean;
	'full_family_name': string;
	foo: number;
	BAR: string;
	QUZ_QUX: number;
	'OTHER-FIELD': boolean;
};

const dbResult: CamelCasedProperties<RawOptions> = {
	dryRun: true,
	fullFamilyName: 'bar.js',
	foo: 123,
	bar: 'foo',
	quzQux: 6,
	otherField: false,
};
```

@category Change case
@category Template literal
*/
export type CamelCase<Type, Options extends CamelCaseOptions = {}> = Type extends string
	? IsStringLiteral<Type> extends false
		? Type
		// The brand is removed first, because the entirely-uppercase pre-lowering and the leading underscores must read the string itself: an intersection with a brand does not reduce under `Uppercase` and does not match `_`. `Words` unwraps its own input too, but only after these have already run.
		: CamelCaseUnbranded<UnwrapBrand<Type>, Options>
	: Type;

type CamelCaseUnbranded<Type extends string, Options extends CamelCaseOptions> = `${Options['preserveLeadingUnderscores'] extends true
	? LeadingUnderscores<Type>
	: ''
}${CamelCaseFromArray<
	Words<Type extends Uppercase<Type> ? Lowercase<Type> : Type, Options>,
	ApplyDefaultOptions<CamelCaseOptions, _DefaultCamelCaseOptions, Options>
>}`;

export {};
