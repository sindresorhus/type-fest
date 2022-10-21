import type {SplitWords} from './split-words';

type CamelCaseArray<Words extends string[], Output extends string = ''> = Words extends [
	infer FirstWord extends string,
	...infer RemainingWords extends string[],
]
	? `${Capitalize<FirstWord>}${CamelCaseArray<RemainingWords>}`
	: Output;

/**
Convert a string literal to camel-case.

This can be useful when, for example, converting some kebab-cased command-line flags or a snake-cased database result.

@example
```
import type {CamelCase} from 'type-fest';

// Simple

const someVariable: CamelCase<'foo-bar'> = 'fooBar';

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

@category Change case
@category Template literal
*/
export type CamelCase<Type> = Type extends string
	? Uncapitalize<CamelCaseArray<SplitWords<Type extends Uppercase<Type> ? Lowercase<Type> : Type>>>
	: Type;
