import {expectTypeOf} from 'nz';
import type {IsEqual, JsonValue, Opaque, ReadonlyDeep, TupleOf, WritableDeep} from '../index.d.ts';
import type {_WritableObjectDeep} from '../source/writable-deep.d.ts';
import type {tag} from '../source/tagged.d.ts';

declare const key: unique symbol;

type Overloaded = {
	(foo: number): string;
	(foo: string, bar: number): number;
};

type Namespace = {
	(foo: number): string;
	readonly baz: readonly boolean[];
};

type NamespaceWithOverload = Overloaded & {
	readonly baz: readonly boolean[];
};

type OpaqueObjectData = {readonly a: number[]} | {readonly b: string};
type OpaqueObject = Opaque<OpaqueObjectData, {readonly token: unknown}>;

type ReadonlyJsonValue =
	readonly ReadonlyJsonValue[] | number | string | boolean | {readonly [k: string]: ReadonlyJsonValue} | null;

const data = {
	object: {
		foo: 'bar',
	} as const,
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
	tuple: ['foo'] as ['foo'],
	multiItemTuple: [{a: ''}, {b: 1}] as [{a: string}, {b: number}],
	spreadTuple: ['foo'] as [...string[]],
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

let writableData: WritableDeep<typeof readonlyData>;
// @ts-expect-error
writableData = readonlyData; // eslint-disable-line prefer-const

writableData.fn('foo');

writableData.fnWithOverload(1);
writableData.fnWithOverload('', 1);

writableData.string = 'bar';

expectTypeOf(writableData.object).toBe<{foo: 'bar'}>();
expectTypeOf(writableData.string).toBe<string>();
expectTypeOf(writableData.number).toBe<number>();
expectTypeOf(writableData.boolean).toBe<boolean>();
expectTypeOf(writableData.symbol).toBe<symbol>();
expectTypeOf(writableData.null).toBe<null>();
expectTypeOf(writableData.undefined).toBe<undefined>();
expectTypeOf(writableData.date).toBe<Date>();
expectTypeOf(writableData.regExp).toBe<RegExp>();
expectTypeOf(writableData.map).toBe<Map<string, string>>();
expectTypeOf(writableData.set).toBe<Set<string>>();
expectTypeOf(writableData.array).toBe<string[]>();
expectTypeOf(writableData.emptyTuple).toBe<[]>();
expectTypeOf(writableData.tuple).toBe<['foo']>();
expectTypeOf(writableData.multiItemTuple).toBe<[{a: string}, {b: number}]>();
expectTypeOf(writableData.spreadTuple).toBe<[...string[]]>();
expectTypeOf(writableData.trailingSpreadTuple).toBe<[string, ...number[]]>();
expectTypeOf(writableData.leadingSpreadTuple).toBe<[...string[], number]>();
expectTypeOf(writableData.readonlyMap).toBe<Map<string, string>>();
expectTypeOf(writableData.readonlySet).toBe<Set<string>>();
expectTypeOf(writableData.readonlyArray).toBe<string[]>();
expectTypeOf(writableData.readonlyTuple).toBe<['foo']>();
expectTypeOf(writableData.json).toBeAssignableTo<ReadonlyJsonValue>();
expectTypeOf(writableData.opaqueObj).toBeAssignableTo<Opaque<WritableDeep<OpaqueObjectData>, WritableDeep<OpaqueObject[typeof tag]>>>();

expectTypeOf(writableData.namespace).toBe<((foo: number) => string) & _WritableObjectDeep<Namespace>>();
expectTypeOf(writableData.namespace(1)).toBe<string>();
expectTypeOf(writableData.namespace.baz).toBe<boolean[]>();

// These currently aren't writable due to TypeScript limitations.
// @see https://github.com/microsoft/TypeScript/issues/29732
expectTypeOf(writableData.namespaceWithOverload).toBe<NamespaceWithOverload>();
expectTypeOf(writableData.namespaceWithOverload(1)).toBe<string>();
expectTypeOf(writableData.namespaceWithOverload('foo', 1)).toBe<number>();
expectTypeOf(writableData.namespaceWithOverload.baz).toBe<readonly boolean[]>();

// Test that WritableDeep is the inverse of ReadonlyDeep.
const fullyWritableData = {
	array: ['a', 'b'],
	map: new Map<string, number>(),
	set: new Set<string>(),
	object: {
		date: new Date(),
		boolean: true,
	},
};
expectTypeOf(fullyWritableData).toBeAssignableTo<WritableDeep<ReadonlyDeep<typeof fullyWritableData>>>();

// Standalone tests

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const writableNamespace = {} as WritableDeep<{
	(foo: number): string;
	readonly baz: readonly boolean[];
}>;
expectTypeOf(writableNamespace).toBe<((foo: number) => string) & {
	baz: boolean[];
}>();
expectTypeOf(writableNamespace).toBeAssignableTo<{
	(foo: number): string;
	baz: boolean[];
}>();

// A tuple whose elements are all optional keeps its optional modifiers, instead of widening into a rest.
declare const optionalTail: WritableDeep<[number, string?]>;
expectTypeOf(optionalTail).toBe<[number, string?]>();

declare const optionalTailReadonly: WritableDeep<readonly [number, string?]>;
expectTypeOf(optionalTailReadonly).toBe<[number, string?]>();

declare const allOptional: WritableDeep<[(number | undefined)?, string?]>;
expectTypeOf(allOptional).toBe<[(number | undefined)?, string?]>();

// Class constructors are kept as is, the same way `ReadonlyDeep` keeps them.
class Awesome {
	name!: string;
	successes!: number;

	run(): void {
		// Empty
	}
}

expectTypeOf<WritableDeep<typeof Awesome>>().toBe<typeof Awesome>();
expectTypeOf<WritableDeep<typeof Date>>().toBe<typeof Date>();

// Class instances are still made deeply writable.
expectTypeOf<WritableDeep<Awesome>>().toBe<{name: string; successes: number; run: () => void}>();

// A tuple whose optional element is followed by a rest element stays a tuple, instead of widening into an array.
declare const optionalHeadWithRest: WritableDeep<[number?, ...string[]]>;
expectTypeOf(optionalHeadWithRest).toBe<[number?, ...string[]]>();

// `Promise` and its `then` method are not rebuilt, unlike `Map` and `Set`.
declare const writablePromise: WritableDeep<Promise<{a: number}>>;
expectTypeOf(writablePromise).toBe<Promise<{a: number}>>();

// A `WeakMap` and its methods are not rebuilt.
declare const writableWeakMap: WritableDeep<WeakMap<{a: number}, number>>;
expectTypeOf(writableWeakMap).toBe<WeakMap<{a: number}, number>>();

// A `WeakSet` and its methods are not rebuilt.
declare const writableWeakSet: WritableDeep<WeakSet<{a: number}>>;
expectTypeOf(writableWeakSet).toBe<WeakSet<{a: number}>>();

// An abstract class has an `abstract new` signature, so it must be kept as is just like a concrete class constructor.
abstract class AbstractClassForTest {
	foo = 1;
}

expectTypeOf<IsEqual<WritableDeep<typeof AbstractClassForTest>, typeof AbstractClassForTest>>().toBe<true>();

// These are a single value rather than a structure to recurse into, so they are kept as is. Mapping over one of them strips the `readonly` off members that have to stay readonly, so a `Uint8Array` came back as a plain object rather than a `Uint8Array`.
declare const typedArray: WritableDeep<Uint8Array>;
expectTypeOf(typedArray).toBe<Uint8Array>();

declare const arrayBuffer: WritableDeep<ArrayBuffer>;
expectTypeOf(arrayBuffer).toBe<ArrayBuffer>();

declare const sharedArrayBuffer: WritableDeep<SharedArrayBuffer>;
expectTypeOf(sharedArrayBuffer).toBe<SharedArrayBuffer>();

declare const dataView: WritableDeep<DataView>;
expectTypeOf(dataView).toBe<DataView>();

// A callable type whose properties are all optional is still walked. The guard for "a function with no properties" was `{}` being assignable to the walked type, which is true whenever every own property is optional, so the `readonly` on the nested member survived the one type whose job is removing it.
declare const callableWithAnOptionalProperty: WritableDeep<{(): void; p?: {readonly a: string}}>;
expectTypeOf(callableWithAnOptionalProperty).toBe<(() => void) & {p?: {a: string}}>();

// A member that is a method keeps its `this` parameter. `Parameters` leaves `this` out, so the rebuilt function would otherwise accept any receiver.
declare const methodWithThis: WritableDeep<{m: ((this: Date, a: string) => void) & {count: number}}>;
expectTypeOf<ThisParameterType<(typeof methodWithThis)['m']>>().toBe<Date>();

// A `unique symbol` key is a key like any other, and the walk has to reach it: the key is not a string, so a walk that builds its keys as text would leave it out.
declare const writableSymbol: WritableDeep<{readonly [key]: {readonly a: number}}>;
expectTypeOf(writableSymbol).toBe<{[key]: {a: number}}>();

// Optional elements of the same type keep their `?`, rather than collapsing into a rest element.
expectTypeOf<WritableDeep<readonly [string?, string?]>>().toBe<[string?, string?]>();
expectTypeOf<WritableDeep<readonly [number, number?, number?]>>().toBe<[number, number?, number?]>();

// A long tuple is mapped without one recursive instantiation per element, and its labels and optional modifiers survive.
declare const longTuple: WritableDeep<Readonly<TupleOf<100, {readonly value: number}>>>;
expectTypeOf(longTuple.length).toBe<100>();
expectTypeOf(longTuple[99]).toBe<{value: number}>();
expectTypeOf<WritableDeep<readonly [value: {readonly name: string}, count?: number]>>().toBe<[value: {name: string}, count?: number]>();

// A function that declares no `this` is rebuilt without one, rather than with `this: unknown`, which would reject a function that declares a `this`, although the original accepts it.
declare const handlerWithThis: ((this: Date, event: string) => void) & {displayName: string};
expectTypeOf(handlerWithThis).toBeAssignableTo<WritableDeep<((event: string) => void) & {displayName: string}>>();
