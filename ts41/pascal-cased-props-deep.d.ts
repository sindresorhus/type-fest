import {PascalCase} from './pascal-case';

/**
Convert object props to PascalCase recursively.

This can be useful when, for example, converting some API types from other style.

@see PascalCase
@see PascalCasedProps
@example
```
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
		UserName: "Tom",
	},
	UserFriends: [
		{
			UserId: 2,
			UserName: "Jerry",
		},
		{
			UserId: 3,
			UserName: "Spike",
		},
	],
};

*/
export type PascalCasedPropsDeep<T> = T extends Array<infer U>
	? Array<PascalCasedPropsDeep<U>>
	: {
			[K in keyof T as PascalCase<K>]: PascalCasedPropsDeep<T[K]>;
	};
