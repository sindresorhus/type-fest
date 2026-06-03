import {expectType} from 'tsd';
import type {CamelCasedProperties} from '../index.d.ts';

declare const foo: CamelCasedProperties<{A: number; B: {C: string}}>;
expectType<{a: number; b: {C: string}}>(foo);

declare const bar: CamelCasedProperties<Array<{helloWorld: string}>>;
expectType<Array<{helloWorld: string}>>(bar);

declare const fooBar: CamelCasedProperties<() => {a: string}>;
expectType<() => {a: string}>(fooBar);

declare const baz: CamelCasedProperties<{fooBAR: number; BARFoo: string}, {preserveConsecutiveUppercase: true}>;
expectType<{fooBAR: number; bARFoo: string}>(baz);

declare const biz: CamelCasedProperties<{fooBAR: number; BARFoo: string}>;
expectType<{fooBar: number; barFoo: string}>(biz);

declare const fooBarPunctuated: CamelCasedProperties<{'hello@world1': {'foo::bar': string}}>;
expectType<{'hello@world1': {'foo::bar': string}}>(fooBarPunctuated);

declare const fooBarPunctuatedSplit: CamelCasedProperties<{'hello@world1': {'foo::bar': string}}, {splitOnPunctuation: true}>;
expectType<{'helloWorld1': {'foo::bar': string}}>(fooBarPunctuatedSplit);

declare const fooBarPunctuatedSplitNumberSplit: CamelCasedProperties<{'hello@world1': {'foo::bar': string}}, {splitOnPunctuation: true; splitOnNumbers: true}>;
expectType<{'helloWorld1': {'foo::bar': string}}>(fooBarPunctuatedSplitNumberSplit);

// Verify example
type User = {
	UserId: number;
	UserName: string;
};

type UserPunctuated = {
	'user::id': number;
	'user::name': string;
};

const result: CamelCasedProperties<User> = {
	userId: 1,
	userName: 'Tom',
};
expectType<CamelCasedProperties<User>>(result);
expectType<CamelCasedProperties<UserPunctuated, {splitOnPunctuation: true}>>(result);

declare const withLeadingUnderscores: CamelCasedProperties<{_foo_bar: string; __baz_qux: number}, {preserveLeadingUnderscores: true}>;
expectType<{_fooBar: string; __bazQux: number}>(withLeadingUnderscores);

declare const withLeadingUnderscoresDefault: CamelCasedProperties<{_foo_bar: string}>;
expectType<{fooBar: string}>(withLeadingUnderscoresDefault);
