import {expectTypeOf} from 'nz';
import type {WordsOptions} from '../source/words.d.ts';
import type {SnakeCasedPropertiesDeep} from '../index.d.ts';

type FooBar = {helloWorld: {p2p: Array<{addressLine1: string}>}};

declare const foo: SnakeCasedPropertiesDeep<FooBar>;
expectTypeOf(foo).toBe<{hello_world: {p2p: Array<{address_line1: string}>}}>();

declare const bar: SnakeCasedPropertiesDeep<FooBar, {splitOnNumbers: true}>;
expectTypeOf(bar).toBe<{hello_world: {p_2_p: Array<{address_line_1: string}>}}>();

// Verify example
type User = {
	userId: number;
	userName: string;
	date: Date;
	regExp: RegExp;
};

type UserPunctuated = {
	'user::id': number;
	'user::name': string;
	date: Date;
	'reg::exp': RegExp;
};

type UserWithFriends = {
	userInfo: User;
	userFriends: User[];
};

type UserWithFriendsPunctuated = {
	'user@info': UserPunctuated;
	'user#friends': UserPunctuated[];
};

const result: SnakeCasedPropertiesDeep<UserWithFriends> = {
	user_info: {
		user_id: 1,
		user_name: 'Tom',
		date: new Date(),
		reg_exp: /.*/,
	},
	user_friends: [
		{
			user_id: 2,
			user_name: 'Jerry',
			date: new Date(),
			reg_exp: /.*/,
		},
		{
			user_id: 3,
			user_name: 'Spike',
			date: new Date(),
			reg_exp: /.*/,
		},
	],
};
expectTypeOf(result).toBe<SnakeCasedPropertiesDeep<UserWithFriends>>();
expectTypeOf(result).toBe<SnakeCasedPropertiesDeep<UserWithFriendsPunctuated, {splitOnPunctuation: true}>>();

expectTypeOf<SnakeCasedPropertiesDeep<{fooBar: unknown}>>().toBe<{foo_bar: unknown}>();
expectTypeOf<SnakeCasedPropertiesDeep<{fooBar: {barBaz: unknown}; biz: unknown}>>().toBe<{foo_bar: {bar_baz: unknown}; biz: unknown}>();

expectTypeOf<SnakeCasedPropertiesDeep<{Identifiers: {MarketplaceASIN: {MarketplaceId: string; ASIN: string}}}>>().toBe<{identifiers: {marketplace_asin: {marketplace_id: string; asin: string}}}>();

expectTypeOf<SnakeCasedPropertiesDeep<{fooBar: any}>>().toBe<{foo_bar: any}>();
expectTypeOf<SnakeCasedPropertiesDeep<{fooBar: {barBaz: any}; biz: any}>>().toBe<{foo_bar: {bar_baz: any}; biz: any}>();

expectTypeOf<SnakeCasedPropertiesDeep<{'foo::bar': unknown}, {splitOnPunctuation: true}>>().toBe<{'foo_bar': unknown}>();
expectTypeOf<SnakeCasedPropertiesDeep<{'foo::bar': {'bar@baz': unknown}; biz: unknown}, {splitOnPunctuation: true}>>().toBe<{'foo_bar': {'bar_baz': unknown}; biz: unknown}>();

// Resolving options in the scalar transform keeps selected fields' modifiers and values intact.
expectTypeOf<SnakeCasedPropertiesDeep<{readonly userId2?: {nestedValue: 1}; mutableValue?: string}, {splitOnNumbers: true; splitOnPunctuation: true}>>()
	.toBe<{readonly user_id_2?: {nested_value: 1}; mutable_value?: string}>();
expectTypeOf<SnakeCasedPropertiesDeep<never>>().toBe<never>();
expectTypeOf<SnakeCasedPropertiesDeep<any>>().toBe<any>();
expectTypeOf<SnakeCasedPropertiesDeep<unknown>>().toBe<unknown>();

function _readGenericPayload<Value>(value: SnakeCasedPropertiesDeep<{readonly userPayload: Promise<Value>}>): {value: Promise<Value>} {
	return {value: value.user_payload};
}

function _keepGenericCallable<Value, Options extends WordsOptions>(value: () => Value): SnakeCasedPropertiesDeep<() => Value, Options> {
	return value;
}

declare const copiedModifiers: SnakeCasedPropertiesDeep<{readonly userId?: number; mutableValue?: string}>;
// @ts-expect-error Recasing a property does not make a readonly field writable.
copiedModifiers.user_id = 1;
copiedModifiers.mutable_value = 'updated';
// @ts-expect-error Optional fields do not admit an explicit undefined.
copiedModifiers.mutable_value = undefined;
