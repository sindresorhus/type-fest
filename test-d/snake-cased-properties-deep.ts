import {expectType} from 'tsd';
import type {SnakeCasedPropertiesDeep} from '../index.d.ts';

type FooBar = {helloWorld: {p2p: Array<{addressLine1: string}>}};

declare const foo: SnakeCasedPropertiesDeep<FooBar>;
expectType<{hello_world: {p2p: Array<{address_line1: string}>}}>(foo);

declare const bar: SnakeCasedPropertiesDeep<FooBar, {splitOnNumbers: true}>;
expectType<{hello_world: {p_2_p: Array<{address_line_1: string}>}}>(bar);

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
expectType<SnakeCasedPropertiesDeep<UserWithFriends>>(result);
expectType<SnakeCasedPropertiesDeep<UserWithFriendsPunctuated, {splitOnPunctuation: true}>>(result);

expectType<{foo_bar: unknown}>({} as SnakeCasedPropertiesDeep<{fooBar: unknown}>);
expectType<{foo_bar: {bar_baz: unknown}; biz: unknown}>({} as SnakeCasedPropertiesDeep<{fooBar: {barBaz: unknown}; biz: unknown}>);

expectType<{foo_bar: any}>({} as SnakeCasedPropertiesDeep<{fooBar: any}>);
expectType<{foo_bar: {bar_baz: any}; biz: any}>({} as SnakeCasedPropertiesDeep<{fooBar: {barBaz: any}; biz: any}>);

expectType<{'foo_bar': unknown}>({} as SnakeCasedPropertiesDeep<{'foo::bar': unknown}, {splitOnPunctuation: true}>);
expectType<{'foo_bar': {'bar_baz': unknown}; biz: unknown}>({} as SnakeCasedPropertiesDeep<{'foo::bar': {'bar@baz': unknown}; biz: unknown}, {splitOnPunctuation: true}>);
