import {expectType} from 'tsd';
import type {CamelCasedPropertiesDeep, Tagged} from '../index';

declare const foo: CamelCasedPropertiesDeep<{A: {B: number; C: Array<{D: string}>}}>;

expectType<{a: {b: number; c: Array<{d: string}>}}>(foo);

declare const fooBar: CamelCasedPropertiesDeep<() => {a: string}>;
expectType<() => {a: string}>(fooBar);

declare const bar: CamelCasedPropertiesDeep<Set<{fooBar: string}>>;
expectType<Set<{fooBar: string}>>(bar);

type bazBizDeep = {fooBAR: number; baz: {fooBAR: Array<{BARFoo: string}>}};

declare const baz: CamelCasedPropertiesDeep<bazBizDeep>;
expectType<{fooBAR: number; baz: {fooBAR: Array<{bARFoo: string}>}}>(baz);

declare const biz: CamelCasedPropertiesDeep<bazBizDeep, {preserveConsecutiveUppercase: false}>;
expectType<{fooBar: number; baz: {fooBar: Array<{barFoo: string}>}}>(biz);

declare const tuple: CamelCasedPropertiesDeep<{tuple: [number, string, {D: string}]}>;
expectType<{tuple: [number, string, {d: string}]}>(tuple);

// Verify example
type UserRole = Tagged<string, 'Role'>;

type User = {
	UserId: number;
	UserName: string;
	Date: Date;
	RegExp: RegExp;
	Role: UserRole;
};

type UserWithFriends = {
	UserInfo: User;
	UserFriends: User[];
};

const role = 'someRole' as UserRole;

const result: CamelCasedPropertiesDeep<UserWithFriends> = {
	userInfo: {
		userId: 1,
		userName: 'Tom',
		date: new Date(),
		regExp: /.*/,
		role,
	},
	userFriends: [
		{
			userId: 2,
			userName: 'Jerry',
			date: new Date(),
			regExp: /.*/,
			role,
		},
		{
			userId: 3,
			userName: 'Spike',
			date: new Date(),
			regExp: /.*/,
			role,
		},
	],
};
expectType<CamelCasedPropertiesDeep<UserWithFriends>>(result);
