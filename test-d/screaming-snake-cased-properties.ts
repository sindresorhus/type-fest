import {expectTypeOf} from 'nz';
import type {WordsOptions} from '../source/words.d.ts';
import type {IsEqual, ScreamingSnakeCasedProperties} from '../index.d.ts';

type Foobar = {helloWorld1: {fooBar: string}};
type FoobarPunctuated = {'hello@World1': {'foo::Bar': string}};

declare const foo: ScreamingSnakeCasedProperties<Foobar>;
expectTypeOf(foo).toBe<{HELLO_WORLD1: {fooBar: string}}>();

declare const bar: ScreamingSnakeCasedProperties<Foobar, {splitOnNumbers: true}>;
expectTypeOf(bar).toBe<{HELLO_WORLD_1: {fooBar: string}}>();

declare const fooBarPunctuated: ScreamingSnakeCasedProperties<FoobarPunctuated>;
expectTypeOf(fooBarPunctuated).toBe<{'HELLO@WORLD1': {'foo::Bar': string}}>();

declare const fooBarPunctuatedSplit: ScreamingSnakeCasedProperties<FoobarPunctuated, {splitOnPunctuation: true}>;
expectTypeOf(fooBarPunctuatedSplit).toBe<{HELLO_WORLD1: {'foo::Bar': string}}>();

declare const fooBarPunctuatedSplitNumberSplit: ScreamingSnakeCasedProperties<FoobarPunctuated, {splitOnPunctuation: true; splitOnNumbers: true}>;
expectTypeOf(fooBarPunctuatedSplitNumberSplit).toBe<{HELLO_WORLD_1: {'foo::Bar': string}}>();

// Verify example
type User = {
	userId: number;
	userName: string;
};

type UserPunctuated = {
	'user::Id': number;
	'user::Name': string;
};

const result: ScreamingSnakeCasedProperties<User> = {
	USER_ID: 1,
	USER_NAME: 'Tom',
};
expectTypeOf(result).toBe<ScreamingSnakeCasedProperties<User>>();
expectTypeOf(result).toBe<ScreamingSnakeCasedProperties<UserPunctuated, {splitOnPunctuation: true}>>();

// Values are not recursed into, since this is the top-level variant.
expectTypeOf<ScreamingSnakeCasedProperties<{userInfo: {userId: number}}>>().toBe<{USER_INFO: {userId: number}}>();
expectTypeOf<ScreamingSnakeCasedProperties<{createdAt: Date; pattern: RegExp}>>().toBe<{CREATED_AT: Date; PATTERN: RegExp}>();
expectTypeOf<ScreamingSnakeCasedProperties<{}>>().toBe<{}>();

// Functions and arrays pass through unchanged.
declare const passthroughFunction: ScreamingSnakeCasedProperties<() => {userId: number}>;
expectTypeOf(passthroughFunction).toBe<() => {userId: number}>();

declare const passthroughArray: ScreamingSnakeCasedProperties<Array<{userId: number}>>;
expectTypeOf(passthroughArray).toBe<Array<{userId: number}>>();

declare const passthroughReadonlyArray: ScreamingSnakeCasedProperties<ReadonlyArray<{userId: number}>>;
expectTypeOf(passthroughReadonlyArray).toBe<ReadonlyArray<{userId: number}>>();

declare const passthroughTuple: ScreamingSnakeCasedProperties<readonly [{userId: number}]>;
expectTypeOf(passthroughTuple).toBe<readonly [{userId: number}]>();

// `IsEqual` confirms the value is unchanged, not merely assignable to the passthrough type.
expectTypeOf<IsEqual<ScreamingSnakeCasedProperties<readonly string[]>, readonly string[]>>().toBe<true>();
expectTypeOf<IsEqual<ScreamingSnakeCasedProperties<string[]>, string[]>>().toBe<true>();
expectTypeOf<IsEqual<ScreamingSnakeCasedProperties<readonly [1, 2]>, readonly [1, 2]>>().toBe<true>();

// Union members are converted separately.
expectTypeOf<ScreamingSnakeCasedProperties<{fooBar: 1} | {bazQux: 2}>>().toBe<{FOO_BAR: 1} | {BAZ_QUX: 2}>();

// Numeric keys pass through unchanged.
expectTypeOf<ScreamingSnakeCasedProperties<{1: string; fooBar: 2}>>().toBe<{1: string; FOO_BAR: 2}>();

// A string index signature becomes an uppercase-string index, since every converted key is uppercase.
declare const indexed: ScreamingSnakeCasedProperties<Record<string, unknown>>;
indexed['FOO_BAR'] = 1;
// @ts-expect-error Converted keys are uppercase.
indexed['foo_bar'] = 1;

// Casing handles consecutive capitals, and numbers are not split by default.
expectTypeOf<ScreamingSnakeCasedProperties<{fooBAR: number; XMLHttpRequest: string; is2FA: boolean}>>()
	.toBe<{FOO_BAR: number; XML_HTTP_REQUEST: string; IS2FA: boolean}>();

// Keys in other casings are converted, and keys that collide produce a union of their values.
expectTypeOf<ScreamingSnakeCasedProperties<{USER_ID: 1; user_id: 2; userId: 3}>>().toBe<{USER_ID: 1 | 2 | 3}>();

// A hyphen separates words by default, while a dot separates them only with `splitOnPunctuation`.
expectTypeOf<ScreamingSnakeCasedProperties<{'foo-bar': 1; 'foo.bar': 2}>>().toBe<{FOO_BAR: 1; 'FOO.BAR': 2}>();
expectTypeOf<ScreamingSnakeCasedProperties<{'foo-bar': 1; 'foo.bar': 2}, {splitOnPunctuation: true}>>()
	.toBe<{FOO_BAR: 1 | 2}>();

// Nullish values keep their converted keys.
expectTypeOf<ScreamingSnakeCasedProperties<{fooBar: null; bazQux: undefined}>>().toBe<{FOO_BAR: null; BAZ_QUX: undefined}>();

// Symbol keys pass through unchanged.
declare const uniqueKey: unique symbol;
expectTypeOf<ScreamingSnakeCasedProperties<{[uniqueKey]: {aB: 1}; fooBar: 2}>>()
	.toBe<{[uniqueKey]: {aB: 1}; FOO_BAR: 2}>();
expectTypeOf<ScreamingSnakeCasedProperties<{[key: symbol]: {aB: 1}}>>().toBe<{[key: symbol]: {aB: 1}}>();

// Enum keys are converted like the string they hold.
enum CasedField {
	UserInfo = 'userInfo',
}

expectTypeOf<ScreamingSnakeCasedProperties<{readonly [CasedField.UserInfo]?: number}>>().toBe<{readonly USER_INFO?: number}>();

// A callable with extra members is still a function, so all of it passes through.
declare const callableWithProperties: (() => void) & {userInfo: 1};
expectTypeOf<ScreamingSnakeCasedProperties<typeof callableWithProperties>>().toBe<(() => void) & {userInfo: 1}>();

// Resolving options in the scalar transform keeps selected fields' modifiers and values intact.
expectTypeOf<ScreamingSnakeCasedProperties<{readonly userId2?: {nestedValue: 1}; mutableValue?: string}, {splitOnNumbers: true; splitOnPunctuation: true}>>()
	.toBe<{readonly USER_ID_2?: {nestedValue: 1}; MUTABLE_VALUE?: string}>();
expectTypeOf<ScreamingSnakeCasedProperties<never>>().toBe<never>();
expectTypeOf<ScreamingSnakeCasedProperties<any>>().toBe<any>();
expectTypeOf<ScreamingSnakeCasedProperties<unknown>>().toBe<{}>();
// @ts-expect-error Options must describe the supported casing flags.
type UnknownCasingOptions = ScreamingSnakeCasedProperties<{userInfo: 1}, unknown>;
// @ts-expect-error Options must only contain the supported casing flags.
type UnknownOptionName = ScreamingSnakeCasedProperties<{userInfo: 1}, {splitOnCase: true}>;

function _readGenericPayload<Value>(value: ScreamingSnakeCasedProperties<{readonly userPayload: Promise<Value>}>): {value: Promise<Value>} {
	return {value: value.USER_PAYLOAD};
}

function _keepGenericCallable<Value, Options extends WordsOptions>(value: () => Value): ScreamingSnakeCasedProperties<() => Value, Options> {
	return value;
}

declare const copiedModifiers: ScreamingSnakeCasedProperties<{readonly userId?: number; mutableValue?: string}>;
// @ts-expect-error Recasing a property does not make a readonly field writable.
copiedModifiers.USER_ID = 1;
copiedModifiers.MUTABLE_VALUE = 'updated';
// @ts-expect-error Optional fields do not admit an explicit undefined.
copiedModifiers.MUTABLE_VALUE = undefined;

const wrongCase: ScreamingSnakeCasedProperties<User> = {
	// @ts-expect-error Keys are converted, so the original spelling is not a property.
	userId: 1,
	USER_NAME: 'Tom',
};
