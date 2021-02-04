import {PascalCasedPropsDeep} from '../ts41/pascal-cased-props-deep';
import {expectType} from 'tsd';

declare const foo: PascalCasedPropsDeep<{ helloWorld: { fooBar: string } }>;
expectType<{ HelloWorld: { FooBar: string } }>(foo);

// Verify Example
interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: PascalCasedPropsDeep<UserWithFriends> = {
	UserInfo: {
		UserId: 1,
		UserName: 'Tom'
	},
	UserFriends: [
		{
			UserId: 2,
			UserName: 'Jerry'
		},
		{
			UserId: 3,
			UserName: 'Spike'
		}
	]
};
expectType<PascalCasedPropsDeep<UserWithFriends>>(result);
