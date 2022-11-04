import type {CamelCase, CamelCaseOptions} from './camel-case';

/**
Convert object properties to camel case recursively.

This can be useful when, for example, converting some API types from a different style.

@see CamelCasedProperties
@see CamelCase

@example
```
import type {CamelCasedPropertiesDeep} from 'type-fest';

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
		userName: 'Tom',
	},
	userFriends: [
		{
			userId: 2,
			userName: 'Jerry',
		},
		{
			userId: 3,
			userName: 'Spike',
		},
	],
};
```

@category Change case
@category Template literal
@category Object
*/
export type CamelCasedPropertiesDeep<Value, Options extends CamelCaseOptions = {preserveConsecutiveUppercase: true}> = Value extends Function
	? Value
	: Value extends Array<infer U>
		? Array<CamelCasedPropertiesDeep<U, Options>>
		: Value extends Set<infer U>
			? Set<CamelCasedPropertiesDeep<U, Options>> : {
				[K in keyof Value as CamelCase<K, Options>]: CamelCasedPropertiesDeep<Value[K], Options>;
			};
