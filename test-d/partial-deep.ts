import {expectTypeOf} from 'nz';
import type {IsEqual, PartialDeep} from '../index.d.ts';

class ClassA {
	foo = 1;
}

const foo = {
	baz: 'fred',
	bar: {
		function: (_: string): void => undefined,
		classConstructor: ClassA,
		object: {key: 'value'},
		string: 'waldo',
		number: 1,
		boolean: false,
		date: new Date(),
		regexp: /.*/,
		symbol: Symbol('test'),
		null: null,
		undefined: undefined, // eslint-disable-line object-shorthand
		map: new Map<string, string>(),
		set: new Set<string>(),
		array: ['foo'],
		tuple: ['foo'] as ['foo'],
		readonlyMap: new Map<string, string>() as ReadonlyMap<string, string>,
		readonlySet: new Set<string>() as ReadonlySet<string>,
		readonlyArray: ['foo'] as readonly string[],
		readonlyTuple: ['foo'] as const,
	},
};

let partialDeepFoo: PartialDeep<typeof foo, {recurseIntoArrays: true}> = foo;

// @ts-expect-error
expectTypeOf(partialDeepFoo).toBe<Partial<typeof foo>>();
const partialDeepBar: PartialDeep<typeof foo.bar, {recurseIntoArrays: true}> = foo.bar;
expectTypeOf(partialDeepFoo.bar).toBe<typeof partialDeepBar | undefined>();
// Check for constructor
expectTypeOf(partialDeepFoo.bar!.classConstructor).toBe<typeof ClassA | undefined>();
const instance = new partialDeepFoo.bar!.classConstructor!();
instance.foo = 2;
const b = partialDeepFoo.bar!.constructor;
expectTypeOf(partialDeepFoo.bar!.function).toBe<((_: string) => void) | undefined>();
expectTypeOf(partialDeepFoo.bar!.object).toBeAssignableTo<object | undefined>();
expectTypeOf(partialDeepFoo.bar!.string).toBe<string | undefined>();
expectTypeOf(partialDeepFoo.bar!.number).toBe<number | undefined>();
expectTypeOf(partialDeepFoo.bar!.boolean).toBe<boolean | undefined>();
expectTypeOf(partialDeepFoo.bar!.date).toBe<Date | undefined>();
expectTypeOf(partialDeepFoo.bar!.regexp).toBe<RegExp | undefined>();
expectTypeOf(partialDeepFoo.bar!.symbol).toBe<symbol | undefined>();
expectTypeOf(partialDeepFoo.bar!.null).toBe<null | undefined>();
expectTypeOf(partialDeepFoo.bar!.undefined).toBe<undefined>();
expectTypeOf(partialDeepFoo.bar!.map).toBeAssignableTo<Map<string | undefined, string | undefined> | undefined>();
expectTypeOf(partialDeepFoo.bar!.set).toBeAssignableTo<Set<string | undefined> | undefined>();
expectTypeOf(partialDeepFoo.bar!.array).toBe<string[] | undefined>();
expectTypeOf(partialDeepFoo.bar!.tuple).toBe<['foo'?] | undefined>();
expectTypeOf(partialDeepFoo.bar!.readonlyMap).toBeAssignableTo<ReadonlyMap<string | undefined, string | undefined> | undefined>();
expectTypeOf(partialDeepFoo.bar!.readonlySet).toBeAssignableTo<ReadonlySet<string | undefined> | undefined>();
expectTypeOf(partialDeepFoo.bar!.readonlyArray).toBe<readonly string[] | undefined>();
expectTypeOf(partialDeepFoo.bar!.readonlyTuple).toBe<readonly ['foo'?] | undefined>();
// Check for compiling with omitting partial keys
partialDeepFoo = {baz: 'fred'};
partialDeepFoo = {bar: {string: 'waldo'}};
partialDeepFoo = {bar: {date: new Date()}};
// Check that recursive array evaluation isn't infinite depth
type Recurse =
	| string
	| number
	| boolean
	| null
	| Record<string, Recurse[]>
	| Recurse[];
type RecurseObject = {value: Recurse};
const recurseObject: RecurseObject = {value: null};
expectTypeOf(recurseObject).toBeAssignableTo<PartialDeep<RecurseObject>>();

// Check that `{recurseIntoArrays: false}` is the default
const partialDeepNoRecurseIntoArraysFoo: PartialDeep<typeof foo> = foo;
// Check that `{recurseIntoArrays: true}` behaves as intended
expectTypeOf(partialDeepFoo).toBe<PartialDeep<typeof foo, {recurseIntoArrays: true}>>();

// Check that `{allowUndefinedInNonTupleArrays: false}` is the default
const partialDeepAllowUndefinedInNonTupleArraysFoo: PartialDeep<typeof foo, {recurseIntoArrays: true}> = foo;
expectTypeOf(partialDeepAllowUndefinedInNonTupleArraysFoo.bar!.array).toBe<string[] | undefined>();
// Check that `{allowUndefinedInNonTupleArrays: true}` behaves as intended
const partialDeepDoNotAllowUndefinedInNonTupleArraysFoo: PartialDeep<typeof foo, {recurseIntoArrays: true; allowUndefinedInNonTupleArrays: true}> = foo;
expectTypeOf(partialDeepDoNotAllowUndefinedInNonTupleArraysFoo.bar!.array).toBe<Array<string | undefined> | undefined>();

// These are mostly the same checks as before, but the array/tuple types are different.
// @ts-expect-error
expectTypeOf(partialDeepNoRecurseIntoArraysFoo).toBe<Partial<typeof foo>>();
const partialDeepNoRecurseIntoArraysBar: PartialDeep<typeof foo.bar, {recurseIntoArrays: false}> = foo.bar;
expectTypeOf(partialDeepNoRecurseIntoArraysFoo.bar).toBe<typeof partialDeepNoRecurseIntoArraysBar | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.function).toBe<((_: string) => void) | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.object).toBeAssignableTo<object | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.string).toBe<string | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.number).toBe<number | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.boolean).toBe<boolean | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.date).toBe<Date | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.regexp).toBe<RegExp | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.symbol).toBe<symbol | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.null).toBe<null | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.undefined).toBe<undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.map).toBeAssignableTo<Map<string | undefined, string | undefined> | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.set).toBeAssignableTo<Set<string | undefined> | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.array).toBe<string[] | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.tuple).toBe<['foo'] | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.readonlyMap).toBeAssignableTo<ReadonlyMap<string | undefined, string | undefined> | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.readonlySet).toBeAssignableTo<ReadonlySet<string | undefined> | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.readonlyArray).toBe<readonly string[] | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.readonlyTuple).toBe<readonly ['foo'] | undefined>();

type FunctionWithProperties = {(a1: string, a2: number): boolean; p1: string; readonly p2: number};
declare const functionWithProperties: PartialDeep<FunctionWithProperties>;
expectTypeOf(functionWithProperties('foo', 1)).toBe<boolean>();
expectTypeOf<Omit<typeof functionWithProperties, never>>().toBe<{p1?: string; readonly p2?: number}>(); // `Omit` removes the call signature from `typeof functionWithProperties`

type FunctionWithProperties2 = {(a1: boolean, ...a2: string[]): number; p1: {p2?: string; p3: {readonly p4?: boolean}}};
declare const functionWithProperties2: PartialDeep<FunctionWithProperties2>;
expectTypeOf(functionWithProperties2(true, 'foo', 'bar')).toBe<number>();
expectTypeOf<Omit<typeof functionWithProperties2, never>>().toBe<{p1?: {p2?: string; p3?: {readonly p4?: boolean}}}>();

type FunctionWithProperties3 = {(): void; p1: {p2?: string; p3: [{p4: number}, string]}};
declare const functionWithProperties3: PartialDeep<FunctionWithProperties3, {recurseIntoArrays: true}>;
expectTypeOf(functionWithProperties3()).toBe<void>();
expectTypeOf<Omit<typeof functionWithProperties3, never>>().toBe<{p1?: {p2?: string; p3?: [{p4?: number}?, string?]}}>();

expectTypeOf<Omit<PartialDeep<{(): void; p1: string[]}, {allowUndefinedInNonTupleArrays: false}>, never>>().toBe<{p1?: string[]}>();
expectTypeOf<Omit<PartialDeep<{(): void; p1: string[]}, {allowUndefinedInNonTupleArrays: true}>, never>>().toBe<{p1?: string[]}>();

// Properties within functions containing multiple call signatures are not made partial due to TS limitations, refer https://github.com/microsoft/TypeScript/issues/29732
type FunctionWithProperties4 = {(a1: number): string; (a1: string, a2: number): number; p1: string};
declare const functionWithProperties4: PartialDeep<FunctionWithProperties4>;
expectTypeOf(functionWithProperties4(1)).toBe<string>();
expectTypeOf(functionWithProperties4('foo', 1)).toBe<number>();
expectTypeOf<Omit<typeof functionWithProperties4, never>>().not.toBe<{p1?: string}>();

// `Promise` and its `then` method are not made partial, unlike `Map` and `Set`.
declare const partialDeepPromise: PartialDeep<Promise<{a: number}>>;
expectTypeOf(partialDeepPromise).toBe<Promise<{a: number}>>();

// A `WeakMap` and its methods are not made partial.
declare const partialDeepWeakMap: PartialDeep<WeakMap<{a: number}, number>>;
expectTypeOf(partialDeepWeakMap).toBe<WeakMap<{a: number}, number>>();

// A `WeakSet` and its methods are not made partial.
declare const partialDeepWeakSet: PartialDeep<WeakSet<{a: number}>>;
expectTypeOf(partialDeepWeakSet).toBe<WeakSet<{a: number}>>();

// A `Set` is structurally a `WeakSet`, so its items must still be made partial, like a `Map`'s.
expectTypeOf<IsEqual<PartialDeep<Set<{a: number}>>, Set<{a?: number}>>>().toBe<true>();
expectTypeOf<IsEqual<PartialDeep<{s: Set<{a: number}>}>, {s?: Set<{a?: number}>}>>().toBe<true>();
expectTypeOf<IsEqual<PartialDeep<Map<string, Set<{a: number}>>>, Map<string, Set<{a?: number}>>>>().toBe<true>();
expectTypeOf<IsEqual<PartialDeep<{s: Array<Set<{a: number}>>}, {recurseIntoArrays: true}>, {s?: Array<Set<{a?: number}>>}>>().toBe<true>();

// An abstract class has an `abstract new` signature, so it must be kept as is just like a concrete class constructor.
abstract class AbstractClassForTest {
	foo = 1;
}

expectTypeOf<IsEqual<PartialDeep<typeof AbstractClassForTest>, typeof AbstractClassForTest>>().toBe<true>();

// These are a single value rather than a structure to recurse into, so they are kept as is. Making every member of one optional does not describe a `Uint8Array` any more.
declare const typedArray: PartialDeep<Uint8Array>;
expectTypeOf(typedArray).toBe<Uint8Array>();

declare const arrayBuffer: PartialDeep<ArrayBuffer>;
expectTypeOf(arrayBuffer).toBe<ArrayBuffer>();

declare const sharedArrayBuffer: PartialDeep<SharedArrayBuffer>;
expectTypeOf(sharedArrayBuffer).toBe<SharedArrayBuffer>();

declare const dataView: PartialDeep<DataView>;
expectTypeOf(dataView).toBe<DataView>();

// A member that is a method keeps its `this` parameter. `Parameters` leaves `this` out, so the rebuilt function would otherwise accept any receiver. `NonNullable` is only there because an optional member carries an `| undefined` that `ThisParameterType` cannot see through.
declare const methodWithThis: PartialDeep<{m: ((this: Date, a: string) => void) & {count: number}}>;
expectTypeOf<ThisParameterType<NonNullable<(typeof methodWithThis)['m']>>>().toBe<Date>();
// A `Map` is structurally assignable to a `WeakMap` as soon as its key is an object or a symbol, so the weak-collection guard must not match it first and leave the whole map as it was, key and value alike.
declare const objectKeyMap: PartialDeep<Map<{a: number}, {b: number}>>;
expectTypeOf(objectKeyMap).toBe<Map<{a?: number}, {b?: number}>>();

declare const symbolKeyMap: PartialDeep<Map<symbol, {a: number}>>;
expectTypeOf(symbolKeyMap).toBe<Map<symbol, {a?: number}>>();

declare const dateKeyMap: PartialDeep<Map<Date, {a: number}>>;
expectTypeOf(dateKeyMap).toBe<Map<Date, {a?: number}>>();

// The weak collections have no `set` and no iteration, so they are still left alone.
declare const weakMap: PartialDeep<WeakMap<object, {a: number}>>;
expectTypeOf(weakMap).toBe<WeakMap<object, {a: number}>>();

declare const weakSet: PartialDeep<WeakSet<object>>;
expectTypeOf(weakSet).toBe<WeakSet<object>>();

// The `Function` interface has no call signature, so the function branch misses it, and mapping it produced an uncallable record of its own methods.
expectTypeOf<PartialDeep<Function>>().toBe<Function>();
expectTypeOf<PartialDeep<{callback: Function}>>().toBe<{callback?: Function}>();

// A `PromiseLike` is kept like a `Promise`, so it stays a thenable that `Awaited` can unwrap.
expectTypeOf<PartialDeep<PromiseLike<{a: number}>>>().toBe<PromiseLike<{a: number}>>();

// A function that declares no `this` is rebuilt without one, rather than with `this: unknown`, which would reject a function that declares a `this`, although the original accepts it.
declare const handlerWithThis: ((this: Date, event: string) => void) & {displayName: string};
expectTypeOf(handlerWithThis).toBeAssignableTo<PartialDeep<((event: string) => void) & {displayName: string}>>();

// A DOM node is kept as is, because recursing into it walks the whole DOM and fails. Test for https://github.com/sindresorhus/type-fest/issues/651
expectTypeOf<PartialDeep<{canvas: HTMLCanvasElement; document: Document; text: Text}>>().toBe<{canvas?: HTMLCanvasElement; document?: Document; text?: Text}>();
expectTypeOf<PartialDeep<HTMLElement>>().toBe<HTMLElement>();
expectTypeOf<PartialDeep<HTMLElement | {a: {b: number}}>>().toBe<HTMLElement | {a?: {b?: number}}>();
expectTypeOf<PartialDeep<{elements: HTMLElement[]}, {recurseIntoArrays: true}>>().toBe<{elements?: HTMLElement[]}>();
expectTypeOf<{event: MouseEvent}>().toBeAssignableTo<PartialDeep<{event: MouseEvent}>>();
