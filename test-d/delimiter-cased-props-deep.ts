import {expectType} from 'tsd';
import {DelimiterCasedPropsDeep} from '../ts41/delimiter-cased-props-deep';

declare const foo: DelimiterCasedPropsDeep<{helloWorld: {fooBar: string}}, '/'>;
expectType<{'hello/world': {'foo/bar': string}}>(foo);

// Verify Example
interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: DelimiterCasedPropsDeep<UserWithFriends, '-'> = {
	'user-info': {
		'user-id': 1,
		'user-name': 'Tom'
	},
	'user-friends': [
		{
			'user-id': 2,
			'user-name': 'Jerry'
		},
		{
			'user-id': 3,
			'user-name': 'Spike'
		}
	]
};
expectType<DelimiterCasedPropsDeep<UserWithFriends, '-'>>(result);
