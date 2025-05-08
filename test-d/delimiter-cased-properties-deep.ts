import {expectType} from 'tsd';
import type {DelimiterCasedPropertiesDeep} from '../index.d.ts';

declare const foo: DelimiterCasedPropertiesDeep<{helloWorld: {fooBar: string}}, '/'>;
expectType<{'hello/world': {'foo/bar': string}}>(foo);

declare const fooBar: DelimiterCasedPropertiesDeep<() => {a: string}, '/'>;
expectType<() => {a: string}>(fooBar);

declare const bar: DelimiterCasedPropertiesDeep<Set<{fooBar: string}>, '-'>;
expectType<Set<{'foo-bar': string}>>(bar);

declare const withOptions: DelimiterCasedPropertiesDeep<Set<{helloWorld: {p2p: Array<{addressLine1: string}>}}>, '.', {splitOnNumbers: true}>;
expectType<Set<{'hello.world': {'p.2.p': Array<{'address.line.1': string}>}}>>(withOptions);

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
expectType<DelimiterCasedPropertiesDeep<UserWithFriends, '-'>>(result);

// Test object key properties
declare const key: DelimiterCasedPropertiesDeep<{readonly userId?: number}, '-'>;
expectType<{readonly 'user-id'?: number}>(key);

/** Test Array */
// Test for tuple
declare const tuple: DelimiterCasedPropertiesDeep<[User], '-'>;
expectType<[{'user-id': number;'user-name': string;date: Date;'reg-exp': RegExp}]>(tuple);
declare const tuple2: DelimiterCasedPropertiesDeep<['UserId', 'UserAge', string], '-'>;
expectType<['UserId', 'UserAge', string]>(tuple2);
// Test for readonly tuple
declare const readonlyTuple: DelimiterCasedPropertiesDeep<readonly [{userId: string}, {userName: number}], '-'>;
expectType<readonly [{'user-id': string}, {'user-name': number}]>(readonlyTuple);
// Test for array
declare const array: DelimiterCasedPropertiesDeep<User[], '-'>;
expectType<Array<{'user-id': number;'user-name': string;date: Date;'reg-exp': RegExp}>>(array);
// Test for readonly array
declare const readonlyArray: DelimiterCasedPropertiesDeep<ReadonlyArray<{userId: string}>, '-'>;
expectType<ReadonlyArray<{'user-id': string}>>(readonlyArray);
// Test for tailing spread array
declare const tailingSpreadArray: DelimiterCasedPropertiesDeep<[{userId: string}, {userName: number}, ...Array<{userAge: number}>], '-'>;
expectType<[{'user-id': string}, {'user-name': number}, ...Array<{'user-age': number}>]>(tailingSpreadArray);
// Test for leading spread array
declare const leadingSpreadArray: DelimiterCasedPropertiesDeep<[...Array<{userId: string}>, {userName: number}, {userAge: number}], '-'>;
expectType<[...Array<{'user-id': string}>, {'user-name': number}, {'user-age': number}]>(leadingSpreadArray);
// Test for enum
enum UserType {
	AdminUser = 'adminUser',
	NormalUser = 'normalUser',
}
declare const enumTest: DelimiterCasedPropertiesDeep<{userType: UserType}, '-'>;
expectType<{['user-type']: UserType}>(enumTest);
enumTest['user-type'] = UserType.AdminUser;

expectType<{'foo-bar': unknown}>({} as DelimiterCasedPropertiesDeep<{fooBar: unknown}, '-'>);
expectType<{'foo_bar': {'bar_baz': unknown}; biz: unknown}>({} as DelimiterCasedPropertiesDeep<{fooBar: {barBaz: unknown}; biz: unknown}, '_'>);

expectType<{'foo-bar': any}>({} as DelimiterCasedPropertiesDeep<{fooBar: any}, '-'>);
expectType<{'foo_bar': {'bar_baz': any}; biz: any}>({} as DelimiterCasedPropertiesDeep<{fooBar: {barBaz: any}; biz: any}, '_'>);
