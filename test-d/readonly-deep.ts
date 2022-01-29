import {expectType, expectError} from 'tsd';
import {ReadonlyDeep} from '../index';
import {ReadonlyObjectDeep} from '../source/readonly-deep';

type Overloaded = {
	(foo: number): string;
	(foo: string, bar: number): number;
};

type Namespace = Overloaded & {
	baz: boolean[];
};

const namespace = (() => 1) as unknown as Namespace;
namespace.baz = [true];

const data = {
	object: {
		foo: 'bar',
	},
	fn: (_: string) => true,
	fnWithOverload: ((_: number) => 'foo') as Overloaded,
	namespace,
	string: 'foo',
	number: 1,
	boolean: false,
	symbol: Symbol('test'),
	date: new Date(),
	regExp: new RegExp(/.*/),
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

expectType<((foo: string, bar: number) => number) & ReadonlyObjectDeep<Namespace>>(readonlyData.namespace);
expectType<number>(readonlyData.namespace('foo', 1));
expectType<readonly boolean[]>(readonlyData.namespace.baz);

// Currently on last call signature works.
// expectType<string>(readonlyData.namespace(1));
