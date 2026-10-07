import {expectAssignable, expectType} from 'tsd';
import type {IsEqual, PartialOnUndefinedDeep} from '../index.d.ts';

type TestingType = {
	function: (() => void) | undefined;
	object: {objectKey: 1} | undefined;
	objectDeep: {
		subObject: string | undefined;
	};
	string: string | undefined;
	union: 'test1' | 'test2' | undefined;
	number: number | undefined;
	boolean: boolean | undefined;
	date: Date | undefined;
	regexp: RegExp | undefined;
	symbol: symbol | undefined;
	null: null | undefined;
	record: Record<string, any> | undefined;
	map: Map<string, string> | undefined;
	set: Set<string> | undefined;
	array1: any[] | undefined;
	array2: Array<{propertyA: string; propertyB: number | undefined}> | undefined;
	readonly1: readonly any[] | undefined;
	readonly2: ReadonlyArray<{propertyA: string; propertyB: number | undefined}> | undefined;
	readonly readonlyProperty: string | undefined;
	tuple: ['test1', {propertyA: string; propertyB: number | undefined}] | undefined;
};
declare const indexType: {[k: string]: string | undefined; propertyA: string; propertyB: string | undefined};
declare const indexTypeUnknown: {[k: string]: unknown; propertyA: string; propertyB: number | undefined};

// Default behavior, without recursion into arrays/tuples
declare const foo: PartialOnUndefinedDeep<TestingType>;
expectAssignable<{
	function?: TestingType['function'];
	object?: TestingType['object'];
	objectDeep: {
		subObject?: TestingType['objectDeep']['subObject'];
	};
	string?: TestingType['string'];
	union?: TestingType['union'];
	number?: TestingType['number'];
	boolean?: TestingType['boolean'];
	date?: TestingType['date'];
	regexp?: TestingType['regexp'];
	symbol?: TestingType['symbol'];
	null?: TestingType['null'];
	record?: TestingType['record'];
	map?: TestingType['map'];
	set?: TestingType['set'];
	array1?: TestingType['array1'];
	array2?: TestingType['array2'];
	readonly1?: TestingType['readonly1'];
	readonly2?: TestingType['readonly2'];
	readonly readonlyProperty?: TestingType['readonlyProperty'];
	tuple?: TestingType['tuple'];
}>(foo);

declare const indexTypeWithoutRecursion: PartialOnUndefinedDeep<typeof indexType>;
declare const indexTypeUnknownWithoutRecursion: PartialOnUndefinedDeep<typeof indexTypeUnknown>;
expectType<{[k: string]: string | undefined; propertyA: string; propertyB?: string | undefined}>(indexTypeWithoutRecursion);
expectType<{[k: string]: unknown; propertyA: string; propertyB?: number | undefined}>(indexTypeUnknownWithoutRecursion);

// With recursion into arrays/tuples activated
declare const bar: PartialOnUndefinedDeep<TestingType, {recurseIntoArrays: true}>;
expectAssignable<{
	function?: TestingType['function'];
	object?: TestingType['object'];
	objectDeep: {
		subObject?: TestingType['objectDeep']['subObject'];
	};
	string?: TestingType['string'];
	union?: TestingType['union'];
	number?: TestingType['number'];
	boolean?: TestingType['boolean'];
	date?: TestingType['date'];
	regexp?: TestingType['regexp'];
	symbol?: TestingType['symbol'];
	null?: TestingType['null'];
	record?: TestingType['record'];
	map?: TestingType['map'];
	set?: TestingType['set'];
	array1?: TestingType['array1'];
	array2?: Array<{propertyA: string; propertyB?: number | undefined}> | undefined;
	readonly1?: TestingType['readonly1'];
	readonly2?: ReadonlyArray<{propertyA: string; propertyB?: number | undefined}> | undefined;
	readonly readonlyProperty?: TestingType['readonlyProperty'];
	tuple?: ['test1', {propertyA: string; propertyB?: number | undefined}] | undefined;
}>(bar);

declare const indexTypeWithRecursion: PartialOnUndefinedDeep<typeof indexType, {recurseIntoArrays: true}>;
declare const indexTypeUnknownWithRecursion: PartialOnUndefinedDeep<typeof indexTypeUnknown, {recurseIntoArrays: true}>;
expectType<{[k: string]: string | undefined; propertyA: string; propertyB?: string | undefined}>(indexTypeWithRecursion);
expectType<{[k: string]: unknown; propertyA: string; propertyB?: number | undefined}>(indexTypeUnknownWithRecursion);

// Recursing into arrays must keep tuples as tuples
type FunctionTuple = PartialOnUndefinedDeep<{tuple: [() => void, string]}, {recurseIntoArrays: true}>;
expectType<[() => void, string]>({} as FunctionTuple['tuple']);

type NestedTuple = PartialOnUndefinedDeep<{tuple: [[{a: string | undefined}]]}, {recurseIntoArrays: true}>;
expectType<[[{a?: string | undefined}]]>({} as NestedTuple['tuple']);

type RestTuple = PartialOnUndefinedDeep<{tuple: [{a: string | undefined}, ...Array<{b: number | undefined}>]}, {recurseIntoArrays: true}>;
expectType<[{a?: string | undefined}, ...Array<{b?: number | undefined}>]>({} as RestTuple['tuple']);

// A tuple only has as many elements as it declares.
type PlainTuple = PartialOnUndefinedDeep<{tuple: ['a', {b: string}]}, {recurseIntoArrays: true}>;
declare const plainTuple: PlainTuple['tuple'];
// @ts-expect-error
expectType<never>(plainTuple[2]);

// A class constructor is a function, so it is kept as is, like the other `*Deep` types keep it.
declare class ClassWithUndefinedStatic {
	static maybe?: string;
	maybe: string | undefined;
	constructor(maybe?: string);
}

expectType<typeof ClassWithUndefinedStatic>({} as PartialOnUndefinedDeep<typeof ClassWithUndefinedStatic>);

// An abstract class has an `abstract new` signature, so it must be kept as is just like a concrete class constructor.
abstract class AbstractClassForTest {
	foo = 1;
}

expectType<true>({} as IsEqual<PartialOnUndefinedDeep<typeof AbstractClassForTest>, typeof AbstractClassForTest>);

// A `Map` is a container, so its value type must be converted rather than its members being rebuilt one by one, the way `UndefinedOnPartialDeep` handles it.
declare const map: PartialOnUndefinedDeep<{a: Map<string, {b: string | undefined}>}>;
expectType<{b?: string | undefined} | undefined>(map.a.get('x'));

declare const readonlyMap: PartialOnUndefinedDeep<{a: ReadonlyMap<string, {b: string | undefined}>}>;
expectType<{b?: string | undefined} | undefined>(readonlyMap.a.get('x'));

declare const set: PartialOnUndefinedDeep<{a: Set<{b: string | undefined}>}>;
expectType<Set<{b?: string | undefined}>>(set.a);

declare const readonlySet: PartialOnUndefinedDeep<{a: ReadonlySet<{b: string | undefined}>}>;
expectType<ReadonlySet<{b?: string | undefined}>>(readonlySet.a);

// A `WeakMap` and a `WeakSet` are containers, so their value or item type is converted the same way a `Map`'s and a `Set`'s is. Without that they fall through to the object branch and come back as an object of the container's own methods, which is not a `WeakSet` at all.
declare const weakSet: PartialOnUndefinedDeep<{a: WeakSet<{b: number | undefined}>}>;
expectType<{a: WeakSet<{b?: number | undefined}>}>(weakSet);

declare const weakMap: PartialOnUndefinedDeep<{a: WeakMap<object, {b: number | undefined}>}>;
expectType<{a: WeakMap<object, {b?: number | undefined}>}>(weakMap);
