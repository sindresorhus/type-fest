import {CamelCasedPropsDeep} from '../ts41/camel-cased-props-deep';
import {expectType} from 'tsd';

declare const foo: CamelCasedPropsDeep<{
	A: { B: number; C: Array<{ D: string }> };
}>;

expectType<{ a: { b: number; c: Array<{ d: string }> } }>(foo);

// Verify Example
interface User {
	UserId: number;
	UserName: string;
}

interface UserWithFriends {
	UserInfo: User;
	UserFriends: User[];
}

const result: CamelCasedPropsDeep<UserWithFriends> = {
	userInfo: {
		userId: 1,
		userName: 'Tom'
	},
	userFriends: [
		{
			userId: 2,
			userName: 'Jerry'
		},
		{
			userId: 3,
			userName: 'Spike'
		}
	]
};
expectType<CamelCasedPropsDeep<UserWithFriends>>(result);
