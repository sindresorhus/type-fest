import {expectTypeOf} from 'nz';
import type {
	UndefinedToOptional,
	PartialOnUndefined,
	UndefinedOnPartial,
	Simplify,
	SetOptional,
	Merge,
	Tagged,
} from '../index.d.ts';

type Foo = {
	a: string;
	b?: string;
	c: undefined;
	d: number | undefined;
};

type OptionalFoo = UndefinedToOptional<Foo>;

declare const optionalFoo: OptionalFoo;

expectTypeOf(optionalFoo).toBe<{
	a: string;
	b?: string;
	c: undefined;
	d?: number;
}>();

// Strict optional fields permit omission, but reject an explicit `undefined`.
({a: 'value', c: undefined}) satisfies OptionalFoo;
({a: 'value', c: undefined, d: 1}) satisfies OptionalFoo;
// @ts-expect-error The optional value no longer includes `undefined`.
({a: 'value', c: undefined, d: undefined}) satisfies OptionalFoo;
// @ts-expect-error Required fields are not made optional.
({c: undefined}) satisfies OptionalFoo;
// @ts-expect-error An undefined-only field stays required.
({a: 'value'}) satisfies OptionalFoo;

// Preserve alternatives rather than combining independent union members.
expectTypeOf<UndefinedToOptional<{kind: 'text'; value: string | undefined} | {kind: 'count'; value: number | undefined}>>()
	.toBe<{kind: 'text'; value?: string} | {kind: 'count'; value?: number}>();
expectTypeOf<UndefinedToOptional<{left: string | undefined} | {right: number | undefined}>>()
	.toBe<{left?: string} | {right?: number}>();
// @ts-expect-error A value must belong to its discriminated variant.
({kind: 'text', value: 1}) satisfies UndefinedToOptional<{kind: 'text'; value: string | undefined} | {kind: 'count'; value: number | undefined}>;

// Broad value types do not describe a union with `undefined`.
expectTypeOf<UndefinedToOptional<{anything: any; input: unknown; impossible: never}>>()
	.toBe<{anything: any; input: unknown; impossible: never}>();
expectTypeOf<UndefinedToOptional<any>>().toBe<any>();
expectTypeOf<UndefinedToOptional<never>>().toBe<never>();
expectTypeOf<UndefinedToOptional<unknown>>().toBe<unknown>();

// Index signatures cannot be optional, so keep their original values.
expectTypeOf<UndefinedToOptional<Record<string, string | undefined>>>().toBe<Record<string, string | undefined>>();
expectTypeOf<UndefinedToOptional<{[key: string]: number | undefined; id: number; count: number | undefined}>>()
	.toBe<{[key: string]: number | undefined; id: number; count?: number}>();
expectTypeOf<UndefinedToOptional<{[key: number]: boolean | undefined; 0: boolean | undefined}>>()
	.toBe<{[key: number]: boolean | undefined; 0?: boolean}>();
expectTypeOf<UndefinedToOptional<{readonly [key: symbol]: string | undefined}>>()
	.toBe<{readonly [key: symbol]: string | undefined}>();
expectTypeOf<UndefinedToOptional<{[key: `data-${string}`]: string | undefined; label: string | undefined}>>()
	.toBe<{[key: `data-${string}`]: string | undefined; label?: string}>();

// Non-record inputs and containers are kept intact, and an object without properties stays the same.
expectTypeOf<UndefinedToOptional<string>>().toBe<string>();
expectTypeOf<UndefinedToOptional<null>>().toBe<null>();
expectTypeOf<UndefinedToOptional<undefined>>().toBe<undefined>();
expectTypeOf<UndefinedToOptional<void>>().toBe<void>();
expectTypeOf<UndefinedToOptional<object>>().toBe<object>();
expectTypeOf<UndefinedToOptional<{}>>().toBe<{}>();
expectTypeOf<UndefinedToOptional<string[]>>().toBe<string[]>();
expectTypeOf<UndefinedToOptional<readonly [string | undefined, number?]>>().toBe<readonly [string | undefined, number?]>();
expectTypeOf<UndefinedToOptional<() => string>>().toBe<() => string>();
expectTypeOf<UndefinedToOptional<Date>>().toBe<Date>();
expectTypeOf<UndefinedToOptional<Map<string, string | undefined>>>().toBe<Map<string, string | undefined>>();

// Already optional fields lose `undefined` too, except undefined-only fields. Other values lose only the `undefined` member.
expectTypeOf<UndefinedToOptional<{value?: string | undefined}>>().toBe<{value?: string}>();
expectTypeOf<UndefinedToOptional<{value?: string}>>().toBe<{value?: string}>();
expectTypeOf<UndefinedToOptional<{value?: undefined}>>().toBe<{value?: undefined}>();
expectTypeOf<UndefinedToOptional<{value?: never}>>().toBe<{value?: never}>();
expectTypeOf<UndefinedToOptional<{value?: any; input?: unknown}>>().toBe<{value?: any; input?: unknown}>();
expectTypeOf<UndefinedToOptional<{value: null}>>().toBe<{value: null}>();
expectTypeOf<UndefinedToOptional<{value: null | undefined}>>().toBe<{value?: null}>();
expectTypeOf<UndefinedToOptional<{value: void}>>().toBe<{value?: void}>();
expectTypeOf<UndefinedToOptional<{value: 'auto' | 0 | false | undefined}>>().toBe<{value?: 'auto' | 0 | false}>();

// Preserve readonly modifiers on both changed and unchanged fields.
expectTypeOf<UndefinedToOptional<{readonly id: string; readonly value: number | undefined; readonly empty: undefined}>>()
	.toBe<{readonly id: string; readonly value?: number; readonly empty: undefined}>();
declare let readonlySettings: UndefinedToOptional<{readonly value: string | undefined}>;
// @ts-expect-error Optionalizing a field does not make it writable.
readonlySettings.value = 'changed';

// Numeric and unique symbol properties receive the same transformation.
declare const settingKey: unique symbol;
expectTypeOf<UndefinedToOptional<{readonly [settingKey]: string | undefined; 0: number | undefined; '1': boolean}>>()
	.toBe<{readonly [settingKey]?: string; 0?: number; '1': boolean}>();

// Only top-level properties change, including recursive structures.
type Node = {name: string; next: Node | undefined};
expectTypeOf<UndefinedToOptional<Node>>().toBe<{name: string; next?: Node}>();
expectTypeOf<UndefinedToOptional<{nested: {value: string | undefined} | undefined}>>()
	.toBe<{nested?: {value: string | undefined}}>();
// @ts-expect-error Nested fields still have to be provided.
({nested: {}}) satisfies UndefinedToOptional<{nested: {value: string | undefined} | undefined}>;
expectTypeOf<UndefinedToOptional<{array: Array<string | undefined> | undefined}>>()
	.toBe<{array?: Array<string | undefined>}>();
expectTypeOf<UndefinedToOptional<{callback: (() => void) | undefined; method(): string | undefined}>>()
	.toBe<{callback?: () => void; method(): string | undefined}>();

// Intersections and inherited fields are transformed as object properties.
expectTypeOf<UndefinedToOptional<{a: string | undefined} & {b: number | undefined}>>()
	.toBe<{a?: string; b?: number}>();
declare class BaseSettings {
	id: string;
	value: string | undefined;
}
declare class ExtendedSettings extends BaseSettings {
	count: number | undefined;
}
expectTypeOf<UndefinedToOptional<ExtendedSettings>>().toBe<{id: string; value?: string; count?: number}>();

// Applying the transformation twice is stable.
expectTypeOf<UndefinedToOptional<OptionalFoo>>().toBe<OptionalFoo>();

// Nullish union members are kept next to the transformed object.
expectTypeOf<UndefinedToOptional<{value: string | undefined} | null | undefined>>()
	.toBe<{value?: string} | null | undefined>();

// Generic property types resolve without losing their keys or values.
type GenericSettings<Value> = UndefinedToOptional<{id: string; value: Value}>;
expectTypeOf<GenericSettings<string>>().toBe<{id: string; value: string}>();
expectTypeOf<GenericSettings<string | undefined>>().toBe<{id: string; value?: string}>();
expectTypeOf<GenericSettings<undefined>>().toBe<{id: string; value: undefined}>();
expectTypeOf<GenericSettings<never>>().toBe<{id: string; value: never}>();
expectTypeOf<GenericSettings<unknown>>().toBe<{id: string; value: unknown}>();
expectTypeOf<GenericSettings<any>>().toBe<{id: string; value: any}>();

// Built-in containers, built-in values, and constructors keep their contained values.
expectTypeOf<UndefinedToOptional<ReadonlyMap<string, string | undefined>>>().toBe<ReadonlyMap<string, string | undefined>>();
expectTypeOf<UndefinedToOptional<Set<{value: string | undefined}>>>().toBe<Set<{value: string | undefined}>>();
expectTypeOf<UndefinedToOptional<Promise<{value: string | undefined}>>>().toBe<Promise<{value: string | undefined}>>();
expectTypeOf<UndefinedToOptional<Uint8Array>>().toBe<Uint8Array>();
expectTypeOf<UndefinedToOptional<abstract new () => {value: string | undefined}>>()
	.toBe<abstract new () => {value: string | undefined}>();

// Existing optional fields also reject explicitly supplied `undefined`.
// @ts-expect-error The explicit union is removed from existing optional fields.
({value: undefined}) satisfies UndefinedToOptional<{value?: string | undefined}>;
({value: undefined}) satisfies UndefinedToOptional<{value?: undefined}>;
// @ts-expect-error A present optional-never field still accepts no values.
({value: undefined}) satisfies UndefinedToOptional<{value?: never}>;

// Preserve inference through the exported type.
declare function normalize<const Input>(input: Input): UndefinedToOptional<Input>;
expectTypeOf(normalize({id: 'editor', value: undefined as number | undefined}))
	.toBe<{readonly id: 'editor'; readonly value?: number}>();

// Undefined-only, function, symbol, and `never` values, and symbol keys, are kept as is.
type NonJsonProperties = {empty: undefined; callback: () => void; token: symbol; impossible: never; [settingKey]: number};
expectTypeOf<UndefinedToOptional<NonJsonProperties>>().toBe<NonJsonProperties>();

// Enum, boolean, bigint, and symbol values lose only the `undefined` member.
enum Color {
	Red = 'red',
	Blue = 'blue',
}
declare const token: unique symbol;
expectTypeOf<UndefinedToOptional<{color: Color | undefined; member: Color.Red | undefined}>>().toBe<{color?: Color; member?: Color.Red}>();
expectTypeOf<UndefinedToOptional<{flag: boolean | undefined; yes: true | undefined}>>().toBe<{flag?: boolean; yes?: true}>();
expectTypeOf<UndefinedToOptional<{big: bigint | undefined; literal: 1n | undefined}>>().toBe<{big?: bigint; literal?: 1n}>();
expectTypeOf<UndefinedToOptional<{sym: symbol | undefined; unique: typeof token | undefined}>>().toBe<{sym?: symbol; unique?: typeof token}>();
expectTypeOf<UndefinedToOptional<{value: `id-${number}` | undefined}>>().toBe<{value?: `id-${number}`}>();
expectTypeOf<UndefinedToOptional<{a: {} | undefined; b: object | undefined; c: (string & {}) | undefined}>>().toBe<{a?: {}; b?: object; c?: string & {}}>();

// A union with `any`, `unknown`, or `never` collapses before the check.
expectTypeOf<UndefinedToOptional<{a: any | undefined; b: unknown | undefined; c: never | undefined}>>().toBe<{a: any; b: unknown; c: undefined}>();

// `void` stays in the value, with or without other members.
expectTypeOf<UndefinedToOptional<{a: void | undefined; b: void | null; c: void | string}>>().toBe<{a?: void; b?: void | null; c?: void | string}>();
expectTypeOf<UndefinedToOptional<{value?: void}>>().toBe<{value?: void}>();
({value: undefined}) satisfies UndefinedToOptional<{value: void}>;
({}) satisfies UndefinedToOptional<{value: void}>;

// Primitive inputs, including a union of them, are kept as is.
expectTypeOf<UndefinedToOptional<symbol>>().toBe<symbol>();
expectTypeOf<UndefinedToOptional<bigint>>().toBe<bigint>();
expectTypeOf<UndefinedToOptional<boolean>>().toBe<boolean>();
expectTypeOf<UndefinedToOptional<'a' | 1 | undefined>>().toBe<'a' | 1 | undefined>();
expectTypeOf<UndefinedToOptional<Color.Red>>().toBe<Color.Red>();

// A tagged primitive is kept, and a tagged object keeps its tag.
type UserId = Tagged<string, 'UserId'>;
type TaggedSettings = Tagged<{value: string | undefined}, 'Settings'>;
expectTypeOf<UndefinedToOptional<UserId>>().toBe<UserId>();
expectTypeOf<UndefinedToOptional<{id: UserId | undefined}>>().toBe<{id?: UserId}>();
expectTypeOf<UndefinedToOptional<TaggedSettings>>().toBeAssignableTo<Tagged<{value?: string}, 'Settings'>>();
expectTypeOf<UndefinedToOptional<TaggedSettings>['value']>().toBe<string | undefined>();

// Optional and readonly modifiers combine.
expectTypeOf<UndefinedToOptional<{readonly a?: string | undefined; readonly b?: string; readonly c?: undefined}>>()
	.toBe<{readonly a?: string; readonly b?: string; readonly c?: undefined}>();

// Interfaces, including merged and extended ones, are transformed like type aliases.
/* eslint-disable @typescript-eslint/consistent-type-definitions -- Interfaces are the subject of these tests. */
interface SettingsInterface {
	id: string;
	value: number | undefined;
}
interface MergedInterface {
	a: string | undefined;
}
interface MergedInterface {
	b: number;
}
interface ChildInterface extends SettingsInterface {
	extra: boolean | undefined;
}
interface EmptyInterface {}
expectTypeOf<UndefinedToOptional<SettingsInterface>>().toBe<{id: string; value?: number}>();
expectTypeOf<UndefinedToOptional<MergedInterface>>().toBe<{a?: string; b: number}>();
expectTypeOf<UndefinedToOptional<ChildInterface>>().toBe<{id: string; value?: number; extra?: boolean}>();
expectTypeOf<UndefinedToOptional<EmptyInterface>>().toBe<{}>();

// An object with a call or construct signature is a function, so its properties are kept as is.
interface CallableSettings {
	(): void;
	value: string | undefined;
}
interface ConstructableSettings {
	new (): object;
	value: string | undefined;
}
/* eslint-enable @typescript-eslint/consistent-type-definitions */
expectTypeOf<UndefinedToOptional<CallableSettings>>().toBe<CallableSettings>();
expectTypeOf<UndefinedToOptional<ConstructableSettings>>().toBe<ConstructableSettings>();
expectTypeOf<UndefinedToOptional<(() => void) & {label: string | undefined}>>().toBe<(() => void) & {label: string | undefined}>();
expectTypeOf<UndefinedToOptional<{handler: ((() => void) & {label: string | undefined}) | undefined}>>()
	.toBe<{handler?: (() => void) & {label: string | undefined}}>();
expectTypeOf<UndefinedToOptional<{optionalMethod?(): void; create: (new () => object) | undefined}>>()
	.toBe<{optionalMethod?: () => void; create?: new () => object}>();

// Only the public instance members of a class are transformed.
/* eslint-disable @typescript-eslint/no-unused-private-class-members -- The private members only exist to show that they are left out. */
declare class Members {
	static shared: string | undefined;
	readonly #hidden: string | undefined;
	private readonly secret: string | undefined;
	protected guarded: string | undefined;
	visible: string | undefined;
	method(): void;
}
/* eslint-enable @typescript-eslint/no-unused-private-class-members */
expectTypeOf<UndefinedToOptional<Members>>().toBe<{visible?: string; method: () => void}>();
expectTypeOf<UndefinedToOptional<typeof Members>>().toBe<typeof Members>();

// Accessors use the getter type, and a getter without a setter stays readonly.
declare class Accessors {
	get readOnly(): string | undefined;
	get both(): string | undefined;
	set both(value: string | undefined);
	get widerSetter(): string;
	set widerSetter(value: string | undefined);
}
expectTypeOf<UndefinedToOptional<Accessors>>().toBe<{readonly readOnly?: string; both?: string; widerSetter: string}>();

// Abstract members, generic classes, and polymorphic `this` resolve to the instance type.
declare abstract class AbstractSettings {
	abstract value: string | undefined;
	abstract id: number;
}
declare class Box<Value> {
	value: Value | undefined;
	self: this | undefined;
}
expectTypeOf<UndefinedToOptional<AbstractSettings>>().toBe<{value?: string; id: number}>();
expectTypeOf<UndefinedToOptional<typeof AbstractSettings>>().toBe<typeof AbstractSettings>();
expectTypeOf<UndefinedToOptional<Box<string>>>().toBe<{value?: string; self?: Box<string>}>();

// A subclass of a container or built-in is kept as is, including its own fields.
declare class ExtendedMap extends Map<string, string> {
	extra: string | undefined;
}
declare class ExtendedSet extends Set<string> {
	extra: string | undefined;
}
declare class ExtendedArray extends Array<string> {
	extra: string | undefined;
}
declare class ExtendedDate extends Date {
	extra: string | undefined;
}
declare class ExtendedPromise extends Promise<string> {
	extra: string | undefined;
}
expectTypeOf<UndefinedToOptional<ExtendedMap>>().toBe<ExtendedMap>();
expectTypeOf<UndefinedToOptional<ExtendedSet>>().toBe<ExtendedSet>();
expectTypeOf<UndefinedToOptional<ExtendedArray>>().toBe<ExtendedArray>();
expectTypeOf<UndefinedToOptional<ExtendedDate>>().toBe<ExtendedDate>();
expectTypeOf<UndefinedToOptional<ExtendedPromise>>().toBe<ExtendedPromise>();
expectTypeOf<UndefinedToOptional<{then(): void; value: string | undefined}>>().toBe<{then(): void; value?: string}>();

// A subclass of `Error` is an ordinary object, so its fields are transformed.
declare class ExtendedError extends Error {
	code: string | undefined;
}
expectTypeOf<UndefinedToOptional<ExtendedError>>().toBe<{name: string; message: string; stack?: string; cause?: unknown; code?: string}>();

// More built-ins are kept as is.
expectTypeOf<UndefinedToOptional<{value: Promise<string | undefined> | undefined; element: HTMLElement | undefined}>>()
	.toBe<{value?: Promise<string | undefined>; element?: HTMLElement}>();
expectTypeOf<UndefinedToOptional<[a: string | undefined, b?: number, ...rest: Array<boolean | undefined>]>>()
	.toBe<[a: string | undefined, b?: number, ...rest: Array<boolean | undefined>]>();
expectTypeOf<UndefinedToOptional<{tuple: [string | undefined, number?] | undefined}>>().toBe<{tuple?: [string | undefined, number?]}>();
expectTypeOf<UndefinedToOptional<Array<{value: string | undefined}>>>().toBe<Array<{value: string | undefined}>>();

// Array-like objects and iterator results are plain objects.
expectTypeOf<UndefinedToOptional<ArrayLike<string | undefined>>>().toBe<{readonly [index: number]: string | undefined; readonly length: number}>();
expectTypeOf<UndefinedToOptional<IteratorResult<string, undefined>>>().toBe<{done?: false; value: string} | {done: true; value: undefined}>();

// Records with literal keys are transformed, and records with broad keys are kept.
expectTypeOf<UndefinedToOptional<Record<'a' | 'b', string | undefined>>>().toBe<{a?: string; b?: string}>();
expectTypeOf<UndefinedToOptional<Partial<Record<Color, number | undefined>>>>().toBe<{red?: number; blue?: number}>();
expectTypeOf<UndefinedToOptional<Record<'a' | `x-${string}`, string | undefined>>>().toBe<{[key: `x-${string}`]: string | undefined; a?: string}>();
expectTypeOf<UndefinedToOptional<Record<number, string | undefined>>>().toBe<Record<number, string | undefined>>();
expectTypeOf<UndefinedToOptional<Record<PropertyKey, string | undefined>>>().toBe<Record<PropertyKey, string | undefined>>();
expectTypeOf<UndefinedToOptional<Partial<Record<string, string>>>>().toBe<Record<string, string | undefined>>();
expectTypeOf<UndefinedToOptional<Record<string, never>>>().toBe<Record<string, never>>();
expectTypeOf<UndefinedToOptional<Record<string, undefined>>>().toBe<Record<string, undefined>>();
expectTypeOf<UndefinedToOptional<Record<string, unknown>>>().toBe<Record<string, unknown>>();
expectTypeOf<UndefinedToOptional<Record<string, any>>>().toBe<Record<string, any>>();
expectTypeOf<UndefinedToOptional<Record<never, never>>>().toBe<{}>();

// Several index signatures are kept together, also when a literal key matches one.
expectTypeOf<UndefinedToOptional<{[key: string]: string | undefined; [key: number]: string; [key: symbol]: number | undefined; id: string | undefined}>>()
	.toBe<{[key: string]: string | undefined; [key: number]: string; [key: symbol]: number | undefined; id?: string}>();
expectTypeOf<UndefinedToOptional<{[key: `data-${string}`]: string | undefined; 'data-id': string | undefined}>>()
	.toBe<{[key: `data-${string}`]: string | undefined; 'data-id'?: string}>();
expectTypeOf<UndefinedToOptional<{[key: string]: unknown; id: string | undefined}>>().toBe<{[key: string]: unknown; id?: string}>();
expectTypeOf<UndefinedToOptional<Pick<{[key: string]: string | undefined; a: string | undefined}, 'a'>>>().toBe<{a?: string}>();
({other: undefined}) satisfies UndefinedToOptional<{[key: string]: string | undefined; id: string | undefined}>;
// @ts-expect-error A known key rejects `undefined` even when the index signature accepts it.
({id: undefined}) satisfies UndefinedToOptional<{[key: string]: string | undefined; id: string | undefined}>;

// Keys from a mapped type with key remapping are transformed.
expectTypeOf<UndefinedToOptional<{[Key in 'a' | 'b' as `get${Uppercase<Key>}`]: Key | undefined}>>().toBe<{getA?: 'a'; getB?: 'b'}>();

// Keys that look alike, and keys named like prototype members, stay separate.
expectTypeOf<UndefinedToOptional<{0: string | undefined; '0.0': number | undefined; '-1': boolean | undefined; 1.5: null}>>()
	.toBe<{0?: string; '0.0'?: number; '-1'?: boolean; 1.5: null}>();
expectTypeOf<UndefinedToOptional<{'': string | undefined; 'a-b': number | undefined; constructor: string | undefined; toString: (() => string) | undefined}>>()
	.toBe<{''?: string; 'a-b'?: number; constructor?: string; toString?: () => string}>();

// Built-in utility types compose in both directions.
type Base = {a: string; b: number | undefined; c?: boolean};
expectTypeOf<UndefinedToOptional<Partial<Base>>>().toBe<{a?: string; b?: number; c?: boolean}>();
expectTypeOf<UndefinedToOptional<Required<Base>>>().toBe<{a: string; b?: number; c: boolean}>();
expectTypeOf<UndefinedToOptional<Readonly<Base>>>().toBe<{readonly a: string; readonly b?: number; readonly c?: boolean}>();
expectTypeOf<UndefinedToOptional<Pick<Base, 'b'>>>().toBe<{b?: number}>();
expectTypeOf<UndefinedToOptional<Omit<Base, 'a'>>>().toBe<{b?: number; c?: boolean}>();
expectTypeOf<Required<UndefinedToOptional<Base>>>().toBe<{a: string; b: number; c: boolean}>();
expectTypeOf<keyof UndefinedToOptional<Base>>().toBe<'a' | 'b' | 'c'>();
expectTypeOf<UndefinedToOptional<Base>['b']>().toBe<number | undefined>();

// Other type-fest types compose in both directions.
expectTypeOf<UndefinedToOptional<PartialOnUndefined<Base>>>().toBe<{a: string; b?: number; c?: boolean}>();
expectTypeOf<PartialOnUndefined<UndefinedToOptional<Base>>>().toBe<{a: string; b?: number; c?: boolean}>();
expectTypeOf<UndefinedOnPartial<UndefinedToOptional<Base>>>().toBe<{a: string; b?: number | undefined; c?: boolean | undefined}>();
expectTypeOf<UndefinedToOptional<UndefinedOnPartial<Base>>>().toBe<{a: string; b?: number; c?: boolean}>();
expectTypeOf<Simplify<UndefinedToOptional<Base>>>().toBe<{a: string; b?: number; c?: boolean}>();
expectTypeOf<UndefinedToOptional<SetOptional<Base, 'a'>>>().toBe<{a?: string; b?: number; c?: boolean}>();
expectTypeOf<UndefinedToOptional<Merge<Base, {a: number | undefined; d: undefined}>>>().toBe<{a?: number; b?: number; c?: boolean; d: undefined}>();

// The result is assignable to the `PartialOnUndefined` result, but not the reverse.
expectTypeOf<UndefinedToOptional<Base>>().toBeAssignableTo<PartialOnUndefined<Base>>();
expectTypeOf<PartialOnUndefined<Base>>().not.toBeAssignableTo<UndefinedToOptional<Base>>();
expectTypeOf<Base>().not.toBeAssignableTo<UndefinedToOptional<Base>>();
expectTypeOf<UndefinedToOptional<Base>>().not.toBeAssignableTo<Base>();

// Overlapping intersection members are combined before the check.
expectTypeOf<UndefinedToOptional<{a: string | undefined} & {a: string}>>().toBe<{a: string}>();
expectTypeOf<UndefinedToOptional<{a?: string} & {a: string | undefined}>>().toBe<{a?: string}>();
expectTypeOf<UndefinedToOptional<{a: string | undefined} & {a: number | undefined}>>().toBe<{a: undefined}>();
expectTypeOf<UndefinedToOptional<{a: string | undefined} & Record<string, string | undefined>>>().toBe<{[key: string]: string | undefined; a?: string}>();

// A union keeps its primitive, array, function, and built-in members.
expectTypeOf<UndefinedToOptional<string | number[] | [boolean] | (() => void) | Map<string, number> | Date | {value: string | undefined}>>()
	.toBe<string | number[] | [boolean] | (() => void) | Map<string, number> | Date | {value?: string}>();
expectTypeOf<UndefinedToOptional<boolean | {a: 1 | undefined}>>().toBe<boolean | {a?: 1}>();
expectTypeOf<UndefinedToOptional<{a: string | undefined} | {a: number}>>().toBe<{a?: string} | {a: number}>();
expectTypeOf<UndefinedToOptional<{value: {a: 1} | {b: 2 | undefined} | undefined}>>().toBe<{value?: {a: 1} | {b: 2 | undefined}}>();

// An unresolved type parameter keeps the known keys readable.
function readOptional<Type extends {id: string | undefined}>(input: UndefinedToOptional<Type>): string | undefined {
	return input.id;
}

function readRequired<Type extends {id: string}>(input: UndefinedToOptional<Type>): string {
	return input.id;
}

function convert<Type extends {id: string; value: number | undefined}>(input: Type): UndefinedToOptional<Type> {
	// @ts-expect-error The input can hold an explicit `undefined`.
	return input;
}

// A generic value that accepts `undefined` makes the key optional at the call site.
declare function accept<Value>(settings: UndefinedToOptional<{value: Value | undefined}>): void;
accept<string>({});
accept<string>({value: 'x'});
// @ts-expect-error An explicit `undefined` is rejected.
accept<string>({value: undefined});
// @ts-expect-error The present value still has to match the generic type.
accept<string>({value: 1});
accept<string | undefined>({});
accept<unknown>({value: undefined});

// The original type is not assignable in either direction.
type Source = {id: string; value: number | undefined};
declare const source: Source;
declare const converted: UndefinedToOptional<Source>;
// @ts-expect-error The source can hold an explicit `undefined`.
source satisfies UndefinedToOptional<Source>;
// @ts-expect-error The converted value can omit the key.
converted satisfies Source;
// @ts-expect-error Excess properties are still rejected.
({id: 'a', extra: 1}) satisfies UndefinedToOptional<Source>;
({}) satisfies UndefinedToOptional<{a: string | undefined; b?: number}>;
({value: null}) satisfies UndefinedToOptional<{value: null | undefined}>;
({value: undefined}) satisfies UndefinedToOptional<{value?: any; input?: unknown}>;
({input: undefined}) satisfies UndefinedToOptional<{value?: any; input?: unknown}>;
// @ts-expect-error A discriminated variant rejects an explicit `undefined`.
({kind: 'text', value: undefined}) satisfies UndefinedToOptional<{kind: 'text'; value: string | undefined} | {kind: 'count'; value: number | undefined}>;
({kind: 'count'}) satisfies UndefinedToOptional<{kind: 'text'; value: string | undefined} | {kind: 'count'; value: number | undefined}>;

// A writable optional field accepts a value but not `undefined`.
declare const writable: UndefinedToOptional<{value: string | undefined}>;
writable.value = 'changed';
// @ts-expect-error An explicit `undefined` cannot be assigned.
writable.value = undefined;
delete writable.value;

// An index signature that includes `void` gets `undefined` added.
expectTypeOf<UndefinedToOptional<Record<string, void>>>().toBe<Record<string, void | undefined>>();
expectTypeOf<Record<string, void>>().toBeAssignableTo<UndefinedToOptional<Record<string, void>>>();
expectTypeOf<UndefinedToOptional<Record<string, void>>>().toBeAssignableTo<Record<string, void>>();
