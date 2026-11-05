import {expectTypeOf} from 'nz';
import type {IsEqual, PartialOnUndefined, PartialOnUndefinedDeep} from '../index.d.ts';

type Settings = {
	required: string;
	maybe: number | undefined;
	optional?: boolean;
	readonly readonlyMaybe: symbol | undefined;
	nested: {
		maybe: number | undefined;
	};
};

declare const settings: PartialOnUndefined<Settings>;
expectTypeOf(settings).toBe<{
	required: string;
	maybe?: number | undefined;
	optional?: boolean;
	readonly readonlyMaybe?: symbol | undefined;
	nested: {
		maybe: number | undefined;
	};
}>();

({required: 'value', nested: {maybe: undefined}}) satisfies PartialOnUndefined<Settings>;
({required: 'value', maybe: undefined, nested: {maybe: 1}}) satisfies PartialOnUndefined<Settings>;

// @ts-expect-error `required` stays required.
({nested: {maybe: undefined}}) satisfies PartialOnUndefined<Settings>;

// @ts-expect-error `nested` stays required because its value does not accept `undefined`.
({required: 'value'}) satisfies PartialOnUndefined<Settings>;

// @ts-expect-error A key nested inside `nested` is not made optional.
({required: 'value', nested: {}}) satisfies PartialOnUndefined<Settings>;

declare const specialValues: PartialOnUndefined<{
	anything: any;
	input: unknown;
	impossible: never;
	cleared: undefined;
	optional?: string;
}>;
expectTypeOf(specialValues).toBe<{
	anything?: any;
	input: unknown;
	impossible: never;
	cleared?: undefined;
	optional?: string;
}>();

// A key that is already optional keeps its value type exactly.
expectTypeOf<PartialOnUndefined<{optional?: string}>>().toBe<{optional?: string}>();
expectTypeOf<PartialOnUndefined<{optional?: string | undefined}>>().toBe<{optional?: string | undefined}>();

// More value types that accept `undefined`.
expectTypeOf<PartialOnUndefined<{value: void}>>().toBe<{value?: void}>();
expectTypeOf<PartialOnUndefined<{value: null | undefined}>>().toBe<{value?: null | undefined}>();

// A `null` value does not accept `undefined`, so the key stays required.
expectTypeOf<PartialOnUndefined<{value: null}>>().toBe<{value: null}>();

// The `undefined` type stays in the value of a key that becomes optional.
({value: undefined}) satisfies PartialOnUndefined<{value: string | undefined}>;

// Unlike an `any` value, an `unknown` value does not make the key optional.
// @ts-expect-error `value` stays required.
({}) satisfies PartialOnUndefined<{value: unknown}>;

// An intersection and an inherited class are transformed key by key.
type Intersection = PartialOnUndefined<{a: string | undefined} & {b: number | undefined}>;
expectTypeOf<Intersection>().toBe<{a?: string | undefined; b?: number | undefined}>();
({}) satisfies Intersection;

declare class BaseShape {
	base: string | undefined;
	keep: number;
}

declare class ChildShape extends BaseShape {
	child: boolean | undefined;
}

expectTypeOf<PartialOnUndefined<ChildShape>>().toBe<{base?: string | undefined; keep: number; child?: boolean | undefined}>();
({keep: 1}) satisfies PartialOnUndefined<ChildShape>;

// A `readonly` key stays readonly, and an optional method keeps its value type.
expectTypeOf<PartialOnUndefined<{readonly id?: string}>>().toBe<{readonly id?: string}>();
expectTypeOf<PartialOnUndefined<{a?: () => void}>>().toBe<{a?: () => void}>();
expectTypeOf<PartialOnUndefined<{a(): string | undefined}>>().toBe<{a(): string | undefined}>();

// Only the top-level properties change, even when the key is already optional.
expectTypeOf<PartialOnUndefined<{nested?: {required: string | undefined}}>>()
	.toBe<{nested?: {required: string | undefined}}>();

// Containers and built-ins are kept as is, including their nested value types.
type ContainerValues = {
	array: string[];
	readonlyArray: readonly string[];
	tuple: [number, string?];
	map: Map<string, {value: string | undefined}>;
	readonlyMap: ReadonlyMap<string, {value: string | undefined}>;
	weakMap: WeakMap<object, {value: string | undefined}>;
	set: Set<{value: string | undefined}>;
	readonlySet: ReadonlySet<{value: string | undefined}>;
	weakSet: WeakSet<{value: string | undefined}>;
	function: (value: string) => number;
	constructor: new () => {value: string | undefined};
	date: Date;
	regexp: RegExp;
	typedArray: Uint8Array;
	arrayBuffer: ArrayBuffer;
	promise: Promise<{value: string | undefined}>;
};

declare const containers: PartialOnUndefined<ContainerValues>;
expectTypeOf(containers).toBe<ContainerValues>();

expectTypeOf<PartialOnUndefined<string[]>>().toBe<string[]>();
expectTypeOf<PartialOnUndefined<readonly [number, string?]>>().toBe<readonly [number, string?]>();
expectTypeOf<PartialOnUndefined<Map<string, {value: string | undefined}>>>().toBe<Map<string, {value: string | undefined}>>();
expectTypeOf<PartialOnUndefined<ReadonlySet<{value: string | undefined}>>>().toBe<ReadonlySet<{value: string | undefined}>>();
expectTypeOf<PartialOnUndefined<WeakMap<object, {value: string | undefined}>>>().toBe<WeakMap<object, {value: string | undefined}>>();
expectTypeOf<PartialOnUndefined<() => void>>().toBe<() => void>();
expectTypeOf<PartialOnUndefined<Date>>().toBe<Date>();
expectTypeOf<PartialOnUndefined<RegExp>>().toBe<RegExp>();
expectTypeOf<PartialOnUndefined<Uint8Array>>().toBe<Uint8Array>();
expectTypeOf<PartialOnUndefined<ArrayBuffer>>().toBe<ArrayBuffer>();
expectTypeOf<PartialOnUndefined<{element: HTMLElement | undefined}>>().toBe<{element?: HTMLElement | undefined}>();

// A thenable at the top level is returned as is.
expectTypeOf<PartialOnUndefined<Promise<{value: string | undefined}>>>().toBe<Promise<{value: string | undefined}>>();

// A union member that is a container is kept while the object members change.
expectTypeOf<PartialOnUndefined<string[] | {changed: string | undefined; nested: {b: string | undefined}}>>()
	.toBe<string[] | {changed?: string | undefined; nested: {b: string | undefined}}>();

// On a type without nested objects, the shallow type matches the deep type.
type FlatShape = {value: string | undefined; count: number; label?: string; cleared: void};
expectTypeOf<PartialOnUndefined<FlatShape>>().toBe<PartialOnUndefinedDeep<FlatShape>>();

// Index signatures are kept, and only the keys with an `undefined` value become optional.
declare const indexed: PartialOnUndefined<{[key: string]: string | undefined; propertyA: string; propertyB: string | undefined}>;
expectTypeOf(indexed).toBe<{[key: string]: string | undefined; propertyA: string; propertyB?: string | undefined}>();

declare const unknownIndexed: PartialOnUndefined<{[key: string]: unknown; propertyA: string; propertyB: number | undefined}>;
expectTypeOf(unknownIndexed).toBe<{[key: string]: unknown; propertyA: string; propertyB?: number | undefined}>();

expectTypeOf<PartialOnUndefined<{0: string | undefined; '1': number}>>().toBe<{0?: string | undefined; '1': number}>();
expectTypeOf<PartialOnUndefined<{[key: number]: string | undefined; 0: string}>>().toBe<{[key: number]: string | undefined; 0: string}>();
expectTypeOf<PartialOnUndefined<Record<string, string | undefined>>>().toBe<Record<string, string | undefined>>();
expectTypeOf<PartialOnUndefined<Record<string, number>>>().toBe<Record<string, number>>();
expectTypeOf<PartialOnUndefined<Record<'a' | 'b', string | undefined>>>().toBe<{a?: string | undefined; b?: string | undefined}>();
expectTypeOf<PartialOnUndefined<{[key: `data-${string}`]: string | undefined; id: string}>>()
	.toBe<{[key: `data-${string}`]: string | undefined; id: string}>();
expectTypeOf<PartialOnUndefined<{[key: string]: string | undefined; [key: number]: string | undefined; id: string}>>()
	.toBe<{[key: string]: string | undefined; [key: number]: string | undefined; id: string}>();
expectTypeOf<PartialOnUndefined<{[key: symbol]: string | undefined}>>().toBe<{[key: symbol]: string | undefined}>();
expectTypeOf<PartialOnUndefined<{readonly [key: string]: string | undefined; id: string}>>()
	.toBe<{readonly [key: string]: string | undefined; id: string}>();
expectTypeOf<PartialOnUndefined<{optional?: unknown}>>().toBe<{optional?: unknown}>();

declare const optionalSymbol: unique symbol;
expectTypeOf<PartialOnUndefined<{readonly [optionalSymbol]: string | undefined; keep: number}>>()
	.toBe<{readonly [optionalSymbol]?: string | undefined; keep: number}>();

// A union is transformed member by member, and an `undefined` member is kept.
expectTypeOf<PartialOnUndefined<{a: string | undefined} | undefined>>().toBe<{a?: string | undefined} | undefined>();
expectTypeOf<PartialOnUndefined<{a: string | undefined} | {b: number | undefined}>>()
	.toBe<{a?: string | undefined} | {b?: number | undefined}>();

// Primitive and non-object inputs are returned as is.
expectTypeOf<PartialOnUndefined<any>>().toBe<any>();
expectTypeOf<PartialOnUndefined<never>>().toBe<never>();
expectTypeOf<PartialOnUndefined<unknown>>().toBe<unknown>();
expectTypeOf<PartialOnUndefined<undefined>>().toBe<undefined>();
expectTypeOf<PartialOnUndefined<null>>().toBe<null>();
expectTypeOf<PartialOnUndefined<string>>().toBe<string>();
expectTypeOf<PartialOnUndefined<void>>().toBe<void>();
expectTypeOf<PartialOnUndefined<symbol>>().toBe<symbol>();
expectTypeOf<PartialOnUndefined<bigint>>().toBe<bigint>();
expectTypeOf<PartialOnUndefined<boolean>>().toBe<boolean>();
expectTypeOf<PartialOnUndefined<'a' | 'b'>>().toBe<'a' | 'b'>();
expectTypeOf<PartialOnUndefined<object>>().toBe<object>();
expectTypeOf<PartialOnUndefined<{}>>().toBe<{}>();

// A class constructor is a function, so it is kept as is, like the other `*Deep` types keep it.
declare class ClassWithUndefinedStatic {
	static maybe?: string;
	maybe: string | undefined;
	constructor(maybe?: string);
}

expectTypeOf<PartialOnUndefined<typeof ClassWithUndefinedStatic>>().toBe<typeof ClassWithUndefinedStatic>();

abstract class AbstractClassForTest {
	foo = 1;
}

expectTypeOf<IsEqual<PartialOnUndefined<typeof AbstractClassForTest>, typeof AbstractClassForTest>>().toBe<true>();

// An instance type is an object, so its top-level properties are changed.
declare class InstanceWithUndefined {
	required: string;
	maybe: string | undefined;
}

expectTypeOf<PartialOnUndefined<InstanceWithUndefined>>().toBe<{required: string; maybe?: string | undefined}>();

// A recursive input is not walked, so the type resolves without recursion.
type ConfigNode = {kind: 'node'; child: ConfigNode | undefined} | {kind: 'leaf'; name: string};
expectTypeOf<PartialOnUndefined<ConfigNode>>()
	.toBe<{kind: 'node'; child?: ConfigNode | undefined} | {kind: 'leaf'; name: string}>();

// A generic value keeps its key and resolves once the value is known.
type GenericValue<Value> = PartialOnUndefined<{value: Value}>['value'];
expectTypeOf<GenericValue<string>>().toBe<string>();
expectTypeOf<GenericValue<string | undefined>>().toBe<string | undefined>();
expectTypeOf<GenericValue<unknown>>().toBe<unknown>();
expectTypeOf<GenericValue<any>>().toBe<any>();
expectTypeOf<GenericValue<never>>().toBe<never>();

// A generic value that accepts `undefined` still makes the key optional at the call site.
declare function acceptPartial<Value>(settings: PartialOnUndefined<{value: Value | undefined}>): void;
acceptPartial<string>({});
acceptPartial<string>({value: 'x'});
// @ts-expect-error The present value still has to match the generic type.
acceptPartial<string>({value: 1});

// Inference carries the shallow transformation through the public boundary.
declare function makePatch<const Input>(input: Input): PartialOnUndefined<Input>;
const inferredPatch = makePatch({id: 'user_1', name: undefined as string | undefined, nested: {maybe: undefined as number | undefined}});
expectTypeOf(inferredPatch).toBe<{
	readonly id: 'user_1';
	readonly name?: string | undefined;
	readonly nested: {readonly maybe: number | undefined};
}>();

// A callback value is kept even when the key becomes optional.
expectTypeOf<PartialOnUndefined<{callback: (() => void) | undefined; enabled: boolean}>>()
	.toBe<{callback?: (() => void) | undefined; enabled: boolean}>();

// Declared prototype-named fields still become optional and keep their readonly modifier.
const optionalFormatter: PartialOnUndefined<{readonly toString: (() => string) | undefined; id: string}> = {id: 'item'};
expectTypeOf(optionalFormatter.toString).toBe<(() => string) | undefined>();
// @ts-expect-error A valid formatter cannot overwrite the readonly field.
optionalFormatter.toString = () => 'changed';
