import { PascalCase } from "./pascal-case";

/**
Convert object props to PascalCase recursively.

This can be useful when, for example, converting some API types from other style.

@see PascalCase
@see PascalCasedProperties
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

const result: PascalCasedPropertiesDeep<UserWithFriends> = {
	UserInfo: {
		UserId: 1,
		UserName: 'Tom',
	},
	UserFriends: [
		{
			UserId: 2,
			UserName: 'Jerry',
		},
		{
			UserId: 3,
			UserName: 'Spike',
		},
	],
};

*/
export type PascalCasedPropertiesDeep<Value> = Value extends Function
	? Value
	: Value extends Array<infer U>
	? Array<PascalCasedPropertiesDeep<U>>
	: {
			[K in keyof Value as PascalCase<K>]: PascalCasedPropertiesDeep<Value[K]>;
	  };
