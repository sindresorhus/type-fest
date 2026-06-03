import {expectType} from 'tsd';
import type {SnakeCasedProperties} from '../index.d.ts';

type Foobar = {helloWorld1: {fooBar: string}};
type FoobarPunctuated = {'hello@World1': {'foo::Bar': string}};

declare const foo: SnakeCasedProperties<Foobar>;
expectType<{hello_world1: {fooBar: string}}>(foo);

declare const bar: SnakeCasedProperties<Foobar, {splitOnNumbers: true}>;
expectType<{hello_world_1: {fooBar: string}}>(bar);

declare const fooBarPunctuated: SnakeCasedProperties<FoobarPunctuated>;
expectType<{'hello@_world1': {'foo::Bar': string}}>(fooBarPunctuated);

declare const fooBarPunctuatedSplit: SnakeCasedProperties<FoobarPunctuated, {splitOnPunctuation: true}>;
expectType<{'hello_world1': {'foo::Bar': string}}>(fooBarPunctuatedSplit);

declare const fooBarPunctuatedSplitNumberSplit: SnakeCasedProperties<FoobarPunctuated, {splitOnPunctuation: true; splitOnNumbers: true}>;
expectType<{'hello_world_1': {'foo::Bar': string}}>(fooBarPunctuatedSplitNumberSplit);

// Verify example
type User = {
	userId: number;
	userName: string;
};

type UserPunctuated = {
	'user::Id': number;
	'user::Name': string;
};

const result: SnakeCasedProperties<User> = {
	user_id: 1,
	user_name: 'Tom',
};
expectType<SnakeCasedProperties<User>>(result);
expectType<SnakeCasedProperties<UserPunctuated, {splitOnPunctuation: true}>>(result);
