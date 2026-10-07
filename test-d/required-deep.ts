import {expectAssignable, expectNotType, expectType} from 'tsd';
import type {IsEqual, RequiredDeep, Simplify} from '../index.d.ts';
import type {BuiltIns} from '../source/internal/type.d.ts';

declare const key: unique symbol;

expectType<RequiredDeep<{a?: number; b: string}>>({} as {a: number; b: string});
expectType<RequiredDeep<{a?: {b?: {c?: string}; d?: string}}>>({} as {a: {b: {c: string}; d: string}});
expectType<RequiredDeep<{readonly a?: number; readonly b: {c?: string}}>>({} as {readonly a: number; readonly b: {c: string}});
expectType<RequiredDeep<{a?: Array<{b?: number}>}>>({} as {a: Array<{b: number}>});
expectType<RequiredDeep<{a?: [{b?: string}, number]}>>({} as {a: [{b: string}, number]});
expectType<RequiredDeep<{a?: number | {readonly b?: string}}>>({} as {a: number | {readonly b: string}});
expectType<RequiredDeep<{a?: {b: number} | {c?: string}}>>({} as {a: {b: number} | {c: string}});
expectType<RequiredDeep<{a?: {readonly b?: BuiltIns}}>>({} as {a: {readonly b: BuiltIns}});

// Unions
expectType<RequiredDeep<{a?: number} | {b?: string}>>({} as {a: number} | {b: string});
expectType<RequiredDeep<{v?: {a?: number}} | {w?: {b?: string}}>>({} as {v: {a: number}} | {w: {b: string}});
expectType<RequiredDeep<Map<{a: {b?: {c: {d?: number}}}}, {e?: string}> | Set<{a: {b?: {c: {d?: number}}}}>>>(
	{} as Map<{a: {b: {c: {d: number}}}}, {e: string}> | Set<{a: {b: {c: {d: number}}}}>,
);

// Index signatures
expectType<RequiredDeep<{[x: string]: {a?: string; b: {c?: number}}}>>({} as {[x: string]: {a: string; b: {c: number}}});
expectType<RequiredDeep<{[x: string]: {[x: number]: {c?: number}}}>>({} as {[x: string]: {[x: number]: {c: number}}});

// Optional with `undefined`
// This behaviour changes depending on `exactOptionalPropertyTypes` compiler option, refer https://github.com/sindresorhus/type-fest/issues/1217
expectType<RequiredDeep<{a?: number | undefined}>>({} as {a: number | undefined});
expectType<RequiredDeep<{a?: {b: number} | undefined}>>({} as {a: {b: number} | undefined});
expectType<RequiredDeep<{a?: undefined}>>({} as {a: undefined});

// Tuples
expectType<RequiredDeep<[string, number, boolean]>>({} as [string, number, boolean]); // All required
expectType<RequiredDeep<readonly [string, number?, boolean?]>>({} as readonly [string, number, boolean]); // Required and optional
expectType<RequiredDeep<[string?, number?, boolean?]>>({} as [string, number, boolean]); // All optional
expectType<RequiredDeep<[string, number, ...boolean[]]>>({} as [string, number, ...boolean[]]); // Required and trailing rest
expectType<RequiredDeep<readonly [string, number?, ...boolean[]]>>({} as readonly [string, number, ...boolean[]]); // Required, optional and trailing rest
expectType<RequiredDeep<[string?, number?, ...boolean[]]>>({} as [string, number, ...boolean[]]); // Optional and trailing rest
expectType<RequiredDeep<[...string[], number, boolean]>>({} as [...string[], number, boolean]); // Leading rest
expectType<RequiredDeep<[number, ...string[], number, boolean]>>({} as [number, ...string[], number, boolean]); // Rest in middle

// Nested tuples
expectType<RequiredDeep<[[string, number?], [boolean, Date]?, [RegExp?, number?]?]>>({} as [[string, number], [boolean, Date], [RegExp, number]]);
expectType<RequiredDeep<[[{a?: string}, {b: number; c?: string}?], ...Array<[boolean, boolean?]>]>>({} as [[{a: string}, {b: number; c: string}], ...Array<[boolean, boolean]>]);

// Non-tuple arrays
expectType<RequiredDeep<string[]>>({} as string[]);
expectType<RequiredDeep<Array<string | undefined>>>({} as string[]);
expectType<RequiredDeep<ReadonlyArray<string | undefined>>>({} as readonly string[]);

// Maps
expectType<RequiredDeep<Map<{a?: string; b?: number}, {a?: string; b?: number}>>>({} as Map<{a: string; b: number}, {a: string; b: number}>);
expectType<RequiredDeep<ReadonlyMap<{a?: string; b?: number}, {a?: string; b?: number}>>>({} as ReadonlyMap<{a: string; b: number}, {a: string; b: number}>);
expectType<RequiredDeep<WeakMap<{a?: string; b?: number}, {a?: string; b?: number}>>>({} as WeakMap<{a: string; b: number}, {a: string; b: number}>);

// Sets
expectType<RequiredDeep<Set<{a?: string; b?: number}>>>({} as Set<{a: string; b: number}>);
expectType<RequiredDeep<ReadonlySet<{a?: string; b?: number}>>>({} as ReadonlySet<{a: string; b: number}>);
expectType<RequiredDeep<WeakSet<{a?: string; b?: number}>>>({} as WeakSet<{a: string; b: number}>);

// Promises
expectType<RequiredDeep<Promise<{a?: string; b?: number}>>>({} as Promise<{a: string; b: number}>);
expectType<RequiredDeep<Promise<Promise<{a?: string; b?: [number, number?]}>>>>({} as Promise<Promise<{a: string; b: [number, number]}>>);

// Functions
type FunctionWithProperties = {(a1: string, a2: number): boolean; p1?: string; readonly p2?: number};
declare const functionWithProperties: RequiredDeep<FunctionWithProperties>;
expectType<boolean>(functionWithProperties('foo', 1));
expectType<{p1: string; readonly p2: number}>({} as Simplify<typeof functionWithProperties>); // `Simplify` removes the call signature from `typeof functionWithProperties`

type FunctionWithProperties2 = {(a1: boolean, ...a2: string[]): number; p1?: {p2?: string; p3: {readonly p4?: boolean}}};
declare const functionWithProperties2: RequiredDeep<FunctionWithProperties2>;
expectType<number>(functionWithProperties2(true, 'foo', 'bar'));
expectType<{p1: {p2: string; p3: {readonly p4: boolean}}}>({} as Simplify<typeof functionWithProperties2>);

type FunctionWithProperties3 = {(): void; p1?: {p2?: string; p3: [{p4?: number}, string?]}};
declare const functionWithProperties3: RequiredDeep<FunctionWithProperties3>;
expectType<void>(functionWithProperties3());
expectType<{p1: {p2: string; p3: [{p4: number}, string]}}>({} as Simplify<typeof functionWithProperties3>);

// Properties within functions containing multiple call signatures are not made required due to TS limitations, refer https://github.com/microsoft/TypeScript/issues/29732
type FunctionWithProperties4 = {(a1: number): string; (a1: string, a2: number): number; p1?: string};
declare const functionWithProperties4: RequiredDeep<FunctionWithProperties4>;
expectType<string>(functionWithProperties4(1));
expectType<number>(functionWithProperties4('foo', 1));
expectNotType<{p1: string}>({} as Simplify<typeof functionWithProperties4>);

// Class constructors keep their construct signature, like the other `*Deep` utilities do.
declare class ClassWithStatics {
	static optionalStatic?: string;
	optionalInstance?: string;
	constructor(optionalInstance?: string);
}
expectType<typeof ClassWithStatics>({} as RequiredDeep<typeof ClassWithStatics>);

// An abstract class has an `abstract new` signature, so it must be kept as is just like a concrete class constructor.
abstract class AbstractClassForTest {
	foo = 1;
}

expectType<true>({} as IsEqual<RequiredDeep<typeof AbstractClassForTest>, typeof AbstractClassForTest>);

// A `WeakMap` and a `WeakSet` are rebuilt with their contents made required, like a `Map` and a `Set`, rather than having their own methods mapped one by one.
expectType<{cache: WeakMap<object, {a: number}>}>({} as RequiredDeep<{cache?: WeakMap<object, {a?: number}>}>);
expectType<{tags: WeakSet<{a: number}>}>({} as RequiredDeep<{tags?: WeakSet<{a?: number}>}>);

// A plain object with `name` and `message` is structurally an `Error`, but it is data, so it is still walked.
expectType<{name: string; message: string; meta: {code: number}}>({} as RequiredDeep<{name: string; message: string; meta?: {code?: number}}>);

declare const arrayBufferKept: RequiredDeep<ArrayBuffer>;
expectType<ArrayBuffer>(arrayBufferKept);

declare const dataViewKept: RequiredDeep<DataView>;
expectType<DataView>(dataViewKept);

declare const typedArrayKept: RequiredDeep<Uint8Array>;
expectType<Uint8Array>(typedArrayKept);

declare const functionKept: RequiredDeep<() => void>;
expectType<() => void>(functionKept);

// A member that is a method keeps its `this` parameter. `Parameters` leaves `this` out, so the rebuilt function would otherwise accept any receiver.
declare const methodWithThis: RequiredDeep<{m: ((this: Date, a: string) => void) & {count: number}}>;
expectType<Date>({} as ThisParameterType<(typeof methodWithThis)['m']>);

// A `unique symbol` key is a key like any other, and the walk has to reach it: the key is not a string, so a walk that builds its keys as text would leave it out.
declare const requiredSymbol: RequiredDeep<{[key]?: {a?: number}}>;
expectType<{[key]: {a: number}}>(requiredSymbol);

// The `Function` interface has no call signature, so the function branch misses it, and mapping it produced an uncallable record of its own methods.
expectType<Function>({} as RequiredDeep<Function>);
expectType<{callback: Function}>({} as RequiredDeep<{callback: Function}>);

// A function that declares no `this` is rebuilt without one, rather than with `this: unknown`, which would reject a function that declares a `this`, although the original accepts it.
declare const handlerWithThis: ((this: Date, event: string) => void) & {displayName: string};
expectAssignable<RequiredDeep<((event: string) => void) & {displayName: string}>>(handlerWithThis);
