import {expectType, expectError, expectAssignable} from 'tsd';
import {Merge, MergeDeep} from '..';

const foo = {
    baz: 'waldo',
    waldo: {
		function: undefined,
		object: undefined,
		string: undefined,
		number: undefined,
		boolean: undefined,
		symbol: undefined,
		null: undefined,
		undefined: undefined, // eslint-disable-line object-shorthand
		map: new Map<number, number>(),
		set: new Set<number>(),
		array: [0],
		tuple: [0] as [0],
		readonlyMap: new Map<number, number>() as ReadonlyMap<number, number>,
		readonlySet: new Set<number>() as ReadonlySet<number>,
		readonlyArray: [0] as readonly number[],
        readonlyTuple: [0] as const,
        mergedArrayType: [{key: 'value', number: 0}] as Array<{key: string; number?: number}>
    }
};
const bar = {
	baz: 'fred',
	waldo: {
		function: (_: string): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
		object: {key: 'value'},
        string: 'waldo',
        partialString: 'waldo' as Partial<string>,
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
        readonlyTuple: ['foo'] as const,
        mergedArrayType: [{key: 1, string: 'string'}]
	}
};

const foobar: MergeDeep<typeof foo, typeof bar> = bar;
expectError(expectType<Merge<typeof foo, typeof bar>>(foobar));
expectType<((_: string) => void)>(foobar.waldo.function);
expectAssignable<object>(foobar.waldo.object);
expectType<string>(foobar.waldo.string);
expectType<Partial<string>>(foobar.waldo.partialString);
expectType<number>(foobar.waldo.number);
expectType<boolean>(foobar.waldo.boolean);
expectType<symbol>(foobar.waldo.symbol);
expectType<null>(foobar.waldo.null);
expectType<undefined>(foobar.waldo.undefined);
expectAssignable<Map<string, string>>(foobar.waldo.map);
expectAssignable<Set<string>>(foobar.waldo.set);
expectType<string[]>(foobar.waldo.array);
expectType<['foo'?]>(foobar.waldo.tuple);
expectAssignable<ReadonlyMap<string, string>>(foobar.waldo.readonlyMap);
expectAssignable<ReadonlySet<string>>(foobar.waldo.readonlySet);
expectType<readonly string[]>(foobar.waldo.readonlyArray);
expectType<readonly ['foo'?]>(foobar.waldo.readonlyTuple);
expectType<Array<{key: number; number?: number; string: string}>>(foobar.waldo.mergedArrayType);
