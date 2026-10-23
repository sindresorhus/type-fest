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

// Recursive optional values must not require evaluating their own transformed properties just to determine the keys.
type RecursiveConfig = string | RecursiveConfig[] | {value: RecursiveConfig | undefined};
const recursiveText: PartialOnUndefinedDeep<RecursiveConfig, {recurseIntoArrays: true}> = 'text';
const recursiveEmpty: PartialOnUndefinedDeep<RecursiveConfig, {recurseIntoArrays: true}> = {};
const recursiveChildren: PartialOnUndefinedDeep<RecursiveConfig, {recurseIntoArrays: true}> = {value: ['text', {}]};

type OptionalRecursiveConfig = string | OptionalRecursiveConfig[] | {value?: OptionalRecursiveConfig | undefined};
expectTypeOf<PartialOnUndefinedDeep<RecursiveConfig, {recurseIntoArrays: true}>>().toBe<OptionalRecursiveConfig>();
expectTypeOf(recursiveText).toBe<string>();
expectTypeOf(recursiveEmpty).toBeAssignableTo<OptionalRecursiveConfig>();
expectTypeOf(recursiveChildren).toBeAssignableTo<OptionalRecursiveConfig>();
expectTypeOf<boolean>().not.toBeAssignableTo<PartialOnUndefinedDeep<RecursiveConfig, {recurseIntoArrays: true}>>();
expectTypeOf<{value: [boolean]}>().not.toBeAssignableTo<PartialOnUndefinedDeep<RecursiveConfig, {recurseIntoArrays: true}>>();

// Array recursion is still opt-in, even when the array refers back to the input union.
expectTypeOf<PartialOnUndefinedDeep<RecursiveConfig>>().toBe<string | RecursiveConfig[] | {value?: PartialOnUndefinedDeep<RecursiveConfig> | undefined}>();
expectTypeOf<{value: [{}]}>().not.toBeAssignableTo<PartialOnUndefinedDeep<RecursiveConfig>>();

// Discriminants and required fields survive while recursive optional branches are made optional.
type ConfigNode = {kind: 'node'; child: ConfigNode | undefined} | {kind: 'leaf'; name: string};
type OptionalConfigNode = {kind: 'node'; child?: OptionalConfigNode | undefined} | {kind: 'leaf'; name: string};
expectTypeOf<PartialOnUndefinedDeep<ConfigNode>>().toBe<OptionalConfigNode>();
expectTypeOf<{kind: 'node'}>().toBeAssignableTo<PartialOnUndefinedDeep<ConfigNode>>();
expectTypeOf<{kind: 'node'; child: {kind: 'leaf'; name: 'leaf'}}>().toBeAssignableTo<PartialOnUndefinedDeep<ConfigNode>>();
expectTypeOf<{child: {kind: 'leaf'; name: 'leaf'}}>().not.toBeAssignableTo<PartialOnUndefinedDeep<ConfigNode>>();
expectTypeOf<{kind: 'leaf'}>().not.toBeAssignableTo<PartialOnUndefinedDeep<ConfigNode>>();

// Modifiers, index signatures and sentinel values retain their existing contracts.
expectTypeOf<PartialOnUndefinedDeep<{readonly value: number | undefined; required: string; optional?: boolean}>>()
	.toBe<{readonly value?: number | undefined; required: string; optional?: boolean}>();
expectTypeOf<PartialOnUndefinedDeep<{[key: string]: unknown; readonly value: number | undefined; required: string}>>()
	.toBe<{[key: string]: unknown; readonly value?: number | undefined; required: string}>();
expectTypeOf<PartialOnUndefinedDeep<{[key: number]: string | undefined; 0: string}>>().toBe<{[key: number]: string | undefined; 0: string}>();
declare const optionalSymbol: unique symbol;
expectTypeOf<PartialOnUndefinedDeep<{readonly [optionalSymbol]: string | undefined; keep: number}>>()
	.toBe<{readonly [optionalSymbol]?: string | undefined; keep: number}>();
expectTypeOf<PartialOnUndefinedDeep<{0: string | undefined; '1': number}>>().toBe<{0?: string | undefined; '1': number}>();
expectTypeOf<PartialOnUndefinedDeep<{value: any; unknown: unknown; impossible: never}>>().toBe<{value?: any; unknown: unknown; impossible: never}>();
expectTypeOf<PartialOnUndefinedDeep<any>>().toBe<any>();
expectTypeOf<PartialOnUndefinedDeep<never>>().toBe<never>();
expectTypeOf<PartialOnUndefinedDeep<unknown>>().toBe<unknown>();

// A generic property's key remains available before its value type is known.
type GenericValue<Value> = PartialOnUndefinedDeep<{value: Value}>['value'];
expectTypeOf<GenericValue<string>>().toBe<string>();
expectTypeOf<GenericValue<string | undefined>>().toBe<string | undefined>();
expectTypeOf<GenericValue<unknown>>().toBe<unknown>();
expectTypeOf<GenericValue<any>>().toBe<any>();
expectTypeOf<GenericValue<never>>().toBe<never>();

// An optional settings branch still requires its own non-optional structure when present.
type OptionalTransportSettings = PartialOnUndefinedDeep<{
	readonly id: string;
	transport: {timeout: number | undefined; retry: {attempts: number | undefined; enabled: boolean}} | undefined;
}>;
({id: 'session'}) satisfies OptionalTransportSettings;
({id: 'session', transport: {retry: {enabled: true}}}) satisfies OptionalTransportSettings;
expectTypeOf<{id: string; transport: {timeout: number}}>().not.toBeAssignableTo<OptionalTransportSettings>();
expectTypeOf<{transport: {retry: {enabled: boolean}}}>().not.toBeAssignableTo<OptionalTransportSettings>();
declare const optionalTransportSettings: OptionalTransportSettings;
expectTypeOf(optionalTransportSettings.transport?.retry.enabled).toBe<boolean | undefined>();
// @ts-expect-error Making other fields optional does not change the readonly identifier.
optionalTransportSettings.id = 'changed';

function _readOptionalNestedId<Extra>(value: PartialOnUndefinedDeep<{nested: {id: number; extra: Extra} | undefined}>): number | undefined {
	return value.nested?.id;
}

type Callback<Arguments extends unknown[], Result> = (...arguments_: Arguments) => Result;

function _retainCallback<Arguments extends unknown[], Result>(value: PartialOnUndefinedDeep<{callback: Callback<Arguments, Result>; enabled: boolean | undefined}>): Callback<Arguments, Result> {
	return value.callback;
}

function _keepOptionalObject<Input extends object>(value: PartialOnUndefinedDeep<Input>): object {
	return value;
}

declare function optionalSettings<const Input>(value: Input): PartialOnUndefinedDeep<Input>;
const inferredOptionalSettings = optionalSettings({id: 'session', transport: {enabled: true, timeout: undefined as number | undefined}});
expectTypeOf(inferredOptionalSettings).toBe<{readonly id: 'session'; readonly transport: {readonly enabled: true; readonly timeout?: number | undefined}}>();

// Inference carries the array-recursion option through the public options boundary.
type OptionalRowsSettings = {rows: Array<{id: string; note: string | undefined}>};
declare function optionalArraySettings<const Recurse extends boolean>(options: {recurseIntoArrays: Recurse}): PartialOnUndefinedDeep<OptionalRowsSettings, {recurseIntoArrays: Recurse}>;
expectTypeOf(optionalArraySettings({recurseIntoArrays: true}).rows).toBe<Array<{id: string; note?: string | undefined}>>();
expectTypeOf(optionalArraySettings({recurseIntoArrays: false}).rows).toBe<Array<{id: string; note: string | undefined}>>();

// A runtime boolean can enable recursion, so array payloads must allow its optionalized form.
type UncertainOptionalRows = PartialOnUndefinedDeep<OptionalRowsSettings, {recurseIntoArrays: boolean}>;
type OptionalRow = {id: string; note?: string | undefined};
expectTypeOf<UncertainOptionalRows['rows']>().toBe<OptionalRow[]>();
({rows: [{id: 'session'}]}) satisfies UncertainOptionalRows;
declare const recurseIntoOptionalRows: boolean;
expectTypeOf(optionalArraySettings({recurseIntoArrays: recurseIntoOptionalRows}).rows).toBe<OptionalRow[]>();

// Both runtime branches retain required fields; only values accepting undefined become optional.
({rows: [{id: 'session', note: undefined}]}) satisfies UncertainOptionalRows;
expectTypeOf<{rows: Array<{note: string}>}>().not.toBeAssignableTo<UncertainOptionalRows>();
expectTypeOf<{rows: Array<{id: number}>}>().not.toBeAssignableTo<UncertainOptionalRows>();
expectTypeOf<PartialOnUndefinedDeep<OptionalRowsSettings, {recurseIntoArrays: true} | {recurseIntoArrays: false}>>().toBe<UncertainOptionalRows>();
expectTypeOf<PartialOnUndefinedDeep<OptionalRowsSettings, {recurseIntoArrays?: boolean}>>().toBe<OptionalRowsSettings>();
expectTypeOf<PartialOnUndefinedDeep<OptionalRowsSettings, any>>().toBe<OptionalRowsSettings>();
expectTypeOf<PartialOnUndefinedDeep<OptionalRowsSettings, never>>().toBe<OptionalRowsSettings>();

// The same strategy reaches readonly tuples and containers without changing their modifiers.
type ReadonlyOptionalRow = {readonly id: string; note: string | undefined};
type UncertainReadonlyRows = PartialOnUndefinedDeep<readonly [ReadonlyOptionalRow, ReadonlyOptionalRow?], {recurseIntoArrays: boolean}>;
expectTypeOf<UncertainReadonlyRows>().toBe<readonly [{readonly id: string; note?: string | undefined}, {readonly id: string; note?: string | undefined}?]>();
([{id: 'first'}]) satisfies UncertainReadonlyRows;
declare const uncertainReadonlyRows: UncertainReadonlyRows;
// @ts-expect-error Optionalizing another field does not make an identifier writable.
uncertainReadonlyRows[0].id = 'changed';

type ReadonlyOptionalGroups = ReadonlyMap<string, readonly ReadonlyOptionalRow[]>;
type UncertainOptionalGroups = PartialOnUndefinedDeep<ReadonlyOptionalGroups, {recurseIntoArrays: boolean}>;
expectTypeOf<UncertainOptionalGroups>().toBe<ReadonlyMap<string, ReadonlyArray<{readonly id: string; note?: string | undefined}>>>();
new Map([['group', [{id: 'first'}]]]) satisfies UncertainOptionalGroups;

// Generic options preserve the published constructor and reader contracts for unaffected arrays.
function _keepOptionalArray<Options extends {recurseIntoArrays?: boolean}>(value: string[]): PartialOnUndefinedDeep<string[], Options> {
	return value;
}

function _readOptionalArray<Options extends {recurseIntoArrays?: boolean}>(value: PartialOnUndefinedDeep<string[], Options>): string[] {
	return value;
}

function _keepDisabledOptionalRows<Options extends {recurseIntoArrays: false}>(value: OptionalRowsSettings['rows']): PartialOnUndefinedDeep<OptionalRowsSettings['rows'], Options> {
	return value;
}
