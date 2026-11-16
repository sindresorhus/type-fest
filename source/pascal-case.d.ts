import type {CamelCase, CamelCaseOptions} from './camel-case.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';

/**
Convert a string literal to pascal-case.

Leading underscores are kept, and the first letter after them is capitalized: `PascalCase<'_foo_bar'>` is `'_FooBar'`, like `camelcase('_foo_bar', {pascalCase: true})`. Set the `preserveLeadingUnderscores` option to `false` to remove them.

@example
```
import type {PascalCase} from 'type-fest';

// Simple

const someVariable: PascalCase<'foo-bar'> = 'FooBar';
const preserveConsecutiveUppercase: PascalCase<'foo-BAR-baz', {preserveConsecutiveUppercase: true}> = 'FooBARBaz';
const noSplitOnNumbers: PascalCase<'p2p_network'> = 'P2pNetwork';
const splitOnNumbers: PascalCase<'p2p_network', {splitOnNumbers: true}> = 'P2PNetwork';
const splitOnPunctuation: PascalCase<'foo-bar>>baz'> = 'FooBarBaz';
const noSplitOnPunctuation: PascalCase<'foo-bar>>baz', {splitOnPunctuation: false}> = 'FooBar>>baz';

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
export type PascalCase<Value, Options extends CamelCaseOptions = {}> = Value extends string
	? IsStringLiteral<Value> extends false
		? Value
		: CapitalizeAfterUnderscores<CamelCase<Value, Options>>
	: Value;

/**
Capitalize the first character after the leading underscores, which `CamelCase` keeps by default.
*/
type CapitalizeAfterUnderscores<Value extends string> = Value extends `_${infer Rest}`
	? `_${CapitalizeAfterUnderscores<Rest>}`
	: Capitalize<Value>;

export {};
