import {expectType} from 'tsd';
import type {PascalCasedPropertiesDeep} from '../index.d.ts';

declare const foo: PascalCasedPropertiesDeep<{helloWorld: {fooBar: string}}>;
expectType<{HelloWorld: {FooBar: string}}>(foo);

declare const fooBar: PascalCasedPropertiesDeep<() => {a: string}>;
expectType<() => {a: string}>(fooBar);

declare const bar: PascalCasedPropertiesDeep<Set<{fooBar: string}>>;
expectType<Set<{FooBar: string}>>(bar);

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

const result: PascalCasedPropertiesDeep<UserWithFriends> = {
	UserInfo: {
		UserId: 1,
		UserName: 'Tom',
		Date: new Date(),
		RegExp: /.*/,
	},
	UserFriends: [
		{
			UserId: 2,
			UserName: 'Jerry',
			Date: new Date(),
			RegExp: /.*/,
		},
		{
			UserId: 3,
			UserName: 'Spike',
			Date: new Date(),
			RegExp: /.*/,
		},
	],
};
expectType<PascalCasedPropertiesDeep<UserWithFriends>>(result);

expectType<{'FooBar': unknown}>({} as PascalCasedPropertiesDeep<{foo_bar: unknown}>);
expectType<{'FooBar': {'BarBaz': unknown}; Biz: unknown}>({} as PascalCasedPropertiesDeep<{foo_bar: {bar_baz: unknown}; biz: unknown}>);

expectType<{'FooBar': any}>({} as PascalCasedPropertiesDeep<{foo_bar: any}>);
expectType<{'FooBar': {'BarBaz': any}; Biz: any}>({} as PascalCasedPropertiesDeep<{foo_bar: {bar_baz: any}; biz: any}>);

type bazBizDeep = {fooBAR: number; baz: {fooBAR: Array<{BARFoo: string}>}};

declare const baz: PascalCasedPropertiesDeep<bazBizDeep, {preserveConsecutiveUppercase: true}>;
expectType<{FooBAR: number; Baz: {FooBAR: Array<{BARFoo: string}>}}>(baz);

declare const biz: PascalCasedPropertiesDeep<bazBizDeep>;
expectType<{FooBar: number; Baz: {FooBar: Array<{BarFoo: string}>}}>(biz);
