import {CamelCasedPropertiesDeep} from '../ts41/camel-cased-properties-deep';
import {expectType} from 'tsd';

declare const foo: CamelCasedPropertiesDeep<{A: {B: number; C: Array<{D: string}>}}>;

expectType<{a: {b: number; c: Array<{d: string}>}}>(foo);

declare const fooBar: CamelCasedPropertiesDeep<() => {a: string}>;
expectType<() => {a: string}>(fooBar);

declare const bar: CamelCasedPropertiesDeep<Set<{fooBar: string}>>;
expectType<Set<{fooBar: string}>>(bar);

// Verify example
interface User {
	UserId: number;
	UserName: string;
}

interface UserWithFriends {
	UserInfo: User;
	UserFriends: User[];
}

const result: CamelCasedPropertiesDeep<UserWithFriends> = {
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
expectType<CamelCasedPropertiesDeep<UserWithFriends>>(result);
