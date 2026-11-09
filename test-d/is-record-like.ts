import {expectTypeOf} from 'nz';
import type {ConditionalPickDeep, IsRecordLike, Primitive, ReadonlyDate, Tagged, TypedArray, UnknownRecord} from '../index.d.ts';

// Record-like objects include object literals, interfaces, and class instances, but exclude call and construct signatures, arrays, and primitives.
expectTypeOf<IsRecordLike<{}>>().toBe<true>();
expectTypeOf<IsRecordLike<object>>().toBe<true>();
expectTypeOf<IsRecordLike<{a: 1}>>().toBe<true>();
expectTypeOf<IsRecordLike<{a: 1} & {b: 2}>>().toBe<true>();
expectTypeOf<IsRecordLike<{readonly name?: string; count: number | undefined}>>().toBe<true>();
expectTypeOf<IsRecordLike<{impossible: never; anything: any; unresolved: unknown}>>().toBe<true>();

// Index signatures describe records too, including numeric, symbol, and template-pattern domains.
expectTypeOf<IsRecordLike<Record<string, unknown>>>().toBe<true>();
expectTypeOf<IsRecordLike<Record<number, string>>>().toBe<true>();
expectTypeOf<IsRecordLike<Record<symbol, number>>>().toBe<true>();
expectTypeOf<IsRecordLike<Record<`data-${string}`, boolean>>>().toBe<true>();
expectTypeOf<IsRecordLike<UnknownRecord>>().toBe<true>();
declare const field: unique symbol;
expectTypeOf<IsRecordLike<{readonly [field]: string; 0: number}>>().toBe<true>();

// An array-like object is a record, unlike an array.
expectTypeOf<IsRecordLike<ArrayLike<string>>>().toBe<true>();

// Methods and properties named like special operations do not make the object callable or constructible.
expectTypeOf<IsRecordLike<{run(): void}>>().toBe<true>();
expectTypeOf<IsRecordLike<{constructor: () => void; prototype: object}>>().toBe<true>();
expectTypeOf<IsRecordLike<{then: string}>>().toBe<true>();
expectTypeOf<IsRecordLike<{then(): void}>>().toBe<true>();
expectTypeOf<IsRecordLike<{[Symbol.toStringTag]: 'Map'; value: string}>>().toBe<true>();

// Type aliases and interfaces need no index signature, and private fields do not make an instance opaque.
// `PropertyDescriptor` is a standard-library interface.
type Settings = {
	name: string;
};

class Account {
	readonly #secret: string;
	name = 'Ada';

	constructor(secret: string) {
		this.#secret = secret;
	}

	save() {
		return this.#secret;
	}
}

declare abstract class AbstractAccount {
	name: string;
}

expectTypeOf<IsRecordLike<PropertyDescriptor>>().toBe<true>();
expectTypeOf<IsRecordLike<Settings>>().toBe<true>();
expectTypeOf<IsRecordLike<Account>>().toBe<true>();
expectTypeOf<IsRecordLike<AbstractAccount>>().toBe<true>();
expectTypeOf<IsRecordLike<typeof Account>>().toBe<false>();
expectTypeOf<IsRecordLike<typeof AbstractAccount>>().toBe<false>();

// A generic class instance is a record too; its constructor is not.
declare class Box<Value> {
	value: Value;
}

expectTypeOf<IsRecordLike<Box<string>>>().toBe<true>();
expectTypeOf<IsRecordLike<typeof Box>>().toBe<false>();

// A constructor stays a leaf, including a generic one and one with extra own properties.
expectTypeOf<IsRecordLike<new () => 1>>().toBe<false>();
expectTypeOf<IsRecordLike<abstract new () => object>>().toBe<false>();
expectTypeOf<IsRecordLike<typeof Map>>().toBe<false>();
expectTypeOf<IsRecordLike<typeof Date>>().toBe<false>();
expectTypeOf<IsRecordLike<new <Value>(value: Value) => Value>>().toBe<false>();
expectTypeOf<IsRecordLike<{new (): object; name: number}>>().toBe<false>();

declare class GenericConstructor<Value> {
	constructor(value: Value);
}

expectTypeOf<IsRecordLike<typeof GenericConstructor>>().toBe<false>();

// Classification is shallow, so recursive records and branded records do not need special handling.
type Tree = {value: string; children: Tree[]};
expectTypeOf<IsRecordLike<Tree>>().toBe<true>();
expectTypeOf<IsRecordLike<Tagged<{id: number}, 'Account'>>>().toBe<true>();
expectTypeOf<IsRecordLike<Tagged<string, 'AccountId'>>>().toBe<false>();

// Primitive intersections stay primitive; boxed primitives and unlisted built-ins remain objects.
expectTypeOf<IsRecordLike<Primitive>>().toBe<false>();
expectTypeOf<IsRecordLike<1>>().toBe<false>();
expectTypeOf<IsRecordLike<string>>().toBe<false>();
expectTypeOf<IsRecordLike<void>>().toBe<false>();
expectTypeOf<IsRecordLike<number & {unit: 'pixels'}>>().toBe<false>();
expectTypeOf<IsRecordLike<InstanceType<typeof String>>>().toBe<true>();
expectTypeOf<IsRecordLike<InstanceType<typeof Number>>>().toBe<true>();
expectTypeOf<IsRecordLike<InstanceType<typeof Boolean>>>().toBe<true>();
expectTypeOf<IsRecordLike<BigInt>>().toBe<true>();
expectTypeOf<IsRecordLike<Symbol>>().toBe<true>();
expectTypeOf<IsRecordLike<Object>>().toBe<true>();
expectTypeOf<IsRecordLike<Error>>().toBe<true>();
expectTypeOf<IsRecordLike<URL>>().toBe<true>();
expectTypeOf<IsRecordLike<Iterable<string>>>().toBe<true>();
expectTypeOf<IsRecordLike<Blob>>().toBe<true>();
expectTypeOf<IsRecordLike<File>>().toBe<true>();

// Nullish values and the remaining primitive kinds are leaves too.
expectTypeOf<IsRecordLike<null>>().toBe<false>();
expectTypeOf<IsRecordLike<undefined>>().toBe<false>();
expectTypeOf<IsRecordLike<bigint>>().toBe<false>();
expectTypeOf<IsRecordLike<symbol>>().toBe<false>();
expectTypeOf<IsRecordLike<boolean>>().toBe<false>();
expectTypeOf<IsRecordLike<true>>().toBe<false>();
expectTypeOf<IsRecordLike<0n>>().toBe<false>();
expectTypeOf<IsRecordLike<`data-${string}`>>().toBe<false>();
declare const uniqueIdentifier: unique symbol;
expectTypeOf<IsRecordLike<typeof uniqueIdentifier>>().toBe<false>();

// The enum namespace object is a record; its members are primitive values.
enum Status {
	Active = 'active',
	Inactive = 'inactive',
}

enum Code {
	Ok = 200,
	NotFound = 404,
}

expectTypeOf<IsRecordLike<typeof Status>>().toBe<true>();
expectTypeOf<IsRecordLike<Status>>().toBe<false>();
expectTypeOf<IsRecordLike<typeof Code>>().toBe<true>();
expectTypeOf<IsRecordLike<Code>>().toBe<false>();

// Both mutable and readonly arrays are opaque, regardless of their element shape or length.
expectTypeOf<IsRecordLike<[]>>().toBe<false>();
expectTypeOf<IsRecordLike<readonly [string, number?]>>().toBe<false>();
expectTypeOf<IsRecordLike<[string, ...number[]]>>().toBe<false>();
expectTypeOf<IsRecordLike<Array<{id: number}>>>().toBe<false>();
expectTypeOf<IsRecordLike<readonly unknown[]>>().toBe<false>();
expectTypeOf<IsRecordLike<readonly []>>().toBe<false>();
expectTypeOf<IsRecordLike<never[]>>().toBe<false>();
expectTypeOf<IsRecordLike<string[] & {label: string}>>().toBe<false>();
expectTypeOf<IsRecordLike<readonly string[] & {label: string}>>().toBe<false>();

// Functions stay opaque, including with properties, overloads, or generic signatures.
expectTypeOf<IsRecordLike<() => void>>().toBe<false>();
expectTypeOf<IsRecordLike<Function>>().toBe<false>();
expectTypeOf<IsRecordLike<(() => void) & {settings: Settings}>>().toBe<false>();
expectTypeOf<IsRecordLike<{(value: string): string; (value: number): number}>>().toBe<false>();
expectTypeOf<IsRecordLike<<Value>(value: Value) => Value>>().toBe<false>();
expectTypeOf<IsRecordLike<(this: Date) => void>>().toBe<false>();
expectTypeOf<IsRecordLike<CallableFunction>>().toBe<false>();
expectTypeOf<IsRecordLike<NewableFunction>>().toBe<false>();

declare function handler(): void;
expectTypeOf<IsRecordLike<typeof handler>>().toBe<false>();

// A call signature still denotes a function when an own property conflicts with the `Function` interface.
type CallbackWithOwnBind = {
	(): void;
	bind: boolean;
};
expectTypeOf<IsRecordLike<CallbackWithOwnBind>>().toBe<false>();
expectTypeOf<IsRecordLike<{(value: string): string; (value: number): number; bind: boolean}>>().toBe<false>();
expectTypeOf<IsRecordLike<{<Value>(value: Value): Value; bind: boolean}>>().toBe<false>();
expectTypeOf<IsRecordLike<{(): void; name: number}>>().toBe<false>();
expectTypeOf<IsRecordLike<{(): void; apply: string}>>().toBe<false>();
expectTypeOf<IsRecordLike<{(this: Date): void; bind: boolean}>>().toBe<false>();
expectTypeOf<IsRecordLike<{(): void; new (): object}>>().toBe<false>();
expectTypeOf<IsRecordLike<CallbackWithOwnBind | Settings>>().toBe<boolean>();

// The same names on a non-callable object are ordinary properties.
expectTypeOf<IsRecordLike<{name: string; length: number}>>().toBe<true>();
expectTypeOf<IsRecordLike<{apply: string}>>().toBe<true>();
expectTypeOf<IsRecordLike<{bind: boolean}>>().toBe<true>();

// Built-in leaves, array buffers, typed arrays, `DataView`, and DOM nodes are not traversed as records.
expectTypeOf<IsRecordLike<Date>>().toBe<false>();
expectTypeOf<IsRecordLike<Readonly<Date>>>().toBe<false>();
expectTypeOf<IsRecordLike<ReadonlyDate>>().toBe<false>();
expectTypeOf<IsRecordLike<RegExp>>().toBe<false>();
expectTypeOf<IsRecordLike<Readonly<RegExp>>>().toBe<false>();
expectTypeOf<IsRecordLike<ArrayBuffer>>().toBe<false>();
expectTypeOf<IsRecordLike<Readonly<ArrayBuffer>>>().toBe<false>();
expectTypeOf<IsRecordLike<SharedArrayBuffer>>().toBe<false>();
expectTypeOf<IsRecordLike<DataView>>().toBe<false>();
expectTypeOf<IsRecordLike<Readonly<DataView>>>().toBe<false>();
expectTypeOf<IsRecordLike<TypedArray>>().toBe<false>();
expectTypeOf<IsRecordLike<Readonly<Uint8Array>>>().toBe<false>();
expectTypeOf<IsRecordLike<Node>>().toBe<false>();
expectTypeOf<IsRecordLike<HTMLElement>>().toBe<false>();
expectTypeOf<IsRecordLike<Document>>().toBe<false>();

// The base `ArrayBufferView` interface is not excluded; only the concrete view types are.
expectTypeOf<IsRecordLike<ArrayBufferView>>().toBe<true>();

// Only DOM nodes are excluded, not every DOM type.
expectTypeOf<IsRecordLike<Event>>().toBe<true>();

// Subclasses keep their excluded base shape even when they add ordinary data fields.
declare class ScheduledDate extends Date {
	label: string;
}

declare class SettingsMap extends Map<string, string> {
	label: string;
}

declare class Pattern extends RegExp {
	label: string;
}

declare class Bytes extends ArrayBuffer {
	label: string;
}

expectTypeOf<IsRecordLike<ScheduledDate>>().toBe<false>();
expectTypeOf<IsRecordLike<SettingsMap>>().toBe<false>();
expectTypeOf<IsRecordLike<Pattern>>().toBe<false>();
expectTypeOf<IsRecordLike<Bytes>>().toBe<false>();

// Collections and PromiseLike values are opaque, including readonly and weak collections.
expectTypeOf<IsRecordLike<Map<string, Settings>>>().toBe<false>();
expectTypeOf<IsRecordLike<ReadonlyMap<symbol, unknown>>>().toBe<false>();
expectTypeOf<IsRecordLike<Readonly<Map<string, string>>>>().toBe<false>();
expectTypeOf<IsRecordLike<Map<string, string> & {label: string}>>().toBe<false>();
expectTypeOf<IsRecordLike<Set<string>>>().toBe<false>();
expectTypeOf<IsRecordLike<ReadonlySet<Settings>>>().toBe<false>();
expectTypeOf<IsRecordLike<Readonly<Set<string>>>>().toBe<false>();
expectTypeOf<IsRecordLike<Set<string> & {label: string}>>().toBe<false>();
expectTypeOf<IsRecordLike<WeakMap<object, Settings>>>().toBe<false>();
expectTypeOf<IsRecordLike<WeakSet<object>>>().toBe<false>();
expectTypeOf<IsRecordLike<Promise<Settings>>>().toBe<false>();
expectTypeOf<IsRecordLike<PromiseLike<Settings> & {label: string}>>().toBe<false>();
expectTypeOf<IsRecordLike<Pick<Promise<Settings>, 'then'>>>().toBe<false>();
expectTypeOf<IsRecordLike<PromiseLike<never>>>().toBe<false>();

// A property named `then` makes a value opaque only when it satisfies the `PromiseLike` contract.
expectTypeOf<IsRecordLike<{then?: PromiseLike<string>['then']}>>().toBe<true>();

// An awaitable need not implement PromiseLike; this classifier uses the PromiseLike contract.
type Awaitable = {
	then(resolve: (value: string) => void): void;
};
expectTypeOf<Awaited<Awaitable>>().toBe<string>();
expectTypeOf<IsRecordLike<Awaitable>>().toBe<true>();
type ReadonlyThenable = Readonly<PromiseLike<Settings>>;
expectTypeOf<IsRecordLike<ReadonlyThenable>>().toBe<false>();

// The excluded shapes are structural too; their origin and prototype are irrelevant.
expectTypeOf<IsRecordLike<{[Key in keyof Map<string, unknown>]: Map<string, unknown>[Key]}>>().toBe<false>();

// Unions are classified member by member, while `never` disappears and `unknown` and `any` absorb the other members.
expectTypeOf<IsRecordLike<{id: number} | {name: string}>>().toBe<true>();
expectTypeOf<IsRecordLike<Date | string[]>>().toBe<false>();
expectTypeOf<IsRecordLike<{id: number} | null>>().toBe<boolean>();
expectTypeOf<IsRecordLike<Settings | undefined>>().toBe<boolean>();
expectTypeOf<IsRecordLike<Settings | Date>>().toBe<boolean>();
expectTypeOf<IsRecordLike<Settings | (() => void)>>().toBe<boolean>();
expectTypeOf<IsRecordLike<Date | {a: 1} | {b: 2}>>().toBe<boolean>();
expectTypeOf<IsRecordLike<string[] | {a: 1}>>().toBe<boolean>();
expectTypeOf<IsRecordLike<{} | null>>().toBe<boolean>();
expectTypeOf<IsRecordLike<object | undefined>>().toBe<boolean>();
expectTypeOf<IsRecordLike<void | {a: 1}>>().toBe<boolean>();
expectTypeOf<IsRecordLike<Settings | never>>().toBe<true>();
expectTypeOf<IsRecordLike<Settings | unknown>>().toBe<false>();
expectTypeOf<IsRecordLike<Settings | any>>().toBe<false>();
expectTypeOf<IsRecordLike<any>>().toBe<false>();
expectTypeOf<IsRecordLike<never>>().toBe<false>();
expectTypeOf<IsRecordLike<unknown>>().toBe<false>();

// A generic type parameter does not change the classification: records stay records, and arrays and promises stay excluded.
function _recordWithGenericValue<Value>(classification: IsRecordLike<{value: Value}>): true {
	return classification;
}

function _recordOfGenericValue<Value>(classification: IsRecordLike<Record<string, Value>>): true {
	return classification;
}

function _arrayIsNeverRecord<Value>(classification: IsRecordLike<Value[]>): false {
	return classification;
}

function _promiseIsNeverRecord<Value>(classification: IsRecordLike<Promise<Value>>): false {
	return classification;
}

// An uninstantiated classification stays assignable to `boolean`.
function _readGenericClassification<Value>(classification: IsRecordLike<Value>): boolean {
	return classification;
}

// A consumer can select complete record-valued fields without walking into collections or uncertain unions.
type RecordProperties<Value> = {
	[Key in keyof Value as IsRecordLike<Value[Key]> extends true ? Key : never]: Value[Key];
};
declare const selectedProperties: RecordProperties<{
	settings: Settings;
	entries: Map<string, string>;
	optional?: Settings;
	callback: () => void;
	handler: CallbackWithOwnBind;
	count: number;
	unresolved: any;
}>;
expectTypeOf(selectedProperties).toBe<{settings: Settings}>();
expectTypeOf<RecordProperties<{a: object; b: string[]; c: unknown; d: never; e: {}}>>().toBe<{a: object; e: {}}>();

// Exclude the `undefined` that reading an optional property adds to select its record part too.
type RecordPropertiesIgnoringUndefined<Value> = {
	[Key in keyof Value as IsRecordLike<Exclude<Value[Key], undefined>> extends true ? Key : never]: Value[Key];
};
expectTypeOf<RecordPropertiesIgnoringUndefined<{settings: Settings; optional?: Settings; entries: Map<string, string>; count: number}>>().toBe<{settings: Settings; optional?: Settings}>();

// Compare with `true`, because a mixed union is `boolean`.
type LeafKind<Value> = IsRecordLike<Value> extends true ? 'record' : 'leaf';
expectTypeOf<LeafKind<{a: 1}>>().toBe<'record'>();
expectTypeOf<LeafKind<Date>>().toBe<'leaf'>();
expectTypeOf<LeafKind<Date | {a: 1}>>().toBe<'leaf'>();

// Existing recursive consumers continue to inspect class fields and preserve opaque values.
expectTypeOf<ConditionalPickDeep<{account: Account; date: Date; items: Settings[]}, string>>().toBe<{account: {name: string}}>();
expectTypeOf<ConditionalPickDeep<{callback: CallbackWithOwnBind; enabled: boolean}, boolean>>().toBe<{enabled: boolean}>();
