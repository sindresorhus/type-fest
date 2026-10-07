import {expectAssignable, expectType} from 'tsd';
import type {CamelCasedPropertiesDeep, JsonValue, Tagged} from '../index.d.ts';

declare const foo: CamelCasedPropertiesDeep<{A: {B: number; C: Array<{D: string}>}}>;

expectType<{a: {b: number; c: Array<{d: string}>}}>(foo);

declare const fooBar: CamelCasedPropertiesDeep<() => {a: string}>;
expectType<() => {a: string}>(fooBar);

declare const bar: CamelCasedPropertiesDeep<Set<{fooBar: string}>>;
expectType<Set<{fooBar: string}>>(bar);

type bazBizDeep = {fooBAR: number; baz: {fooBAR: Array<{BARFoo: string}>}};

declare const baz: CamelCasedPropertiesDeep<bazBizDeep, {preserveConsecutiveUppercase: true}>;
expectType<{fooBAR: number; baz: {fooBAR: Array<{bARFoo: string}>}}>(baz);

declare const biz: CamelCasedPropertiesDeep<bazBizDeep>;
expectType<{fooBar: number; baz: {fooBar: Array<{barFoo: string}>}}>(biz);

declare const tuple: CamelCasedPropertiesDeep<{tuple: [number, string, {D: string}]}>;
expectType<{tuple: [number, string, {d: string}]}>(tuple);

// Test for leading spread array
declare const leadingSpreadArray: CamelCasedPropertiesDeep<[...Array<{userId: string}>, {userName: number}, {userAge: number}]>;
expectType<[...Array<{userId: string}>, {userName: number}, {userAge: number}]>(leadingSpreadArray);
// Test for readonly leading spread array
declare const readonlyLeadingSpreadArray: CamelCasedPropertiesDeep<readonly [...Array<{userId: string}>, {userName: number}, {userAge: number}]>;
expectType<readonly [...Array<{userId: string}>, {userName: number}, {userAge: number}]>(readonlyLeadingSpreadArray);
// Test for empty tuples
declare const emptyTuple: CamelCasedPropertiesDeep<[]>;
expectType<[]>(emptyTuple);
declare const readonlyEmptyTuple: CamelCasedPropertiesDeep<readonly []>;
expectType<readonly []>(readonlyEmptyTuple);

// Verify example
type UserRole = Tagged<string, 'Role'>;

type User = {
	UserId: number;
	UserName: string;
	Date: Date;
	RegExp: RegExp;
	Role: UserRole;
};

type UserPunctuated = {
	'user::id': number;
	'user::name': string;
	date: Date;
	'reg::exp': RegExp;
	Role: UserRole;
};

type UserWithFriends = {
	UserInfo: User;
	UserFriends: User[];
};

type UserWithFriendsPunctuated = {
	'user@info': UserPunctuated;
	'user#friends': UserPunctuated[];
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
expectType<CamelCasedPropertiesDeep<UserWithFriendsPunctuated, {splitOnPunctuation: true}>>(result);

expectType<{fooBar: unknown}>({} as CamelCasedPropertiesDeep<{foo_bar: unknown}>);
expectType<{fooBar: {barBaz: unknown}; biz: unknown}>({} as CamelCasedPropertiesDeep<{foo_bar: {bar_baz: unknown}; biz: unknown}>);

expectType<{fooBar: any}>({} as CamelCasedPropertiesDeep<{foo_bar: any}>);
expectType<{fooBar: {barBaz: any}; biz: any}>({} as CamelCasedPropertiesDeep<{foo_bar: {bar_baz: any}; biz: any}>);

expectType<{'fooBar': unknown}>({} as CamelCasedPropertiesDeep<{'foo::bar': unknown}, {splitOnPunctuation: true}>);
expectType<{'fooBar': {'barBaz': unknown}; biz: unknown}>({} as CamelCasedPropertiesDeep<{'foo::bar': {'bar@baz': unknown}; biz: unknown}, {splitOnPunctuation: true}>);

expectType<{_fooBar: {_bazQux: string}}>({} as CamelCasedPropertiesDeep<{_foo_bar: {_baz_qux: string}}, {preserveLeadingUnderscores: true}>);
expectType<{__fooBar: string}>({} as CamelCasedPropertiesDeep<{__foo_bar: string}, {preserveLeadingUnderscores: true}>);
expectType<{fooBar: {bazQux: string}}>({} as CamelCasedPropertiesDeep<{_foo_bar: {_baz_qux: string}}>);

// Map, Set, and their readonly and weak variants are preserved, with their contents recursed into.
declare const readonlySet: CamelCasedPropertiesDeep<ReadonlySet<{foo_bar: number}>>;
expectType<ReadonlySet<{fooBar: number}>>(readonlySet);

declare const readonlyMap: CamelCasedPropertiesDeep<ReadonlyMap<{foo_bar: 1}, {baz_qux: 2}>>;
expectType<ReadonlyMap<{fooBar: 1}, {bazQux: 2}>>(readonlyMap);

declare const weakMap: CamelCasedPropertiesDeep<WeakMap<{foo_bar: 1}, string>>;
expectType<WeakMap<{fooBar: 1}, string>>(weakMap);

declare const weakSet: CamelCasedPropertiesDeep<WeakSet<{foo_bar: 1}>>;
expectType<WeakSet<{fooBar: 1}>>(weakSet);

// A tuple with an optional element keeps its `?` modifier, so its length stays fixed.
declare const tupleWithOptionalTail: CamelCasedPropertiesDeep<[string, number?]>;
expectType<[string, number?]>(tupleWithOptionalTail);

declare const allOptionalTuple: CamelCasedPropertiesDeep<[string?, number?]>;
expectType<[string?, number?]>(allOptionalTuple);

declare const readonlyOptionalTuple: CamelCasedPropertiesDeep<readonly [string, number?]>;
expectType<readonly [string, number?]>(readonlyOptionalTuple);

// Optional elements of the same type keep their `?`, rather than collapsing into a rest element.
expectType<[string?, string?]>({} as CamelCasedPropertiesDeep<[string?, string?]>);
expectType<[{fooBar: 1}, {fooBar: 1}?, {fooBar: 1}?]>({} as CamelCasedPropertiesDeep<[{foo_bar: 1}, {foo_bar: 1}?, {foo_bar: 1}?]>);

// A plain object with `name` and `message` is structurally an `Error`, but it is data, so it is still converted.
expectType<{lastError: {name: string; message: string; errorCode: number}}>({} as CamelCasedPropertiesDeep<{last_error: {name: string; message: string; error_code: number}}>);

// A recursive element type is walked lazily, so it does not become infinitely deep.
expectAssignable<CamelCasedPropertiesDeep<{json: JsonValue}>>({json: [{a: 1}]});

// A thenable is a single value like a `Promise`, so it is kept as it is, extra members included.
expectType<{fooBar: PromiseLike<{a_b: 1}> & {extra_key: 1}}>({} as CamelCasedPropertiesDeep<{foo_bar: PromiseLike<{a_b: 1}> & {extra_key: 1}}>);
