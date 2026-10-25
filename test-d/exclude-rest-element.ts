import {expectTypeOf} from 'nz';
import type {ExcludeRestElement, TupleOf, UnknownArray} from '../index.d.ts';

// Basic static tuples (No rest element)
expectTypeOf<[]>().toBe<ExcludeRestElement<[]>>();
expectTypeOf<[1]>().toBe<ExcludeRestElement<[1]>>();
expectTypeOf<[1, 2, 3]>().toBe<ExcludeRestElement<[1, 2, 3]>>();
expectTypeOf<readonly ['a', 'b']>().toBe<ExcludeRestElement<readonly ['a', 'b']>>();

// Leading rest element
expectTypeOf<[1]>().toBe<ExcludeRestElement<[...string[], 1]>>();
expectTypeOf<['a', 'b']>().toBe<ExcludeRestElement<[...number[], 'a', 'b']>>();
expectTypeOf<[true]>().toBe<ExcludeRestElement<[...any[], true]>>();
expectTypeOf<['end']>().toBe<ExcludeRestElement<[...never[], 'end']>>();
expectTypeOf<[2, 3]>().toBe<ExcludeRestElement<[...unknown[], 2, 3]>>();

// Middle rest element
expectTypeOf<['a', 'z']>().toBe<ExcludeRestElement<['a', ...string[], 'z']>>();
expectTypeOf<['x', true]>().toBe<ExcludeRestElement<['x', ...boolean[], true]>>();
expectTypeOf<['x', 'y']>().toBe<ExcludeRestElement<['x', ...any[], 'y']>>();
expectTypeOf<['x', 'y']>().toBe<ExcludeRestElement<['x', ...readonly number[], 'y']>>();

// Trailing rest element
expectTypeOf<[1, 2]>().toBe<ExcludeRestElement<[1, 2, ...string[]]>>();
expectTypeOf<['foo']>().toBe<ExcludeRestElement<['foo', ...Array<'bar'>]>>();
expectTypeOf<[number]>().toBe<ExcludeRestElement<[number, ...number[]]>>();

// Only rest element
expectTypeOf<[]>().toBe<ExcludeRestElement<string[]>>();
expectTypeOf<readonly []>().toBe<ExcludeRestElement<readonly number[]>>();
expectTypeOf<readonly []>().toBe<ExcludeRestElement<readonly [...boolean[]]>>();
expectTypeOf<[]>().toBe<ExcludeRestElement<[...string[]]>>();

// Optional & mixed optional
expectTypeOf<[string?, boolean?]>().toBe<ExcludeRestElement<[string?, boolean?, ...number[]]>>();
expectTypeOf<[number, boolean?]>().toBe<ExcludeRestElement<[number, boolean?, ...number[]]>>();
expectTypeOf<[1?]>().toBe<ExcludeRestElement<[1?, ...string[]]>>();

// Unions
expectTypeOf<[1] | [2]>().toBe<ExcludeRestElement<[1, ...string[]] | [2, ...number[]]>>();
expectTypeOf<['end'] | ['start']>().toBe<ExcludeRestElement<[...boolean[], 'end'] | ['start', ...string[]]>>();

// Readonly
expectTypeOf<readonly ['done']>().toBe<ExcludeRestElement<readonly [...number[], 'done']>>();
expectTypeOf<readonly [1, 2]>().toBe<ExcludeRestElement<readonly [1, ...string[], 2]>>();

// Nested Arrays
expectTypeOf<[[1, 2], [3, 4]]>().toBe<ExcludeRestElement<[[1, 2], ...number[], [3, 4]]>>();
expectTypeOf<[['a'], ['z']]>().toBe<ExcludeRestElement<[['a'], ...string[], ['z']]>>();

// Edge: `never` / `any`
expectTypeOf<any>().toBe<ExcludeRestElement<any>>();
expectTypeOf<never>().toBe<ExcludeRestElement<never>>();

// Long tuples
type FiftyZeroes = TupleOf<50, '0'>;
expectTypeOf<FiftyZeroes>().toBe<ExcludeRestElement<[...FiftyZeroes, ...number[]]>>();

type NineHundredNinetyNineZeroes = TupleOf<999, '0'>;
expectTypeOf<NineHundredNinetyNineZeroes>().toBe<ExcludeRestElement<[...NineHundredNinetyNineZeroes, ...number[]]>>();

// Generic instantiations
type Assignability<_T extends UnknownArray> = unknown;
type TestAssignability<T extends UnknownArray> = Assignability<ExcludeRestElement<T>>;

// `readonly` is decided per union member, so a readonly member stays readonly even when the union also has a mutable one.
declare const unionWithReadonly: ExcludeRestElement<[1, 2] | readonly []>;
expectTypeOf(unionWithReadonly).toBe<[1, 2] | readonly []>();

declare const unionOfReadonly: ExcludeRestElement<readonly [1, 2] | readonly [3]>;
expectTypeOf(unionOfReadonly).toBe<readonly [1, 2] | readonly [3]>();

// Fixed optional positions keep their modifiers and declared undefined values.
expectTypeOf<ExcludeRestElement<readonly [string?, boolean?, ...number[]]>>().toBe<readonly [string?, boolean?]>();
expectTypeOf<ExcludeRestElement<[number, (string | undefined)?, ...boolean[]]>>().toBe<[number, (string | undefined)?]>();
expectTypeOf<ExcludeRestElement<readonly [string, number?]>>().toBe<readonly [string, number?]>();

// Only the rest is discarded; fixed values and their order remain intact.
expectTypeOf<ExcludeRestElement<[unknown, ...never[], any]>>().toBe<[unknown, any]>();
expectTypeOf<ExcludeRestElement<readonly [Date, ...unknown[], RegExp, boolean]>>().toBe<readonly [Date, RegExp, boolean]>();
expectTypeOf<ExcludeRestElement<[...number[], void]>>().toBe<[void]>();
expectTypeOf<ExcludeRestElement<readonly [readonly [1, 2], ...string[], readonly [3]]>>().toBe<readonly [readonly [1, 2], readonly [3]]>();
expectTypeOf<ExcludeRestElement<unknown[]>>().toBe<[]>();
expectTypeOf<ExcludeRestElement<readonly never[]>>().toBe<readonly []>();

// Readonly and optionality are restored independently for each union member.
expectTypeOf<ExcludeRestElement<readonly [1?, ...string[]] | [2, ...number[], 3] | readonly [4]>>()
	.toBe<readonly [1?] | [2, 3] | readonly [4]>();
expectTypeOf<ExcludeRestElement<readonly unknown[] | [1, ...never[]]>>().toBe<readonly [] | [1]>();
expectTypeOf<ExcludeRestElement<readonly [...number[], ...FiftyZeroes]>>().toBe<Readonly<FiftyZeroes>>();

// Results remain usable as arrays before the concrete input shape is known.
function _excludeFromGeneric<Array_ extends UnknownArray>(value: ExcludeRestElement<Array_>): UnknownArray {
	return value;
}

declare function withoutRest<Array_ extends UnknownArray>(value: Array_): ExcludeRestElement<Array_>;
declare const readonlyWithRest: readonly [string, ...number[], boolean];
expectTypeOf(withoutRest(readonlyWithRest)).toBe<readonly [string, boolean]>();

// A fixed callback parameter tuple has no variable rest to remove.
type FixedCallbackArguments = readonly [request: {readonly id: string}, retries: number, enabled: boolean, context: Date, audit?: RegExp, marker?: string | undefined];
expectTypeOf<ExcludeRestElement<FixedCallbackArguments>>().toBe<FixedCallbackArguments>();
expectTypeOf<ExcludeRestElement<string[] & {length: 3}>>().toBe<[]>();

function _fixedPair<Value>(value: Value): ExcludeRestElement<readonly [Value, number?]> {
	return [value];
}

function _readFixedPair<Value>(values: ExcludeRestElement<readonly [Value, number?]>): Value {
	return values[0];
}

const fixedArgumentSnapshot = withoutRest([{id: 'request'}, 3, true] as const);
expectTypeOf(fixedArgumentSnapshot).toBe<readonly [{readonly id: 'request'}, 3, true]>();
// @ts-expect-error An otherwise valid argument cannot replace a readonly position.
fixedArgumentSnapshot[1] = 3;

// The cached result remains readable as the original constrained tuple subtype.
function _readFixedSubtype<Values extends readonly [string, number]>(values: ExcludeRestElement<Values>): Values {
	return values;
}

function _readOptionalSubtype<Values extends readonly [string, number?]>(values: ExcludeRestElement<Values>): Values {
	return values;
}

// Finite copies preserve element sentinels, optionality and each member's readonly modifier.
expectTypeOf<ExcludeRestElement<readonly [unknown, any?, never?] | [undefined, void?]>>()
	.toBe<readonly [unknown, any?, never?] | [undefined, void?]>();
expectTypeOf<ExcludeRestElement<readonly [never]>>().toBe<readonly [never]>();
// Refining an array's length does not give its spread copy fixed tuple positions.
expectTypeOf<ExcludeRestElement<readonly string[] & {readonly length: 3}>>().toBe<readonly []>();
