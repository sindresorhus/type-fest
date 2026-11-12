import {expectTypeOf} from 'nz';
import type {FirstArrayElement, FixedLengthArray, LastArrayElement, Tagged, TupleOf, UnknownArray} from '../index.d.ts';

// Empty array
expectTypeOf<FirstArrayElement<[]>>().toBe<undefined>();
expectTypeOf<FirstArrayElement<readonly []>>().toBe<undefined>();

// Only required elements
expectTypeOf<FirstArrayElement<[number, string, boolean]>>().toBe<number>();
expectTypeOf<FirstArrayElement<readonly [number, string, boolean]>>().toBe<number>();
expectTypeOf<FirstArrayElement<[1]>>().toBe<1>();

// Required and optional elements
expectTypeOf<FirstArrayElement<[1, 2?, 3?]>>().toBe<1>();
expectTypeOf<FirstArrayElement<readonly [1, 2?]>>().toBe<1>();

// Only optional elements
expectTypeOf<FirstArrayElement<['a'?]>>().toBe<'a' | undefined>();
expectTypeOf<FirstArrayElement<readonly [{data: string[]}?]>>().toBe<{data: string[]} | undefined>();
expectTypeOf<FirstArrayElement<[string?, boolean?, bigint?]>>().toBe<string | undefined>();
expectTypeOf<FirstArrayElement<[undefined?]>>().toBe<undefined>();
expectTypeOf<FirstArrayElement<[null?]>>().toBe<null | undefined>();
expectTypeOf<FirstArrayElement<[any?]>>().toBe<any>();
expectTypeOf<FirstArrayElement<[unknown?]>>().toBe<unknown>();

// Explicit `undefined` in elements
expectTypeOf<FirstArrayElement<[(1 | undefined)?, 2?]>>().toBe<1 | undefined>();
expectTypeOf<FirstArrayElement<readonly [string | undefined]>>().toBe<string | undefined>();
expectTypeOf<FirstArrayElement<[undefined, 1]>>().toBe<undefined>();
expectTypeOf<FirstArrayElement<[null, 1]>>().toBe<null>();

// Other element types are returned unchanged
expectTypeOf<FirstArrayElement<[void]>>().toBe<void>();
expectTypeOf<FirstArrayElement<[void?]>>().toBe<void | undefined>();
expectTypeOf<FirstArrayElement<[symbol, 1]>>().toBe<symbol>();
expectTypeOf<FirstArrayElement<[1n, 1]>>().toBe<1n>();
expectTypeOf<FirstArrayElement<[() => void, 1]>>().toBe<() => void>();
expectTypeOf<FirstArrayElement<[readonly [1, 2], 1]>>().toBe<readonly [1, 2]>();
expectTypeOf<FirstArrayElement<[[1, 2], 1]>>().toBe<[1, 2]>();
expectTypeOf<FirstArrayElement<[{a: 1}, {b: 2}]>>().toBe<{a: 1}>();
expectTypeOf<FirstArrayElement<[`id-${number}`, string]>>().toBe<`id-${number}`>();
expectTypeOf<FirstArrayElement<[(value: string) => number, string]>>().toBe<(value: string) => number>();
expectTypeOf<FirstArrayElement<[string[], number[]]>>().toBe<string[]>();

// Rest element after the first element
expectTypeOf<FirstArrayElement<[1, ...string[]]>>().toBe<1>();
expectTypeOf<FirstArrayElement<readonly [1, 2, ...string[], 3]>>().toBe<1>();
expectTypeOf<FirstArrayElement<readonly [1, 2, 3, ...string[]]>>().toBe<1>();
expectTypeOf<FirstArrayElement<[1, ...string[], 2]>>().toBe<1>();
expectTypeOf<FirstArrayElement<[1, ...any[]]>>().toBe<1>();
expectTypeOf<FirstArrayElement<[unknown, ...never[]]>>().toBe<unknown>();
expectTypeOf<FirstArrayElement<[any, ...never[]]>>().toBe<any>();
expectTypeOf<FirstArrayElement<[never, ...never[]]>>().toBe<never>();
expectTypeOf<FirstArrayElement<[1, 2?, ...string[]]>>().toBe<1>();

// The first position cannot hold a rest value when an optional element comes before the rest element.
expectTypeOf<FirstArrayElement<[1?, ...string[]]>>().toBe<1 | undefined>();
expectTypeOf<FirstArrayElement<readonly [1?, 2?, ...bigint[]]>>().toBe<1 | undefined>();
expectTypeOf<FirstArrayElement<[1?, unknown?]>>().toBe<1 | undefined>();
expectTypeOf<FirstArrayElement<[1?, ...unknown[]]>>().toBe<1 | undefined>();
expectTypeOf<FirstArrayElement<[1?, ...never[]]>>().toBe<1 | undefined>();
expectTypeOf<FirstArrayElement<[1?, 2?, ...never[]]>>().toBe<1 | undefined>();
expectTypeOf<FirstArrayElement<readonly [undefined?, ...never[]]>>().toBe<undefined>();

// Rest element at the start
expectTypeOf<FirstArrayElement<[...string[], 1]>>().toBe<string | 1>();
expectTypeOf<FirstArrayElement<readonly [...bigint[], 1, 2]>>().toBe<bigint | 1>();
expectTypeOf<FirstArrayElement<[...Array<string | number>, boolean]>>().toBe<string | number | boolean>();
expectTypeOf<FirstArrayElement<[...never[]]>>().toBe<undefined>();
expectTypeOf<FirstArrayElement<[...never[], 1, 2]>>().toBe<1>();
expectTypeOf<FirstArrayElement<[...never[], never]>>().toBe<never>();
expectTypeOf<FirstArrayElement<[...string[], never]>>().toBe<string>();
expectTypeOf<FirstArrayElement<[...any[], 1]>>().toBe<any>();
expectTypeOf<FirstArrayElement<readonly [never, ...string[]]>>().toBe<never>();
expectTypeOf<FirstArrayElement<[...Array<string | undefined>, 1]>>().toBe<string | 1 | undefined>();
expectTypeOf<FirstArrayElement<[...Array<{id: number}>, never]>>().toBe<{id: number}>();

// Non-tuple arrays
expectTypeOf<FirstArrayElement<string[]>>().toBe<string | undefined>();
expectTypeOf<FirstArrayElement<readonly number[]>>().toBe<number | undefined>();
expectTypeOf<FirstArrayElement<ReadonlyArray<number | bigint>>>().toBe<number | bigint | undefined>();
expectTypeOf<FirstArrayElement<[...string[]]>>().toBe<string | undefined>();
expectTypeOf<FirstArrayElement<unknown[]>>().toBe<unknown>();
expectTypeOf<FirstArrayElement<any[]>>().toBe<any>();
expectTypeOf<FirstArrayElement<never[]>>().toBe<undefined>();
expectTypeOf<FirstArrayElement<readonly unknown[]>>().toBe<unknown>();
expectTypeOf<FirstArrayElement<Array<1 | 2>>>().toBe<1 | 2 | undefined>();
expectTypeOf<FirstArrayElement<UnknownArray>>().toBe<unknown>();

// Labelled tuples
expectTypeOf<FirstArrayElement<[x: number, y: string]>>().toBe<number>();
expectTypeOf<FirstArrayElement<readonly [x?: string, y?: number]>>().toBe<string | undefined>();
expectTypeOf<FirstArrayElement<[...rest: number[], last: string]>>().toBe<number | string>();
expectTypeOf<FirstArrayElement<readonly [head: string, ...tail: number[]]>>().toBe<string>();
expectTypeOf<FirstArrayElement<[x: 1, y?: 2]>>().toBe<1>();
expectTypeOf<FirstArrayElement<readonly [first: 'a', second: 'b', ...rest: boolean[]]>>().toBe<'a'>();
expectTypeOf<FirstArrayElement<[head: number, ...middle: string[], tail: boolean]>>().toBe<number>();
expectTypeOf<FirstArrayElement<readonly [...items: number[], tail: string]>>().toBe<number | string>();
expectTypeOf<FirstArrayElement<[head?: 'a', ...tail: string[]]>>().toBe<'a' | undefined>();

// Union elements
expectTypeOf<FirstArrayElement<['a' | 'b', 'c']>>().toBe<'a' | 'b'>();
expectTypeOf<FirstArrayElement<[...Array<'a' | 'b'>, 'c' | 'd']>>().toBe<'a' | 'b' | 'c' | 'd'>();

// Unions
expectTypeOf<FirstArrayElement<[1, 2] | [3, ...string[]]>>().toBe<1 | 3>();
expectTypeOf<FirstArrayElement<readonly [string, number] | bigint[]>>().toBe<string | bigint | undefined>();
expectTypeOf<FirstArrayElement<[] | [1]>>().toBe<1 | undefined>();
expectTypeOf<FirstArrayElement<['a'?] | [...Array<'b'>, 'c'] | readonly ['d', ...Array<'e'>]>>().toBe<'a' | undefined | 'b' | 'c' | 'd'>();
expectTypeOf<FirstArrayElement<never[] | [1]>>().toBe<1 | undefined>();
expectTypeOf<FirstArrayElement<any[] | [1]>>().toBe<any>();
expectTypeOf<FirstArrayElement<unknown[] | [1]>>().toBe<unknown>();
expectTypeOf<FirstArrayElement<[] | [1] | [2]>>().toBe<1 | 2 | undefined>();
expectTypeOf<FirstArrayElement<readonly [1, 2] | [] | readonly [3?]>>().toBe<1 | 3 | undefined>();
expectTypeOf<FirstArrayElement<readonly [1, 2] | readonly [3, ...string[]]>>().toBe<1 | 3>();
expectTypeOf<FirstArrayElement<[never] | [1]>>().toBe<1>();
expectTypeOf<FirstArrayElement<[any] | [1]>>().toBe<any>();
expectTypeOf<FirstArrayElement<[unknown] | [1]>>().toBe<unknown>();
expectTypeOf<FirstArrayElement<[1?] | [2?, 3?]>>().toBe<1 | 2 | undefined>();
expectTypeOf<FirstArrayElement<[] | unknown[]>>().toBe<unknown>();
expectTypeOf<FirstArrayElement<[] | string[]>>().toBe<string | undefined>();
expectTypeOf<FirstArrayElement<string[] | number[]>>().toBe<string | number | undefined>();
expectTypeOf<FirstArrayElement<readonly [1, ...string[]] | readonly [...number[], 2]>>().toBe<1 | number | 2>();

// Boundary cases
expectTypeOf<FirstArrayElement<any>>().toBe<any>();
expectTypeOf<FirstArrayElement<never>>().toBe<never>();

// Uninhabitable elements
expectTypeOf<FirstArrayElement<[never]>>().toBe<never>();
expectTypeOf<FirstArrayElement<[never, 1]>>().toBe<never>();
expectTypeOf<FirstArrayElement<[never?]>>().toBe<undefined>();
expectTypeOf<FirstArrayElement<[...never[], 2]>>().toBe<2>();
expectTypeOf<FirstArrayElement<[1, ...never[]]>>().toBe<1>();
expectTypeOf<FirstArrayElement<readonly [unknown]>>().toBe<unknown>();
expectTypeOf<FirstArrayElement<readonly [any]>>().toBe<any>();

// A length refinement on an ordinary array does not create tuple elements.
expectTypeOf<FirstArrayElement<string[] & {length: 3}>>().toBe<string | undefined>();
expectTypeOf<FirstArrayElement<readonly string[] & {readonly length: 3}>>().toBe<string | undefined>();
expectTypeOf<FirstArrayElement<never[] & {length: 3}>>().toBe<undefined>();
expectTypeOf<FirstArrayElement<unknown[] & {length: 3}>>().toBe<unknown>();
expectTypeOf<FirstArrayElement<any[] & {length: 3}>>().toBe<any>();
expectTypeOf<FirstArrayElement<readonly unknown[] & {readonly length: 3}>>().toBe<unknown>();

// Fixed-length arrays retain their declared tuple positions.
expectTypeOf<FirstArrayElement<FixedLengthArray<number, 3>>>().toBe<number>();
expectTypeOf<FirstArrayElement<Readonly<FixedLengthArray<string, 3>>>>().toBe<string>();
expectTypeOf<FirstArrayElement<FixedLengthArray<number, 0>>>().toBe<undefined>();
expectTypeOf<FirstArrayElement<FixedLengthArray<'item', 0 | 3>>>().toBe<'item' | undefined>();
expectTypeOf<FirstArrayElement<FixedLengthArray<unknown, 3>>>().toBe<unknown>();
expectTypeOf<FirstArrayElement<FixedLengthArray<any, 3>>>().toBe<any>();
expectTypeOf<FirstArrayElement<FixedLengthArray<never, 3>>>().toBe<never>();
expectTypeOf<FirstArrayElement<FixedLengthArray<'item', 1101>>>().toBe<'item'>();
expectTypeOf<FirstArrayElement<FixedLengthArray<string, 1>>>().toBe<string>();
expectTypeOf<FirstArrayElement<FixedLengthArray<number, -3>>>().toBe<undefined>();
expectTypeOf<FirstArrayElement<TupleOf<0>>>().toBe<undefined>();
expectTypeOf<FirstArrayElement<TupleOf<1, 'x'>>>().toBe<'x'>();
expectTypeOf<FirstArrayElement<TupleOf<2, 'x'>>>().toBe<'x'>();
expectTypeOf<FirstArrayElement<TupleOf<3, 'x'>>>().toBe<'x'>();
expectTypeOf<FirstArrayElement<TupleOf<3>>>().toBe<unknown>();
expectTypeOf<FirstArrayElement<Readonly<TupleOf<3, number>>>>().toBe<number>();
expectTypeOf<FirstArrayElement<TupleOf<0, string>>>().toBe<undefined>();
expectTypeOf<FirstArrayElement<TupleOf<number, string>>>().toBe<string | undefined>();

// Long tuples
expectTypeOf<FirstArrayElement<['first', ...TupleOf<1100>]>>().toBe<'first'>();
expectTypeOf<FirstArrayElement<TupleOf<1100, 1>>>().toBe<1>();

// Readonly conversions keep the elements.
expectTypeOf<FirstArrayElement<Readonly<[]>>>().toBe<undefined>();
expectTypeOf<FirstArrayElement<Readonly<[1, 2]>>>().toBe<1>();

// Metadata on the array does not change its elements.
const labelledTuple = Object.assign([1, 2] as [1, 2], {label: 'row'});
expectTypeOf<FirstArrayElement<typeof labelledTuple>>().toBe<1>();
expectTypeOf<FirstArrayElement<Tagged<readonly ['a', 'b'], 'Row'>>>().toBe<'a'>();
expectTypeOf<FirstArrayElement<Tagged<readonly string[], 'Row'>>>().toBe<string | undefined>();
expectTypeOf<FirstArrayElement<Tagged<readonly [1?, 2?], 'Row'>>>().toBe<1 | undefined>();
expectTypeOf<FirstArrayElement<Tagged<readonly [1, ...string[]], 'Row'>>>().toBe<1>();
const optionalMetadataTuple: readonly ['first', 'last'] & {label?: string} = ['first', 'last'];
expectTypeOf<FirstArrayElement<typeof optionalMetadataTuple>>().toBe<'first'>();
// Known limitation: metadata hides the rest split for a tuple with a leading rest element.
expectTypeOf<FirstArrayElement<[...string[], 2] & {label: string}>>().toBe<unknown>();
expectTypeOf<FirstArrayElement<Tagged<readonly [...string[], 2], 'Row'>>>().toBe<unknown>();
expectTypeOf<FirstArrayElement<Tagged<readonly [...bigint[], 1, 2], 'Row'>>>().toBe<unknown>();

// Runtime parity
const values = ['a', 'b'] as const;
const first: FirstArrayElement<typeof values> = values[0];
expectTypeOf(first).toBe<'a'>();

const strings: string[] = [];
const firstString: FirstArrayElement<typeof strings> = strings.at(0);
expectTypeOf(firstString).toBe<string | undefined>();

declare const requiredTuple: [1, 2?];
const requiredTupleFirst: FirstArrayElement<typeof requiredTuple> = requiredTuple[0];
expectTypeOf(requiredTupleFirst).toBe<1>();

declare const optionalTuple: [string?, number?];
const optionalTupleFirst: FirstArrayElement<typeof optionalTuple> = optionalTuple[0];
expectTypeOf(optionalTupleFirst).toBe<string | undefined>();

declare const leadingRestTuple: [...string[], 1];
const leadingRestTupleFirst: FirstArrayElement<typeof leadingRestTuple> = leadingRestTuple[0];
expectTypeOf(leadingRestTupleFirst).toBe<string | 1>();

declare const readonlyTuple: readonly ['a', 'b'];
const readonlyTupleFirst: FirstArrayElement<typeof readonlyTuple> = readonlyTuple[0];
expectTypeOf(readonlyTupleFirst).toBe<'a'>();

const emptyTuple: readonly [] = [];
const emptyFirst: FirstArrayElement<typeof emptyTuple> = emptyTuple.at(0);
expectTypeOf(emptyFirst).toBe<undefined>();

const readonlyNumbers: readonly number[] = [];
const numbersFirst: FirstArrayElement<typeof readonlyNumbers> = readonlyNumbers.at(0);
expectTypeOf(numbersFirst).toBe<number | undefined>();

// @ts-expect-error The second element is not the first element.
const secondAsFirst: FirstArrayElement<readonly ['a', 'b']> = 'b';
// @ts-expect-error A required first element excludes other numbers.
const otherNumberAsFirst: FirstArrayElement<[1, 2]> = 2;
// @ts-expect-error A leading rest first position cannot be a boolean.
const booleanAsFirst: FirstArrayElement<[...string[], 1]> = true;
// @ts-expect-error The optional first position does not include the second element.
const secondOfOptional: FirstArrayElement<[1?, 2?]> = 2;

// Inference through a function
declare function firstOf<const V extends readonly unknown[]>(array: V): FirstArrayElement<V>;
expectTypeOf(firstOf(['foo', 'bar'])).toBe<'foo'>();
expectTypeOf(firstOf([{id: 1}])).toBe<{readonly id: 1}>();
expectTypeOf(firstOf([])).toBe<undefined>();
expectTypeOf(firstOf([1, 2])).toBe<1>();
expectTypeOf(firstOf([undefined, 1])).toBe<undefined>();
expectTypeOf(firstOf([1] as const)).toBe<1>();
expectTypeOf(firstOf(['a', 2, true])).toBe<'a'>();
expectTypeOf(firstOf(['foo', 'bar'] as const)).toBe<'foo'>();
expectTypeOf(firstOf([1, 2] as [1?, 2?])).toBe<1 | undefined>();
expectTypeOf(firstOf([1, 'a'] as readonly [number, ...string[]])).toBe<number>();

const names: string[] = [];
expectTypeOf(firstOf(names)).toBe<string | undefined>();

const optionalNames: [string?, number?] = [];
expectTypeOf(firstOf(optionalNames)).toBe<string | undefined>();

declare function firstOfRest<const Values extends readonly unknown[]>(...values: Values): FirstArrayElement<Values>;
expectTypeOf(firstOfRest('a', 'b')).toBe<'a'>();
expectTypeOf(firstOfRest()).toBe<undefined>();

// A generic first element resolves in both directions.
function _readGenericFirst<Value>(value: FirstArrayElement<readonly [Value, ...number[]]>): Value {
	return value;
}

function _constructGenericFirst<Value>(value: Value): FirstArrayElement<readonly [Value, boolean?]> {
	return value;
}

function _readGenericFixedFirst<Value>(value: FirstArrayElement<FixedLengthArray<Value, 3>>): Value {
	return value;
}

function _readRequiredWithOptionalTail<Value>(value: FirstArrayElement<readonly [Value, boolean?]>): Value {
	return value;
}

function _readOptionalFirst<Value>(value: FirstArrayElement<readonly [Value?, ...number[]]>): Value | undefined {
	return value;
}

function _writeOptionalFirst<Value>(value: Value | undefined): FirstArrayElement<readonly [Value?, ...number[]]> {
	return value;
}

function _readLeadingRest<Value>(value: FirstArrayElement<readonly [...Value[], string]>): Value | string {
	return value;
}

function _writeLeadingRest<Value>(value: Value | string): FirstArrayElement<readonly [...Value[], string]> {
	return value;
}

function _readOptionalOnly<Value>(value: FirstArrayElement<readonly [Value?, Value?]>): Value | undefined {
	return value;
}

function _writeOptionalOnly<Value>(value: Value | undefined): FirstArrayElement<readonly [Value?, Value?]> {
	return value;
}

function _readTwoRequired<First, Second>(value: FirstArrayElement<readonly [First, Second]>): First {
	return value;
}

// The first and last elements agree on one-element tuples.
expectTypeOf<FirstArrayElement<[1]>>().toBe<LastArrayElement<[1]>>();
expectTypeOf<FirstArrayElement<['a'?]>>().toBe<LastArrayElement<['a'?]>>();
expectTypeOf<FirstArrayElement<readonly [never]>>().toBe<LastArrayElement<readonly [never]>>();
expectTypeOf<FirstArrayElement<readonly [undefined]>>().toBe<LastArrayElement<readonly [undefined]>>();
expectTypeOf<FirstArrayElement<[1, ...never[]]>>().toBe<LastArrayElement<[1, ...never[]]>>();
expectTypeOf<FirstArrayElement<FixedLengthArray<string, 1>>>().toBe<LastArrayElement<FixedLengthArray<string, 1>>>();

// @ts-expect-error The input must be an array.
type UnknownFirstInput = FirstArrayElement<unknown>;

// @ts-expect-error The input must be an array.
type StringFirstInput = FirstArrayElement<string>;

// @ts-expect-error The input must be an array.
type ObjectFirstInput = FirstArrayElement<{length: 0}>;

// @ts-expect-error The input must be an array.
type ArrayLikeFirstInput = FirstArrayElement<ArrayLike<string>>;

// @ts-expect-error The input must be an array.
type MapFirstInput = FirstArrayElement<Map<string, number>>;

// @ts-expect-error The input must be an array.
type SetFirstInput = FirstArrayElement<Set<string>>;

// @ts-expect-error The input must be an array.
type NullFirstInput = FirstArrayElement<null>;

// @ts-expect-error The input must be an array.
type UndefinedFirstInput = FirstArrayElement<undefined>;

// @ts-expect-error The input must be an array.
type MixedUnionFirstInput = FirstArrayElement<string[] | string>;
