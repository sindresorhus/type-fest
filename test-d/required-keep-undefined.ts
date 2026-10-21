import {expectTypeOf} from 'nz';
import type {PartialDeep, PartialOnUndefinedDeep, RequiredKeepUndefined, RequiredKeysOf, SetOptional, SetRequired, Tagged, UndefinedOnPartialDeep} from '../index.d.ts';

// Optional keys become required and accept `undefined`
expectTypeOf<RequiredKeepUndefined<{a?: string; b: number}>>().toBe<{a: string | undefined; b: number}>();
expectTypeOf<RequiredKeepUndefined<{a?: string; b?: number}>>().toBe<{a: string | undefined; b: number | undefined}>();
expectTypeOf<RequiredKeepUndefined<{a?: 'x' | 'y'; b?: boolean}>>().toBe<{a: 'x' | 'y' | undefined; b: boolean | undefined}>();
expectTypeOf<RequiredKeepUndefined<{[Key in 'a' | 'b']?: Key}>>().toBe<{a: 'a' | undefined; b: 'b' | undefined}>();
expectTypeOf<RequiredKeepUndefined<{'a-b'?: 1; 'a b'?: 2; ''?: 3}>>().toBe<{'a-b': 1 | undefined; 'a b': 2 | undefined; '': 3 | undefined}>();

// Required keys are kept as is
expectTypeOf<RequiredKeepUndefined<{a: string; b: number}>>().toBe<{a: string; b: number}>();
expectTypeOf<RequiredKeepUndefined<{a: string | undefined}>>().toBe<{a: string | undefined}>();
expectTypeOf<RequiredKeepUndefined<{a: string | null}>>().toBe<{a: string | null}>();
expectTypeOf<RequiredKeepUndefined<{a: undefined}>>().toBe<{a: undefined}>();

// An optional key with an explicit `undefined`
expectTypeOf<RequiredKeepUndefined<{a?: string | undefined}>>().toBe<{a: string | undefined}>();
expectTypeOf<RequiredKeepUndefined<{a?: undefined}>>().toBe<{a: undefined}>();
expectTypeOf<RequiredKeepUndefined<{a?: string | null}>>().toBe<{a: string | null | undefined}>();
expectTypeOf<RequiredKeepUndefined<{a?: string | null | undefined}>>().toBe<{a: string | null | undefined}>();

// The added `undefined` is a real `undefined`, so a later `Partial` keeps it
expectTypeOf<Partial<RequiredKeepUndefined<{a?: string}>>>().toBe<{a?: string | undefined}>();
expectTypeOf<{a: undefined}>().toBeAssignableTo<Partial<RequiredKeepUndefined<{a?: string}>>>();
expectTypeOf<Partial<RequiredKeepUndefined<[string?]>>>().toBe<[(string | undefined)?]>();

// Same as the built-in `Required` when there are no optional keys
expectTypeOf<RequiredKeepUndefined<{a: string; b: number | undefined}>>().toBe<Required<{a: string; b: number | undefined}>>();

// Preserves the `readonly` modifier
expectTypeOf<RequiredKeepUndefined<{readonly a?: string; readonly b: number; c?: boolean}>>().toBe<{readonly a: string | undefined; readonly b: number; c: boolean | undefined}>();
expectTypeOf<RequiredKeepUndefined<{readonly a?: readonly string[]}>>().toBe<{readonly a: readonly string[] | undefined}>();
expectTypeOf<RequiredKeepUndefined<Readonly<Partial<{a: string; b: number}>>>>().toBe<{readonly a: string | undefined; readonly b: number | undefined}>();

// Special value types
expectTypeOf<RequiredKeepUndefined<{a?: never}>>().toBe<{a: undefined}>();
expectTypeOf<RequiredKeepUndefined<{a: never}>>().toBe<{a: never}>();
expectTypeOf<RequiredKeepUndefined<{a?: any}>>().toBe<{a: any}>();
expectTypeOf<RequiredKeepUndefined<{a?: unknown}>>().toBe<{a: unknown}>();
expectTypeOf<RequiredKeepUndefined<{a?: void}>>().toBe<{a: void | undefined}>();
expectTypeOf<RequiredKeepUndefined<{a?: null}>>().toBe<{a: null | undefined}>();
expectTypeOf<RequiredKeepUndefined<{a?: 0; b?: ''; c?: false}>>().toBe<{a: 0 | undefined; b: '' | undefined; c: false | undefined}>();
expectTypeOf<RequiredKeepUndefined<{a?: `id-${number}`}>>().toBe<{a: `id-${number}` | undefined}>();
expectTypeOf<RequiredKeepUndefined<{a?: string | void}>>().toBe<{a: string | void | undefined}>();
expectTypeOf<RequiredKeepUndefined<{a?: never[]}>>().toBe<{a: never[] | undefined}>();

// Nested objects are not changed
expectTypeOf<RequiredKeepUndefined<{a?: {b?: string}}>>().toBe<{a: {b?: string} | undefined}>();
expectTypeOf<RequiredKeepUndefined<{a: {b?: string}}>>().toBe<{a: {b?: string}}>();
expectTypeOf<RequiredKeepUndefined<{a?: string[]}>>().toBe<{a: string[] | undefined}>();

// Recursive types
type Tree = {
	value: number;
	children?: Tree[];
};
expectTypeOf<RequiredKeepUndefined<Tree>>().toBe<{value: number; children: Tree[] | undefined}>();

// Methods and function values
expectTypeOf<RequiredKeepUndefined<{a?(): void; b(): string}>>().toBe<{a: (() => void) | undefined; b: () => string}>();
expectTypeOf<RequiredKeepUndefined<{a?: (value: number) => string}>>().toBe<{a: ((value: number) => string) | undefined}>();

type Overloaded = {
	parse?(value: string): number;
	parse?(value: number): string;
};
expectTypeOf<RequiredKeepUndefined<Overloaded>>().toBe<{parse: {(value: string): number; (value: number): string} | undefined}>();

// Getters become `readonly` properties
expectTypeOf<RequiredKeepUndefined<{get a(): string; b?: number}>>().toBe<{readonly a: string; b: number | undefined}>();

// Accessors with a setter are writable
expectTypeOf<RequiredKeepUndefined<{get a(): string; set a(value: string)}>>().toBe<{a: string}>();
expectTypeOf<RequiredKeepUndefined<{set a(value: string)}>>().toBe<{a: string}>();

// Call and construct signatures are not kept, the same as with the built-in `Required`
expectTypeOf<RequiredKeepUndefined<{(): void; a?: string}>>().toBe<{a: string | undefined}>();
expectTypeOf<RequiredKeepUndefined<{new (): object; a?: string}>>().toBe<{a: string | undefined}>();
expectTypeOf<RequiredKeepUndefined<() => void>>().toBe<{}>();

// An array-like object is not treated as an array
expectTypeOf<RequiredKeepUndefined<{0?: string; length?: number}>>().toBe<{0: string | undefined; length: number | undefined}>();

// Built-in object types are the same as with the built-in `Required`
expectTypeOf<RequiredKeepUndefined<Date>>().toBe<Required<Date>>();
expectTypeOf<RequiredKeepUndefined<Map<string, number>>>().toBe<Required<Map<string, number>>>();
expectTypeOf<RequiredKeepUndefined<Promise<number>>>().toBe<Required<Promise<number>>>();

// Symbol, numeric, and enum keys
declare const symbolKey: unique symbol;
expectTypeOf<RequiredKeepUndefined<{[symbolKey]?: string; 0?: number; 1: boolean}>>().toBe<{[symbolKey]: string | undefined; 0: number | undefined; 1: boolean}>();
expectTypeOf<RequiredKeepUndefined<{[Symbol.iterator]?: () => Iterator<number>}>>().toBe<{[Symbol.iterator]: (() => Iterator<number>) | undefined}>();
expectTypeOf<RequiredKeepUndefined<{readonly [symbolKey]?: string; readonly a?: number; [Symbol.iterator](): Iterator<number>; b: string}>>()
	.toBe<{readonly [symbolKey]: string | undefined; readonly a: number | undefined; [Symbol.iterator]: () => Iterator<number>; b: string}>();
expectTypeOf<RequiredKeepUndefined<{[key: symbol]: string; [key: string]: number | undefined; a?: number}>>().toBe<{[key: symbol]: string; [key: string]: number | undefined; a: number | undefined}>();
expectTypeOf<RequiredKeepUndefined<{'1'?: string; '-1'?: number; 1.5?: boolean}>>().toBe<{'1': string | undefined; '-1': number | undefined; 1.5: boolean | undefined}>();

enum StringKey {
	A = 'a',
	B = 'b',
}
expectTypeOf<RequiredKeepUndefined<{[StringKey.A]?: string; [StringKey.B]: number}>>().toBe<{[StringKey.A]: string | undefined; [StringKey.B]: number}>();

enum NumericKey {
	Zero,
	One,
}
expectTypeOf<RequiredKeepUndefined<Partial<Record<NumericKey, string>>>>().toBe<{[NumericKey.Zero]: string | undefined; [NumericKey.One]: string | undefined}>();
expectTypeOf<RequiredKeepUndefined<{[symbolKey]?: undefined}>>().toBe<{[symbolKey]: undefined}>();
// A symbol key that was optional accepts `undefined`, although TypeScript prints it without `undefined` (known limitation)
expectTypeOf<{[symbolKey]: undefined}>().toBeAssignableTo<RequiredKeepUndefined<{[symbolKey]?: string}>>();
expectTypeOf<{}>().not.toBeAssignableTo<RequiredKeepUndefined<{[symbolKey]?: string}>>();

// Keys created with key remapping
type EventHandlers = {[Key in `on${'Click' | 'Hover'}`]?: () => void};
expectTypeOf<RequiredKeepUndefined<EventHandlers>>().toBe<{onClick: (() => void) | undefined; onHover: (() => void) | undefined}>();

// Index signatures are kept as is
expectTypeOf<RequiredKeepUndefined<{[key: string]: number}>>().toBe<{[key: string]: number}>();
expectTypeOf<RequiredKeepUndefined<{[key: string]: number | undefined}>>().toBe<{[key: string]: number | undefined}>();
expectTypeOf<RequiredKeepUndefined<{[key: number]: string}>>().toBe<{[key: number]: string}>();
expectTypeOf<RequiredKeepUndefined<{[key: symbol]: string}>>().toBe<{[key: symbol]: string}>();
expectTypeOf<RequiredKeepUndefined<Record<string, number>>>().toBe<Record<string, number>>();
expectTypeOf<RequiredKeepUndefined<{[key: `data-${string}`]: string; id?: string}>>().toBe<{[key: `data-${string}`]: string; id: string | undefined}>();
expectTypeOf<RequiredKeepUndefined<{[key: string]: number | undefined; a?: number; b: number}>>().toBe<{[key: string]: number | undefined; a: number | undefined; b: number}>();
expectTypeOf<RequiredKeepUndefined<{[key: string]: unknown; a?: 1}>>().toBe<{[key: string]: unknown; a: 1 | undefined}>();
expectTypeOf<RequiredKeepUndefined<{readonly [key: string]: number | undefined; a?: number}>>().toBe<{readonly [key: string]: number | undefined; a: number | undefined}>();
expectTypeOf<RequiredKeepUndefined<{[key: number]: string | undefined; 0?: string; 1: string}>>().toBe<{[key: number]: string | undefined; 0: string | undefined; 1: string}>();
expectTypeOf<RequiredKeepUndefined<{[key: string]: string | undefined; [key: number]: string}>>().toBe<{[key: string]: string | undefined; [key: number]: string}>();
expectTypeOf<RequiredKeepUndefined<Record<string, unknown> & {a?: number}>>().toBe<{[key: string]: unknown; a: number | undefined}>();

// An optional key next to an index signature that does not accept `undefined` is required, but cannot be set to `undefined` (known limitation)
type IndexSignatureOptions = RequiredKeepUndefined<{[key: string]: number; timeout?: number}>;
expectTypeOf<{timeout: number}>().toBeAssignableTo<IndexSignatureOptions>();
expectTypeOf<{timeout: undefined}>().not.toBeAssignableTo<IndexSignatureOptions>();
expectTypeOf<{}>().not.toBeAssignableTo<IndexSignatureOptions>();

// Records with literal keys
expectTypeOf<RequiredKeepUndefined<Partial<Record<'a' | 'b', number>>>>().toBe<{a: number | undefined; b: number | undefined}>();
expectTypeOf<RequiredKeepUndefined<Record<'a' | 'b', number>>>().toBe<{a: number; b: number}>();
expectTypeOf<RequiredKeepUndefined<Record<'a' | 'b', number> & Partial<Record<'b' | 'c', number>>>>().toBe<{a: number; b: number; c: number | undefined}>();

// Interfaces
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface BaseInterface {
	id: string;
	createdAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ExtendedInterface extends BaseInterface {
	name?: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface OverridingInterface extends BaseInterface {
	createdAt: Date;
}

expectTypeOf<RequiredKeepUndefined<BaseInterface>>().toBe<{id: string; createdAt: Date | undefined}>();
expectTypeOf<RequiredKeepUndefined<ExtendedInterface>>().toBe<{id: string; createdAt: Date | undefined; name: string | undefined}>();
expectTypeOf<RequiredKeepUndefined<OverridingInterface>>().toBe<{id: string; createdAt: Date}>();
// The result is a type literal, so unlike the interface, it is assignable to an index signature
expectTypeOf<BaseInterface>().not.toBeAssignableTo<Record<string, unknown>>();
expectTypeOf<RequiredKeepUndefined<BaseInterface>>().toBeAssignableTo<Record<string, unknown>>();

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface FluentInterface {
	next?(): this;
	value: number;
}

// The `this` type is resolved to the interface
expectTypeOf<RequiredKeepUndefined<FluentInterface>>().toBe<{next: (() => FluentInterface) | undefined; value: number}>();

// Class instance types: static and protected members are not included
declare class Person {
	static create(): Person;
	id: string;
	nickname?: string;
	protected internal?: number;
	greet(): string;
	greetOptional?(): string;
}
expectTypeOf<RequiredKeepUndefined<Person>>().toBe<{id: string; nickname: string | undefined; greet: () => string; greetOptional: (() => string) | undefined}>();

// Intersections
expectTypeOf<RequiredKeepUndefined<{a?: string} & {b: number}>>().toBe<{a: string | undefined; b: number}>();
expectTypeOf<RequiredKeepUndefined<{a?: string} & {readonly b?: number}>>().toBe<{a: string | undefined; readonly b: number | undefined}>();
expectTypeOf<RequiredKeepUndefined<{a?: string} & {a: string}>>().toBe<{a: string}>();
expectTypeOf<RequiredKeepUndefined<{a?: string} & {a?: 'x'}>>().toBe<{a: 'x' | undefined}>();
expectTypeOf<RequiredKeepUndefined<{a?: 1} & {b?: 2} & {c: 3}>>().toBe<{a: 1 | undefined; b: 2 | undefined; c: 3}>();
expectTypeOf<RequiredKeepUndefined<{a?: string} & {a?: undefined}>>().toBe<{a: undefined}>();
// A key is `readonly` only when it is `readonly` in every member of the intersection
expectTypeOf<RequiredKeepUndefined<{readonly a?: 1} & {a: 1}>>().toBe<{a: 1}>();

// Unions are distributed
expectTypeOf<RequiredKeepUndefined<{a?: string} | {b?: number}>>().toBe<{a: string | undefined} | {b: number | undefined}>();
expectTypeOf<RequiredKeepUndefined<{a?: 1} | {a: 2}>>().toBe<{a: 1 | undefined} | {a: 2}>();
expectTypeOf<RequiredKeepUndefined<{a?: string; b: number} | {a: string; b?: number}>>().toBe<{a: string | undefined; b: number} | {a: string; b: number | undefined}>();
expectTypeOf<RequiredKeepUndefined<{kind: 'circle'; radius?: number} | {kind: 'square'; size: number; label?: string}>>()
	.toBe<{kind: 'circle'; radius: number | undefined} | {kind: 'square'; size: number; label: string | undefined}>();
expectTypeOf<RequiredKeepUndefined<[number?] | {a?: string}>>().toBe<[number | undefined] | {a: string | undefined}>();
expectTypeOf<RequiredKeepUndefined<[number?] | [number]>>().toBe<[number | undefined] | [number]>();
expectTypeOf<RequiredKeepUndefined<[number?] | [string, boolean?]>>().toBe<[number | undefined] | [string, boolean | undefined]>();
expectTypeOf<RequiredKeepUndefined<[number?] | readonly [string?]>>().toBe<[number | undefined] | readonly [string | undefined]>();
expectTypeOf<RequiredKeepUndefined<string[] | {a?: 1}>>().toBe<string[] | {a: 1 | undefined}>();
expectTypeOf<RequiredKeepUndefined<[a?: string] | []>>().toBe<[a: string | undefined] | []>();
expectTypeOf<RequiredKeepUndefined<object | {a?: 1}>>().toBe<object | {a: 1 | undefined}>();

// Empty and wide object types
expectTypeOf<RequiredKeepUndefined<{}>>().toBe<{}>();
expectTypeOf<RequiredKeepUndefined<object>>().toBe<object>();

// Tuples: optional elements become required and accept `undefined`
expectTypeOf<RequiredKeepUndefined<[string, number?]>>().toBe<[string, number | undefined]>();
expectTypeOf<RequiredKeepUndefined<[string?, number?]>>().toBe<[string | undefined, number | undefined]>();
expectTypeOf<RequiredKeepUndefined<[string, number?, boolean?]>>().toBe<[string, number | undefined, boolean | undefined]>();
expectTypeOf<RequiredKeepUndefined<[string, number, boolean?]>>().toBe<[string, number, boolean | undefined]>();
expectTypeOf<RequiredKeepUndefined<[string, number]>>().toBe<[string, number]>();
expectTypeOf<RequiredKeepUndefined<[string, (number | undefined)?]>>().toBe<[string, number | undefined]>();
expectTypeOf<RequiredKeepUndefined<[string | undefined, number?]>>().toBe<[string | undefined, number | undefined]>();
expectTypeOf<RequiredKeepUndefined<Partial<[string, number]>>>().toBe<[string | undefined, number | undefined]>();
expectTypeOf<RequiredKeepUndefined<[]>>().toBe<[]>();
expectTypeOf<RequiredKeepUndefined<Partial<Readonly<[1, 2]>>>>().toBe<readonly [1 | undefined, 2 | undefined]>();

// Tuples: the length is fixed
expectTypeOf<RequiredKeepUndefined<[string, number?]>['length']>().toBe<2>();
expectTypeOf<RequiredKeepUndefined<[string?, number?]>['length']>().toBe<2>();

// Tuples: labeled and `readonly` tuples
expectTypeOf<RequiredKeepUndefined<[x: number, y?: number]>>().toBe<[x: number, y: number | undefined]>();
expectTypeOf<RequiredKeepUndefined<[a?: string, b?: number, c?: boolean]>>().toBe<[a: string | undefined, b: number | undefined, c: boolean | undefined]>();
expectTypeOf<RequiredKeepUndefined<readonly [string, number?]>>().toBe<readonly [string, number | undefined]>();
expectTypeOf<RequiredKeepUndefined<readonly [string?, number?, boolean?]>>().toBe<readonly [string | undefined, number | undefined, boolean | undefined]>();
expectTypeOf<RequiredKeepUndefined<readonly []>>().toBe<readonly []>();

// Tuples: nested tuples and objects are not changed
expectTypeOf<RequiredKeepUndefined<[[number?]?]>>().toBe<[[number?] | undefined]>();
expectTypeOf<RequiredKeepUndefined<[{a?: string}?]>>().toBe<[{a?: string} | undefined]>();

// Tuples: special element types
expectTypeOf<RequiredKeepUndefined<[(string | null)?]>>().toBe<[string | null | undefined]>();
expectTypeOf<RequiredKeepUndefined<[undefined?]>>().toBe<[undefined]>();
expectTypeOf<RequiredKeepUndefined<[any?]>>().toBe<[any]>();
expectTypeOf<RequiredKeepUndefined<[unknown?]>>().toBe<[unknown]>();
expectTypeOf<RequiredKeepUndefined<[never?]>>().toBe<[undefined]>();
expectTypeOf<RequiredKeepUndefined<[never]>>().toBe<[never]>();
expectTypeOf<RequiredKeepUndefined<[void?]>>().toBe<[void | undefined]>();
expectTypeOf<RequiredKeepUndefined<[never?, string?]>>().toBe<[undefined, string | undefined]>();

// Tuples: rest elements and the elements after them are kept as is, while optional elements before them are changed
expectTypeOf<RequiredKeepUndefined<[string, number?, ...boolean[]]>>().toBe<[string, number | undefined, ...boolean[]]>();
expectTypeOf<RequiredKeepUndefined<[string, ...Array<number | undefined>]>>().toBe<[string, ...Array<number | undefined>]>();
expectTypeOf<RequiredKeepUndefined<[...Array<string | undefined>, number]>>().toBe<[...Array<string | undefined>, number]>();
expectTypeOf<RequiredKeepUndefined<[...string[], number | undefined]>>().toBe<[...string[], number | undefined]>();
expectTypeOf<RequiredKeepUndefined<[string, ...Array<number | undefined>, boolean]>>().toBe<[string, ...Array<number | undefined>, boolean]>();
expectTypeOf<RequiredKeepUndefined<readonly [string?, ...number[]]>>().toBe<readonly [string | undefined, ...number[]]>();
expectTypeOf<RequiredKeepUndefined<readonly [string, ...number[], boolean]>>().toBe<readonly [string, ...number[], boolean]>();
expectTypeOf<RequiredKeepUndefined<[string, number?, ...boolean[]]>['length']>().toBe<number>();

// Tuples: variadic generic tuples
type PrependString<Rest extends unknown[]> = RequiredKeepUndefined<[string, ...Rest]>;
expectTypeOf<PrependString<[number?]>>().toBe<[string, number | undefined]>();
expectTypeOf<PrependString<[number, boolean?]>>().toBe<[string, number, boolean | undefined]>();
expectTypeOf<PrependString<number[]>>().toBe<[string, ...number[]]>();
expectTypeOf<PrependString<[]>>().toBe<[string]>();

type AppendOptionalString<Head extends unknown[]> = RequiredKeepUndefined<[...Head, string?]>;
expectTypeOf<AppendOptionalString<[number]>>().toBe<[number, string | undefined]>();
expectTypeOf<AppendOptionalString<[number?]>>().toBe<[number | undefined, string | undefined]>();

// Arrays are kept as is
expectTypeOf<RequiredKeepUndefined<string[]>>().toBe<string[]>();
expectTypeOf<RequiredKeepUndefined<Array<string | undefined>>>().toBe<Array<string | undefined>>();
expectTypeOf<RequiredKeepUndefined<ReadonlyArray<string | undefined>>>().toBe<ReadonlyArray<string | undefined>>();
expectTypeOf<RequiredKeepUndefined<unknown[]>>().toBe<unknown[]>();
expectTypeOf<RequiredKeepUndefined<any[]>>().toBe<any[]>();
expectTypeOf<RequiredKeepUndefined<never[]>>().toBe<never[]>();
expectTypeOf<RequiredKeepUndefined<Array<{a?: string}>>>().toBe<Array<{a?: string}>>();

// An array type with extra keys becomes an object type, the same as with the built-in `Required`. Its keys that were optional become required and have `undefined` in their value type.
expectTypeOf<Pick<RequiredKeepUndefined<string[] & {tag?: string}>, 'tag'>>().toBe<{tag: string | undefined}>();
expectTypeOf<RequiredKeepUndefined<string[] & {tag?: string}>[number]>().toBe<string>();
expectTypeOf<Pick<RequiredKeepUndefined<[string, number?] & {extra?: 1}>, 'extra' | 1>>().toBe<{extra: 1 | undefined; 1: number | undefined}>();
expectTypeOf<Pick<RequiredKeepUndefined<Tagged<[number?], 'Id'>>, 0>>().toBe<{0: number | undefined}>();
// The `length` of such a tuple is not changed, the same as with the built-in `Required`
expectTypeOf<RequiredKeepUndefined<[string, number?] & {extra?: 1}>['length']>().toBe<1 | 2>();

// Every key must be present
type Options = {
	name: string;
	timeout?: number;
};

expectTypeOf<{name: string; timeout: undefined}>().toBeAssignableTo<RequiredKeepUndefined<Options>>();
expectTypeOf<{name: string; timeout: number}>().toBeAssignableTo<RequiredKeepUndefined<Options>>();
expectTypeOf<{name: string}>().not.toBeAssignableTo<RequiredKeepUndefined<Options>>();
expectTypeOf<{name: string; timeout: string}>().not.toBeAssignableTo<RequiredKeepUndefined<Options>>();
expectTypeOf<{name: undefined; timeout: number}>().not.toBeAssignableTo<RequiredKeepUndefined<Options>>();
expectTypeOf<Options>().not.toBeAssignableTo<RequiredKeepUndefined<Options>>();
expectTypeOf<RequiredKeepUndefined<Options>>().not.toBeAssignableTo<Required<Options>>();
// With `exactOptionalPropertyTypes`, an optional key does not accept `undefined`
expectTypeOf<RequiredKeepUndefined<Options>>().not.toBeAssignableTo<Options>();

// The keys are writable, and a key that was optional can be set to `undefined`
declare const resolvedOptions: RequiredKeepUndefined<Options>;
resolvedOptions.timeout = undefined;
// @ts-expect-error
resolvedOptions.name = undefined;
// With `exactOptionalPropertyTypes`, a key that is not optional cannot be deleted
// @ts-expect-error
delete resolvedOptions.timeout;

const completeOptions: RequiredKeepUndefined<Options> = {name: 'unicorn', timeout: undefined};
// @ts-expect-error
const incompleteOptions: RequiredKeepUndefined<Options> = {name: 'unicorn'};
const optionsWithUnknownKey: RequiredKeepUndefined<Options> = {
	name: 'unicorn',
	timeout: undefined,
	// @ts-expect-error
	retries: 2,
};

// Every tuple element must be present
expectTypeOf<[string]>().not.toBeAssignableTo<RequiredKeepUndefined<[string, number?]>>();
expectTypeOf<[string, undefined]>().toBeAssignableTo<RequiredKeepUndefined<[string, number?]>>();
expectTypeOf<[string, undefined, undefined]>().toBeAssignableTo<RequiredKeepUndefined<[string, number?, boolean?]>>();
expectTypeOf<[string, number]>().not.toBeAssignableTo<RequiredKeepUndefined<[string, number?, boolean?]>>();
// With `exactOptionalPropertyTypes`, an optional element does not accept `undefined`
expectTypeOf<RequiredKeepUndefined<[string, number?]>>().not.toBeAssignableTo<[string, number?]>();
expectTypeOf<RequiredKeepUndefined<readonly [string?]>>().not.toBeAssignableTo<readonly [string?]>();

// Realistic use-cases
type EnvironmentVariables = {
	NODE_ENV: 'development' | 'production';
	PORT?: string;
	DATABASE_URL?: string;
};
expectTypeOf<RequiredKeepUndefined<EnvironmentVariables>>().toBe<{NODE_ENV: 'development' | 'production'; PORT: string | undefined; DATABASE_URL: string | undefined}>();
expectTypeOf<{NODE_ENV: 'production'; PORT: undefined; DATABASE_URL: undefined}>().toBeAssignableTo<RequiredKeepUndefined<EnvironmentVariables>>();
expectTypeOf<{NODE_ENV: 'production'; PORT: '3000'}>().not.toBeAssignableTo<RequiredKeepUndefined<EnvironmentVariables>>();
expectTypeOf<{NODE_ENV: undefined; PORT: undefined; DATABASE_URL: undefined}>().not.toBeAssignableTo<RequiredKeepUndefined<EnvironmentVariables>>();

type User = {
	id: number;
	name: string;
	email?: string;
	avatarUrl?: string | null;
};
expectTypeOf<RequiredKeepUndefined<User>>().toBe<{id: number; name: string; email: string | undefined; avatarUrl: string | null | undefined}>();

// Map one model to another
type ApiUser = {
	id: number;
	nickname?: string;
};

function toDatabaseUser(user: ApiUser): RequiredKeepUndefined<ApiUser> {
	return {id: user.id, nickname: user.nickname};
}

function toIncompleteDatabaseUser(user: ApiUser): RequiredKeepUndefined<ApiUser> {
	// @ts-expect-error
	return {id: user.id};
}

// Composition with other types
expectTypeOf<RequiredKeepUndefined<Partial<Options>>>().toBe<{name: string | undefined; timeout: number | undefined}>();
expectTypeOf<RequiredKeepUndefined<Required<Options>>>().toBe<Required<Options>>();
expectTypeOf<RequiredKeepUndefined<RequiredKeepUndefined<Options>>>().toBe<RequiredKeepUndefined<Options>>();
expectTypeOf<RequiredKeysOf<RequiredKeepUndefined<Options>>>().toBe<'name' | 'timeout'>();
expectTypeOf<RequiredKeepUndefined<SetOptional<{a: string; b: number}, 'a'>>>().toBe<{a: string | undefined; b: number}>();
expectTypeOf<RequiredKeepUndefined<SetRequired<{a?: string; b?: number}, 'a'>>>().toBe<{a: string; b: number | undefined}>();
expectTypeOf<RequiredKeepUndefined<PartialDeep<{a: {b: string}; c: number}>>>().toBe<{a: {b?: string} | undefined; c: number | undefined}>();
expectTypeOf<RequiredKeepUndefined<UndefinedOnPartialDeep<Options>>>().toBe<{name: string; timeout: number | undefined}>();
expectTypeOf<RequiredKeepUndefined<Options>>().toBeAssignableTo<UndefinedOnPartialDeep<Options>>();
// `PartialOnUndefinedDeep` makes the keys that accept `undefined` optional again
expectTypeOf<PartialOnUndefinedDeep<RequiredKeepUndefined<Options>>>().toBe<{name: string; timeout?: number | undefined}>();
// The tag of a tagged object is kept
expectTypeOf<RequiredKeepUndefined<Tagged<{a?: string}, 'Id'>>>().toBeAssignableTo<Tagged<{a: string | undefined}, 'Id'>>();

// Generic value types
type GenericValue<Value> = RequiredKeepUndefined<{a?: Value; b: Value}>;
expectTypeOf<GenericValue<string>>().toBe<{a: string | undefined; b: string}>();

function genericFunction<Value>(value: RequiredKeepUndefined<{a?: Value}>) {
	expectTypeOf(value).toBe<{a: Value | undefined}>();
}

function genericTuple<Value>(value: RequiredKeepUndefined<[Value, Value?]>) {
	expectTypeOf(value).toBe<[Value, Value | undefined]>();
}

function genericAssignment<Value>(value: Value) {
	const result: RequiredKeepUndefined<{a?: Value; b: Value}> = {a: undefined, b: value};
	return result;
}

function genericObject<Type extends {name?: string}>(value: RequiredKeepUndefined<Type>) {
	const {name}: {name: string | undefined} = value;
	return name;
}

function genericKeys<Keys extends string>(value: RequiredKeepUndefined<{[Key in Keys]?: number}>) {
	return value;
}

expectTypeOf<ReturnType<typeof genericKeys<'x' | 'y'>>>().toBe<{x: number | undefined; y: number | undefined}>();

function genericToConcrete<Type extends {a?: string}>(value: RequiredKeepUndefined<Type>): RequiredKeepUndefined<{a?: string}> {
	return value;
}

function genericTupleLength<Rest extends unknown[]>(value: RequiredKeepUndefined<[string, ...Rest]>): number {
	return value.length;
}

// Edge cases
expectTypeOf<RequiredKeepUndefined<any>>().toBe<{[key: string]: any}>();
expectTypeOf<RequiredKeepUndefined<never>>().toBe<never>();

// @ts-expect-error
type NoUnknown = RequiredKeepUndefined<unknown>;

// @ts-expect-error
type NoString = RequiredKeepUndefined<string>;

// @ts-expect-error
type NoNumber = RequiredKeepUndefined<number>;

// @ts-expect-error
type NoSymbol = RequiredKeepUndefined<symbol>;

// @ts-expect-error
type NoNull = RequiredKeepUndefined<null>;

// @ts-expect-error
type NoUndefined = RequiredKeepUndefined<undefined>;

// @ts-expect-error
type NoOptionalObject = RequiredKeepUndefined<{a?: string} | undefined>;
