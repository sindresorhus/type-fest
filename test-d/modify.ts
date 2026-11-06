import {expectTypeOf} from 'nz';
import type {Modify} from '../index.d.ts';

type Foo = {
	a: string;
	b: number;
	c: boolean;
};

// A `never`-typed key of the modifier type removes that key from the result, and the other keys override like `Merge`.
declare const modified: Modify<Foo, {a: boolean; c: never}>;
expectTypeOf(modified).toBe<{a: boolean; b: number}>();

// Without a `never` key, `Modify` behaves like `Merge`.
declare const plain: Modify<Foo, {a: number}>;
expectTypeOf(plain).toBe<{a: number; b: number; c: boolean}>();

// A new key can be added while another is removed.
declare const added: Modify<Foo, {c: never; d: symbol}>;
expectTypeOf(added).toBe<{a: string; b: number; d: symbol}>();

// An optional `never` key is kept: its value type is `never | undefined`, not exactly `never`.
declare const optional: Modify<Foo, {c?: never}>;
expectTypeOf(optional).toBe<{a: string; b: number; c?: never}>();

// A `never` key of the object type is removed too.
expectTypeOf<Modify<{a: never; b: string}, {}>>().toBe<{b: string}>();

// Modifiers of kept keys are preserved.
declare const modifiers: Modify<{readonly a: string; b?: number; c: boolean}, {c: never}>;
expectTypeOf(modifiers).toBe<{readonly a: string; b?: number}>();

// `any` and `unknown` values are not removed.
expectTypeOf<Modify<{a: any; b: unknown}, {c: never}>>().toBe<{a: any; b: unknown}>();

// The result is constructable, which is the point of the type.
const constructable: Modify<Foo, {c: never}> = {a: 'life', b: 42};

// Unions are distributed, like `Merge`.
expectTypeOf<Modify<{a: 1; c: string} | {b: 2; c: string}, {c: never}>>().toBe<{a: 1} | {b: 2}>();
expectTypeOf<Modify<Foo, {a: never} | {b: never}>>().toBe<{b: number; c: boolean} | {a: string; c: boolean}>();

// Removing every key gives the empty object.
expectTypeOf<Modify<Foo, {a: never; b: never; c: never}>>().toBe<{}>();

// Arrays and tuples are combined position by position, like `Merge`.
declare const tuple: Modify<[1, 2, 3], [4, 5]>;
expectTypeOf(tuple).toBe<[4, 5, 3]>();

// A `never` element keeps its position: the shape is preserved, not de-tupled.
declare const tupleNeverElement: Modify<[1, 2], [never]>;
expectTypeOf(tupleNeverElement).toBe<[never, 2]>();

declare const tupleNeverDestinationElement: Modify<[1, never], {}>;
expectTypeOf(tupleNeverDestinationElement).toBe<[1, never]>();

// Index signatures are kept, and a `never` key against one is removed.
declare const indexed: Modify<{[key: string]: string}, {fixed: never}>;
expectTypeOf(indexed).toBe<{[key: string]: string}>();

// Removing a key means the result no longer satisfies the original type.
expectTypeOf<Modify<Foo, {a: never}>>().not.toBeAssignableTo<Foo>();

// Top and empty types.
expectTypeOf<Modify<never, {a: never}>>().toBe<never>();
expectTypeOf<Modify<any, {a: never}>>().toBe<{[x: string]: any}>();
expectTypeOf<Modify<Foo, never>>().toBe<never>();
expectTypeOf<Modify<Foo, any>>().toBe<{[x: string]: any; a: string; b: number; c: boolean}>();
expectTypeOf<Modify<unknown, {a: never}>>().toBe<{}>();
expectTypeOf<Modify<Foo, {}>>().toBe<Foo>();

// A nested object is replaced, not merged: `Modify` merges at the top level only.
expectTypeOf<Modify<{a: {x: number}}, {a: {y: string}}>>().toBe<{a: {y: string}}>();

// A method value is kept, and only the `never` key is removed.
expectTypeOf<Modify<{m(): void; x: number}, {x: never}>>().toBe<{m(): void}>();

// A symbol key can be removed.
declare const symbolKey: unique symbol;
expectTypeOf<Modify<{a: 1; [symbolKey]: 2}, {[symbolKey]: never}>>().toBe<{a: 1}>();

// A `never` key of the destination that the source overrides is not removed: the override wins.
expectTypeOf<Modify<{a: never}, {a: string}>>().toBe<{a: string}>();

// An optional key of the destination is kept when the source does not mention it.
expectTypeOf<Modify<{a?: string; b: number}, {b: never}>>().toBe<{a?: string}>();

// A value type with `undefined` is not `never`, so it is kept.
expectTypeOf<Modify<{a: string | undefined}, {b: never}>>().toBe<{a: string | undefined}>();

// A union of modifier types removes the matching key on each member.
expectTypeOf<Modify<{a: 1; b: 2}, {a: never} | {b: never}>>().toBe<{b: 2} | {a: 1}>();

// A readonly tuple keeps its shape and its `never` element.
expectTypeOf<Modify<readonly [1, never], {}>>().toBe<readonly [1, never]>();

// A key can be added and removed by the same modifier.
expectTypeOf<Modify<{a: 1}, {a: never; b: 2}>>().toBe<{b: 2}>();

// An `any` value overrides and is kept.
expectTypeOf<Modify<{a: 1}, {a: any}>>().toBe<{a: any}>();

// A callable type keeps its call signature when nothing is removed.
declare const callableKept: Modify<{(): void; x: number}, {y: string}>;
callableKept();

// A callable type drops its call signature when a `never` key is removed (documented limitation).
expectTypeOf<Modify<{(): void; x: number}, {x: never}>>().toBe<{}>();

// When the result is an array or tuple, no `never` key is removed (documented limitation).
expectTypeOf<Modify<[1, 2], {a: never}>['a']>().toBe<never>();
expectTypeOf<Modify<string[], {a: never}>['a']>().toBe<never>();

// Numeric keys can be removed using their canonical string spelling.
expectTypeOf<Modify<{0: string; keep: boolean}, {'0': never}>>().toBe<{keep: boolean}>();

// Removing a `never` index signature does not remove a non-`never` named property.
expectTypeOf<Modify<Record<string, never>, {name: string}>>().toBe<{name: string}>();

// An optional `never` property may be omitted, but cannot be explicitly set to `undefined`.
type WithoutSecret = Modify<{name: string; secret: string}, {secret?: never}>;
expectTypeOf<{name: string}>().toBeAssignableTo<WithoutSecret>();
expectTypeOf<{name: string; secret: undefined}>().not.toBeAssignableTo<WithoutSecret>();

// Top-level-only cleanup leaves `never` keys inside a replacement object intact.
expectTypeOf<Modify<{settings: {old: boolean}}, {settings: {removed: never; enabled: boolean}}>>().toBe<{settings: {removed: never; enabled: boolean}}>();
