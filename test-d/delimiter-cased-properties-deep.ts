import {expectType} from 'tsd';
import type {DelimiterCasedPropertiesDeep} from '../index';

declare const foo: DelimiterCasedPropertiesDeep<{helloWorld: {fooBar: string}}, '/'>;
expectType<{'hello/world': {'foo/bar': string}}>(foo);

declare const fooBar: DelimiterCasedPropertiesDeep<() => {a: string}, '/'>;
expectType<() => {a: string}>(fooBar);

declare const bar: DelimiterCasedPropertiesDeep<Set<{fooBar: string}>, '-'>;
expectType<Set<{'foo-bar': string}>>(bar);

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
declare const tuple: DelimiterCasedPropertiesDeep<['userId', 'userName'], '-'>;
expectType<['user-id', 'user-name']>(tuple);
// Test for readonly
declare const readonlyTuple: DelimiterCasedPropertiesDeep<readonly ['userId', 'userName'], '-'>;
expectType<readonly ['user-id', 'user-name']>(readonlyTuple);
// Test for array
declare const array: DelimiterCasedPropertiesDeep<Array<'userId'>, '-'>;
expectType<Array<'user-id'>>(array);
// Test for readonly array
declare const readonlyArray: DelimiterCasedPropertiesDeep<ReadonlyArray<'userId'>, '-'>;
expectType<ReadonlyArray<'user-id'>>(readonlyArray);
// Test for tailing spread array
declare const tailingSpreadArray: DelimiterCasedPropertiesDeep<['userId', 'userName', ...Array<'userAge'>], '-'>;
expectType<['user-id', 'user-name', ...Array<'user-age'>]>(tailingSpreadArray);
// Test for leading spread array
declare const leadingSpreadArray: DelimiterCasedPropertiesDeep<[...Array<'userId'>, 'userName', 'userAge'], '-'>;
expectType<[...Array<'user-id'>, 'user-name', 'user-age']>(leadingSpreadArray);
