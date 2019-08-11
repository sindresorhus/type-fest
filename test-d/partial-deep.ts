import {expectType, expectError} from 'tsd';
import {PartialDeep} from '..';

const foo = {
	baz: 'fred',
	bar: {
		function: (_: string): void => {},
		object: {key: 'value'},
		string: 'waldo',
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
	}
};

const partialDeepFoo: PartialDeep<typeof foo> = foo;

expectError(expectType<Partial<typeof foo>>(partialDeepFoo));
const partialDeepBar: PartialDeep<typeof foo.bar> = foo.bar;
expectType<typeof partialDeepBar | undefined>(partialDeepFoo.bar);
expectType<((_: string) => void) | undefined>(partialDeepFoo.bar!.function);
expectType<object | undefined>(partialDeepFoo.bar!.object);
expectType<string | undefined>(partialDeepFoo.bar!.string);
expectType<number | undefined>(partialDeepFoo.bar!.number);
expectType<boolean | undefined>(partialDeepFoo.bar!.boolean);
expectType<symbol | undefined>(partialDeepFoo.bar!.symbol);
expectType<null | undefined>(partialDeepFoo.bar!.null);
expectType<undefined>(partialDeepFoo.bar!.undefined);
expectType<Map<string | undefined, string | undefined> | undefined>(partialDeepFoo.bar!.map);
expectType<Set<string | undefined> | undefined>(partialDeepFoo.bar!.set);
expectType<Array<string | undefined> | undefined>(partialDeepFoo.bar!.array);
expectType<['foo' | undefined] | undefined>(partialDeepFoo.bar!.tuple);
expectType<ReadonlyMap<string | undefined, string | undefined> | undefined>(partialDeepFoo.bar!.readonlyMap);
expectType<ReadonlySet<string | undefined> | undefined>(partialDeepFoo.bar!.readonlySet);
expectType<ReadonlyArray<string | undefined> | undefined>(partialDeepFoo.bar!.readonlyArray);
expectType<readonly ['foo' | undefined] | undefined>(partialDeepFoo.bar!.readonlyTuple);
