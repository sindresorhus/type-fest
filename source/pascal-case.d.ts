import type {CamelCase, CamelCaseOptions, _DefaultCamelCaseOptions} from './camel-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';

/**
Convert a string literal to pascal-case.

@example
```
import type {PascalCase} from 'type-fest';

// Simple

const someVariable: PascalCase<'foo-bar'> = 'FooBar';
const preserveConsecutiveUppercase: PascalCase<'foo-BAR-baz', {preserveConsecutiveUppercase: true}> = 'FooBARBaz';

// Advanced

type PascalCasedProperties<T> = {
	[K in keyof T as PascalCase<K>]: T[K]
};

interface RawOptions {
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
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gBQIYGcDG2ANgMJ4oC+cAZlBCHAORKoC01KuMjA3AFB8A9ILgBlUGCIoB+CADsucXPRQA1bFGDYARlIBccHAWJlcKADyNqECK20bGAPjgBeJgDEbAIQf9ZC+DAoThQoADcUEnkzfABXGGAIgFUwVChCMwMjQlJyS2tbLwBBACU7bAAvRgAaDCCQ8MjolDiE5NTQjJQDGChYymc3Rk8IYpKfKv4hESKAEzDsOXwUWYEWNGyTclnMOjSEznMAFUGMPgBIAG0AaThgOTgAaxRECGo4I7g8Qzwc0wtro4ALoGI43IF8ChTe4wULUbDLOAlbAAdwA8mAEtEzudGLMoIhWH05IwDNobFJFvxcdRYkQiAB9eEgYBERAMuTYEAoUlKXr3ADm1IKBjksRA2lC1LGBi4mjkQouAEUkgAtBkqgAaovFkqg1MYaKOAAkAKJldwASVNABkACK88kQSlyfhQmTReCzbQlTh0mBZX5bMw7PahA64czI9GY4DRU7oC52gklWJyHp9FDVC7uOlEdxc1mIAByXO6THsUAAdAArXA1HM2AwARgATABmbPnHxQAxWGwN85K2IVYcADwMADYu2iYAALULuYAoIizAzwohmbNQoA)

@category Change case
@category Template literal
*/
export type PascalCase<Value, Options extends CamelCaseOptions = {}> =
	_PascalCase<Value, ApplyDefaultOptions<CamelCaseOptions, _DefaultCamelCaseOptions, Options>>;

type _PascalCase<Value, Options extends Required<CamelCaseOptions>> = CamelCase<Value, Options> extends string
	? Capitalize<CamelCase<Value, Options>>
	: CamelCase<Value, Options>;

export {};
