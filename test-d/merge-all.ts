import {expectTypeOf} from 'nz';
import type {Merge, MergeAll} from '../index.d.ts';

type Foo = {
	a: string;
	b: number;
};

type Bar = {
	b: boolean;
	c: string;
};

type Baz = {
	c: number;
	d: symbol;
};

// Keys of later types override keys of earlier types.
expectTypeOf<MergeAll<[Foo, Bar, Baz]>>().toBe<{a: string; b: boolean; c: number; d: symbol}>();
expectTypeOf<MergeAll<[Baz, Bar, Foo]>>().toBe<{a: string; b: number; c: string; d: symbol}>();

// Same as nesting `Merge`.
expectTypeOf<MergeAll<[Foo, Bar]>>().toBe<Merge<Foo, Bar>>();
expectTypeOf<MergeAll<[Foo, Bar, Baz]>>().toBe<Merge<Merge<Foo, Bar>, Baz>>();
expectTypeOf<MergeAll<[Foo, Bar, Baz, {a: 1}]>>().toBe<Merge<Merge<Merge<Foo, Bar>, Baz>, {a: 1}>>();

// For these inputs, nesting the other way gives the same result.
expectTypeOf<MergeAll<[Foo, Bar, Baz]>>().toBe<Merge<Foo, Merge<Bar, Baz>>>();
expectTypeOf<MergeAll<[{[x: string]: unknown; a: string}, {[x: number]: number}, {a: number}]>>().toBe<Merge<{[x: string]: unknown; a: string}, Merge<{[x: number]: number}, {a: number}>>>();
expectTypeOf<MergeAll<[[1, 2, 3], [4, 5], [6]]>>().toBe<Merge<[1, 2, 3], Merge<[4, 5], [6]>>>();

// It does not when an array of unknown length is involved. Nested the other way, the tuple `[3]` is merged with the array first and loses its positions, so it no longer overrides the `1` of the first tuple.
expectTypeOf<MergeAll<[[1, 2], [3], string[]]>>().toBe<Array<string | 2 | 3>>();
expectTypeOf<Merge<[1, 2], Merge<[3], string[]>>>().toBe<Array<string | 1 | 2 | 3>>();

// Empty and single-element tuples.
expectTypeOf<MergeAll<[]>>().toBe<{}>();
expectTypeOf<MergeAll<readonly []>>().toBe<{}>();
expectTypeOf<MergeAll<[Foo]>>().toBe<Foo>();
expectTypeOf<MergeAll<[{}]>>().toBe<{}>();

// A single type is returned as is, without simplifying it. A non-union type repeated is too, because `Merge` returns two equal types as is. Other non-union inputs are simplified.
expectTypeOf<MergeAll<[{a: 1} & {b: 2}]>>().toBe<{a: 1} & {b: 2}>();
expectTypeOf<MergeAll<[{a: 1} & {b: 2}, {a: 1} & {b: 2}]>>().toBe<{a: 1} & {b: 2}>();
expectTypeOf<MergeAll<[{a: 1} & {b: 2}, {a: 1} & {b: 2}, {a: 1} & {b: 2}]>>().toBe<{a: 1} & {b: 2}>();
expectTypeOf<MergeAll<[{a: 1} & {b: 2}, {c: 3}]>>().toBe<{a: 1; b: 2; c: 3}>();
expectTypeOf<MergeAll<[Foo, Bar, Foo]>>().toBe<{a: string; b: number; c: string}>();

// A repeated union is merged member by member, because `Merge` distributes before it compares. Pairs of equal members are returned as is.
expectTypeOf<MergeAll<[{a: 1} | {b: 2}, {a: 1} | {b: 2}]>>().toBe<{a: 1} | {b: 2} | {a: 1; b: 2}>();

// Empty objects add nothing.
expectTypeOf<MergeAll<[{}, {}, {}]>>().toBe<{}>();
expectTypeOf<MergeAll<[Foo, {}, Bar]>>().toBe<{a: string; b: boolean; c: string}>();
expectTypeOf<MergeAll<[{}, Foo, {}]>>().toBe<Foo>();

// Labeled tuples and spread tuples.
type FooAndBar = [Foo, Bar];
expectTypeOf<MergeAll<[first: Foo, second: Bar]>>().toBe<{a: string; b: boolean; c: string}>();
expectTypeOf<MergeAll<readonly [first: Foo]>>().toBe<Foo>();
expectTypeOf<MergeAll<[...FooAndBar, {d: 1}]>>().toBe<{a: string; b: boolean; c: string; d: 1}>();
expectTypeOf<MergeAll<[{d: 1}, ...FooAndBar]>>().toBe<{d: 1; a: string; b: boolean; c: string}>();

// Nested objects are replaced, not merged.
expectTypeOf<MergeAll<[{nested: {a: 1; b: 2}}, {nested: {b: 3}}, {other: 1}]>>().toBe<{nested: {b: 3}; other: 1}>();

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface FooInterface {
	a: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface IndexInterface {
	[x: string]: unknown;
	a: string;
}

expectTypeOf<MergeAll<[FooInterface]>>().toBe<FooInterface>();
expectTypeOf<MergeAll<[FooInterface, {b: number}]>>().toBe<{a: string; b: number}>();
expectTypeOf<MergeAll<[{b: 1}, FooInterface, {c: 1}]>>().toBe<{a: string; b: 1; c: 1}>();
expectTypeOf<MergeAll<[IndexInterface, {b: 1}, {a: 1}]>>().toBe<{[x: string]: unknown; b: 1; a: 1}>();

// Readonly tuples.
expectTypeOf<MergeAll<readonly [Foo, Bar, Baz]>>().toBe<{a: string; b: boolean; c: number; d: symbol}>();

// Property modifiers come from the type that sets the key last.
expectTypeOf<MergeAll<[{a: string}, {a?: number}, {b: 1}]>>().toBe<{a?: number; b: 1}>();
expectTypeOf<MergeAll<[{readonly a: string}, {b: 1}, {a: number}]>>().toBe<{a: number; b: 1}>();
expectTypeOf<MergeAll<[{a: string}, {readonly a?: number}, {b: 1}]>>().toBe<{readonly a?: number; b: 1}>();
expectTypeOf<MergeAll<[{a?: 1}, {b: 2}, {c: 3}]>>().toBe<{a?: 1; b: 2; c: 3}>();
expectTypeOf<MergeAll<[{readonly a: 1}, {b: 2}, {c: 3}]>>().toBe<{readonly a: 1; b: 2; c: 3}>();
expectTypeOf<MergeAll<[{a?: 1}, {b: 2}, {a: 3}]>>().toBe<{b: 2; a: 3}>();
expectTypeOf<MergeAll<[{readonly a?: 1}, {readonly b?: 2}, {readonly c?: 3}]>>().toBe<{readonly a?: 1; readonly b?: 2; readonly c?: 3}>();
expectTypeOf<MergeAll<[{a: 1}, {a?: undefined}, {b: 1}]>>().toBe<{a?: undefined; b: 1}>();
expectTypeOf<MergeAll<[Partial<Foo>, Bar, Required<{c?: 1}>]>>().toBe<{a?: string; b: boolean; c: 1}>();
expectTypeOf<MergeAll<[Readonly<Foo>, Partial<Bar>, {d: 1}]>>().toBe<{readonly a: string; b?: boolean; c?: string; d: 1}>();

// An optional key replaces the key before it instead of being combined with it, unlike object spread.
expectTypeOf<MergeAll<[{a: 1}, {a?: 2}]>>().toBe<{a?: 2}>();
expectTypeOf<MergeAll<[{a: 1}, Partial<{a: 2; b: 3}>]>>().toBe<{a?: 2; b?: 3}>();

// Records.
expectTypeOf<MergeAll<[Record<'a' | 'b', number>, {b: string}, Record<'c', boolean>]>>().toBe<{a: number; b: string; c: boolean}>();
expectTypeOf<MergeAll<[Record<string, unknown>, Record<'a' | 'b', string>, {b: boolean}]>>().toBe<{[x: string]: unknown; a: string; b: boolean}>();
expectTypeOf<MergeAll<[Record<number, string>, Record<string, number | string>, {0: 'zero'}]>>().toBe<{[x: string]: number | string; 0: 'zero'}>();

// Index signatures.
expectTypeOf<MergeAll<[{[x: string]: unknown; a: string}, {[x: number]: number}, {[x: symbol]: boolean; a: number}]>>().toBe<{
	[x: string]: unknown;
	[x: number]: number;
	[x: symbol]: boolean;
	a: number;
}>();
expectTypeOf<MergeAll<[{[x: string]: string}, {[x: string]: number}, {a: 1}]>>().toBe<{[x: string]: number; a: 1}>();
expectTypeOf<MergeAll<[{a: 1}, {[x: string]: number}, {b: 2}]>>().toBe<{[x: string]: number; a: 1; b: 2}>();
expectTypeOf<MergeAll<[{a: 1}, Record<string, number>, {b: 2}]>>().toBe<{[x: string]: number; a: 1; b: 2}>();
expectTypeOf<MergeAll<[{[x: number]: 1}, {a: 1}, {[x: string]: number}]>>().toBe<{[x: string]: number; a: 1}>();
expectTypeOf<MergeAll<[{[x: string]: 1}, {[x: number]: 2}, {[x: string]: 3}]>>().toBe<{[x: string]: 3}>();
expectTypeOf<MergeAll<[{[x: `on${string}`]: () => void}, {a: 1}, {[x: string]: unknown}]>>().toBe<{[x: string]: unknown; a: 1}>();
expectTypeOf<MergeAll<[{[x: `on${string}`]: 1}, {[x: `on${string}`]: number}, {onClick: 3}]>>().toBe<{[x: `on${string}`]: number; onClick: 3}>();
expectTypeOf<MergeAll<[{readonly [x: string]: 1}, {a: 1}, {[x: string]: number}]>>().toBe<{[x: string]: number; a: 1}>();

declare const sym: unique symbol;
expectTypeOf<MergeAll<[{[sym]: 1}, {[x: symbol]: number}, {[sym]: 3}]>>().toBe<{[x: symbol]: number; [sym]: 3}>();

// A property that conflicts with a later index signature is kept. The result cannot be written as a type literal, so it is checked through indexed access.
type IncompatibleIndexSignature = MergeAll<[{[x: number]: 1}, {a: 1}, {[x: string]: 2}]>;
expectTypeOf<IncompatibleIndexSignature['a']>().toBe<1>();
expectTypeOf<IncompatibleIndexSignature[string]>().toBe<2>();
expectTypeOf<IncompatibleIndexSignature[number]>().toBe<2>();

type IncompatibleSymbolIndexSignature = MergeAll<[{[sym]: 1}, {[x: symbol]: 2}, {[sym]: 3}]>;
expectTypeOf<IncompatibleSymbolIndexSignature[typeof sym]>().toBe<3>();
expectTypeOf<IncompatibleSymbolIndexSignature[symbol]>().toBe<2>();
expectTypeOf<keyof IncompatibleSymbolIndexSignature>().toBe<symbol>();

// Unions are distributed.
expectTypeOf<MergeAll<[Foo | Baz, Bar]>>().toBe<{a: string; b: boolean; c: string} | {b: boolean; c: string; d: symbol}>();
expectTypeOf<MergeAll<[Foo, Bar | Baz, {e: 1}]>>().toBe<{a: string; b: boolean; c: string; e: 1} | {a: string; b: number; c: number; d: symbol; e: 1}>();
expectTypeOf<MergeAll<[Foo, Bar, Baz | {e: 1}]>>().toBe<{a: string; b: boolean; c: number; d: symbol} | {a: string; b: boolean; c: string; e: 1}>();
expectTypeOf<MergeAll<[{a: 1} | {b: 1}, {c: 1} | {a: 2}]>>().toBe<{a: 1; c: 1} | {a: 2} | {b: 1; c: 1} | {b: 1; a: 2}>();
expectTypeOf<MergeAll<[{a: 1} | {a: 2}, {b: 1} | {b: 2}, {c: 1} | {c: 2}]>>().toBe<
	| {a: 1; b: 1; c: 1} | {a: 1; b: 1; c: 2} | {a: 1; b: 2; c: 1} | {a: 1; b: 2; c: 2}
	| {a: 2; b: 1; c: 1} | {a: 2; b: 1; c: 2} | {a: 2; b: 2; c: 1} | {a: 2; b: 2; c: 2}
>();
expectTypeOf<MergeAll<[Foo, Bar] | [Baz]>>().toBe<Baz | {a: string; b: boolean; c: string}>();
expectTypeOf<MergeAll<[] | [Foo] | [Foo, Bar]>>().toBe<Foo | {} | {a: string; b: boolean; c: string}>();
expectTypeOf<MergeAll<readonly [Foo] | [Bar, Baz]>>().toBe<Foo | {b: boolean; c: number; d: symbol}>();
expectTypeOf<MergeAll<[Foo, ...([Bar] | [Baz])]>>().toBe<{a: string; b: boolean; c: string} | {a: string; b: number; c: number; d: symbol}>();

// Tuples are combined position by position, like `Merge`.
expectTypeOf<MergeAll<[[1, 2, 3], [4, 5], [6]]>>().toBe<[6, 5, 3]>();
expectTypeOf<MergeAll<[[1, 2, 3], [4, 5], [6], []]>>().toBe<[6, 5, 3]>();
expectTypeOf<MergeAll<[[], [1], [2, 3]]>>().toBe<[2, 3]>();
expectTypeOf<MergeAll<[readonly [1, 2], readonly [3], readonly []]>>().toBe<readonly [3, 2]>();
expectTypeOf<MergeAll<[readonly [1, 2, 3], [4], readonly [5, 6]]>>().toBe<[5, 6, 3]>();
expectTypeOf<MergeAll<[[1, 2], [3], {a: 1}]>>().toBe<Merge<[3, 2], {a: 1}>>();
expectTypeOf<MergeAll<[{a: 1}, {b: 2}, [3]]>>().toBe<Merge<{a: 1; b: 2}, [3]>>();

// Known limitation of `Merge`: a number key of an object does not override the position of a tuple.
expectTypeOf<MergeAll<[[1], {b: 1}, {0: 2}]>>().toBe<never>();

// An array of unknown length gives an array of the element types of both sides at that step.
expectTypeOf<MergeAll<[[1, 2, 3], string[], [4]]>>().toBe<Array<string | 1 | 2 | 3 | 4>>();
expectTypeOf<MergeAll<[string[], number[], boolean[]]>>().toBe<Array<string | number | boolean>>();
expectTypeOf<MergeAll<[readonly string[], readonly number[], readonly boolean[]]>>().toBe<ReadonlyArray<string | number | boolean>>();
expectTypeOf<MergeAll<[[1, 2], [3?], [4]]>>().toBe<Array<1 | 2 | 3 | 4 | undefined>>();
expectTypeOf<MergeAll<[[1, ...string[]], [2]]>>().toBe<Array<string | 1 | 2>>();

// The call signature of the last type that has one is kept.
type First = (value: string) => number;
type Second = {(value: number): string; property: number};
expectTypeOf<MergeAll<[First, Second, {other: boolean}]>>().toBe<((value: number) => string) & {property: number; other: boolean}>();
expectTypeOf<MergeAll<[Second, First, {property: string}]>>().toBe<((value: string) => number) & {property: string}>();
expectTypeOf<MergeAll<[First, {other: 1}, {property: 2}]>>().toBe<((value: string) => number) & {other: 1; property: 2}>();
expectTypeOf<MergeAll<[First, Second, (value: boolean) => void]>>().toBe<((value: boolean) => void) & {property: number}>();
expectTypeOf<MergeAll<[{a: 1}, First, {b: 2}]>>().toBe<((value: string) => number) & {a: 1; b: 2}>();
expectTypeOf<MergeAll<[Second, {property: string}, {property: boolean}]>>().toBe<((value: number) => string) & {property: boolean}>();
expectTypeOf<MergeAll<[{a: 1}, <Value>(value: Value) => Value, {b: 2}]>>().toBe<((value: unknown) => unknown) & {a: 1; b: 2}>();
expectTypeOf<MergeAll<[((value: string) => number) | {property: 1}, {other: 1}, {property: 2}]>>().toBe<{other: 1; property: 2} | (((value: string) => number) & {other: 1; property: 2})>();

// Inference from rest parameters.
declare function mergeAll<Objects extends readonly object[]>(...objects: Objects): MergeAll<Objects>;
expectTypeOf(mergeAll({a: 1, b: 'b'}, {b: true}, {c: 3})).toBe<{a: number; b: boolean; c: number}>();
expectTypeOf(mergeAll()).toBe<{}>();
expectTypeOf(mergeAll({a: 1})).toBe<{a: number}>();
expectTypeOf(mergeAll({a: 1}, {a: 'x', b: [1, 2]})).toBe<{a: string; b: number[]}>();
expectTypeOf(mergeAll({a: 1} as const, {b: 'x'} as const)).toBe<{readonly a: 1; readonly b: 'x'}>();
expectTypeOf(mergeAll({a: 1, b: 'b'} as const, {b: true} as const, {c: 3})).toBe<{readonly a: 1; readonly b: true; c: number}>();

declare function mergeAllConst<const Objects extends readonly object[]>(...objects: Objects): MergeAll<Objects>;
expectTypeOf(mergeAllConst({a: 1, b: 'x'}, {b: true}, {c: [1, 2]})).toBe<{readonly a: 1; readonly b: true; readonly c: readonly [1, 2]}>();

// A readonly tuple from `as const`.
const layers = [{a: 1}, {b: 'x'}] as const;
expectTypeOf<MergeAll<typeof layers>>().toBe<{readonly a: 1; readonly b: 'x'}>();

// Generic types are resolved once they are known.
declare function withId<Value extends object>(value: Value): MergeAll<[Value, {id: string}]>;
expectTypeOf(withId({id: 1, name: 'x'})).toBe<{name: string; id: string}>();

declare function withDefaults<Options extends object>(options: Options): MergeAll<[{retries: number; timeout: number}, Options, {id: string}]>;
expectTypeOf(withDefaults({timeout: 'none' as const})).toBe<{retries: number; timeout: 'none'; id: string}>();

// Known limitation of `Merge`: inside a generic function, a spread is not assignable.
function mergeGeneric<FirstObject extends object, SecondObject extends object>(first: FirstObject, second: SecondObject): MergeAll<[FirstObject, SecondObject, {id: string}]> {
	// @ts-expect-error
	return {...first, ...second, id: 'x'};
}

// Longer tuples. Each step reads the previous result once, so this stays fast.
type Thirty = [
	{a: 0}, {b: 1}, {c: 2}, {d: 3}, {e: 4}, {f: 5}, {g: 6}, {h: 7}, {i: 8}, {a: 9},
	{b: 10}, {c: 11}, {d: 12}, {e: 13}, {f: 14}, {g: 15}, {h: 16}, {i: 17}, {a: 18}, {b: 19},
	{c: 20}, {d: 21}, {e: 22}, {f: 23}, {g: 24}, {h: 25}, {i: 26}, {a: 27}, {b: 28}, {c: 29},
];
expectTypeOf<MergeAll<Thirty>>().toBe<{a: 27; b: 28; c: 29; d: 21; e: 22; f: 23; g: 24; h: 25; i: 26}>();

type ThirtyWithIndexSignatures = [
	{[x: string]: number; a: 0}, {[x: number]: 1; readonly b: 1}, {[x: symbol]: 2; c: 2}, {[x: string]: number; a: 3}, {[x: number]: 4; readonly b: 4}, {[x: symbol]: 5; c: 5},
	{[x: string]: number; a: 6}, {[x: number]: 7; readonly b: 7}, {[x: symbol]: 8; c: 8}, {[x: string]: number; a: 9}, {[x: number]: 10; readonly b: 10}, {[x: symbol]: 11; c: 11},
	{[x: string]: number; a: 12}, {[x: number]: 13; readonly b: 13}, {[x: symbol]: 14; c: 14}, {[x: string]: number; a: 15}, {[x: number]: 16; readonly b: 16}, {[x: symbol]: 17; c: 17},
	{[x: string]: number; a: 18}, {[x: number]: 19; readonly b: 19}, {[x: symbol]: 20; c: 20}, {[x: string]: number; a: 21}, {[x: number]: 22; readonly b: 22}, {[x: symbol]: 23; c: 23},
	{[x: string]: number; a: 24}, {[x: number]: 25; readonly b: 25}, {[x: symbol]: 26; c: 26}, {[x: string]: number; a: 27}, {[x: number]: 28; readonly b: 28}, {[x: symbol]: 29; c: 29},
];
expectTypeOf<MergeAll<ThirtyWithIndexSignatures>>().toBe<{[x: string]: number; [x: number]: 28; [x: symbol]: 29; a: 27; readonly b: 28; c: 29}>();

// Boundary cases.
expectTypeOf<MergeAll<any>>().toBe<any>();
expectTypeOf<MergeAll<never>>().toBe<never>();
expectTypeOf<MergeAll<[never]>>().toBe<never>();
expectTypeOf<MergeAll<[Foo, never, Bar]>>().toBe<never>();
expectTypeOf<MergeAll<[any, Foo]>>().toBe<Merge<any, Foo>>();
expectTypeOf<MergeAll<[Foo, any]>>().toBe<Merge<Foo, any>>();
expectTypeOf<MergeAll<[Foo, any, Bar]>>().toBe<{[x: string]: any; a: string; b: boolean; c: string}>();
expectTypeOf<MergeAll<[unknown, Foo]>>().toBe<Foo>();
expectTypeOf<MergeAll<[Foo, unknown]>>().toBe<Foo>();
expectTypeOf<MergeAll<[any]>>().toBe<any>();
expectTypeOf<MergeAll<[any, any]>>().toBe<any>();
expectTypeOf<MergeAll<[any, Foo, Bar]>>().toBe<{[x: string]: any; a: string; b: boolean; c: string}>();
expectTypeOf<MergeAll<[Foo, Bar, any]>>().toBe<{[x: string]: any; a: string; b: boolean; c: string}>();
expectTypeOf<MergeAll<[unknown, any]>>().toBe<{[x: string]: any}>();
expectTypeOf<MergeAll<[unknown]>>().toBe<unknown>();
expectTypeOf<MergeAll<[unknown, unknown, unknown]>>().toBe<unknown>();
expectTypeOf<MergeAll<[Foo, unknown, Bar]>>().toBe<{a: string; b: boolean; c: string}>();
expectTypeOf<MergeAll<[never, Foo]>>().toBe<never>();
expectTypeOf<MergeAll<[Foo, Bar, never]>>().toBe<never>();
expectTypeOf<MergeAll<[object, Foo]>>().toBe<{a: string; b: number}>();

// Enum member keys override the same keys written as their values.
enum Key {
	A = 'a',
}

expectTypeOf<MergeAll<[{a: 1}, {b: 1}, {[Key.A]: 2}]>>().toBe<{b: 1; a: 2}>();
expectTypeOf<MergeAll<[{[Key.A]: 1}, {b: 1}, {a: 2}]>>().toBe<{b: 1; a: 2}>();

// Known limitation: tuples and arrays without a fixed length are not supported.
expectTypeOf<MergeAll<[Foo, Bar?]>>().toBe<never>();
expectTypeOf<MergeAll<[Foo?]>>().toBe<never>();
expectTypeOf<MergeAll<[Foo, ...Bar[]]>>().toBe<never>();
expectTypeOf<MergeAll<[...Bar[], Foo]>>().toBe<never>();
expectTypeOf<MergeAll<Foo[]>>().toBe<never>();
expectTypeOf<MergeAll<readonly Foo[]>>().toBe<never>();
expectTypeOf<MergeAll<unknown[]>>().toBe<never>();
expectTypeOf<MergeAll<any[]>>().toBe<never>();
expectTypeOf<MergeAll<never[]>>().toBe<never>();

declare const objects: Array<{a: 1}>;
expectTypeOf(mergeAll(...objects)).toBe<never>();

// @ts-expect-error
type NotAnArray = MergeAll<Foo>;

// @ts-expect-error
type NotAnArrayString = MergeAll<string>;
