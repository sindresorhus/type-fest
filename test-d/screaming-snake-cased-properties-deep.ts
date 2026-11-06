import {expectTypeOf} from 'nz';
import type {WordsOptions} from '../source/words.d.ts';
import type {IsEqual, JsonValue, ReadonlyDate, ScreamingSnakeCasedPropertiesDeep, Tagged} from '../index.d.ts';

type FooBar = {helloWorld: {p2p: Array<{addressLine1: string}>}};

declare const foo: ScreamingSnakeCasedPropertiesDeep<FooBar>;
expectTypeOf(foo).toBe<{HELLO_WORLD: {P2P: Array<{ADDRESS_LINE1: string}>}}>();

declare const bar: ScreamingSnakeCasedPropertiesDeep<FooBar, {splitOnNumbers: true}>;
expectTypeOf(bar).toBe<{HELLO_WORLD: {P_2_P: Array<{ADDRESS_LINE_1: string}>}}>();

// Verify example
type User = {
	userId: number;
	userName: string;
	date: Date;
	regExp: RegExp;
};

type UserPunctuated = {
	'user::id': number;
	'user::name': string;
	date: Date;
	'reg::exp': RegExp;
};

type UserWithFriends = {
	userInfo: User;
	userFriends: User[];
};

type UserWithFriendsPunctuated = {
	'user@info': UserPunctuated;
	'user#friends': UserPunctuated[];
};

const result: ScreamingSnakeCasedPropertiesDeep<UserWithFriends> = {
	USER_INFO: {
		USER_ID: 1,
		USER_NAME: 'Tom',
		DATE: new Date(),
		REG_EXP: /.*/,
	},
	USER_FRIENDS: [
		{
			USER_ID: 2,
			USER_NAME: 'Jerry',
			DATE: new Date(),
			REG_EXP: /.*/,
		},
		{
			USER_ID: 3,
			USER_NAME: 'Spike',
			DATE: new Date(),
			REG_EXP: /.*/,
		},
	],
};
expectTypeOf(result).toBe<ScreamingSnakeCasedPropertiesDeep<UserWithFriends>>();
expectTypeOf(result).toBe<ScreamingSnakeCasedPropertiesDeep<UserWithFriendsPunctuated, {splitOnPunctuation: true}>>();

expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{fooBar: unknown}>>().toBe<{FOO_BAR: unknown}>();
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{fooBar: {barBaz: unknown}; biz: unknown}>>().toBe<{FOO_BAR: {BAR_BAZ: unknown}; BIZ: unknown}>();

expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{fooBar: any}>>().toBe<{FOO_BAR: any}>();
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{fooBar: {barBaz: any}; biz: any}>>().toBe<{FOO_BAR: {BAR_BAZ: any}; BIZ: any}>();

expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{'foo::bar': unknown}, {splitOnPunctuation: true}>>().toBe<{'FOO_BAR': unknown}>();
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{'foo::bar': {'bar@baz': unknown}; biz: unknown}, {splitOnPunctuation: true}>>().toBe<{'FOO_BAR': {'BAR_BAZ': unknown}; BIZ: unknown}>();

// Tuples keep their shape, their optional elements and their `readonly` modifier.
declare const tuple: ScreamingSnakeCasedPropertiesDeep<{tuple: [number, string, {fooBar: 1}]}>;
expectTypeOf(tuple).toBe<{TUPLE: [number, string, {FOO_BAR: 1}]}>();

declare const tupleWithOptionalTail: ScreamingSnakeCasedPropertiesDeep<[string, {fooBar: 1}?]>;
expectTypeOf(tupleWithOptionalTail).toBe<[string, {FOO_BAR: 1}?]>();

declare const readonlyOptionalTuple: ScreamingSnakeCasedPropertiesDeep<readonly [string, {fooBar: 1}?]>;
expectTypeOf(readonlyOptionalTuple).toBe<readonly [string, {FOO_BAR: 1}?]>();

declare const emptyTuple: ScreamingSnakeCasedPropertiesDeep<[]>;
expectTypeOf(emptyTuple).toBe<[]>();

declare const readonlyEmptyTuple: ScreamingSnakeCasedPropertiesDeep<readonly []>;
expectTypeOf(readonlyEmptyTuple).toBe<readonly []>();

// A leading rest element keeps its position, and every element is still converted.
type LeadingRest = ScreamingSnakeCasedPropertiesDeep<[...Array<{userId: string}>, {userName: number}]>;
expectTypeOf<IsEqual<LeadingRest, [...Array<{USER_ID: string}>, {USER_NAME: number}]>>().toBe<true>();

type ReadonlyLeadingRest = ScreamingSnakeCasedPropertiesDeep<readonly [...Array<{userId: string}>, {userName: number}]>;
expectTypeOf<IsEqual<ReadonlyLeadingRest, readonly [...Array<{USER_ID: string}>, {USER_NAME: number}]>>().toBe<true>();

// Every optional element keeps its `?`, including repeated element types.
declare const allOptionalTuple: ScreamingSnakeCasedPropertiesDeep<[string?, {fooBar: 1}?]>;
expectTypeOf(allOptionalTuple).toBe<[string?, {FOO_BAR: 1}?]>();
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<[{fooBar: 1}, {fooBar: 1}?, {fooBar: 1}?]>>()
	.toBe<[{FOO_BAR: 1}, {FOO_BAR: 1}?, {FOO_BAR: 1}?]>();

// Map, Set, and their readonly and weak variants are preserved, with their contents recursed into.
declare const mutableMap: ScreamingSnakeCasedPropertiesDeep<Map<{fooBar: 1}, {bazQux: 2}>>;
expectTypeOf(mutableMap).toBe<Map<{FOO_BAR: 1}, {BAZ_QUX: 2}>>();

declare const mutableSet: ScreamingSnakeCasedPropertiesDeep<Set<{fooBar: 1}>>;
expectTypeOf(mutableSet).toBe<Set<{FOO_BAR: 1}>>();

declare const readonlySet: ScreamingSnakeCasedPropertiesDeep<ReadonlySet<{fooBar: number}>>;
expectTypeOf(readonlySet).toBe<ReadonlySet<{FOO_BAR: number}>>();

declare const readonlyMap: ScreamingSnakeCasedPropertiesDeep<ReadonlyMap<{fooBar: 1}, {bazQux: 2}>>;
expectTypeOf(readonlyMap).toBe<ReadonlyMap<{FOO_BAR: 1}, {BAZ_QUX: 2}>>();

declare const weakMap: ScreamingSnakeCasedPropertiesDeep<WeakMap<{fooBar: 1}, string>>;
expectTypeOf(weakMap).toBe<WeakMap<{FOO_BAR: 1}, string>>();

declare const weakSet: ScreamingSnakeCasedPropertiesDeep<WeakSet<{fooBar: 1}>>;
expectTypeOf(weakSet).toBe<WeakSet<{FOO_BAR: 1}>>();

// Nested containers and arrays are walked through at every level.
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<Map<{fooBar: 1}, Set<{bazQux: 2}>>>>()
	.toBe<Map<{FOO_BAR: 1}, Set<{BAZ_QUX: 2}>>>();
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<ReadonlyArray<ReadonlyArray<{fooBar: 1}>>>>()
	.toBe<ReadonlyArray<ReadonlyArray<{FOO_BAR: 1}>>>();
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<string[][]>>().toBe<string[][]>();

// A plain object with `name` and `message` is structurally an `Error`, but it is data, so it is still converted.
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{last_error: {name: string; message: string; error_code: number}}>>().toBe<{LAST_ERROR: {NAME: string; MESSAGE: string; ERROR_CODE: number}}>();

// A recursive element type is walked lazily, so it does not become infinitely deep. An index-signature key converts to `Uppercase<string>`, so the sample key is uppercase.
({JSON: [{A: 1}]}) satisfies ScreamingSnakeCasedPropertiesDeep<{json: JsonValue}>;

// A thenable is a single value like a `Promise`, so it is kept as it is, extra members included.
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{fooBar: PromiseLike<{aB: 1}> & {extraKey: 1}}>>().toBe<{FOO_BAR: PromiseLike<{aB: 1}> & {extraKey: 1}}>();

// A DOM node is a single value, so it is kept as is.
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{fooBar: HTMLElement}>>().toBe<{FOO_BAR: HTMLElement}>();

// Primitives, branded strings, dates and nullish values are leaves, so they are kept as is.
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{userRole: Tagged<string, 'Role'>; updatedAt: ReadonlyDate; deletedAt: null}>>()
	.toBe<{USER_ROLE: Tagged<string, 'Role'>; UPDATED_AT: ReadonlyDate; DELETED_AT: null}>();
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<42 | 'foo' | true | null | undefined>>()
	.toBe<42 | 'foo' | true | null | undefined>();

// Options reach nested keys.
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{userInfo2: {nestedValue3: 1}}, {splitOnNumbers: true}>>()
	.toBe<{USER_INFO_2: {NESTED_VALUE_3: 1}}>();

// Keys that collide produce a union of their values at every depth.
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{fooBar: {aB: 1}; foo_bar: {aB: 2}}>>()
	.toBe<{FOO_BAR: {A_B: 1} | {A_B: 2}}>();

// Symbol keys pass through at every depth.
declare const uniqueKey: unique symbol;
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{[uniqueKey]: {fooBar: 1}; bazQux: 2}>>()
	.toBe<{[uniqueKey]: {FOO_BAR: 1}; BAZ_QUX: 2}>();

function _keepCallable<Options extends WordsOptions>(value: () => number): ScreamingSnakeCasedPropertiesDeep<() => number, Options> {
	return value;
}

function _keepArray<Options extends WordsOptions>(value: string[]): ScreamingSnakeCasedPropertiesDeep<string[], Options> {
	return value;
}

function _keepMap<Options extends WordsOptions>(value: Map<string, number>): ScreamingSnakeCasedPropertiesDeep<Map<string, number>, Options> {
	return value;
}

function _keepPromise<Options extends WordsOptions>(value: Promise<string>): {value: ScreamingSnakeCasedPropertiesDeep<Promise<string>, Options>} {
	return {value};
}

function _keepUnknown<Options extends WordsOptions>(value: unknown): ScreamingSnakeCasedPropertiesDeep<unknown, Options> {
	return value;
}

function _keepTuple<Options extends WordsOptions>(value: readonly [string, number?]): ScreamingSnakeCasedPropertiesDeep<readonly [string, number?], Options> {
	return value;
}

function _keepSet<Options extends WordsOptions>(value: Set<string>): ScreamingSnakeCasedPropertiesDeep<Set<string>, Options> {
	return value;
}

function _keepLiteral<Options extends WordsOptions>(value: 42): ScreamingSnakeCasedPropertiesDeep<42, Options> {
	return value;
}

function _keepEmptyObject<Options extends WordsOptions>(value: {}): ScreamingSnakeCasedPropertiesDeep<{}, Options> {
	return value;
}

// Resolving options in the scalar transform keeps selected fields' modifiers and values intact.
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{readonly userId2?: {nestedValue: 1}; mutableValue?: string}, {splitOnNumbers: true; splitOnPunctuation: true}>>()
	.toBe<{readonly USER_ID_2?: {NESTED_VALUE: 1}; MUTABLE_VALUE?: string}>();
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<never>>().toBe<never>();
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<any>>().toBe<any>();
expectTypeOf<ScreamingSnakeCasedPropertiesDeep<unknown>>().toBe<unknown>();
// @ts-expect-error Options must describe the supported casing flags.
type UnknownCasingOptions = ScreamingSnakeCasedPropertiesDeep<{userInfo: 1}, unknown>;
// @ts-expect-error Options must only contain the supported casing flags.
type UnknownOptionName = ScreamingSnakeCasedPropertiesDeep<{userInfo: 1}, {splitOnCase: true}>;

enum CasedField {
	UserInfo = 'userInfo',
}

expectTypeOf<ScreamingSnakeCasedPropertiesDeep<{readonly [CasedField.UserInfo]?: {nestedValue: 1}}>>()
	.toBe<{readonly USER_INFO?: {NESTED_VALUE: 1}}>();

function _keepGenericPromise<Value, Options extends WordsOptions>(value: Promise<Value>): {value: ScreamingSnakeCasedPropertiesDeep<Promise<Value>, Options>} {
	return {value};
}

declare const copiedNestedModifiers: ScreamingSnakeCasedPropertiesDeep<{readonly userInfo?: {readonly nestedValue?: number; optionalValue?: number}}>;
// @ts-expect-error Recursive recasing preserves readonly fields.
copiedNestedModifiers.USER_INFO = {NESTED_VALUE: 1};
// @ts-expect-error Optional nested fields do not admit an explicit undefined.
copiedNestedModifiers.USER_INFO!.OPTIONAL_VALUE = undefined;
