import {expectType, expectAssignable} from 'tsd';
import type {Opaque, tag} from '../source/tagged.d.ts';
import type {ReadonlyDeep, ReadonlyObjectDeep} from '../source/readonly-deep.d.ts';
import type {JsonValue} from '../source/basic.d.ts';

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
  | {readonly [k: string]: ReadonlyJsonValue}
  | readonly ReadonlyJsonValue[]
  | number
  | string
  | boolean
  | null;

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

expectType<typeof ClassA>(readonlyData.constructor);
const instance = new readonlyData.constructor();
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
expectType<Readonly<ReadonlyMap<string, string>>>(readonlyData.map);
expectType<Readonly<ReadonlySet<string>>>(readonlyData.set);
expectType<readonly string[]>(readonlyData.array);
expectType<readonly []>(readonlyData.emptyTuple);
expectType<readonly ['foo']>(readonlyData.singleItemTuple);
expectType<readonly [string, ...number[]]>(readonlyData.trailingSpreadTuple);
expectType<readonly [...string[], number]>(readonlyData.leadingSpreadTuple);
expectType<readonly [{readonly a: string}, {readonly b: number}, {readonly c: string}]>(readonlyData.multiItemTuple);
expectType<Readonly<ReadonlyMap<string, string>>>(readonlyData.readonlyMap);
expectType<Readonly<ReadonlySet<string>>>(readonlyData.readonlySet);
expectType<readonly string[]>(readonlyData.readonlyArray);
expectType<readonly ['foo']>(readonlyData.readonlyTuple);
expectAssignable<ReadonlyJsonValue>(readonlyData.json);
expectAssignable<Opaque<ReadonlyDeep<OpaqueObjectData>, ReadonlyDeep<OpaqueObject[typeof tag]>>>(readonlyData.opaqueObj);

expectType<((foo: number) => string) & ReadonlyObjectDeep<Namespace>>(readonlyData.namespace);
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
