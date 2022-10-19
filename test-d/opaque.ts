import {expectTypeOf} from 'expect-type';
import type {Opaque, UnwrapOpaque} from '../index';

type Value = Opaque<number, 'Value'>;

// We make an explicit cast so we can test the value.
const value: Value = 2 as Value;

// The underlying type of the value is still a number.
expectTypeOf(value).toMatchTypeOf<number>();

// You cannot modify an opaque value.
expectTypeOf(value + 2).not.toMatchTypeOf<Value>();

type WithoutToken = Opaque<number>;
expectTypeOf(2 as WithoutToken).toMatchTypeOf<WithoutToken>();

// Verify that the Opaque's token can be the parent type itself.
type Person = {
	id: Opaque<number, Person>;
	name: string;
};
const person = {
	id: 42 as Opaque<number, Person>,
	name: 'Arthur',
};
expectTypeOf(person).toEqualTypeOf<Person>();

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
expectTypeOf(userJohn).toEqualTypeOf<Foo>();

// Remove tag from opaque value.
// Note: This will simply return number as type.
type PlainValue = UnwrapOpaque<Value>;
expectTypeOf<123>().toMatchTypeOf<PlainValue>();

const plainValue: PlainValue = 123 as PlainValue;
expectTypeOf(plainValue).not.toEqualTypeOf<Value>();
