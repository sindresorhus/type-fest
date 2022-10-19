import {expectTypeOf} from 'expect-type';
import type {CamelCase, Split} from '../index';

// Split
const prefixSplit: Split<'--very-prefixed', '-'> = ['', '', 'very', 'prefixed'];
expectTypeOf(prefixSplit).toEqualTypeOf<['', '', 'very', 'prefixed']>();

// CamelCase
const camelFromPascal: CamelCase<'FooBar'> = 'fooBar';
expectTypeOf(camelFromPascal).toEqualTypeOf<'fooBar'>();

const camelFromKebab: CamelCase<'foo-bar'> = 'fooBar';
expectTypeOf(camelFromKebab).toEqualTypeOf<'fooBar'>();

const camelFromComplexKebab: CamelCase<'foo-bar-abc-123'> = 'fooBarAbc123';
expectTypeOf(camelFromComplexKebab).toEqualTypeOf<'fooBarAbc123'>();

const camelFromSpace: CamelCase<'foo bar'> = 'fooBar';
expectTypeOf(camelFromSpace).toEqualTypeOf<'fooBar'>();

const camelFromSnake: CamelCase<'foo_bar'> = 'fooBar';
expectTypeOf(camelFromSnake).toEqualTypeOf<'fooBar'>();

const noDelimiterFromMono: CamelCase<'foobar'> = 'foobar';
expectTypeOf(noDelimiterFromMono).toEqualTypeOf<'foobar'>();

const camelFromMixed: CamelCase<'foo-bar_abc xyzBarFoo'> = 'fooBarAbcXyzBarFoo';
expectTypeOf(camelFromMixed).toEqualTypeOf<'fooBarAbcXyzBarFoo'>();

const camelFromVendorPrefixedCssProperty: CamelCase<'-webkit-animation'> = 'webkitAnimation';
expectTypeOf(camelFromVendorPrefixedCssProperty).toEqualTypeOf<'webkitAnimation'>();

const camelFromDoublePrefixedKebab: CamelCase<'--very-prefixed'> = 'veryPrefixed';
expectTypeOf(camelFromDoublePrefixedKebab).toEqualTypeOf<'veryPrefixed'>();

const camelFromRepeatedSeparators: CamelCase<'foo____bar'> = 'fooBar';
expectTypeOf(camelFromRepeatedSeparators).toEqualTypeOf<'fooBar'>();

const camelFromUppercase: CamelCase<'FOO'> = 'foo';
expectTypeOf(camelFromUppercase).toEqualTypeOf<'foo'>();

const camelFromLowercase: CamelCase<'foo'> = 'foo';
expectTypeOf(camelFromLowercase).toEqualTypeOf<'foo'>();

const camelFromScreamingSnakeCase: CamelCase<'FOO_BAR'> = 'fooBar';
expectTypeOf(camelFromScreamingSnakeCase).toEqualTypeOf<'fooBar'>();

const camelFromScreamingKebabCase: CamelCase<'FOO-BAR'> = 'fooBar';
expectTypeOf(camelFromScreamingKebabCase).toEqualTypeOf<'fooBar'>();

// Verifying example
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

expectTypeOf({
	dryRun: true,
	fullFamilyName: 'bar.js',
	foo: 123,
	bar: 'foo',
	quzQux: 6,
	otherField: false,
}).toMatchTypeOf<CamelCasedProperties<RawOptions>>();
