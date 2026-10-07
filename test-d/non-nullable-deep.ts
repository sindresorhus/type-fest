import {expectAssignable, expectType} from 'tsd';
import type {NonNullableDeep} from '../source/non-nullable-deep.d.ts';
import type {Primitive} from '../source/primitive.d.ts';
import type {Simplify} from '../source/simplify.d.ts';
import type {IsEqual} from '../source/is-equal.d.ts';

expectType<string>({} as NonNullableDeep<string | null | undefined>);
expectType<string | number | boolean | bigint | symbol>({} as NonNullableDeep<Primitive>);

// Built-ins
expectType<Date>({} as NonNullableDeep<Date | null>);
expectType<RegExp>({} as NonNullableDeep<RegExp | undefined>);
expectType<void>({} as any as NonNullableDeep<void | null | undefined>);
expectType<{date: Date; regex: RegExp}>({} as NonNullableDeep<{date: Date | null; regex: RegExp | undefined}>);

// Becomes `never` when the value is only `null` or `undefined`
expectType<never>({} as NonNullableDeep<null>);
expectType<never>({} as NonNullableDeep<undefined>);
expectType<{a: never; b: never; c: never}>({} as NonNullableDeep<{a: null; b: undefined; c: null | undefined}>);
expectType<[never, never, never, ...never[]]>({} as NonNullableDeep<[null, undefined, null | undefined, ...null[]]>);

// Objects
expectType<{a: string}>({} as NonNullableDeep<{a: string | null}>);
expectType<{a: {b: string; c: number}}>({} as NonNullableDeep<{a: {b: string | null; c: number | undefined}}>);
expectType<{a: {b: string}}>({} as NonNullableDeep<{a: {b: string | null} | null}>);
expectType<{a: {b: {c: {d: string}}}}>({} as NonNullableDeep<{a: {b: {c: {d: string | null}}}}>);
expectType<{[x: string]: {a: number}}>({} as NonNullableDeep<{[x: string]: {a: number | null} | null}>);
expectType<{0: {1: string}; 2: number}>({} as NonNullableDeep<{0: {1: string | null} | null; 2: number | undefined}>);

// Arrays
expectType<Array<string | number>>({} as NonNullableDeep<Array<string | number | null>>);
expectType<[foo: string | number, bar: number]>({} as NonNullableDeep<[foo: string | number | null, bar: number | null | undefined]>);
expectType<[string, number, ...string[]]>({} as NonNullableDeep<[string, number | undefined, ...Array<string | null>]>);
expectType<[...string[], string, number]>({} as NonNullableDeep<[...Array<string | null>, string, number | undefined]>);
expectType<[string, number, ...string[], string, number]>({} as NonNullableDeep<[string, number | undefined, ...Array<string | null>, string, number | undefined]>);

expectType<Array<Array<{a: string | [number, {a: string}]}>>>({} as
	NonNullableDeep<Array<undefined | Array<{a: null | string | [null | undefined | number, {a: string | undefined} | undefined]}>>>,
);

// Maps, sets, and promises
expectType<Map<{a: string}, [{b: number}]>>({} as NonNullableDeep<Map<{a: string | null}, [{b: number | undefined}]>>);
expectType<Set<{a: string}>>({} as NonNullableDeep<Set<{a: string | null}>>);
expectType<ReadonlyMap<{a: string}, [{b: number}]>>({} as NonNullableDeep<ReadonlyMap<{a: string | null}, [{b: number | undefined}]>>);
expectType<ReadonlySet<{a: string}>>({} as NonNullableDeep<ReadonlySet<{a: string | null}>>);
expectType<WeakMap<{a: string}, [{b: number}]>>({} as NonNullableDeep<WeakMap<{a: string | null}, [{b: number | undefined}]>>);
expectType<WeakSet<{a: string}>>({} as NonNullableDeep<WeakSet<{a: string | null}>>);
expectType<Promise<{a: string} | {b: number}>>({} as NonNullableDeep<Promise<{a: string | null} | {b: number | null}>>);
expectType<Promise<Map<string, {a: number}>>>({} as NonNullableDeep<Promise<Map<string | null, {a: number | undefined} | null>>>);

// Preserves `optional` and `readonly` modifiers.
expectType<{a?: string}>({} as NonNullableDeep<{a?: string | null | undefined}>);
expectType<{readonly a?: {b?: string | number}; readonly c: number}>(
	{} as NonNullableDeep<{readonly a?: {b?: string | number} | null; readonly c: number | undefined}>,
);
expectType<ReadonlyArray<{a: string}>>({} as NonNullableDeep<ReadonlyArray<{a: string | null}>>);
expectType<[string?, number?]>({} as NonNullableDeep<[string?, (number | undefined)?]>);
expectType<readonly [string?, ...Array<number | {a: string}>]>(
	{} as NonNullableDeep<readonly [string?, ...Array<number | {a: null | string}>]>,
);

// Unions
expectType<{a: string} | [number] | Map<string, {a: string}>>(
	{} as NonNullableDeep<{a: string | null} | [number | null] | Map<string, {a: string | undefined}>>,
);
expectType<{a: [string, number] | {a: {b: string} | {c: string}}}>(
	{} as NonNullableDeep<{a: null | [string, number | null] | {a: {b: string} | {c: string | undefined} | null}}>,
);

// Constructors remain unchanged
expectType<new (a: string | null | undefined) => {a: string}>({} as NonNullableDeep<new (a: string | null | undefined) => {a: string}>);

// Functions
expectType<() => string>({} as NonNullableDeep<() => string | undefined>);
expectType<(a: string) => void>({} as NonNullableDeep<(a: string | null) => void>);
expectType<(x: string, y: number) => string>(
	{} as NonNullableDeep<(x: string | null | undefined, y: number | null | undefined) => string | null | undefined>,
);
expectType<(x: [string, {a: string}]) => Map<{a: string}, Set<{b: number}>>>(
	{} as NonNullableDeep<(x: [string | null, {a: string | undefined}]) => Map<{a: string | null}, Set<{b: number | undefined}>>>,
);

type FunctionWithProperties = {
	(a1: string | null | undefined, a2: number | null | undefined): boolean | null | undefined;
	p1: string | null | undefined;
	readonly p2: number | null | undefined;
};
declare const functionWithProperties: NonNullableDeep<FunctionWithProperties>;
expectType<boolean>(functionWithProperties('foo', 1));
// @ts-expect-error
expectType<boolean>(functionWithProperties(null, 1));
// @ts-expect-error
expectType<boolean>(functionWithProperties(undefined, 1));
// @ts-expect-error
expectType<boolean>(functionWithProperties('foo', undefined));
// @ts-expect-error
expectType<boolean>(functionWithProperties('foo', null));
expectType<{p1: string; readonly p2: number}>({} as Simplify<typeof functionWithProperties>); // `Simplify` removes the call signature from `typeof functionWithProperties`

type FunctionWithProperties2 = {
	(a1: boolean, ...a2: Array<string | null | undefined>): number;
	p1: {p2?: string | null} | undefined;
};
declare const functionWithProperties2: NonNullableDeep<FunctionWithProperties2>;
expectType<number>(functionWithProperties2(true, 'foo', 'bar'));
// @ts-expect-error
expectType<number>(functionWithProperties2(true, 'foo', 'bar', null));
// @ts-expect-error
expectType<number>(functionWithProperties2(true, undefined));
expectType<{p1: {p2?: string}}>({} as Simplify<typeof functionWithProperties2>);

// Functions containing multiple call signatures are not transformed
type FunctionWithProperties3 = {
	(a1: number | null): string | null;
	(a1: string | undefined, a2: number | undefined): number | undefined;
	p1: string | null;
};
declare const functionWithProperties3: NonNullableDeep<FunctionWithProperties3>;
expectType<string | null>(functionWithProperties3(null));
expectType<number | undefined>(functionWithProperties3(undefined, undefined));
expectType<{p1: string | null}>({} as Simplify<typeof functionWithProperties3>);

// `any`, `never`, and `unknown` as nested values
expectType<{a: {b: any}; c: never; d: unknown}>({} as NonNullableDeep<{a: {b: any}; c: never; d: unknown}>);

// Boundary cases
expectType<never>({} as NonNullableDeep<never>);
expectType<any>({} as NonNullableDeep<any>);
expectType<unknown>({} as NonNullableDeep<unknown>);

// An abstract class has an `abstract new` signature, so it must be kept as is just like a concrete class constructor.
abstract class AbstractClassForTest {
	foo = 1;
}

expectType<true>({} as IsEqual<NonNullableDeep<typeof AbstractClassForTest>, typeof AbstractClassForTest>);

// A typed array is a single value, so it must be kept rather than recursed into.
expectType<Uint8Array>({} as NonNullableDeep<Uint8Array | null>);

// The same holds for the other non-recursive built-ins.
expectType<ArrayBuffer>({} as NonNullableDeep<ArrayBuffer | null>);
expectType<DataView>({} as NonNullableDeep<DataView | null>);
expectType<Promise<{a: string}>>({} as NonNullableDeep<Promise<{a: string}> | null>);

// Known limitation: a generic function is rebuilt from its `Parameters` and `ReturnType`, which instantiate its type parameter with `unknown`. See the docs.
declare const genericFunction: NonNullableDeep<<Value>(value: Value) => Value>;
expectType<(value: unknown) => unknown>(genericFunction);

// A `this` parameter is neither `null` nor `undefined`, so it survives, and it is recursed into like any other parameter. `Parameters` excludes it, so it has to be added back explicitly, otherwise the rebuilt function would accept any `this`.
expectType<Date>({} as ThisParameterType<NonNullableDeep<(this: Date, x: string) => void>>);
expectType<{x: number}>({} as ThisParameterType<NonNullableDeep<(this: {x: number | null}, a: string) => void>>);
expectType<{m: (this: Date, a: string) => void}>({} as NonNullableDeep<{m(this: Date, a: string | null): void}>);

// The `this` constraint must survive, so a function whose `this` is a different type is still rejected. `ReadonlyDeep`, `WritableDeep`, `PartialDeep` and `RequiredDeep` all behave this way.
declare function needsDateThis(function_: (this: Date, x: string) => void): void;
declare const wrongThis: (this: RegExp, x: string) => void;
// @ts-expect-error
needsDateThis(wrongThis as NonNullableDeep<typeof wrongThis>);

// The `Function` interface has no call signature, so the function branch misses it, and mapping it used to produce an uncallable record of its own methods.
expectType<Function>({} as NonNullableDeep<Function>);
expectType<{callback: Function}>({} as NonNullableDeep<{callback: Function}>);

// A `PromiseLike` is a container like `Promise`, so its value is cleaned and the thenable is kept.
expectType<PromiseLike<number>>({} as NonNullableDeep<PromiseLike<number | null>>);
expectType<{value: PromiseLike<string>}>({} as NonNullableDeep<{value: PromiseLike<string | null>}>);

// A thenable with other members, like a query builder, is kept as is, because rebuilding it as a `PromiseLike` would drop those members.
type Query<Result> = PromiseLike<Result> & {where(field: string): Query<Result>};
declare const query: NonNullableDeep<{query: Query<{a: 1 | null}>}>;
expectType<Query<{a: 1 | null}>>(query.query);
expectType<Query<{a: 1 | null}>>(query.query.where('x'));

// A function that declares no `this` is rebuilt without one, rather than with `this: unknown`, which would reject a function that declares a `this`, although the original accepts it.
declare const handlerWithThis: ((this: Date, event: string) => void) & {displayName: string};
expectAssignable<NonNullableDeep<((event: string) => void) & {displayName: string}>>(handlerWithThis);
