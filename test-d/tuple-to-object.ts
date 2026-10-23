import {expectTypeOf} from 'nz';
import type {FixedLengthArray} from '../source/fixed-length-array.d.ts';
import type {TupleToObject} from '../source/tuple-to-object.d.ts';

// Tuples
expectTypeOf<{}>().toBe<TupleToObject<[]>>();
expectTypeOf<{0: number}>().toBe<TupleToObject<[number]>>();
expectTypeOf<{0: number; 1: string}>().toBe<TupleToObject<[number, string]>>();
expectTypeOf<{0: number | string; 1: {foo: string}}>().toBe<TupleToObject<[number | string, {foo: string}]>>();
expectTypeOf<{0: number; 1?: string}>().toBe<TupleToObject<[number, string?]>>();
expectTypeOf<{0?: number; 1?: string; 2?: boolean}>().toBe<TupleToObject<[number?, string?, boolean?]>>();

// Readonly tuples
expectTypeOf<{}>().toBe<TupleToObject<readonly []>>();
expectTypeOf<{readonly 0: number; readonly 1: string}>().toBe<TupleToObject<readonly [number, string]>>();
expectTypeOf<{readonly 0: number; readonly 1?: string; readonly 2?: boolean}>().toBe<TupleToObject<readonly [number, string?, boolean?]>>();

// Non-tuples
expectTypeOf<Record<number, number>>().toBe<TupleToObject<number[]>>();
expectTypeOf<Record<number, boolean>>().toBe<TupleToObject<[...boolean[]]>>();
expectTypeOf<{[x: number]: number | string | boolean; 0: number; 1: string}>().toBe<TupleToObject<[number, string, ...boolean[]]>>();
expectTypeOf<{[x: number]: number | string | boolean | undefined; 0: number; 1?: string}>().toBe<TupleToObject<[number, string?, ...boolean[]]>>();
expectTypeOf<Record<number, number | string | bigint>>().toBe<TupleToObject<[...number[], string, bigint]>>();
expectTypeOf<Record<number, never>>().toBe<TupleToObject<never[]>>();
expectTypeOf<Record<number, any>>().toBe<TupleToObject<any[]>>();

// Readonly non-tuples
expectTypeOf<Readonly<Record<number, number>>>().toBe<TupleToObject<readonly number[]>>();
expectTypeOf<{readonly [x: number]: number | string | boolean | undefined; readonly 0: number; readonly 1?: string}>().toBe<TupleToObject<readonly [number, string?, ...boolean[]]>>();
expectTypeOf<Readonly<Record<number, number | string | bigint>>>().toBe<TupleToObject<readonly [...number[], string, bigint]>>();

// Unions
expectTypeOf<{0: number} | {0: number; 1: string; 2: boolean}>().toBe<TupleToObject<[number] | [number, string, boolean]>>();
expectTypeOf<{0?: number; 1?: string} | {} | {[x: number]: number | string; 0: number; 1: string}>().toBe<TupleToObject<[number?, string?] | [] | [number, string, ...number[]]>>();
expectTypeOf<Record<number, number | undefined> | Record<number, string>>().toBe<TupleToObject<Array<number | undefined> | string[]>>();
expectTypeOf<Readonly<Record<number, string>> | {0: number; 1: string}>().toBe<TupleToObject<[number, string] | readonly string[]>>();
expectTypeOf<Record<number, number> | {readonly 0: string} | {readonly 0?: number}>().toBe<TupleToObject<readonly [string] | readonly [number?] | number[]>>();
expectTypeOf<Record<number, string | number> | {[x: number]: string | number | undefined; 0?: number; 1?: string}>().toBe<TupleToObject<[...number[], string] | [number?, string?, ...number[]]>>();

// Labeled tuples
expectTypeOf<{0: string; 1: number}>().toBe<TupleToObject<[x: string, y: number]>>();
expectTypeOf<{[x: number]: string | number; 0: string}>().toBe<TupleToObject<[first: string, ...rest: number[]]>>();
expectTypeOf<Record<number, string | number>>().toBe<TupleToObject<[...rest: number[], last: string]>>();
expectTypeOf<{readonly 0: string; readonly 1?: number}>().toBe<TupleToObject<readonly [name: string, age?: number]>>();

// Boundary types
expectTypeOf<any>().toBe<TupleToObject<any>>();
expectTypeOf<never>().toBe<TupleToObject<never>>();

// @ts-expect-error only works with arrays
type T = TupleToObject<{}>;
// A rest element in the middle widens the result to an index signature. Only the leading positions keep their own keys and types, because the positions after the rest element have no fixed index.
// A rest element in the middle widens the result to an index signature while the declared positions keep their own keys and types.
expectTypeOf<{[x: number]: string | number | boolean; 0: string}>().toBe<TupleToObject<[string, ...number[], boolean]>>();

// `FixedLengthArray` is a tuple of a known length with the mutating members removed, so its positions are still positions.
expectTypeOf<{0: string; 1: string; 2: string}>().toBe<TupleToObject<FixedLengthArray<string, 3>>>();

// Sentinel values retain their own positions, while ordinary arrays retain their index signature.
expectTypeOf<TupleToObject<readonly [never, any, unknown]>>().toBe<{readonly 0: never; readonly 1: any; readonly 2: unknown}>();
expectTypeOf<TupleToObject<readonly unknown[]>>().toBe<Readonly<Record<number, unknown>>>();
expectTypeOf<TupleToObject<readonly [string?, ...number[]]>>().toBe<{readonly [index: number]: string | number | undefined; readonly 0?: string}>();
// @ts-expect-error The input must be an array.
type UnknownTupleObject = TupleToObject<unknown>;

// A generic projection retains each concrete position without exposing array members.
function projectTuple<const Values extends readonly unknown[]>(values: Values): TupleToObject<Values> {
	return {...values};
}

const projected = projectTuple(['first', {id: 1}] as const);
expectTypeOf(projected).toBe<{readonly 0: 'first'; readonly 1: {readonly id: 1}}>();
expectTypeOf(projected[0]).toBe<'first'>();
expectTypeOf(projected[1].id).toBe<1>();
// @ts-expect-error The original readonly modifier is retained.
projected[0] = 'first';
// @ts-expect-error Array members are not part of the projected object.
type ArrayLengthProperty = typeof projected.length;
// @ts-expect-error A finite tuple does not acquire an unrestricted numeric index.
type OutOfBoundsProperty = (typeof projected)[2];

function _inputAssignable<Values extends readonly unknown[]>(values: Values): TupleToObject<Values> {
	return values;
}

// Unknown-length readonly inputs still expose numeric reads, with the usual out-of-bounds possibility.
const indexedProjection = projectTuple(['first', 'second'] as readonly string[]);
expectTypeOf(indexedProjection).toBe<Readonly<Record<number, string>>>();
expectTypeOf(indexedProjection[10]).toBe<string | undefined>();
