import type {CamelCase, CamelCaseOptions, _DefaultCamelCaseOptions} from './camel-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';

/**
Convert a string literal to pascal-case.

Note: `PascalCase` capitalizes the result of `CamelCase`, and `Capitalize` does nothing when the first character has no uppercase form. An underscore has none, so the `preserveLeadingUnderscores` option also turns off the Pascal casing: `PascalCase<'_foo', {preserveLeadingUnderscores: true}>` is `'_foo'`, not `'_Foo'`.

@example
```
import type {PascalCase} from 'type-fest';

// Simple

const someVariable: PascalCase<'foo-bar'> = 'FooBar';
const preserveConsecutiveUppercase: PascalCase<'foo-BAR-baz', {preserveConsecutiveUppercase: true}> = 'FooBARBaz';
const splitOnPunctuation: PascalCase<'foo-bar>>baz', {splitOnPunctuation: true}> = 'FooBarBaz';

// Advanced

type PascalCasedProperties<T> = {
	[K in keyof T as PascalCase<K>]: T[K]
};

type RawOptions = {
	'dry-run': boolean;
	'full_family_name': string;
	foo: number;
	BAR: string;
	QUZ_QUX: number;
	'OTHER-FIELD': boolean;
};

const dbResult: PascalCasedProperties<RawOptions> = {
	DryRun: true,
	FullFamilyName: 'bar.js',
	Foo: 123,
	Bar: 'foo',
	QuzQux: 6,
	OtherField: false,
};
```

@category Change case
@category Template literal
*/
export type PascalCase<Value, Options extends CamelCaseOptions = {}> =
	_PascalCase<Value, ApplyDefaultOptions<CamelCaseOptions, _DefaultCamelCaseOptions, Options>>;

type _PascalCase<Value, Options extends Required<CamelCaseOptions>> = Value extends string
	? IsStringLiteral<Value> extends false
		? Value
		: Capitalize<CamelCase<Value, Options>>
	: Value;

export {};
