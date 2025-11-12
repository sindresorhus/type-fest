import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {Words, WordsOptions} from './words.d.ts';

/**
CamelCase options.

@see {@link CamelCase}
*/
export type CamelCaseOptions = WordsOptions & {
	/**
	Whether to preserved consecutive uppercase letter.

	@default false
	*/
	preserveConsecutiveUppercase?: boolean;
};

export type _DefaultCamelCaseOptions = {
	splitOnNumbers: true;
	preserveConsecutiveUppercase: false;
};

/**
Convert an array of words to camel-case.
*/
type CamelCaseFromArray<
	Words extends string[],
	Options extends Required<CamelCaseOptions>,
	OutputString extends string = '',
> = Words extends [
	infer FirstWord extends string,
	...infer RemainingWords extends string[],
]
	? Options['preserveConsecutiveUppercase'] extends true
		? `${Capitalize<FirstWord>}${CamelCaseFromArray<RemainingWords, Options>}`
		: `${Capitalize<Lowercase<FirstWord>>}${CamelCaseFromArray<RemainingWords, Options>}`
	: OutputString;

/**
Convert a string literal to camel-case.

This can be useful when, for example, converting some kebab-cased command-line flags or a snake-cased database result.

By default, consecutive uppercase letter are preserved. See {@link CamelCaseOptions.preserveConsecutiveUppercase preserveConsecutiveUppercase} option to change this behaviour.

@example
```
import type {CamelCase} from 'type-fest';

// Simple

const someVariable: CamelCase<'foo-bar'> = 'fooBar';
const preserveConsecutiveUppercase: CamelCase<'foo-BAR-baz', {preserveConsecutiveUppercase: true}> = 'fooBARBaz';

// Advanced

type CamelCasedProperties<T> = {
	[K in keyof T as CamelCase<K>]: T[K]
};

interface RawOptions {
	'dry-run': boolean;
	'full_family_name': string;
	foo: number;
	BAR: string;
	QUZ_QUX: number;
	'OTHER-FIELD': boolean;
}

const dbResult: CamelCasedProperties<RawOptions> = {
	dryRun: true,
	fullFamilyName: 'bar.js',
	foo: 123,
	bar: 'foo',
	quzQux: 6,
	otherField: false
};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gYQIYhQGxwGcUBfOAMyghDgHIlUBaClImOgbgChuB6PnADKoMPhS8AxhAB27OERooAatijBsAI3EAuODjyFsJADx0KECE01q6APjgBeehYgAhWz2lz4YKGxQoADcUTFkSSQBXGGAQgFUwVChJYxQ9AwJiFDNXJjcAQQAla2wALzoAGgw-AODQ8JQomPjEwJSSPRgoSLIHZ3NLAsKPcp5+QXyAEyDsGUkUSd5GNAyjEkmABWokmLYTABU+jG4ASABtAGk4YBk4AGsURAgKOH24Y31cTNSTC7sAXT0+0u-24pDGNxggQo2HmcEK2AA7gB5MAxcLHE50SZQRBMboyOh6TSWcSzHhYiiRfD4AD6MJAwHwiFpMi+RIUXRuAHMKa49DJIiBNIEKUM9Ox1DJeacAIpxABatPlAA0BUKRVAKXRkfsABIAUWKADEAJIGgAyABEOSSIGSZDxSFJwvBJppCmxqTB0l81gsthAdsA9giUWjgOEjuhTjjEIVIjJOt0UBVTlSacbcEzEAA5L56Og2KAAOgAVkRKunLHoAIwAJgAzGmTsXC64qycAI6RUqyyIADz0ADYWxAYAALQLGkP4SZ6GH4EhgzhAA)

@category Change case
@category Template literal
*/
export type CamelCase<Type, Options extends CamelCaseOptions = {}> = Type extends string
	? string extends Type
		? Type
		: Uncapitalize<CamelCaseFromArray<
			Words<Type extends Uppercase<Type> ? Lowercase<Type> : Type, Options>,
			ApplyDefaultOptions<CamelCaseOptions, _DefaultCamelCaseOptions, Options>
		>>
	: Type;

export {};
