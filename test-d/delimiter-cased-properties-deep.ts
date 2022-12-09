import {expectType} from 'tsd';
import type {DelimiterCasedPropertiesDeep} from '../index';

declare const foo: DelimiterCasedPropertiesDeep<{helloWorld: {fooBar: string}}, '/'>;
expectType<{'hello/world': {'foo/bar': string}}>(foo);

declare const fooBar: DelimiterCasedPropertiesDeep<() => {a: string}, '/'>;
expectType<() => {a: string}>(fooBar);

declare const bar: DelimiterCasedPropertiesDeep<Set<{fooBar: string}>, '-'>;
expectType<Set<{'foo-bar': string}>>(bar);

// Verify example
type User = {
	userId: number;
	userName: string;
	date: Date;
	regExp: RegExp;
};

type UserWithFriends = {
	userInfo: User;
	userFriends: User[];
};

const result: DelimiterCasedPropertiesDeep<UserWithFriends, '-'> = {
	'user-info': {
		'user-id': 1,
		'user-name': 'Tom',
		date: new Date(),
		'reg-exp': /.*/,
	},
	'user-friends': [
		{
			'user-id': 2,
			'user-name': 'Jerry',
			date: new Date(),
			'reg-exp': /.*/,
		},
		{
			'user-id': 3,
			'user-name': 'Spike',
			date: new Date(),
			'reg-exp': /.*/,
		},
	],
};
expectType<DelimiterCasedPropertiesDeep<UserWithFriends, '-'>>(result);
