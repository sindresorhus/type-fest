import {expectTypeOf} from 'nz';
import type {IsEqual, PartialDeep, PartialDeepOptions} from '../index.d.ts';

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

// Objects in arrays are made partial without making the array elements `undefined`. Test for https://github.com/sindresorhus/type-fest/issues/514
type ObjectArrays = {
	items: Array<{id: number; tags: string[]}>;
	readonlyItems: ReadonlyArray<{id: number}>;
	matrix: Array<Array<{x: number}>>;
	tuples: Array<[{id: number}, string]>;
	mixed: Array<string | {id: number}>;
	optional?: Array<{id: number}>;
};

expectTypeOf<PartialDeep<ObjectArrays, {recurseIntoArrays: true}>>().toBe<{
	items?: Array<{id?: number; tags?: string[]}>;
	readonlyItems?: ReadonlyArray<{id?: number}>;
	matrix?: Array<Array<{x?: number}>>;
	tuples?: Array<[{id?: number}?, string?]>;
	mixed?: Array<string | {id?: number}>;
	optional?: Array<{id?: number}>;
}>();
expectTypeOf<PartialDeep<Array<{id: number}>, {recurseIntoArrays: true}>>().toBe<Array<{id?: number}>>();
expectTypeOf<{items: [undefined]}>().not.toBeAssignableTo<PartialDeep<ObjectArrays, {recurseIntoArrays: true}>>();

// With `allowUndefinedInNonTupleArrays`, the elements of non-tuple arrays also accept `undefined`.
expectTypeOf<PartialDeep<ObjectArrays, {recurseIntoArrays: true; allowUndefinedInNonTupleArrays: true}>>().toBe<{
	items?: Array<{id?: number; tags?: Array<string | undefined>} | undefined>;
	readonlyItems?: ReadonlyArray<{id?: number} | undefined>;
	matrix?: Array<Array<{x?: number} | undefined> | undefined>;
	tuples?: Array<[{id?: number}?, string?] | undefined>;
	mixed?: Array<string | undefined | {id?: number}>;
	optional?: Array<{id?: number} | undefined>;
}>();

// Without `recurseIntoArrays`, arrays are kept as is.
expectTypeOf<PartialDeep<ObjectArrays>>().toBe<Partial<ObjectArrays>>();

// The elements of an array of `any`, `unknown`, or `never` are kept as is.
expectTypeOf<PartialDeep<{any: any[]; unknown: unknown[]; never: never[]}, {recurseIntoArrays: true}>>().toBe<{any?: any[]; unknown?: unknown[]; never?: never[]}>();

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

// Generic options preserve construction and reading of values unaffected by recursion.
function _partialStringInput<Options extends PartialDeepOptions>(value: string): PartialDeep<string, Options> {
	return value;
}

function _partialNumberInput<Options extends PartialDeepOptions>(value: number): PartialDeep<number, Options> {
	return value;
}

function _partialDateInput<Options extends PartialDeepOptions>(value: Date): PartialDeep<Date, Options> {
	return value;
}

function _partialPromiseInput<Value, Options extends PartialDeepOptions>(value: Promise<Value>): {value: PartialDeep<Promise<Value>, Options>} {
	return {value};
}

function _partialShallowArrayInput<Options extends {recurseIntoArrays: false}>(value: string[]): PartialDeep<string[], Options> {
	return value;
}

function _partialCallbackInput<Options extends PartialDeepOptions>(value: () => string): PartialDeep<() => string, Options> {
	return value;
}

function _readPartialString<Options extends PartialDeepOptions>(value: PartialDeep<string, Options>): string {
	return value;
}

function _readPartialPromise<Value, Options extends PartialDeepOptions>(value: PartialDeep<Promise<Value>, Options>): {value: Promise<Value>} {
	return {value};
}

type RecursionModeRows = {rows: Array<{name: string; enabled: boolean}>};
expectTypeOf<{rows: [{}]}>().not.toBeAssignableTo<PartialDeep<RecursionModeRows, {recurseIntoArrays: false}>>();
expectTypeOf<{rows: [{}]}>().not.toBeAssignableTo<PartialDeep<RecursionModeRows, {recurseIntoArrays?: boolean}>>();
expectTypeOf<{rows: [undefined]}>().not.toBeAssignableTo<PartialDeep<RecursionModeRows, {recurseIntoArrays: true}>>();
// A non-literal recursion flag resolves like the default.
type BooleanRecursionMode = PartialDeep<{a: Array<{b: string}>}, {recurseIntoArrays: boolean}>;
type TrueRecursionMode = PartialDeep<{a: Array<{b: string}>}, {recurseIntoArrays: true}>;
expectTypeOf<BooleanRecursionMode>().toBe<PartialDeep<{a: Array<{b: string}>}>>();
// TypeScript 7.1 reports two `PartialDeep` instantiations that differ only in their options as identical, so compare the recursed member instead.
expectTypeOf<BooleanRecursionMode['a']>().not.toBe<TrueRecursionMode['a']>();
expectTypeOf<PartialDeep<RecursionModeRows, any>>().toBe<Partial<RecursionModeRows>>();
expectTypeOf<PartialDeep<RecursionModeRows, never>>().toBe<Partial<RecursionModeRows>>();

declare const readonlyRecursiveRows: PartialDeep<{readonly rows: ReadonlyArray<{readonly name: string}>}, {recurseIntoArrays: true}>;
const readonlyRecursiveRow = readonlyRecursiveRows.rows?.[0];
if (readonlyRecursiveRow) {
	// @ts-expect-error Making an element partial does not make its fields writable.
	readonlyRecursiveRow.name = 'changed';
}

// @ts-expect-error The recursion mode must be boolean.
type InvalidRecursionMode = PartialDeep<RecursionModeRows, {recurseIntoArrays: unknown}>;

// `keep` option: matching types are kept as is, while everything else is made partial.
class KeptColor {
	isColor = true as const;
	r = 0;

	setRed(red: number): this {
		this.r = red;
		return this;
	}
}

class KeptDayjs {
	format(template: string): string {
		return template;
	}
}

type KeptItem = {
	name: string;
	color: KeptColor;
	meta: {
		created: KeptDayjs;
		colors: KeptColor[];
		cache: Map<string, KeptColor>;
		tags: Set<KeptColor>;
	};
};

type KeptPartialItem = PartialDeep<KeptItem, {keep: KeptColor | KeptDayjs}>;
expectTypeOf<KeptPartialItem['color']>().toBe<KeptColor | undefined>();
expectTypeOf<KeptPartialItem['name']>().toBe<string | undefined>();
expectTypeOf<NonNullable<KeptPartialItem['meta']>['created']>().toBe<KeptDayjs | undefined>();
expectTypeOf<NonNullable<KeptPartialItem['meta']>['cache']>().toBe<Map<string, KeptColor> | undefined>();
expectTypeOf<NonNullable<KeptPartialItem['meta']>['tags']>().toBe<Set<KeptColor> | undefined>();

// A kept type is kept at the root too.
expectTypeOf<PartialDeep<KeptColor, {keep: KeptColor}>>().toBe<KeptColor>();

// Only the matching members of a union are kept.
expectTypeOf<PartialDeep<KeptColor | {other: number}, {keep: KeptColor}>>().toBe<KeptColor | {other?: number}>();

// Without `recurseIntoArrays`, an array of kept elements is used as is.
expectTypeOf<PartialDeep<{colors: KeptColor[]}, {keep: KeptColor}>['colors']>().toBe<KeptColor[] | undefined>();

// With `recurseIntoArrays`, kept elements survive the recursion of the array itself.
expectTypeOf<PartialDeep<{colors: KeptColor[]}, {keep: KeptColor; recurseIntoArrays: true}>['colors']>().toBe<KeptColor[] | undefined>();
expectTypeOf<PartialDeep<{colors: KeptColor[]}, {recurseIntoArrays: true}>['colors']>().toBe<Array<PartialDeep<KeptColor>> | undefined>();

// A kept collection is returned as is, instead of being rebuilt around its items. `toBe` accepts the rebuilt `{} &` form too, so compare with `IsEqual`.
const keptSetIsUntouched: IsEqual<PartialDeep<Set<KeptColor>, {keep: Set<KeptColor>}>, Set<KeptColor>> = true;
const keptMapIsUntouched: IsEqual<PartialDeep<Map<string, KeptColor>, {keep: Map<string, KeptColor>}>, Map<string, KeptColor>> = true;

// `any`, `never`, and `unknown` inputs are unaffected by `keep`.
expectTypeOf<PartialDeep<any, {keep: KeptColor}>>().toBe<any>();
expectTypeOf<PartialDeep<never, {keep: KeptColor}>>().toBe<never>();
expectTypeOf<PartialDeep<unknown, {keep: KeptColor}>>().toBe<unknown>();

// A plain object structurally matching a kept class is kept too.
type KeptColorLookalike = {isColor: true; r: number; setRed: (red: number) => KeptColor};
expectTypeOf<PartialDeep<{lookalike: KeptColorLookalike}, {keep: KeptColor}>['lookalike']>().toBe<KeptColorLookalike | undefined>();

// A wide kept type keeps every matching value, including the input itself.
type WideKeep = PartialDeep<{nested: {value: string}; primitive: string}, {keep: object}>;
expectTypeOf<WideKeep>().toBe<{nested: {value: string}; primitive: string}>();

// The original value is still assignable to the result.
declare const keptItemValue: KeptItem;
const keptPartialValue: PartialDeep<KeptItem, {keep: KeptColor | KeptDayjs}> = keptItemValue;

// Without `keep`, the class instance is made partial as usual.
type DefaultKept = PartialDeep<{color: KeptColor}>;
expectTypeOf<DefaultKept['color']>().toBe<PartialDeep<KeptColor> | undefined>();

// A kept array type is left untouched, including its elements, instead of being rebuilt around them.
type KeptRow = {id: number; name: string};
expectTypeOf<PartialDeep<{rows: KeptRow[]}, {keep: KeptRow[]; recurseIntoArrays: true}>['rows']>().toBe<KeptRow[] | undefined>();
expectTypeOf<PartialDeep<{rows: readonly KeptRow[]}, {keep: readonly KeptRow[]; recurseIntoArrays: true}>['rows']>().toBe<readonly KeptRow[] | undefined>();
expectTypeOf<PartialDeep<{rows: KeptRow[]}, {keep: KeptRow[]; recurseIntoArrays: true; allowUndefinedInNonTupleArrays: true}>['rows']>().toBe<KeptRow[] | undefined>();

// A kept array nested inside a rebuilt array stays untouched.
expectTypeOf<PartialDeep<{groups: KeptRow[][]}, {keep: KeptRow[]; recurseIntoArrays: true}>['groups']>().toBe<KeptRow[][] | undefined>();

// A kept array of unions is untouched, including the primitive members.
expectTypeOf<PartialDeep<{rows: Array<KeptRow | string>}, {keep: Array<KeptRow | string>; recurseIntoArrays: true}>['rows']>().toBe<Array<KeptRow | string> | undefined>();

// A kept tuple is untouched too, and its elements are not made optional.
expectTypeOf<PartialDeep<{pair: [KeptRow, string]}, {keep: [KeptRow, string]; recurseIntoArrays: true}>['pair']>().toBe<[KeptRow, string] | undefined>();

// A mutable array keep matches mutable arrays, including one behind a readonly property.
expectTypeOf<PartialDeep<{rows: KeptRow[]; readonly names: string[]}, {keep: unknown[]; recurseIntoArrays: true}>>().toBe<{rows?: KeptRow[]; readonly names?: string[]}>();

// A readonly array does not match a mutable array keep, so its elements are still partialized; a readonly array keep matches it.
expectTypeOf<PartialDeep<{rows: readonly KeptRow[]}, {keep: unknown[]; recurseIntoArrays: true}>['rows']>().toBe<ReadonlyArray<{id?: number; name?: string}> | undefined>();
expectTypeOf<PartialDeep<{rows: readonly KeptRow[]}, {keep: readonly unknown[]; recurseIntoArrays: true}>['rows']>().toBe<readonly KeptRow[] | undefined>();

// The kept rows still reject a partial row.
expectTypeOf<{rows: [{id: number}]}>().not.toBeAssignableTo<PartialDeep<{rows: KeptRow[]}, {keep: KeptRow[]; recurseIntoArrays: true}>>();

// A subclass instance is kept when its base class is kept.
class KeptBase {
	r = 0;
}

class KeptSub extends KeptBase {
	g = 0;
}

expectTypeOf<PartialDeep<{shape: KeptSub}, {keep: KeptBase}>['shape']>().toBe<KeptSub | undefined>();

// An intersection with a kept type is kept as a whole.
type KeptIntersection = KeptColor & {extra: string};
expectTypeOf<PartialDeep<{value: KeptIntersection}, {keep: KeptColor}>['value']>().toBe<KeptIntersection | undefined>();

// A lookalike that is missing a member is not kept.
type KeptColorAlmost = {isColor: true; r: number};
expectTypeOf<PartialDeep<{almost: KeptColorAlmost}, {keep: KeptColor}>['almost']>().toBe<{isColor?: true; r?: number} | undefined>();

// A class with a private member is kept, but a plain lookalike of it is not, because private members do not match structurally.
class KeptPrivateColor {
	r = this.secret;

	private get secret(): number {
		return 0;
	}
}

expectTypeOf<PartialDeep<{color: KeptPrivateColor}, {keep: KeptPrivateColor}>['color']>().toBe<KeptPrivateColor | undefined>();
expectTypeOf<PartialDeep<{lookalike: {secret: number; r: number}}, {keep: KeptPrivateColor}>['lookalike']>().toBe<{secret?: number; r?: number} | undefined>();

// Only the kept member of a union is kept as is, while the other members are made partial.
expectTypeOf<PartialDeep<{value: KeptColor | string | {other: number}}, {keep: KeptColor}>['value']>().toBe<KeptColor | string | {other?: number} | undefined>();

// Optional and readonly modifiers on a kept property behave like on any other property.
expectTypeOf<PartialDeep<{color?: KeptColor; readonly shape: KeptColor}, {keep: KeptColor}>>().toBe<{color?: KeptColor; readonly shape?: KeptColor}>();

// A callable object with properties is kept as a whole, instead of being split into a call signature and partial properties.
type KeptCallable = ((event: string) => void) & {once: boolean};
expectTypeOf<PartialDeep<{listener: KeptCallable}, {keep: KeptCallable}>['listener']>().toBe<KeptCallable | undefined>();

// Keeping a generic callable preserves inference and the relationship between its arguments.
type KeptGenericCallable = (<Value extends string>(value: Value, fallback: NoInfer<Value>) => Value) & {displayName: string};
declare const keptGenericCallable: PartialDeep<KeptGenericCallable, {keep: KeptGenericCallable}>;
expectTypeOf(keptGenericCallable('red', 'red')).toBe<'red'>();
expectTypeOf<IsEqual<typeof keptGenericCallable, KeptGenericCallable>>().toBe<true>();
// @ts-expect-error The fallback must match the inferred first argument.
keptGenericCallable('red', 'blue');

declare const keptNestedGenericCallable: PartialDeep<{callback: KeptGenericCallable}, {keep: KeptGenericCallable}>;
expectTypeOf(keptNestedGenericCallable.callback!('red', 'red')).toBe<'red'>();
// @ts-expect-error The kept nested callable retains the same argument constraint.
keptNestedGenericCallable.callback!('red', 'blue');

// A kept generic method retains its receiver and readonly metadata.
type KeptGenericMethod = (<Value>(this: {prefix: string}, value: Value) => Value) & {readonly metadata: {enabled: boolean}};
declare const keptMethodOwner: {prefix: string; transform: PartialDeep<KeptGenericMethod, {keep: KeptGenericMethod}>};
expectTypeOf(keptMethodOwner.transform(123)).toBe<number>();
expectTypeOf(keptMethodOwner.transform.metadata.enabled).toBe<boolean>();
// @ts-expect-error Keeping the method preserves its readonly metadata property.
keptMethodOwner.transform.metadata = {enabled: true};
declare const wrongMethodOwner: {prefix: number; transform: typeof keptMethodOwner.transform};
// @ts-expect-error The method still requires a receiver with a string prefix.
wrongMethodOwner.transform(123);

// Keeping a nested callback does not keep its enclosing callable or sibling metadata.
type CallbackFactory = (() => void) & {metadata: {callback: KeptGenericCallable; retries: number}};
declare const partialCallbackFactory: PartialDeep<CallbackFactory, {keep: KeptGenericCallable}>;
expectTypeOf(partialCallbackFactory()).toBe<void>();
expectTypeOf(partialCallbackFactory.metadata).toBe<{callback?: KeptGenericCallable; retries?: number} | undefined>();
expectTypeOf(partialCallbackFactory.metadata!.callback!('red', 'red')).toBe<'red'>();

// Array recursion can add undefined without changing a kept callback or making its properties optional.
declare const keptCallbackRows: PartialDeep<KeptGenericCallable[], {keep: KeptGenericCallable; recurseIntoArrays: true; allowUndefinedInNonTupleArrays: true}>;
expectTypeOf(keptCallbackRows).toBe<Array<KeptGenericCallable | undefined>>();
expectTypeOf(keptCallbackRows[0]!('red', 'red')).toBe<'red'>();
expectTypeOf(keptCallbackRows[0]!.displayName).toBe<string>();
keptCallbackRows.push(undefined);
// @ts-expect-error A kept callback must still have its required displayName property.
keptCallbackRows[0] = <Value extends string>(value: Value, _fallback: NoInfer<Value>) => value;

// A callable can match a broader kept shape while a different callable union member is still made partial.
type OtherCallable = ((event: number) => void) & {label: string};
declare const partialCallableUnion: PartialDeep<KeptGenericCallable | OtherCallable, {keep: {displayName: string}}>;
if ('displayName' in partialCallableUnion) {
	expectTypeOf(partialCallableUnion('red', 'red')).toBe<'red'>();
} else {
	expectTypeOf(partialCallableUnion.label).toBe<string | undefined>();
}

// `keep: any` keeps everything, including the input itself.
expectTypeOf<PartialDeep<{nested: {value: string}; primitive: string}, {keep: any}>>().toBe<{nested: {value: string}; primitive: string}>();
