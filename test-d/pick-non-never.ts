import {expectTypeOf} from 'nz';
import type {PickNonNever} from '../index.d.ts';

// Removes the properties that have the `never` type
expectTypeOf<PickNonNever<{a: string; b: never}>>().toBe<{a: string}>();
expectTypeOf<PickNonNever<{a: never; b: never}>>().toBe<{}>();
expectTypeOf<PickNonNever<{a: string; b: number}>>().toBe<{a: string; b: number}>();
expectTypeOf<PickNonNever<{}>>().toBe<{}>();

// The examples from the docs
type Example = {
	a: string;
	b: never;
	c?: number;
	d?: never;
};

expectTypeOf<PickNonNever<Example>>().toBe<{a: string; c?: number}>();

type Client = {
	getUser: 'GET /users/:id';
	getPosts?: 'GET /posts';
	createPost?: 'POST /posts';
};

type Getters<ObjectType> = {
	[Key in keyof ObjectType]: Key extends `get${string}` ? ObjectType[Key] : never;
};

expectTypeOf<PickNonNever<Getters<Client>>>().toBe<{
	getUser: 'GET /users/:id';
	getPosts?: 'GET /posts';
}>();

// Keeps the `readonly` and optional modifiers
expectTypeOf<PickNonNever<{readonly a: never; readonly b: string}>>().toBe<{readonly b: string}>();
expectTypeOf<PickNonNever<{a?: string; readonly b?: string; c: never}>>().toBe<{a?: string; readonly b?: string}>();

// An optional `never` property is removed, while an optional `undefined` property is kept
expectTypeOf<PickNonNever<{a?: never; readonly b?: never; c?: undefined; d: string}>>().toBe<{c?: undefined; d: string}>();
expectTypeOf<PickNonNever<Partial<{a: never; b: string}>>>().toBe<{b?: string}>();
expectTypeOf<PickNonNever<{a?: unknown; b?: any; c?: never}>>().toBe<{a?: unknown; b?: any}>();

// The `never` markers of an exclusive union are removed too
expectTypeOf<PickNonNever<{a: string; b?: never} | {a?: never; b: number}>>().toBe<{a: string} | {b: number}>();

// `undefined`, `null`, `void`, and `unknown` are not `never`, and are kept
expectTypeOf<PickNonNever<{a: undefined; b: null; c: void; d: unknown}>>().toBe<{a: undefined; b: null; c: void; d: unknown}>();

// The property types are kept as is
expectTypeOf<PickNonNever<{a: never[]; b: never}>>().toBe<{a: never[]}>();
expectTypeOf<PickNonNever<{a: () => never; b: never}>>().toBe<{a: () => never}>();
expectTypeOf<PickNonNever<{a: any; b: never}>>().toBe<{a: any}>();

// Only the top level is checked
expectTypeOf<PickNonNever<{a: {b: never; c: string}}>>().toBe<{a: {b: never; c: string}}>();

// Each member of a union is handled by itself
expectTypeOf<PickNonNever<{a: string; b: never} | {c: number; d: never}>>().toBe<{a: string} | {c: number}>();

// A key that is `never` in one member only is removed from that member only
expectTypeOf<PickNonNever<{a: never; b: 1} | {a: string}>>().toBe<{b: 1} | {a: string}>();

// A member without a property to keep becomes an empty object
expectTypeOf<PickNonNever<{a: string} | {b: never}>>().toBe<{a: string} | {}>();

// Arrays and tuples become plain objects, like with `Pick`
type Head<Value> = Value extends readonly [infer First, ...unknown[]] ? First : 'not a tuple';
expectTypeOf<Head<PickNonNever<[string, number]>>>().toBe<'not a tuple'>();
expectTypeOf<[...PickNonNever<[string, number]>]>().toBe<Array<string | number>>();
expectTypeOf<PickNonNever<[string, never]>['length']>().toBe<2>();
expectTypeOf<Extract<keyof PickNonNever<[string, never]>, `${number}`>>().toBe<'0'>();
expectTypeOf<Extract<keyof PickNonNever<[string, never?]>, `${number}`>>().toBe<'0'>();
expectTypeOf<PickNonNever<readonly [string, number]>[0]>().toBe<string>();
expectTypeOf<PickNonNever<string[]>[number]>().toBe<string>();
expectTypeOf<Extract<keyof PickNonNever<never[]>, number>>().toBe<never>();

// An index signature whose value is `never` is removed
expectTypeOf<PickNonNever<{[key: string]: never}>>().toBe<{}>();
expectTypeOf<PickNonNever<{[key: string]: string; a: never}>>().toBe<{[key: string]: string}>();
expectTypeOf<PickNonNever<Record<string, never>>>().toBe<{}>();
expectTypeOf<PickNonNever<{[key: `data-${string}`]: never}>>().toBe<{}>();
expectTypeOf<PickNonNever<{[key: string]: undefined}>>().toBe<{[key: string]: undefined}>();
expectTypeOf<PickNonNever<{[key: number]: never}>>().toBe<{}>();
expectTypeOf<PickNonNever<{[key: number]: never; [key: string]: string}>>().toBe<{[key: string]: string}>();

// Number keys work like string keys
expectTypeOf<PickNonNever<{0: never; 1: string}>>().toBe<{1: string}>();

// Symbol keys work like string keys
declare const symbolKey: unique symbol;
expectTypeOf<PickNonNever<{[symbolKey]: never; a: string}>>().toBe<{a: string}>();
expectTypeOf<PickNonNever<{[symbolKey]: string; [Symbol.iterator]: never}>>().toBe<{[symbolKey]: string}>();

// Call and construct signatures are left out, like with `Pick`
expectTypeOf<PickNonNever<{(): void; a: never; b: string}>>().toBe<{b: string}>();
expectTypeOf<PickNonNever<{new (): object; a: string}>>().toBe<{a: string}>();

// A method is kept, since only its parameters and return type can be `never`
expectTypeOf<PickNonNever<{a(): void; b: never}>>().toBe<{a: () => void}>();

// Protected members are left out, like with `keyof`
declare class Store {
	value: never;
	count: number;
	protected cached: string;
}
expectTypeOf<PickNonNever<Store>>().toBe<{count: number}>();

// Intersections are flattened by the mapped type
expectTypeOf<PickNonNever<{a: never} & {b: string}>>().toBe<{b: string}>();
expectTypeOf<PickNonNever<{a: never; b: string} & {b: never}>>().toBe<{}>();

// Applying it again changes nothing
expectTypeOf<PickNonNever<PickNonNever<Example>>>().toBe<PickNonNever<Example>>();

// The removed property is not accessible
declare const result: PickNonNever<Example>;
expectTypeOf<keyof typeof result>().toBe<'a' | 'c'>();
expectTypeOf(result.a).toBe<string>();
// @ts-expect-error The property that had the `never` type is gone.
const _b: unknown = result.b;

// Composes several mapped types that mark properties with `never`
type MethodReturnTypes<ObjectType> = {
	[Key in keyof ObjectType]: ObjectType[Key] extends (...arguments_: any) => any ? ReturnType<ObjectType[Key]> : never;
};

type Converters<ObjectType> = {
	[Key in keyof ObjectType]: Key extends `to${string}` ? ObjectType[Key] : never;
};

type Person = {
	name: string;
	total: number;
	greet(): string;
	toJSON(): object;
	toString(): string;
};

expectTypeOf<PickNonNever<MethodReturnTypes<Converters<Person>>>>().toBe<{toJSON: object; toString: string}>();

// Works in a generic signature
declare function withoutNever<ObjectType extends object>(object: ObjectType): PickNonNever<ObjectType>;
expectTypeOf(withoutNever({a: 'a', b: undefined as never})).toBe<{a: string}>();

// A generic object is assignable to the result
function assignGeneric<ObjectType extends object>(object: ObjectType) {
	const picked: PickNonNever<ObjectType> = object;
}

function assignConstrainedGeneric<ObjectType extends {a: string; b: never}>(object: ObjectType) {
	const picked: PickNonNever<ObjectType> = object;
}

function assignOptionalConstrainedGeneric<ObjectType extends {a: string; b?: never}>(object: ObjectType) {
	const picked: PickNonNever<ObjectType> = object;
}

// In a generic function, a property of the result cannot be read, like with `Pick` with keys computed from the property types
function readGeneric<ObjectType extends {a: string; b: never}>(object: ObjectType) {
	const picked: PickNonNever<ObjectType> = object;
	// @ts-expect-error A property of a generic result cannot be read.
	const _a: unknown = picked.a;
}

// `never` and `object` stay as they are
expectTypeOf<PickNonNever<never>>().toBe<never>();
expectTypeOf<PickNonNever<object>>().toBe<object>();

// `any` has every key, and none of them are `never`
expectTypeOf<PickNonNever<any>>().toBe<{[key: string]: any}>();

// @ts-expect-error
type DoesNotAllowUnknown = PickNonNever<unknown>;
// @ts-expect-error
type DoesNotAllowPrimitives = PickNonNever<string>;
// @ts-expect-error
type DoesNotAllowUndefined = PickNonNever<undefined>;
