import type {CamelCase, CamelCaseOptions, DefaultCamelCaseOptions} from './camel-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';

/**
Converts a string literal to pascal-case.

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

@category Change case
@category Template literal
*/
export type PascalCase<Value, Options extends CamelCaseOptions = {}> =
	_PascalCase<Value, ApplyDefaultOptions<CamelCaseOptions, DefaultCamelCaseOptions, Options>>;

type _PascalCase<Value, Options extends Required<CamelCaseOptions>> = CamelCase<Value, Options> extends string
	? Capitalize<CamelCase<Value, Options>>
	: CamelCase<Value, Options>;
