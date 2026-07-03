import {expectType} from 'tsd';
import type {KebabCasedProperties} from '../index.d.ts';

type Foobar = {helloWorld1: {fooBar: string}};
type FoobarPunctuated = {'hello@World1': {'foo::Bar': string}};

declare const foo: KebabCasedProperties<Foobar>;
expectType<{'hello-world1': {fooBar: string}}>(foo);

declare const bar: KebabCasedProperties<Foobar, {splitOnNumbers: true}>;
expectType<{'hello-world-1': {fooBar: string}}>(bar);

declare const fooBarPunctuated: KebabCasedProperties<FoobarPunctuated>;
expectType<{'hello@-world1': {'foo::Bar': string}}>(fooBarPunctuated);

declare const fooBarPunctuatedSplit: KebabCasedProperties<FoobarPunctuated, {splitOnPunctuation: true}>;
expectType<{'hello-world1': {'foo::Bar': string}}>(fooBarPunctuatedSplit);

declare const fooBarPunctuatedSplitNumberSplit: KebabCasedProperties<FoobarPunctuated, {splitOnPunctuation: true; splitOnNumbers: true}>;
expectType<{'hello-world-1': {'foo::Bar': string}}>(fooBarPunctuatedSplitNumberSplit);

// Verify example
type User = {
	userId: number;
	userName: string;
};

type UserPunctuated = {
	'user::Id': number;
	'user::Name': string;
};

const result: KebabCasedProperties<User> = {
	'user-id': 1,
	'user-name': 'Tom',
};
expectType<KebabCasedProperties<User>>(result);

expectType<KebabCasedProperties<UserPunctuated, {splitOnPunctuation: true}>>(result);
