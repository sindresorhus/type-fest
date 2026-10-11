import {expectTypeOf} from 'nz';
import type {KebabCasedPropertiesDeep} from '../index.d.ts';

type FooBar = {helloWorld: {p2p: Array<{addressLine1: string}>}};

declare const foo: KebabCasedPropertiesDeep<FooBar>;
expectTypeOf(foo).toBe<{'hello-world': {p2p: Array<{'address-line1': string}>}}>();

declare const bar: KebabCasedPropertiesDeep<FooBar, {splitOnNumbers: true}>;
expectTypeOf(bar).toBe<{'hello-world': {'p-2-p': Array<{'address-line-1': string}>}}>();

// Verify example
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

expectTypeOf(result).toBe<KebabCasedPropertiesDeep<UserWithFriends>>();
expectTypeOf(result).toBe<KebabCasedPropertiesDeep<UserWithFriendsPunctuated, {splitOnPunctuation: true}>>();

expectTypeOf<KebabCasedPropertiesDeep<{foo_bar: unknown}>>().toBe<{'foo-bar': unknown}>();
expectTypeOf<KebabCasedPropertiesDeep<{foo_bar: {bar_baz: unknown}; biz: unknown}>>().toBe<{'foo-bar': {'bar-baz': unknown}; biz: unknown}>();

expectTypeOf<KebabCasedPropertiesDeep<{foo_bar: any}>>().toBe<{'foo-bar': any}>();
expectTypeOf<KebabCasedPropertiesDeep<{foo_bar: {bar_baz: any}; biz: any}>>().toBe<{'foo-bar': {'bar-baz': any}; biz: any}>();

expectTypeOf<KebabCasedPropertiesDeep<{'foo::bar': unknown}, {splitOnPunctuation: true}>>().toBe<{'foo-bar': unknown}>();
expectTypeOf<KebabCasedPropertiesDeep<{'foo::bar': {'bar@baz': unknown}; biz: unknown}, {splitOnPunctuation: true}>>().toBe<{'foo-bar': {'bar-baz': unknown}; biz: unknown}>();

// Map, Set, and their readonly and weak variants are preserved, with their contents recursed into.
declare const readonlySet: KebabCasedPropertiesDeep<ReadonlySet<{fooBar: number}>>;
expectTypeOf(readonlySet).toBe<ReadonlySet<{'foo-bar': number}>>();

declare const readonlyMap: KebabCasedPropertiesDeep<ReadonlyMap<{fooBar: number}, {bazQux: 1}>>;
expectTypeOf(readonlyMap).toBe<ReadonlyMap<{'foo-bar': number}, {'baz-qux': 1}>>();

declare const weakMap: KebabCasedPropertiesDeep<WeakMap<{fooBar: 1}, string>>;
expectTypeOf(weakMap).toBe<WeakMap<{'foo-bar': 1}, string>>();

declare const weakSet: KebabCasedPropertiesDeep<WeakSet<{fooBar: 1}>>;
expectTypeOf(weakSet).toBe<WeakSet<{'foo-bar': 1}>>();

declare const mutableMap: KebabCasedPropertiesDeep<Map<{fooBar: 1}, {bazQux: 2}>>;
expectTypeOf(mutableMap).toBe<Map<{'foo-bar': 1}, {'baz-qux': 2}>>();
