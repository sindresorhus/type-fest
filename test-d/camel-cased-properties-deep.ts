import {expectType} from 'tsd';
import type {CamelCasedPropertiesDeep} from '../index';

declare const foo: CamelCasedPropertiesDeep<{A: {B: number; C: Array<{D: string}>}}>;

expectType<{a: {b: number; c: Array<{d: string}>}}>(foo);

declare const fooBar: CamelCasedPropertiesDeep<() => {a: string}>;
expectType<() => {a: string}>(fooBar);

declare const bar: CamelCasedPropertiesDeep<Set<{fooBar: string}>>;
expectType<Set<{fooBar: string}>>(bar);

// Verify example
type User = {
	UserId: number;
	UserName: string;
	Date: Date;
	RegExp: RegExp;
};

type UserWithFriends = {
	UserInfo: User;
	UserFriends: User[];
};

const result: CamelCasedPropertiesDeep<UserWithFriends> = {
	userInfo: {
		userId: 1,
		userName: 'Tom',
		date: new Date(),
		regExp: new RegExp(/.*/),
	},
	userFriends: [
		{
			userId: 2,
			userName: 'Jerry',
			date: new Date(),
			regExp: new RegExp(/.*/),
		},
		{
			userId: 3,
			userName: 'Spike',
			date: new Date(),
			regExp: new RegExp(/.*/),
		},
	],
};
expectType<CamelCasedPropertiesDeep<UserWithFriends>>(result);
