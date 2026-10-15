import {expectTypeOf} from 'nz';
import type {IsEqual, JsonValue, PartialDeep, ReadonlyDeep, UndefinableDeep} from '../index.d.ts';

// Leaf values accept undefined, but required object containers stay present.
expectTypeOf<UndefinableDeep<{a: string; b: number}>>().toBe<{a: string | undefined; b: number | undefined}>();
expectTypeOf<UndefinableDeep<{a: {b: {c: string}}}>>().toBe<{a: {b: {c: string | undefined}}}>();
expectTypeOf<{a: undefined}>().not.toBeAssignableTo<UndefinableDeep<{a: {b: string}}>>();
expectTypeOf<{}>().not.toBeAssignableTo<UndefinableDeep<{a: {b: string}}>>();
expectTypeOf<{a: {}}>().not.toBeAssignableTo<UndefinableDeep<{a: {b: string}}>>();

// Optionality, explicit undefined unions, and readonly modifiers are preserved.
expectTypeOf<UndefinableDeep<{a?: string; readonly b: number}>>().toBe<{a?: string | undefined; readonly b: number | undefined}>();
expectTypeOf<IsEqual<UndefinableDeep<{readonly a: {b: string}}>, {readonly a: {b: string | undefined}}>>().toBe<true>();
expectTypeOf<{a: undefined}>().toBeAssignableTo<UndefinableDeep<{a?: string}>>();
expectTypeOf<UndefinableDeep<{a: {b: string} | undefined}>>().toBe<{a: {b: string | undefined} | undefined}>();
expectTypeOf<UndefinableDeep<{a?: {b: string}}>>().toBe<{a?: {b: string | undefined} | undefined}>();
expectTypeOf<{}>().not.toBeAssignableTo<UndefinableDeep<{a: string}>>();

// Built-ins are leaves, both at the top level and inside objects.
expectTypeOf<UndefinableDeep<{a: Date; b: RegExp}>>().toBe<{a: Date | undefined; b: RegExp | undefined}>();
expectTypeOf<UndefinableDeep<{a: Uint8Array; b: ArrayBuffer}>>().toBe<{a: Uint8Array | undefined; b: ArrayBuffer | undefined}>();
expectTypeOf<UndefinableDeep<string>>().toBe<string | undefined>();
expectTypeOf<UndefinableDeep<number>>().toBe<number | undefined>();
expectTypeOf<UndefinableDeep<boolean>>().toBe<boolean | undefined>();
expectTypeOf<UndefinableDeep<bigint>>().toBe<bigint | undefined>();
expectTypeOf<UndefinableDeep<symbol>>().toBe<symbol | undefined>();
expectTypeOf<UndefinableDeep<Date>>().toBe<Date | undefined>();
expectTypeOf<UndefinableDeep<RegExp>>().toBe<RegExp | undefined>();
expectTypeOf<UndefinableDeep<null>>().toBe<null | undefined>();
expectTypeOf<UndefinableDeep<undefined>>().toBe<undefined>();
declare const voidLeaf: void | undefined;
expectTypeOf(voidLeaf).toBe<UndefinableDeep<void>>();

// Index signatures and unions recurse into object values without discarding containers.
expectTypeOf<UndefinableDeep<{[key: string]: {a: number}}>>().toBe<{[key: string]: {a: number | undefined}}>();
expectTypeOf<UndefinableDeep<{a: number} | {b: string}>>().toBe<{a: number | undefined} | {b: string | undefined}>();
expectTypeOf<UndefinableDeep<string | {a: number}>>().toBe<string | {a: number | undefined} | undefined>();

// Arrays widen primitive elements; object elements remain present.
expectTypeOf<UndefinableDeep<string[]>>().toBe<Array<string | undefined>>();
expectTypeOf<UndefinableDeep<readonly string[]>>().toBe<ReadonlyArray<string | undefined>>();
expectTypeOf<UndefinableDeep<ReadonlyArray<{a: number}>>>().toBe<ReadonlyArray<{a: number | undefined}>>();
expectTypeOf<UndefinableDeep<{a: Array<{b: number}>}>>().toBe<{a: Array<{b: number | undefined}>}>();
expectTypeOf<{a: undefined}>().not.toBeAssignableTo<UndefinableDeep<{a: string[]}>>();
expectTypeOf<[undefined]>().not.toBeAssignableTo<UndefinableDeep<Array<{a: number}>>>();

// Homomorphic tuple mapping preserves labels, readonly, optional, and rest elements.
expectTypeOf<UndefinableDeep<[]>>().toBe<[]>();
expectTypeOf<UndefinableDeep<readonly []>>().toBe<readonly []>();
expectTypeOf<UndefinableDeep<[name: string, count: number]>>().toBe<[name: string | undefined, count: number | undefined]>();
expectTypeOf<UndefinableDeep<[string, number?]>>().toBe<[string | undefined, (number | undefined)?]>();
expectTypeOf<UndefinableDeep<[string, ...number[]]>>().toBe<[string | undefined, ...Array<number | undefined>]>();
expectTypeOf<UndefinableDeep<[...string[], number]>>().toBe<[...Array<string | undefined>, number | undefined]>();
expectTypeOf<UndefinableDeep<readonly [string, {a: number}]>>().toBe<readonly [string | undefined, {a: number | undefined}]>();
expectTypeOf<[undefined, undefined]>().toBeAssignableTo<UndefinableDeep<[string, number?]>>();
expectTypeOf<[undefined]>().not.toBeAssignableTo<UndefinableDeep<[string, number]>>();
expectTypeOf<[undefined]>().not.toBeAssignableTo<UndefinableDeep<[{a: number}]>>();

// Collections widen primitive keys, values, and items consistently.
expectTypeOf<UndefinableDeep<Map<string, number>>>().toBe<Map<string | undefined, number | undefined>>();
expectTypeOf<UndefinableDeep<ReadonlyMap<string, {a: number}>>>().toBe<ReadonlyMap<string | undefined, {a: number | undefined}>>();
expectTypeOf<UndefinableDeep<Map<{a: number}, string>>>().toBe<Map<{a: number | undefined}, string | undefined>>();
expectTypeOf<UndefinableDeep<Set<string>>>().toBe<Set<string | undefined>>();
expectTypeOf<UndefinableDeep<ReadonlySet<string>>>().toBe<ReadonlySet<string | undefined>>();
expectTypeOf<UndefinableDeep<Set<{a: number}>>>().toBe<Set<{a: number | undefined}>>();
expectTypeOf<UndefinableDeep<ReadonlySet<{a: number}>>>().toBe<ReadonlySet<{a: number | undefined}>>();
expectTypeOf<{a: undefined}>().not.toBeAssignableTo<UndefinableDeep<{a: Map<string, number>}>>();
expectTypeOf<{a: undefined}>().not.toBeAssignableTo<UndefinableDeep<{a: Set<string>}>>();

// Weak collections cannot acquire undefined keys, even when their keys are leaves.
expectTypeOf<UndefinableDeep<WeakMap<{k: string}, number>>>().toBe<WeakMap<{k: string | undefined}, number | undefined>>();
expectTypeOf<UndefinableDeep<WeakMap<Date, RegExp>>>().toBe<WeakMap<Date, RegExp | undefined>>();
expectTypeOf<UndefinableDeep<WeakMap<symbol, string>>>().toBe<WeakMap<symbol, string | undefined>>();
expectTypeOf<UndefinableDeep<WeakSet<{a: number}>>>().toBe<WeakSet<{a: number | undefined}>>();
expectTypeOf<UndefinableDeep<WeakSet<RegExp>>>().toBe<WeakSet<RegExp>>();
expectTypeOf<UndefinableDeep<WeakSet<symbol>>>().toBe<WeakSet<symbol>>();
expectTypeOf<UndefinableDeep<WeakSet<Date | {a: number}>>>().toBe<WeakSet<Date | {a: number | undefined}>>();
expectTypeOf<UndefinableDeep<WeakSet<never>>>().toBe<WeakSet<never>>();
expectTypeOf<UndefinableDeep<WeakMap<never, string>>>().toBe<WeakMap<never, string | undefined>>();
expectTypeOf<UndefinableDeep<WeakSet<() => void>>>().toBe<WeakSet<() => void>>();

// Promise containers remain present, while primitive fulfillment values widen.
expectTypeOf<UndefinableDeep<Promise<string>>>().toBe<Promise<string | undefined>>();
expectTypeOf<UndefinableDeep<Promise<{a: number}>>>().toBe<Promise<{a: number | undefined}>>();
expectTypeOf<{a: undefined}>().not.toBeAssignableTo<UndefinableDeep<{a: Promise<string>}>>();
expectTypeOf<UndefinableDeep<PromiseLike<string>>>().toBe<PromiseLike<string> | undefined>();

// Callable leaves retain their complete signatures and attached properties.
type FunctionWithProperties = {(a1: string, a2: number): boolean; p1: string; readonly p2: {q: number}};
expectTypeOf<UndefinableDeep<FunctionWithProperties>>().toBe<FunctionWithProperties | undefined>();
expectTypeOf<UndefinableDeep<(value: string) => number>>().toBe<((value: string) => number) | undefined>();
type GenericFunction = {<Value>(value: Value): Value; description: string};
declare const genericFunction: UndefinableDeep<GenericFunction>;
expectTypeOf(genericFunction).toBe<GenericFunction | undefined>();
if (genericFunction) {
	expectTypeOf(genericFunction('literal')).toBe<string>();
	expectTypeOf(genericFunction(123)).toBe<number>();
	expectTypeOf(genericFunction.description).toBe<string>();
}

type OverloadedFunction = {(value: string): string; (value: number): number; description: string};
declare const overloadedFunction: UndefinableDeep<OverloadedFunction>;
expectTypeOf(overloadedFunction).toBe<OverloadedFunction | undefined>();
if (overloadedFunction) {
	expectTypeOf(overloadedFunction('value')).toBe<string>();
	expectTypeOf(overloadedFunction(1)).toBe<number>();
	expectTypeOf(overloadedFunction.description).toBe<string>();
}

// Concrete, abstract, and generic constructors are leaves too.
type Constructor = new (value: string) => {value: string};
type AbstractConstructor = abstract new (value: string) => {value: string};
type GenericConstructor = {description: string; new<Value>(value: Value): {value: Value}};
expectTypeOf<UndefinableDeep<Constructor>>().toBe<Constructor | undefined>();
expectTypeOf<UndefinableDeep<AbstractConstructor>>().toBe<AbstractConstructor | undefined>();
declare const GenericConstructorValue: UndefinableDeep<GenericConstructor>;
expectTypeOf(GenericConstructorValue).toBe<GenericConstructor | undefined>();
if (GenericConstructorValue) {
	expectTypeOf(new GenericConstructorValue('value')).toBe<{value: string}>();
	expectTypeOf(GenericConstructorValue.description).toBe<string>();
}

// An impossible leaf can be cleared; unknown and any retain their existing breadth.
expectTypeOf<UndefinableDeep<never>>().toBe<undefined>();
expectTypeOf<UndefinableDeep<{a: never}>>().toBe<{a: undefined}>();
expectTypeOf<UndefinableDeep<never[]>>().toBe<undefined[]>();
expectTypeOf<UndefinableDeep<unknown>>().toBe<unknown>();
expectTypeOf<UndefinableDeep<any>>().toBe<any>();

// A recursive type, such as `JsonValue`, does not make the type infinitely deep.
declare const jsonValue: UndefinableDeep<{a: JsonValue}>;
expectTypeOf(jsonValue.a).toBeAssignableTo<UndefinableDeep<JsonValue>>();
expectTypeOf<{a: [1, {b: undefined}]}>().toBeAssignableTo<UndefinableDeep<{a: JsonValue}>>();

// The original type is always assignable to the result, since the result only widens values.
type Settings = {
	theme: {mode: 'light' | 'dark'; accent: string};
	shortcuts: Map<string, string[]>;
	recent: ReadonlyArray<{path: string; openedAt: Date}>;
	window?: [width: number, height: number];
	onSave: (value: string) => void;
};
expectTypeOf<Settings>().toBeAssignableTo<UndefinableDeep<Settings>>();

// Applying it twice gives the same result as applying it once.
expectTypeOf<UndefinableDeep<UndefinableDeep<Settings>>>().toBe<UndefinableDeep<Settings>>();

// A realistic draft can clear every leaf, at any depth, while keeping each container.
expectTypeOf<{
	theme: {mode: undefined; accent: undefined};
	shortcuts: Map<string | undefined, Array<string | undefined>>;
	recent: [{path: undefined; openedAt: undefined}];
	window: [undefined, undefined];
	onSave: undefined;
}>().toBeAssignableTo<UndefinableDeep<Settings>>();
expectTypeOf<{
	theme: undefined;
	shortcuts: Map<string, string[]>;
	recent: [];
	onSave: undefined;
}>().not.toBeAssignableTo<UndefinableDeep<Settings>>();

// Literal unions, `null`, and an existing `undefined` keep their members, with `undefined` added once.
expectTypeOf<UndefinableDeep<{a: 'light' | 'dark'; b: 1 | 2; c: true}>>().toBe<{a: 'light' | 'dark' | undefined; b: 1 | 2 | undefined; c: true | undefined}>();
expectTypeOf<UndefinableDeep<{a: string | null}>>().toBe<{a: string | null | undefined}>();
expectTypeOf<UndefinableDeep<{a: string | undefined}>>().toBe<{a: string | undefined}>();
expectTypeOf<UndefinableDeep<{a: `id-${number}`}>>().toBe<{a: `id-${number}` | undefined}>();

// Enums are leaves.
enum Direction {
	Up,
	Down,
}
expectTypeOf<UndefinableDeep<{direction: Direction}>>().toBe<{direction: Direction | undefined}>();

// A branded primitive is a leaf, so its brand is kept.
type UserId = string & {readonly brand: unique symbol};
expectTypeOf<UndefinableDeep<{id: UserId}>>().toBe<{id: UserId | undefined}>();

// A union of a leaf and a container widens only the leaf member.
expectTypeOf<UndefinableDeep<{a: string | string[]}>>().toBe<{a: string | Array<string | undefined> | undefined}>();
expectTypeOf<UndefinableDeep<{a: Date | {at: number}}>>().toBe<{a: Date | {at: number | undefined} | undefined}>();
expectTypeOf<UndefinableDeep<Array<string | {a: number}>>>().toBe<Array<string | {a: number | undefined} | undefined>>();

// Discriminated unions keep each member, with the discriminant widened too.
type Shape = {kind: 'circle'; radius: number} | {kind: 'square'; size: number};
expectTypeOf<UndefinableDeep<Shape>>().toBe<{kind: 'circle' | undefined; radius: number | undefined} | {kind: 'square' | undefined; size: number | undefined}>();

// Intersections are flattened into one object.
expectTypeOf<UndefinableDeep<{a: string} & {b: {c: number}}>>().toBe<{a: string | undefined; b: {c: number | undefined}}>();

// Nested arrays keep every level of nesting.
expectTypeOf<UndefinableDeep<string[][]>>().toBe<Array<Array<string | undefined>>>();
expectTypeOf<UndefinableDeep<ReadonlyArray<readonly number[]>>>().toBe<ReadonlyArray<ReadonlyArray<number | undefined>>>();
expectTypeOf<UndefinableDeep<Array<[string, number]>>>().toBe<Array<[string | undefined, number | undefined]>>();
expectTypeOf<UndefinableDeep<[string[], [number]]>>().toBe<[Array<string | undefined>, [number | undefined]]>();
expectTypeOf<UndefinableDeep<Date[]>>().toBe<Array<Date | undefined>>();
expectTypeOf<[[undefined]]>().toBeAssignableTo<UndefinableDeep<string[][]>>();
expectTypeOf<[undefined]>().not.toBeAssignableTo<UndefinableDeep<string[][]>>();

// Tuples with object elements, optional elements, and object rest elements.
expectTypeOf<UndefinableDeep<[{a: number}, {b: string}?]>>().toBe<[{a: number | undefined}, ({b: string | undefined} | undefined)?]>();
expectTypeOf<UndefinableDeep<[string, ...Array<{a: number}>]>>().toBe<[string | undefined, ...Array<{a: number | undefined}>]>();
expectTypeOf<UndefinableDeep<readonly [x?: number, y?: number]>>().toBe<readonly [x?: number | undefined, y?: number | undefined]>();
expectTypeOf<UndefinableDeep<[string] | number[]>>().toBe<[string | undefined] | Array<number | undefined>>();

// Index signatures of every key type, and records.
expectTypeOf<UndefinableDeep<{[index: number]: string}>>().toBe<{[index: number]: string | undefined}>();
expectTypeOf<UndefinableDeep<{[key: `data-${string}`]: number}>>().toBe<{[key: `data-${string}`]: number | undefined}>();
expectTypeOf<UndefinableDeep<Record<string, string[]>>>().toBe<Record<string, Array<string | undefined>>>();
expectTypeOf<UndefinableDeep<Record<'a' | 'b', {c: number}>>>().toBe<{a: {c: number | undefined}; b: {c: number | undefined}}>();
expectTypeOf<UndefinableDeep<{[key: string]: number; known: number}>>().toBe<{[key: string]: number | undefined; known: number | undefined}>();

// Symbol keys are kept.
declare const symbolKey: unique symbol;
expectTypeOf<UndefinableDeep<{[symbolKey]: {a: string}}>>().toBe<{[symbolKey]: {a: string | undefined}}>();

// Collections inside collections, and collections inside objects.
expectTypeOf<UndefinableDeep<Map<string, Set<number>>>>().toBe<Map<string | undefined, Set<number | undefined>>>();
expectTypeOf<UndefinableDeep<Set<string[]>>>().toBe<Set<Array<string | undefined>>>();
expectTypeOf<UndefinableDeep<Map<string, [number, {a: string}]>>>().toBe<Map<string | undefined, [number | undefined, {a: string | undefined}]>>();
expectTypeOf<UndefinableDeep<{a: ReadonlyMap<string, Date>}>>().toBe<{a: ReadonlyMap<string | undefined, Date | undefined>}>();
expectTypeOf<UndefinableDeep<Promise<string[]>>>().toBe<Promise<Array<string | undefined>>>();
expectTypeOf<UndefinableDeep<Promise<Promise<number>>>>().toBe<Promise<Promise<number | undefined>>>();
expectTypeOf<UndefinableDeep<Map<string, Promise<{a: number}>>>>().toBe<Map<string | undefined, Promise<{a: number | undefined}>>>();
expectTypeOf<UndefinableDeep<WeakMap<{key: string}, Array<{value: number}>>>>().toBe<WeakMap<{key: string | undefined}, Array<{value: number | undefined}>>>();

// Methods are function leaves, so they keep their signatures.
type Counter = {
	count: number;
	increment(by: number): void;
	readonly reset: () => void;
};
expectTypeOf<UndefinableDeep<Counter>>().toBe<{count: number | undefined; increment: ((by: number) => void) | undefined; readonly reset: (() => void) | undefined}>();

// A function with properties inside an object is a leaf as well.
expectTypeOf<UndefinableDeep<{handler: FunctionWithProperties}>>().toBe<{handler: FunctionWithProperties | undefined}>();

// A class instance becomes an object of its public members, and its constructor is a leaf, with static members kept.
class Point {
	static origin = new Point(0, 0);

	constructor(public x: number, public y: number) {}

	distanceTo(other: Point): number {
		return Math.hypot(this.x - other.x, this.y - other.y);
	}
}
expectTypeOf<UndefinableDeep<Point>>().toBe<{x: number | undefined; y: number | undefined; distanceTo: ((other: Point) => number) | undefined}>();
expectTypeOf<UndefinableDeep<typeof Point>>().toBe<typeof Point | undefined>();

// Self-referencing types recurse lazily.
type TreeNode = {value: number; children: TreeNode[]};
expectTypeOf<{value: undefined; children: [{value: 1; children: []}]}>().toBeAssignableTo<UndefinableDeep<TreeNode>>();
expectTypeOf<{value: 1; children: [{value: 1; children: undefined}]}>().not.toBeAssignableTo<UndefinableDeep<TreeNode>>();
type LinkedList = {value: string; next?: LinkedList};
expectTypeOf<{value: undefined; next: {value: undefined; next: undefined}}>().toBeAssignableTo<UndefinableDeep<LinkedList>>();

// A `never` leaf at any depth becomes `undefined`, while its container is kept.
expectTypeOf<UndefinableDeep<{a: {b: never}}>>().toBe<{a: {b: undefined}}>();
expectTypeOf<UndefinableDeep<Promise<never>>>().toBe<Promise<undefined>>();
expectTypeOf<UndefinableDeep<[never]>>().toBe<[undefined]>();

// `any` and `unknown` stay as they are at any depth.
expectTypeOf<UndefinableDeep<{a: any; b: unknown}>>().toBe<{a: any; b: unknown}>();
expectTypeOf<UndefinableDeep<unknown[]>>().toBe<unknown[]>();
expectTypeOf<UndefinableDeep<any[]>>().toBe<any[]>();
expectTypeOf<UndefinableDeep<Map<any, unknown>>>().toBe<Map<any, unknown>>();

// Empty and broad object types stay as they are.
expectTypeOf<UndefinableDeep<{}>>().toBe<{}>();
expectTypeOf<UndefinableDeep<object>>().toBe<object>();
expectTypeOf<UndefinableDeep<Record<string, never>>>().toBe<Record<string, undefined>>();

// It composes with the other deep types.
expectTypeOf<UndefinableDeep<ReadonlyDeep<{a: {b: string[]}}>>>().toBe<{readonly a: {readonly b: ReadonlyArray<string | undefined>}}>();
expectTypeOf<UndefinableDeep<PartialDeep<{a: {b: string}}>>>().toBe<{a?: {b?: string | undefined} | undefined}>();

// A generic type is resolved once it is instantiated.
type Draft<Value> = {value: UndefinableDeep<Value>; dirty: boolean};
expectTypeOf<Draft<{name: string; tags: string[]}>>().toBe<{value: {name: string | undefined; tags: Array<string | undefined>}; dirty: boolean}>();

// A DOM node is a single value, so it is kept as is.
expectTypeOf<UndefinableDeep<{element: HTMLElement}>>().toBe<{element: HTMLElement | undefined}>();
