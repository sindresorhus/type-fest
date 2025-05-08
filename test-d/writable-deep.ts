import {expectType, expectAssignable} from 'tsd';
import type {JsonValue, Opaque, ReadonlyDeep, WritableDeep} from '../index.d.ts';
import type {WritableObjectDeep} from '../source/writable-deep.d.ts';
import type {tag} from '../source/tagged.d.ts';

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
  | {readonly [k: string]: ReadonlyJsonValue}
  | readonly ReadonlyJsonValue[]
  | number
  | string
  | boolean
  | null;

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

expectType<((foo: number) => string) & WritableObjectDeep<Namespace>>(writableData.namespace);
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
