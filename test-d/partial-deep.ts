import {expectType, expectAssignable, expectNotType} from 'tsd';
import type {IsEqual, PartialDeep, Simplify} from '../index.d.ts';

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
expectType<Partial<typeof foo>>(partialDeepFoo);
const partialDeepBar: PartialDeep<typeof foo.bar, {recurseIntoArrays: true}> = foo.bar;
expectType<typeof partialDeepBar | undefined>(partialDeepFoo.bar);
// Check for constructor
expectType<typeof ClassA | undefined>(partialDeepFoo.bar!.classConstructor);
const instance = new partialDeepFoo.bar!.classConstructor!();
instance.foo = 2;
const b = partialDeepFoo.bar!.constructor;
expectType<((_: string) => void) | undefined>(partialDeepFoo.bar!.function);
expectAssignable<object | undefined>(partialDeepFoo.bar!.object);
expectType<string | undefined>(partialDeepFoo.bar!.string);
expectType<number | undefined>(partialDeepFoo.bar!.number);
expectType<boolean | undefined>(partialDeepFoo.bar!.boolean);
expectType<Date | undefined>(partialDeepFoo.bar!.date);
expectType<RegExp | undefined>(partialDeepFoo.bar!.regexp);
expectType<symbol | undefined>(partialDeepFoo.bar!.symbol);
expectType<null | undefined>(partialDeepFoo.bar!.null);
expectType<undefined>(partialDeepFoo.bar!.undefined);
expectAssignable<Map<string | undefined, string | undefined> | undefined>(partialDeepFoo.bar!.map);
expectAssignable<Set<string | undefined> | undefined>(partialDeepFoo.bar!.set);
expectType<string[] | undefined>(partialDeepFoo.bar!.array);
expectType<['foo'?] | undefined>(partialDeepFoo.bar!.tuple);
expectAssignable<ReadonlyMap<string | undefined, string | undefined> | undefined>(partialDeepFoo.bar!.readonlyMap);
expectAssignable<ReadonlySet<string | undefined> | undefined>(partialDeepFoo.bar!.readonlySet);
expectType<readonly string[] | undefined>(partialDeepFoo.bar!.readonlyArray);
expectType<readonly ['foo'?] | undefined>(partialDeepFoo.bar!.readonlyTuple);
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
expectAssignable<PartialDeep<RecurseObject>>(recurseObject);

// Check that `{recurseIntoArrays: false}` is the default
const partialDeepNoRecurseIntoArraysFoo: PartialDeep<typeof foo> = foo;
// Check that `{recurseIntoArrays: true}` behaves as intended
expectType<PartialDeep<typeof foo, {recurseIntoArrays: true}>>(partialDeepFoo);

// Check that `{allowUndefinedInNonTupleArrays: false}` is the default
const partialDeepAllowUndefinedInNonTupleArraysFoo: PartialDeep<typeof foo, {recurseIntoArrays: true}> = foo;
expectType<string[] | undefined>(partialDeepAllowUndefinedInNonTupleArraysFoo.bar!.array);
// Check that `{allowUndefinedInNonTupleArrays: true}` behaves as intended
const partialDeepDoNotAllowUndefinedInNonTupleArraysFoo: PartialDeep<typeof foo, {recurseIntoArrays: true; allowUndefinedInNonTupleArrays: true}> = foo;
expectType<Array<string | undefined> | undefined>(partialDeepDoNotAllowUndefinedInNonTupleArraysFoo.bar!.array);

// These are mostly the same checks as before, but the array/tuple types are different.
// @ts-expect-error
expectType<Partial<typeof foo>>(partialDeepNoRecurseIntoArraysFoo);
const partialDeepNoRecurseIntoArraysBar: PartialDeep<typeof foo.bar, {recurseIntoArrays: false}> = foo.bar;
expectType<typeof partialDeepNoRecurseIntoArraysBar | undefined>(partialDeepNoRecurseIntoArraysFoo.bar);
expectType<((_: string) => void) | undefined>(partialDeepNoRecurseIntoArraysBar.function);
expectAssignable<object | undefined>(partialDeepNoRecurseIntoArraysBar.object);
expectType<string | undefined>(partialDeepNoRecurseIntoArraysBar.string);
expectType<number | undefined>(partialDeepNoRecurseIntoArraysBar.number);
expectType<boolean | undefined>(partialDeepNoRecurseIntoArraysBar.boolean);
expectType<Date | undefined>(partialDeepNoRecurseIntoArraysBar.date);
expectType<RegExp | undefined>(partialDeepNoRecurseIntoArraysBar.regexp);
expectType<symbol | undefined>(partialDeepNoRecurseIntoArraysBar.symbol);
expectType<null | undefined>(partialDeepNoRecurseIntoArraysBar.null);
expectType<undefined>(partialDeepNoRecurseIntoArraysBar.undefined);
expectAssignable<Map<string | undefined, string | undefined> | undefined>(partialDeepNoRecurseIntoArraysBar.map);
expectAssignable<Set<string | undefined> | undefined>(partialDeepNoRecurseIntoArraysBar.set);
expectType<string[] | undefined>(partialDeepNoRecurseIntoArraysBar.array);
expectType<['foo'] | undefined>(partialDeepNoRecurseIntoArraysBar.tuple);
expectAssignable<ReadonlyMap<string | undefined, string | undefined> | undefined>(partialDeepNoRecurseIntoArraysBar.readonlyMap);
expectAssignable<ReadonlySet<string | undefined> | undefined>(partialDeepNoRecurseIntoArraysBar.readonlySet);
expectType<readonly string[] | undefined>(partialDeepNoRecurseIntoArraysBar.readonlyArray);
expectType<readonly ['foo'] | undefined>(partialDeepNoRecurseIntoArraysBar.readonlyTuple);

type FunctionWithProperties = {(a1: string, a2: number): boolean; p1: string; readonly p2: number};
declare const functionWithProperties: PartialDeep<FunctionWithProperties>;
expectType<boolean>(functionWithProperties('foo', 1));
expectType<{p1?: string; readonly p2?: number}>({} as Simplify<typeof functionWithProperties>); // `Simplify` removes the call signature from `typeof functionWithProperties`

type FunctionWithProperties2 = {(a1: boolean, ...a2: string[]): number; p1: {p2?: string; p3: {readonly p4?: boolean}}};
declare const functionWithProperties2: PartialDeep<FunctionWithProperties2>;
expectType<number>(functionWithProperties2(true, 'foo', 'bar'));
expectType<{p1?: {p2?: string; p3?: {readonly p4?: boolean}}}>({} as Simplify<typeof functionWithProperties2>);

type FunctionWithProperties3 = {(): void; p1: {p2?: string; p3: [{p4: number}, string]}};
declare const functionWithProperties3: PartialDeep<FunctionWithProperties3, {recurseIntoArrays: true}>;
expectType<void>(functionWithProperties3());
expectType<{p1?: {p2?: string; p3?: [{p4?: number}?, string?]}}>({} as Simplify<typeof functionWithProperties3>);

expectType<{p1?: string[]}>({} as Simplify<PartialDeep<{(): void; p1: string[]}, {allowUndefinedInNonTupleArrays: false}>>);
expectType<{p1?: string[]}>({} as Simplify<PartialDeep<{(): void; p1: string[]}, {allowUndefinedInNonTupleArrays: true}>>);

// Properties within functions containing multiple call signatures are not made partial due to TS limitations, refer https://github.com/microsoft/TypeScript/issues/29732
type FunctionWithProperties4 = {(a1: number): string; (a1: string, a2: number): number; p1: string};
declare const functionWithProperties4: PartialDeep<FunctionWithProperties4>;
expectType<string>(functionWithProperties4(1));
expectType<number>(functionWithProperties4('foo', 1));
expectNotType<{p1?: string}>({} as Simplify<typeof functionWithProperties4>);

// `Promise` and its `then` method are not made partial, unlike `Map` and `Set`.
declare const partialDeepPromise: PartialDeep<Promise<{a: number}>>;
expectType<Promise<{a: number}>>(partialDeepPromise);

// A `WeakMap` and its methods are not made partial.
declare const partialDeepWeakMap: PartialDeep<WeakMap<{a: number}, number>>;
expectType<WeakMap<{a: number}, number>>(partialDeepWeakMap);

// A `WeakSet` and its methods are not made partial.
declare const partialDeepWeakSet: PartialDeep<WeakSet<{a: number}>>;
expectType<WeakSet<{a: number}>>(partialDeepWeakSet);

// A `Set` is structurally a `WeakSet`, so its items must still be made partial, like a `Map`'s.
expectType<true>({} as IsEqual<PartialDeep<Set<{a: number}>>, Set<{a?: number}>>);
expectType<true>({} as IsEqual<PartialDeep<{s: Set<{a: number}>}>, {s?: Set<{a?: number}>}>);
expectType<true>({} as IsEqual<PartialDeep<Map<string, Set<{a: number}>>>, Map<string, Set<{a?: number}>>>);
expectType<true>({} as IsEqual<PartialDeep<{s: Array<Set<{a: number}>>}, {recurseIntoArrays: true}>, {s?: Array<Set<{a?: number}>>}>);

// An abstract class has an `abstract new` signature, so it must be kept as is just like a concrete class constructor.
abstract class AbstractClassForTest {
	foo = 1;
}

expectType<true>({} as IsEqual<PartialDeep<typeof AbstractClassForTest>, typeof AbstractClassForTest>);

// These are a single value rather than a structure to recurse into, so they are kept as is. Making every member of one optional does not describe a `Uint8Array` any more.
declare const typedArray: PartialDeep<Uint8Array>;
expectType<Uint8Array>(typedArray);

declare const arrayBuffer: PartialDeep<ArrayBuffer>;
expectType<ArrayBuffer>(arrayBuffer);

declare const sharedArrayBuffer: PartialDeep<SharedArrayBuffer>;
expectType<SharedArrayBuffer>(sharedArrayBuffer);

declare const dataView: PartialDeep<DataView>;
expectType<DataView>(dataView);

// A member that is a method keeps its `this` parameter. `Parameters` leaves `this` out, so the rebuilt function would otherwise accept any receiver. `NonNullable` is only there because an optional member carries an `| undefined` that `ThisParameterType` cannot see through.
declare const methodWithThis: PartialDeep<{m: ((this: Date, a: string) => void) & {count: number}}>;
expectType<Date>({} as ThisParameterType<NonNullable<(typeof methodWithThis)['m']>>);
// A `Map` is structurally assignable to a `WeakMap` as soon as its key is an object or a symbol, so the weak-collection guard must not match it first and leave the whole map as it was, key and value alike.
declare const objectKeyMap: PartialDeep<Map<{a: number}, {b: number}>>;
expectType<Map<{a?: number}, {b?: number}>>(objectKeyMap);

declare const symbolKeyMap: PartialDeep<Map<symbol, {a: number}>>;
expectType<Map<symbol, {a?: number}>>(symbolKeyMap);

declare const dateKeyMap: PartialDeep<Map<Date, {a: number}>>;
expectType<Map<Date, {a?: number}>>(dateKeyMap);

// The weak collections have no `set` and no iteration, so they are still left alone.
declare const weakMap: PartialDeep<WeakMap<object, {a: number}>>;
expectType<WeakMap<object, {a: number}>>(weakMap);

declare const weakSet: PartialDeep<WeakSet<object>>;
expectType<WeakSet<object>>(weakSet);

// The `Function` interface has no call signature, so the function branch misses it, and mapping it produced an uncallable record of its own methods.
expectType<Function>({} as PartialDeep<Function>);
expectType<{callback?: Function}>({} as PartialDeep<{callback: Function}>);

// A `PromiseLike` is kept like a `Promise`, so it stays a thenable that `Awaited` can unwrap.
expectType<PromiseLike<{a: number}>>({} as PartialDeep<PromiseLike<{a: number}>>);

// A function that declares no `this` is rebuilt without one, rather than with `this: unknown`, which would reject a function that declares a `this`, although the original accepts it.
declare const handlerWithThis: ((this: Date, event: string) => void) & {displayName: string};
expectAssignable<PartialDeep<((event: string) => void) & {displayName: string}>>(handlerWithThis);
