import {expectTypeOf} from 'nz';
import type {KebabCasedProperties} from '../index.d.ts';

type Foobar = {helloWorld1: {fooBar: string}};
type FoobarPunctuated = {'hello@World1': {'foo::Bar': string}};

declare const foo: KebabCasedProperties<Foobar>;
expectTypeOf(foo).toBe<{'hello-world1': {fooBar: string}}>();

declare const bar: KebabCasedProperties<Foobar, {splitOnNumbers: true}>;
expectTypeOf(bar).toBe<{'hello-world-1': {fooBar: string}}>();

declare const fooBarPunctuated: KebabCasedProperties<FoobarPunctuated>;
expectTypeOf(fooBarPunctuated).toBe<{'hello@world1': {'foo::Bar': string}}>();

declare const fooBarPunctuatedSplit: KebabCasedProperties<FoobarPunctuated, {splitOnPunctuation: true}>;
expectTypeOf(fooBarPunctuatedSplit).toBe<{'hello-world1': {'foo::Bar': string}}>();

declare const fooBarPunctuatedSplitNumberSplit: KebabCasedProperties<FoobarPunctuated, {splitOnPunctuation: true; splitOnNumbers: true}>;
expectTypeOf(fooBarPunctuatedSplitNumberSplit).toBe<{'hello-world-1': {'foo::Bar': string}}>();

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
expectTypeOf(result).toBe<KebabCasedProperties<User>>();

expectTypeOf(result).toBe<KebabCasedProperties<UserPunctuated, {splitOnPunctuation: true}>>();

// A readonly array is still an array, and passes through unchanged.
expectTypeOf<KebabCasedProperties<ReadonlyArray<{fooBar: number}>>>().toBe<ReadonlyArray<{fooBar: number}>>();
expectTypeOf<KebabCasedProperties<Array<{fooBar: number}>>>().toBe<Array<{fooBar: number}>>();
