import {expectType, expectError, expectAssignable} from 'tsd';
import {PartialDeep} from '..';

const foo = {
	baz: 'fred',
	bar: {
		function: (_: string): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
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

let partialDeepFoo: PartialDeep<typeof foo> = foo;

expectError(expectType<Partial<typeof foo>>(partialDeepFoo));
const partialDeepBar: PartialDeep<typeof foo.bar> = foo.bar;
expectType<typeof partialDeepBar | undefined>(partialDeepFoo.bar);
expectType<((_: string) => void) | undefined>(partialDeepFoo.bar!.function);
expectAssignable<object | undefined>(partialDeepFoo.bar!.object);
expectType<string | undefined>(partialDeepFoo.bar!.string);
expectType<number | undefined>(partialDeepFoo.bar!.number);
expectType<boolean | undefined>(partialDeepFoo.bar!.boolean);
expectType<symbol | undefined>(partialDeepFoo.bar!.symbol);
expectType<null | undefined>(partialDeepFoo.bar!.null);
expectType<undefined>(partialDeepFoo.bar!.undefined);
expectAssignable<Map<string | undefined, string | undefined> | undefined>(partialDeepFoo.bar!.map);
expectAssignable<Set<string | undefined> | undefined>(partialDeepFoo.bar!.set);
expectType<Array<string | undefined> | undefined>(partialDeepFoo.bar!.array);
expectType<['foo'?] | undefined>(partialDeepFoo.bar!.tuple);
expectAssignable<ReadonlyMap<string | undefined, string | undefined> | undefined>(partialDeepFoo.bar!.readonlyMap);
expectAssignable<ReadonlySet<string | undefined> | undefined>(partialDeepFoo.bar!.readonlySet);
expectType<ReadonlyArray<string | undefined> | undefined>(partialDeepFoo.bar!.readonlyArray);
expectType<readonly ['foo'?] | undefined>(partialDeepFoo.bar!.readonlyTuple);
// Check for compiling with omitting partial keys
partialDeepFoo = {baz: 'fred'};
partialDeepFoo = {bar: {string: 'waldo'}};
