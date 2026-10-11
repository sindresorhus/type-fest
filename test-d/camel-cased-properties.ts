import {expectTypeOf} from 'nz';
import type {CamelCasedProperties, IsEqual} from '../index.d.ts';

declare const foo: CamelCasedProperties<{A: number; B: {C: string}}>;
expectTypeOf(foo).toBe<{a: number; b: {C: string}}>();

declare const bar: CamelCasedProperties<Array<{helloWorld: string}>>;
expectTypeOf(bar).toBe<Array<{helloWorld: string}>>();

declare const fooBar: CamelCasedProperties<() => {a: string}>;
expectTypeOf(fooBar).toBe<() => {a: string}>();

declare const baz: CamelCasedProperties<{fooBAR: number; BARFoo: string}, {preserveConsecutiveUppercase: true}>;
expectTypeOf(baz).toBe<{fooBAR: number; bARFoo: string}>();

declare const biz: CamelCasedProperties<{fooBAR: number; BARFoo: string}>;
expectTypeOf(biz).toBe<{fooBar: number; barFoo: string}>();

declare const fooBarPunctuated: CamelCasedProperties<{'hello@world1': {'foo::bar': string}}>;
expectTypeOf(fooBarPunctuated).toBe<{'hello@world1': {'foo::bar': string}}>();

declare const fooBarPunctuatedSplit: CamelCasedProperties<{'hello@world1': {'foo::bar': string}}, {splitOnPunctuation: true}>;
expectTypeOf(fooBarPunctuatedSplit).toBe<{'helloWorld1': {'foo::bar': string}}>();

declare const fooBarPunctuatedSplitNumberSplit: CamelCasedProperties<{'hello@world1': {'foo::bar': string}}, {splitOnPunctuation: true; splitOnNumbers: true}>;
expectTypeOf(fooBarPunctuatedSplitNumberSplit).toBe<{'helloWorld1': {'foo::bar': string}}>();

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
expectTypeOf(result).toBe<CamelCasedProperties<User>>();
expectTypeOf(result).toBe<CamelCasedProperties<UserPunctuated, {splitOnPunctuation: true}>>();

declare const withLeadingUnderscores: CamelCasedProperties<{_foo_bar: string; __baz_qux: number}, {preserveLeadingUnderscores: true}>;
expectTypeOf(withLeadingUnderscores).toBe<{_fooBar: string; __bazQux: number}>();

declare const withLeadingUnderscoresDefault: CamelCasedProperties<{_foo_bar: string}>;
expectTypeOf(withLeadingUnderscoresDefault).toBe<{fooBar: string}>();

// A readonly array has no properties to re-case, so it passes through unchanged, like it does for `PascalCasedProperties` and `DelimiterCasedProperties`. `IsEqual` is used because the flattened object the bug produced still satisfies `expectType<readonly string[]>`.
expectTypeOf<IsEqual<CamelCasedProperties<readonly string[]>, readonly string[]>>().toBe<true>();
expectTypeOf<IsEqual<CamelCasedProperties<readonly [1, 2]>, readonly [1, 2]>>().toBe<true>();
expectTypeOf<IsEqual<CamelCasedProperties<string[]>, string[]>>().toBe<true>();
expectTypeOf<IsEqual<CamelCasedProperties<[1, 2]>, [1, 2]>>().toBe<true>();
