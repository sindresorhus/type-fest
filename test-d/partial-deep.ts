import {expectType, expectError, expectAssignable} from 'tsd';
import type {PartialDeep} from '../index';

const foo = {
	baz: 'fred',
	bar: {
		function: (_: string): void => undefined,
		object: {key: 'value'},
		string: 'waldo',
		number: 1,
		boolean: false,
		date: new Date(),
		regexp: /.*/,
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
	},
};

let partialDeepFoo: PartialDeep<typeof foo, {recurseIntoArrays: true}> = foo;

expectError(expectType<Partial<typeof foo>>(partialDeepFoo));
const partialDeepBar: PartialDeep<typeof foo.bar, {recurseIntoArrays: true}> = foo.bar;
expectType<typeof partialDeepBar | undefined>(partialDeepFoo.bar);
expectType<((_: string) => void) | undefined>(partialDeepFoo.bar!.function);
expectAssignable<object | undefined>(partialDeepFoo.bar!.object);
expectType<string | undefined>(partialDeepFoo.bar!.string);
expectType<number | undefined>(partialDeepFoo.bar!.number);
expectType<boolean | undefined>(partialDeepFoo.bar!.boolean);
expectType<Date | undefined>(partialDeepFoo.bar!.date);
expectType<RegExp | undefined>(partialDeepFoo.bar!.regexp);
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
partialDeepFoo = {bar: {date: new Date()}};
// Check that recursive array evaluation isn't infinite depth
type Recurse =
	| string
	| number
	| boolean
	| null
	| Record<string, Recurse[]>
	| Recurse[];
type RecurseObject = {value: Recurse};
const recurseObject: RecurseObject = {value: null};
expectAssignable<PartialDeep<RecurseObject>>(recurseObject);

// Check that `{recurseIntoArrays: false}` is the default
const partialDeepNoRecurseIntoArraysFoo: PartialDeep<typeof foo> = foo;
// Check that `{recurseIntoArrays: true}` behaves as intended
expectType<PartialDeep<typeof foo, {recurseIntoArrays: true}>>(partialDeepFoo);
// These are mostly the same checks as before, but the array/tuple types are different.
expectError(expectType<Partial<typeof foo>>(partialDeepNoRecurseIntoArraysFoo));
const partialDeepNoRecurseIntoArraysBar: PartialDeep<typeof foo.bar, {recurseIntoArrays: false}> = foo.bar;
expectType<typeof partialDeepNoRecurseIntoArraysBar | undefined>(partialDeepNoRecurseIntoArraysFoo.bar);
expectType<((_: string) => void) | undefined>(partialDeepNoRecurseIntoArraysBar.function);
expectAssignable<object | undefined>(partialDeepNoRecurseIntoArraysBar.object);
expectType<string | undefined>(partialDeepNoRecurseIntoArraysBar.string);
expectType<number | undefined>(partialDeepNoRecurseIntoArraysBar.number);
expectType<boolean | undefined>(partialDeepNoRecurseIntoArraysBar.boolean);
expectType<Date | undefined>(partialDeepNoRecurseIntoArraysBar.date);
expectType<RegExp | undefined>(partialDeepNoRecurseIntoArraysBar.regexp);
expectType<symbol | undefined>(partialDeepNoRecurseIntoArraysBar.symbol);
expectType<null | undefined>(partialDeepNoRecurseIntoArraysBar.null);
expectType<undefined>(partialDeepNoRecurseIntoArraysBar.undefined);
expectAssignable<Map<string | undefined, string | undefined> | undefined>(partialDeepNoRecurseIntoArraysBar.map);
expectAssignable<Set<string | undefined> | undefined>(partialDeepNoRecurseIntoArraysBar.set);
expectType<string[] | undefined>(partialDeepNoRecurseIntoArraysBar.array);
expectType<['foo'] | undefined>(partialDeepNoRecurseIntoArraysBar.tuple);
expectAssignable<ReadonlyMap<string | undefined, string | undefined> | undefined>(partialDeepNoRecurseIntoArraysBar.readonlyMap);
expectAssignable<ReadonlySet<string | undefined> | undefined>(partialDeepNoRecurseIntoArraysBar.readonlySet);
expectType<readonly string[] | undefined>(partialDeepNoRecurseIntoArraysBar.readonlyArray);
expectType<readonly ['foo'] | undefined>(partialDeepNoRecurseIntoArraysBar.readonlyTuple);
