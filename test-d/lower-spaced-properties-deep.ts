import {expectType} from 'tsd';
import type {LowerSpacedPropertiesDeep} from '../index.d.ts';

type FooBar = {helloWorld: {p2p: Array<{addressLine1: string}>}};

declare const foo: LowerSpacedPropertiesDeep<FooBar>;
expectType<{'hello world': {p2p: Array<{'address line1': string}>}}>(foo);

declare const bar: LowerSpacedPropertiesDeep<FooBar, {splitOnNumbers: true}>;
expectType<{'hello world': {'p 2 p': Array<{'address line 1': string}>}}>(bar);

type User = {
	userId: number;
	userName: string;
	date: Date;
	regExp: RegExp;
};

type UserPunctuated = {
	'user::id': number;
	'user::name': string;
	date: Date;
	'reg::exp': RegExp;
};

type UserWithFriends = {
	userInfo: User;
	userFriends: User[];
};

type UserWithFriendsPunctuated = {
	'user@info': UserPunctuated;
	'user#friends': UserPunctuated[];
};

const result: LowerSpacedPropertiesDeep<UserWithFriends> = {
	'user info': {
		'user id': 1,
		'user name': 'Tom',
		date: new Date(),
		'reg exp': /.*/,
	},
	'user friends': [
		{
			'user id': 2,
			'user name': 'Jerry',
			date: new Date(),
			'reg exp': /.*/,
		},
		{
			'user id': 3,
			'user name': 'Spike',
			date: new Date(),
			'reg exp': /.*/,
		},
	],
};
expectType<LowerSpacedPropertiesDeep<UserWithFriends>>(result);
expectType<LowerSpacedPropertiesDeep<UserWithFriendsPunctuated, {splitOnPunctuation: true}>>(result);
