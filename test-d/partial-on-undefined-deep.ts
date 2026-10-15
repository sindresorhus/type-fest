import {expectTypeOf} from 'nz';
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
expectTypeOf(foo).toBeAssignableTo<{
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
}>();

declare const indexTypeWithoutRecursion: PartialOnUndefinedDeep<typeof indexType>;
declare const indexTypeUnknownWithoutRecursion: PartialOnUndefinedDeep<typeof indexTypeUnknown>;
expectTypeOf(indexTypeWithoutRecursion).toBe<{[k: string]: string | undefined; propertyA: string; propertyB?: string | undefined}>();
expectTypeOf(indexTypeUnknownWithoutRecursion).toBe<{[k: string]: unknown; propertyA: string; propertyB?: number | undefined}>();

// With recursion into arrays/tuples activated
declare const bar: PartialOnUndefinedDeep<TestingType, {recurseIntoArrays: true}>;
expectTypeOf(bar).toBeAssignableTo<{
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
}>();

declare const indexTypeWithRecursion: PartialOnUndefinedDeep<typeof indexType, {recurseIntoArrays: true}>;
declare const indexTypeUnknownWithRecursion: PartialOnUndefinedDeep<typeof indexTypeUnknown, {recurseIntoArrays: true}>;
expectTypeOf(indexTypeWithRecursion).toBe<{[k: string]: string | undefined; propertyA: string; propertyB?: string | undefined}>();
expectTypeOf(indexTypeUnknownWithRecursion).toBe<{[k: string]: unknown; propertyA: string; propertyB?: number | undefined}>();

// Recursing into arrays must keep tuples as tuples
type FunctionTuple = PartialOnUndefinedDeep<{tuple: [() => void, string]}, {recurseIntoArrays: true}>;
expectTypeOf<FunctionTuple['tuple']>().toBe<[() => void, string]>();

type NestedTuple = PartialOnUndefinedDeep<{tuple: [[{a: string | undefined}]]}, {recurseIntoArrays: true}>;
expectTypeOf<NestedTuple['tuple']>().toBe<[[{a?: string | undefined}]]>();

type RestTuple = PartialOnUndefinedDeep<{tuple: [{a: string | undefined}, ...Array<{b: number | undefined}>]}, {recurseIntoArrays: true}>;
expectTypeOf<RestTuple['tuple']>().toBe<[{a?: string | undefined}, ...Array<{b?: number | undefined}>]>();

// A tuple only has as many elements as it declares.
type PlainTuple = PartialOnUndefinedDeep<{tuple: ['a', {b: string}]}, {recurseIntoArrays: true}>;
declare const plainTuple: PlainTuple['tuple'];
// @ts-expect-error
expectTypeOf(plainTuple[2]).toBe<never>();

// A class constructor is a function, so it is kept as is, like the other `*Deep` types keep it.
declare class ClassWithUndefinedStatic {
	static maybe?: string;
	maybe: string | undefined;
	constructor(maybe?: string);
}

expectTypeOf<PartialOnUndefinedDeep<typeof ClassWithUndefinedStatic>>().toBe<typeof ClassWithUndefinedStatic>();

// An abstract class has an `abstract new` signature, so it must be kept as is just like a concrete class constructor.
abstract class AbstractClassForTest {
	foo = 1;
}

expectTypeOf<IsEqual<PartialOnUndefinedDeep<typeof AbstractClassForTest>, typeof AbstractClassForTest>>().toBe<true>();

// A `Map` is a container, so its value type must be converted rather than its members being rebuilt one by one, the way `UndefinedOnPartialDeep` handles it.
declare const map: PartialOnUndefinedDeep<{a: Map<string, {b: string | undefined}>}>;
expectTypeOf(map.a.get('x')).toBe<{b?: string | undefined} | undefined>();

declare const readonlyMap: PartialOnUndefinedDeep<{a: ReadonlyMap<string, {b: string | undefined}>}>;
expectTypeOf(readonlyMap.a.get('x')).toBe<{b?: string | undefined} | undefined>();

declare const set: PartialOnUndefinedDeep<{a: Set<{b: string | undefined}>}>;
expectTypeOf(set.a).toBe<Set<{b?: string | undefined}>>();

declare const readonlySet: PartialOnUndefinedDeep<{a: ReadonlySet<{b: string | undefined}>}>;
expectTypeOf(readonlySet.a).toBe<ReadonlySet<{b?: string | undefined}>>();

// A `WeakMap` and a `WeakSet` are containers, so their value or item type is converted the same way a `Map`'s and a `Set`'s is. Without that they fall through to the object branch and come back as an object of the container's own methods, which is not a `WeakSet` at all.
declare const weakSet: PartialOnUndefinedDeep<{a: WeakSet<{b: number | undefined}>}>;
expectTypeOf(weakSet).toBe<{a: WeakSet<{b?: number | undefined}>}>();

declare const weakMap: PartialOnUndefinedDeep<{a: WeakMap<object, {b: number | undefined}>}>;
expectTypeOf(weakMap).toBe<{a: WeakMap<object, {b?: number | undefined}>}>();

// Standalone leaves follow the same boundary as properties nested inside an object.
declare const standaloneFunction: PartialOnUndefinedDeep<() => string>;
expectTypeOf(standaloneFunction()).toBe<string>();
expectTypeOf<PartialOnUndefinedDeep<Uint8Array>>().toBe<Uint8Array>();

// A DOM node is a single value, so it is kept as is.
expectTypeOf<PartialOnUndefinedDeep<{element: HTMLElement | undefined}>>().toBe<{element?: HTMLElement | undefined}>();
