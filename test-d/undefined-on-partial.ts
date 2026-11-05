import {expectTypeOf} from 'nz';
import type {IsEqual, UndefinedOnPartial, UndefinedOnPartialDeep} from '../index.d.ts';

type Settings = {
	required: string;
	optional?: number;
	readonly readonlyOptional?: symbol;
	nested: {
		optional?: boolean;
	};
};

declare const settings: UndefinedOnPartial<Settings>;
expectTypeOf(settings).toBe<{
	required: string;
	optional?: number | undefined;
	readonly readonlyOptional?: symbol | undefined;
	nested: {
		optional?: boolean;
	};
}>();

({required: 'value', optional: undefined, nested: {}}) satisfies UndefinedOnPartial<Settings>;
({required: 'value', optional: 1, nested: {}}) satisfies UndefinedOnPartial<Settings>;

// @ts-expect-error A required key still cannot be set to `undefined`.
({required: undefined, nested: {}}) satisfies UndefinedOnPartial<Settings>;

// @ts-expect-error A nested optional key is unchanged.
({required: 'value', nested: {optional: undefined}}) satisfies UndefinedOnPartial<Settings>;

// @ts-expect-error The nested object is still required.
({required: 'value', optional: undefined}) satisfies UndefinedOnPartial<Settings>;

declare const specialValues: UndefinedOnPartial<{
	anything: any;
	input: unknown;
	impossible: never;
	optionalImpossible?: never;
	cleared?: undefined;
	optional?: string;
}>;
expectTypeOf(specialValues).toBe<{
	anything: any;
	input: unknown;
	impossible: never;
	optionalImpossible?: undefined;
	cleared?: undefined;
	optional?: string | undefined;
}>();

expectTypeOf<UndefinedOnPartial<{optional?: never}>>().toBe<{optional?: undefined}>();
expectTypeOf<UndefinedOnPartial<{optional?: unknown}>>().toBe<{optional?: unknown}>();
expectTypeOf<UndefinedOnPartial<{required: never}>>().toBe<{required: never}>();

// More value types that an optional key can have.
expectTypeOf<UndefinedOnPartial<{value?: void}>>().toBe<{value?: void | undefined}>();
expectTypeOf<UndefinedOnPartial<{value?: null}>>().toBe<{value?: null | undefined}>();
expectTypeOf<UndefinedOnPartial<{value?: string & {__brand: 'x'}}>>().toBe<{value?: (string & {__brand: 'x'}) | undefined}>();
expectTypeOf<UndefinedOnPartial<{value?: string | undefined}>>().toBe<{value?: string | undefined}>();
expectTypeOf<UndefinedOnPartial<{value: void}>>().toBe<{value: void | undefined}>();

// A required key that already accepts `undefined` still has to be provided.
expectTypeOf<UndefinedOnPartial<{value: string | undefined}>>().toBe<{value: string | undefined}>();
// @ts-expect-error The key stays required.
({}) satisfies UndefinedOnPartial<{value: string | undefined}>;

// This is what makes `undefined` assignable to an optional key under `exactOptionalPropertyTypes`.
// @ts-expect-error `undefined` is not assignable to a plain optional property.
({value: undefined}) satisfies {value?: string};
({value: undefined}) satisfies UndefinedOnPartial<{value?: string}>;

// An intersection and an inherited class are transformed key by key.
type Intersection = UndefinedOnPartial<{a?: string} & {b?: number}>;
expectTypeOf<Intersection>().toBe<{a?: string | undefined; b?: number | undefined}>();
({a: undefined, b: undefined}) satisfies Intersection;

declare class OptionalBase {
	base?: string;
	keep?: number;
}

declare class OptionalChild extends OptionalBase {
	child?: boolean;
}

expectTypeOf<UndefinedOnPartial<OptionalChild>>()
	.toBe<{base?: string | undefined; keep?: number | undefined; child?: boolean | undefined}>();
({base: undefined, keep: undefined, child: undefined}) satisfies UndefinedOnPartial<OptionalChild>;

// Containers and built-ins are kept as is, including their nested value types.
type ContainerValues = {
	array: Array<{optional?: string}>;
	readonlyArray: ReadonlyArray<{optional?: string}>;
	tuple: [{optional?: string}, (number | undefined)?];
	map: Map<string, {optional?: string}>;
	readonlyMap: ReadonlyMap<string, {optional?: string}>;
	weakMap: WeakMap<object, {optional?: string}>;
	set: Set<{optional?: string}>;
	readonlySet: ReadonlySet<{optional?: string}>;
	weakSet: WeakSet<{optional?: string}>;
	function: (value?: string) => number;
	constructor: new () => {optional?: string};
	date: Date;
	regexp: RegExp;
	typedArray: Uint8Array;
	arrayBuffer: ArrayBuffer;
	promise: Promise<{optional?: string}>;
};

declare const containers: UndefinedOnPartial<ContainerValues>;
expectTypeOf(containers).toBe<ContainerValues>();

expectTypeOf<UndefinedOnPartial<string[]>>().toBe<string[]>();
expectTypeOf<UndefinedOnPartial<readonly [string, number?]>>().toBe<readonly [string, number?]>();
expectTypeOf<UndefinedOnPartial<Map<string, {optional?: string}>>>().toBe<Map<string, {optional?: string}>>();
expectTypeOf<UndefinedOnPartial<ReadonlySet<{optional?: string}>>>().toBe<ReadonlySet<{optional?: string}>>();
expectTypeOf<UndefinedOnPartial<WeakMap<object, {optional?: string}>>>().toBe<WeakMap<object, {optional?: string}>>();
expectTypeOf<UndefinedOnPartial<() => void>>().toBe<() => void>();
expectTypeOf<UndefinedOnPartial<Date>>().toBe<Date>();
expectTypeOf<UndefinedOnPartial<RegExp>>().toBe<RegExp>();
expectTypeOf<UndefinedOnPartial<Uint8Array>>().toBe<Uint8Array>();
expectTypeOf<UndefinedOnPartial<ArrayBuffer>>().toBe<ArrayBuffer>();
expectTypeOf<UndefinedOnPartial<{element?: HTMLElement}>>().toBe<{element?: HTMLElement | undefined}>();

// A thenable at the top level is returned as is.
expectTypeOf<UndefinedOnPartial<Promise<{value?: string}>>>().toBe<Promise<{value?: string}>>();

// A union member that is a container is kept while the object members change.
expectTypeOf<UndefinedOnPartial<string[] | {a?: string}>>().toBe<string[] | {a?: string | undefined}>();

// On a type without nested objects, the shallow type matches the deep type.
type FlatShape = {value?: string; count: number; label?: string | undefined; cleared?: void};
expectTypeOf<UndefinedOnPartial<FlatShape>>().toBe<UndefinedOnPartialDeep<FlatShape>>();

// An index signature has no optional modifier, so it is kept as is.
expectTypeOf<UndefinedOnPartial<{[key: string]: string}>>().toBe<{[key: string]: string}>();
expectTypeOf<UndefinedOnPartial<{[key: number]: {optional?: string}}>>().toBe<{[key: number]: {optional?: string}}>();
expectTypeOf<UndefinedOnPartial<{[key: symbol]: string}>>().toBe<{[key: symbol]: string}>();
declare const mixedIndex: UndefinedOnPartial<{[key: string]: string | undefined; optional?: string; required: string}>;
expectTypeOf(mixedIndex).toBe<{[key: string]: string | undefined; optional?: string | undefined; required: string}>();
expectTypeOf<UndefinedOnPartial<{[key: `data-${string}`]: string | undefined; id?: string}>>()
	.toBe<{[key: `data-${string}`]: string | undefined; id?: string | undefined}>();
expectTypeOf<UndefinedOnPartial<{readonly [key: string]: string | undefined; id?: string}>>()
	.toBe<{readonly [key: string]: string | undefined; id?: string | undefined}>();
expectTypeOf<UndefinedOnPartial<{[key: number]: string | undefined; 0?: string}>>()
	.toBe<{[key: number]: string | undefined; 0?: string | undefined}>();

// A symbol-named optional key and an optional method are transformed too.
declare const optionalSymbol: unique symbol;
expectTypeOf<UndefinedOnPartial<{readonly [optionalSymbol]?: string}>>()
	.toBe<{readonly [optionalSymbol]?: string | undefined}>();
expectTypeOf<UndefinedOnPartial<{method?: () => void; other: () => void}>>()
	.toBe<{method?: (() => void) | undefined; other: () => void}>();

// The `?` and `readonly` modifiers are preserved.
declare let mutableOptional: UndefinedOnPartial<{optional?: string; required: number}>;
mutableOptional.optional = undefined;
// @ts-expect-error A required key does not accept `undefined`.
mutableOptional.required = undefined;

// A union is transformed member by member, and a non-object member is kept.
expectTypeOf<UndefinedOnPartial<{a?: string} | undefined>>().toBe<{a?: string | undefined} | undefined>();
expectTypeOf<UndefinedOnPartial<{a?: string} | {b: number}>>().toBe<{a?: string | undefined} | {b: number}>();
expectTypeOf<UndefinedOnPartial<string | {a?: string}>>().toBe<string | {a?: string | undefined}>();
expectTypeOf<UndefinedOnPartial<{a?: string} | null>>().toBe<{a?: string | undefined} | null>();

// Primitive and non-object inputs are returned as is.
expectTypeOf<UndefinedOnPartial<any>>().toBe<any>();
expectTypeOf<UndefinedOnPartial<never>>().toBe<never>();
expectTypeOf<UndefinedOnPartial<unknown>>().toBe<unknown>();
expectTypeOf<UndefinedOnPartial<undefined>>().toBe<undefined>();
expectTypeOf<UndefinedOnPartial<null>>().toBe<null>();
expectTypeOf<UndefinedOnPartial<string>>().toBe<string>();
expectTypeOf<UndefinedOnPartial<void>>().toBe<void>();
expectTypeOf<UndefinedOnPartial<symbol>>().toBe<symbol>();
expectTypeOf<UndefinedOnPartial<bigint>>().toBe<bigint>();
expectTypeOf<UndefinedOnPartial<boolean>>().toBe<boolean>();
expectTypeOf<UndefinedOnPartial<'a' | 'b'>>().toBe<'a' | 'b'>();
expectTypeOf<UndefinedOnPartial<object>>().toBe<object>();
expectTypeOf<UndefinedOnPartial<{}>>().toBe<{}>();

// A class constructor is a function, so it is kept as is, like the other `*Deep` types keep it.
declare class ClassWithOptionalStatic {
	static optional?: string;
	constructor();
}

expectTypeOf<UndefinedOnPartial<typeof ClassWithOptionalStatic>>().toBe<typeof ClassWithOptionalStatic>();

abstract class AbstractClassForTest {
	foo = 1;
}

expectTypeOf<IsEqual<UndefinedOnPartial<typeof AbstractClassForTest>, typeof AbstractClassForTest>>().toBe<true>();

// An instance type is an object, so its top-level optional properties are changed.
declare class InstanceWithOptional {
	readonly required: string;
	optional?: number;
}

expectTypeOf<UndefinedOnPartial<InstanceWithOptional>>().toBe<{readonly required: string; optional?: number | undefined}>();

// A generic value keeps its key and resolves once the value is known.
type GenericRequired<Value> = UndefinedOnPartial<{value: Value}>['value'];
expectTypeOf<GenericRequired<string>>().toBe<string>();
expectTypeOf<GenericRequired<string | undefined>>().toBe<string | undefined>();
expectTypeOf<GenericRequired<unknown>>().toBe<unknown>();
expectTypeOf<GenericRequired<any>>().toBe<any>();
expectTypeOf<GenericRequired<never>>().toBe<never>();

type GenericOptional<Value> = UndefinedOnPartial<{value?: Value}>['value'];
expectTypeOf<GenericOptional<string>>().toBe<string | undefined>();
expectTypeOf<GenericOptional<never>>().toBe<undefined>();

// A generic instantiation resolves the transformation for the given type.
declare function makeSettings<Value>(value: Value): UndefinedOnPartial<{value: Value; optional?: number; nested: {optional?: boolean}}>;
expectTypeOf(makeSettings('value')).toBe<{value: string; optional?: number | undefined; nested: {optional?: boolean}}>();

// A generic optional key accepts an explicit `undefined` at the call site.
declare function acceptOptional<Value>(settings: UndefinedOnPartial<{optional?: Value}>): void;
acceptOptional<string>({optional: undefined});
acceptOptional<string>({optional: 'x'});
// @ts-expect-error A value of another type is still rejected.
acceptOptional<string>({optional: 1});

declare function acceptRequired<Value>(settings: UndefinedOnPartial<{required: Value}>): void;
// @ts-expect-error A required key is not made optional.
acceptRequired<string>({});

// Inference through a `const` type parameter keeps `readonly` and the value type.
declare function makeConstSettings<const Input>(input: Input): UndefinedOnPartial<Input>;
expectTypeOf(makeConstSettings({required: 'x', optional: undefined as number | undefined}))
	.toBe<{readonly required: 'x'; readonly optional: number | undefined}>();
