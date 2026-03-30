import {expectType} from 'tsd';
import type {DelimiterCasedProperties} from '../index.d.ts';

declare const foo: DelimiterCasedProperties<{helloWorld: {fooBar: string}}, '/'>;
expectType<{'hello/world': {fooBar: string}}>(foo);

declare const bar: DelimiterCasedProperties<Array<{helloWorld: string}>, '-'>;
expectType<Array<{helloWorld: string}>>(bar);

declare const fooBar: DelimiterCasedProperties<() => {a: string}, '-'>;
expectType<() => {a: string}>(fooBar);

declare const withOptions: DelimiterCasedProperties<{helloWorld1: {fooBar: string}}, '.', {splitOnNumbers: true}>;
expectType<{'hello.world.1': {fooBar: string}}>(withOptions);

declare const withPunctuation: DelimiterCasedProperties<{'hello@World1': {'foo::Bar': string}}, '.'>;
expectType<{'hello@.world1': {'foo::Bar': string}}>(withPunctuation);

declare const withPunctuationSplit: DelimiterCasedProperties<{'hello@World1': {'foo::Bar': string}}, '.', {splitOnPunctuation: true}>;
expectType<{'hello.world1': {'foo::Bar': string}}>(withPunctuationSplit);

declare const withPunctuationSplitAndNumbers: DelimiterCasedProperties<{'hello@World1': {'foo::Bar': string}}, '.', {splitOnPunctuation: true; splitOnNumbers: true}>;
expectType<{'hello.world.1': {'foo::Bar': string}}>(withPunctuationSplitAndNumbers);

// Verify example
type User = {
	userId: number;
	userName: string;
};

type UserPunctuated = {
	'user::Id': number;
	'user::Name': string;
};

const result: DelimiterCasedProperties<User, '-'> = {
	'user-id': 1,
	'user-name': 'Tom',
};
expectType<DelimiterCasedProperties<User, '-'>>(result);
expectType<DelimiterCasedProperties<UserPunctuated, '-', {splitOnPunctuation: true}>>(result);
