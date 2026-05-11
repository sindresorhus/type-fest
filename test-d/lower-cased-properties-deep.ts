import {expectType} from 'tsd';
import type {LowerCasedPropertiesDeep} from '../index.d.ts';

type FooBar = {helloWorld: {p2p: Array<{addressLine1: string}>}};

declare const foo: LowerCasedPropertiesDeep<FooBar>;
expectType<{helloworld: {p2p: Array<{addressline1: string}>}}>(foo);

declare const bar: LowerCasedPropertiesDeep<FooBar, {splitOnNumbers: true}>;
expectType<{helloworld: {p2p: Array<{addressline1: string}>}}>(bar);

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

const result: LowerCasedPropertiesDeep<UserWithFriends> = {
	userinfo: {
		userid: 1,
		username: 'Tom',
		date: new Date(),
		regexp: /.*/,
	},
	userfriends: [
		{
			userid: 2,
			username: 'Jerry',
			date: new Date(),
			regexp: /.*/,
		},
		{
			userid: 3,
			username: 'Spike',
			date: new Date(),
			regexp: /.*/,
		},
	],
};
expectType<LowerCasedPropertiesDeep<UserWithFriends>>(result);
expectType<LowerCasedPropertiesDeep<UserWithFriendsPunctuated, {splitOnPunctuation: true}>>(result);
