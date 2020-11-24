import {
	Split,
	CamelCase
} from '../source/camel-case';
import {expectType, expectAssignable} from 'tsd';

const splitFromMixed: Split<'foo-bar_abc defXyz', '-' | '_' | ' '> = ['foo', 'bar', 'abc', 'defXyz'];
expectType<['foo', 'bar', 'abc', 'defXyz']>(splitFromMixed);

// CamelCase
const camelFromKebab: CamelCase<'foo-bar'> = 'fooBar';
expectType<'fooBar'>(camelFromKebab);

const camelFromComplexKebab: CamelCase<'foo-bar-abc-123'> = 'fooBarAbc123';
expectType<'fooBarAbc123'>(camelFromComplexKebab);

const camelFromSpace: CamelCase<'foo bar'> = 'fooBar';
expectType<'fooBar'>(camelFromSpace);

const camelFromSnake: CamelCase<'foo_bar'> = 'fooBar';
expectType<'fooBar'>(camelFromSnake);

const noDelimiterFromMono: CamelCase<'foobar'> = 'foobar';
expectType<'foobar'>(noDelimiterFromMono);

const camelFromMixed: CamelCase<'foo-bar_abc xyzBarFoo'> = 'fooBarAbcXyzBarFoo';
expectType<'fooBarAbcXyzBarFoo'>(camelFromMixed);

// Verifying example
type CamelCasedProps<T> = {
	[K in keyof T as CamelCase<K>]: T[K]
};

interface RawOptions {
	'dry-run': boolean;
	'full_family_name': string;
	foo: number;
}

expectAssignable<CamelCasedProps<RawOptions>>({
	dryRun: true,
	fullFamilyName: 'bar.js',
	foo: 123
});
