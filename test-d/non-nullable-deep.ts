import {expectTypeOf} from 'nz';
import type {NonNullableDeep} from '../source/non-nullable-deep.d.ts';
import type {Primitive} from '../source/primitive.d.ts';
import type {IsEqual} from '../source/is-equal.d.ts';
import type {JsonValue} from '../source/json-value.d.ts';

expectTypeOf<NonNullableDeep<string | null | undefined>>().toBe<string>();
expectTypeOf<NonNullableDeep<Primitive>>().toBe<string | number | boolean | bigint | symbol>();

// Built-ins
expectTypeOf<NonNullableDeep<Date | null>>().toBe<Date>();
expectTypeOf<NonNullableDeep<RegExp | undefined>>().toBe<RegExp>();
expectTypeOf({} as any as NonNullableDeep<void | null | undefined>).toBe<void>();
expectTypeOf<NonNullableDeep<{date: Date | null; regex: RegExp | undefined}>>().toBe<{date: Date; regex: RegExp}>();

// Becomes `never` when the value is only `null` or `undefined`
expectTypeOf<NonNullableDeep<null>>().toBe<never>();
expectTypeOf<NonNullableDeep<undefined>>().toBe<never>();
expectTypeOf<NonNullableDeep<{a: null; b: undefined; c: null | undefined}>>().toBe<{a: never; b: never; c: never}>();
expectTypeOf<NonNullableDeep<[null, undefined, null | undefined, ...null[]]>>().toBe<[never, never, never, ...never[]]>();

// Objects
expectTypeOf<NonNullableDeep<{a: string | null}>>().toBe<{a: string}>();
expectTypeOf<NonNullableDeep<{a: {b: string | null; c: number | undefined}}>>().toBe<{a: {b: string; c: number}}>();
expectTypeOf<NonNullableDeep<{a: {b: string | null} | null}>>().toBe<{a: {b: string}}>();
expectTypeOf<NonNullableDeep<{a: {b: {c: {d: string | null}}}}>>().toBe<{a: {b: {c: {d: string}}}}>();
expectTypeOf<NonNullableDeep<{[x: string]: {a: number | null} | null}>>().toBe<{[x: string]: {a: number}}>();
expectTypeOf<NonNullableDeep<{0: {1: string | null} | null; 2: number | undefined}>>().toBe<{0: {1: string}; 2: number}>();

// Arrays
expectTypeOf<NonNullableDeep<Array<string | number | null>>>().toBe<Array<string | number>>();
expectTypeOf<NonNullableDeep<[foo: string | number | null, bar: number | null | undefined]>>().toBe<[foo: string | number, bar: number]>();
expectTypeOf<NonNullableDeep<[string, number | undefined, ...Array<string | null>]>>().toBe<[string, number, ...string[]]>();
expectTypeOf<NonNullableDeep<[...Array<string | null>, string, number | undefined]>>().toBe<[...string[], string, number]>();
expectTypeOf<NonNullableDeep<[string, number | undefined, ...Array<string | null>, string, number | undefined]>>().toBe<[string, number, ...string[], string, number]>();

expectTypeOf<NonNullableDeep<Array<undefined | Array<{a: null | string | [null | undefined | number, {a: string | undefined} | undefined]}>>>>().toBe<Array<Array<{a: string | [number, {a: string}]}>>>();

// Maps, sets, and promises
expectTypeOf<NonNullableDeep<Map<{a: string | null}, [{b: number | undefined}]>>>().toBe<Map<{a: string}, [{b: number}]>>();
expectTypeOf<NonNullableDeep<Set<{a: string | null}>>>().toBe<Set<{a: string}>>();
expectTypeOf<NonNullableDeep<ReadonlyMap<{a: string | null}, [{b: number | undefined}]>>>().toBe<ReadonlyMap<{a: string}, [{b: number}]>>();
expectTypeOf<NonNullableDeep<ReadonlySet<{a: string | null}>>>().toBe<ReadonlySet<{a: string}>>();
expectTypeOf<NonNullableDeep<WeakMap<{a: string | null}, [{b: number | undefined}]>>>().toBe<WeakMap<{a: string}, [{b: number}]>>();
expectTypeOf<NonNullableDeep<WeakSet<{a: string | null}>>>().toBe<WeakSet<{a: string}>>();
expectTypeOf<NonNullableDeep<Promise<{a: string | null} | {b: number | null}>>>().toBe<Promise<{a: string} | {b: number}>>();
expectTypeOf<NonNullableDeep<Promise<Map<string | null, {a: number | undefined} | null>>>>().toBe<Promise<Map<string, {a: number}>>>();

// Preserves `optional` and `readonly` modifiers.
expectTypeOf<NonNullableDeep<{a?: string | null | undefined}>>().toBe<{a?: string}>();
expectTypeOf<NonNullableDeep<{readonly a?: {b?: string | number} | null; readonly c: number | undefined}>>().toBe<{readonly a?: {b?: string | number}; readonly c: number}>();
expectTypeOf<NonNullableDeep<ReadonlyArray<{a: string | null}>>>().toBe<ReadonlyArray<{a: string}>>();
expectTypeOf<NonNullableDeep<[string?, (number | undefined)?]>>().toBe<[string?, number?]>();
expectTypeOf<NonNullableDeep<readonly [string?, ...Array<number | {a: null | string}>]>>().toBe<readonly [string?, ...Array<number | {a: string}>]>();

// Unions
expectTypeOf<NonNullableDeep<[number | null] | Map<string, {a: string | undefined}> | {a: string | null}>>().toBe<[number] | Map<string, {a: string}> | {a: string}>();
expectTypeOf<NonNullableDeep<{a: null | [string, number | null] | {a: {b: string} | {c: string | undefined} | null}}>>().toBe<{a: [string, number] | {a: {b: string} | {c: string}}}>();

// Constructors remain unchanged
expectTypeOf<NonNullableDeep<new (a: string | null | undefined) => {a: string}>>().toBe<new (a: string | null | undefined) => {a: string}>();

// Functions
expectTypeOf<NonNullableDeep<() => string | undefined>>().toBe<() => string>();
expectTypeOf<NonNullableDeep<(a: string | null) => void>>().toBe<(a: string) => void>();
expectTypeOf<NonNullableDeep<(x: string | null | undefined, y: number | null | undefined) => string | null | undefined>>().toBe<(x: string, y: number) => string>();
expectTypeOf<NonNullableDeep<(x: [string | null, {a: string | undefined}]) => Map<{a: string | null}, Set<{b: number | undefined}>>>>().toBe<(x: [string, {a: string}]) => Map<{a: string}, Set<{b: number}>>>();

type FunctionWithProperties = {
	(a1: string | null | undefined, a2: number | null | undefined): boolean | null | undefined;
	p1: string | null | undefined;
	readonly p2: number | null | undefined;
};
declare const functionWithProperties: NonNullableDeep<FunctionWithProperties>;
expectTypeOf(functionWithProperties('foo', 1)).toBe<boolean>();
// @ts-expect-error
expectTypeOf(functionWithProperties(null, 1)).toBe<boolean>();
// @ts-expect-error
expectTypeOf(functionWithProperties(undefined, 1)).toBe<boolean>();
// @ts-expect-error
expectTypeOf(functionWithProperties('foo', undefined)).toBe<boolean>();
// @ts-expect-error
expectTypeOf(functionWithProperties('foo', null)).toBe<boolean>();
expectTypeOf<Omit<typeof functionWithProperties, never>>().toBe<{p1: string; readonly p2: number}>(); // `Omit` removes the call signature from `typeof functionWithProperties`

type FunctionWithProperties2 = {
	(a1: boolean, ...a2: Array<string | null | undefined>): number;
	p1: {p2?: string | null} | undefined;
};
declare const functionWithProperties2: NonNullableDeep<FunctionWithProperties2>;
expectTypeOf(functionWithProperties2(true, 'foo', 'bar')).toBe<number>();
// @ts-expect-error
expectTypeOf(functionWithProperties2(true, 'foo', 'bar', null)).toBe<number>();
// @ts-expect-error
expectTypeOf(functionWithProperties2(true, undefined)).toBe<number>();
expectTypeOf<Omit<typeof functionWithProperties2, never>>().toBe<{p1: {p2?: string}}>();

// Functions containing multiple call signatures are not transformed
type FunctionWithProperties3 = {
	(a1: number | null): string | null;
	(a1: string | undefined, a2: number | undefined): number | undefined;
	p1: string | null;
};
declare const functionWithProperties3: NonNullableDeep<FunctionWithProperties3>;
expectTypeOf(functionWithProperties3(null)).toBe<string | null>();
expectTypeOf(functionWithProperties3(undefined, undefined)).toBe<number | undefined>();
expectTypeOf<Omit<typeof functionWithProperties3, never>>().toBe<{p1: string | null}>();

// `any`, `never`, and `unknown` as nested values
expectTypeOf<NonNullableDeep<{a: {b: any}; c: never; d: unknown}>>().toBe<{a: {b: any}; c: never; d: unknown}>();

// Boundary cases
expectTypeOf<NonNullableDeep<never>>().toBe<never>();
expectTypeOf<NonNullableDeep<any>>().toBe<any>();
expectTypeOf<NonNullableDeep<unknown>>().toBe<unknown>();

// An abstract class has an `abstract new` signature, so it must be kept as is just like a concrete class constructor.
abstract class AbstractClassForTest {
	foo = 1;
}

expectTypeOf<IsEqual<NonNullableDeep<typeof AbstractClassForTest>, typeof AbstractClassForTest>>().toBe<true>();

// A typed array is a single value, so it must be kept rather than recursed into.
expectTypeOf<NonNullableDeep<Uint8Array | null>>().toBe<Uint8Array>();

// The same holds for the other non-recursive built-ins.
expectTypeOf<NonNullableDeep<ArrayBuffer | null>>().toBe<ArrayBuffer>();
expectTypeOf<NonNullableDeep<DataView | null>>().toBe<DataView>();
expectTypeOf<NonNullableDeep<Promise<{a: string}> | null>>().toBe<Promise<{a: string}>>();

// Known limitation: a generic function is rebuilt from its `Parameters` and `ReturnType`, which instantiate its type parameter with `unknown`. See the docs.
declare const genericFunction: NonNullableDeep<<Value>(value: Value) => Value>;
expectTypeOf(genericFunction).toBe<(value: unknown) => unknown>();

// A `this` parameter is neither `null` nor `undefined`, so it survives, and it is recursed into like any other parameter. `Parameters` excludes it, so it has to be added back explicitly, otherwise the rebuilt function would accept any `this`.
expectTypeOf<ThisParameterType<NonNullableDeep<(this: Date, x: string) => void>>>().toBe<Date>();
expectTypeOf<ThisParameterType<NonNullableDeep<(this: {x: number | null}, a: string) => void>>>().toBe<{x: number}>();
expectTypeOf<NonNullableDeep<{m(this: Date, a: string | null): void}>>().toBe<{m: (this: Date, a: string) => void}>();

// The `this` constraint must survive, so a function whose `this` is a different type is still rejected. `ReadonlyDeep`, `WritableDeep`, `PartialDeep` and `RequiredDeep` all behave this way.
declare function needsDateThis(function_: (this: Date, x: string) => void): void;
declare const wrongThis: (this: RegExp, x: string) => void;
// @ts-expect-error
needsDateThis(wrongThis as NonNullableDeep<typeof wrongThis>);

// The `Function` interface has no call signature, so the function branch misses it, and mapping it used to produce an uncallable record of its own methods.
expectTypeOf<NonNullableDeep<Function>>().toBe<Function>();
expectTypeOf<NonNullableDeep<{callback: Function}>>().toBe<{callback: Function}>();

// A `PromiseLike` is a container like `Promise`, so its value is cleaned and the thenable is kept.
expectTypeOf<NonNullableDeep<PromiseLike<number | null>>>().toBe<PromiseLike<number>>();
expectTypeOf<NonNullableDeep<{value: PromiseLike<string | null>}>>().toBe<{value: PromiseLike<string>}>();

// A thenable with other members, like a query builder, is kept as is, because rebuilding it as a `PromiseLike` would drop those members.
type Query<Result> = PromiseLike<Result> & {where(field: string): Query<Result>};
declare const query: NonNullableDeep<{query: Query<{a: 1 | null}>}>;
expectTypeOf(query.query).toBe<Query<{a: 1 | null}>>();
expectTypeOf(query.query.where('x')).toBe<Query<{a: 1 | null}>>();

// A function that declares no `this` is rebuilt without one, rather than with `this: unknown`, which would reject a function that declares a `this`, although the original accepts it.
declare const handlerWithThis: ((this: Date, event: string) => void) & {displayName: string};
expectTypeOf(handlerWithThis).toBeAssignableTo<NonNullableDeep<((event: string) => void) & {displayName: string}>>();

// A DOM node is a single value, so it is kept as is.
expectTypeOf<NonNullableDeep<{element: HTMLElement | null}>>().toBe<{element: HTMLElement}>();

// Recursive JSON-like arrays must remain usable without exhausting the compiler's recursion limit.
type RecursiveJson = string | RecursiveJson[] | {[key: string]: RecursiveJson} | null;
expectTypeOf<NonNullableDeep<RecursiveJson>>().toBeAssignableTo<RecursiveJson>();
expectTypeOf<NonNullableDeep<JsonValue>>().toBeAssignableTo<JsonValue>();
expectTypeOf<Extract<NonNullableDeep<JsonValue>, null | undefined>>().toBe<never>();

type ReadonlyRecursiveJson = string | null | readonly ReadonlyRecursiveJson[];
expectTypeOf<NonNullableDeep<ReadonlyRecursiveJson>>().toBeAssignableTo<ReadonlyRecursiveJson>();
expectTypeOf<NonNullableDeep<ReadonlyArray<JsonValue | undefined>>>().toBeAssignableTo<readonly JsonValue[]>();
expectTypeOf<NonNullableDeep<Map<string | null, JsonValue>>>().toBeAssignableTo<Map<string, JsonValue>>();
expectTypeOf<NonNullableDeep<Promise<JsonValue | undefined>>>().toBeAssignableTo<Promise<JsonValue>>();

// The array branch still preserves tuple positions, optional elements, and fixed elements after a leading rest.
expectTypeOf<NonNullableDeep<readonly [first?: {value: string | null}, ...rest: Array<{value: number | undefined}>]>>().toBe<readonly [first?: {value: string}, ...rest: Array<{value: number}>]>();
expectTypeOf<NonNullableDeep<readonly [...rest: Array<string | null>, last: {value: number | undefined}]>>().toBe<readonly [...rest: string[], last: {value: number}]>();
expectTypeOf<NonNullableDeep<readonly []>>().toBe<readonly []>();
expectTypeOf<NonNullableDeep<any[]>>().toBe<any[]>();
expectTypeOf<NonNullableDeep<readonly unknown[]>>().toBe<readonly unknown[]>();
expectTypeOf<NonNullableDeep<never[]>>().toBe<never[]>();
expectTypeOf<NonNullableDeep<Array<null | undefined>>>().toBe<never[]>();

// Compare both directions with a recursive shape whose values cannot be null at any depth.
type CleanRecursiveJson = string | CleanRecursiveJson[] | {[key: string]: CleanRecursiveJson};
expectTypeOf<NonNullableDeep<RecursiveJson>>().toBeAssignableTo<CleanRecursiveJson>();
expectTypeOf<CleanRecursiveJson>().toBeAssignableTo<NonNullableDeep<RecursiveJson>>();

// A function's metadata is cleaned along with its parameters, return value, and receiver.
declare const metadataKey: unique symbol;
type NullableMetadataHandler = ((this: {requestId: string | null}, event: {id: string | null}) => Promise<{ok: boolean | null}> | null) & {
	readonly metadata?: {timeout: number | null; tags: Array<string | null>};
	[metadataKey]: {enabled: boolean | undefined};
};
declare const metadataHandler: NonNullableDeep<NullableMetadataHandler>;
expectTypeOf(metadataHandler.call({requestId: 'request'}, {id: 'event'})).toBe<Promise<{ok: boolean}>>();
expectTypeOf(metadataHandler.metadata?.timeout).toBe<number | undefined>();
expectTypeOf(metadataHandler[metadataKey].enabled).toBe<boolean>();
if (metadataHandler.metadata) {
	metadataHandler.metadata.tags.push('ready');
}

// @ts-expect-error A valid metadata object still cannot replace a readonly property.
metadataHandler.metadata = {timeout: 20, tags: ['ready']};
// @ts-expect-error The receiver's required field no longer accepts null.
void metadataHandler.call({requestId: null}, {id: 'event'});
// @ts-expect-error A metadata value no longer accepts undefined.
metadataHandler[metadataKey].enabled = undefined;

// Special values inside metadata retain their individual meanings.
type SpecialMetadataHandler = (() => void) & {value: any; missing: never; unknown: unknown};
expectTypeOf<Omit<NonNullableDeep<SpecialMetadataHandler>, never>>().toBe<{value: any; missing: never; unknown: unknown}>();

function readHandlerLabel<Extra>(handler: NonNullableDeep<((value: string | null) => number | undefined) & {metadata: {label: string | null; extra: Extra}}>): string {
	return handler.metadata.label;
}

type RecursiveMetadataHandler = ((event: string | null) => number | undefined) & {next?: RecursiveMetadataHandler | null};
declare const recursiveMetadataHandler: NonNullableDeep<RecursiveMetadataHandler>;
expectTypeOf(recursiveMetadataHandler.next?.('next')).toBe<number | undefined>();

declare function cleanHandler<const Handler extends (...arguments_: any[]) => unknown>(handler: Handler): NonNullableDeep<Handler>;
const inferredMetadataHandler = cleanHandler(Object.assign((event: string | null) => event?.length ?? null, {metadata: {label: 'ready' as const}}));
expectTypeOf(inferredMetadataHandler('event')).toBe<number>();
expectTypeOf(inferredMetadataHandler.metadata.label).toBe<'ready'>();
// @ts-expect-error Inference retains the cleaned parameter type.
inferredMetadataHandler(null);

// A callable array still exposes generic array methods after its elements are cleaned.
declare const callableRows: NonNullableDeep<((value: string | null) => number | undefined) & Array<string | null>>;
expectTypeOf(callableRows.map(value => value.length)).toBe<number[]>();

// Readonly rest arrays are cleaned without losing the function's callable signature.
declare const cleanedReadonlyRest: NonNullableDeep<(...values: ReadonlyArray<number | null>) => string | undefined>;
expectTypeOf(cleanedReadonlyRest(1, 2)).toBe<string>();
declare const cleanedBoundReadonlyRest: NonNullableDeep<(this: Date, ...values: ReadonlyArray<number | null>) => string | undefined>;
expectTypeOf(cleanedBoundReadonlyRest.call(new Date(), 1, 2)).toBe<string>();

// Nullable values are still removed from readonly rest arguments and their explicit receiver.
// @ts-expect-error A cleaned element no longer accepts null.
cleanedReadonlyRest(null);
// @ts-expect-error A cleaned element no longer accepts undefined.
cleanedReadonlyRest(undefined);
// @ts-expect-error The receiver remains a Date.
cleanedBoundReadonlyRest.call({}, 1);

declare const cleanedReadonlyTuple: NonNullableDeep<(...values: readonly [string | null, (number | null)?]) => boolean | null>;
expectTypeOf(cleanedReadonlyTuple('name')).toBe<boolean>();
expectTypeOf(cleanedReadonlyTuple('name', 2)).toBe<boolean>();
// @ts-expect-error Optional tuple elements also have null removed.
cleanedReadonlyTuple('name', null);

// Attached properties are transformed without replacing the cleaned rest signature.
declare const readonlyRestMetadata: NonNullableDeep<((...values: ReadonlyArray<number | null>) => number | null) & {readonly metadata?: {label: string | null}}>;
expectTypeOf(readonlyRestMetadata(1, 2)).toBe<number>();
expectTypeOf(readonlyRestMetadata.metadata?.label).toBe<string | undefined>();
// @ts-expect-error A valid metadata value still cannot replace a readonly property.
readonlyRestMetadata.metadata = {label: 'ready'};

const inferredReadonlyRest = cleanHandler((...values: ReadonlyArray<number | null>) => values[0] ?? null);
expectTypeOf(inferredReadonlyRest(1, 2)).toBe<number>();
// @ts-expect-error Inference keeps the cleaned rest element type.
inferredReadonlyRest(null);
