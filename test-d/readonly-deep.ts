import {expectType, expectError} from 'tsd';
import {ReadonlyDeep} from '../source/readonly-deep';

const data = {
	object: {
		foo: 'bar'
	},
	fn: (_: string) => true,
	string: 'foo',
	number: 1,
	boolean: false,
	symbol: Symbol('test'),
	null: null,
	undefined: undefined, // eslint-disable-line object-shorthand
	map: new Map<string, string>(),
	set: new Set<string>(),
	array: ['foo'],
	tuple: ['foo'] as ['foo'],
	readonlyMap: new Map<string, string>() as ReadonlyMap<string, string>,
	readonlySet: new Set<string>() as ReadonlySet<string>,
	readonlyArray: ['foo'] as readonly string[],
	readonlyTuple: ['foo'] as const
};

const readonlyData: ReadonlyDeep<typeof data> = data;

readonlyData.fn('foo');

expectError(readonlyData.string = 'bar');
expectType<{readonly foo: string}>(readonlyData.object);
expectType<string>(readonlyData.string);
expectType<number>(readonlyData.number);
expectType<boolean>(readonlyData.boolean);
expectType<symbol>(readonlyData.symbol);
expectType<null>(readonlyData.null);
expectType<undefined>(readonlyData.undefined);
expectType<ReadonlyMap<string, string>>(readonlyData.map);
expectType<ReadonlySet<string>>(readonlyData.set);
expectType<readonly string[]>(readonlyData.array);
expectType<readonly ['foo']>(readonlyData.tuple);
expectType<ReadonlyMap<string, string>>(readonlyData.readonlyMap);
expectType<ReadonlySet<string>>(readonlyData.readonlySet);
expectType<readonly string[]>(readonlyData.readonlyArray);
expectType<readonly ['foo']>(readonlyData.readonlyTuple);
