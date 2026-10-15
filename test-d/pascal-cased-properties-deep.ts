import {expectTypeOf} from 'nz';
import type {PascalCasedProperties, PascalCasedPropertiesDeep, TupleOf} from '../index.d.ts';

declare const foo: PascalCasedPropertiesDeep<{helloWorld: {fooBar: string}}>;
expectTypeOf(foo).toBe<{HelloWorld: {FooBar: string}}>();

declare const fooBar: PascalCasedPropertiesDeep<() => {a: string}>;
expectTypeOf(fooBar).toBe<() => {a: string}>();

declare const bar: PascalCasedPropertiesDeep<Set<{fooBar: string}>>;
expectTypeOf(bar).toBe<Set<{FooBar: string}>>();

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
expectTypeOf(result).toBe<PascalCasedPropertiesDeep<UserWithFriends>>();
expectTypeOf(result).toBe<PascalCasedPropertiesDeep<UserWithFriendsPunctuated, {splitOnPunctuation: true}>>();

expectTypeOf<PascalCasedPropertiesDeep<{foo_bar: unknown}>>().toBe<{'FooBar': unknown}>();
expectTypeOf<PascalCasedPropertiesDeep<{foo_bar: {bar_baz: unknown}; biz: unknown}>>().toBe<{'FooBar': {'BarBaz': unknown}; Biz: unknown}>();

expectTypeOf<PascalCasedPropertiesDeep<{foo_bar: any}>>().toBe<{'FooBar': any}>();
expectTypeOf<PascalCasedPropertiesDeep<{foo_bar: {bar_baz: any}; biz: any}>>().toBe<{'FooBar': {'BarBaz': any}; Biz: any}>();

expectTypeOf<PascalCasedPropertiesDeep<{'foo::bar': unknown}, {splitOnPunctuation: true}>>().toBe<{'FooBar': unknown}>();
expectTypeOf<PascalCasedPropertiesDeep<{'foo::bar': {'bar@baz': unknown}; biz: unknown}, {splitOnPunctuation: true}>>().toBe<{'FooBar': {'BarBaz': unknown}; Biz: unknown}>();

type bazBizDeep = {fooBAR: number; baz: {fooBAR: Array<{BARFoo: string}>}};

declare const baz: PascalCasedPropertiesDeep<bazBizDeep, {preserveConsecutiveUppercase: true}>;
expectTypeOf(baz).toBe<{FooBAR: number; Baz: {FooBAR: Array<{BARFoo: string}>}}>();

declare const biz: PascalCasedPropertiesDeep<bazBizDeep>;
expectTypeOf(biz).toBe<{FooBar: number; Baz: {FooBar: Array<{BarFoo: string}>}}>();

// Readonly arrays and sets must stay arrays and sets, like the sibling deep casing types do
declare const readonlyArray: PascalCasedPropertiesDeep<ReadonlyArray<{userId: number}>>;
expectTypeOf(readonlyArray).toBe<ReadonlyArray<{UserId: number}>>();

declare const readonlyNested: PascalCasedPropertiesDeep<{readonlyUserIds: ReadonlyArray<{userId: number}>}>;
expectTypeOf(readonlyNested).toBe<{ReadonlyUserIds: ReadonlyArray<{UserId: number}>}>();

declare const readonlySet: PascalCasedPropertiesDeep<ReadonlySet<{userId: number}>>;
expectTypeOf(readonlySet).toBe<ReadonlySet<{UserId: number}>>();

// Map and WeakMap are preserved, with their contents recursed into.
declare const mapValue: PascalCasedPropertiesDeep<Map<{fooBar: 1}, {bazQux: 2}>>;
expectTypeOf(mapValue).toBe<Map<{FooBar: 1}, {BazQux: 2}>>();

declare const weakMapValue: PascalCasedPropertiesDeep<WeakMap<{fooBar: 1}, string>>;
expectTypeOf(weakMapValue).toBe<WeakMap<{FooBar: 1}, string>>();

declare const weakSetValue: PascalCasedPropertiesDeep<WeakSet<{fooBar: 1}>>;
expectTypeOf(weakSetValue).toBe<WeakSet<{FooBar: 1}>>();

// A tuple stays a tuple, like in the sibling deep casing types.
declare const tuple: PascalCasedPropertiesDeep<[{userId: number}, {userName: string}]>;
expectTypeOf(tuple).toBe<[{UserId: number}, {UserName: string}]>();

declare const readonlyTuple: PascalCasedPropertiesDeep<readonly [{userId: number}]>;
expectTypeOf(readonlyTuple).toBe<readonly [{UserId: number}]>();

// Non-recursive built-ins are kept as is, the way `CamelCasedPropertiesDeep` keeps them.
declare const keepsPromise: PascalCasedPropertiesDeep<Promise<{user_id: number}>>;
expectTypeOf(keepsPromise).toBe<Promise<{user_id: number}>>();

declare const keepsArrayBuffer: PascalCasedPropertiesDeep<{buffer: ArrayBuffer}>;
expectTypeOf(keepsArrayBuffer).toBe<{Buffer: ArrayBuffer}>();

declare const keepsDataView: PascalCasedPropertiesDeep<{view: DataView}>;
expectTypeOf(keepsDataView).toBe<{View: DataView}>();

declare const keepsTypedArray: PascalCasedPropertiesDeep<{bytes: Uint8Array}>;
expectTypeOf(keepsTypedArray).toBe<{Bytes: Uint8Array}>();

declare const keepsFunction: PascalCasedPropertiesDeep<{fn: (input: string) => number}>;
expectTypeOf(keepsFunction).toBe<{Fn: (input: string) => number}>();

// A tuple with an optional element keeps its `?` modifier, so its length stays fixed.
declare const tupleWithOptionalTail: PascalCasedPropertiesDeep<[string, number?]>;
expectTypeOf(tupleWithOptionalTail).toBe<[string, number?]>();

declare const allOptionalTuple: PascalCasedPropertiesDeep<[string?, number?]>;
expectTypeOf(allOptionalTuple).toBe<[string?, number?]>();

declare const readonlyOptionalTuple: PascalCasedPropertiesDeep<readonly [string, number?]>;
expectTypeOf(readonlyOptionalTuple).toBe<readonly [string, number?]>();

// A long tuple does not hit the instantiation depth limit.
declare const longTuple: PascalCasedPropertiesDeep<Readonly<TupleOf<100, {a_b: 1}>>>;
expectTypeOf(longTuple.length).toBe<100>();
expectTypeOf(longTuple[99]).toBe<{AB: 1}>();

// A generic conditional return type does not overflow the stack (https://github.com/sindresorhus/type-fest/issues/805)
declare function _pascalCasedKeys<Value, Deep extends boolean>(value: Value, deep: Deep): Deep extends true ? PascalCasedPropertiesDeep<Value> : PascalCasedProperties<Value>;

function _pascalCasedKeysDeep<Value>(value: Value): PascalCasedPropertiesDeep<Value> {
	return _pascalCasedKeys(value, true);
}
