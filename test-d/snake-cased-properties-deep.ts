import {expectType} from 'tsd';
import type {SnakeCasedPropertiesDeep} from '../index';

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

type UserWithFriends = {
	userInfo: User;
	userFriends: User[];
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
