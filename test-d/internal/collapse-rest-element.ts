import {expectTypeOf} from 'nz';
import type {CollapseRestElement} from '../../source/internal/array.d.ts';

// Simple arrays
expectTypeOf<CollapseRestElement<[]>>().toBe<[]>();
expectTypeOf<CollapseRestElement<[string]>>().toBe<[string]>();
expectTypeOf<CollapseRestElement<[1, 2, 'a', 'b']>>().toBe<[1, 2, 'a', 'b']>();
expectTypeOf<CollapseRestElement<[string | null, number | bigint, boolean]>>().toBe<[string | null, number | bigint, boolean]>();

// Optional elements
// If `exactOptionalPropertyTypes` were disabled, there would have been an additional `| undefined` for optional elements.
// For example, `CollapseRestElement<[string?, number?]>` would have returned `[string | undefined, number | undefined]`.
expectTypeOf<CollapseRestElement<[string?]>>().toBe<[string]>();
expectTypeOf<CollapseRestElement<[1, 2, ('a' | 'b')?, ('c' | 'd')?]>>().toBe<[1, 2, 'a' | 'b', 'c' | 'd']>();
expectTypeOf<CollapseRestElement<[string?, number?, boolean?]>>().toBe<[string, number, boolean]>();
expectTypeOf<CollapseRestElement<[(string | null | undefined)?, (number | undefined)?, (boolean | null)?]>>().toBe<[string | null | undefined, number | undefined, boolean | null]>();

// Trailing rest element
expectTypeOf<CollapseRestElement<[1, 2, ...number[]]>>().toBe<[1, 2, number]>();
expectTypeOf<CollapseRestElement<[1, 2, ...Array<number | undefined>]>>().toBe<[1, 2, number | undefined]>();

// Trailing rest element with optional elements
expectTypeOf<CollapseRestElement<[true, false?, ...boolean[]]>>().toBe<[true, false, boolean]>();
expectTypeOf<CollapseRestElement<[string?, string?, ...number[]]>>().toBe<[string, string, number]>();
expectTypeOf<CollapseRestElement<[1?, 2?, ...Array<number | undefined>]>>().toBe<[1, 2, number | undefined]>();

// Leading rest element (these cannot have any optional elements)
expectTypeOf<CollapseRestElement<[...number[], 1, 2]>>().toBe<[number, 1, 2]>();
expectTypeOf<CollapseRestElement<[...Array<string | undefined>, bigint, bigint]>>().toBe<[string | undefined, bigint, bigint]>();

// Rest element in the middle (these cannot have any optional elements)
expectTypeOf<CollapseRestElement<[1, 2, ...number[], 3, 4]>>().toBe<[1, 2, number, 3, 4]>();
expectTypeOf<CollapseRestElement<[string | number, ...Array<number | undefined>, boolean]>>().toBe<[string | number, number | undefined, boolean]>();

// Readonly arrays
expectTypeOf<CollapseRestElement<readonly [string]>>().toBe<[string]>();
expectTypeOf<CollapseRestElement<readonly [1, 2, ('a' | 'b')?, ('c' | 'd')?]>>().toBe<[1, 2, 'a' | 'b', 'c' | 'd']>();
expectTypeOf<CollapseRestElement<readonly [1, 2, ...number[]]>>().toBe<[1, 2, number]>();
expectTypeOf<CollapseRestElement<[1, 2, ...readonly number[]]>>().toBe<[1, 2, number]>();
expectTypeOf<CollapseRestElement<readonly [1?, 2?, ...ReadonlyArray<number | undefined>]>>().toBe<[1, 2, number | undefined]>();
expectTypeOf<CollapseRestElement<readonly [1, 2, ...readonly number[], 3, 4]>>().toBe<[1, 2, number, 3, 4]>();

// Non-tuple arrays
expectTypeOf<CollapseRestElement<string[]>>().toBe<[string]>();
expectTypeOf<CollapseRestElement<Array<string | number | {p: string}>>>().toBe<[string | number | {p: string}]>();
expectTypeOf<CollapseRestElement<ReadonlyArray<string | undefined>>>().toBe<[string | undefined]>();
expectTypeOf<CollapseRestElement<[...readonly boolean[]]>>().toBe<[boolean]>();

// `any` and `never` elements
expectTypeOf<CollapseRestElement<any[]>>().toBe<[any]>();
expectTypeOf<CollapseRestElement<never[]>>().toBe<[never]>();
expectTypeOf<CollapseRestElement<[bigint, bigint, ...any[]]>>().toBe<[bigint, bigint, any]>();
expectTypeOf<CollapseRestElement<[any, never, ...never[]]>>().toBe<[any, never, never]>();
expectTypeOf<CollapseRestElement<[...any[], any, never]>>().toBe<[any, any, never]>();

// Labelled tuples
expectTypeOf<CollapseRestElement<[x?: string, y?: number]>>().toBe<[string, number]>();
expectTypeOf<CollapseRestElement<readonly [x?: number, y?: number, z?: string, ...rest: number[]]>>().toBe<[number, number, string, number]>();

// Unions
expectTypeOf<CollapseRestElement<[string, string, ...string[]] | [number, number, ...number[]]>>().toBe<[string, string, string] | [number, number, number]>();
expectTypeOf<CollapseRestElement<[string, number, boolean] | string[]>>().toBe<[string, number, boolean] | [string]>();
expectTypeOf<CollapseRestElement<readonly [string, ...number[], number] | [string, boolean?, ...number[]] | readonly [string, (number | undefined)?, boolean?, string?]>>().toBe<[string, number, number] | [string, boolean, number] | [string, number | undefined, boolean, string]>();
expectTypeOf<CollapseRestElement<readonly string[] | [...rest: number[], l1: number, l2: number] | [string?, number?, ...string[]]>>().toBe<[string] | [number, number, number] | [string, number, string]>();

// Boundary cases
expectTypeOf<CollapseRestElement<any>>().toBe<any>();
expectTypeOf<CollapseRestElement<never>>().toBe<never>();
