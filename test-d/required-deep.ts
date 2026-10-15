import {expectTypeOf} from 'nz';
import type {IsEqual, RequiredDeep} from '../index.d.ts';
import type {BuiltIns} from '../source/internal/type.d.ts';

declare const key: unique symbol;

expectTypeOf<{a: number; b: string}>().toBe<RequiredDeep<{a?: number; b: string}>>();
expectTypeOf<{a: {b: {c: string}; d: string}}>().toBe<RequiredDeep<{a?: {b?: {c?: string}; d?: string}}>>();
expectTypeOf<{readonly a: number; readonly b: {c: string}}>().toBe<RequiredDeep<{readonly a?: number; readonly b: {c?: string}}>>();
expectTypeOf<{a: Array<{b: number}>}>().toBe<RequiredDeep<{a?: Array<{b?: number}>}>>();
expectTypeOf<{a: [{b: string}, number]}>().toBe<RequiredDeep<{a?: [{b?: string}, number]}>>();
expectTypeOf<{a: number | {readonly b: string}}>().toBe<RequiredDeep<{a?: number | {readonly b?: string}}>>();
expectTypeOf<{a: {b: number} | {c: string}}>().toBe<RequiredDeep<{a?: {b: number} | {c?: string}}>>();
expectTypeOf<{a: {readonly b: BuiltIns}}>().toBe<RequiredDeep<{a?: {readonly b?: BuiltIns}}>>();

// Unions
expectTypeOf<{a: number} | {b: string}>().toBe<RequiredDeep<{a?: number} | {b?: string}>>();
expectTypeOf<{v: {a: number}} | {w: {b: string}}>().toBe<RequiredDeep<{v?: {a?: number}} | {w?: {b?: string}}>>();
expectTypeOf<Map<{a: {b: {c: {d: number}}}}, {e: string}> | Set<{a: {b: {c: {d: number}}}}>>().toBe<RequiredDeep<Map<{a: {b?: {c: {d?: number}}}}, {e?: string}> | Set<{a: {b?: {c: {d?: number}}}}>>>();

// Index signatures
expectTypeOf<{[x: string]: {a: string; b: {c: number}}}>().toBe<RequiredDeep<{[x: string]: {a?: string; b: {c?: number}}}>>();
expectTypeOf<{[x: string]: {[x: number]: {c: number}}}>().toBe<RequiredDeep<{[x: string]: {[x: number]: {c?: number}}}>>();

// Optional with `undefined`
// This behaviour changes depending on `exactOptionalPropertyTypes` compiler option, refer https://github.com/sindresorhus/type-fest/issues/1217
expectTypeOf<{a: number | undefined}>().toBe<RequiredDeep<{a?: number | undefined}>>();
expectTypeOf<{a: {b: number} | undefined}>().toBe<RequiredDeep<{a?: {b: number} | undefined}>>();
expectTypeOf<{a: undefined}>().toBe<RequiredDeep<{a?: undefined}>>();

// Tuples
expectTypeOf<[string, number, boolean]>().toBe<RequiredDeep<[string, number, boolean]>>(); // All required
expectTypeOf<readonly [string, number, boolean]>().toBe<RequiredDeep<readonly [string, number?, boolean?]>>(); // Required and optional
expectTypeOf<[string, number, boolean]>().toBe<RequiredDeep<[string?, number?, boolean?]>>(); // All optional
expectTypeOf<[string, number, ...boolean[]]>().toBe<RequiredDeep<[string, number, ...boolean[]]>>(); // Required and trailing rest
expectTypeOf<readonly [string, number, ...boolean[]]>().toBe<RequiredDeep<readonly [string, number?, ...boolean[]]>>(); // Required, optional and trailing rest
expectTypeOf<[string, number, ...boolean[]]>().toBe<RequiredDeep<[string?, number?, ...boolean[]]>>(); // Optional and trailing rest
expectTypeOf<[...string[], number, boolean]>().toBe<RequiredDeep<[...string[], number, boolean]>>(); // Leading rest
expectTypeOf<[number, ...string[], number, boolean]>().toBe<RequiredDeep<[number, ...string[], number, boolean]>>(); // Rest in middle

// Nested tuples
expectTypeOf<[[string, number], [boolean, Date], [RegExp, number]]>().toBe<RequiredDeep<[[string, number?], [boolean, Date]?, [RegExp?, number?]?]>>();
expectTypeOf<[[{a: string}, {b: number; c: string}], ...Array<[boolean, boolean]>]>().toBe<RequiredDeep<[[{a?: string}, {b: number; c?: string}?], ...Array<[boolean, boolean?]>]>>();

// Non-tuple arrays
expectTypeOf<string[]>().toBe<RequiredDeep<string[]>>();
expectTypeOf<string[]>().toBe<RequiredDeep<Array<string | undefined>>>();
expectTypeOf<readonly string[]>().toBe<RequiredDeep<ReadonlyArray<string | undefined>>>();

// Maps
expectTypeOf<Map<{a: string; b: number}, {a: string; b: number}>>().toBe<RequiredDeep<Map<{a?: string; b?: number}, {a?: string; b?: number}>>>();
expectTypeOf<ReadonlyMap<{a: string; b: number}, {a: string; b: number}>>().toBe<RequiredDeep<ReadonlyMap<{a?: string; b?: number}, {a?: string; b?: number}>>>();
expectTypeOf<WeakMap<{a: string; b: number}, {a: string; b: number}>>().toBe<RequiredDeep<WeakMap<{a?: string; b?: number}, {a?: string; b?: number}>>>();

// Sets
expectTypeOf<Set<{a: string; b: number}>>().toBe<RequiredDeep<Set<{a?: string; b?: number}>>>();
expectTypeOf<ReadonlySet<{a: string; b: number}>>().toBe<RequiredDeep<ReadonlySet<{a?: string; b?: number}>>>();
expectTypeOf<WeakSet<{a: string; b: number}>>().toBe<RequiredDeep<WeakSet<{a?: string; b?: number}>>>();

// Promises
expectTypeOf<Promise<{a: string; b: number}>>().toBe<RequiredDeep<Promise<{a?: string; b?: number}>>>();
expectTypeOf<Promise<Promise<{a: string; b: [number, number]}>>>().toBe<RequiredDeep<Promise<Promise<{a?: string; b?: [number, number?]}>>>>();

// Functions
type FunctionWithProperties = {(a1: string, a2: number): boolean; p1?: string; readonly p2?: number};
declare const functionWithProperties: RequiredDeep<FunctionWithProperties>;
expectTypeOf(functionWithProperties('foo', 1)).toBe<boolean>();
expectTypeOf<Omit<typeof functionWithProperties, never>>().toBe<{p1: string; readonly p2: number}>(); // `Omit` removes the call signature from `typeof functionWithProperties`

type FunctionWithProperties2 = {(a1: boolean, ...a2: string[]): number; p1?: {p2?: string; p3: {readonly p4?: boolean}}};
declare const functionWithProperties2: RequiredDeep<FunctionWithProperties2>;
expectTypeOf(functionWithProperties2(true, 'foo', 'bar')).toBe<number>();
expectTypeOf<Omit<typeof functionWithProperties2, never>>().toBe<{p1: {p2: string; p3: {readonly p4: boolean}}}>();

type FunctionWithProperties3 = {(): void; p1?: {p2?: string; p3: [{p4?: number}, string?]}};
declare const functionWithProperties3: RequiredDeep<FunctionWithProperties3>;
expectTypeOf(functionWithProperties3()).toBe<void>();
expectTypeOf<Omit<typeof functionWithProperties3, never>>().toBe<{p1: {p2: string; p3: [{p4: number}, string]}}>();

// Properties within functions containing multiple call signatures are not made required due to TS limitations, refer https://github.com/microsoft/TypeScript/issues/29732
type FunctionWithProperties4 = {(a1: number): string; (a1: string, a2: number): number; p1?: string};
declare const functionWithProperties4: RequiredDeep<FunctionWithProperties4>;
expectTypeOf(functionWithProperties4(1)).toBe<string>();
expectTypeOf(functionWithProperties4('foo', 1)).toBe<number>();
expectTypeOf<Omit<typeof functionWithProperties4, never>>().not.toBe<{p1: string}>();

// Class constructors keep their construct signature, like the other `*Deep` utilities do.
declare class ClassWithStatics {
	static optionalStatic?: string;
	optionalInstance?: string;
	constructor(optionalInstance?: string);
}
expectTypeOf<RequiredDeep<typeof ClassWithStatics>>().toBe<typeof ClassWithStatics>();

// An abstract class has an `abstract new` signature, so it must be kept as is just like a concrete class constructor.
abstract class AbstractClassForTest {
	foo = 1;
}

expectTypeOf<IsEqual<RequiredDeep<typeof AbstractClassForTest>, typeof AbstractClassForTest>>().toBe<true>();

// A `WeakMap` and a `WeakSet` are rebuilt with their contents made required, like a `Map` and a `Set`, rather than having their own methods mapped one by one.
expectTypeOf<RequiredDeep<{cache?: WeakMap<object, {a?: number}>}>>().toBe<{cache: WeakMap<object, {a: number}>}>();
expectTypeOf<RequiredDeep<{tags?: WeakSet<{a?: number}>}>>().toBe<{tags: WeakSet<{a: number}>}>();

// A plain object with `name` and `message` is structurally an `Error`, but it is data, so it is still walked.
expectTypeOf<RequiredDeep<{name: string; message: string; meta?: {code?: number}}>>().toBe<{name: string; message: string; meta: {code: number}}>();

declare const arrayBufferKept: RequiredDeep<ArrayBuffer>;
expectTypeOf(arrayBufferKept).toBe<ArrayBuffer>();

declare const dataViewKept: RequiredDeep<DataView>;
expectTypeOf(dataViewKept).toBe<DataView>();

declare const typedArrayKept: RequiredDeep<Uint8Array>;
expectTypeOf(typedArrayKept).toBe<Uint8Array>();

declare const functionKept: RequiredDeep<() => void>;
expectTypeOf(functionKept).toBe<() => void>();

// A member that is a method keeps its `this` parameter. `Parameters` leaves `this` out, so the rebuilt function would otherwise accept any receiver.
declare const methodWithThis: RequiredDeep<{m: ((this: Date, a: string) => void) & {count: number}}>;
expectTypeOf<ThisParameterType<(typeof methodWithThis)['m']>>().toBe<Date>();

// A `unique symbol` key is a key like any other, and the walk has to reach it: the key is not a string, so a walk that builds its keys as text would leave it out.
declare const requiredSymbol: RequiredDeep<{[key]?: {a?: number}}>;
expectTypeOf(requiredSymbol).toBe<{[key]: {a: number}}>();

// The `Function` interface has no call signature, so the function branch misses it, and mapping it produced an uncallable record of its own methods.
expectTypeOf<RequiredDeep<Function>>().toBe<Function>();
expectTypeOf<RequiredDeep<{callback: Function}>>().toBe<{callback: Function}>();

// A function that declares no `this` is rebuilt without one, rather than with `this: unknown`, which would reject a function that declares a `this`, although the original accepts it.
declare const handlerWithThis: ((this: Date, event: string) => void) & {displayName: string};
expectTypeOf(handlerWithThis).toBeAssignableTo<RequiredDeep<((event: string) => void) & {displayName: string}>>();

// A DOM node is a single value, so it is kept as is.
expectTypeOf<RequiredDeep<{element?: HTMLElement}>>().toBe<{element: HTMLElement}>();
