import {PascalCasedPropertiesDeep} from '../ts41/pascal-cased-properties-deep';
import {expectType} from 'tsd';

declare const foo: PascalCasedPropertiesDeep<{helloWorld: {fooBar: string}}>;
expectType<{HelloWorld: {FooBar: string}}>(foo);

declare const fooBar: PascalCasedPropertiesDeep<() => {a: string}>;
expectType<() => {a: string}>(fooBar);

declare const bar: PascalCasedPropertiesDeep<Set<{fooBar: string}>>;
expectType<Set<{FooBar: string}>>(bar);

// Verify example
interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: PascalCasedPropertiesDeep<UserWithFriends> = {
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
expectType<PascalCasedPropertiesDeep<UserWithFriends>>(result);
