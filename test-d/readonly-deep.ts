import {expectTypeOf} from 'expect-type';
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

// @ts-expect-error
readonlyData.string = 'bar';
expectTypeOf(readonlyData.object).toEqualTypeOf<{readonly foo: string}>();
expectTypeOf(readonlyData.string).toEqualTypeOf<string>();
expectTypeOf(readonlyData.number).toEqualTypeOf<number>();
expectTypeOf(readonlyData.boolean).toEqualTypeOf<boolean>();
expectTypeOf(readonlyData.symbol).toEqualTypeOf<symbol>();
expectTypeOf(readonlyData.null).toEqualTypeOf<null>();
expectTypeOf(readonlyData.undefined).toEqualTypeOf<undefined>();
expectTypeOf(readonlyData.date).toEqualTypeOf<Date>();
expectTypeOf(readonlyData.regExp).toEqualTypeOf<RegExp>();
expectTypeOf(readonlyData.map).toEqualTypeOf<Readonly<ReadonlyMap<string, string>>>();
expectTypeOf(readonlyData.set).toEqualTypeOf<Readonly<ReadonlySet<string>>>();
expectTypeOf(readonlyData.array).toEqualTypeOf<readonly string[]>();
expectTypeOf(readonlyData.tuple).toEqualTypeOf<readonly ['foo']>();
expectTypeOf(readonlyData.readonlyMap).toEqualTypeOf<Readonly<ReadonlyMap<string, string>>>();
expectTypeOf(readonlyData.readonlySet).toEqualTypeOf<Readonly<ReadonlySet<string>>>();
expectTypeOf(readonlyData.readonlyArray).toEqualTypeOf<readonly string[]>();
expectTypeOf(readonlyData.readonlyTuple).toEqualTypeOf<readonly ['foo']>();

expectTypeOf(readonlyData.namespace).toEqualTypeOf<((foo: number) => string) & ReadonlyObjectDeep<Namespace>>();
expectTypeOf(readonlyData.namespace(1)).toEqualTypeOf<string>();
expectTypeOf(readonlyData.namespace.baz).toEqualTypeOf<readonly boolean[]>();

// These currently aren't readonly due to TypeScript limitations.
// @see https://github.com/microsoft/TypeScript/issues/29732
expectTypeOf(readonlyData.namespaceWithOverload).toEqualTypeOf<NamespaceWithOverload>();
expectTypeOf(readonlyData.namespaceWithOverload(1)).toEqualTypeOf<string>();
expectTypeOf(readonlyData.namespaceWithOverload('foo', 1)).toEqualTypeOf<number>();
expectTypeOf(readonlyData.namespaceWithOverload.baz).toEqualTypeOf<boolean[]>();
