import {expectTypeOf} from 'nz';
import type {PickReadonly, PickWritable, ReadonlyKeysOf, Simplify, Tagged, Writable} from '../index.d.ts';

expectTypeOf<PickReadonly<{readonly id: number; name: string}>>().toBe<{readonly id: number}>();
expectTypeOf<PickReadonly<{readonly a: string; readonly b: number}>>().toBe<{readonly a: string; readonly b: number}>();
expectTypeOf<PickReadonly<{a: string; b: number}>>().toBe<{}>();
expectTypeOf<PickReadonly<{}>>().toBe<{}>();

// The examples from the docs
type User = {
	readonly id: number;
	readonly createdAt?: Date;
	name: string;
};
expectTypeOf<PickReadonly<User>>().toBe<{readonly id: number; readonly createdAt?: Date}>();

type Shape =
	| {readonly kind: 'circle'; radius: number}
	| {readonly kind: 'square'; readonly size: number};
expectTypeOf<PickReadonly<Shape>>().toBe<{readonly kind: 'circle'} | {readonly kind: 'square'; readonly size: number}>();

// Keeps the `readonly` and optional modifiers, and leaves out writable optional properties
expectTypeOf<PickReadonly<{readonly a?: string; b?: number; readonly c: string | undefined}>>().toBe<{readonly a?: string; readonly c: string | undefined}>();
expectTypeOf<PickReadonly<{readonly a?: string | undefined; b?: undefined}>>().toBe<{readonly a?: string | undefined}>();

// Keeps the property types as is
expectTypeOf<PickReadonly<{readonly nested: {a: string}; name: string}>>().toBe<{readonly nested: {a: string}}>();
expectTypeOf<PickReadonly<{readonly a: any; readonly b: unknown; readonly c: never; d: any}>>().toBe<{readonly a: any; readonly b: unknown; readonly c: never}>();
expectTypeOf<PickReadonly<{readonly tags: string[]; list: readonly string[]}>>().toBe<{readonly tags: string[]}>();

// Only the top level is checked
expectTypeOf<PickReadonly<{nested: {readonly a: string}}>>().toBe<{}>();

// Each member of a union keeps its own readonly properties
expectTypeOf<PickReadonly<{readonly id: number; a: string} | {readonly id: string; readonly b: number}>>().toBe<{readonly id: number} | {readonly id: string; readonly b: number}>();
expectTypeOf<PickReadonly<{readonly a: 1} | {readonly b: 2} | {c: 3; readonly d: 4}>>().toBe<{readonly a: 1} | {readonly b: 2} | {readonly d: 4}>();

// A member without readonly properties becomes an empty object
expectTypeOf<PickReadonly<{readonly a: string} | {b: number}>>().toBe<{readonly a: string} | {}>();
expectTypeOf<PickReadonly<{readonly a: 1; b: 2} | {[key: string]: number}>>().toBe<{readonly a: 1} | {}>();

// A key that is readonly in one member and writable in another is kept only where it is readonly
expectTypeOf<PickReadonly<{readonly a: string; b: number} | {a: string; readonly b: number}>>().toBe<{readonly a: string} | {readonly b: number}>();

// `Pick<Type, ReadonlyKeysOf<Type>>` merges the members of a union into one object
type Named = {readonly id: 1; name: 'a'} | {readonly id: 2; name: 'b'};
expectTypeOf<Pick<Named, ReadonlyKeysOf<Named>>>().toBe<{readonly id: 1 | 2}>();
expectTypeOf<PickReadonly<Named>>().toBe<{readonly id: 1} | {readonly id: 2}>();

// A readonly index signature is kept, and the writable properties next to it are left out
expectTypeOf<PickReadonly<Readonly<Record<string, number>>>>().toBe<Readonly<Record<string, number>>>();
expectTypeOf<PickReadonly<{readonly [key: string]: unknown; readonly id: number; name: string}>>().toBe<{readonly [key: string]: unknown; readonly id: number}>();

// A writable index signature is left out, and the readonly properties next to it are kept
expectTypeOf<PickReadonly<{[key: string]: number; readonly id: number}>>().toBe<{readonly id: number}>();
expectTypeOf<PickReadonly<Record<string, number>>>().toBe<{}>();

// Each index signature is checked by itself
expectTypeOf<PickReadonly<{readonly [key: string]: 1; [key: number]: 1}>>().toBe<{readonly [key: string]: 1}>();
expectTypeOf<PickReadonly<{readonly [key: symbol]: 1; [key: string]: 2}>>().toBe<{readonly [key: symbol]: 1}>();
expectTypeOf<PickReadonly<{readonly [key: `data-${string}`]: string; [key: `on${string}`]: () => void; id: number}>>().toBe<{readonly [key: `data-${string}`]: string}>();

// A property of an intersection is readonly only when every member that has it marks it readonly
expectTypeOf<PickReadonly<{readonly a: string} & {readonly b: number}>>().toBe<{readonly a: string; readonly b: number}>();
expectTypeOf<PickReadonly<{readonly a: string} & {a: string; readonly b: number}>>().toBe<{readonly b: number}>();
expectTypeOf<PickReadonly<{readonly a: string} & {readonly a: string; b: number}>>().toBe<{readonly a: string}>();

// A getter without a setter is readonly, and protected members are left out like with `keyof`
declare class Account {
	id: number;
	readonly createdAt: Date;
	protected readonly owner: string;
	get balance(): number;
	get name(): string;
	set name(value: string);
}
expectTypeOf<PickReadonly<Account>>().toBe<{readonly createdAt: Date; readonly balance: number}>();

// A `readonly` function property is readonly, unlike a method
type Api = {
	fetch(url: string): Promise<string>;
	readonly close: () => void;
};
expectTypeOf<PickReadonly<Api>>().toBe<{readonly close: () => void}>();

// Call and construct signatures are left out, like with `Pick`
expectTypeOf<PickReadonly<{(): void; readonly a: string; b: 1}>>().toBe<{readonly a: string}>();
expectTypeOf<PickReadonly<{new (): object; readonly a: string}>>().toBe<{readonly a: string}>();

// Symbol and number keys
declare const symbolKey: unique symbol;
expectTypeOf<PickReadonly<{readonly [symbolKey]: string; readonly 0: number; 1: boolean}>>().toBe<{readonly [symbolKey]: string; readonly 0: number}>();

// A property named `readonly` is not readonly
expectTypeOf<PickReadonly<{readonly: boolean; readonly id: number}>>().toBe<{readonly id: number}>();

// Works with the types that change the `readonly` and optional modifiers
type MutableUser = {
	id: number;
	name: string;
	createdAt?: Date;
};
expectTypeOf<PickReadonly<Readonly<MutableUser>>>().toBe<Readonly<MutableUser>>();
expectTypeOf<PickReadonly<Partial<{readonly a: 1; b: 2}>>>().toBe<{readonly a?: 1}>();
expectTypeOf<PickReadonly<Writable<User>>>().toBe<{}>();

// Every property of an `as const` object is readonly
const config = {port: 8080, hosts: ['localhost']} as const;
expectTypeOf<PickReadonly<typeof config>>().toBe<{readonly port: 8080; readonly hosts: readonly ['localhost']}>();

// The tag of a `Tagged` type is readonly, so it is kept
expectTypeOf<PickReadonly<Tagged<{readonly id: number; name: string}, 'User'>>>().toBe<Simplify<Tagged<{readonly id: number}, 'User'>>>();

// Applying it again changes nothing, and together with `PickWritable` it covers every property
expectTypeOf<PickReadonly<PickReadonly<User>>>().toBe<PickReadonly<User>>();
expectTypeOf<PickReadonly<PickWritable<User>>>().toBe<{}>();
expectTypeOf<Simplify<PickReadonly<User> & PickWritable<User>>>().toBe<User>();

// The properties of the result are readonly
declare const serverFields: PickReadonly<User>;
expectTypeOf(serverFields.id).toBe<number>();
// @ts-expect-error
serverFields.id = 2;

// The elements of an array or a tuple are readonly only if the array is readonly
expectTypeOf<Extract<keyof PickReadonly<readonly string[]>, number | `${number}`>>().toBe<number>();
expectTypeOf<Extract<keyof PickReadonly<readonly [string, number]>, number | `${number}`>>().toBe<number | '0' | '1'>();
expectTypeOf<Extract<keyof PickReadonly<string[]>, number | `${number}`>>().toBe<never>();
expectTypeOf<Extract<keyof PickReadonly<[string, number]>, number | `${number}`>>().toBe<never>();

// Works in a generic signature
declare function getServerFields<Entity extends object>(entity: Entity): PickReadonly<Entity>;
expectTypeOf(getServerFields({id: 1, name: 'Alice'} as {readonly id: number; name: string})).toBe<{readonly id: number}>();

declare const shape: Shape;
expectTypeOf(getServerFields(shape)).toBe<{readonly kind: 'circle'} | {readonly kind: 'square'; readonly size: number}>();

// A generic object is assignable to the result
function assignGeneric<Entity extends object>(entity: Entity) {
	const readonlyFields: PickReadonly<Entity> = entity;
}

function assignConstrainedGeneric<Entity extends {readonly id: number; name: string}>(entity: Entity) {
	const readonlyFields: PickReadonly<Entity> = entity;
}

// `any` has every key, and none of them are readonly, consistent with `ReadonlyKeysOf<any>`
expectTypeOf<PickReadonly<any>>().toBe<{}>();

// `never` and `object` stay as they are
expectTypeOf<PickReadonly<never>>().toBe<never>();
expectTypeOf<PickReadonly<object>>().toBe<object>();

// @ts-expect-error
type AllowsOnlyObjects = PickReadonly<string>;
// @ts-expect-error
type DoesNotAllowUnknown = PickReadonly<unknown>;
// @ts-expect-error
type DoesNotAllowUndefined = PickReadonly<undefined>;
