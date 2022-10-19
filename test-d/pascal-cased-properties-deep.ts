import {expectTypeOf} from 'expect-type';
import type {PascalCasedPropertiesDeep} from '../index';

declare const foo: PascalCasedPropertiesDeep<{helloWorld: {fooBar: string}}>;
expectTypeOf(foo).toEqualTypeOf<{HelloWorld: {FooBar: string}}>();

declare const fooBar: PascalCasedPropertiesDeep<() => {a: string}>;
expectTypeOf(fooBar).toEqualTypeOf<() => {a: string}>();

declare const bar: PascalCasedPropertiesDeep<Set<{fooBar: string}>>;
expectTypeOf(bar).toEqualTypeOf<Set<{FooBar: string}>>();

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
		RegExp: new RegExp(/.*/),
	},
	UserFriends: [
		{
			UserId: 2,
			UserName: 'Jerry',
			Date: new Date(),
			RegExp: new RegExp(/.*/),
		},
		{
			UserId: 3,
			UserName: 'Spike',
			Date: new Date(),
			RegExp: new RegExp(/.*/),
		},
	],
};
expectTypeOf(result).toEqualTypeOf<PascalCasedPropertiesDeep<UserWithFriends>>();
