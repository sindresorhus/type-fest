import {expectTypeOf} from 'nz';
import type {HasMultipleCallSignatures, NonNullableDeep, PartialDeep, ReadonlyDeep, RequiredDeep, WritableDeep} from '../index.d.ts';

type Overloaded = {
	(foo: number): string;
	(foo: string, bar: number): number;
};

type Overloaded2 = {
	(foo: number | undefined): string;
	(foo: number): string;
};

type Namespace = {
	(foo: number): string;
	baz: boolean[];
};

expectTypeOf<HasMultipleCallSignatures<Overloaded>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<Overloaded2>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<Namespace>>().toBe<false>();

// `any` must not make distinct signatures compare as equivalent.
expectTypeOf<HasMultipleCallSignatures<{
	(value: any): void;
	(value: string): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(): any;
	(): string;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(this: any): void;
	(this: Date): void;
}>>().toBe<true>();

// Receiver-dependent overloads are distinct even when their ordinary parameters are identical.
type ReceiverMethod = {
	(this: {format: 'text'}, path: string): string;
	(this: {format: 'binary'}, path: string): Uint8Array;
	readonly settings?: {readonly enabled?: boolean};
};
type ReceiverOverloads = {
	(this: Date, value: string): string;
	(this: RegExp, value: string): string;
};
type ReturnOverloads = {
	(value: string): number;
	(value: string): string;
};
expectTypeOf<HasMultipleCallSignatures<ReceiverMethod>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<ReceiverOverloads>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<ReturnOverloads>>().toBe<true>();

// Deep transforms leave unsupported overloaded signatures intact instead of dropping an overload.
expectTypeOf<ReadonlyDeep<ReceiverMethod>>().toBe<ReceiverMethod>();
expectTypeOf<RequiredDeep<ReceiverMethod>>().toBe<ReceiverMethod>();
expectTypeOf<PartialDeep<ReceiverMethod>>().toBe<ReceiverMethod>();
expectTypeOf<WritableDeep<ReceiverMethod>>().toBe<ReceiverMethod>();
expectTypeOf<NonNullableDeep<ReceiverMethod>>().toBe<ReceiverMethod>();

declare const textApi: {format: 'text'; read: ReadonlyDeep<ReceiverMethod>};
declare const binaryApi: {format: 'binary'; read: RequiredDeep<ReceiverMethod>};
expectTypeOf(textApi.read('data')).toBe<string>();
expectTypeOf(binaryApi.read('data')).toBe<Uint8Array>();
declare const unsupportedApi: {format: 'json'; read: PartialDeep<ReceiverMethod>};
// @ts-expect-error The original overloads still require one of their declared receivers.
unsupportedApi.read('data');

// Generic and readonly-rest callbacks each have a single call signature.
expectTypeOf<HasMultipleCallSignatures<(this: Date, ...values: readonly number[]) => never>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<<Value>(value: Value) => Value>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<any>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<never>>().toBe<false>();
// @ts-expect-error An unknown type is not known to have a call signature.
type UnknownSignatures = HasMultipleCallSignatures<unknown>;

function _readSignatureFlag<Callback extends (...arguments_: any[]) => unknown>(flag: HasMultipleCallSignatures<Callback>): boolean {
	return flag;
}

// A signature can accept several argument shapes without being overloaded.
expectTypeOf<HasMultipleCallSignatures<() => void>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<(value: string | number) => string | number>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<(value?: string) => void>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<(...values: string[]) => void>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<(...values: [string] | [number, boolean]) => void>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<(value: never) => never>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<(value: any) => any>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<(value: unknown) => unknown>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<(this: any) => void>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<<Value extends string>(value: Value) => Value>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<<Values extends unknown[]>(...values: Values) => Values>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<(value: unknown) => value is string>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<(value: unknown) => asserts value is string>>().toBe<false>();

// Differences in arity, optionality, rest parameters, and return types all matter.
expectTypeOf<HasMultipleCallSignatures<{
	(): void;
	(value: string): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value?: string): void;
	(value: string | undefined): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: string): void;
	(...values: string[]): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(): never;
	(): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(): string;
	(): string | undefined;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: string): void;
	(value: any): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: any): void;
	(value: unknown): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: never): void;
	(value: unknown): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: {readonly name: string}): void;
	(value: {name: string}): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: {name: any}): void;
	(value: {name: string}): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(): any;
	(): unknown;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(this: unknown): void;
	(this: Date): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(this: never): void;
	(this: unknown): void;
}>>().toBe<true>();

// Declaration syntax, inherited overloads, and intersections are supported.
declare function readFile(path: string): string;
declare function readFile(path: string, encoding: 'binary'): Uint8Array;
expectTypeOf<HasMultipleCallSignatures<typeof readFile>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<(path: string) => string>>().toBe<false>();

function parse(value: string): number;
function parse(value: number): string;
function parse(value: string | number): string | number {
	return typeof value === 'string' ? Number(value) : String(value);
}

expectTypeOf<HasMultipleCallSignatures<typeof parse>>().toBe<true>();
expectTypeOf(parse('42')).toBe<number>();
expectTypeOf(parse(42)).toBe<string>();

// The implementation signature is not an additional overload.
function format(value: string): string;
function format(value: string | number): string {
	return `Value: ${value}`;
}

expectTypeOf<HasMultipleCallSignatures<typeof format>>().toBe<false>();
// @ts-expect-error Only the declared overload is callable.
format(42);

type Service = {
	request(path: string): string;
	request(path: string, binary: true): Uint8Array;
};
expectTypeOf<HasMultipleCallSignatures<Service['request']>>().toBe<true>();
declare class BaseService {
	request(path: string): string;
	request(path: string, binary: true): Uint8Array;
}
declare class DerivedService extends BaseService {}
expectTypeOf<HasMultipleCallSignatures<DerivedService['request']>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<((value: string) => string) & ((value: number) => number)>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<Overloaded & {readonly description: string}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<((value: string) => string) & {callback: Overloaded}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: string): string;
	(value: number): number;
	(value: boolean): boolean;
	(value: Date): Date;
	(value: RegExp): RegExp;
}>>().toBe<true>();

// Construct signatures are not call signatures, including on built-in constructors.
expectTypeOf<HasMultipleCallSignatures<{
	(): string;
	new (value: string): Date;
	new (value: number): Date;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<Overloaded & (new () => Date)>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<DateConstructor>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<ArrayConstructor>>().toBe<true>();

// A union is checked member by member, rather than treated as an overload list.
expectTypeOf<HasMultipleCallSignatures<((value: string) => string) | ((value: number) => number)>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<Overloaded | (() => void)>>().toBe<boolean>();
expectTypeOf<HasMultipleCallSignatures<Overloaded | ReturnOverloads>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<Overloaded | never>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<Overloaded | any>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<Overloaded & any>>().toBe<false>();

// Identical signatures are not distinct, but must not hide earlier distinct signatures.
expectTypeOf<HasMultipleCallSignatures<{
	(value: string): string;
	(value: string): string;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<((value: string) => string) & ((path: string) => string)>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: string): string;
	(value: number): number;
	(value: number): number;
}>>().toBe<true>();

type RepeatedReturnOverloads = {
	(): string;
	(): number;
	(): number;
	(): number;
};
type RepeatedReceiverOverloads = {
	(this: Date, value: string): string;
	(this: RegExp, value: string): string;
	(this: RegExp, value: string): string;
};
expectTypeOf<HasMultipleCallSignatures<RepeatedReturnOverloads>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<RepeatedReceiverOverloads>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<RepeatedReturnOverloads | ((value: string) => string)>>().toBe<boolean>();
expectTypeOf<HasMultipleCallSignatures<RepeatedReturnOverloads | RepeatedReceiverOverloads>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: any): void;
	(value: string): void;
	(value: string): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	<Value>(value: Value): Value;
	<Other>(value: Other): Other;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<<Value>(value: Value) => Value extends string ? number : boolean>>().toBe<false>();

// Deep transforms must preserve all overloads when the final declaration is repeated.
type RepeatedOverloadsWithProperties = {
	(value: string): string;
	(value: number): number;
	(value: number): number;
	readonly settings?: {readonly enabled?: boolean | null};
};
expectTypeOf<ReadonlyDeep<RepeatedOverloadsWithProperties>>().toBe<RepeatedOverloadsWithProperties>();
expectTypeOf<RequiredDeep<RepeatedOverloadsWithProperties>>().toBe<RepeatedOverloadsWithProperties>();
expectTypeOf<PartialDeep<RepeatedOverloadsWithProperties>>().toBe<RepeatedOverloadsWithProperties>();
expectTypeOf<WritableDeep<RepeatedOverloadsWithProperties>>().toBe<RepeatedOverloadsWithProperties>();
expectTypeOf<NonNullableDeep<RepeatedOverloadsWithProperties>>().toBe<RepeatedOverloadsWithProperties>();
declare const repeatedRead: ReadonlyDeep<RepeatedOverloadsWithProperties>;
expectTypeOf(repeatedRead('file')).toBe<string>();
expectTypeOf(repeatedRead(42)).toBe<number>();

// Normalization must not discard the difference between implicit and explicit receivers.
type MixedReceiverOverloads = {
	(): string;
	(this: Date): string;
	settings?: boolean;
};
expectTypeOf<HasMultipleCallSignatures<MixedReceiverOverloads>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{(this: Date): string; (): string}>>().toBe<true>();
expectTypeOf<ReadonlyDeep<MixedReceiverOverloads>>().toBe<MixedReceiverOverloads>();
declare const mixedReceiverRead: ReadonlyDeep<MixedReceiverOverloads>;
expectTypeOf(mixedReceiverRead()).toBe<string>();

// Inference erases generic correlations, type predicates, and assertions.
expectTypeOf<HasMultipleCallSignatures<{
	<Value>(value: Value): Value;
	(value: unknown): unknown;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	<Value extends string>(value: Value): Value;
	(value: string): string;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	<Value extends string>(value: Value): Value;
	<Value extends number>(value: Value): Value;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: unknown): value is string;
	(value: unknown): value is number;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: unknown): asserts value is string;
	(value: unknown): asserts value is number;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(): void;
	(this: unknown): void;
}>>().toBe<false>();

// Reject inputs without a declared call signature.
// @ts-expect-error Objects with callable properties are not themselves callable.
type ObjectSignatures = HasMultipleCallSignatures<{callback: () => void}>;
// @ts-expect-error A constructor is not callable without `new`.
type ConstructorSignatures = HasMultipleCallSignatures<new () => Date>;
// @ts-expect-error The `Function` interface has no declared call signature.
type FunctionSignatures = HasMultipleCallSignatures<Function>;
// @ts-expect-error Primitive types are not callable.
type StringSignatures = HasMultipleCallSignatures<string>;
// @ts-expect-error Nullable callbacks are not known to be callable.
type NullableSignatures = HasMultipleCallSignatures<(() => void) | undefined>;

// All deep transforms preserve overloads that differ only through `any`.
type AnyOverloads = {
	(value: any): string;
	(value: string): string;
	readonly settings?: {readonly enabled?: boolean | null};
};
expectTypeOf<ReadonlyDeep<AnyOverloads>>().toBe<AnyOverloads>();
expectTypeOf<RequiredDeep<AnyOverloads>>().toBe<AnyOverloads>();
expectTypeOf<PartialDeep<AnyOverloads>>().toBe<AnyOverloads>();
expectTypeOf<WritableDeep<AnyOverloads>>().toBe<AnyOverloads>();
expectTypeOf<NonNullableDeep<AnyOverloads>>().toBe<AnyOverloads>();

// Parameter names and tuple labels do not create distinct call signatures.
expectTypeOf<HasMultipleCallSignatures<{
	(path: string): string;
	(filename: string): string;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(...arguments_: [path: string, encoding?: string]): string;
	(...arguments_: [filename: string, format?: string]): string;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(...values: string[]): void;
	(...items: string[]): void;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: string | number): void;
	(value: number | string): void;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: {name: string; age: number}): void;
	(value: {age: number; name: string}): void;
}>>().toBe<false>();

// Duplicate normalization must inspect earlier signatures, regardless of repetition order.
expectTypeOf<HasMultipleCallSignatures<{
	(value: string): string;
	(value: string): string;
	(value: number): number;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: string): string;
	(value: number): number;
	(value: string): string;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: string): string;
	(value: string): string;
	(value: string): string;
	(value: string): string;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: string): string;
	(value: number): number;
	(value: string): string;
	(value: string): string;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: string): string;
	(value: number): number;
	(value: number): number;
	(value: string): string;
	(value: string): string;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value?: string): void;
	(value: string): void;
	(value: string): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(): any;
	(): string;
	(): string;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(this: any): void;
	(this: Date): void;
	(this: Date): void;
}>>().toBe<true>();

// Optional and variadic tuples describe distinct call shapes without requiring different value types.
expectTypeOf<HasMultipleCallSignatures<{
	(): void;
	(value?: string): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: string, options?: boolean): void;
	(value: string, options: boolean | undefined): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(...values: [string, ...number[]]): void;
	(...values: [string, number]): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(...values: [string]): void;
	(value: string): void;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(...values: readonly [string, number]): void;
	(...values: [string, number]): void;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: readonly string[]): void;
	(value: string[]): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: {name?: string}): void;
	(value: {name: string | undefined}): void;
}>>().toBe<true>();

// Generic overloads are detectable when their inferred shapes differ.
expectTypeOf<HasMultipleCallSignatures<{
	<Value>(value: Value): Value;
	<Value>(values: Value[]): Value[];
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	<Value>(value: Value): Value;
	<Value>(value: Value, fallback: Value): Value;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	<Value>(value: Value): Promise<Value>;
	<Value>(value: Value): Value;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	<Value extends {name: string}>(value: Value): Value;
	<Value extends {id: number}>(value: Value): Value;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<<Value = string>(value: Value) => Value>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<<const Values extends readonly unknown[]>(...values: Values) => Values>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	<Value = string>(value: Value): Value;
	<Value = number>(value: Value): Value;
}>>().toBe<false>();

// Predicates and assertions are still distinguishable when their argument shapes differ.
expectTypeOf<HasMultipleCallSignatures<{
	(value: unknown): value is string;
	(value: unknown, strict: true): value is number;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: unknown): asserts value is string;
	(value: unknown, message: string): asserts value is string;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: unknown): value is string;
	(value: unknown): boolean;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: unknown): asserts value is string;
	(value: unknown): void;
}>>().toBe<false>();

// Receivers participate in equality, including optional and readonly object properties.
expectTypeOf<HasMultipleCallSignatures<{
	(this: {readonly name: string}): void;
	(this: {name: string}): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(this: {name?: string}): void;
	(this: {name: string | undefined}): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(this: Date, value: string): void;
	(this: Date, filename: string): void;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(this: void): void;
	(this: Date): void;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<(this: never, value: string) => string>>().toBe<false>();

// Record lookup overloads can return different object shapes.
declare function lookupRecord(key: string): {name: string};
declare function lookupRecord(id: number): {name: string; id: number};
expectTypeOf<HasMultipleCallSignatures<typeof lookupRecord>>().toBe<true>();

declare const createRecord: ((name: string) => {name: string}) & {parse: ReturnOverloads};
expectTypeOf<HasMultipleCallSignatures<typeof createRecord>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<typeof createRecord.parse>>().toBe<true>();

// Callable metadata, including unique symbols and broad index signatures, is ignored.
declare const callbackMetadata: unique symbol;
expectTypeOf<HasMultipleCallSignatures<(() => void) & {[callbackMetadata]: Overloaded}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<Overloaded & {[callbackMetadata]: () => void}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<(() => void) & Record<string, Overloaded>>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<Overloaded & Record<string, never>>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<(() => void) & {call: Overloaded; apply: Overloaded}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<Overloaded & {new (): string; new (value: number): Date}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<(() => string) & {new (): string; new (value: number): Date}>>().toBe<false>();

// Intersections may add overloads or repeat an existing signature.
expectTypeOf<HasMultipleCallSignatures<Overloaded & ((value: number) => string)>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<((path: string) => string) & ((filename: string) => string) & {version: number}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<((path: string) => string) & ((id: number) => number) & ((count: number) => number)>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<Overloaded & Record<never, never>>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<(() => string) & Record<never, never>>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<Overloaded & unknown>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<Overloaded & never>>().toBe<false>();

// Distribution must keep metadata and overload normalization local to each union member.
expectTypeOf<HasMultipleCallSignatures<(Overloaded & {kind: 'multiple'}) | ((() => void) & {kind: 'single'})>>().toBe<boolean>();
expectTypeOf<HasMultipleCallSignatures<(Overloaded & {kind: 'first'}) | (ReturnOverloads & {kind: 'second'})>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<RepeatedReturnOverloads | {
	(value: string): string;
	(value: string): string;
}>>().toBe<boolean>();
expectTypeOf<HasMultipleCallSignatures<(() => void) | (<Value>(value: Value) => Value)>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<(Overloaded | (() => void)) & {version: string}>>().toBe<boolean>();

// Return type equality must preserve distinctions beyond primitive values.
expectTypeOf<HasMultipleCallSignatures<{
	(): void;
	(): undefined;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(): Promise<string>;
	(): Promise<number>;
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(): {readonly name: string};
	(): {name: string};
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(): [string, number];
	(): readonly [string, number];
}>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<{
	(): unknown;
	(): never;
}>>().toBe<true>();

// Additional non-callable inputs fail at the public constraint.
// @ts-expect-error The empty object type has no call signature.
type EmptyObjectSignatures = HasMultipleCallSignatures<{}>;
// @ts-expect-error `object` does not guarantee a call signature.
type ObjectTypeSignatures = HasMultipleCallSignatures<object>;
// @ts-expect-error An array of callbacks is not itself callable.
type CallbackArraySignatures = HasMultipleCallSignatures<Array<() => void>>;
// @ts-expect-error `null` is not callable.
type NullSignatures = HasMultipleCallSignatures<null>;
// @ts-expect-error A nullable overloaded callback is not known to be callable.
type NullOverloadedSignatures = HasMultipleCallSignatures<Overloaded | null>;
// @ts-expect-error Every union member must be callable.
type MixedCallableSignatures = HasMultipleCallSignatures<Overloaded | {name: string}>;
// @ts-expect-error Abstract construct signatures are not call signatures.
type AbstractConstructorSignatures = HasMultipleCallSignatures<abstract new () => Date>;

// Inference can also hide an earlier distinct overload when the final pair differs only in erased information.
expectTypeOf<HasMultipleCallSignatures<{
	(): 1;
	<Value>(value: Value): Value;
	(value: unknown): unknown;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: number): string;
	(value: unknown): value is string;
	(value: unknown): value is number;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(value: number): string;
	(value: unknown): asserts value is string;
	(value: unknown): asserts value is number;
}>>().toBe<false>();

// These compiler inference and normalization limits must not lead to extra special cases.
expectTypeOf<HasMultipleCallSignatures<<Value extends never>(value: Value) => Value>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(): string;
	(this: Date): string;
	(this: Date): string;
}>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<{
	(this: Date): string;
	(): string;
	(): string;
}>>().toBe<false>();
