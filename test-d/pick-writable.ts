import {expectTypeOf} from 'nz';
import type {PickReadonly, PickWritable, Simplify, Tagged, Writable, WritableKeysOf} from '../index.d.ts';

expectTypeOf<PickWritable<{readonly id: number; name: string}>>().toBe<{name: string}>();
expectTypeOf<PickWritable<{a: string; b: number}>>().toBe<{a: string; b: number}>();
expectTypeOf<PickWritable<{readonly a: string; readonly b: number}>>().toBe<{}>();
expectTypeOf<PickWritable<{}>>().toBe<{}>();

// The examples from the docs
type User = {
	readonly id: number;
	name: string;
	surname?: string;
};
expectTypeOf<PickWritable<User>>().toBe<{name: string; surname?: string}>();

type Shape =
	| {readonly kind: 'circle'; radius: number}
	| {readonly kind: 'square'; size: number};
expectTypeOf<PickWritable<Shape>>().toBe<{radius: number} | {size: number}>();

// Keeps the optional modifier, and leaves out readonly optional properties
expectTypeOf<PickWritable<{a?: string; readonly b?: number; c: string | undefined}>>().toBe<{a?: string; c: string | undefined}>();
expectTypeOf<PickWritable<{a?: string | undefined; readonly b?: undefined}>>().toBe<{a?: string | undefined}>();

// Keeps the property types as is
expectTypeOf<PickWritable<{readonly id: number; callback: () => void; nested: {readonly a: string}}>>().toBe<{callback: () => void; nested: {readonly a: string}}>();
expectTypeOf<PickWritable<{a: any; b: unknown; c: never; readonly d: any}>>().toBe<{a: any; b: unknown; c: never}>();
expectTypeOf<PickWritable<{tags: readonly string[]; readonly list: string[]}>>().toBe<{tags: readonly string[]}>();

// Only the top level is checked
expectTypeOf<PickWritable<{nested: {readonly a: string; b: number}}>>().toBe<{nested: {readonly a: string; b: number}}>();

// Each member of a union keeps its own writable properties
expectTypeOf<PickWritable<{readonly id: number; a: string} | {readonly id: string; b: number}>>().toBe<{a: string} | {b: number}>();
expectTypeOf<PickWritable<{a: 1} | {b: 2} | {readonly c: 3; d: 4}>>().toBe<{a: 1} | {b: 2} | {d: 4}>();

// A member without writable properties becomes an empty object
expectTypeOf<PickWritable<{readonly a: string} | {b: number}>>().toBe<{} | {b: number}>();
expectTypeOf<PickWritable<{readonly a: 1; b: 2} | {readonly [key: string]: number}>>().toBe<{b: 2} | {}>();

// A key that is readonly in one member and writable in another is kept only where it is writable
expectTypeOf<PickWritable<{readonly a: string; b: number} | {a: string; readonly b: number}>>().toBe<{b: number} | {a: string}>();

// `Pick<Type, WritableKeysOf<Type>>` merges the members of a union into one object
type Named = {readonly id: 1; name: 'a'} | {readonly id: 2; name: 'b'};
expectTypeOf<Pick<Named, WritableKeysOf<Named>>>().toBe<{name: 'a' | 'b'}>();
expectTypeOf<PickWritable<Named>>().toBe<{name: 'a'} | {name: 'b'}>();

// A writable index signature is kept, and the readonly properties next to it are left out
expectTypeOf<PickWritable<{[key: string]: number; readonly id: number}>>().toBe<{[key: string]: number}>();
expectTypeOf<PickWritable<{[key: string]: unknown; readonly id: number; name: string}>>().toBe<{[key: string]: unknown; name: string}>();
expectTypeOf<PickWritable<Record<string, number>>>().toBe<Record<string, number>>();

// A readonly index signature is left out, and the writable properties next to it are kept
expectTypeOf<PickWritable<{readonly [key: string]: unknown; id: number}>>().toBe<{id: number}>();
expectTypeOf<PickWritable<Readonly<Record<string, number>>>>().toBe<{}>();

// Each index signature is checked by itself
expectTypeOf<PickWritable<{readonly [key: string]: 1; [key: number]: 1}>>().toBe<{[key: number]: 1}>();
expectTypeOf<PickWritable<{[key: symbol]: 1; readonly [key: string]: 2}>>().toBe<{[key: symbol]: 1}>();
expectTypeOf<PickWritable<{readonly [key: `data-${string}`]: string; [key: `on${string}`]: () => void; id: number}>>().toBe<{[key: `on${string}`]: () => void; id: number}>();

// A property of an intersection is readonly only when every member that has it marks it readonly
expectTypeOf<PickWritable<{readonly a: string} & {b: number}>>().toBe<{b: number}>();
expectTypeOf<PickWritable<{readonly a: string} & {a: string; b: number}>>().toBe<{a: string; b: number}>();
expectTypeOf<PickWritable<{readonly a: string} & {readonly a: string; b: number}>>().toBe<{b: number}>();

// A getter without a setter is readonly, and protected members are left out like with `keyof`
declare class Account {
	id: number;
	readonly createdAt: Date;
	protected owner: string;
	get balance(): number;
	get name(): string;
	set name(value: string);
}
expectTypeOf<PickWritable<Account>>().toBe<{id: number; name: string}>();

// A method is writable, unlike a `readonly` function property
type Api = {
	fetch(url: string): Promise<string>;
	readonly close: () => void;
};
expectTypeOf<PickWritable<Api>>().toBe<{fetch: (url: string) => Promise<string>}>();

// Call and construct signatures are left out, like with `Pick`
expectTypeOf<PickWritable<{(): void; a: string; readonly b: 1}>>().toBe<{a: string}>();
expectTypeOf<PickWritable<{new (): object; a: string}>>().toBe<{a: string}>();

// Symbol and number keys
declare const symbolKey: unique symbol;
expectTypeOf<PickWritable<{[symbolKey]: string; readonly 0: number; 1: boolean}>>().toBe<{[symbolKey]: string; 1: boolean}>();

// A property named `readonly` is not readonly
expectTypeOf<PickWritable<{readonly: boolean; readonly id: number}>>().toBe<{readonly: boolean}>();

// Works with the types that change the `readonly` and optional modifiers
expectTypeOf<PickWritable<Readonly<User>>>().toBe<{}>();
expectTypeOf<PickWritable<Partial<{readonly a: 1; b: 2}>>>().toBe<{b?: 2}>();
expectTypeOf<PickWritable<Writable<User>>>().toBe<{id: number; name: string; surname?: string}>();

// Every property of an `as const` object is readonly
const config = {port: 8080, hosts: ['localhost']} as const;
expectTypeOf<PickWritable<typeof config>>().toBe<{}>();

// The tag of a `Tagged` type is readonly, so it is left out
expectTypeOf<PickWritable<Tagged<{readonly id: number; name: string}, 'User'>>>().toBe<{name: string}>();

// Applying it again changes nothing, and together with `PickReadonly` it covers every property
expectTypeOf<PickWritable<PickWritable<User>>>().toBe<PickWritable<User>>();
expectTypeOf<PickWritable<PickReadonly<User>>>().toBe<{}>();
expectTypeOf<Simplify<PickWritable<User> & PickReadonly<User>>>().toBe<User>();

// The properties of the result can be assigned
declare const changes: PickWritable<User>;
changes.name = 'Bob';

// The elements of an array or a tuple are writable unless the array is readonly
expectTypeOf<Extract<keyof PickWritable<string[]>, number | `${number}`>>().toBe<number>();
expectTypeOf<Extract<keyof PickWritable<[string, number]>, number | `${number}`>>().toBe<number | '0' | '1'>();
expectTypeOf<Extract<keyof PickWritable<readonly string[]>, number | `${number}`>>().toBe<never>();
expectTypeOf<Extract<keyof PickWritable<readonly [string, number]>, number | `${number}`>>().toBe<never>();

// Works in a generic signature
declare function update<Entity extends object>(entity: Entity, changes: PickWritable<Entity>): void;
update({id: 1, name: 'Alice'} as {readonly id: number; name: string}, {name: 'Bob'});
// @ts-expect-error
update({id: 1, name: 'Alice'} as {readonly id: number; name: string}, {name: 'Bob', id: 2});

declare function getWritableFields<Entity extends object>(entity: Entity): PickWritable<Entity>;
declare const shape: Shape;
expectTypeOf(getWritableFields(shape)).toBe<{radius: number} | {size: number}>();

// A generic object is assignable to the result
function assignGeneric<Entity extends object>(entity: Entity) {
	const writable: PickWritable<Entity> = entity;
}

function assignConstrainedGeneric<Entity extends {readonly id: number; name: string}>(entity: Entity) {
	const writable: PickWritable<Entity> = entity;
}

// `any` has every key, and none of them are readonly, consistent with `WritableKeysOf<any>`
expectTypeOf<PickWritable<any>>().toBe<any>();

// `never` and `object` stay as they are
expectTypeOf<PickWritable<never>>().toBe<never>();
expectTypeOf<PickWritable<object>>().toBe<object>();

// @ts-expect-error
type AllowsOnlyObjects = PickWritable<string>;
// @ts-expect-error
type DoesNotAllowUnknown = PickWritable<unknown>;
// @ts-expect-error
type DoesNotAllowUndefined = PickWritable<undefined>;
