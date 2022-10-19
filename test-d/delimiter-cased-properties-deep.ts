import {expectTypeOf} from 'expect-type';
import type {DelimiterCasedPropertiesDeep} from '../index';

declare const foo: DelimiterCasedPropertiesDeep<{helloWorld: {fooBar: string}}, '/'>;
expectTypeOf(foo).toEqualTypeOf<{'hello/world': {'foo/bar': string}}>();

declare const fooBar: DelimiterCasedPropertiesDeep<() => {a: string}, '/'>;
expectTypeOf(fooBar).toEqualTypeOf<() => {a: string}>();

declare const bar: DelimiterCasedPropertiesDeep<Set<{fooBar: string}>, '-'>;
expectTypeOf(bar).toEqualTypeOf<Set<{'foo-bar': string}>>();

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
		'reg-exp': new RegExp(/.*/),
	},
	'user-friends': [
		{
			'user-id': 2,
			'user-name': 'Jerry',
			date: new Date(),
			'reg-exp': new RegExp(/.*/),
		},
		{
			'user-id': 3,
			'user-name': 'Spike',
			date: new Date(),
			'reg-exp': new RegExp(/.*/),
		},
	],
};
expectTypeOf(result).toEqualTypeOf<DelimiterCasedPropertiesDeep<UserWithFriends, '-'>>();
