import {expectType, expectError, expectAssignable} from 'tsd';
import type {ReadonlyDeep, Writable, WritableDeep} from '../index';
import type {WritableObjectDeep} from '../source/writable-deep';

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
	tuple: ['foo'] as ['foo'],
	readonlyMap: new Map<string, string>() as ReadonlyMap<string, string>,
	readonlySet: new Set<string>() as ReadonlySet<string>,
	readonlyArray: ['foo'] as readonly string[],
	readonlyTuple: ['foo'] as const,
};

const readonlyData: Readonly<typeof data> = data;

let writableData: WritableDeep<typeof readonlyData>;
expectError(writableData = readonlyData);

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
expectType<Writable<Map<string, string>>>(writableData.map);
expectType<Writable<Set<string>>>(writableData.set);
expectType<string[]>(writableData.array);
expectType<['foo']>(writableData.tuple);
expectType<Writable<Map<string, string>>>(writableData.readonlyMap);
expectType<Writable<Set<string>>>(writableData.readonlySet);
expectType<string[]>(writableData.readonlyArray);
expectType<['foo']>(writableData.readonlyTuple);

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
