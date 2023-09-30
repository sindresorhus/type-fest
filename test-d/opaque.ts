import {expectAssignable, expectNotAssignable, expectNotType, expectType} from 'tsd';
import type {Opaque, UnwrapOpaque, Tagged, UnwrapTagged} from '../index';

type Value = Opaque<number, 'Value'>;

// We make an explicit cast so we can test the value.
const value: Value = 2 as Value;

// The underlying type of the value is still a number.
expectAssignable<number>(value);

// You cannot modify an opaque value (and still get back an opaque value).
expectNotAssignable<Value>(value + 2);

// But you can modify one if you're just treating it as its underlying type.
expectAssignable<number>(value + 2);

type WithoutToken = Opaque<number>;
expectAssignable<WithoutToken>(2 as WithoutToken);

// Verify that the Opaque's token can be the parent type itself.
type Person = {
	id: Opaque<number, Person>;
	name: string;
};
const person = {
	id: 42 as Opaque<number, Person>,
	name: 'Arthur',
};
expectType<Person>(person);

// Failing test for https://github.com/sindresorhus/type-fest/issues/108
// Use `Opaque` value as `Record` index type.
type UUID = Opaque<string, 'UUID'>;
type NormalizedDictionary<T> = Record<UUID, T>;
type Foo = {bar: string};

const userEntities: NormalizedDictionary<Foo> = {
	['7dd4a16e-d5ee-454c-b1d0-71e23d9fa70b' as UUID]: {bar: 'John'},
	['6ce31270-31eb-4a72-a9bf-43192d4ab436' as UUID]: {bar: 'Doe'},
};

const johnsId = '7dd4a16e-d5ee-454c-b1d0-71e23d9fa70b' as UUID;

const userJohn = userEntities[johnsId];
expectType<Foo>(userJohn);

// Remove tag from opaque value.
// Note: This will simply return number as type.
type PlainValue = UnwrapOpaque<Value>;
expectAssignable<PlainValue>(123);

const plainValue: PlainValue = 123 as PlainValue;
expectNotType<Value>(plainValue);

// UnwrapOpque should work even when the token _happens_ to make the Opaque type
// have the same underlying structure as a Tagged type.
expectType<number>(4 as UnwrapOpaque<Opaque<number, {x: void}>>);

// All the basic tests that apply to Opaque types should pass for Tagged types too.
// See rationale for each test in the Opaque tests above.
//
// Tests around not providing a token, which Tagged requires, or using non-
// `string | number | symbol` tags, which Tagged doesn't support, are excluded.
type TaggedValue = Tagged<number, 'Value'>;
type TaggedUUID = Tagged<string, 'UUID'>;

const taggedValue: TaggedValue = 2 as TaggedValue;
expectAssignable<number>(taggedValue);
expectNotAssignable<TaggedValue>(value + 2);
expectAssignable<number>(value + 2);

const userEntities2: Record<TaggedUUID, Foo> = {
	['7dd4a16e-d5ee-454c-b1d0-71e23d9fa70b' as UUID]: {bar: 'John'},
	['6ce31270-31eb-4a72-a9bf-43192d4ab436' as UUID]: {bar: 'Doe'},
};

const johnsId2 = '7dd4a16e-d5ee-454c-b1d0-71e23d9fa70b' as TaggedUUID;

const userJohn2 = userEntities2[johnsId2];
expectType<Foo>(userJohn2);

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

// A tag that is a union type should be treated as multiple tags.
// This is the only practical-to-implement behavior, given how we're storing the tags.
// However, it's also arguably the desirable behavior, and it's what the TS team planned to implement:
// https://github.com/microsoft/TypeScript/pull/33290#issuecomment-529710519
expectAssignable<Tagged<number, 'Y'>>(4 as Tagged<number, 'X' | 'Y'>);

// UnwrapOpaque and UnwrapTagged both work on Tagged types.
type PlainValueUnwrapOpaque = UnwrapOpaque<TaggedValue>;
type PlainValueUnwrapTagged = UnwrapTagged<TaggedValue>;

const unwrapped1 = 123 as PlainValueUnwrapOpaque;
const unwrapped2 = 123 as PlainValueUnwrapTagged;

expectType<number>(unwrapped1);
expectType<number>(unwrapped2);
