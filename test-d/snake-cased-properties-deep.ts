import {SnakeCasedPropertiesDeep} from '../ts41/snake-cased-properties-deep';
import {expectType} from 'tsd';

declare const foo: SnakeCasedPropertiesDeep<{helloWorld: {fooBar: string}}>;
expectType<{hello_world: {foo_bar: string}}>(foo);

declare const bar: SnakeCasedPropertiesDeep<Set<{fooBar: string}>>;
expectType<Set<{foo_bar: string}>>(bar);

// Verify example
interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: SnakeCasedPropertiesDeep<UserWithFriends> = {
	user_info: {
		user_id: 1,
		user_name: 'Tom'
	},
	user_friends: [
		{
			user_id: 2,
			user_name: 'Jerry'
		},
		{
			user_id: 3,
			user_name: 'Spike'
		}
	]
};
expectType<SnakeCasedPropertiesDeep<UserWithFriends>>(result);
