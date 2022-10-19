import {expectTypeOf} from 'expect-type';
import type {CamelCasedPropertiesDeep} from '../index';

declare const foo: CamelCasedPropertiesDeep<{A: {B: number; C: Array<{D: string}>}}>;

expectTypeOf(foo).toEqualTypeOf<{a: {b: number; c: Array<{d: string}>}}>();

declare const fooBar: CamelCasedPropertiesDeep<() => {a: string}>;
expectTypeOf(fooBar).toEqualTypeOf<() => {a: string}>();

declare const bar: CamelCasedPropertiesDeep<Set<{fooBar: string}>>;
expectTypeOf(bar).toEqualTypeOf<Set<{fooBar: string}>>();

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
expectTypeOf(result).toEqualTypeOf<CamelCasedPropertiesDeep<UserWithFriends>>();
