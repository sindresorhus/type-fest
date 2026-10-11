import {expectTypeOf} from 'nz';
import type {SomeExtend} from '../source/some-extend.d.ts';
import type {TupleOf} from '../source/tuple-of.d.ts';
import type {UnknownArray} from '../source/unknown-array.d.ts';

expectTypeOf<SomeExtend<[], number>>().toBe<false>();
expectTypeOf<SomeExtend<[1, '2', '3'], number>>().toBe<true>(); // First element matches
expectTypeOf<SomeExtend<['1', '2', 3], number>>().toBe<true>(); // Last element matches
expectTypeOf<SomeExtend<['1', 2, '3'], number>>().toBe<true>(); // Mid element matches
expectTypeOf<SomeExtend<[number, '1', 2, `${number}`], string>>().toBe<true>(); // Multiple elements match
expectTypeOf<SomeExtend<[1, 2, 3], number>>().toBe<true>(); // All elements match
// Trailing rest element
expectTypeOf<SomeExtend<['2', 1, ...string[]], number>>().toBe<true>(); // Non-rest element matches
expectTypeOf<SomeExtend<['2', '1', ...number[]], number>>().toBe<true>(); // Rest element matches
// Leading rest element
expectTypeOf<SomeExtend<[...Array<1 | -1>, number, string], string>>().toBe<true>(); // Non-rest element matches
expectTypeOf<SomeExtend<[...Array<1 | -1>, string, string], number>>().toBe<true>(); // Rest element matches
// Middle rest element
expectTypeOf<SomeExtend<[string, number, ...string[], string, string], number>>().toBe<true>(); // Non-rest element before rest element matches
expectTypeOf<SomeExtend<[string, string, ...string[], number, string], number>>().toBe<true>(); // Non-rest element after rest element matches
expectTypeOf<SomeExtend<[string, ...number[], string, string], number>>().toBe<true>(); // Rest element matches

expectTypeOf<SomeExtend<['1', '2', '3'], number>>().toBe<false>();
expectTypeOf<SomeExtend<[1, 2, 3], string>>().toBe<false>();
expectTypeOf<SomeExtend<[1, 2, 3, ...string[]], bigint>>().toBe<false>();
expectTypeOf<SomeExtend<[...bigint[], true, false], number | string>>().toBe<false>();
expectTypeOf<SomeExtend<[1, 2, ...number[], '1', 3], true>>().toBe<false>();
expectTypeOf<SomeExtend<['1', '2', ...bigint[]], number>>().toBe<false>();

// Union targets
expectTypeOf<SomeExtend<['1', '2', 3], number | bigint>>().toBe<true>();
expectTypeOf<SomeExtend<[1, false, 0, true, 1], boolean>>().toBe<true>();
expectTypeOf<SomeExtend<[...bigint[], number, string], number | string>>().toBe<true>();

// Union type elements
expectTypeOf<boolean>().toBe<SomeExtend<[number, string | number], string>>();
expectTypeOf<boolean>().toBe<SomeExtend<[false, false, false, boolean], true>>();
expectTypeOf<boolean>().toBe<SomeExtend<[true, true, boolean, true], false>>();
expectTypeOf<SomeExtend<[1, 2n, number | bigint, 3n], string>>().toBe<false>();
expectTypeOf<SomeExtend<['1', '2', number | bigint, '3'], number | bigint>>().toBe<true>();
expectTypeOf<boolean>().toBe<SomeExtend<[true, false, true, ...Array<string | undefined>], string | number>>();
expectTypeOf<SomeExtend<['foo', ...Array<number | string>, 'bar'], bigint | undefined>>().toBe<false>();

// Readonly arrays
expectTypeOf<SomeExtend<readonly [], number>>().toBe<false>();
expectTypeOf<SomeExtend<readonly ['1', 2, '3'], number>>().toBe<true>();
expectTypeOf<SomeExtend<readonly ['1', '2', '3'], number>>().toBe<false>();
expectTypeOf<SomeExtend<readonly ['^', ...number[], '$'], number>>().toBe<true>();

// Optional elements
// If `exactOptionalPropertyTypes` were disabled, the target type would need an additional `| undefined` for a successful match.
// For example, `SomeExtend<['1'?, 2?], number>` would return `boolean`. To make it return `true`, the target type must be `number | undefined`.
expectTypeOf<SomeExtend<['1'?, '2'?, 3?], number>>().toBe<true>();
expectTypeOf<boolean>().toBe<SomeExtend<['1'?, (2 | undefined)?], number>>();
expectTypeOf<SomeExtend<[1?, '2'?, 3?], string | undefined>>().toBe<true>();
expectTypeOf<SomeExtend<[1, 2?, 3?, ...string[]], string>>().toBe<true>();
expectTypeOf<boolean>().toBe<SomeExtend<['1', '2'?, '3'?, ...Array<number | undefined>], number>>();
expectTypeOf<SomeExtend<[1?, 2?, 3?, ...boolean[]], string>>().toBe<false>();

// Labelled tuples
expectTypeOf<SomeExtend<[x: string, y: number], string>>().toBe<true>();
expectTypeOf<SomeExtend<[x?: number, y?: number], string>>().toBe<false>();
expectTypeOf<SomeExtend<[x?: string, y?: string, ...rest: number[]], number>>().toBe<true>();
expectTypeOf<SomeExtend<[...rest: number[], z: string], string>>().toBe<true>();
expectTypeOf<SomeExtend<[...rest: number[], z: string], bigint>>().toBe<false>();

// Non-tuple arrays
expectTypeOf<SomeExtend<string[], string>>().toBe<true>();
expectTypeOf<boolean>().toBe<SomeExtend<Array<string | number>, number>>();
expectTypeOf<boolean>().toBe<SomeExtend<ReadonlyArray<string | undefined>, string>>();
expectTypeOf<SomeExtend<[...readonly boolean[]], string>>().toBe<false>();

// Unions
expectTypeOf<SomeExtend<['1', '2', 3] | ['4', 5, '6'], number>>().toBe<true>(); // Both `true`
expectTypeOf<SomeExtend<[1, 2, 3] | ['4', '5', '6'], bigint>>().toBe<false>(); // Both `false`
expectTypeOf<boolean>().toBe<SomeExtend<['1', '2', '3'] | ['1', '2', 3], number>>(); // One `true`, one `false`
expectTypeOf<boolean>().toBe<SomeExtend<[true, false] | [false, boolean], true>>(); // One `true`, one `boolean`
expectTypeOf<boolean>().toBe<SomeExtend<[false, false] | [boolean, false], true>>(); // One `false`, one `boolean`

expectTypeOf<SomeExtend<[string, string, ...number[]] | [number, string, ...number[]], number>>().toBe<true>();
expectTypeOf<SomeExtend<readonly [(number | bigint)?, ...string[]] | [0, 'a', 'b'] | [...ReadonlyArray<string | number>, 1], true>>().toBe<false>();
expectTypeOf<boolean>().toBe<SomeExtend<number[] | [...ReadonlyArray<string | number>, number], string>>();
expectTypeOf<boolean>().toBe<SomeExtend<readonly number[] | [...rest: string[], l1: string, l2: string] | [(number | string)?, string?, ...string[]], number>>();

// Boundary cases
expectTypeOf<SomeExtend<[], any>>().toBe<false>();
expectTypeOf<SomeExtend<[], never>>().toBe<false>();
// `never` target
expectTypeOf<SomeExtend<[number, string, boolean], never>>().toBe<false>();
expectTypeOf<SomeExtend<[number, string, never], never>>().toBe<true>();
expectTypeOf<boolean>().toBe<SomeExtend<[number, string, any], never>>();
// `any` target
expectTypeOf<SomeExtend<[number], any>>().toBe<true>();
expectTypeOf<SomeExtend<[never], any>>().toBe<true>();
expectTypeOf<SomeExtend<[any], any>>().toBe<true>();
// `never` and `any` elements
expectTypeOf<SomeExtend<[1, 2, never], string>>().toBe<false>();
expectTypeOf<boolean>().toBe<SomeExtend<[1, 2, any], string>>();
// `never[]` and `any[]` elements
expectTypeOf<boolean>().toBe<SomeExtend<[1, 2, ...any[]], string>>();
expectTypeOf<boolean>().toBe<SomeExtend<[1, 2, ...any[], 3, 4], string>>();
expectTypeOf<boolean>().toBe<SomeExtend<[...any[], 3, 4], string>>();
expectTypeOf<boolean>().toBe<SomeExtend<any[], number>>();
expectTypeOf<SomeExtend<[1, 2, ...never[]], string>>().toBe<false>();
expectTypeOf<SomeExtend<[1, 2, ...never[], 3, 4], string>>().toBe<false>();
expectTypeOf<SomeExtend<[...never[], 1, 2], string>>().toBe<false>();
expectTypeOf<SomeExtend<never[], number>>().toBe<false>();

// === strictNever: false ===
type NonStrictNeverSomeExtend<TArray extends UnknownArray, Type> = SomeExtend<TArray, Type, {strictNever: false}>;

// `never` elements
expectTypeOf<NonStrictNeverSomeExtend<[1, 2, never], string>>().toBe<true>();
// `never[]` elements
expectTypeOf<NonStrictNeverSomeExtend<[1, 2, ...never[]], string>>().toBe<true>();
expectTypeOf<NonStrictNeverSomeExtend<[1, 2, ...never[], 3, 4], string>>().toBe<true>();
expectTypeOf<NonStrictNeverSomeExtend<[...never[], 1, 2], string>>().toBe<true>();
expectTypeOf<NonStrictNeverSomeExtend<never[], number>>().toBe<true>();

expectTypeOf<SomeExtend<any, never>>().toBe<false>();
expectTypeOf<SomeExtend<never, any>>().toBe<false>();

// Recursion depth at which the previous non-tail-recursive implementation started to fail.
// Not tested at the usual depth of 999, because collapsing an array that long costs over a million type instantiations.
type TwoHundredZeroes = TupleOf<200, '0'>;
expectTypeOf<SomeExtend<TwoHundredZeroes, number>>().toBe<false>();

// Elements that follow a rest element are collapsed by a separate branch.
expectTypeOf<SomeExtend<[...number[], ...TwoHundredZeroes], bigint>>().toBe<false>();
