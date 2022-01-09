import {expectType} from 'tsd';
import {SnakeCasedPropertiesDeep} from '../index';

declare const foo: SnakeCasedPropertiesDeep<{helloWorld: {fooBar: string}}>;
expectType<{hello_world: {foo_bar: string}}>(foo);

declare const bar: SnakeCasedPropertiesDeep<Set<{fooBar: string}>>;
expectType<Set<{foo_bar: string}>>(bar);

// Verify example
interface User {
	userId: number;
	userName: string;
	date: Date;
	regExp: RegExp;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

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
expectType<SnakeCasedPropertiesDeep<UserWithFriends>>(result);
