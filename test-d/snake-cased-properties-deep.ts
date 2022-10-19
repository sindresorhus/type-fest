import {expectTypeOf} from 'expect-type';
import type {SnakeCasedPropertiesDeep} from '../index';

declare const foo: SnakeCasedPropertiesDeep<{helloWorld: {fooBar: string}}>;
expectTypeOf(foo).toEqualTypeOf<{hello_world: {foo_bar: string}}>();

declare const bar: SnakeCasedPropertiesDeep<Set<{fooBar: string}>>;
expectTypeOf(bar).toEqualTypeOf<Set<{foo_bar: string}>>();

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
		reg_exp: new RegExp(/.*/),
	},
	user_friends: [
		{
			user_id: 2,
			user_name: 'Jerry',
			date: new Date(),
			reg_exp: new RegExp(/.*/),
		},
		{
			user_id: 3,
			user_name: 'Spike',
			date: new Date(),
			reg_exp: new RegExp(/.*/),
		},
	],
};
expectTypeOf(result).toEqualTypeOf<SnakeCasedPropertiesDeep<UserWithFriends>>();
