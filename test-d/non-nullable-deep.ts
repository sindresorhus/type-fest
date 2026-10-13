import {expectTypeOf} from 'nz';
import type {NonNullableDeep} from '../source/non-nullable-deep.d.ts';
import type {Primitive} from '../source/primitive.d.ts';
import type {Simplify} from '../source/simplify.d.ts';
import type {IsEqual} from '../source/is-equal.d.ts';

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
expectTypeOf<Simplify<typeof functionWithProperties>>().toBe<{p1: string; readonly p2: number}>(); // `Simplify` removes the call signature from `typeof functionWithProperties`

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
expectTypeOf<Simplify<typeof functionWithProperties2>>().toBe<{p1: {p2?: string}}>();

// Functions containing multiple call signatures are not transformed
type FunctionWithProperties3 = {
	(a1: number | null): string | null;
	(a1: string | undefined, a2: number | undefined): number | undefined;
	p1: string | null;
};
declare const functionWithProperties3: NonNullableDeep<FunctionWithProperties3>;
expectTypeOf(functionWithProperties3(null)).toBe<string | null>();
expectTypeOf(functionWithProperties3(undefined, undefined)).toBe<number | undefined>();
expectTypeOf<Simplify<typeof functionWithProperties3>>().toBe<{p1: string | null}>();

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
