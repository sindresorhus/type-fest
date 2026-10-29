import {expectTypeOf} from 'nz';
import type {CamelCaseOptions} from '../source/camel-case.d.ts';
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

// Generic options cannot delay values that are returned unchanged.
function _keepValue<Options extends CamelCaseOptions>(value: readonly string[]): PascalCasedProperties<readonly string[], Options> {
	return value;
}

function _keepCallable<Options extends CamelCaseOptions>(value: () => number): PascalCasedProperties<() => number, Options> {
	return value;
}

// A non-literal preservation flag resolves like the default.
expectTypeOf<PascalCasedProperties<{_foo_bar: 1}, {preserveLeadingUnderscores: boolean}>>().toBe<{FooBar: 1}>();

// Resolving options in the scalar transform keeps selected fields' modifiers and values intact.
expectTypeOf<PascalCasedProperties<{readonly userId2?: {nestedValue: 1}; mutableValue?: string}, {splitOnNumbers: true; splitOnPunctuation: true}>>()
	.toBe<{readonly UserId2?: {nestedValue: 1}; MutableValue?: string}>();
expectTypeOf<PascalCasedProperties<never>>().toBe<never>();
expectTypeOf<PascalCasedProperties<any>>().toBe<any>();
expectTypeOf<PascalCasedProperties<unknown>>().toBe<{}>();

function _readGenericPayload<Value>(value: PascalCasedProperties<{readonly userPayload: Promise<Value>}>): {value: Promise<Value>} {
	return {value: value.UserPayload};
}

function _keepGenericCallable<Value, Options extends CamelCaseOptions>(value: () => Value): PascalCasedProperties<() => Value, Options> {
	return value;
}

declare const copiedModifiers: PascalCasedProperties<{readonly userId?: number; mutableValue?: string}>;
// @ts-expect-error Recasing a property does not make a readonly field writable.
copiedModifiers.UserId = 1;
copiedModifiers.MutableValue = 'updated';
// @ts-expect-error Optional fields do not admit an explicit undefined.
copiedModifiers.MutableValue = undefined;
