import {expectTypeOf} from 'nz';
import type {DelimiterCasedPropertiesDeep} from '../index.d.ts';

declare const foo: DelimiterCasedPropertiesDeep<{helloWorld: {fooBar: string}}, '/'>;
expectTypeOf(foo).toBe<{'hello/world': {'foo/bar': string}}>();

declare const fooBar: DelimiterCasedPropertiesDeep<() => {a: string}, '/'>;
expectTypeOf(fooBar).toBe<() => {a: string}>();

declare const bar: DelimiterCasedPropertiesDeep<Set<{fooBar: string}>, '-'>;
expectTypeOf(bar).toBe<Set<{'foo-bar': string}>>();

declare const withOptions: DelimiterCasedPropertiesDeep<Set<{helloWorld: {p2p: Array<{addressLine1: string}>}}>, '.', {splitOnNumbers: true}>;
expectTypeOf(withOptions).toBe<Set<{'hello.world': {'p.2.p': Array<{'address.line.1': string}>}}>>();

declare const withPunctuation: DelimiterCasedPropertiesDeep<{'hello@World1': {'foo::Bar': string}}, '.'>;
expectTypeOf(withPunctuation).toBe<{'hello@world1': {'foo::bar': string}}>();

declare const withPunctuationSplit: DelimiterCasedPropertiesDeep<{'hello@World1': {'foo::Bar': string}}, '.', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplit).toBe<{'hello.world1': {'foo.bar': string}}>();

declare const withPunctuationSplitAndNumbers: DelimiterCasedPropertiesDeep<{'hello@World1': {'foo::Bar1': string}}, '.', {splitOnPunctuation: true; splitOnNumbers: true}>;
expectTypeOf(withPunctuationSplitAndNumbers).toBe<{'hello.world.1': {'foo.bar.1': string}}>();

declare const startsWithPunctuation: DelimiterCasedPropertiesDeep<{'^fooBarBaz': {'^foo_bar_baz': string}}, ':'>;
expectTypeOf(startsWithPunctuation).toBe<{'^foo:bar:baz': {'^foo:bar:baz': string}}>();

declare const startsWithPunctuationSameAsDelimiter: DelimiterCasedPropertiesDeep<{'#fooBarBaz': {'#foo_bar_baz': string}}, '#'>;
expectTypeOf(startsWithPunctuationSameAsDelimiter).toBe<{'#foo#bar#baz': {'#foo#bar#baz': string}}>();

declare const emptyStringDelimiter: DelimiterCasedPropertiesDeep<{'fooBarBaz': {'foo_bar_baz': string}}, ''>;
expectTypeOf(emptyStringDelimiter).toBe<{'foobarbaz': {'foobarbaz': string}}>();

declare const moreThanOneLengthDelimiter: DelimiterCasedPropertiesDeep<{'fooBarBaz': {'foo_bar_baz': string}}, '__'>;
expectTypeOf(moreThanOneLengthDelimiter).toBe<{'foo__bar__baz': {'foo__bar__baz': string}}>();

declare const moreThanOneLengthDelimiter1: DelimiterCasedPropertiesDeep<{'fooBarBaz': {'foo_bar_baz': string}}, '-->'>;
expectTypeOf(moreThanOneLengthDelimiter1).toBe<{'foo-->bar-->baz': {'foo-->bar-->baz': string}}>();

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

type UserPunctuated = {
	'user::id': number;
	'user::name': string;
	date: Date;
	'reg::exp': RegExp;
};

type UserWithFriendsPunctuated = {
	'user@info': UserPunctuated;
	'user#friends': UserPunctuated[];
};

const result: DelimiterCasedPropertiesDeep<UserWithFriends, '-'> = {
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
expectTypeOf(result).toBe<DelimiterCasedPropertiesDeep<UserWithFriends, '-'>>();
expectTypeOf(result).toBe<DelimiterCasedPropertiesDeep<UserWithFriendsPunctuated, '-', {splitOnPunctuation: true}>>();

// Test object key properties
declare const key: DelimiterCasedPropertiesDeep<{readonly userId?: number}, '-'>;
expectTypeOf(key).toBe<{readonly 'user-id'?: number}>();

/**
Test Array
*/
// Test for tuple
declare const tuple: DelimiterCasedPropertiesDeep<[User], '-'>;
expectTypeOf(tuple).toBe<[{'user-id': number; 'user-name': string; date: Date; 'reg-exp': RegExp}]>();
declare const tuple2: DelimiterCasedPropertiesDeep<['UserId', 'UserAge', string], '-'>;
expectTypeOf(tuple2).toBe<['UserId', 'UserAge', string]>();
// Test for readonly tuple
declare const readonlyTuple: DelimiterCasedPropertiesDeep<readonly [{userId: string}, {userName: number}], '-'>;
expectTypeOf(readonlyTuple).toBe<readonly [{'user-id': string}, {'user-name': number}]>();
// Test for array
declare const array: DelimiterCasedPropertiesDeep<User[], '-'>;
expectTypeOf(array).toBe<Array<{'user-id': number; 'user-name': string; date: Date; 'reg-exp': RegExp}>>();
// Test for readonly array
declare const readonlyArray: DelimiterCasedPropertiesDeep<ReadonlyArray<{userId: string}>, '-'>;
expectTypeOf(readonlyArray).toBe<ReadonlyArray<{'user-id': string}>>();
// Test for tailing spread array
declare const tailingSpreadArray: DelimiterCasedPropertiesDeep<[{userId: string}, {userName: number}, ...Array<{userAge: number}>], '-'>;
expectTypeOf(tailingSpreadArray).toBe<[{'user-id': string}, {'user-name': number}, ...Array<{'user-age': number}>]>();
// Test for leading spread array
declare const leadingSpreadArray: DelimiterCasedPropertiesDeep<[...Array<{userId: string}>, {userName: number}, {userAge: number}], '-'>;
expectTypeOf(leadingSpreadArray).toBe<[...Array<{'user-id': string}>, {'user-name': number}, {'user-age': number}]>();
// Test for readonly leading spread array
declare const readonlyLeadingSpreadArray: DelimiterCasedPropertiesDeep<readonly [...Array<{userId: string}>, {userName: number}, {userAge: number}], '-'>;
expectTypeOf(readonlyLeadingSpreadArray).toBe<readonly [...Array<{'user-id': string}>, {'user-name': number}, {'user-age': number}]>();
// Test for empty tuples
declare const emptyTuple: DelimiterCasedPropertiesDeep<[], '-'>;
expectTypeOf(emptyTuple).toBe<[]>();
declare const readonlyEmptyTuple: DelimiterCasedPropertiesDeep<readonly [], '-'>;
expectTypeOf(readonlyEmptyTuple).toBe<readonly []>();
// Test for enum
enum UserType {
	AdminUser = 'adminUser',
	NormalUser = 'normalUser',
}
declare const enumTest: DelimiterCasedPropertiesDeep<{userType: UserType}, '-'>;
expectTypeOf(enumTest).toBe<{['user-type']: UserType}>();
enumTest['user-type'] = UserType.AdminUser;

expectTypeOf<DelimiterCasedPropertiesDeep<{fooBar: unknown}, '-'>>().toBe<{'foo-bar': unknown}>();
expectTypeOf<DelimiterCasedPropertiesDeep<{fooBar: {barBaz: unknown}; biz: unknown}, '_'>>().toBe<{'foo_bar': {'bar_baz': unknown}; biz: unknown}>();

expectTypeOf<DelimiterCasedPropertiesDeep<{fooBar: any}, '-'>>().toBe<{'foo-bar': any}>();
expectTypeOf<DelimiterCasedPropertiesDeep<{fooBar: {barBaz: any}; biz: any}, '_'>>().toBe<{'foo_bar': {'bar_baz': any}; biz: any}>();

expectTypeOf<DelimiterCasedPropertiesDeep<{'foo::bar': unknown}, '-', {splitOnPunctuation: true}>>().toBe<{'foo-bar': unknown}>();
expectTypeOf<DelimiterCasedPropertiesDeep<{'foo::bar': {'bar@baz': unknown}; biz: unknown}, '_', {splitOnPunctuation: true}>>().toBe<{'foo_bar': {'bar_baz': unknown}; biz: unknown}>();

// A tuple with an optional element keeps its `?` modifier, so its length stays fixed.
expectTypeOf<DelimiterCasedPropertiesDeep<[string, number?], '-'>>().toBe<[string, number?]>();
expectTypeOf<DelimiterCasedPropertiesDeep<[string?, number?], '-'>>().toBe<[string?, number?]>();
expectTypeOf<DelimiterCasedPropertiesDeep<readonly [string, number?], '-'>>().toBe<readonly [string, number?]>();
