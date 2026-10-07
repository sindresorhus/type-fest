import {expectType, expectAssignable} from 'tsd';
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
expectType<typeof ClassA>(Constructor);
const instance = new Constructor();
instance.foo = 2; // Constructor is not made readonly

// @ts-expect-error
readonlyData.string = 'bar';
expectType<{readonly foo: string}>(readonlyData.object);
expectType<string>(readonlyData.string);
expectType<number>(readonlyData.number);
expectType<boolean>(readonlyData.boolean);
expectType<symbol>(readonlyData.symbol);
expectType<null>(readonlyData.null);
expectType<undefined>(readonlyData.undefined);
expectType<Date>(readonlyData.date);
expectType<RegExp>(readonlyData.regExp);
expectType<ReadonlyMap<string, string>>(readonlyData.map);
expectType<ReadonlySet<string>>(readonlyData.set);
// A `ReadonlyMap` is already deeply immutable, so the result has to be the built-in itself rather than an anonymous object type that merely happens to be mutually assignable to it. `expectType` above is an identity check and so already catches the difference; the `IsEqual` pair states it directly and, because assignability cannot see it, these are the assertions that would survive a change to a weaker check.
expectType<IsEqual<ReadonlyDeep<Map<string, Date>>, ReadonlyMap<string, Date>>>(true);
expectType<IsEqual<ReadonlyDeep<Set<string>>, ReadonlySet<string>>>(true);
expectType<IsEqual<ReadonlyDeep<ReadonlyMap<string, Date>>, ReadonlyMap<string, Date>>>(true);
expectType<IsEqual<ReadonlyDeep<ReadonlySet<string>>, ReadonlySet<string>>>(true);
// Composing the two in either order has to give the same answer, since each only changes one modifier.
expectType<IsEqual<RequiredDeep<ReadonlyDeep<Map<string, Date>>>, ReadonlyDeep<RequiredDeep<Map<string, Date>>>>>(true);
expectType<IsEqual<RequiredDeep<ReadonlyDeep<ReadonlySet<string>>>, ReadonlyDeep<RequiredDeep<ReadonlySet<string>>>>>(true);
expectType<readonly string[]>(readonlyData.array);
expectType<readonly []>(readonlyData.emptyTuple);
expectType<readonly ['foo']>(readonlyData.singleItemTuple);
expectType<readonly [string, ...number[]]>(readonlyData.trailingSpreadTuple);
expectType<readonly [...string[], number]>(readonlyData.leadingSpreadTuple);
expectType<readonly [{readonly a: string}, {readonly b: number}, {readonly c: string}]>(readonlyData.multiItemTuple);
expectType<ReadonlyMap<string, string>>(readonlyData.readonlyMap);
expectType<ReadonlySet<string>>(readonlyData.readonlySet);
expectType<readonly string[]>(readonlyData.readonlyArray);
expectType<readonly ['foo']>(readonlyData.readonlyTuple);
expectAssignable<ReadonlyJsonValue>(readonlyData.json);
expectAssignable<Opaque<ReadonlyDeep<OpaqueObjectData>, ReadonlyDeep<OpaqueObject[typeof tag]>>>(readonlyData.opaqueObj);

expectType<((foo: number) => string) & _ReadonlyObjectDeep<Namespace>>(readonlyData.namespace);
expectType<string>(readonlyData.namespace(1));
expectType<readonly boolean[]>(readonlyData.namespace.baz);

// These currently aren't readonly due to TypeScript limitations.
// @see https://github.com/microsoft/TypeScript/issues/29732
expectType<NamespaceWithOverload>(readonlyData.namespaceWithOverload);
expectType<string>(readonlyData.namespaceWithOverload(1));
expectType<number>(readonlyData.namespaceWithOverload('foo', 1));
expectType<boolean[]>(readonlyData.namespaceWithOverload.baz);

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
expectType<VoidTypeExpected>(voidType);

// Standalone tests

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const readonlyNamespace = {} as ReadonlyDeep<{
	(foo: number): string;
	baz: boolean[];
}>;
expectType<((foo: number) => string) & {
	readonly baz: readonly boolean[];
}>(readonlyNamespace);
expectAssignable<{
	(foo: number): string;
	readonly baz: readonly boolean[];
}>(readonlyNamespace);

// A function type whose properties are all optional is still made deeply readonly.
declare const readonlyNamespaceWithOptionalProperty: ReadonlyDeep<{p?: number; (foo: number): string}>;
expectType<((foo: number) => string) & {readonly p?: number}>(readonlyNamespaceWithOptionalProperty);
// @ts-expect-error
readonlyNamespaceWithOptionalProperty.p = 1;

// Function and method return types are not transformed, while getters are
// structurally ordinary properties, so their values are.
// See https://github.com/sindresorhus/type-fest/issues/826

declare const readonlyFunctionReturningMap: ReadonlyDeep<() => Map<string, number[]>>;
expectType<() => Map<string, number[]>>(readonlyFunctionReturningMap);

declare const readonlyObjectWithMethod: ReadonlyDeep<{
	method: () => Map<string, number[]>;
}>;
// The method member becomes readonly, but its signature — including the returned Map — is left untouched.
expectType<{
	readonly method: () => Map<string, number[]>;
}>(readonlyObjectWithMethod);

class ClassWithGetter {
	get accessor(): Map<string, number[]> {
		return new Map();
	}
}

// A getter on a class is seen as a plain property of its type, so its value is deep-readonly like any other property.
declare const readonlyClassWithGetter: ReadonlyDeep<ClassWithGetter>;
expectType<ReadonlyMap<string, readonly number[]>>(readonlyClassWithGetter.accessor);

// A tuple whose elements are all optional keeps its optional modifiers, instead of widening into a rest.
declare const optionalTail: ReadonlyDeep<readonly [number, string?]>;
expectType<readonly [number, string?]>(optionalTail);

declare const optionalTailMutable: ReadonlyDeep<[number, string?]>;
expectType<readonly [number, string?]>(optionalTailMutable);

declare const allOptional: ReadonlyDeep<readonly [(number | undefined)?, string?]>;
expectType<readonly [(number | undefined)?, string?]>(allOptional);

// A tuple whose optional element is followed by a rest element stays a tuple, instead of widening into an array.
declare const optionalHeadWithRest: ReadonlyDeep<readonly [number?, ...string[]]>;
expectType<readonly [number?, ...string[]]>(optionalHeadWithRest);

// A `Promise` and its `then` method are not made readonly.
declare const readonlyPromise: ReadonlyDeep<Promise<number>>;
expectType<Promise<number>>(readonlyPromise);

// A `WeakMap` and its methods are not made readonly.
declare const readonlyWeakMap: ReadonlyDeep<WeakMap<{id: number}, number>>;
expectType<WeakMap<{id: number}, number>>(readonlyWeakMap);

// A `WeakSet` and its methods are not made readonly.
declare const readonlyWeakSet: ReadonlyDeep<WeakSet<{id: number}>>;
expectType<WeakSet<{id: number}>>(readonlyWeakSet);

// An abstract class constructor keeps its construct signature, the way a concrete one does.
abstract class AbstractClassA {
	foo = 1;
}

expectType<true>({} as IsEqual<ReadonlyDeep<typeof AbstractClassA>, typeof AbstractClassA>);

// These are a single value rather than a structure to recurse into, so they are kept as is. Mapping over one of them replaces its members, so a `Uint8Array` came back as a plain object of its own methods and was no longer a `Uint8Array` at all.
declare const typedArray: ReadonlyDeep<Uint8Array>;
expectType<Uint8Array>(typedArray);

// A plain object with `name` and `message` is structurally an `Error`, but it is data, so it is still walked.
expectType<{readonly name: string; readonly message: string; readonly tags: readonly string[]}>({} as ReadonlyDeep<{name: string; message: string; tags: string[]}>);

declare const arrayBuffer: ReadonlyDeep<ArrayBuffer>;
expectType<ArrayBuffer>(arrayBuffer);

declare const sharedArrayBuffer: ReadonlyDeep<SharedArrayBuffer>;
expectType<SharedArrayBuffer>(sharedArrayBuffer);

declare const dataView: ReadonlyDeep<DataView>;
expectType<DataView>(dataView);

// An intersection's keys are the union of its members' keys, so the walk sees one object with both sets of them rather than one member or the other.
declare const readonlyIntersection: ReadonlyDeep<{a: 1} & {b: 2}>;
expectType<{readonly a: 1; readonly b: 2}>(readonlyIntersection);

declare const readonlyIntersectionOptional: ReadonlyDeep<{a?: 1} & {readonly b: 2}>;
expectType<{readonly a?: 1; readonly b: 2}>(readonlyIntersectionOptional);

// A member that is a method keeps its `this` parameter. `Parameters` leaves `this` out, so the rebuilt function would otherwise accept any receiver.
declare const methodWithThis: ReadonlyDeep<{m: ((this: Date, a: string) => void) & {count: number}}>;
expectType<Date>({} as ThisParameterType<(typeof methodWithThis)['m']>);

// A `unique symbol` key is a key like any other, and the walk has to reach it: the key is not a string, so a walk that builds its keys as text would leave it out.
declare const readonlySymbol: ReadonlyDeep<{readonly [key]: {a: number}}>;
expectType<{readonly [key]: {readonly a: number}}>(readonlySymbol);

// Optional elements of the same type keep their `?`, rather than collapsing into a rest element.
expectType<readonly [string?, string?]>({} as ReadonlyDeep<[string?, string?]>);
expectType<readonly [number, number?, number?]>({} as ReadonlyDeep<[number, number?, number?]>);

// A long tuple does not hit the instantiation depth limit, and tuple labels are kept.
declare const longTuple: ReadonlyDeep<TupleOf<100, {a: 1}>>;
expectType<100>(longTuple.length);
expectType<{readonly a: 1}>(longTuple[99]);
expectType<readonly [a: string, b?: number]>({} as ReadonlyDeep<[a: string, b?: number]>);

// A function that declares no `this` is rebuilt without one, rather than with `this: unknown`, which would reject a function that declares a `this`, although the original accepts it.
declare const handlerWithThis: ((this: Date, event: string) => void) & {displayName: string};
expectAssignable<ReadonlyDeep<((event: string) => void) & {displayName: string}>>(handlerWithThis);
