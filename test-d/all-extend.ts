import {expectTypeOf} from 'nz';
import type {AllExtend} from '../source/all-extend.d.ts';
import type {TupleOf} from '../source/tuple-of.d.ts';
import type {UnknownArray} from '../source/unknown-array.d.ts';

expectTypeOf<AllExtend<[], number>>().toBe<true>();
expectTypeOf<AllExtend<[1, 2, 3], number>>().toBe<true>();
expectTypeOf<AllExtend<[1, 2, 3], number | bigint>>().toBe<true>();
expectTypeOf<AllExtend<[true, false, true, false, boolean], boolean>>().toBe<true>();
expectTypeOf<AllExtend<[string, '1', '2', `${number}`], string>>().toBe<true>();
expectTypeOf<AllExtend<[1, 2, 3, ...number[]], number>>().toBe<true>();
expectTypeOf<AllExtend<[number, number, ...Array<1 | -1>], number>>().toBe<true>();
expectTypeOf<AllExtend<[...number[], number, string], number | string>>().toBe<true>();
expectTypeOf<AllExtend<['^', ...string[], '$'], string>>().toBe<true>();

expectTypeOf<AllExtend<[1, 2, '3'], number>>().toBe<false>();
expectTypeOf<AllExtend<['1', 2, 3], number>>().toBe<false>();
expectTypeOf<AllExtend<['1', '2', '3', 4, '5'], string>>().toBe<false>();
expectTypeOf<AllExtend<[1, 2, 3, ...string[]], number>>().toBe<false>();
expectTypeOf<AllExtend<[...bigint[], number, string], number | string>>().toBe<false>();
expectTypeOf<AllExtend<[1, 2, ...number[], '1', 3], number>>().toBe<false>();
expectTypeOf<AllExtend<[1, 2, ...string[], 3, 4], number>>().toBe<false>();

// Union type elements
expectTypeOf<boolean>().toBe<AllExtend<[string, string | number], string>>();
expectTypeOf<boolean>().toBe<AllExtend<[true, true, true, boolean], true>>();
expectTypeOf<boolean>().toBe<AllExtend<[false, false, boolean, false], false>>();
expectTypeOf<AllExtend<['1', '2', number | bigint, '3'], string>>().toBe<false>();
expectTypeOf<AllExtend<[1, 2, number | bigint, 3], number | bigint>>().toBe<true>();
expectTypeOf<boolean>().toBe<AllExtend<[1, 2, 3, ...Array<string | undefined>], string | number>>();
expectTypeOf<AllExtend<['foo', ...Array<string | undefined>, 'bar'], string | undefined>>().toBe<true>();

// Readonly arrays
expectTypeOf<AllExtend<readonly [], number>>().toBe<true>();
expectTypeOf<AllExtend<readonly [1, 2, 3], number>>().toBe<true>();
expectTypeOf<AllExtend<readonly [1, 2, '3'], number>>().toBe<false>();
expectTypeOf<AllExtend<readonly ['^', ...string[], '$'], string>>().toBe<true>();
expectTypeOf<AllExtend<readonly [number, ...readonly string[], number], string>>().toBe<false>();
expectTypeOf<AllExtend<readonly [...bigint[], number, string], number | string>>().toBe<false>();
expectTypeOf<AllExtend<readonly [...ReadonlyArray<string | undefined>, string, string], string | undefined>>().toBe<true>();

// Optional elements
// If `exactOptionalPropertyTypes` were disabled, the target type would need an additional `| undefined` for a successful match.
// For example, `AllExtend<[1?, 2?], number>` would return `boolean`. To make it return `true`, the target type must be `number | undefined`.
expectTypeOf<AllExtend<[1?, 2?, 3?], number>>().toBe<true>();
expectTypeOf<boolean>().toBe<AllExtend<[1?, (2 | undefined)?], number>>();
expectTypeOf<AllExtend<[1?, 2?, 3?], number | undefined>>().toBe<true>();
expectTypeOf<AllExtend<[1, 2?, 3?, ...number[]], number>>().toBe<true>();
expectTypeOf<boolean>().toBe<AllExtend<[1, 2?, 3?, ...Array<number | undefined>], number>>();
expectTypeOf<AllExtend<[1?, 2?, 3?, ...string[]], number>>().toBe<false>();

// Labelled tuples
expectTypeOf<AllExtend<[x: string, y: string], string>>().toBe<true>();
expectTypeOf<AllExtend<[x?: string, y?: number], string>>().toBe<false>();
expectTypeOf<AllExtend<[x?: number, y?: number, ...rest: number[]], number>>().toBe<true>();
expectTypeOf<AllExtend<[...rest: number[], z: string], number>>().toBe<false>();

// Non-tuple arrays
expectTypeOf<AllExtend<string[], string>>().toBe<true>();
expectTypeOf<boolean>().toBe<AllExtend<Array<string | number>, number>>();
expectTypeOf<boolean>().toBe<AllExtend<ReadonlyArray<string | undefined>, string>>();
expectTypeOf<AllExtend<[...readonly boolean[]], string>>().toBe<false>();

// Unions
expectTypeOf<AllExtend<[1, 2, 3] | [4, 5, 6], number>>().toBe<true>(); // Both `true`
expectTypeOf<AllExtend<[1, 2, '3'] | [4, 5, '6'], number>>().toBe<false>(); // Both `false`
expectTypeOf<boolean>().toBe<AllExtend<[1, 2, 3] | ['1', '2', 3], number>>(); // One `true`, one `false`
expectTypeOf<boolean>().toBe<AllExtend<[true, true] | [true, boolean], true>>(); // One `true`, one `boolean`
expectTypeOf<boolean>().toBe<AllExtend<[true, false] | [true, boolean], true>>(); // One `false`, one `boolean`

expectTypeOf<AllExtend<[string, string, ...string[]] | [number, number, ...number[]], number | string>>().toBe<true>();
expectTypeOf<AllExtend<readonly [(number | bigint)?, ...string[]] | [0, 'a', 'b'] | [...ReadonlyArray<string | number>, 1], string>>().toBe<false>();
expectTypeOf<boolean>().toBe<AllExtend<string[] | [...ReadonlyArray<string | number>, string], string>>();
expectTypeOf<boolean>().toBe<AllExtend<readonly number[] | [...rest: number[], l1: number, l2: number] | [number?, string?, ...string[]], number>>();

// Boundary cases
expectTypeOf<AllExtend<[], any>>().toBe<true>();
expectTypeOf<AllExtend<[], never>>().toBe<true>();
expectTypeOf<AllExtend<[1, 2, '3', true, false, string[], never], any>>().toBe<true>();
expectTypeOf<AllExtend<[any, any], any>>().toBe<true>();
expectTypeOf<AllExtend<[never, never], any>>().toBe<true>();
expectTypeOf<AllExtend<[never, 1], any>>().toBe<true>();
expectTypeOf<AllExtend<[1, never], any>>().toBe<true>();
expectTypeOf<AllExtend<unknown[], any>>().toBe<true>();
expectTypeOf<AllExtend<[1, 2], never>>().toBe<false>();
expectTypeOf<AllExtend<[never, never], never>>().toBe<true>();
expectTypeOf<AllExtend<[never, never, number], never>>().toBe<false>();
expectTypeOf<AllExtend<[number, never, never], never>>().toBe<false>();
expectTypeOf<AllExtend<[never, number, never, any, never], never>>().toBe<false>();
expectTypeOf<boolean>().toBe<AllExtend<[never, any, never, any], never>>();
expectTypeOf<boolean>().toBe<AllExtend<[1, 2, any], number>>();
expectTypeOf<AllExtend<[1, 2, never], number>>().toBe<false>();
expectTypeOf<AllExtend<[1, 2, ...never[]], number>>().toBe<false>();

expectTypeOf<boolean>().toBe<AllExtend<[1, 2, ...any[]], number>>();
expectTypeOf<boolean>().toBe<AllExtend<[...any[], 1, 2], number>>();
expectTypeOf<boolean>().toBe<AllExtend<['a', 'b', ...any[], Uppercase<string>, `${number}`], string>>();
expectTypeOf<AllExtend<[1, 2, ...string[]], any>>().toBe<true>();
expectTypeOf<AllExtend<[...number[], never, never], any>>().toBe<true>();
expectTypeOf<AllExtend<['a', 'b', ...any[], 1, 2], any>>().toBe<true>();
expectTypeOf<AllExtend<[never, ...never[], never], any>>().toBe<true>();
expectTypeOf<AllExtend<[never, never, ...number[]], never>>().toBe<false>();
expectTypeOf<AllExtend<[never, ...never[], never], never>>().toBe<true>();
expectTypeOf<AllExtend<[...never[], never, string], never>>().toBe<false>();
expectTypeOf<boolean>().toBe<AllExtend<[never, ...any[], never], never>>();

// === strictNever: false ===
type NonStrictNeverAllExtend<TArray extends UnknownArray, Type> = AllExtend<TArray, Type, {strictNever: false}>;

expectTypeOf<NonStrictNeverAllExtend<[1, 2, never], number>>().toBe<true>();
expectTypeOf<NonStrictNeverAllExtend<[1, 2, ...never[]], number>>().toBe<true>();
expectTypeOf<NonStrictNeverAllExtend<[...never[], 'a', 'b'], string>>().toBe<true>();
expectTypeOf<NonStrictNeverAllExtend<[never, never], never>>().toBe<true>();
expectTypeOf<NonStrictNeverAllExtend<[never, ...never[], never], any>>().toBe<true>();
expectTypeOf<NonStrictNeverAllExtend<[1, 2, never, ...never[]], any>>().toBe<true>();
expectTypeOf<NonStrictNeverAllExtend<[never, number], never>>().toBe<false>();
expectTypeOf<boolean>().toBe<NonStrictNeverAllExtend<[never, any, never, any], never>>();

expectTypeOf<AllExtend<any, never>>().toBe<false>();
expectTypeOf<AllExtend<never, any>>().toBe<false>();

// Recursion depth at which the previous non-tail-recursive implementation started to fail.
// Not tested at the usual depth of 999, because collapsing an array that long costs over a million type instantiations.
type TwoHundredZeroes = TupleOf<200, '0'>;
expectTypeOf<AllExtend<TwoHundredZeroes, string>>().toBe<true>();

// Elements that follow a rest element are collapsed by a separate branch.
expectTypeOf<AllExtend<[...number[], ...TwoHundredZeroes], string | number>>().toBe<true>();
