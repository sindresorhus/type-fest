import {expectTypeOf} from 'nz';
import type {Opaque, tag} from '../source/tagged.d.ts';
import type {ReadonlyDeep, _ReadonlyObjectDeep} from '../source/readonly-deep.d.ts';
import type {WritableDeep} from '../source/writable-deep.d.ts';
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
expectTypeOf(readonlyData.map).toBe<Readonly<ReadonlyMap<string, string>>>();
expectTypeOf(readonlyData.set).toBe<Readonly<ReadonlySet<string>>>();
expectTypeOf(readonlyData.array).toBe<readonly string[]>();
expectTypeOf(readonlyData.emptyTuple).toBe<readonly []>();
expectTypeOf(readonlyData.singleItemTuple).toBe<readonly ['foo']>();
expectTypeOf(readonlyData.trailingSpreadTuple).toBe<readonly [string, ...number[]]>();
expectTypeOf(readonlyData.leadingSpreadTuple).toBe<readonly [...string[], number]>();
expectTypeOf(readonlyData.multiItemTuple).toBe<readonly [{readonly a: string}, {readonly b: number}, {readonly c: string}]>();
expectTypeOf(readonlyData.readonlyMap).toBe<Readonly<ReadonlyMap<string, string>>>();
expectTypeOf(readonlyData.readonlySet).toBe<Readonly<ReadonlySet<string>>>();
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
expectTypeOf(readonlyClassWithGetter.accessor).toBe<Readonly<ReadonlyMap<string, readonly number[]>>>();

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

// The top types and `never` are kept as is.
expectTypeOf<ReadonlyDeep<any>>().toBe<any>();
expectTypeOf<ReadonlyDeep<unknown>>().toBe<unknown>();
expectTypeOf<ReadonlyDeep<never>>().toBe<never>();

// A `Map` is wrapped in `Readonly`, so its methods cannot be reassigned either. See https://github.com/sindresorhus/type-fest/issues/357
declare const readonlyMap: ReadonlyDeep<Map<string, number[]>>;
declare const otherMap: typeof readonlyMap;
expectTypeOf(readonlyMap).toBe<Readonly<ReadonlyMap<string, readonly number[]>>>();

// Each method is assigned the same method of another value of the same type, so the only possible error is that it is readonly.
// @ts-expect-error
readonlyMap.get = otherMap.get;
// @ts-expect-error
readonlyMap.has = otherMap.has;
// @ts-expect-error
readonlyMap.forEach = otherMap.forEach;
// @ts-expect-error
readonlyMap.entries = otherMap.entries;
// @ts-expect-error
readonlyMap[Symbol.iterator] = otherMap[Symbol.iterator];

// The methods that change the map are left out.
expectTypeOf<Extract<keyof typeof readonlyMap, 'set' | 'delete' | 'clear'>>().toBe<never>();

// The map can still be read, and the values it gives are deeply readonly.
expectTypeOf(readonlyMap.get('a')).toBe<readonly number[] | undefined>();
expectTypeOf(readonlyMap.keys()).toBe<MapIterator<string>>();
expectTypeOf(readonlyMap.values()).toBe<MapIterator<readonly number[]>>();
expectTypeOf([...readonlyMap]).toBe<Array<[string, readonly number[]]>>();
expectTypeOf(new Map(readonlyMap)).toBe<Map<string, readonly number[]>>();
readonlyMap.forEach(value => {
	expectTypeOf(value).toBe<readonly number[]>();
});

// The wrapper does not change what the map can be assigned to or from, so it can be passed to anything that accepts a `ReadonlyMap`, and a `Map` can be passed where the readonly version is expected.
expectTypeOf(readonlyMap).toBeAssignableTo<ReadonlyMap<string, readonly number[]>>();
expectTypeOf(readonlyMap).toBeAssignableTo<Iterable<readonly [string, readonly number[]]>>();
expectTypeOf<ReadonlyMap<string, readonly number[]>>().toBeAssignableTo<ReadonlyDeep<Map<string, number[]>>>();
expectTypeOf<Map<string, number[]>>().toBeAssignableTo<ReadonlyDeep<Map<string, number[]>>>();
expectTypeOf(readonlyMap).not.toBeAssignableTo<Map<string, readonly number[]>>();
expectTypeOf(readonlyMap).not.toBeAssignableTo<ReadonlyMap<string, number[]>>();

// A `Set` is wrapped in `Readonly` for the same reason.
declare const readonlySet: ReadonlyDeep<Set<{a: number[]}>>;
declare const otherSet: typeof readonlySet;
expectTypeOf(readonlySet).toBe<Readonly<ReadonlySet<{readonly a: readonly number[]}>>>();

// @ts-expect-error
readonlySet.has = otherSet.has;
// @ts-expect-error
readonlySet.forEach = otherSet.forEach;
// @ts-expect-error
readonlySet.values = otherSet.values;
// @ts-expect-error
readonlySet[Symbol.iterator] = otherSet[Symbol.iterator];

// The methods that change the set are left out.
expectTypeOf<Extract<keyof typeof readonlySet, 'add' | 'delete' | 'clear'>>().toBe<never>();

// The set can still be read, and the items it gives are deeply readonly.
for (const item of readonlySet) {
	expectTypeOf(item).toBe<{readonly a: readonly number[]}>();
}

expectTypeOf(readonlySet).toBeAssignableTo<ReadonlySet<{readonly a: readonly number[]}>>();
expectTypeOf<ReadonlySet<{readonly a: readonly number[]}>>().toBeAssignableTo<ReadonlyDeep<Set<{a: number[]}>>>();
expectTypeOf<Set<{a: number[]}>>().toBeAssignableTo<ReadonlyDeep<Set<{a: number[]}>>>();
expectTypeOf(readonlySet).not.toBeAssignableTo<Set<{readonly a: readonly number[]}>>();
expectTypeOf(readonlySet).not.toBeAssignableTo<ReadonlySet<{a: number[]}>>();

// A `ReadonlyMap` or `ReadonlySet` input gets the same result as a `Map` or `Set`, and applying the type again changes nothing.
expectTypeOf<IsEqual<ReadonlyDeep<ReadonlyMap<string, number[]>>, ReadonlyDeep<Map<string, number[]>>>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<Readonly<ReadonlyMap<string, number[]>>>, ReadonlyDeep<Map<string, number[]>>>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<ReadonlyDeep<Map<string, number[]>>>, ReadonlyDeep<Map<string, number[]>>>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<ReadonlySet<number[]>>, ReadonlyDeep<Set<number[]>>>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<Readonly<ReadonlySet<number[]>>>, ReadonlyDeep<Set<number[]>>>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<ReadonlyDeep<Set<number[]>>>, ReadonlyDeep<Set<number[]>>>>().toBe<true>();

// `WritableDeep` gives back the original map or set.
expectTypeOf<WritableDeep<ReadonlyDeep<Map<string, number[]>>>>().toBe<Map<string, number[]>>();
expectTypeOf<WritableDeep<ReadonlyDeep<Set<string[]>>>>().toBe<Set<string[]>>();

// The keys are made deeply readonly, the same as the values.
expectTypeOf<ReadonlyDeep<Map<{id: string[]}, Set<number[]>>>>().toBe<Readonly<ReadonlyMap<{readonly id: readonly string[]}, Readonly<ReadonlySet<readonly number[]>>>>>();
expectTypeOf<ReadonlyDeep<Map<[number, number], string>>>().toBe<Readonly<ReadonlyMap<readonly [number, number], string>>>();

// A nested map or set has readonly methods too.
expectTypeOf<ReadonlyDeep<Map<string, Map<string, Set<string>>>>>().toBe<Readonly<ReadonlyMap<string, Readonly<ReadonlyMap<string, Readonly<ReadonlySet<string>>>>>>>();
declare const nestedMap: ReadonlyDeep<Map<string, Map<string, number>>>;
declare const otherInnerMap: NonNullable<ReturnType<typeof nestedMap.get>>;
const innerMap = nestedMap.get('a');
if (innerMap) {
	// @ts-expect-error
	innerMap.get = otherInnerMap.get;
}

// A recursive map is made readonly at every level.
type Tree = Map<string, Tree>;
declare const tree: ReadonlyDeep<Tree>;
expectTypeOf(tree.get('a')).toBe<ReadonlyDeep<Tree> | undefined>();
const subtree = tree.get('a');
if (subtree) {
	// @ts-expect-error
	subtree.get = tree.get;
}

// A `Readonly<Map>` still has the methods that change the map, as readonly members, so it is turned into the readonly built-in like a `Map`.
expectTypeOf<ReadonlyDeep<Readonly<Map<string, number[]>>>>().toBe<Readonly<ReadonlyMap<string, readonly number[]>>>();
expectTypeOf<ReadonlyDeep<Readonly<Set<number[]>>>>().toBe<Readonly<ReadonlySet<readonly number[]>>>();

// A map or set as the value of an index signature.
expectTypeOf<ReadonlyDeep<{[key: string]: Map<string, number[]>}>>().toBe<{readonly [key: string]: Readonly<ReadonlyMap<string, readonly number[]>>}>();
expectTypeOf<ReadonlyDeep<Record<string, Set<number[]>>>>().toBe<{readonly [x: string]: Readonly<ReadonlySet<readonly number[]>>}>();

// Optional and union values.
expectTypeOf<ReadonlyDeep<Map<string, number[] | undefined>>>().toBe<Readonly<ReadonlyMap<string, readonly number[] | undefined>>>();
expectTypeOf<ReadonlyDeep<Map<string, {a?: number[]}>>>().toBe<Readonly<ReadonlyMap<string, {readonly a?: readonly number[]}>>>();
expectTypeOf<ReadonlyDeep<Map<string, Map<string, number> | string[]>>>().toBe<Readonly<ReadonlyMap<string, Readonly<ReadonlyMap<string, number>> | readonly string[]>>>();
expectTypeOf<ReadonlyDeep<{map?: Map<string, number> | undefined}>>().toBe<{readonly map?: Readonly<ReadonlyMap<string, number>> | undefined}>();
expectTypeOf<ReadonlyDeep<Map<string, number> | {a: number[]}>>().toBe<Readonly<ReadonlyMap<string, number>> | {readonly a: readonly number[]}>();

// A map or set inside an array, a tuple, or an optional property is wrapped too.
expectTypeOf<ReadonlyDeep<Array<Map<string, number>>>>().toBe<ReadonlyArray<Readonly<ReadonlyMap<string, number>>>>();
expectTypeOf<ReadonlyDeep<[Map<string, number>, Set<string>]>>().toBe<readonly [Readonly<ReadonlyMap<string, number>>, Readonly<ReadonlySet<string>>]>();
expectTypeOf<ReadonlyDeep<{map?: Map<string, number>; set?: Set<string>}>>().toBe<{readonly map?: Readonly<ReadonlyMap<string, number>>; readonly set?: Readonly<ReadonlySet<string>>}>();
expectTypeOf<ReadonlyDeep<Map<string, [number, string[]]>>>().toBe<Readonly<ReadonlyMap<string, readonly [number, readonly string[]]>>>();

// A union of maps and sets is transformed member by member.
expectTypeOf<ReadonlyDeep<Map<string, number> | Set<string> | undefined>>().toBe<Readonly<ReadonlyMap<string, number>> | Readonly<ReadonlySet<string>> | undefined>();

// The values that are kept as is elsewhere are kept as is inside a map or set too.
expectTypeOf<ReadonlyDeep<Map<string, Date>>>().toBe<Readonly<ReadonlyMap<string, Date>>>();
expectTypeOf<ReadonlyDeep<Map<string, () => number[]>>>().toBe<Readonly<ReadonlyMap<string, () => number[]>>>();
expectTypeOf<ReadonlyDeep<Set<WeakMap<{id: number}, number[]>>>>().toBe<Readonly<ReadonlySet<WeakMap<{id: number}, number[]>>>>();

// The top types and `never` as keys, values, or items.
expectTypeOf<ReadonlyDeep<Map<any, any>>>().toBe<Readonly<ReadonlyMap<any, any>>>();
expectTypeOf<ReadonlyDeep<Map<unknown, unknown>>>().toBe<Readonly<ReadonlyMap<unknown, unknown>>>();
expectTypeOf<ReadonlyDeep<Map<never, never>>>().toBe<Readonly<ReadonlyMap<never, never>>>();
expectTypeOf<ReadonlyDeep<Set<any>>>().toBe<Readonly<ReadonlySet<any>>>();
expectTypeOf<ReadonlyDeep<Set<unknown>>>().toBe<Readonly<ReadonlySet<unknown>>>();
expectTypeOf<ReadonlyDeep<Set<never>>>().toBe<Readonly<ReadonlySet<never>>>();

// A subclass of `Map` or `Set` becomes the readonly built-in, so the members that the subclass adds are not kept.
class CountingMap extends Map<string, number[]> {
	hits = 0;
}

class CountingSet extends Set<string[]> {
	hits = 0;
}

expectTypeOf<ReadonlyDeep<CountingMap>>().toBe<Readonly<ReadonlyMap<string, readonly number[]>>>();
expectTypeOf<ReadonlyDeep<CountingSet>>().toBe<Readonly<ReadonlySet<readonly string[]>>>();

// The same is true for a map that is intersected with an object.
expectTypeOf<ReadonlyDeep<Map<string, number> & {extra: string[]}>>().toBe<Readonly<ReadonlyMap<string, number>>>();

// A map whose values are generic is still made readonly. Plain assignments are used, because the assertions cannot check a type that is still generic.
function readonlyMapWithGenericValue<Value>(map: ReadonlyDeep<Map<string, Value>>, otherMapWithGenericValue: ReadonlyDeep<Map<string, Value>>) {
	expectTypeOf(map.get('a')).toBe<ReadonlyDeep<Value> | undefined>();
	const readable: ReadonlyMap<string, ReadonlyDeep<Value>> = map;
	// @ts-expect-error
	map.get = otherMapWithGenericValue.get;
	return readable;
}

function readonlyGenericMap<MapType extends Map<string, number[]>>(map: ReadonlyDeep<MapType>, otherGenericMap: ReadonlyDeep<MapType>) {
	expectTypeOf(map.get('a')).toBe<readonly number[] | undefined>();
	const readable: ReadonlyMap<string, readonly number[]> = map;
	// @ts-expect-error
	const mutable: Map<string, number[]> = map;
	// @ts-expect-error
	map.get = otherGenericMap.get;
	return [readable, mutable];
}

// The methods of a plain object are made readonly, the same as its other members.
declare const readonlyObjectWithMethodSyntax: ReadonlyDeep<{method(): number[]}>;
expectTypeOf(readonlyObjectWithMethodSyntax).toBe<{readonly method: () => number[]}>();
// @ts-expect-error
readonlyObjectWithMethodSyntax.method = () => [];

// The methods of an array can still be reassigned, because TypeScript treats `Readonly<ReadonlyArray<T>>` the same as `ReadonlyArray<T>`. The methods that change the array are left out.
declare const readonlyArray: ReadonlyDeep<string[][]>;
expectTypeOf(readonlyArray).toBe<ReadonlyArray<readonly string[]>>();
readonlyArray.join = () => '';
expectTypeOf<Extract<keyof typeof readonlyArray, 'push' | 'pop' | 'splice'>>().toBe<never>();
// @ts-expect-error
readonlyArray[0] = [];
