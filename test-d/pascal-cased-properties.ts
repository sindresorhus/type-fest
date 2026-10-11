import {expectTypeOf} from 'nz';
import type {PascalCasedProperties} from '../index.d.ts';

declare const foo: PascalCasedProperties<{helloWorld: {fooBar: string}}>;
type FoobarPunctuated = {'hello@World1': {'foo::Bar': string}};

expectTypeOf(foo).toBe<{HelloWorld: {fooBar: string}}>();

declare const bar: PascalCasedProperties<Array<{helloWorld: string}>>;
expectTypeOf(bar).toBe<Array<{helloWorld: string}>>();

declare const fooBar: PascalCasedProperties<() => {a: string}>;
expectTypeOf(fooBar).toBe<() => {a: string}>();

declare const fooBarPunctuated: PascalCasedProperties<FoobarPunctuated>;
expectTypeOf(fooBarPunctuated).toBe<{'Hello@World1': {'foo::Bar': string}}>();

declare const fooBarPunctuatedSplit: PascalCasedProperties<FoobarPunctuated, {splitOnPunctuation: true}>;
expectTypeOf(fooBarPunctuatedSplit).toBe<{'HelloWorld1': {'foo::Bar': string}}>();

declare const fooBarPunctuatedSplitNumberSplit: PascalCasedProperties<FoobarPunctuated, {splitOnPunctuation: true; splitOnNumbers: true}>;
expectTypeOf(fooBarPunctuatedSplitNumberSplit).toBe<{'HelloWorld1': {'foo::Bar': string}}>();

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
expectTypeOf(result).toBe<PascalCasedProperties<User>>();
expectTypeOf(result).toBe<PascalCasedProperties<UserPunctuated, {splitOnPunctuation: true}>>();

declare const baz: PascalCasedProperties<{fooBAR: number; BARFoo: string}, {preserveConsecutiveUppercase: true}>;
expectTypeOf(baz).toBe<{FooBAR: number; BARFoo: string}>();

declare const biz: PascalCasedProperties<{fooBAR: number; BARFoo: string}>;
expectTypeOf(biz).toBe<{FooBar: number; BarFoo: string}>();

// A readonly array is still an array, and passes through unchanged.
expectTypeOf<PascalCasedProperties<ReadonlyArray<{fooBar: number}>>>().toBe<ReadonlyArray<{fooBar: number}>>();
expectTypeOf<PascalCasedProperties<Array<{fooBar: number}>>>().toBe<Array<{fooBar: number}>>();
