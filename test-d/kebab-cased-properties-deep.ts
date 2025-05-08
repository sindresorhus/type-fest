import {expectType} from 'tsd';
import type {KebabCasedPropertiesDeep} from '../index.d.ts';

type FooBar = {helloWorld: {p2p: Array<{addressLine1: string}>}};

declare const foo: KebabCasedPropertiesDeep<FooBar>;
expectType<{'hello-world': {p2p: Array<{'address-line1': string}>}}>(foo);

declare const bar: KebabCasedPropertiesDeep<FooBar, {splitOnNumbers: true}>;
expectType<{'hello-world': {'p-2-p': Array<{'address-line-1': string}>}}>(bar);

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

const result: KebabCasedPropertiesDeep<UserWithFriends> = {
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
expectType<KebabCasedPropertiesDeep<UserWithFriends>>(result);

expectType<{'foo-bar': unknown}>({} as KebabCasedPropertiesDeep<{foo_bar: unknown}>);
expectType<{'foo-bar': {'bar-baz': unknown}; biz: unknown}>({} as KebabCasedPropertiesDeep<{foo_bar: {bar_baz: unknown}; biz: unknown}>);

expectType<{'foo-bar': any}>({} as KebabCasedPropertiesDeep<{foo_bar: any}>);
expectType<{'foo-bar': {'bar-baz': any}; biz: any}>({} as KebabCasedPropertiesDeep<{foo_bar: {bar_baz: any}; biz: any}>);
