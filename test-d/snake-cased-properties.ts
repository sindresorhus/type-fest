import {expectTypeOf} from 'nz';
import type {WordsOptions} from '../source/words.d.ts';
import type {SnakeCasedProperties} from '../index.d.ts';

type Foobar = {helloWorld1: {fooBar: string}};
type FoobarPunctuated = {'hello@World1': {'foo::Bar': string}};

declare const foo: SnakeCasedProperties<Foobar>;
expectTypeOf(foo).toBe<{hello_world1: {fooBar: string}}>();

declare const bar: SnakeCasedProperties<Foobar, {splitOnNumbers: true}>;
expectTypeOf(bar).toBe<{hello_world_1: {fooBar: string}}>();

declare const fooBarPunctuated: SnakeCasedProperties<FoobarPunctuated>;
expectTypeOf(fooBarPunctuated).toBe<{'hello@world1': {'foo::Bar': string}}>();

declare const fooBarPunctuatedSplit: SnakeCasedProperties<FoobarPunctuated, {splitOnPunctuation: true}>;
expectTypeOf(fooBarPunctuatedSplit).toBe<{'hello_world1': {'foo::Bar': string}}>();

declare const fooBarPunctuatedSplitNumberSplit: SnakeCasedProperties<FoobarPunctuated, {splitOnPunctuation: true; splitOnNumbers: true}>;
expectTypeOf(fooBarPunctuatedSplitNumberSplit).toBe<{'hello_world_1': {'foo::Bar': string}}>();

// Verify example
type User = {
	userId: number;
	userName: string;
};

type UserPunctuated = {
	'user::Id': number;
	'user::Name': string;
};

const result: SnakeCasedProperties<User> = {
	user_id: 1,
	user_name: 'Tom',
};
expectTypeOf(result).toBe<SnakeCasedProperties<User>>();
expectTypeOf(result).toBe<SnakeCasedProperties<UserPunctuated, {splitOnPunctuation: true}>>();

// Resolving options in the scalar transform keeps selected fields' modifiers and values intact.
expectTypeOf<SnakeCasedProperties<{readonly userId2?: {nestedValue: 1}; mutableValue?: string}, {splitOnNumbers: true; splitOnPunctuation: true}>>()
	.toBe<{readonly user_id_2?: {nestedValue: 1}; mutable_value?: string}>();
expectTypeOf<SnakeCasedProperties<never>>().toBe<never>();
expectTypeOf<SnakeCasedProperties<any>>().toBe<any>();
expectTypeOf<SnakeCasedProperties<unknown>>().toBe<{}>();

function _readGenericPayload<Value>(value: SnakeCasedProperties<{readonly userPayload: Promise<Value>}>): {value: Promise<Value>} {
	return {value: value.user_payload};
}

function _keepGenericCallable<Value, Options extends WordsOptions>(value: () => Value): SnakeCasedProperties<() => Value, Options> {
	return value;
}

declare const copiedModifiers: SnakeCasedProperties<{readonly userId?: number; mutableValue?: string}>;
// @ts-expect-error Recasing a property does not make a readonly field writable.
copiedModifiers.user_id = 1;
copiedModifiers.mutable_value = 'updated';
// @ts-expect-error Optional fields do not admit an explicit undefined.
copiedModifiers.mutable_value = undefined;
