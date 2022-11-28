import {expectType, expectError} from 'tsd';
import type {ReadonlyDeep} from '../index';
import type {ReadonlyObjectDeep} from '../source/readonly-deep';

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

const data = {
	object: {
		foo: 'bar',
	},
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

const readonlyData: ReadonlyDeep<typeof data> = data;

readonlyData.fn('foo');

readonlyData.fnWithOverload(1);
readonlyData.fnWithOverload('', 1);

expectError(readonlyData.string = 'bar');
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
expectType<readonly ['foo']>(readonlyData.tuple);
expectType<Readonly<ReadonlyMap<string, string>>>(readonlyData.readonlyMap);
expectType<Readonly<ReadonlySet<string>>>(readonlyData.readonlySet);
expectType<readonly string[]>(readonlyData.readonlyArray);
expectType<readonly ['foo']>(readonlyData.readonlyTuple);

expectType<((foo: number) => string) & ReadonlyObjectDeep<Namespace>>(readonlyData.namespace);
expectType<string>(readonlyData.namespace(1));
expectType<readonly boolean[]>(readonlyData.namespace.baz);

// These currently aren't readonly due to TypeScript limitations.
// @see https://github.com/microsoft/TypeScript/issues/29732
expectType<NamespaceWithOverload>(readonlyData.namespaceWithOverload);
expectType<string>(readonlyData.namespaceWithOverload(1));
expectType<number>(readonlyData.namespaceWithOverload('foo', 1));
expectType<boolean[]>(readonlyData.namespaceWithOverload.baz);
