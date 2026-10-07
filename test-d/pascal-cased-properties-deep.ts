import {expectType} from 'tsd';
import type {PascalCasedPropertiesDeep, TupleOf} from '../index.d.ts';

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
expectType<PascalCasedPropertiesDeep<UserWithFriendsPunctuated, {splitOnPunctuation: true}>>(result);

expectType<{'FooBar': unknown}>({} as PascalCasedPropertiesDeep<{foo_bar: unknown}>);
expectType<{'FooBar': {'BarBaz': unknown}; Biz: unknown}>({} as PascalCasedPropertiesDeep<{foo_bar: {bar_baz: unknown}; biz: unknown}>);

expectType<{'FooBar': any}>({} as PascalCasedPropertiesDeep<{foo_bar: any}>);
expectType<{'FooBar': {'BarBaz': any}; Biz: any}>({} as PascalCasedPropertiesDeep<{foo_bar: {bar_baz: any}; biz: any}>);

expectType<{'FooBar': unknown}>({} as PascalCasedPropertiesDeep<{'foo::bar': unknown}, {splitOnPunctuation: true}>);
expectType<{'FooBar': {'BarBaz': unknown}; Biz: unknown}>({} as PascalCasedPropertiesDeep<{'foo::bar': {'bar@baz': unknown}; biz: unknown}, {splitOnPunctuation: true}>);

type bazBizDeep = {fooBAR: number; baz: {fooBAR: Array<{BARFoo: string}>}};

declare const baz: PascalCasedPropertiesDeep<bazBizDeep, {preserveConsecutiveUppercase: true}>;
expectType<{FooBAR: number; Baz: {FooBAR: Array<{BARFoo: string}>}}>(baz);

declare const biz: PascalCasedPropertiesDeep<bazBizDeep>;
expectType<{FooBar: number; Baz: {FooBar: Array<{BarFoo: string}>}}>(biz);

// Readonly arrays and sets must stay arrays and sets, like the sibling deep casing types do
declare const readonlyArray: PascalCasedPropertiesDeep<ReadonlyArray<{userId: number}>>;
expectType<ReadonlyArray<{UserId: number}>>(readonlyArray);

declare const readonlyNested: PascalCasedPropertiesDeep<{readonlyUserIds: ReadonlyArray<{userId: number}>}>;
expectType<{ReadonlyUserIds: ReadonlyArray<{UserId: number}>}>(readonlyNested);

declare const readonlySet: PascalCasedPropertiesDeep<ReadonlySet<{userId: number}>>;
expectType<ReadonlySet<{UserId: number}>>(readonlySet);

// Map and WeakMap are preserved, with their contents recursed into.
declare const mapValue: PascalCasedPropertiesDeep<Map<{fooBar: 1}, {bazQux: 2}>>;
expectType<Map<{FooBar: 1}, {BazQux: 2}>>(mapValue);

declare const weakMapValue: PascalCasedPropertiesDeep<WeakMap<{fooBar: 1}, string>>;
expectType<WeakMap<{FooBar: 1}, string>>(weakMapValue);

declare const weakSetValue: PascalCasedPropertiesDeep<WeakSet<{fooBar: 1}>>;
expectType<WeakSet<{FooBar: 1}>>(weakSetValue);

// A tuple stays a tuple, like in the sibling deep casing types.
declare const tuple: PascalCasedPropertiesDeep<[{userId: number}, {userName: string}]>;
expectType<[{UserId: number}, {UserName: string}]>(tuple);

declare const readonlyTuple: PascalCasedPropertiesDeep<readonly [{userId: number}]>;
expectType<readonly [{UserId: number}]>(readonlyTuple);

// Non-recursive built-ins are kept as is, the way `CamelCasedPropertiesDeep` keeps them.
declare const keepsPromise: PascalCasedPropertiesDeep<Promise<{user_id: number}>>;
expectType<Promise<{user_id: number}>>(keepsPromise);

declare const keepsArrayBuffer: PascalCasedPropertiesDeep<{buffer: ArrayBuffer}>;
expectType<{Buffer: ArrayBuffer}>(keepsArrayBuffer);

declare const keepsDataView: PascalCasedPropertiesDeep<{view: DataView}>;
expectType<{View: DataView}>(keepsDataView);

declare const keepsTypedArray: PascalCasedPropertiesDeep<{bytes: Uint8Array}>;
expectType<{Bytes: Uint8Array}>(keepsTypedArray);

declare const keepsFunction: PascalCasedPropertiesDeep<{fn: (input: string) => number}>;
expectType<{Fn: (input: string) => number}>(keepsFunction);

// A tuple with an optional element keeps its `?` modifier, so its length stays fixed.
declare const tupleWithOptionalTail: PascalCasedPropertiesDeep<[string, number?]>;
expectType<[string, number?]>(tupleWithOptionalTail);

declare const allOptionalTuple: PascalCasedPropertiesDeep<[string?, number?]>;
expectType<[string?, number?]>(allOptionalTuple);

declare const readonlyOptionalTuple: PascalCasedPropertiesDeep<readonly [string, number?]>;
expectType<readonly [string, number?]>(readonlyOptionalTuple);

// A long tuple does not hit the instantiation depth limit.
declare const longTuple: PascalCasedPropertiesDeep<Readonly<TupleOf<100, {a_b: 1}>>>;
expectType<100>(longTuple.length);
expectType<{AB: 1}>(longTuple[99]);
