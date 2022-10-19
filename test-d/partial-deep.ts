import {expectTypeOf} from 'expect-type';
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
		regexp: new RegExp(/.*/),
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

expectTypeOf(partialDeepFoo).not.toEqualTypeOf<Partial<typeof foo>>();
const partialDeepBar: PartialDeep<typeof foo.bar, {recurseIntoArrays: true}> = foo.bar;
expectTypeOf(partialDeepFoo.bar).toEqualTypeOf<typeof partialDeepBar | undefined>();
expectTypeOf(partialDeepFoo.bar!.function).toEqualTypeOf<((_: string) => void) | undefined>();
expectTypeOf(partialDeepFoo.bar!.object).toMatchTypeOf<object | undefined>();
expectTypeOf(partialDeepFoo.bar!.string).toEqualTypeOf<string | undefined>();
expectTypeOf(partialDeepFoo.bar!.number).toEqualTypeOf<number | undefined>();
expectTypeOf(partialDeepFoo.bar!.boolean).toEqualTypeOf<boolean | undefined>();
expectTypeOf(partialDeepFoo.bar!.date).toEqualTypeOf<Date | undefined>();
expectTypeOf(partialDeepFoo.bar!.regexp).toEqualTypeOf<RegExp | undefined>();
expectTypeOf(partialDeepFoo.bar!.symbol).toEqualTypeOf<symbol | undefined>();
expectTypeOf(partialDeepFoo.bar!.null).toEqualTypeOf<null | undefined>();
expectTypeOf(partialDeepFoo.bar!.undefined).toEqualTypeOf<undefined>();
expectTypeOf(partialDeepFoo.bar!.map).toMatchTypeOf<Map<string | undefined, string | undefined> | undefined>();
expectTypeOf(partialDeepFoo.bar!.set).toMatchTypeOf<Set<string | undefined> | undefined>();
expectTypeOf(partialDeepFoo.bar!.array).toEqualTypeOf<Array<string | undefined> | undefined>();
expectTypeOf(partialDeepFoo.bar!.tuple).toEqualTypeOf<['foo'?] | undefined>();
expectTypeOf(partialDeepFoo.bar!.readonlyMap).toMatchTypeOf<ReadonlyMap<string | undefined, string | undefined> | undefined>();
expectTypeOf(partialDeepFoo.bar!.readonlySet).toMatchTypeOf<ReadonlySet<string | undefined> | undefined>();
expectTypeOf(partialDeepFoo.bar!.readonlyArray).toEqualTypeOf<ReadonlyArray<string | undefined> | undefined>();
expectTypeOf(partialDeepFoo.bar!.readonlyTuple).toEqualTypeOf<readonly ['foo'?] | undefined>();
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
expectTypeOf(recurseObject).toMatchTypeOf<PartialDeep<RecurseObject>>();

// Check that `{recurseIntoArrays: false}` is the default
const partialDeepNoRecurseIntoArraysFoo: PartialDeep<typeof foo> = foo;
// Check that `{recurseIntoArrays: true}` behaves as intended
expectTypeOf(partialDeepFoo).toEqualTypeOf<PartialDeep<typeof foo, {recurseIntoArrays: true}>>();
// These are mostly the same checks as before, but the array/tuple types are different.
expectTypeOf(partialDeepNoRecurseIntoArraysFoo).not.toEqualTypeOf<Partial<typeof foo>>();
const partialDeepNoRecurseIntoArraysBar: PartialDeep<typeof foo.bar, {recurseIntoArrays: false}> = foo.bar;
expectTypeOf(partialDeepNoRecurseIntoArraysFoo.bar).toEqualTypeOf<typeof partialDeepNoRecurseIntoArraysBar | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.function).toEqualTypeOf<((_: string) => void) | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.object).toMatchTypeOf<object | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.string).toEqualTypeOf<string | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.number).toEqualTypeOf<number | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.boolean).toEqualTypeOf<boolean | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.date).toEqualTypeOf<Date | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.regexp).toEqualTypeOf<RegExp | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.symbol).toEqualTypeOf<symbol | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.null).toEqualTypeOf<null | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.undefined).toEqualTypeOf<undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.map).toMatchTypeOf<Map<string | undefined, string | undefined> | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.set).toMatchTypeOf<Set<string | undefined> | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.array).toEqualTypeOf<string[] | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.tuple).toEqualTypeOf<['foo'] | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.readonlyMap).toMatchTypeOf<ReadonlyMap<string | undefined, string | undefined> | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.readonlySet).toMatchTypeOf<ReadonlySet<string | undefined> | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.readonlyArray).toEqualTypeOf<readonly string[] | undefined>();
expectTypeOf(partialDeepNoRecurseIntoArraysBar.readonlyTuple).toEqualTypeOf<readonly ['foo'] | undefined>();
