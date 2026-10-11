import {expectTypeOf} from 'nz';
import type {SnakeCasedProperties} from '../index.d.ts';

type Foobar = {helloWorld1: {fooBar: string}};
type FoobarPunctuated = {'hello@World1': {'foo::Bar': string}};

declare const foo: SnakeCasedProperties<Foobar>;
expectTypeOf(foo).toBe<{hello_world1: {fooBar: string}}>();

declare const bar: SnakeCasedProperties<Foobar, {splitOnNumbers: true}>;
expectTypeOf(bar).toBe<{hello_world_1: {fooBar: string}}>();

declare const fooBarPunctuated: SnakeCasedProperties<FoobarPunctuated>;
expectTypeOf(fooBarPunctuated).toBe<{'hello@world1': {'foo::Bar': string}}>();

declare const fooBarPunctuatedSplit: SnakeCasedProperties<FoobarPunctuated, {splitOnPunctuation: true}>;
expectTypeOf(fooBarPunctuatedSplit).toBe<{'hello_world1': {'foo::Bar': string}}>();

declare const fooBarPunctuatedSplitNumberSplit: SnakeCasedProperties<FoobarPunctuated, {splitOnPunctuation: true; splitOnNumbers: true}>;
expectTypeOf(fooBarPunctuatedSplitNumberSplit).toBe<{'hello_world_1': {'foo::Bar': string}}>();

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
expectTypeOf(result).toBe<SnakeCasedProperties<User>>();
expectTypeOf(result).toBe<SnakeCasedProperties<UserPunctuated, {splitOnPunctuation: true}>>();
