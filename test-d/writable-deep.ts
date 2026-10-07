import {expectType, expectAssignable} from 'tsd';
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

expectType<{foo: 'bar'}>(writableData.object);
expectType<string>(writableData.string);
expectType<number>(writableData.number);
expectType<boolean>(writableData.boolean);
expectType<symbol>(writableData.symbol);
expectType<null>(writableData.null);
expectType<undefined>(writableData.undefined);
expectType<Date>(writableData.date);
expectType<RegExp>(writableData.regExp);
expectType<Map<string, string>>(writableData.map);
expectType<Set<string>>(writableData.set);
expectType<string[]>(writableData.array);
expectType<[]>(writableData.emptyTuple);
expectType<['foo']>(writableData.tuple);
expectType<[{a: string}, {b: number}]>(writableData.multiItemTuple);
expectType<[...string[]]>(writableData.spreadTuple);
expectType<[string, ...number[]]>(writableData.trailingSpreadTuple);
expectType<[...string[], number]>(writableData.leadingSpreadTuple);
expectType<Map<string, string>>(writableData.readonlyMap);
expectType<Set<string>>(writableData.readonlySet);
expectType<string[]>(writableData.readonlyArray);
expectType<['foo']>(writableData.readonlyTuple);
expectAssignable<ReadonlyJsonValue>(writableData.json);
expectAssignable<Opaque<WritableDeep<OpaqueObjectData>, WritableDeep<OpaqueObject[typeof tag]>>>(writableData.opaqueObj);

expectType<((foo: number) => string) & _WritableObjectDeep<Namespace>>(writableData.namespace);
expectType<string>(writableData.namespace(1));
expectType<boolean[]>(writableData.namespace.baz);

// These currently aren't writable due to TypeScript limitations.
// @see https://github.com/microsoft/TypeScript/issues/29732
expectType<NamespaceWithOverload>(writableData.namespaceWithOverload);
expectType<string>(writableData.namespaceWithOverload(1));
expectType<number>(writableData.namespaceWithOverload('foo', 1));
expectType<readonly boolean[]>(writableData.namespaceWithOverload.baz);

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
expectAssignable<WritableDeep<ReadonlyDeep<typeof fullyWritableData>>>(fullyWritableData);

// Standalone tests

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const writableNamespace = {} as WritableDeep<{
	(foo: number): string;
	readonly baz: readonly boolean[];
}>;
expectType<((foo: number) => string) & {
	baz: boolean[];
}>(writableNamespace);
expectAssignable<{
	(foo: number): string;
	baz: boolean[];
}>(writableNamespace);

// A tuple whose elements are all optional keeps its optional modifiers, instead of widening into a rest.
declare const optionalTail: WritableDeep<[number, string?]>;
expectType<[number, string?]>(optionalTail);

declare const optionalTailReadonly: WritableDeep<readonly [number, string?]>;
expectType<[number, string?]>(optionalTailReadonly);

declare const allOptional: WritableDeep<[(number | undefined)?, string?]>;
expectType<[(number | undefined)?, string?]>(allOptional);

// Class constructors are kept as is, the same way `ReadonlyDeep` keeps them.
class Awesome {
	name!: string;
	successes!: number;

	run(): void {
		// Empty
	}
}

expectType<typeof Awesome>({} as WritableDeep<typeof Awesome>);
expectType<typeof Date>({} as WritableDeep<typeof Date>);

// Class instances are still made deeply writable.
expectType<{name: string; successes: number; run: () => void}>({} as WritableDeep<Awesome>);

// A tuple whose optional element is followed by a rest element stays a tuple, instead of widening into an array.
declare const optionalHeadWithRest: WritableDeep<[number?, ...string[]]>;
expectType<[number?, ...string[]]>(optionalHeadWithRest);

// `Promise` and its `then` method are not rebuilt, unlike `Map` and `Set`.
declare const writablePromise: WritableDeep<Promise<{a: number}>>;
expectType<Promise<{a: number}>>(writablePromise);

// A `WeakMap` and its methods are not rebuilt.
declare const writableWeakMap: WritableDeep<WeakMap<{a: number}, number>>;
expectType<WeakMap<{a: number}, number>>(writableWeakMap);

// A `WeakSet` and its methods are not rebuilt.
declare const writableWeakSet: WritableDeep<WeakSet<{a: number}>>;
expectType<WeakSet<{a: number}>>(writableWeakSet);

// An abstract class has an `abstract new` signature, so it must be kept as is just like a concrete class constructor.
abstract class AbstractClassForTest {
	foo = 1;
}

expectType<true>({} as IsEqual<WritableDeep<typeof AbstractClassForTest>, typeof AbstractClassForTest>);

// These are a single value rather than a structure to recurse into, so they are kept as is. Mapping over one of them strips the `readonly` off members that have to stay readonly, so a `Uint8Array` came back as a plain object rather than a `Uint8Array`.
declare const typedArray: WritableDeep<Uint8Array>;
expectType<Uint8Array>(typedArray);

declare const arrayBuffer: WritableDeep<ArrayBuffer>;
expectType<ArrayBuffer>(arrayBuffer);

declare const sharedArrayBuffer: WritableDeep<SharedArrayBuffer>;
expectType<SharedArrayBuffer>(sharedArrayBuffer);

declare const dataView: WritableDeep<DataView>;
expectType<DataView>(dataView);

// A callable type whose properties are all optional is still walked. The guard for "a function with no properties" was `{}` being assignable to the walked type, which is true whenever every own property is optional, so the `readonly` on the nested member survived the one type whose job is removing it.
declare const callableWithAnOptionalProperty: WritableDeep<{(): void; p?: {readonly a: string}}>;
expectType<(() => void) & {p?: {a: string}}>(callableWithAnOptionalProperty);

// A member that is a method keeps its `this` parameter. `Parameters` leaves `this` out, so the rebuilt function would otherwise accept any receiver.
declare const methodWithThis: WritableDeep<{m: ((this: Date, a: string) => void) & {count: number}}>;
expectType<Date>({} as ThisParameterType<(typeof methodWithThis)['m']>);

// A `unique symbol` key is a key like any other, and the walk has to reach it: the key is not a string, so a walk that builds its keys as text would leave it out.
declare const writableSymbol: WritableDeep<{readonly [key]: {readonly a: number}}>;
expectType<{[key]: {a: number}}>(writableSymbol);

// Optional elements of the same type keep their `?`, rather than collapsing into a rest element.
expectType<[string?, string?]>({} as WritableDeep<readonly [string?, string?]>);
expectType<[number, number?, number?]>({} as WritableDeep<readonly [number, number?, number?]>);

// A long tuple is mapped without one recursive instantiation per element, and its labels and optional modifiers survive.
declare const longTuple: WritableDeep<Readonly<TupleOf<100, {readonly value: number}>>>;
expectType<100>(longTuple.length);
expectType<{value: number}>(longTuple[99]);
expectType<[value: {name: string}, count?: number]>({} as WritableDeep<readonly [value: {readonly name: string}, count?: number]>);

// A function that declares no `this` is rebuilt without one, rather than with `this: unknown`, which would reject a function that declares a `this`, although the original accepts it.
declare const handlerWithThis: ((this: Date, event: string) => void) & {displayName: string};
expectAssignable<WritableDeep<((event: string) => void) & {displayName: string}>>(handlerWithThis);
