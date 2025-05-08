import {expectType, expectAssignable} from 'tsd';
import type {PartialDeep, Simplify} from '../index.d.ts';

class ClassA {
	foo = 1;
}

const foo = {
	baz: 'fred',
	bar: {
		function: (_: string): void => undefined,
		classConstructor: ClassA,
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

// @ts-expect-error
expectType<Partial<typeof foo>>(partialDeepFoo);
const partialDeepBar: PartialDeep<typeof foo.bar, {recurseIntoArrays: true}> = foo.bar;
expectType<typeof partialDeepBar | undefined>(partialDeepFoo.bar);
// Check for constructor
expectType<typeof ClassA | undefined>(partialDeepFoo.bar!.classConstructor);
const instance = new partialDeepFoo.bar!.classConstructor!();
instance.foo = 2;
const b = partialDeepFoo.bar!.constructor;
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
expectType<string[] | undefined>(partialDeepFoo.bar!.array);
expectType<['foo'?] | undefined>(partialDeepFoo.bar!.tuple);
expectAssignable<ReadonlyMap<string | undefined, string | undefined> | undefined>(partialDeepFoo.bar!.readonlyMap);
expectAssignable<ReadonlySet<string | undefined> | undefined>(partialDeepFoo.bar!.readonlySet);
expectType<readonly string[] | undefined>(partialDeepFoo.bar!.readonlyArray);
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

// Check that `{allowUndefinedInNonTupleArrays: false}` is the default
const partialDeepAllowUndefinedInNonTupleArraysFoo: PartialDeep<typeof foo, {recurseIntoArrays: true}> = foo;
expectType<string[] | undefined>(partialDeepAllowUndefinedInNonTupleArraysFoo.bar!.array);
// Check that `{allowUndefinedInNonTupleArrays: true}` behaves as intended
const partialDeepDoNotAllowUndefinedInNonTupleArraysFoo: PartialDeep<typeof foo, {recurseIntoArrays: true; allowUndefinedInNonTupleArrays: true}> = foo;
expectType<Array<string | undefined> | undefined>(partialDeepDoNotAllowUndefinedInNonTupleArraysFoo.bar!.array);

// These are mostly the same checks as before, but the array/tuple types are different.
// @ts-expect-error
expectType<Partial<typeof foo>>(partialDeepNoRecurseIntoArraysFoo);
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

type FunctionWithProperties = {(a1: string, a2: number): boolean; p1: string; readonly p2: number};
declare const functionWithProperties: PartialDeep<FunctionWithProperties>;
expectType<boolean>(functionWithProperties('foo', 1));
expectType<{p1?: string; readonly p2?: number}>({} as Simplify<typeof functionWithProperties>); // `Simplify` removes the call signature from `typeof functionWithProperties`

type FunctionWithProperties2 = {(a1: boolean, ...a2: string[]): number; p1: {p2?: string; p3: {readonly p4?: boolean}}};
declare const functionWithProperties2: PartialDeep<FunctionWithProperties2>;
expectType<number>(functionWithProperties2(true, 'foo', 'bar'));
expectType<{p1?: {p2?: string; p3?: {readonly p4?: boolean}}}>({} as Simplify<typeof functionWithProperties2>);

type FunctionWithProperties3 = {(): void; p1: {p2?: string; p3: [{p4: number}, string]}};
declare const functionWithProperties3: PartialDeep<FunctionWithProperties3, {recurseIntoArrays: true}>;
expectType<void>(functionWithProperties3());
expectType<{p1?: {p2?: string; p3?: [{p4?: number}?, string?]}}>({} as Simplify<typeof functionWithProperties3>);

expectType<{p1?: string[]}>({} as Simplify<PartialDeep<{(): void; p1: string[]}, {allowUndefinedInNonTupleArrays: false}>>);
expectType<{p1?: string[]}>({} as Simplify<PartialDeep<{(): void; p1: string[]}, {allowUndefinedInNonTupleArrays: true}>>);
