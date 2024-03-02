import {expectAssignable, expectNotAssignable, expectNotType, expectType} from 'tsd';
import type {Tagged, GetTagMetadata, UnwrapTagged, InvariantOf,	SnakeCasedPropertiesDeep} from '../index';

type TaggedValue = Tagged<number, 'Value'>;

// We make an explicit cast so we can test the value.
const value = 2 as TaggedValue;

// The underlying type of the value is still a number.
expectAssignable<number>(value);

// If you modify a tagged value, the result is not still tagged.
expectNotAssignable<TaggedValue>(value + 2);

// But you can modify one if you're just treating it as its underlying type.
expectAssignable<number>(value + 2);

// Verify that a tag's medatadata can be the parent type itself.
type Person = {
	id: Tagged<number, 'PersonId', Person>;
	name: string;
};
const person = {
	id: 42 as Tagged<number, 'PersonId', Person>,
	name: 'Arthur',
};
expectType<Person>(person);

// Failing test for https://github.com/sindresorhus/type-fest/issues/108
// Use `Tagged` value as `Record` index type.
type UUID = Tagged<string, 'UUID'>;
type NormalizedDictionary<T> = Record<UUID, T>;
type Foo = {bar: string};

const userEntities: NormalizedDictionary<Foo> = {
	['7dd4a16e-d5ee-454c-b1d0-71e23d9fa70b' as UUID]: {bar: 'John'},
	['6ce31270-31eb-4a72-a9bf-43192d4ab436' as UUID]: {bar: 'Doe'},
};

const johnsId = '7dd4a16e-d5ee-454c-b1d0-71e23d9fa70b' as UUID;

const userJohn = userEntities[johnsId];
expectType<Foo>(userJohn);

// Tagged types should support multiple tags,
// by intersection or repeated application of Tagged.
type AbsolutePath = Tagged<string, 'AbsolutePath'>;
type NormalizedPath = Tagged<string, 'NormalizedPath'>;
type NormalizedAbsolutePath = AbsolutePath & NormalizedPath;

type UrlString = Tagged<string, 'URL'>;
type SpecialCacheKey = Tagged<UrlString, 'SpecialCacheKey'>;

expectNotAssignable<NormalizedPath>('' as AbsolutePath);
expectNotAssignable<NormalizedAbsolutePath>('' as AbsolutePath);
expectAssignable<AbsolutePath>('' as NormalizedAbsolutePath);
expectAssignable<NormalizedPath>('' as NormalizedAbsolutePath);

expectNotAssignable<SpecialCacheKey>('' as UrlString);
expectAssignable<UrlString>('' as SpecialCacheKey);

// Remove tag from tagged value. UnwrapTagged should work on types with multiple tags.
type PlainValue = UnwrapTagged<TaggedValue>;
expectAssignable<PlainValue>(123);

const unwrapped1 = 123 as UnwrapTagged<TaggedValue>;
const unwrapped2 = '' as UnwrapTagged<NormalizedAbsolutePath>;
expectType<number>(unwrapped1);
expectType<string>(unwrapped2);

const plainValue: PlainValue = 123 as PlainValue;
expectNotType<TaggedValue>(plainValue);

// UnwrapTagged should work on types with multiple tags.
const unwrapped3 = '' as UnwrapTagged<NormalizedAbsolutePath>;
expectType<string>(unwrapped3);

// A tag that is a union type should be treated as multiple tags.
// This is the only practical-to-implement behavior, given how we're storing the tags.
// However, it's also arguably the desirable behavior, and it's what the TS team planned to implement:
// https://github.com/microsoft/TypeScript/pull/33290#issuecomment-529710519
expectAssignable<Tagged<number, 'Y'>>(4 as Tagged<number, 'X' | 'Y'>);

// Tags have no metadata by default
expectType<never>(undefined as unknown as GetTagMetadata<UrlString, 'URL'>);

// Metadata can be accurately recovered
type JsonOf<T> = Tagged<string, 'JSON', T>;
expectType<number>(JSON.parse('43') as GetTagMetadata<JsonOf<number>, 'JSON'>);

// It's a type error to try to get the metadata for a tag that doesn't exist on a type.
// @ts-expect-error
const _a = '' as GetTagMetadata<UrlString, 'NonExistentTag'>;

// Tagged types should be covariant in their metadata type
expectAssignable<JsonOf<number>>('' as JsonOf<42>);
expectAssignable<JsonOf<number>>('' as JsonOf<number>);
expectNotAssignable<JsonOf<number>>('' as JsonOf<number | string>);

// InvariantOf should work with tag metadata.
expectNotAssignable<JsonOf<InvariantOf<number>>>('' as JsonOf<string | number>);
expectNotAssignable<JsonOf<InvariantOf<number>>>('' as JsonOf<42>);
expectAssignable<JsonOf<InvariantOf<number>>>(
	'' as JsonOf<InvariantOf<number>>,
);

// Test for issue https://github.com/sindresorhus/type-fest/issues/643
type IdType = Tagged<number, 'test'>;
type TestSnakeObject = SnakeCasedPropertiesDeep<{testId: IdType}>;
expectType<TestSnakeObject>({test_id: 2 as IdType});
