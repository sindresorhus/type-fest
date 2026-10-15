import {expectTypeOf} from 'nz';
import type {Opaque, tag} from '../source/tagged.d.ts';
import type {ReadonlyDeep, _ReadonlyObjectDeep} from '../source/readonly-deep.d.ts';
import type {RequiredDeep} from '../source/required-deep.d.ts';
import type {JsonValue} from '../source/json-value.d.ts';
import type {IsEqual} from '../source/is-equal.d.ts';
import type {TupleOf} from '../source/tuple-of.d.ts';

declare const key: unique symbol;

type Overloaded = {
	(foo: number): string;
	(foo: string, bar: number): number;
};

type Namespace = {
	(foo: number): string;
	baz: boolean[];
};

type NamespaceWithOverload = Overloaded & {
	baz: boolean[];
};

type OpaqueObjectData = {a: number[]} | {b: string};
type OpaqueObject = Opaque<OpaqueObjectData, {token: unknown}>;

type ReadonlyJsonValue =
	readonly ReadonlyJsonValue[] | number | string | boolean | {readonly [k: string]: ReadonlyJsonValue} | null;

class ClassA {
	foo = 1;
}

const data = {
	object: {
		foo: 'bar',
	},
	constructor: ClassA,
	fn: (_: string) => true,
	fnWithOverload: ((_: number) => 'foo') as Overloaded,
	namespace: {} as unknown as Namespace,
	namespaceWithOverload: {} as unknown as NamespaceWithOverload,
	string: 'foo',
	number: 1,
	boolean: false,
	symbol: Symbol('test'),
	date: new Date(),
	regExp: /.*/,
	null: null,
	undefined: undefined, // eslint-disable-line object-shorthand
	map: new Map<string, string>(),
	set: new Set<string>(),
	array: ['foo'],
	emptyTuple: [] as [],
	singleItemTuple: ['foo'] as ['foo'],
	multiItemTuple: [{a: ''}, {b: 4}, {c: ''}] as [{a: string}, {b: number}, {c: string}],
	trailingSpreadTuple: ['foo', 1] as [string, ...number[]],
	leadingSpreadTuple: ['foo', 1] as [...string[], number],
	readonlyMap: new Map<string, string>() as ReadonlyMap<string, string>,
	readonlySet: new Set<string>() as ReadonlySet<string>,
	readonlyArray: ['foo'] as readonly string[],
	readonlyTuple: ['foo'] as const,
	json: [{x: true}] as JsonValue,
	opaqueObj: {a: [3]} as OpaqueObject, // eslint-disable-line @typescript-eslint/consistent-type-assertions
};

const readonlyData: ReadonlyDeep<typeof data> = data;
readonlyData.fn('foo');

readonlyData.fnWithOverload(1);
readonlyData.fnWithOverload('', 1);

const Constructor = readonlyData.constructor;
expectTypeOf(Constructor).toBe<typeof ClassA>();
const instance = new Constructor();
instance.foo = 2; // Constructor is not made readonly

// @ts-expect-error
readonlyData.string = 'bar';
expectTypeOf(readonlyData.object).toBe<{readonly foo: string}>();
expectTypeOf(readonlyData.string).toBe<string>();
expectTypeOf(readonlyData.number).toBe<number>();
expectTypeOf(readonlyData.boolean).toBe<boolean>();
expectTypeOf(readonlyData.symbol).toBe<symbol>();
expectTypeOf(readonlyData.null).toBe<null>();
expectTypeOf(readonlyData.undefined).toBe<undefined>();
expectTypeOf(readonlyData.date).toBe<Date>();
expectTypeOf(readonlyData.regExp).toBe<RegExp>();
expectTypeOf(readonlyData.map).toBe<ReadonlyMap<string, string>>();
expectTypeOf(readonlyData.set).toBe<ReadonlySet<string>>();
// A `ReadonlyMap` is already deeply immutable, so the result has to be the built-in itself rather than an anonymous object type that merely happens to be mutually assignable to it. `expectType` above is an identity check and so already catches the difference; the `IsEqual` pair states it directly and, because assignability cannot see it, these are the assertions that would survive a change to a weaker check.
expectTypeOf<IsEqual<ReadonlyDeep<Map<string, Date>>, ReadonlyMap<string, Date>>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<Set<string>>, ReadonlySet<string>>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<ReadonlyMap<string, Date>>, ReadonlyMap<string, Date>>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<ReadonlySet<string>>, ReadonlySet<string>>>().toBe<true>();
// Composing the two in either order has to give the same answer, since each only changes one modifier.
expectTypeOf<IsEqual<RequiredDeep<ReadonlyDeep<Map<string, Date>>>, ReadonlyDeep<RequiredDeep<Map<string, Date>>>>>().toBe<true>();
expectTypeOf<IsEqual<RequiredDeep<ReadonlyDeep<ReadonlySet<string>>>, ReadonlyDeep<RequiredDeep<ReadonlySet<string>>>>>().toBe<true>();
expectTypeOf(readonlyData.array).toBe<readonly string[]>();
expectTypeOf(readonlyData.emptyTuple).toBe<readonly []>();
expectTypeOf(readonlyData.singleItemTuple).toBe<readonly ['foo']>();
expectTypeOf(readonlyData.trailingSpreadTuple).toBe<readonly [string, ...number[]]>();
expectTypeOf(readonlyData.leadingSpreadTuple).toBe<readonly [...string[], number]>();
expectTypeOf(readonlyData.multiItemTuple).toBe<readonly [{readonly a: string}, {readonly b: number}, {readonly c: string}]>();
expectTypeOf(readonlyData.readonlyMap).toBe<ReadonlyMap<string, string>>();
expectTypeOf(readonlyData.readonlySet).toBe<ReadonlySet<string>>();
expectTypeOf(readonlyData.readonlyArray).toBe<readonly string[]>();
expectTypeOf(readonlyData.readonlyTuple).toBe<readonly ['foo']>();
expectTypeOf(readonlyData.json).toBeAssignableTo<ReadonlyJsonValue>();
expectTypeOf(readonlyData.opaqueObj).toBeAssignableTo<Opaque<ReadonlyDeep<OpaqueObjectData>, ReadonlyDeep<OpaqueObject[typeof tag]>>>();

expectTypeOf(readonlyData.namespace).toBe<((foo: number) => string) & _ReadonlyObjectDeep<Namespace>>();
expectTypeOf(readonlyData.namespace(1)).toBe<string>();
expectTypeOf(readonlyData.namespace.baz).toBe<readonly boolean[]>();

// These currently aren't readonly due to TypeScript limitations.
// @see https://github.com/microsoft/TypeScript/issues/29732
expectTypeOf(readonlyData.namespaceWithOverload).toBe<NamespaceWithOverload>();
expectTypeOf(readonlyData.namespaceWithOverload(1)).toBe<string>();
expectTypeOf(readonlyData.namespaceWithOverload('foo', 1)).toBe<number>();
expectTypeOf(readonlyData.namespaceWithOverload.baz).toBe<boolean[]>();

// Test void
type VoidType = {
	foo: void;
	bar: string | void;
};
type VoidTypeExpected = {
	readonly foo: void;
	readonly bar: string | void;
};
declare const voidType: ReadonlyDeep<VoidType>;
expectTypeOf(voidType).toBe<VoidTypeExpected>();

// Standalone tests

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const readonlyNamespace = {} as ReadonlyDeep<{
	(foo: number): string;
	baz: boolean[];
}>;
expectTypeOf(readonlyNamespace).toBe<((foo: number) => string) & {
	readonly baz: readonly boolean[];
}>();
expectTypeOf(readonlyNamespace).toBeAssignableTo<{
	(foo: number): string;
	readonly baz: readonly boolean[];
}>();

// A function type whose properties are all optional is still made deeply readonly.
declare const readonlyNamespaceWithOptionalProperty: ReadonlyDeep<{p?: number; (foo: number): string}>;
expectTypeOf(readonlyNamespaceWithOptionalProperty).toBe<((foo: number) => string) & {readonly p?: number}>();
// @ts-expect-error
readonlyNamespaceWithOptionalProperty.p = 1;

// Function and method return types are not transformed, while getters are
// structurally ordinary properties, so their values are.
// See https://github.com/sindresorhus/type-fest/issues/826

declare const readonlyFunctionReturningMap: ReadonlyDeep<() => Map<string, number[]>>;
expectTypeOf(readonlyFunctionReturningMap).toBe<() => Map<string, number[]>>();

declare const readonlyObjectWithMethod: ReadonlyDeep<{
	method: () => Map<string, number[]>;
}>;
// The method member becomes readonly, but its signature — including the returned Map — is left untouched.
expectTypeOf(readonlyObjectWithMethod).toBe<{
	readonly method: () => Map<string, number[]>;
}>();

class ClassWithGetter {
	get accessor(): Map<string, number[]> {
		return new Map();
	}
}

// A getter on a class is seen as a plain property of its type, so its value is deep-readonly like any other property.
declare const readonlyClassWithGetter: ReadonlyDeep<ClassWithGetter>;
expectTypeOf(readonlyClassWithGetter.accessor).toBe<ReadonlyMap<string, readonly number[]>>();

// A tuple whose elements are all optional keeps its optional modifiers, instead of widening into a rest.
declare const optionalTail: ReadonlyDeep<readonly [number, string?]>;
expectTypeOf(optionalTail).toBe<readonly [number, string?]>();

declare const optionalTailMutable: ReadonlyDeep<[number, string?]>;
expectTypeOf(optionalTailMutable).toBe<readonly [number, string?]>();

declare const allOptional: ReadonlyDeep<readonly [(number | undefined)?, string?]>;
expectTypeOf(allOptional).toBe<readonly [(number | undefined)?, string?]>();

// A tuple whose optional element is followed by a rest element stays a tuple, instead of widening into an array.
declare const optionalHeadWithRest: ReadonlyDeep<readonly [number?, ...string[]]>;
expectTypeOf(optionalHeadWithRest).toBe<readonly [number?, ...string[]]>();

// A `Promise` and its `then` method are not made readonly.
declare const readonlyPromise: ReadonlyDeep<Promise<number>>;
expectTypeOf(readonlyPromise).toBe<Promise<number>>();

// A `WeakMap` and its methods are not made readonly.
declare const readonlyWeakMap: ReadonlyDeep<WeakMap<{id: number}, number>>;
expectTypeOf(readonlyWeakMap).toBe<WeakMap<{id: number}, number>>();

// A `WeakSet` and its methods are not made readonly.
declare const readonlyWeakSet: ReadonlyDeep<WeakSet<{id: number}>>;
expectTypeOf(readonlyWeakSet).toBe<WeakSet<{id: number}>>();

// An abstract class constructor keeps its construct signature, the way a concrete one does.
abstract class AbstractClassA {
	foo = 1;
}

expectTypeOf<IsEqual<ReadonlyDeep<typeof AbstractClassA>, typeof AbstractClassA>>().toBe<true>();

// These are a single value rather than a structure to recurse into, so they are kept as is. Mapping over one of them replaces its members, so a `Uint8Array` came back as a plain object of its own methods and was no longer a `Uint8Array` at all.
declare const typedArray: ReadonlyDeep<Uint8Array>;
expectTypeOf(typedArray).toBe<Uint8Array>();

// A plain object with `name` and `message` is structurally an `Error`, but it is data, so it is still walked.
expectTypeOf<ReadonlyDeep<{name: string; message: string; tags: string[]}>>().toBe<{readonly name: string; readonly message: string; readonly tags: readonly string[]}>();

declare const arrayBuffer: ReadonlyDeep<ArrayBuffer>;
expectTypeOf(arrayBuffer).toBe<ArrayBuffer>();

declare const sharedArrayBuffer: ReadonlyDeep<SharedArrayBuffer>;
expectTypeOf(sharedArrayBuffer).toBe<SharedArrayBuffer>();

declare const dataView: ReadonlyDeep<DataView>;
expectTypeOf(dataView).toBe<DataView>();

// An intersection's keys are the union of its members' keys, so the walk sees one object with both sets of them rather than one member or the other.
declare const readonlyIntersection: ReadonlyDeep<{a: 1} & {b: 2}>;
expectTypeOf(readonlyIntersection).toBe<{readonly a: 1; readonly b: 2}>();

declare const readonlyIntersectionOptional: ReadonlyDeep<{a?: 1} & {readonly b: 2}>;
expectTypeOf(readonlyIntersectionOptional).toBe<{readonly a?: 1; readonly b: 2}>();

// A member that is a method keeps its `this` parameter. `Parameters` leaves `this` out, so the rebuilt function would otherwise accept any receiver.
declare const methodWithThis: ReadonlyDeep<{m: ((this: Date, a: string) => void) & {count: number}}>;
expectTypeOf<ThisParameterType<(typeof methodWithThis)['m']>>().toBe<Date>();

// A `unique symbol` key is a key like any other, and the walk has to reach it: the key is not a string, so a walk that builds its keys as text would leave it out.
declare const readonlySymbol: ReadonlyDeep<{readonly [key]: {a: number}}>;
expectTypeOf(readonlySymbol).toBe<{readonly [key]: {readonly a: number}}>();

// Optional elements of the same type keep their `?`, rather than collapsing into a rest element.
expectTypeOf<ReadonlyDeep<[string?, string?]>>().toBe<readonly [string?, string?]>();
expectTypeOf<ReadonlyDeep<[number, number?, number?]>>().toBe<readonly [number, number?, number?]>();

// A long tuple does not hit the instantiation depth limit, and tuple labels are kept.
declare const longTuple: ReadonlyDeep<TupleOf<100, {a: 1}>>;
expectTypeOf(longTuple.length).toBe<100>();
expectTypeOf(longTuple[99]).toBe<{readonly a: 1}>();
expectTypeOf<ReadonlyDeep<[a: string, b?: number]>>().toBe<readonly [a: string, b?: number]>();

// A function that declares no `this` is rebuilt without one, rather than with `this: unknown`, which would reject a function that declares a `this`, although the original accepts it.
declare const handlerWithThis: ((this: Date, event: string) => void) & {displayName: string};
expectTypeOf(handlerWithThis).toBeAssignableTo<ReadonlyDeep<((event: string) => void) & {displayName: string}>>();

// A DOM node is a single value, so it is kept as is.
expectTypeOf<ReadonlyDeep<{element: HTMLElement}>>().toBe<{readonly element: HTMLElement}>();
