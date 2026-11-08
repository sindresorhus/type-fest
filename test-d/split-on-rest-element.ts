import {expectTypeOf} from 'nz';
import type {SplitOnRestElement, TupleOf, UnknownArray} from '../index.d.ts';

// Fixed tuples (No rest element)
expectTypeOf<[[], [], []]>().toBe<SplitOnRestElement<[]>>();
expectTypeOf<[[1], [], []]>().toBe<SplitOnRestElement<[1]>>();
expectTypeOf<[[1, 2, 3], [], []]>().toBe<SplitOnRestElement<[1, 2, 3]>>();
expectTypeOf<readonly [['a', 'b', 'c'], [], []]>().toBe<SplitOnRestElement<readonly ['a', 'b', 'c']>>();

// Rest elements (true variadic)
expectTypeOf<[[1], number[], []]>().toBe<SplitOnRestElement<[1, ...number[]]>>();
expectTypeOf<[[], string[], []]>().toBe<SplitOnRestElement<[...string[]]>>();
expectTypeOf<[[], never[], []]>().toBe<SplitOnRestElement<[...never[]]>>();
expectTypeOf<[[1], number[], [2]]>().toBe<SplitOnRestElement<[1, ...number[], 2]>>();
expectTypeOf<[['a'], string[], ['b']]>().toBe<SplitOnRestElement<['a', ...string[], 'b']>>();
expectTypeOf<[[], boolean[], [string]]>().toBe<SplitOnRestElement<[...boolean[], string]>>();
expectTypeOf<[[], string[], ['x', 'y']]>().toBe<SplitOnRestElement<[...string[], 'x', 'y']>>();
expectTypeOf<[[], never[], [1]]>().toBe<SplitOnRestElement<[...never[], 1]>>();
expectTypeOf<[[undefined], boolean[], [null]]>().toBe<SplitOnRestElement<[undefined, ...boolean[], null]>>();
expectTypeOf<[[void], never[], [1]]>().toBe<SplitOnRestElement<[void, ...never[], 1]>>();
expectTypeOf<[[null], any[], [null]]>().toBe<SplitOnRestElement<[null, ...any[], null]>>();
expectTypeOf<[[], Array<{id: string}>, [number]]>().toBe<SplitOnRestElement<[...Array<{id: string}>, number]>>();
expectTypeOf<[[1], Array<readonly [string, number]>, [2]]>().toBe<SplitOnRestElement<[1, ...Array<readonly [string, number]>, 2]>>();

// Generic arrays
expectTypeOf<[[], string[], []]>().toBe<SplitOnRestElement<string[]>>();
expectTypeOf<[[], number[], []]>().toBe<SplitOnRestElement<number[]>>();
expectTypeOf<[[], unknown[], []]>().toBe<SplitOnRestElement<unknown[]>>();
expectTypeOf<[[], any[], []]>().toBe<SplitOnRestElement<any[]>>();

// Unions
expectTypeOf<[[], Array<string | number>, [boolean]]>().toBe<SplitOnRestElement<[...Array<string | number>, boolean]>>();
expectTypeOf<[[1, 2], [], []] | [[3, 4], [], []]>().toBe<SplitOnRestElement<[1, 2] | [3, 4]>>();
expectTypeOf<[[1], number[], []] | [['foo'], string[], []]>().toBe<SplitOnRestElement<[1, ...number[]] | ['foo', ...string[]]>>();

// Preserve optional
expectTypeOf<[[0, 1?, 2?], never[], []]>().toBe<SplitOnRestElement<[0, 1?, 2?, ...never[]]>>();
expectTypeOf<[[number?], string[], []]>().toBe<SplitOnRestElement<[number?, ...string[]]>>();
expectTypeOf<[[number, boolean?], string[], []]>().toBe<SplitOnRestElement<[number, boolean?, ...string[]]>>();

// Remove optional
expectTypeOf<[[0, 1, 2], never[], []]>().toBe<SplitOnRestElement<[0, 1?, 2?, ...never[]], {preserveOptionalModifier: false}>>();
expectTypeOf<[[number], string[], []]>().toBe<SplitOnRestElement<[number?, ...string[]], {preserveOptionalModifier: false}>>();
expectTypeOf<[[number, boolean], string[], []]>().toBe<SplitOnRestElement<[number, boolean?, ...string[]], {preserveOptionalModifier: false}>>();

// Readonly
expectTypeOf<readonly [[], [], []]>().toBe<SplitOnRestElement<readonly []>>();
expectTypeOf<readonly [[number], [], []] | [[string], [], []]>().toBe<SplitOnRestElement<readonly [number] | [string]>>();
expectTypeOf<readonly [[], number[], [2]]>().toBe<SplitOnRestElement<readonly [...number[], 2]>>();
expectTypeOf<readonly [[1], string[], [2]] | readonly [['foo'?], string[], []]>().toBe<SplitOnRestElement<readonly [1, ...string[], 2] | readonly ['foo'?, ...string[]]>>();
expectTypeOf<readonly [[1, 2, 3], [], []]>().toBe<SplitOnRestElement<readonly [1, 2, 3]>>();

// Edge: `never` / `any`
expectTypeOf<any>().toBe<SplitOnRestElement<any>>();
expectTypeOf<never>().toBe<SplitOnRestElement<never>>();

// Long tuples
type FiftyZeroes = TupleOf<50, '0'>;
expectTypeOf<[FiftyZeroes, number[], FiftyZeroes]>().toBe<SplitOnRestElement<[...FiftyZeroes, ...number[], ...FiftyZeroes]>>();

type FourHundredNinetyNineZeroes = TupleOf<499, '0'>;
expectTypeOf<[FourHundredNinetyNineZeroes, number[], FourHundredNinetyNineZeroes]>().toBe<SplitOnRestElement<[...FourHundredNinetyNineZeroes, ...number[], ...FourHundredNinetyNineZeroes]>>();

// Generic instantiations
type Assignability<_T extends UnknownArray> = unknown;
type TestAssignability<T extends UnknownArray> = Assignability<SplitOnRestElement<T>>;

// The rest part is the input verbatim, so a readonly-only rest array must not bake `readonly` in, the way the neighbouring case does not.
declare const readonlyRestOnly: SplitOnRestElement<readonly [...string[]]>;
expectTypeOf(readonlyRestOnly).toBe<readonly [[], string[], []]>();

// A required prefix stays readable while options controlling later optional elements are generic.
function _readRequiredPrefix<Value, Options extends {preserveOptionalModifier?: boolean}>(value: SplitOnRestElement<[Value, string?], Options>): Value {
	return value[0][0];
}

function _readReadonlyPrefix<Value, Options extends {preserveOptionalModifier?: boolean}>(value: SplitOnRestElement<readonly [Value, string?], Options>): Value {
	return value[0][0];
}

// Required tuples can be copied without changing explicit values or the mutability of their parts.
expectTypeOf<SplitOnRestElement<readonly [never, any, unknown, undefined]>>().toBe<readonly [[never, any, unknown, undefined], [], []]>();
expectTypeOf<SplitOnRestElement<[1, 2], {preserveOptionalModifier: false}>>().toBe<[[1, 2], [], []]>();
expectTypeOf<SplitOnRestElement<string[] & {length: 3}>>().toBe<[[], string[], []]>();
expectTypeOf<SplitOnRestElement<TupleOf<500, 'value'>>>().toBe<[TupleOf<500, 'value'>, [], []]>();
// @ts-expect-error The input must be an array.
type UnknownSplitInput = SplitOnRestElement<unknown>;

function _makeRequiredParts<Value, Options extends {preserveOptionalModifier?: boolean}>(value: Value): SplitOnRestElement<readonly [Value, Value], Options> {
	return [[value, value], [], []];
}

declare const requiredParts: SplitOnRestElement<readonly [1, 2]>;
requiredParts[0][1] = 2;
// @ts-expect-error The outer tuple retains the input's readonly modifier.
requiredParts[0] = [1, 2];

// Required positions retain their order across complete groups and the remaining positions at either end.
expectTypeOf<SplitOnRestElement<readonly [1, 2, 3, 4, 5, 6, ...boolean[], 7, 8, 9, 10, 11, 12]>>()
	.toBe<readonly [[1, 2, 3, 4, 5, 6], boolean[], [7, 8, 9, 10, 11, 12]]>();

// The required prefix cannot absorb an optional position or change its explicitly declared undefined.
type SentinelPrefix = [never, any, unknown, undefined, null];
expectTypeOf<SplitOnRestElement<readonly [...SentinelPrefix, (Date | undefined)?, ...RegExp[]]>>()
	.toBe<readonly [[...SentinelPrefix, (Date | undefined)?], RegExp[], []]>();
expectTypeOf<SplitOnRestElement<readonly [...SentinelPrefix, (Date | undefined)?, ...RegExp[]], {preserveOptionalModifier: false}>>()
	.toBe<readonly [[...SentinelPrefix, Date | undefined], RegExp[], []]>();
expectTypeOf<SplitOnRestElement<[...unknown[], ...SentinelPrefix]>>().toBe<[[], unknown[], SentinelPrefix]>();

// Distribution keeps separate prefixes, suffixes, rest types, and outer readonly modifiers.
expectTypeOf<SplitOnRestElement<readonly [1, 2, 3, 4, 5, ...string[]] | [...number[], 6, 7, 8, 9, 10]>>()
	.toBe<readonly [[1, 2, 3, 4, 5], string[], []] | [[], number[], [6, 7, 8, 9, 10]]>();

// A variable argument list can have more fixed positions than a one-position traversal can visit.
type LongPrefix = TupleOf<550, 'before'>;
type LongSuffix = TupleOf<550, 'after'>;
type LongArgumentList = readonly [...LongPrefix, ...number[], ...LongSuffix];
expectTypeOf<SplitOnRestElement<LongArgumentList>>().toBe<readonly [LongPrefix, number[], LongSuffix]>();

function _readGroupedPrefix<Value, Options extends {preserveOptionalModifier?: boolean}>(parts: SplitOnRestElement<readonly [1, 2, 3, 4, Value, string?, ...unknown[]], Options>): Value {
	return parts[0][4];
}

function _readGroupedSuffix<Value, Options extends {preserveOptionalModifier?: boolean}>(parts: SplitOnRestElement<readonly [...unknown[], string, number, boolean, Date, Value], Options>): Value {
	return parts[2][4];
}

function _constructGroupedParts<Value>(value: Value): SplitOnRestElement<readonly [1, 2, 3, 4, Value, ...string[]]> {
	return [[1, 2, 3, 4, value], [], []];
}
