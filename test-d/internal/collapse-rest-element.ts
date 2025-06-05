import {expectType} from 'tsd';
import type {CollapseRestElement} from '../../source/internal/array.d.ts';

// Simple arrays
expectType<[]>({} as CollapseRestElement<[]>);
expectType<[string]>({} as CollapseRestElement<[string]>);
expectType<[1, 2, 'a', 'b']>({} as CollapseRestElement<[1, 2, 'a', 'b']>);
expectType<[string | null, number | bigint, boolean]>({} as CollapseRestElement<[string | null, number | bigint, boolean]>);

// Optional elements
// If `exactOptionalPropertyTypes` were disabled, there would have been an additional `| undefined` for optional elements.
// For example, `CollapseRestElement<[string?, number?]>` would have returned `[string | undefined, number | undefined]`.
expectType<[string]>({} as CollapseRestElement<[string?]>);
expectType<[1, 2, 'a' | 'b', 'c' | 'd']>({} as CollapseRestElement<[1, 2, ('a' | 'b')?, ('c' | 'd')?]>);
expectType<[string, number, boolean]>({} as CollapseRestElement<[string?, number?, boolean?]>);
expectType<[string | null | undefined, number | undefined, boolean | null]>(
	{} as CollapseRestElement<[(string | null | undefined)?, (number | undefined)?, (boolean | null)?]>,
);

// Trailing rest element
expectType<[1, 2, number]>({} as CollapseRestElement<[1, 2, ...number[]]>);
expectType<[1, 2, number | undefined]>({} as CollapseRestElement<[1, 2, ...Array<number | undefined>]>);

// Trailing rest element with optional elements
expectType<[true, false, boolean]>({} as CollapseRestElement<[true, false?, ...boolean[]]>);
expectType<[string, string, number]>({} as CollapseRestElement<[string?, string?, ...number[]]>);
expectType<[1, 2, number | undefined]>({} as CollapseRestElement<[1?, 2?, ...Array<number | undefined>]>);

// Leading rest element (these cannot have any optional elements)
expectType<[number, 1, 2]>({} as CollapseRestElement<[...number[], 1, 2]>);
expectType<[string | undefined, bigint, bigint]>({} as CollapseRestElement<[...Array<string | undefined>, bigint, bigint]>);

// Rest element in the middle (these cannot have any optional elements)
expectType<[1, 2, number, 3, 4]>({} as CollapseRestElement<[1, 2, ...number[], 3, 4]>);
expectType<[string | number, number | undefined, boolean]>({} as CollapseRestElement<[string | number, ...Array<number | undefined>, boolean]>);

// Readonly arrays
expectType<[string]>({} as CollapseRestElement<readonly [string]>);
expectType<[1, 2, 'a' | 'b', 'c' | 'd']>({} as CollapseRestElement<readonly [1, 2, ('a' | 'b')?, ('c' | 'd')?]>);
expectType<[1, 2, number]>({} as CollapseRestElement<readonly [1, 2, ...number[]]>);
expectType<[1, 2, number]>({} as CollapseRestElement<[1, 2, ...readonly number[]]>);
expectType<[1, 2, number | undefined]>({} as CollapseRestElement<readonly [1?, 2?, ...ReadonlyArray<number | undefined>]>);
expectType<[1, 2, number, 3, 4]>({} as CollapseRestElement<readonly [1, 2, ...readonly number[], 3, 4]>);

// Non-tuple arrays
expectType<[string]>({} as CollapseRestElement<string[]>);
expectType<[string | number | {p: string}]>({} as CollapseRestElement<Array<string | number | {p: string}>>);
expectType<[string | undefined]>({} as CollapseRestElement<ReadonlyArray<string | undefined>>);
expectType<[boolean]>({} as CollapseRestElement<[...readonly boolean[]]>);

// `any` and `never` elements
expectType<[any]>({} as CollapseRestElement<any[]>);
expectType<[never]>({} as CollapseRestElement<never[]>);
expectType<[bigint, bigint, any]>({} as CollapseRestElement<[bigint, bigint, ...any[]]>);
expectType<[any, never, never]>({} as CollapseRestElement<[any, never, ...never[]]>);
expectType<[any, any, never]>({} as CollapseRestElement<[...any[], any, never]>);

// Labelled tuples
expectType<[string, number]>({} as CollapseRestElement<[x?: string, y?: number]>);
expectType<[number, number, string, number]>(
	{} as CollapseRestElement<readonly [x?: number, y?: number, z?: string, ...rest: number[]]>,
);

// Unions
expectType<[string, string, string] | [number, number, number]>(
	{} as CollapseRestElement<[string, string, ...string[]] | [number, number, ...number[]]>,
);
expectType<[string, number, boolean] | [string]>(
	{} as CollapseRestElement<[string, number, boolean] | string[]>,
);
expectType<[string, number, number] | [string, boolean, number] | [string, number | undefined, boolean, string]>(
	{} as CollapseRestElement<readonly [string, ...number[], number] | [string, boolean?, ...number[]] | readonly [string, (number | undefined)?, boolean?, string?]>,
);
expectType<[string] | [number, number, number] | [string, number, string]>(
	{} as CollapseRestElement<readonly string[] | [...rest: number[], l1: number, l2: number] | [string?, number?, ...string[]]>,
);

// Boundary cases
expectType<any>({} as CollapseRestElement<any>);
expectType<never>({} as CollapseRestElement<never>);
