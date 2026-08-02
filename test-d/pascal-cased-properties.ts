import {expectType} from 'tsd';
import type {PascalCasedProperties} from '../index.d.ts';

declare const foo: PascalCasedProperties<{helloWorld: {fooBar: string}}>;
type FoobarPunctuated = {'hello@World1': {'foo::Bar': string}};

expectType<{HelloWorld: {fooBar: string}}>(foo);

declare const bar: PascalCasedProperties<Array<{helloWorld: string}>>;
expectType<Array<{helloWorld: string}>>(bar);

declare const fooBar: PascalCasedProperties<() => {a: string}>;
expectType<() => {a: string}>(fooBar);

declare const fooBarPunctuated: PascalCasedProperties<FoobarPunctuated>;
expectType<{'Hello@World1': {'foo::Bar': string}}>(fooBarPunctuated);

declare const fooBarPunctuatedSplit: PascalCasedProperties<FoobarPunctuated, {splitOnPunctuation: true}>;
expectType<{'HelloWorld1': {'foo::Bar': string}}>(fooBarPunctuatedSplit);

declare const fooBarPunctuatedSplitNumberSplit: PascalCasedProperties<FoobarPunctuated, {splitOnPunctuation: true; splitOnNumbers: true}>;
expectType<{'HelloWorld1': {'foo::Bar': string}}>(fooBarPunctuatedSplitNumberSplit);

// Verify example
type User = {
	userId: number;
	userName: string;
};

type UserPunctuated = {
	'user::id': number;
	'user::name': string;
};

const result: PascalCasedProperties<User> = {
	UserId: 1,
	UserName: 'Tom',
};
expectType<PascalCasedProperties<User>>(result);
expectType<PascalCasedProperties<UserPunctuated, {splitOnPunctuation: true}>>(result);

declare const baz: PascalCasedProperties<{fooBAR: number; BARFoo: string}, {preserveConsecutiveUppercase: true}>;
expectType<{FooBAR: number; BARFoo: string}>(baz);

declare const biz: PascalCasedProperties<{fooBAR: number; BARFoo: string}>;
expectType<{FooBar: number; BarFoo: string}>(biz);
