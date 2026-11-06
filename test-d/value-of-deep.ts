import {expectTypeOf} from 'nz';
import type {JsonValue, ValueOfDeep} from '../index.d.ts';

// The example from the issue.
type Config = {
	theme: {
		color: 'red';
		size: {
			small: 12;
			large: 24;
		};
	};
	mode: 'dark';
};

expectTypeOf<ValueOfDeep<Config>>().toBe<'red' | 12 | 24 | 'dark'>();

const config = {
	theme: {
		color: 'red',
		size: {
			small: 12,
			large: 24,
		},
	},
	mode: 'dark',
} as const;

expectTypeOf<ValueOfDeep<typeof config>>().toBe<'red' | 12 | 24 | 'dark'>();

// Intermediate objects are not part of the result.
expectTypeOf<ValueOfDeep<Config>>().not.toBeAssignableTo<{color: 'red'}>();
expectTypeOf<ValueOfDeep<Config>>().not.toBeAssignableTo<'blue'>();

// Primitives at the top level.
expectTypeOf<ValueOfDeep<'a'>>().toBe<'a'>();
expectTypeOf<ValueOfDeep<string>>().toBe<string>();
expectTypeOf<ValueOfDeep<null>>().toBe<null>();
expectTypeOf<ValueOfDeep<undefined>>().toBe<undefined>();
expectTypeOf<ValueOfDeep<void>>().toBe<void>();

// Arrays and tuples contribute their element values.
expectTypeOf<ValueOfDeep<['a', 'b']>>().toBe<'a' | 'b'>();
expectTypeOf<ValueOfDeep<readonly ['a', {b: 'c'}]>>().toBe<'a' | 'c'>();
expectTypeOf<ValueOfDeep<Array<{value: 1}>>>().toBe<1>();
expectTypeOf<ValueOfDeep<Array<Array<{value: 1}>>>>().toBe<1>();
expectTypeOf<ValueOfDeep<[]>>().toBe<never>();
expectTypeOf<ValueOfDeep<{tuple: [1, 2]}>>().toBe<1 | 2>();
expectTypeOf<ValueOfDeep<{array: string[]}>>().toBe<string>();

// Non-recursive built-ins stay as leaf values.
expectTypeOf<ValueOfDeep<{date: Date}>>().toBe<Date>();
expectTypeOf<ValueOfDeep<{function: (value: string) => number}>>().toBe<(value: string) => number>();
expectTypeOf<ValueOfDeep<{map: Map<string, number>}>>().toBe<Map<string, number>>();
expectTypeOf<ValueOfDeep<{set: Set<number>}>>().toBe<Set<number>>();
expectTypeOf<ValueOfDeep<{promise: Promise<string>}>>().toBe<Promise<string>>();
expectTypeOf<ValueOfDeep<{typedArray: Uint8Array}>>().toBe<Uint8Array>();
expectTypeOf<ValueOfDeep<{regexp: RegExp}>>().toBe<RegExp>();
expectTypeOf<ValueOfDeep<{constructor: typeof Date}>>().toBe<typeof Date>();

// Objects with no keys do not contribute a value.
expectTypeOf<ValueOfDeep<{}>>().toBe<never>();
expectTypeOf<ValueOfDeep<{empty: {}}>>().toBe<never>();
expectTypeOf<ValueOfDeep<{empty: object}>>().toBe<never>();

// Optional properties keep the implicit `undefined`, like `ValueOf`.
expectTypeOf<ValueOfDeep<{optional?: 1; required: 2}>>().toBe<1 | undefined | 2>();
expectTypeOf<ValueOfDeep<{optional?: {nested: 1}}>>().toBe<1 | undefined>();

// Unions distribute.
expectTypeOf<ValueOfDeep<{a: 1} | {b: 2}>>().toBe<1 | 2>();
expectTypeOf<ValueOfDeep<{value: string | null | undefined | {b: 1}}>>().toBe<string | null | undefined | 1>();

// A circular reference stops at the repeated type.
type Node = {
	value: string;
	parent: Node;
};
expectTypeOf<ValueOfDeep<Node>>().toBe<string>();

type Tree = {
	name: string;
	children: Tree[];
};
expectTypeOf<ValueOfDeep<Tree>>().toBe<string>();

type First = {
	second: Second;
	value: 1;
};
type Second = {
	first: First;
	value: 2;
};
expectTypeOf<ValueOfDeep<First>>().toBe<1 | 2>();

// A recursive union stops as a whole instead of exploring every ordering of its members.
type Chain =
	| {kind: 'a'; next?: Chain; value: {nested: 1}}
	| {kind: 'b'; next?: Chain; value: {nested: 2}}
	| {kind: 'c'; next?: Chain; value: {nested: 3}}
	| {kind: 'd'; next?: Chain; value: {nested: 4}}
	| {kind: 'e'; next?: Chain; value: {nested: 5}}
	| {kind: 'f'; next?: Chain; value: {nested: 6}}
	| {kind: 'g'; next?: Chain; value: {nested: 7}};
expectTypeOf<ValueOfDeep<Chain>>().toBe<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | undefined>();

type RecursiveTuple =
	| ['a', RecursiveTuple?]
	| ['b', RecursiveTuple?]
	| ['c', RecursiveTuple?]
	| ['d', RecursiveTuple?]
	| ['e', RecursiveTuple?]
	| ['f', RecursiveTuple?]
	| ['g', RecursiveTuple?];
expectTypeOf<ValueOfDeep<RecursiveTuple>>().toBe<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | undefined>();

// Mutually assignable objects can still have different leaf values.
expectTypeOf<ValueOfDeep<{value?: 1; child?: {value?: 1; extra?: 2}}>>().toBe<1 | 2 | undefined>();

type Loop = {
	next: Loop;
};
expectTypeOf<ValueOfDeep<Loop>>().toBe<never>();

// Index signatures.
expectTypeOf<ValueOfDeep<Record<string, {value: 1}>>>().toBe<1>();
expectTypeOf<ValueOfDeep<Record<string, string>>>().toBe<string>();
expectTypeOf<ValueOfDeep<Record<number, {value: 1}>>>().toBe<1>();

// A recursive JSON value reads as its primitives.
expectTypeOf<ValueOfDeep<JsonValue>>().toBe<string | number | boolean | null>();

// Symbol keys are read.
declare const symbol: unique symbol;
expectTypeOf<ValueOfDeep<{[symbol]: {value: 1}; name: 'a'}>>().toBe<1 | 'a'>();

// Edge cases.
expectTypeOf<ValueOfDeep<any>>().toBe<any>();
expectTypeOf<ValueOfDeep<{value: any}>>().toBe<any>();
expectTypeOf<ValueOfDeep<Record<string, any>>>().toBe<any>();
expectTypeOf<ValueOfDeep<never>>().toBe<never>();
expectTypeOf<ValueOfDeep<{value: never}>>().toBe<never>();
expectTypeOf<ValueOfDeep<unknown>>().toBe<unknown>();
expectTypeOf<ValueOfDeep<{value: unknown}>>().toBe<unknown>();

// Reads deeper than `Paths`, whose `maxRecursionDepth` tops out at 10. The fixed cap here is 50.
type Range<Length extends number, Count extends unknown[] = []> =
	Count['length'] extends Length ? Count : Range<Length, [...Count, unknown]>;
type Nest<Value, Depth extends unknown[]> =
	Depth extends [unknown, ...infer Rest] ? Nest<{a: Value}, Rest> : Value;

type Depth13 = Nest<{value: 'deep'}, Range<13>>;
expectTypeOf<ValueOfDeep<Depth13>>().toBe<'deep'>();

type Depth49 = Nest<{value: 'deep'}, Range<49>>;
type Depth51 = Nest<{value: 'deep'}, Range<51>>;
expectTypeOf<ValueOfDeep<Depth49>>().toBe<'deep'>();
expectTypeOf<ValueOfDeep<Depth51>>().toBe<never>();

// A type that grows on every level stops at the cap instead of hitting TS2589.
type Wrapper<Value> = {value: Value; next: Wrapper<Wrapper<Value>>};
expectTypeOf<ValueOfDeep<Wrapper<string>>>().toBe<string>();

// The type works in a generic signature.
declare function valueOfDeep<ObjectType>(value: ObjectType): ValueOfDeep<ObjectType>;
const inferred = valueOfDeep(config);
expectTypeOf(inferred).toBe<'red' | 12 | 24 | 'dark'>();
