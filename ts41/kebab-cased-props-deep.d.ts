import {DelimiterCasedPropsDeep} from './delimiter-cased-props-deep';

/**
Convert object props to kebab-case recursively.

This can be useful when, for example, converting some API types from other style.

@see KebabCase
@see KebabCasedProps
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

const result: KebabCasedPropsDeep<UserWithFriends> = {
	'user-info': {
		'user-id': 1,
		'user-name': "Tom",
	},
	'user-friends': [
		{
			'user-id': 2,
			'user-name': "Jerry",
		},
		{
			'user-id': 3,
			'user-name': "Spike",
		},
	],
};

```
*/
export type KebabCasedPropsDeep<T> = DelimiterCasedPropsDeep<T, '-'>;
