import {expectAssignable, expectError} from 'tsd';
import type {Opaque} from '../index';

type Value = Opaque<number, 'Value'>;

// We make an explicit cast so we can test the value.
const value: Value = 2 as Value;

// The underlying type of the value is still a number.
expectAssignable<number>(value);

// You cannot modify an opaque value.
expectError<Value>(value + 2); // eslint-disable-line @typescript-eslint/restrict-plus-operands

type WithoutToken = Opaque<number>;
expectAssignable<WithoutToken>(2 as WithoutToken);

// @ts-expect-error
type Person = {
	id: Opaque<number, Person>; // eslint-disable-line @typescript-eslint/no-unused-vars
	name: string;
};

// Failing test for https://github.com/sindresorhus/type-fest/issues/108
// Use `Opaque` value as `Record` index type.
type UUID = Opaque<string, 'UUID'>;
type NormalizedDictionary<T> = Record<UUID, T>;
type Foo = {bar: string};

const userEntities: NormalizedDictionary<Foo> = {
	// @ts-expect-error
	'7dd4a16e-d5ee-454c-b1d0-71e23d9fa70b': {bar: 'John'},
	'6ce31270-31eb-4a72-a9bf-43192d4ab436': {bar: 'Doe'},
};

const johnsId = '7dd4a16e-d5ee-454c-b1d0-71e23d9fa70b' as UUID;

// @ts-expect-error
const userJohn = userEntities[johnsId]; // eslint-disable-line @typescript-eslint/no-unused-vars
/// expectType<Foo>(userJohn);
