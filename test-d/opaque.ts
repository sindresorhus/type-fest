import {expectTypeOf} from 'nz';
import type {Opaque, UnwrapOpaque, Tagged, GetTagMetadata, UnwrapTagged, InvariantOf,	SnakeCasedPropertiesDeep} from '../index.d.ts';

type Value = Opaque<number, 'Value'>;

// We make an explicit cast so we can test the value.
const value: Value = 2 as Value;

// The underlying type of the value is still a number.
expectTypeOf(value).toBeAssignableTo<number>();

// You cannot modify an opaque value (and still get back an opaque value).
expectTypeOf(value + 2).not.toBeAssignableTo<Value>();

// But you can modify one if you're just treating it as its underlying type.
expectTypeOf(value + 2).toBeAssignableTo<number>();

type WithoutToken = Opaque<number>;
expectTypeOf(2 as WithoutToken).toBeAssignableTo<WithoutToken>();

// Verify that the Opaque's token can be the parent type itself.
type Person = {
	id: Opaque<number, Person>;
	name: string;
};
const person = {
	id: 42 as Opaque<number, Person>,
	name: 'Arthur',
};
expectTypeOf(person).toBe<Person>();

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
expectTypeOf(userJohn).toBe<Foo | undefined>();

// Remove tag from opaque value.
// Note: This will simply return number as type.
type PlainValue = UnwrapOpaque<Value>;
expectTypeOf<123>().toBeAssignableTo<PlainValue>();

const plainValue: PlainValue = 123 as PlainValue;
expectTypeOf(plainValue).not.toBe<Value>();

// UnwrapOpque should work even when the token _happens_ to make the Opaque type
// have the same underlying structure as a Tagged type.
expectTypeOf(4 as UnwrapOpaque<Opaque<number, {x: void}>>).toBe<number>();

// All the basic tests that apply to Opaque types should pass for Tagged types too.
// See rationale for each test in the Opaque tests above.
//
// Tests around not providing a token, which Tagged requires, or using non-
// `string | number | symbol` tags, which Tagged doesn't support, are excluded.
type TaggedValue = Tagged<number, 'Value'>;
type TaggedUUID = Tagged<string, 'UUID'>;

const taggedValue: TaggedValue = 2 as TaggedValue;
expectTypeOf(taggedValue).toBeAssignableTo<number>();
expectTypeOf(value + 2).not.toBeAssignableTo<TaggedValue>();
expectTypeOf(value + 2).toBeAssignableTo<number>();

const userEntities2: Record<TaggedUUID, Foo> = {
	['7dd4a16e-d5ee-454c-b1d0-71e23d9fa70b' as UUID]: {bar: 'John'},
	['6ce31270-31eb-4a72-a9bf-43192d4ab436' as UUID]: {bar: 'Doe'},
};

const johnsId2 = '7dd4a16e-d5ee-454c-b1d0-71e23d9fa70b' as TaggedUUID;

const userJohn2 = userEntities2[johnsId2];
expectTypeOf(userJohn2).toBe<Foo | undefined>();

// Tagged types should support multiple tags,
// by intersection or repeated application of Tagged.
type AbsolutePath = Tagged<string, 'AbsolutePath'>;
type NormalizedPath = Tagged<string, 'NormalizedPath'>;
type NormalizedAbsolutePath = AbsolutePath & NormalizedPath;

type UrlString = Tagged<string, 'URL'>;
type SpecialCacheKey = Tagged<UrlString, 'SpecialCacheKey'>;

expectTypeOf('' as AbsolutePath).not.toBeAssignableTo<NormalizedPath>();
expectTypeOf('' as AbsolutePath).not.toBeAssignableTo<NormalizedAbsolutePath>();
expectTypeOf('' as NormalizedAbsolutePath).toBeAssignableTo<AbsolutePath>();
expectTypeOf('' as NormalizedAbsolutePath).toBeAssignableTo<NormalizedPath>();

expectTypeOf('' as UrlString).not.toBeAssignableTo<SpecialCacheKey>();
expectTypeOf('' as SpecialCacheKey).toBeAssignableTo<UrlString>();

// A tag that is a union type should be treated as multiple tags.
// This is the only practical-to-implement behavior, given how we're storing the tags.
// However, it's also arguably the desirable behavior, and it's what the TS team planned to implement:
// https://github.com/microsoft/TypeScript/pull/33290#issuecomment-529710519
expectTypeOf(4 as Tagged<number, 'X' | 'Y'>).toBeAssignableTo<Tagged<number, 'Y'>>();

// UnwrapOpaque and UnwrapTagged both work on Tagged types.
type PlainValueUnwrapOpaque = UnwrapOpaque<TaggedValue>;
type PlainValueUnwrapTagged = UnwrapTagged<TaggedValue>;

const unwrapped1 = 123 as PlainValueUnwrapOpaque;
const unwrapped2 = 123 as PlainValueUnwrapTagged;

expectTypeOf(unwrapped1).toBe<number>();
expectTypeOf(unwrapped2).toBe<number>();

// UnwrapTagged/UnwrapOpaque should work on types with multiple tags.
const unwrapped3 = '' as UnwrapTagged<NormalizedAbsolutePath>;
const unwrapped4 = '' as UnwrapOpaque<NormalizedAbsolutePath>;
expectTypeOf(unwrapped3).toBe<string>();
expectTypeOf(unwrapped4).toBe<string>();

// Tags have no metadata by default
expectTypeOf(undefined as unknown as GetTagMetadata<UrlString, 'URL'>).toBe<never>();

// Metadata can be accurately recovered
type JsonOf<T> = Tagged<string, 'JSON', T>;
expectTypeOf(JSON.parse('43') as GetTagMetadata<JsonOf<number>, 'JSON'>).toBe<number>();

// It's a type error to try to get the metadata for a tag that doesn't exist on a type.
// @ts-expect-error
const _a = '' as GetTagMetadata<UrlString, 'NonExistentTag'>;

// Tagged types should be covariant in their metadata type
expectTypeOf('' as JsonOf<42>).toBeAssignableTo<JsonOf<number>>();
expectTypeOf('' as JsonOf<number>).toBeAssignableTo<JsonOf<number>>();
expectTypeOf('' as JsonOf<number | string>).not.toBeAssignableTo<JsonOf<number>>();

// InvariantOf should work with tag metadata.
expectTypeOf('' as JsonOf<string | number>).not.toBeAssignableTo<JsonOf<InvariantOf<number>>>();
expectTypeOf('' as JsonOf<42>).not.toBeAssignableTo<JsonOf<InvariantOf<number>>>();
expectTypeOf(
	'' as JsonOf<InvariantOf<number>>,
).toBeAssignableTo<JsonOf<InvariantOf<number>>>();

// Test for issue https://github.com/sindresorhus/type-fest/issues/643
type IdType = Opaque<number, 'test'>;
type TestSnakeObject = SnakeCasedPropertiesDeep<{testId: IdType}>;
expectTypeOf({test_id: 2 as IdType}).toBe<TestSnakeObject>();
