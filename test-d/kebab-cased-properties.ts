import {expectTypeOf} from 'nz';
import type {WordsOptions} from '../source/words.d.ts';
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

// Resolving options in the scalar transform keeps selected fields' modifiers and values intact.
expectTypeOf<KebabCasedProperties<{readonly userId2?: {nestedValue: 1}; mutableValue?: string}, {splitOnNumbers: true; splitOnPunctuation: true}>>()
	.toBe<{readonly 'user-id-2'?: {nestedValue: 1}; 'mutable-value'?: string}>();
expectTypeOf<KebabCasedProperties<never>>().toBe<never>();
expectTypeOf<KebabCasedProperties<any>>().toBe<any>();
expectTypeOf<KebabCasedProperties<unknown>>().toBe<{}>();

function _readGenericPayload<Value>(value: KebabCasedProperties<{readonly userPayload: Promise<Value>}>): {value: Promise<Value>} {
	return {value: value['user-payload']};
}

function _keepGenericCallable<Value, Options extends WordsOptions>(value: () => Value): KebabCasedProperties<() => Value, Options> {
	return value;
}

declare const copiedModifiers: KebabCasedProperties<{readonly userId?: number; mutableValue?: string}>;
// @ts-expect-error Recasing a property does not make a readonly field writable.
copiedModifiers['user-id'] = 1;
copiedModifiers['mutable-value'] = 'updated';
// @ts-expect-error Optional fields do not admit an explicit undefined.
copiedModifiers['mutable-value'] = undefined;
