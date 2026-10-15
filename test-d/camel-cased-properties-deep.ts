import {expectTypeOf} from 'nz';
import type {CamelCasedPropertiesDeep, JsonValue, Tagged} from '../index.d.ts';

declare const foo: CamelCasedPropertiesDeep<{A: {B: number; C: Array<{D: string}>}}>;

expectTypeOf(foo).toBe<{a: {b: number; c: Array<{d: string}>}}>();

declare const fooBar: CamelCasedPropertiesDeep<() => {a: string}>;
expectTypeOf(fooBar).toBe<() => {a: string}>();

declare const bar: CamelCasedPropertiesDeep<Set<{fooBar: string}>>;
expectTypeOf(bar).toBe<Set<{fooBar: string}>>();

type bazBizDeep = {fooBAR: number; baz: {fooBAR: Array<{BARFoo: string}>}};

declare const baz: CamelCasedPropertiesDeep<bazBizDeep, {preserveConsecutiveUppercase: true}>;
expectTypeOf(baz).toBe<{fooBAR: number; baz: {fooBAR: Array<{bARFoo: string}>}}>();

declare const biz: CamelCasedPropertiesDeep<bazBizDeep>;
expectTypeOf(biz).toBe<{fooBar: number; baz: {fooBar: Array<{barFoo: string}>}}>();

declare const tuple: CamelCasedPropertiesDeep<{tuple: [number, string, {D: string}]}>;
expectTypeOf(tuple).toBe<{tuple: [number, string, {d: string}]}>();

// Test for leading spread array
declare const leadingSpreadArray: CamelCasedPropertiesDeep<[...Array<{userId: string}>, {userName: number}, {userAge: number}]>;
expectTypeOf(leadingSpreadArray).toBe<[...Array<{userId: string}>, {userName: number}, {userAge: number}]>();
// Test for readonly leading spread array
declare const readonlyLeadingSpreadArray: CamelCasedPropertiesDeep<readonly [...Array<{userId: string}>, {userName: number}, {userAge: number}]>;
expectTypeOf(readonlyLeadingSpreadArray).toBe<readonly [...Array<{userId: string}>, {userName: number}, {userAge: number}]>();
// Test for empty tuples
declare const emptyTuple: CamelCasedPropertiesDeep<[]>;
expectTypeOf(emptyTuple).toBe<[]>();
declare const readonlyEmptyTuple: CamelCasedPropertiesDeep<readonly []>;
expectTypeOf(readonlyEmptyTuple).toBe<readonly []>();

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

expectTypeOf(result).toBe<CamelCasedPropertiesDeep<UserWithFriends>>();
expectTypeOf(result).toBe<CamelCasedPropertiesDeep<UserWithFriendsPunctuated, {splitOnPunctuation: true}>>();

expectTypeOf<CamelCasedPropertiesDeep<{foo_bar: unknown}>>().toBe<{fooBar: unknown}>();
expectTypeOf<CamelCasedPropertiesDeep<{foo_bar: {bar_baz: unknown}; biz: unknown}>>().toBe<{fooBar: {barBaz: unknown}; biz: unknown}>();

expectTypeOf<CamelCasedPropertiesDeep<{foo_bar: any}>>().toBe<{fooBar: any}>();
expectTypeOf<CamelCasedPropertiesDeep<{foo_bar: {bar_baz: any}; biz: any}>>().toBe<{fooBar: {barBaz: any}; biz: any}>();

expectTypeOf<CamelCasedPropertiesDeep<{'foo::bar': unknown}, {splitOnPunctuation: true}>>().toBe<{'fooBar': unknown}>();
expectTypeOf<CamelCasedPropertiesDeep<{'foo::bar': {'bar@baz': unknown}; biz: unknown}, {splitOnPunctuation: true}>>().toBe<{'fooBar': {'barBaz': unknown}; biz: unknown}>();

expectTypeOf<CamelCasedPropertiesDeep<{_foo_bar: {_baz_qux: string}}, {preserveLeadingUnderscores: true}>>().toBe<{_fooBar: {_bazQux: string}}>();
expectTypeOf<CamelCasedPropertiesDeep<{__foo_bar: string}, {preserveLeadingUnderscores: true}>>().toBe<{__fooBar: string}>();
expectTypeOf<CamelCasedPropertiesDeep<{_foo_bar: {_baz_qux: string}}>>().toBe<{fooBar: {bazQux: string}}>();

// Map, Set, and their readonly and weak variants are preserved, with their contents recursed into.
declare const readonlySet: CamelCasedPropertiesDeep<ReadonlySet<{foo_bar: number}>>;
expectTypeOf(readonlySet).toBe<ReadonlySet<{fooBar: number}>>();

declare const readonlyMap: CamelCasedPropertiesDeep<ReadonlyMap<{foo_bar: 1}, {baz_qux: 2}>>;
expectTypeOf(readonlyMap).toBe<ReadonlyMap<{fooBar: 1}, {bazQux: 2}>>();

declare const weakMap: CamelCasedPropertiesDeep<WeakMap<{foo_bar: 1}, string>>;
expectTypeOf(weakMap).toBe<WeakMap<{fooBar: 1}, string>>();

declare const weakSet: CamelCasedPropertiesDeep<WeakSet<{foo_bar: 1}>>;
expectTypeOf(weakSet).toBe<WeakSet<{fooBar: 1}>>();

// A tuple with an optional element keeps its `?` modifier, so its length stays fixed.
declare const tupleWithOptionalTail: CamelCasedPropertiesDeep<[string, number?]>;
expectTypeOf(tupleWithOptionalTail).toBe<[string, number?]>();

declare const allOptionalTuple: CamelCasedPropertiesDeep<[string?, number?]>;
expectTypeOf(allOptionalTuple).toBe<[string?, number?]>();

declare const readonlyOptionalTuple: CamelCasedPropertiesDeep<readonly [string, number?]>;
expectTypeOf(readonlyOptionalTuple).toBe<readonly [string, number?]>();

// Optional elements of the same type keep their `?`, rather than collapsing into a rest element.
expectTypeOf<CamelCasedPropertiesDeep<[string?, string?]>>().toBe<[string?, string?]>();
expectTypeOf<CamelCasedPropertiesDeep<[{foo_bar: 1}, {foo_bar: 1}?, {foo_bar: 1}?]>>().toBe<[{fooBar: 1}, {fooBar: 1}?, {fooBar: 1}?]>();

// A plain object with `name` and `message` is structurally an `Error`, but it is data, so it is still converted.
expectTypeOf<CamelCasedPropertiesDeep<{last_error: {name: string; message: string; error_code: number}}>>().toBe<{lastError: {name: string; message: string; errorCode: number}}>();

// A recursive element type is walked lazily, so it does not become infinitely deep.
({json: [{a: 1}]}) satisfies CamelCasedPropertiesDeep<{json: JsonValue}>;

// A thenable is a single value like a `Promise`, so it is kept as it is, extra members included.
expectTypeOf<CamelCasedPropertiesDeep<{foo_bar: PromiseLike<{a_b: 1}> & {extra_key: 1}}>>().toBe<{fooBar: PromiseLike<{a_b: 1}> & {extra_key: 1}}>();

// A DOM node is a single value, so it is kept as is.
expectTypeOf<CamelCasedPropertiesDeep<{foo_bar: HTMLElement}>>().toBe<{fooBar: HTMLElement}>();
